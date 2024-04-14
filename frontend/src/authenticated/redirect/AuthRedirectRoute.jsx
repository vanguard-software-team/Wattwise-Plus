import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { isAuthenticated, getRoleBasedRedirectPath } from '../../service/api.jsx';

function AuthRedirectRoute({ children }) {
    const isAuth = isAuthenticated();
    const redirectPath = getRoleBasedRedirectPath();

    if (isAuth) {
        return <Navigate to={redirectPath} />;
    }

    return children ? children : <Route {...rest} />;
}

export default AuthRedirectRoute;