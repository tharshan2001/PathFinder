import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';

import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Recommendations from './pages/Recommendations';
import LearningPath from './pages/LearningPath';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import SavedItems from './pages/SavedItems';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Connections from './pages/Connections';
import Forums from './pages/Forums';

import FeedPage from './pages/FeedPage';

import './index.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Layout />}>
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/learning-path" element={<LearningPath />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved" element={<SavedItems />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/forums" element={<Forums />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
