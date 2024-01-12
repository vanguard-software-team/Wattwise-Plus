import LandingPage from "./landing/LandingPage.jsx";
import LoginPage from "./landing/LoginPage.jsx";
import RegisterPage from "./landing/RegisterPage.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./authenticated/consumer/Dashboard.jsx";
import Insights from "./authenticated/consumer/Insights.jsx";
import Profile from "./authenticated/consumer/Profile.jsx";
import Forecasting from "./authenticated/consumer/Forecasting.jsx";
import ProviderDashboard from "./authenticated/provider/ProviderDashboard.jsx";
import ProviderInsights from "./authenticated/provider/ProviderInsights.jsx";
import ProviderOutliers from "./authenticated/provider/ProviderOutliers.jsx";
import ProviderProfile from "./authenticated/provider/ProviderProfile.jsx";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="login" element={<LoginPage />} />
				<Route path="register" element={<RegisterPage />} />
				<Route path="*" element={<Navigate to={"/"} />} />

				{/* Authenticated consumer routes*/}
				<Route path="/dashboard" element={<Dashboard to={Dashboard} />} />
				<Route path="/insights" element={<Insights to={Insights} />} />
				<Route path="/profile" element={<Profile to={Profile} />} />
				<Route path="/forecasting" element={<Forecasting to={Forecasting} />} />


				{/* Authenticated provider routes*/}
				<Route path="/provider/dashboard" element={<ProviderDashboard to={ProviderDashboard} />} />
				<Route path="/provider/insights" element={<ProviderInsights to={ProviderInsights} />} />
				<Route path="provider/outlier-detection" element={<ProviderOutliers to={ProviderOutliers} />} />
				<Route path="/provider/profile" element={<ProviderProfile to={ProviderProfile} />} />

			</Routes>
		</BrowserRouter>
	);
}
