import Navbar from "./compoments/Navbar.jsx";
import RegisterForm from "./compoments/RegisterForm.jsx";
import Footer from "./compoments/Footer.jsx";
function RegisterPage() {
  return (
    <>
      <Navbar />
      <div className="bg-gray-100 flex justify-center items-center pb-32 h-screen">
        <RegisterForm />
      </div>
      <Footer />
    </>
  );
}

export default RegisterPage;
