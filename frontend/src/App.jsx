import LandingPage from "./landing/LandingPage.jsx";
import LoginPage from "./landing/LoginPage.jsx";
import RegisterPage from "./landing/RegisterPage.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./authenticated/consumer/Dashboard.jsx";
import Insights from "./authenticated/consumer/Insights.jsx";
import Profile from "./authenticated/consumer/Profile.jsx";
import Forecasting from "./authenticated/consumer/Forecasting.jsx";
import Chat from "./authenticated/consumer/Chat.jsx";
import ProviderDashboard from "./authenticated/provider/ProviderDashboard.jsx";
import ProviderInsights from "./authenticated/provider/ProviderInsights.jsx";
import ProviderOutliers from "./authenticated/provider/ProviderOutliers.jsx";
import ProviderProfile from "./authenticated/provider/ProviderProfile.jsx";
import ProtectedRoute from "./authenticated/redirect/ProtectedRoute.jsx";
import AuthRedirectRoute from "./authenticated/redirect/AuthRedirectRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <AuthRedirectRoute>
              <LandingPage />
            </AuthRedirectRoute>
          }
        />
        <Route
          path='login'
          element={
            <AuthRedirectRoute>
              <LoginPage />
            </AuthRedirectRoute>
          }
        />
        <Route path='register' element={<RegisterPage />} />
        <Route path='*' element={<Navigate to={"/"} />} />

        {/* Authenticated consumer routes*/}
        <Route
          path='/overview'
          element={
            <ProtectedRoute component={Dashboard} allowedRoles={["consumer"]} />
          }
        />
        <Route
          path='/insights'
          element={
            <ProtectedRoute component={Insights} allowedRoles={["consumer"]} />
          }
        />
        <Route
          path='/chat'
          element={
            <ProtectedRoute component={Chat} allowedRoles={["consumer"]} />
          }
        />
        <Route
          path='/chat/:chatId'
          element={
            <ProtectedRoute component={Chat} allowedRoles={["consumer"]} />
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute component={Profile} allowedRoles={["consumer"]} />
          }
        />
        <Route
          path='/forecasting'
          element={
            <ProtectedRoute
              component={Forecasting}
              allowedRoles={["consumer"]}
            />
          }
        />

        {/* Authenticated provider routes*/}
        <Route
          path='/provider/overview'
          element={
            <ProtectedRoute
              component={ProviderDashboard}
              allowedRoles={["provider"]}
            />
          }
        />
        <Route
          path='/provider/insights'
          element={
            <ProtectedRoute
              component={ProviderInsights}
              allowedRoles={["provider"]}
            />
          }
        />
        <Route
          path='provider/outlier-detection'
          element={
            <ProtectedRoute
              component={ProviderOutliers}
              allowedRoles={["provider"]}
            />
          }
        />
        <Route
          path='/provider/profile'
          element={
            <ProtectedRoute
              component={ProviderProfile}
              allowedRoles={["provider"]}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
