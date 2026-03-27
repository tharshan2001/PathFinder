import { createContext, useContext, useState } from 'react';
import { 
  mockUsers, 
  mockCourses, 
  mockJobs, 
  mockTrends, 
  mockNotifications,
  mockConnections,
  mockMessages,
  mockForums,
  mockLearningPaths
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(mockUsers[0]);
  const [courses] = useState(mockCourses);
  const [jobs] = useState(mockJobs);
  const [trends] = useState(mockTrends);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [connections] = useState(mockConnections);
  const [messages, setMessages] = useState(mockMessages);
  const [forums] = useState(mockForums);
  const [learningPaths] = useState(mockLearningPaths);
  const [savedCourses, setSavedCourses] = useState(mockUsers[0].savedCourses || []);
  const [savedJobs, setSavedJobs] = useState(mockUsers[0].savedJobs || []);
  const [enrolledCourses, setEnrolledCourses] = useState(mockUsers[0].enrolledCourses || []);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSaveCourse = (courseId) => {
    setSavedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const enrollInCourse = (courseId) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses(prev => [...prev, courseId]);
    }
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => 
      prev.map(n => n._id === notifId ? { ...n, readStatus: true } : n)
    );
  };

  const getCourseById = (id) => courses.find(c => c._id === id);
  const getJobById = (id) => jobs.find(j => j._id === id);
  const getSavedCourses = () => courses.filter(c => savedCourses.includes(c._id));
  const getSavedJobs = () => jobs.filter(j => savedJobs.includes(j._id));
  const getEnrolledCourses = () => courses.filter(c => enrolledCourses.includes(c._id));

  const unreadNotificationCount = notifications.filter(n => !n.readStatus).length;
  const unreadMessageCount = messages.reduce((acc, m) => acc + m.unread, 0);

  const value = {
    user,
    setUser,
    courses,
    jobs,
    trends,
    notifications,
    connections,
    messages,
    forums,
    learningPaths,
    savedCourses,
    savedJobs,
    enrolledCourses,
    sidebarOpen,
    setSidebarOpen,
    toggleSaveCourse,
    toggleSaveJob,
    enrollInCourse,
    markNotificationRead,
    getCourseById,
    getJobById,
    getSavedCourses,
    getSavedJobs,
    getEnrolledCourses,
    unreadNotificationCount,
    unreadMessageCount
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
