import AuthenticatedLayout from "./AuthenticatedLayout.jsx";
function Chat() {
  return (
    <AuthenticatedLayout>
      <div className='p-1 sm:ml-40 bg-gray-200 font-ubuntu'>
        <h1>Chat</h1>
      </div>
    </AuthenticatedLayout>
  );
}

export default Chat;
