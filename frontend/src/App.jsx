import { Routes, Route, Navigate } from 'react-router-dom';

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

// Components
import ProtectedRoute from './components/ProtectedRoute';
import GoogleCallback from './components/GoogleCallback';
import AppLayout from './components/AppLayout';

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