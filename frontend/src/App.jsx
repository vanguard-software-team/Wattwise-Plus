import React from "react";
import LandingPage from "./LandingPage.jsx";
import LoginPage from "./LoginPage.jsx"
import RegisterPage from "./RegisterRegister.jsx";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </BrowserRouter>
  );
}