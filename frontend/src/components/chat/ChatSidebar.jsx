import PropTypes from "prop-types";
import { HiPlus, HiTrash, HiChatAlt2 } from "react-icons/hi";
import ConversationSkeleton from "./ConversationSkeleton.jsx";

function ChatSidebar({
  sessions,
  activeChatId,
  onSelectChat,
  onCreateChat,
  onDeleteChat,
  loading = false,
}) {
  return (
    <div className='w-64 md:w-80 min-w-64 md:min-w-80 h-full bg-gray-100 border-r border-gray-300 flex flex-col'>
      {/* Header */}
      <div className='p-4 border-b border-gray-300 flex-shrink-0'>
        <h2 className='text-lg font-semibold text-gray-900 mb-3'>
          WattWise AI
        </h2>
        <button
          onClick={onCreateChat}
          className='w-full bg-orange-400 text-black font-bold hover:bg-orange-500 hover:text-white transition-all duration-300 px-3 py-2.5 rounded-lg flex items-center justify-center text-sm'
        >
          <HiPlus className='w-4 h-4 mr-2' />
          New Chat
        </button>
      </div>

      {/* Sessions List */}
      <div className='flex-1 overflow-y-auto p-3'>
        <div className='space-y-2'>
          {loading ? (
            <ConversationSkeleton />
          ) : sessions.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              <HiChatAlt2 className='w-12 h-12 mx-auto mb-3 opacity-50' />
              <p className='text-sm mb-1'>No conversations yet</p>
              <p className='text-xs'>Start a new chat to begin</p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = activeChatId === session.id;
              return (
                <div
                  key={session.id}
                  className={`p-3 cursor-pointer transition-all duration-200 rounded-lg border group hover:bg-gray-200 ${
                    isActive
                      ? "bg-orange-100 border-orange-400"
                      : "bg-white border-gray-200"
                  }`}
                  onClick={() => onSelectChat(session.id)}
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1 min-w-0'>
                      <h3
                        className='font-medium text-gray-900 text-sm mb-1 overflow-hidden leading-tight'
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          wordBreak: "break-word",
                        }}
                      >
                        {session.id}
                      </h3>
                      {session.lastMessage && (
                        <p
                          className='text-xs text-gray-500 mb-2 overflow-hidden leading-tight'
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            wordBreak: "break-word",
                          }}
                        >
                          {session.lastMessage}
                        </p>
                      )}
                      <p className='text-xs text-gray-400'>
                        {session.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      className='opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded-lg flex-shrink-0'
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(session.id);
                      }}
                    >
                      <HiTrash className='w-4 h-4 text-red-500' />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

ChatSidebar.propTypes = {
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      lastMessage: PropTypes.string,
      timestamp: PropTypes.instanceOf(Date).isRequired,
    })
  ).isRequired,
  activeChatId: PropTypes.string,
  onSelectChat: PropTypes.func.isRequired,
  onCreateChat: PropTypes.func.isRequired,
  onDeleteChat: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default ChatSidebar;
