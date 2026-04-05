import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-mono">
        <div className="w-8 h-8 border-2 border-[#00e659] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#00e659]/70 text-sm tracking-widest">INITIALIZING TERMINAL SECURITY...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // FIREWALL: Stop non-paying users from accessing the terminal by manipulating URLs
  if (!user.is_pro_member) {
    return <Navigate to="/pricing" replace />;
  }

  return children;
};

export default ProtectedRoute;
