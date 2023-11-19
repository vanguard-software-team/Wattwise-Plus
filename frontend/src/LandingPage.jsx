'use client';
import Navbar from "./compoments/Navbar.jsx";
import Footer from "./compoments/Footer.jsx";
import LoginForm from "./compoments/LoginForm.jsx";

function LandingPage() {
    return (
        <>
            <Navbar />
            <div className=" flex justify-center items-center h-screen font-play">
                <h1 className="text-6xl font-semibold">Brightening energy horizons.</h1>
            </div>
            <Footer />
        </>

    );
}

export default LandingPage