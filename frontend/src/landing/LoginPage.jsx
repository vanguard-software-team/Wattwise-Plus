import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import LoginForm from "../components/LoginForm.jsx";
function LoginPage() {
	return (
		<>
			<Navbar />
			<div className="bg-gray-100 flex justify-center items-center pb-60 h-screen">
				<LoginForm />
			</div>

			<Footer />
		</>
	);
}

export default LoginPage;
