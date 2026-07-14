/**
 * chatService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Frontend API layer for the AI chat assistant.
 * Communicates ONLY with the local FastAPI backend — the Gemini API key
 * is never exposed to the browser.
 *
 * Base URL: http://localhost:8000/api
 */

const BASE_URL = "http://localhost:8000/api";

/**
 * @typedef {Object} ConversationTurn
 * @property {"user"|"model"} role
 * @property {string} content
 */

/**
 * @typedef {Object} ChatPayload
 * @property {string}             message       - User's latest message
 * @property {ConversationTurn[]} conversation  - Prior turns for context
 * @property {string|null}        parentId      - Optional parent ID
 * @property {string|null}        childId       - Optional child ID
 */

/**
 * Send a chat message to the AI backend and receive a reply.
 *
 * @param {ChatPayload} payload
 * @returns {Promise<string>} AI reply text (may contain Markdown)
 * @throws {Error} On network failure or non-200 response
 */
export async function sendChatMessage({ message, conversation = [], parentId = null, childId = null }) {
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 30_000); // 30 s timeout

  try {
    const response = await fetch(`${BASE_URL}/chat`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ message, conversation, parentId, childId }),
      signal:  controller.signal,
    });

    if (!response.ok) {
      // Try to parse the FastAPI error detail
      let detail = `Server error ${response.status}`;
      try {
        const errJson = await response.json();
        detail = errJson.detail ?? detail;
      } catch {
        // ignore JSON parse errors
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
