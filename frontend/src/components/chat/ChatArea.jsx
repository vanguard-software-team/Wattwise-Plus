import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { useChat } from "../../hooks/useChat";

const ChatArea = ({ activeChatId }) => {
  const [message, setMessage] = useState("");
  const scrollAreaRef = useRef(null);
  const { messages, isTyping, sendMessage } = useChat(activeChatId);

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChatId) return;

    await sendMessage(message);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!activeChatId) {
    return (
      <div className='flex-1 h-full flex items-center justify-center bg-white'>
        <div className='text-center'>
          <Bot className='w-16 h-16 mx-auto mb-4 text-gray-400' />
          <h2 className='text-2xl font-semibold mb-2 text-gray-700'>
            Welcome to Wattwise AI
          </h2>
          <p className='text-gray-500'>
            Select a conversation or start a new one to begin chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 h-full flex flex-col bg-white'>
      {/* Chat Header */}
      <div className='border-b border-gray-200 p-3 sm:p-4 bg-white flex-shrink-0'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-500 flex items-center justify-center'>
            <Bot className='w-4 h-4 sm:w-5 sm:h-5 text-white' />
          </div>
          <div>
            <h3 className='font-semibold text-gray-900 text-sm sm:text-base'>
              Wattwise AI Assistant
            </h3>
            <p className='text-xs sm:text-sm text-gray-500'>
              Ready to help with energy insights
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollAreaRef} className='flex-1 p-4 sm:p-6 overflow-y-auto'>
        <div className='space-y-6 max-w-4xl mx-auto'>
          {messages.length === 0 ? (
            <div className='text-center py-12'>
              <div className='w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4'>
                <Bot className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-lg font-semibold mb-2 text-gray-700'>
                Start a conversation
              </h3>
              <p className='text-gray-500'>
                Ask me anything about energy management and forecasting!
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  className='opacity-0 animate-fade-in'
                />
              ))}
              {isTyping && <TypingIndicator />}
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className='border-t border-gray-200 p-4 sm:p-6 bg-white flex-shrink-0'>
        <div className='flex gap-2 sm:gap-4 max-w-4xl mx-auto'>
          <input
            type='text'
            placeholder='Type your message...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className='flex-1 bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isTyping}
            className='bg-orange-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center'
          >
            <Send className='w-4 h-4' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
