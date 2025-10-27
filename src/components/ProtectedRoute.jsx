import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const session = localStorage.getItem("session");
  const sessionData = session ? JSON.parse(session) : null;
  
  if (sessionData && sessionData.isLoggedIn) {
    return children;
  }
  
  return <Navigate to="/invoice-web" replace />;
};

export default ProtectedRoute;
