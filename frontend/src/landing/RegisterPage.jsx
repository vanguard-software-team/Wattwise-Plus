import Navbar from "../components/Navbar.jsx";
import RegisterForm from "../components/RegisterForm.jsx";
import Footer from "../components/Footer.jsx";
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
