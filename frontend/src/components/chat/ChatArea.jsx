import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { useChat } from "../../hooks/useChat";

const ChatArea = ({ activeChatId, onCreateChat }) => {
  const [message, setMessage] = useState("");
  const [processingPendingMessage, setProcessingPendingMessage] =
    useState(false);
  const scrollAreaRef = useRef(null);
  const pendingMessageSentRef = useRef(false);

  const { messages, isTyping, loading, sendMessage, setMessages } =
    useChat(activeChatId);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Store the message content before clearing
    const messageContent = message.trim();
    // Clear the message box immediately
    setMessage("");

    // If no active chat, create a new session first
    if (!activeChatId) {
      try {
        onCreateChat();
        // The message will be sent automatically after navigation
        // Store the message temporarily to send after navigation
        sessionStorage.setItem("pendingMessage", messageContent);
        return;
      } catch (error) {
        console.error("Failed to create new chat:", error);
        // Restore the message if there was an error
        setMessage(messageContent);
        return;
      }
    }

    try {
      await sendMessage(messageContent);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Restore the message if there was an error
      setMessage(messageContent);
    }
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

  // Handle pending message after navigation to new chat
  useEffect(() => {
    if (processingPendingMessage) return;
    const pendingMessage = sessionStorage.getItem("pendingMessage");

    if (
      pendingMessage &&
      activeChatId &&
      !pendingMessageSentRef.current &&
      !loading
    ) {
      pendingMessageSentRef.current = true;
      setProcessingPendingMessage(true);

      // Remove pending message from storage
      sessionStorage.removeItem("pendingMessage");

      // Small delay to ensure the chat is fully loaded, then send actual message
      setTimeout(async () => {
        await sendMessage(pendingMessage);
        setProcessingPendingMessage(false);
      }, 300);
    }

    // Reset the ref when chat changes
    if (!activeChatId) {
      pendingMessageSentRef.current = false;
      setProcessingPendingMessage(false);
    }
  }, [activeChatId, sendMessage, loading, setMessages]);

  if (!activeChatId) {
    return (
      <div className='flex-1 h-full flex flex-col items-center justify-center bg-white p-8'>
        <div className='text-center mb-8'>
          <Bot className='w-16 h-16 mx-auto mb-4 text-gray-400' />
          <h2 className='text-2xl font-semibold mb-2 text-gray-700'>
            Welcome to Wattwise AI
          </h2>
          <p className='text-gray-500 mb-8'>
            Start a new conversation by typing your message below
          </p>
        </div>

        {/* Centered Input Area for new chat */}
        <div className='w-full max-w-2xl'>
          <div className='flex gap-3 items-center bg-gray-50 p-4 rounded-2xl border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200'>
            <input
              type='text'
              placeholder='Type your message to start a new chat...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className='flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm sm:text-base placeholder-gray-500'
              style={{ boxShadow: "none" }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className='bg-orange-400 text-white p-3 rounded-xl hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shrink-0 focus:outline-none'
            >
              <Send className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 h-full flex flex-col bg-white'>
      {/* Chat Header */}
      <div className='border-b border-gray-200 p-3 sm:p-4 bg-white flex-shrink-0'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-400 flex items-center justify-center'>
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
          {loading &&
          !sessionStorage.getItem("pendingMessage") &&
          !processingPendingMessage ? (
            <div className='text-center py-12'>
              <div className='w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
              <p className='text-gray-500 text-sm'>Loading conversation...</p>
            </div>
          ) : messages.length === 0 &&
            !processingPendingMessage &&
            !sessionStorage.getItem("pendingMessage") ? (
            <div className='text-center py-12'>
              <div className='w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center mx-auto mb-4'>
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
              {messages.map((msg) => {
                if (msg.sender === "user") {
                  // Keep user messages as bubbles
                  return (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      className='opacity-0 animate-fade-in'
                    />
                  );
                } else {
                  // Render agent messages as plain text with line separator
                  return (
                    <div key={msg.id} className='opacity-0 animate-fade-in'>
                      <div className='flex gap-3 items-start mb-4'>
                        <div className='w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center flex-shrink-0 mt-1'>
                          <Bot className='w-4 h-4 text-white' />
                        </div>
                        <div className='flex-1'>
                          <div className='text-sm text-gray-900 leading-relaxed whitespace-pre-wrap'>
                            {msg.content}
                          </div>
                          <div className='text-xs text-gray-500 mt-2'>
                            {msg.timestamp?.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                      <hr className='border-gray-200 my-6' />
                    </div>
                  );
                }
              })}
              {isTyping && <TypingIndicator />}
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      {!loading && (
        <div className='border-t border-gray-200 p-4 sm:p-6 bg-white flex-shrink-0'>
          <div className='flex gap-2 sm:gap-4 max-w-4xl mx-auto'>
            <input
              type='text'
              placeholder={
                loading ? "Loading conversation..." : "Type your message..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className='flex-1 bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
            />
            <button
              onClick={handleSendMessage}
              disabled={
                !message.trim() || loading || (activeChatId && isTyping)
              }
              className='bg-orange-400 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center'
            >
              <Send className='w-4 h-4' />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
