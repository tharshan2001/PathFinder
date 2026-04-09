import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuthStore } from './stores/authStore';
import Home from './pages/Home';
import Feed from './pages/Feed';
import JobMarket from './pages/JobMarket';
import Profile from './pages/Profile';
import Network from './pages/Network';
import UserProfile from './pages/UserProfile';
import Messaging from './pages/Messaging';
import Forums from './pages/Forums';
import Courses from './pages/Courses';
import SkillProfile from './pages/SkillProfile';
import RecommendedJobs from './pages/RecommendedJobs';
import SkillGapAnalysis from './pages/SkillGapAnalysis';
import RecommendedCourses from './pages/RecommendedCourses';

const ProtectedRoute = ({ children }) => {
  const { user, hasFetchedUser } = useAuthStore();

  if (!hasFetchedUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
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
        // Save token to cookie for authStore to use
        Cookies.set('token', token, { expires: 7 });
        await fetchUser();
      }
      navigate('/home', { replace: true });
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

const JobsRoute = () => {
  const { user, hasFetchedUser } = useAuthStore();
  const [searchParams] = useSearchParams();

  const guestRequested = searchParams.get('guest') === '1';
  const guestMode = import.meta.env.DEV && guestRequested && !user;

  if (!hasFetchedUser && !guestMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!user && !guestMode) {
    return <Navigate to="/" replace />;
  }

  return <JobMarket guestMode={guestMode} />;
};

function App() {
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/forums" 
        element={
          <ProtectedRoute>
            <Forums />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/courses" 
        element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/jobs" 
        element={<JobsRoute />} 
      />
      <Route
        path="/skill-profile"
        element={
          <ProtectedRoute>
            <SkillProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recommended-jobs"
        element={
          <ProtectedRoute>
            <RecommendedJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/skill-gap-analysis"
        element={
          <ProtectedRoute>
            <SkillGapAnalysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recommended-courses"
        element={
          <ProtectedRoute>
            <RecommendedCourses />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/learning" 
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
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
