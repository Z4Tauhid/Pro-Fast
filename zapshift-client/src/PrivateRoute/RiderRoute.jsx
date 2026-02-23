import React from 'react';
import useAuth from '../Hooks/useAuth';
import useCheckRole from '../Hooks/useCheckRole';
import { Navigate, useLocation } from 'react-router';

const RiderRoute = ({children}) => {
    
    const { user, loading } = useAuth();
  const { role, roleLoading } = useCheckRole();
  const location = useLocation();
    
    if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user || role !== "rider") {
    return <Navigate to="/dashboard/forbidden" state={{ from: location }} replace />;
  }

  return children;
};

export default RiderRoute;