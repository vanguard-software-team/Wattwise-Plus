import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthenticatedLayout from "./AuthenticatedLayout.jsx";
import { ChatSidebar, ChatArea } from "../../components/chat";
import { useChatSessions } from "../../hooks/useChatSessions.js";
import { getUserEmail } from "../../service/api.jsx";

function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [activeChatId, setActiveChatId] = useState(chatId || null);
  const [userEmail, setUserEmail] = useState(null);
  const { sessions, loading, createSession, deleteSession, refetchSessions } =
    useChatSessions();

  // Monitor authentication state
  useEffect(() => {
    const checkAuth = () => {
      const email = getUserEmail();
      if (email && email !== userEmail) {
        setUserEmail(email);
        // If we just got a user email and had no sessions before, refetch
        if (sessions.length === 0 && !loading) {
          refetchSessions();
        }
      }
    };

    checkAuth();
    // Check periodically in case token becomes available
    const interval = setInterval(checkAuth, 1000);

    // Clean up after a few attempts
    setTimeout(() => clearInterval(interval), 10000);

    return () => clearInterval(interval);
  }, [userEmail, sessions.length, loading, refetchSessions]);

  // Update activeChatId when URL parameter changes
  useEffect(() => {
    // Block access to temp session via URL
    if (chatId === "temp_session_for_listing") {
      navigate("/chat");
      return;
    }

    // If chatId is provided, wait for sessions to load, then check if it exists
    if (chatId && !loading) {
      const sessionExists = sessions.some((session) => session.id === chatId);
      if (!sessionExists) {
        // Redirect to /chat if session doesn't exist
        navigate("/chat");
        return;
      }
    }

    setActiveChatId(chatId || null);
  }, [chatId, sessions, loading, navigate]);
  const handleSelectChat = (sessionId) => {
    navigate(`/chat/${sessionId}`);
  };

  const handleCreateChat = async () => {
    try {
      const newChatId = await createSession();
      navigate(`/chat/${newChatId}`);
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className='fixed inset-0 top-0 left-0 h-screen flex bg-gray-100 font-ubuntu z-50 sm:left-40 sm:ml-0'>
        <ChatSidebar
          sessions={sessions}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onCreateChat={handleCreateChat}
          onDeleteChat={deleteSession}
          loading={loading}
        />
        <ChatArea activeChatId={activeChatId} onCreateChat={handleCreateChat} />
      </div>
    </AuthenticatedLayout>
  );
}

export default Chat;
