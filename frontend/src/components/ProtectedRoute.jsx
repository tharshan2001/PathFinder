import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const ProtectedRoute = ({ children }) => {
  const { user, hasFetchedUser, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!hasFetchedUser) {
      fetchUser();
    }
  }, [hasFetchedUser, fetchUser]);

  if (!hasFetchedUser) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005eb5]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;