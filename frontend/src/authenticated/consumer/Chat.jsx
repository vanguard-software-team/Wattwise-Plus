import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthenticatedLayout from "./AuthenticatedLayout.jsx";
import { ChatSidebar, ChatArea } from "../../components/chat";
import { useChatSessions } from "../../hooks/useChatSessions.js";

function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [activeChatId, setActiveChatId] = useState(chatId || null);
  const { sessions, loading, createSession, deleteSession } = useChatSessions();

  // Update activeChatId when URL parameter changes
  useEffect(() => {
    // Block access to temp session via URL
    if (chatId === "temp_session_for_listing") {
      navigate("/chat");
      return;
    }

    // If chatId is provided, wait for sessions to load, then check if it exists
    if (chatId && !loading && sessions.length >= 0) {
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
        />
        <ChatArea activeChatId={activeChatId} />
      </div>
    </AuthenticatedLayout>
  );
}

export default Chat;
