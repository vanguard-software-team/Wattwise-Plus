import Navbar from "../components/Navbar.jsx";
import LoginForm from "../components/LoginForm.jsx";
function LoginPage() {
  return (
    <>
      <Navbar />
      <div className='bg-gradient-to-b from-slate-100 to-orange-200 flex justify-center items-center pb-60 h-screen'>
        <LoginForm />
      </div>
    </>
  );
}

export default LoginPage;
