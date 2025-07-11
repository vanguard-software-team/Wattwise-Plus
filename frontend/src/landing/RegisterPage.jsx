import Navbar from "../components/Navbar.jsx";
import RegisterForm from "../components/RegisterForm.jsx";
import Footer from "../components/Footer.jsx";
function RegisterPage() {
	return (
		<>
			<Navbar />
			<div className="bg-gradient-to-b from-slate-100 to-orange-200 flex justify-center items-center pb-32 h-screen">
				<RegisterForm />
			</div>
			<Footer />
		</>
	);
}

export default RegisterPage;
