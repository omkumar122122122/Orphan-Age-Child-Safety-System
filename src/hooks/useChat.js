/**
 * useChat.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Custom hook that manages the full chatbot state:
 *   - Session conversation history (user + model turns)
 *   - Loading / typing indicator state
 *   - Error state with retry capability
 *   - Send message action
 *   - Clear conversation action
 *
 * Keeps conversation history in memory for the session lifetime.
 * The history is passed to the backend on each request so Gemini
 * can maintain multi-turn context.
 */

import { useState, useCallback, useRef } from "react";
import { sendChatMessage } from "../services/chatService";

/**
 * @typedef {Object} Message
 * @property {string}            id        - Unique message ID
 * @property {"user"|"assistant"} role     - Sender role
 * @property {string}            content   - Message text (Markdown)
 * @property {Date}              timestamp - When the message was created
 * @property {boolean}           [error]   - True if this is an error message
 */

/** Generate a collision-resistant ID for each message. */
const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/**
 * @param {Object}      options
 * @param {string|null} options.parentId  - Parent ID for personalised AI context
 * @param {string|null} options.childId   - Child ID for personalised AI context
 */
export function useChat({ parentId = null, childId = null } = {}) {
  /** @type {[Message[], Function]} */
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(/** @type {string|null} */ (null));

  /**
   * Ref stores the last user message so the retry action can re-send it
   * without requiring the user to type it again.
   */
  const lastUserMessageRef = useRef(/** @type {string|null} */ (null));

  /**
   * Build the conversation history array expected by the backend.
   * We convert from internal {role:"assistant"} to {role:"model"} here.
   *
   * @param {Message[]} msgs
   * @returns {{ role: string; content: string }[]}
   */
  const buildHistory = (msgs) =>
    msgs
      .filter((m) => !m.error)
      .map((m) => ({
        role:    m.role === "assistant" ? "model" : "user",
        content: m.content,
      }));

  /**
   * Core send function — adds the user message to state, calls the API,
   * and appends the assistant reply (or an error message).
   *
   * @param {string} text - User's message text
   */
  const send = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      lastUserMessageRef.current = trimmed;

      // Append user message immediately
      const userMsg = /** @type {Message} */ ({
        id:        makeId(),
        role:      "user",
        content:   trimmed,
        timestamp: new Date(),
      });

      setMessages((prev) => {
        const updated = [...prev, userMsg];

        // Fire async API call after state update
        (async () => {
          setIsLoading(true);
          try {
            const reply = await sendChatMessage({
              message:      trimmed,
              conversation: buildHistory(updated),
              parentId,
              childId,
            });

            const assistantMsg = /** @type {Message} */ ({
              id:        makeId(),
              role:      "assistant",
              content:   reply,
              timestamp: new Date(),
            });
            setMessages((curr) => [...curr, assistantMsg]);
          } catch (err) {
            setError(err.message ?? "Something went wrong. Please try again.");
          } finally {
            setIsLoading(false);
          }
        })();

        return updated;
      });
    },
    [isLoading, parentId, childId]
  );

  /**
   * Retry the last failed message.
   * Removes the error state and re-sends the previous user message.
   */
  const retry = useCallback(() => {
    if (lastUserMessageRef.current) {
      setError(null);
      // Remove last user message from history so it isn't duplicated
      setMessages((prev) => prev.slice(0, -1));
      send(lastUserMessageRef.current);
    }
  }, [send]);

  /** Clear the entire conversation and reset all state. */
  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
    lastUserMessageRef.current = null;
  }, []);

  return {
    messages,
    isLoading,
    error,
    send,
    retry,
    clearConversation,
  };
}
