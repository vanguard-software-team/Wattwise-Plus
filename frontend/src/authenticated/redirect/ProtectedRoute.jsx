import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserType } from '../../service/api.jsx';

function ProtectedRoute({ component: Component, allowedRoles, ...rest }) {
    const [authStatus, setAuthStatus] = useState({ loading: true, isAuth: false, userType: null });

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = await isAuthenticated();
            const userType = getUserType(); // Assuming getUserType is synchronous
            setAuthStatus({ loading: false, isAuth, userType });
        };
        checkAuth();
    }, []);

    if (authStatus.loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!authStatus.isAuth) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(authStatus.userType)) {
        return <Navigate to="/" />;
    }

    return <Component {...rest} />;
}

export default ProtectedRoute;
