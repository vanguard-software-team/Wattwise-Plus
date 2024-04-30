import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import LoginForm from "../components/LoginForm.jsx";
function LoginPage() {
	return (
		<>
			<Navbar />
			<div className="bg-gradient-to-b from-slate-100 to-orange-300 flex justify-center items-center pb-60 h-screen">
				<LoginForm />
			</div>

			<Footer />
		</>
	);
}

export default LoginPage;
