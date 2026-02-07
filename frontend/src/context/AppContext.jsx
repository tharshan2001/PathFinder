import { createContext, useContext, useState, useEffect } from 'react';
import { 
  mockUsers, 
  mockCourses, 
  mockJobs, 
  mockTrends, 
  mockNotifications,
  mockConnections,
  mockMessages,
  mockForums,
  mockLearningPaths,
  mockFeedback 
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(mockUsers[0]);
  const [courses, setCourses] = useState(mockCourses);
  const [jobs, setJobs] = useState(mockJobs);
  const [trends, setTrends] = useState(mockTrends);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [connections, setConnections] = useState(mockConnections);
  const [messages, setMessages] = useState(mockMessages);
  const [forums, setForums] = useState(mockForums);
  const [learningPaths, setLearningPaths] = useState(mockLearningPaths);
  const [feedback, setFeedback] = useState(mockFeedback);
  const [savedCourses, setSavedCourses] = useState(user.savedCourses || []);
  const [savedJobs, setSavedJobs] = useState(user.savedJobs || []);
  const [enrolledCourses, setEnrolledCourses] = useState(user.enrolledCourses || []);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Toggle save course
  const toggleSaveCourse = (courseId) => {
    setSavedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Toggle save job
  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  // Enroll in course
  const enrollInCourse = (courseId) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses(prev => [...prev, courseId]);
    }
  };

  // Mark notification as read
  const markNotificationRead = (notifId) => {
    setNotifications(prev => 
      prev.map(n => n._id === notifId ? { ...n, readStatus: true } : n)
    );
  };

  // Get course by ID
  const getCourseById = (id) => courses.find(c => c._id === id);

  // Get job by ID
  const getJobById = (id) => jobs.find(j => j._id === id);

  // Get saved courses
  const getSavedCourses = () => courses.filter(c => savedCourses.includes(c._id));

  // Get saved jobs
  const getSavedJobs = () => jobs.filter(j => savedJobs.includes(j._id));

  // Get enrolled courses
  const getEnrolledCourses = () => courses.filter(c => enrolledCourses.includes(c._id));

  // Get unread notification count
  const unreadNotificationCount = notifications.filter(n => !n.readStatus).length;

  // Get unread message count
  const unreadMessageCount = messages.reduce((acc, m) => acc + m.unread, 0);

  const value = {
    user,
    setUser,
    courses,
    setCourses,
    jobs,
    setJobs,
    trends,
    notifications,
    setNotifications,
    connections,
    messages,
    forums,
    learningPaths,
    feedback,
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
