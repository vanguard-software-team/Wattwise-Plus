const ConversationSkeleton = () => (
  <div className='space-y-2'>
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className='p-3 bg-white border border-gray-200 rounded-lg animate-pulse'
      >
        <div className='flex items-start justify-between'>
          <div className='flex-1 min-w-0'>
            <div className='h-4 bg-gray-200 rounded mb-2 w-3/4'></div>
            <div className='h-3 bg-gray-200 rounded mb-2 w-full'></div>
            <div className='h-3 bg-gray-200 rounded mb-2 w-5/6'></div>
            <div className='h-3 bg-gray-200 rounded w-1/3'></div>
          </div>
          <div className='w-4 h-4 bg-gray-200 rounded ml-2'></div>
        </div>
      </div>
    ))}
  </div>
);
export default ConversationSkeleton;
