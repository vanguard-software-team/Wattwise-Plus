import Navbar from "./compoments/Navbar.jsx";
import Footer from "./compoments/Footer.jsx";
import LoginForm from "./compoments/LoginForm.jsx";
function LoginPage() {
    return (
        <>
            <Navbar/>
            <div className="flex justify-center items-center p-8">
                <LoginForm/>
            </div>

            <Footer/>
        </>
    );
}

export default LoginPage