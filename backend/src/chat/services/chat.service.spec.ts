import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ContextBuilderService } from './context-builder.service';
import { AIProviderService } from './ai-provider.service';

describe('ChatService', () => {
  let service: ChatService;
  let prismaService: PrismaService;
  let contextBuilder: ContextBuilderService;
  let aiProvider: AIProviderService;

  const mockPrismaService = {
    parent: {
      findUnique: jest.fn(),
    },
    aISession: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    aIConversationMessage: {
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockContextBuilder = {
    retrieveContext: jest.fn(),
  };

  const mockAIProvider = {
    generateReply: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ContextBuilderService, useValue: mockContextBuilder },
        { provide: AIProviderService, useValue: mockAIProvider },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    prismaService = module.get<PrismaService>(PrismaService);
    contextBuilder = module.get<ContextBuilderService>(ContextBuilderService);
    aiProvider = module.get<AIProviderService>(AIProviderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should throw ForbiddenException if parent profile not found', async () => {
      mockPrismaService.parent.findUnique.mockResolvedValue(null);

      await expect(
        service.sendMessage('user-123', 'Hello', [], undefined),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should retrieve context and generate AI reply', async () => {
      const mockParent = {
        id: 'parent-123',
        userId: 'user-123',
        verificationStatus: 'APPROVED',
      };

      const mockContext = { parentProfile: { name: 'Test Parent' } };
      const mockReply = 'Hello! How can I help you?';

      mockPrismaService.parent.findUnique.mockResolvedValue(mockParent);
      mockContextBuilder.retrieveContext.mockResolvedValue(mockContext);
      mockAIProvider.generateReply.mockResolvedValue(mockReply);

      const result = await service.sendMessage('user-123', 'Hello', [], undefined);

      expect(mockPrismaService.parent.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        select: { id: true, userId: true, verificationStatus: true },
      });
      expect(mockContextBuilder.retrieveContext).toHaveBeenCalledWith('parent-123', undefined);
      expect(mockAIProvider.generateReply).toHaveBeenCalledWith('Hello', [], mockContext);
      expect(result).toBe(mockReply);
    });

    it('should pass childId to context builder when provided', async () => {
      const mockParent = { id: 'parent-123', userId: 'user-123', verificationStatus: 'APPROVED' };

      mockPrismaService.parent.findUnique.mockResolvedValue(mockParent);
      mockContextBuilder.retrieveContext.mockResolvedValue({});
      mockAIProvider.generateReply.mockResolvedValue('Reply');

      await service.sendMessage('user-123', 'Hello', [], 'child-456');

      expect(mockContextBuilder.retrieveContext).toHaveBeenCalledWith('parent-123', 'child-456');
    });
  });
});
