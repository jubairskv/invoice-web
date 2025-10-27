import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const session = localStorage.getItem("session");
  const sessionData = session ? JSON.parse(session) : null;
  
  if (sessionData && sessionData.isLoggedIn) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

export default PublicRoute;
