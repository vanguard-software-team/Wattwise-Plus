import { useState, useEffect } from "react";
import { getUserEmail } from "../service/api.jsx";

const BASE_URL = `${import.meta.env.VITE_AGENT_API_URL}`;
const MANAGE_KEY = `${import.meta.env.VITE_AGENT_MANAGE_KEY}`;
const CURRENT_USER = getUserEmail();

`${import.meta.env.VITE_BACKEND_HOST}`;

export const useChat = (activeChatId, userId = CURRENT_USER) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch messages for the active chat
  const fetchMessages = async (sessionId) => {
    if (!sessionId) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        user_id: userId,
        session_id: sessionId,
        manage_key: MANAGE_KEY,
      });

      const response = await fetch(`${BASE_URL}/conversation?${params}`);
      const data = await response.json();

      if (data.success && data.data.conversation) {
        const formattedMessages = data.data.conversation.map((msg, index) => ({
          id: msg.event_id || index,
          content: msg.message,
          sender: msg.author === "user" ? "user" : "assistant",
          timestamp: new Date(msg.timestamp * 1000), // Convert timestamp to proper Date object
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (content) => {
    if (!activeChatId || !content.trim()) return;

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    try {
      const requestBody = {
        manage_key: MANAGE_KEY,
        query: content.trim(),
        session_id: activeChatId,
        user_id: userId,
      };

      console.log("Sending chat request:", {
        url: `${BASE_URL}/chat`,
        body: requestBody,
      });

      const response = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response not ok:", response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.success) {
        const assistantMessage = {
          id: Date.now() + 1,
          content: data.data.response,
          sender: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        console.error("API returned error:", data);
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Add error message with more details
      const errorMessage = {
        id: Date.now() + 1,
        content: `"Sorry, we couldn’t fetch the data right now. Please try again later."
`,
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Load messages when activeChatId changes
  useEffect(() => {
    if (activeChatId) {
      setMessages([]);
      fetchMessages(activeChatId);
    }
  }, [activeChatId]);

  return {
    messages,
    isTyping,
    loading,
    sendMessage,
  };
};
