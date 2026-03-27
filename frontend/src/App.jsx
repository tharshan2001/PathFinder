import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Network from './pages/Network';
import UserProfile from './pages/UserProfile';
import Messaging from './pages/Messaging';

const ProtectedRoute = ({ children }) => {
  const { user, loading, hasFetchedUser } = useAuthStore();

  if (!hasFetchedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      if (token) {
        await fetchUser();
      }
      navigate('/feed', { replace: true });
    };
    handleCallback();
  }, [navigate, fetchUser, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <span className="ml-3 text-gray-600">Completing sign in...</span>
    </div>
  );
};

function App() {
  const { fetchUser, user } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route 
        path="/feed" 
        element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/network" 
        element={
          <ProtectedRoute>
            <Network />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile/:userId" 
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/messaging" 
        element={
          <ProtectedRoute>
            <Messaging />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
