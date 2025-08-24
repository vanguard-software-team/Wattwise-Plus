import Navbar from "../components/Navbar.jsx";
import RegisterForm from "../components/RegisterForm.jsx";

function RegisterPage() {
  return (
    <>
      <Navbar />
      <div className='bg-gradient-to-b from-slate-100 to-orange-200 flex justify-center items-center pb-32 h-screen'>
        <RegisterForm />
      </div>
    </>
  );
}

export default RegisterPage;
