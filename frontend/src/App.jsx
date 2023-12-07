import LandingPage from "./LandingPage.jsx";
import LoginPage from "./LoginPage.jsx";
import RegisterPage from "./RegisterPage.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import Insights from "./Insights.jsx";
import Profile from "./Profile.jsx";
import Forecasting from "./Forecasting.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to={"/"} />} />

        {/* Authenticated routes*/}
        <Route path="/dashboard" element={<Dashboard to={Dashboard} />} />
        <Route path="/insights" element={<Insights to={Insights} />} />
        <Route path="/profile" element={<Profile to={Profile} />} />
        <Route path="/forecasting" element={<Forecasting to={Forecasting} />} />
      </Routes>
    </BrowserRouter>
  );
}
