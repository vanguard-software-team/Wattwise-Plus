import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthenticatedLayout from "./AuthenticatedLayout.jsx";
import { ChatSidebar, ChatArea } from "../../components/chat";
import { useChatSessions } from "../../hooks/useChatSessions.js";
import { getUserEmail } from "../../service/api.jsx";
import { Menu, X } from "lucide-react";

function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [activeChatId, setActiveChatId] = useState(chatId || null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const { sessions, loading, createSession, deleteSession, refetchSessions } =
    useChatSessions();

  const sidebarRef = useRef(null);

  // Close sidebar on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        sidebarOpen
      ) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  // Monitor authentication state
  useEffect(() => {
    const checkAuth = () => {
      const email = getUserEmail();
      if (email && email !== userEmail) {
        setUserEmail(email);
        if (sessions.length === 0 && !loading) {
          refetchSessions();
        }
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    setTimeout(() => clearInterval(interval), 10000);
    return () => clearInterval(interval);
  }, [userEmail, sessions.length, loading, refetchSessions]);

  // Update activeChatId when URL parameter changes
  useEffect(() => {
    if (chatId === "temp_session_for_listing") {
      navigate("/chat");
      return;
    }
    if (chatId && !loading) {
      const sessionExists = sessions.some((session) => session.id === chatId);
      if (!sessionExists) {
        navigate("/chat");
        return;
      }
    }
    setActiveChatId(chatId || null);
  }, [chatId, sessions, loading, navigate]);

  const handleSelectChat = (sessionId) => {
    navigate(`/chat/${sessionId}`);
    setSidebarOpen(false); // close on selection
  };

  const handleCreateChat = async () => {
    try {
      const newChatId = await createSession();
      navigate(`/chat/${newChatId}`);
      setSidebarOpen(false);
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className='fixed inset-0 top-0 left-0 h-screen flex bg-gray-100 font-ubuntu z-50 sm:left-40 sm:ml-0'>
        {/* Desktop Sidebar */}
        <div className='hidden lg:block'>
          <ChatSidebar
            sessions={sessions}
            activeChatId={activeChatId}
            onSelectChat={handleSelectChat}
            onCreateChat={createSession}
            onDeleteChat={deleteSession}
            loading={loading}
          />
        </div>

        {/* Mobile Drawer + Overlay */}
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 lg:hidden z-40
            ${
              sidebarOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden={!sidebarOpen}
        />
        {/* Drawer */}
        <aside
          role='dialog'
          aria-modal='true'
          className={`fixed inset-y-0 left-0 z-50 w-64 md:w-80 bg-gray-100 border-r border-gray-300 shadow-xl
            transform transition-transform duration-300 ease-in-out lg:hidden
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Close button (mobile only) */}
          <button
            className='absolute top-3 right-3 p-2 rounded-md hover:bg-gray-200'
            onClick={() => setSidebarOpen(false)}
            aria-label='Close sidebar'
          >
            <X className='w-5 h-5' />
          </button>

          <ChatSidebar
            sessions={sessions}
            activeChatId={activeChatId}
            onSelectChat={handleSelectChat}
            onCreateChat={createSession}
            onDeleteChat={deleteSession}
            loading={loading}
          />
        </aside>

        {/* Chat Area */}
        <div className='flex-1 flex flex-col'>
          {/* Mobile Header */}
          <div className='lg:hidden border-b border-border p-4 bg-card'>
            <div className='flex items-center justify-between'>
              <button
                className='hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3'
                onClick={() => setSidebarOpen((prev) => !prev)}
                aria-expanded={sidebarOpen}
                aria-controls='mobile-sidebar'
              >
                <Menu className='w-5 h-5' />
              </button>
              <h1 className='font-semibold text-foreground'>AI Assistant</h1>
              <div className='w-9' />
            </div>
          </div>

          <ChatArea
            activeChatId={activeChatId}
            onCreateChat={handleCreateChat}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default Chat;
