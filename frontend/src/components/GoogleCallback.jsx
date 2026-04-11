import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { user, hasFetchedUser, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!hasFetchedUser) {
      fetchUser().then(() => {
        navigate('/home', { replace: true });
      });
    } else if (user) {
      navigate('/home', { replace: true });
    }
  }, [hasFetchedUser, user]);

  if (!hasFetchedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
        <span className="ml-3 text-gray-600">Completing sign in...</span>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;