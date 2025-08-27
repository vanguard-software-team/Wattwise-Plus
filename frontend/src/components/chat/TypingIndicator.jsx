import { Bot } from "lucide-react";

export const TypingIndicator = () => {
  return (
    <div className='flex gap-3 justify-start'>
      <div className='w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-1'>
        <Bot className='w-4 h-4 text-white' />
      </div>

      <div className='bg-gray-100 text-gray-900 rounded-2xl px-4 py-3 shadow-sm'>
        <div className='flex gap-1 items-center'>
          <div className='flex gap-1'>
            <div className='w-2 h-2 bg-gray-500 rounded-full animate-pulse'></div>
            <div className='w-2 h-2 bg-gray-500 rounded-full animate-pulse' style={{animationDelay: '0.2s'}}></div>
            <div className='w-2 h-2 bg-gray-500 rounded-full animate-pulse' style={{animationDelay: '0.4s'}}></div>
          </div>
          <span className='text-sm text-gray-600 ml-2'>
            AI is thinking...
          </span>
        </div>
      </div>
    </div>
  );
};
