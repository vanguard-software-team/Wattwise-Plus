import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserType } from '../../service/api.jsx';

function ProtectedRoute({ component: Component, allowedRoles, ...rest }) {
    const isAuth = isAuthenticated();
    const userType = getUserType();

    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(userType)) {
        return <Navigate to="/" />;
    }

    return <Component {...rest} />;
}

export default ProtectedRoute;