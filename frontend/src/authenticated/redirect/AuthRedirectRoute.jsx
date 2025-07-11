import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getRoleBasedRedirectPath } from '../../service/api.jsx';

function AuthRedirectRoute({ children }) {
    const [authStatus, setAuthStatus] = useState({ loading: true, isAuth: false });

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = await isAuthenticated();
            setAuthStatus({ loading: false, isAuth });
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

    const redirectPath = getRoleBasedRedirectPath();

    if (authStatus.isAuth) {
        return <Navigate to={redirectPath} />;
    }

    return children;
}

export default AuthRedirectRoute;
