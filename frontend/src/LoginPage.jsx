import Navbar from "./compoments/Navbar.jsx";
import Footer from "./compoments/Footer.jsx";
import LoginForm from "./compoments/LoginForm.jsx";
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
