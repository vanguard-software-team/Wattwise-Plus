import { useState } from "react";
import AuthenticatedLayout from "./AuthenticatedLayout.jsx";
import { ChatSidebar, ChatArea } from "../../components/chat";
import { useChatSessions } from "../../hooks/useChatSessions.js";

function Chat() {
  const [activeChatId, setActiveChatId] = useState(null);
  const { sessions, createSession, deleteSession } = useChatSessions();
  return (
    <AuthenticatedLayout>
      <div className='fixed inset-0 top-0 left-0 h-screen flex bg-gray-100 font-ubuntu z-50 sm:left-40 sm:ml-0'>
        <ChatSidebar
          sessions={sessions}
          activeChatId={activeChatId}
          onSelectChat={setActiveChatId}
          onCreateChat={createSession}
          onDeleteChat={deleteSession}
        />
        <ChatArea activeChatId={activeChatId} />
      </div>
    </AuthenticatedLayout>
  );
}

export default Chat;
