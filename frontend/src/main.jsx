import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import LandingPage from "./LandingPage.jsx";
import 'flowbite'
import Footer from "./assets/compoments/Footer.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode class="bg-orange-50 relative h-screen">
        <LandingPage/>
    </React.StrictMode>,
)
