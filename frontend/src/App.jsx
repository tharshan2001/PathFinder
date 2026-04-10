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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="/home" element={<ProtectedRoute><Feed /></ProtectedRoute>}/>
      <Route path="/forums" element={<ProtectedRoute><Forums /></ProtectedRoute>}/>
      <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>}/>
      <Route path="/jobs" element={<JobMarket />}/>
      <Route path="/skill-profile" element={<ProtectedRoute><SkillProfile /></ProtectedRoute>}/>
      <Route path="/recommended-jobs" element={<ProtectedRoute><RecommendedJobs /></ProtectedRoute>}/>
      <Route path="/skill-gap-analysis" element={<ProtectedRoute><SkillGapAnalysis /></ProtectedRoute>}/>
      <Route path="/recommended-courses" element={<ProtectedRoute><RecommendedCourses /></ProtectedRoute>}/>
      <Route path="/learning" element={<ProtectedRoute><Feed /></ProtectedRoute>}/>
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
      <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>}/>
      <Route path="/profile/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>}/>
      <Route path="/messaging" element={<ProtectedRoute><Messaging /></ProtectedRoute>}/>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;