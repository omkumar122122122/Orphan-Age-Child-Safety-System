import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { SYSTEM_PROMPT, buildContextString } from '../prompts/system-prompt';
import { RetrievedContext } from '../interfaces/context.interface';

/**
 * AIProviderService
 * ────────────────────────────────────────────────────────────────────────────
 * Handles AI generation using Google Gemini API.
 * Abstracted to support future providers (OpenAI, AWS Bedrock, etc.)
 */
@Injectable()
export class AIProviderService {
  private readonly logger = new Logger(AIProviderService.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: string;
  private readonly temperature: number;
  private readonly maxTokens: number;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is missing. Add it to .env\n' +
          'Get a free key at: https://aistudio.google.com/app/apikey',
      );
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.configService.get<string>('GEMINI_MODEL', 'gemini-2.0-flash-exp');
    this.temperature = parseFloat(this.configService.get<string>('AI_TEMPERATURE', '0.7'));
    this.maxTokens = parseInt(this.configService.get<string>('AI_MAX_TOKENS', '1024'), 10);

    this.logger.log(`AI Provider initialized: ${this.model}`);
  }

  /**
   * Generate AI reply using Gemini with full context.
   *
   * @param userMessage Latest user message
   * @param conversation Prior conversation history
   * @param context Retrieved database context
   * @returns AI-generated reply (Markdown)
   */
  async generateReply(
    userMessage: string,
    conversation: Array<{ role: string; content: string }>,
    context: RetrievedContext,
  ): Promise<string> {
    try {
      // Build context string from retrieved data
      const contextBlock = buildContextString(context);

      // Combine system prompt + context
      let systemInstruction = SYSTEM_PROMPT;
      if (contextBlock) {
        systemInstruction += '\n\n' + contextBlock;
      }

      // Initialize model
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        systemInstruction,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
        generationConfig: {
          temperature: this.temperature,
          maxOutputTokens: this.maxTokens,
        },
      });

      // Convert history to Gemini format (user / model roles)
      const history = conversation.map((turn) => ({
        role: turn.role === 'assistant' || turn.role === 'model' ? 'model' : 'user',
        parts: [{ text: turn.content }],
      }));

      const chat = model.startChat({ history });

      // Call Gemini API
      const result = await chat.sendMessage(userMessage);

      if (!result.response.candidates || result.response.candidates.length === 0) {
        throw new InternalServerErrorException('Gemini returned no candidates — content may have been blocked');
      }

      const candidate = result.response.candidates[0];

      // Check for safety blocks
      if (candidate.finishReason === 'SAFETY') {
        throw new InternalServerErrorException(
          'Response blocked by Gemini safety filters. Please rephrase your question.',
        );
      }

      const reply = result.response.text().trim();

      this.logger.debug(`AI reply generated: ${reply.length} chars`);
      return reply;
    } catch (error) {
      this.logger.error('Gemini API error:', error);

      if (error.message?.includes('API key')) {
        throw new InternalServerErrorException('AI service configuration error');
      }

      throw new InternalServerErrorException('AI service temporarily unavailable. Please try again.');
    }
  }
}
