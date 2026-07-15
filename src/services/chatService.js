/**
 * chatService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Frontend API layer for the AI chat assistant.
 * Communicates with the NestJS backend at /chat endpoint.
 * The Gemini API key is never exposed to the browser.
 *
 * Base URL: http://localhost:3000 (NestJS backend)
 */

const BASE_URL = "http://localhost:3000";

/**
 * @typedef {Object} ConversationTurn
 * @property {"user"|"model"|"assistant"} role
 * @property {string} content
 */

/**
 * @typedef {Object} ChatPayload
 * @property {string}             message       - User's latest message
 * @property {ConversationTurn[]} conversation  - Prior turns for context
 * @property {string|null}        childId       - Optional child ID
 */

/**
 * Send a chat message to the AI backend and receive a reply.
 * Automatically includes JWT access token from localStorage.
 *
 * @param {ChatPayload} payload
 * @returns {Promise<string>} AI reply text (may contain Markdown)
 * @throws {Error} On network failure or non-200 response
 */
export async function sendChatMessage({ message, conversation = [], childId = null }) {
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 30_000); // 30 s timeout

  try {
    // Get JWT token from localStorage (set by AuthContext after login)
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await fetch(`${BASE_URL}/chat`, {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body:    JSON.stringify({ message, conversation, childId }),
      signal:  controller.signal,
    });

    if (!response.ok) {
      // Try to parse the NestJS error response
      let detail = `Server error ${response.status}`;
      try {
        const errJson = await response.json();
        detail = errJson.message || errJson.error || detail;
      } catch {
        // ignore JSON parse errors
      }

      // Handle specific status codes
      if (response.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      if (response.status === 403) {
        throw new Error('Access denied. This feature is only available for verified parents.');
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few minutes.');
      }

      throw new Error(detail);
    }

    const data = await response.json();
    return data.reply;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

