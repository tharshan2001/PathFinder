import { Routes, Route, Navigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Pages
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
import Notifications from './pages/Notifications';
import CourseAdmin from './pages/CourseAdmin';
import { isAdminUser } from './utils/adminAuth';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import GoogleCallback from './components/GoogleCallback';
import AppLayout from './components/AppLayout';

const AdminRoute = ({ children }) => {
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

  if (!isAdminUser(user)) {
    return <Navigate to="/courses" replace />;
  }

  return children;
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
  return (
    <Routes>
      {/* Landing page - no sidebar */}
      <Route path="/" element={<Home />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />

      {/* All protected routes with sidebar layout */}
      <Route path="/home" element={<ProtectedRoute><AppLayout><Feed /></AppLayout></ProtectedRoute>}/>
      <Route path="/forums" element={<ProtectedRoute><AppLayout><Forums /></AppLayout></ProtectedRoute>}/>
      <Route path="/courses" element={<ProtectedRoute><AppLayout><Courses /></AppLayout></ProtectedRoute>}/>
      <Route path="/courses/admin" element={<AdminRoute><AppLayout><CourseAdmin /></AppLayout></AdminRoute>}/>
      <Route path="/jobs" element={<ProtectedRoute><AppLayout><JobMarket /></AppLayout></ProtectedRoute>}/>
      <Route path="/skill-profile" element={<ProtectedRoute><AppLayout><SkillProfile /></AppLayout></ProtectedRoute>}/>
      <Route path="/recommended-jobs" element={<ProtectedRoute><AppLayout><RecommendedJobs /></AppLayout></ProtectedRoute>}/>
      <Route path="/skill-gap-analysis" element={<ProtectedRoute><AppLayout><SkillGapAnalysis /></AppLayout></ProtectedRoute>}/>
      <Route path="/recommended-courses" element={<ProtectedRoute><AppLayout><RecommendedCourses /></AppLayout></ProtectedRoute>}/>
      <Route path="/learning" element={<ProtectedRoute><AppLayout><Feed /></AppLayout></ProtectedRoute>}/>
      <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>}/>
      <Route path="/network" element={<ProtectedRoute><AppLayout><Network /></AppLayout></ProtectedRoute>}/>
      <Route path="/profile/:userId" element={<ProtectedRoute><AppLayout><UserProfile /></AppLayout></ProtectedRoute>}/>
      <Route path="/messaging" element={<ProtectedRoute><AppLayout><Messaging /></AppLayout></ProtectedRoute>}/>
      <Route path="/notifications" element={<ProtectedRoute><AppLayout><Notifications /></AppLayout></ProtectedRoute>}/>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;