import { Bot, User } from "lucide-react";

export const MessageBubble = ({ message, className = "" }) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex gap-3 ${
        isUser ? "justify-end" : "justify-start"
      } ${className}`}
    >
      {!isUser && (
        <div className='w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center flex-shrink-0 mt-1'>
          <Bot className='w-4 h-4 text-white' />
        </div>
      )}

      <div
        className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl shadow-sm ${
          isUser
            ? "bg-orange-400 text-white rounded-br-md"
            : "bg-gray-100 text-gray-900 rounded-bl-md"
        }`}
      >
        <p className='text-sm leading-relaxed whitespace-pre-wrap'>
          {message.content}
        </p>
        <div
          className={`text-xs mt-2 ${
            isUser ? "text-orange-100" : "text-gray-500"
          }`}
        >
          {message.timestamp?.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {isUser && (
        <div className='w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 mt-1'>
          <User className='w-4 h-4 text-gray-600' />
        </div>
      )}
    </div>
  );
};
