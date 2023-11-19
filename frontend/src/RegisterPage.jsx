import {Link} from "react-router-dom";
import Navbar from "./compoments/Navbar.jsx";
import RegisterForm from "./compoments/RegisterForm.jsx";
import Footer from "./compoments/Footer.jsx";
function RegisterPage() {
    return (
        <>
            <Navbar/>
            <div className="flex justify-center items-center p-8">
                <RegisterForm/>
            </div>
            <Footer/>
        </>
    );
}

export default RegisterPage