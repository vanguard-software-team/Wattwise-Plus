import { useState, useEffect } from "react";
import { getUserEmail } from "../service/api.jsx";

const BASE_URL = `${import.meta.env.VITE_AGENT_API_URL}`;
const MANAGE_KEY = `${import.meta.env.VITE_AGENT_MANAGE_KEY}`;
const CURRENT_USER = getUserEmail();

// Simple UUID generator
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const useChatSessions = (userId = CURRENT_USER) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all sessions for the user
  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        user_id: userId,
        manage_key: MANAGE_KEY,
      });

      const response = await fetch(`${BASE_URL}/sessions?${params}`);
      const data = await response.json();

      if (data.success) {
        // Transform session IDs into session objects and filter out temp session
        const sessionObjects = data.data.session_ids
          .filter((sessionId) => sessionId !== "temp_session_for_listing")
          .map((sessionId) => ({
            id: sessionId,
            title: `Chat ${sessionId}`,
            lastMessage: null,
            timestamp: new Date(),
          }));
        setSessions(sessionObjects);
      } else {
        throw new Error(data.message || "Failed to fetch sessions");
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a session
  const deleteSession = async (sessionId) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        session_id: sessionId,
        user_id: userId,
        manage_key: MANAGE_KEY,
      });

      const response = await fetch(`${BASE_URL}/session?${params}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        setSessions((prev) =>
          prev.filter((session) => session.id !== sessionId)
        );
        return data;
      } else {
        throw new Error(data.message || "Failed to delete session");
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get conversation history for a session
  const getConversationHistory = async (sessionId) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        user_id: userId,
        session_id: sessionId,
        manage_key: MANAGE_KEY,
      });

      const response = await fetch(`${BASE_URL}/conversation?${params}`);
      const data = await response.json();

      if (data.success) {
        return data.data.conversation;
      } else {
        throw new Error(data.message || "Failed to fetch conversation history");
      }
    } catch (error) {
      console.error("Failed to fetch conversation history:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create a new session
  const createSession = async () => {
    try {
      const newSession = {
        id: generateUUID(),
        title: `Chat ${sessions.length + 1}`,
        lastMessage: null,
        timestamp: new Date(),
      };

      setSessions((prev) => [newSession, ...prev]);

      return newSession.id;
    } catch (error) {
      console.error("Failed to create session:", error);
      throw error;
    }
  };

  // Get session info (keeping for compatibility)
  const getSession = async (sessionId) => {
    try {
      return sessions.find((session) => session.id === sessionId);
    } catch (error) {
      console.error("Failed to fetch session:", error);
      return null;
    }
  };
  useEffect(() => {
    fetchSessions();
  }, [userId]);

  return {
    sessions,
    loading,
    error,
    createSession,
    deleteSession,
    getSession,
    getConversationHistory,
    refetchSessions: fetchSessions,
  };
};
