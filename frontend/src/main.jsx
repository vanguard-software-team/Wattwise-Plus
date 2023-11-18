import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import LandingPage from "./LandingPage.jsx";
import 'flowbite'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <LandingPage/>
        <h1 className="font-play">This is a heading using the Ubuntu font</h1>
    </React.StrictMode>,
)
