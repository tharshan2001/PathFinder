import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useToastStore } from '../stores/toastStore';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { user, hasFetchedUser, fetchUser } = useAuthStore();
  const toast = useToastStore();

  useEffect(() => {
    if (!hasFetchedUser) {
      fetchUser().then((userData) => {
        if (userData) {
          toast.success('Welcome to PathFinder!');
          navigate('/home', { replace: true });
        } else {
          toast.error('Unable to sign in with Google. Please try again.');
          navigate('/', { replace: true });
        }
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