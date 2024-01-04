import React, { useState } from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(/* your initial authentication state */ false);
  

    const checkAuthentication = () => {
      const userToken = localStorage.getItem('userToken');
      return userToken !== null;
    };
  

    useState(() => {
      setIsAuthenticated(checkAuthentication());
    }, []);
  
    return isAuthenticated ? (
      <Route {...rest} element={element} />
    ) : (
      <Navigate to="/auth/sign-in" />
    );
  };
  
  export default ProtectedRoute;
  