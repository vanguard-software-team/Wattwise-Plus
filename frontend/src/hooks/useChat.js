import { useState, useEffect } from "react";

const BASE_URL = "https://wattwise-agent-api.vanguard-software.io";
const MANAGE_KEY = "47C61A0FA8738BA77308A8A600F88E4B";

export const useChat = (activeChatId, userId = "user1@example.com") => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch messages for the active chat
  const fetchMessages = async (sessionId) => {
    if (!sessionId) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        session_id: sessionId,
        manage_key: MANAGE_KEY,
      });

      const response = await fetch(`${BASE_URL}/history?${params}`);
      const data = await response.json();

      if (data.success && data.data.history) {
        const formattedMessages = data.data.history.map((msg, index) => ({
          id: index,
          content: msg.message,
          sender: msg.sender === "user" ? "user" : "assistant",
          timestamp: new Date(),
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
      const params = new URLSearchParams({
        user_id: userId,
        session_id: activeChatId,
        message: content.trim(),
        manage_key: MANAGE_KEY,
      });

      const response = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });

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
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        content: "Sorry, I couldn't process your message. Please try again.",
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
