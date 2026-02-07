// Mock data for the Skill Training & Job Recommendation app

// Users data
export const mockUsers = [
  {
    _id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    role: 'user',
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    savedCourses: ['course1', 'course3'],
    savedJobs: ['job2'],
    enrolledCourses: ['course1'],
    progress: { course1: 65 },
    connections: 24,
    completedCourses: 8,
    appliedJobs: 5
  }
];

// Courses data
export const mockCourses = [
  {
    _id: 'course1',
    title: 'Complete React Developer Course 2024',
    description: 'Master React 18, Hooks, Redux, Next.js, and build real-world projects. This comprehensive course covers everything from basics to advanced patterns.',
    category: 'Web Development',
    level: 'Intermediate',
    provider: 'Tech Academy',
    instructor: 'Sarah Johnson',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    rating: 4.8,
    totalRatings: 2341,
    enrolledUsers: 12500,
    duration: '42 hours',
    modules: 12,
    price: 89.99,
    skills: ['React', 'Redux', 'Next.js', 'TypeScript'],
    location: 'Online',
    createdAt: '2024-01-15'
  },
  {
    _id: 'course2',
    title: 'Python for Data Science & Machine Learning',
    description: 'Learn Python programming for data analysis, visualization, and machine learning with hands-on projects using real datasets.',
    category: 'Data Science',
    level: 'Beginner',
    provider: 'DataMasters',
    instructor: 'Michael Chen',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop',
    rating: 4.9,
    totalRatings: 3567,
    enrolledUsers: 28000,
    duration: '56 hours',
    modules: 18,
    price: 99.99,
    skills: ['Python', 'Pandas', 'NumPy', 'Scikit-learn'],
    location: 'Online',
    createdAt: '2024-02-01'
  },
  {
    _id: 'course3',
    title: 'AWS Cloud Practitioner Certification',
    description: 'Prepare for AWS Certified Cloud Practitioner exam with comprehensive coverage of cloud concepts, security, and AWS services.',
    category: 'Cloud Computing',
    level: 'Beginner',
    provider: 'CloudPath Institute',
    instructor: 'Emily Rodriguez',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
    rating: 4.7,
    totalRatings: 1892,
    enrolledUsers: 8500,
    duration: '28 hours',
    modules: 10,
    price: 79.99,
    skills: ['AWS', 'Cloud Architecture', 'DevOps'],
    location: 'Online',
    createdAt: '2024-01-20'
  },
  {
    _id: 'course4',
    title: 'UI/UX Design Masterclass',
    description: 'Learn modern UI/UX design principles, Figma, prototyping, and create stunning user interfaces from scratch.',
    category: 'Design',
    level: 'Intermediate',
    provider: 'Design Pro Academy',
    instructor: 'Alex Kim',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    rating: 4.6,
    totalRatings: 1245,
    enrolledUsers: 6200,
    duration: '35 hours',
    modules: 14,
    price: 69.99,
    skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
    location: 'Online',
    createdAt: '2024-02-10'
  },
  {
    _id: 'course5',
    title: 'Full Stack JavaScript Bootcamp',
    description: 'Become a full-stack developer with Node.js, Express, MongoDB, React, and deploy production-ready applications.',
    category: 'Web Development',
    level: 'Advanced',
    provider: 'Code Masters',
    instructor: 'David Wilson',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop',
    rating: 4.8,
    totalRatings: 2100,
    enrolledUsers: 9800,
    duration: '65 hours',
    modules: 20,
    price: 129.99,
    skills: ['Node.js', 'Express', 'MongoDB', 'React'],
    location: 'Online',
    createdAt: '2024-01-05'
  },
  {
    _id: 'course6',
    title: 'Cybersecurity Fundamentals',
    description: 'Learn essential cybersecurity concepts, ethical hacking, network security, and protect systems from threats.',
    category: 'Cybersecurity',
    level: 'Beginner',
    provider: 'SecureIT Academy',
    instructor: 'James Martinez',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop',
    rating: 4.5,
    totalRatings: 987,
    enrolledUsers: 4500,
    duration: '38 hours',
    modules: 12,
    price: 89.99,
    skills: ['Network Security', 'Ethical Hacking', 'Cryptography'],
    location: 'Online',
    createdAt: '2024-02-15'
  }
];

// Jobs data
export const mockJobs = [
  {
    _id: 'job1',
    title: 'Senior React Developer',
    company: 'TechCorp Inc.',
    companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=TC',
    location: 'San Francisco, CA',
    type: 'Full-time',
    remote: 'Hybrid',
    salary: '$120,000 - $160,000',
    description: 'We are looking for an experienced React developer to join our growing team. You will work on cutting-edge web applications and collaborate with designers and backend engineers.',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'State management expertise', 'Unit testing experience'],
    skillsRequired: ['React', 'TypeScript', 'Redux', 'Node.js'],
    postedDate: '2024-02-01',
    applicants: 45,
    category: 'Engineering'
  },
  {
    _id: 'job2',
    title: 'Data Scientist',
    company: 'DataDriven Analytics',
    companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=DD',
    location: 'New York, NY',
    type: 'Full-time',
    remote: 'Remote',
    salary: '$130,000 - $180,000',
    description: 'Join our data science team to build predictive models and derive insights from large datasets. Work with state-of-the-art ML frameworks.',
    requirements: ['MS/PhD in related field', 'Python expertise', 'ML framework experience', 'SQL proficiency'],
    skillsRequired: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
    postedDate: '2024-02-03',
    applicants: 78,
    category: 'Data Science'
  },
  {
    _id: 'job3',
    title: 'Cloud Solutions Architect',
    company: 'CloudFirst Solutions',
    companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=CF',
    location: 'Seattle, WA',
    type: 'Full-time',
    remote: 'On-site',
    salary: '$150,000 - $200,000',
    description: 'Design and implement cloud infrastructure solutions for enterprise clients. Lead technical discussions and create architecture diagrams.',
    requirements: ['AWS/Azure certification', '7+ years experience', 'Enterprise architecture background', 'Strong communication skills'],
    skillsRequired: ['AWS', 'Azure', 'Kubernetes', 'Terraform'],
    postedDate: '2024-01-28',
    applicants: 32,
    category: 'Cloud'
  },
  {
    _id: 'job4',
    title: 'UX Designer',
    company: 'DesignHub',
    companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=DH',
    location: 'Austin, TX',
    type: 'Full-time',
    remote: 'Hybrid',
    salary: '$90,000 - $120,000',
    description: 'Create beautiful and intuitive user experiences for our suite of products. Conduct user research and translate insights into designs.',
    requirements: ['3+ years UX experience', 'Figma expertise', 'Portfolio required', 'User research background'],
    skillsRequired: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    postedDate: '2024-02-05',
    applicants: 56,
    category: 'Design'
  },
  {
    _id: 'job5',
    title: 'Backend Engineer',
    company: 'StartupX',
    companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=SX',
    location: 'Boston, MA',
    type: 'Full-time',
    remote: 'Remote',
    salary: '$110,000 - $150,000',
    description: 'Build scalable backend services and APIs. Work with microservices architecture and modern development practices.',
    requirements: ['4+ years backend experience', 'Node.js or Python', 'Database design', 'API development'],
    skillsRequired: ['Node.js', 'Python', 'PostgreSQL', 'Docker'],
    postedDate: '2024-02-02',
    applicants: 89,
    category: 'Engineering'
  },
  {
    _id: 'job6',
    title: 'DevOps Engineer',
    company: 'InfraCore',
    companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=IC',
    location: 'Denver, CO',
    type: 'Full-time',
    remote: 'Hybrid',
    salary: '$125,000 - $165,000',
    description: 'Manage CI/CD pipelines, infrastructure automation, and cloud deployments. Improve system reliability and performance.',
    requirements: ['5+ years DevOps experience', 'CI/CD expertise', 'Cloud platform knowledge', 'Scripting skills'],
    skillsRequired: ['Kubernetes', 'Jenkins', 'AWS', 'Python'],
    postedDate: '2024-01-30',
    applicants: 41,
    category: 'DevOps'
  }
];

// Trending skills data
export const mockTrends = [
  { _id: 'trend1', skill: 'Artificial Intelligence', demandScore: 95, growth: '+28%', category: 'Tech' },
  { _id: 'trend2', skill: 'React', demandScore: 92, growth: '+15%', category: 'Web Dev' },
  { _id: 'trend3', skill: 'Python', demandScore: 90, growth: '+12%', category: 'Programming' },
  { _id: 'trend4', skill: 'Cloud Computing', demandScore: 88, growth: '+22%', category: 'Cloud' },
  { _id: 'trend5', skill: 'Data Science', demandScore: 87, growth: '+18%', category: 'Data' },
  { _id: 'trend6', skill: 'Cybersecurity', demandScore: 85, growth: '+25%', category: 'Security' },
  { _id: 'trend7', skill: 'DevOps', demandScore: 83, growth: '+20%', category: 'Ops' },
  { _id: 'trend8', skill: 'Machine Learning', demandScore: 82, growth: '+30%', category: 'AI' }
];

// Notifications data
export const mockNotifications = [
  {
    _id: 'notif1',
    type: 'job',
    message: 'New job matching your skills: Senior React Developer at TechCorp',
    readStatus: false,
    date: '2024-02-06T10:30:00Z'
  },
  {
    _id: 'notif2',
    type: 'course',
    message: 'Your enrolled course "React Developer Course" has new content',
    readStatus: false,
    date: '2024-02-05T15:45:00Z'
  },
  {
    _id: 'notif3',
    type: 'connection',
    message: 'Sarah Johnson accepted your connection request',
    readStatus: true,
    date: '2024-02-04T09:20:00Z'
  },
  {
    _id: 'notif4',
    type: 'achievement',
    message: 'Congratulations! You completed Module 5 of React Course',
    readStatus: true,
    date: '2024-02-03T18:00:00Z'
  }
];

// Connections data
export const mockConnections = [
  {
    _id: 'conn1',
    userId: 'user2',
    name: 'Sarah Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    title: 'Senior Software Engineer',
    company: 'Google',
    status: 'connected',
    mutualConnections: 12
  },
  {
    _id: 'conn2',
    userId: 'user3',
    name: 'Michael Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    title: 'Data Scientist',
    company: 'Meta',
    status: 'connected',
    mutualConnections: 8
  },
  {
    _id: 'conn3',
    userId: 'user4',
    name: 'Emily Rodriguez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
    title: 'Cloud Architect',
    company: 'Amazon',
    status: 'pending',
    mutualConnections: 5
  }
];

// Messages data
export const mockMessages = [
  {
    _id: 'msg1',
    senderId: 'user2',
    senderName: 'Sarah Johnson',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    lastMessage: 'Thanks for connecting! Would love to discuss the React course.',
    timestamp: '2024-02-06T14:30:00Z',
    unread: 2
  },
  {
    _id: 'msg2',
    senderId: 'user3',
    senderName: 'Michael Chen',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    lastMessage: 'Have you checked out the new Python ML course?',
    timestamp: '2024-02-05T11:20:00Z',
    unread: 0
  }
];

// Forums/Discussion topics
export const mockForums = [
  {
    _id: 'forum1',
    topic: 'Best resources for learning React in 2024?',
    creatorName: 'John Doe',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    category: 'Web Development',
    replies: 24,
    views: 156,
    lastActivity: '2024-02-06T16:00:00Z'
  },
  {
    _id: 'forum2',
    topic: 'How to transition from Data Analyst to Data Scientist?',
    creatorName: 'Emily Rodriguez',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
    category: 'Career Advice',
    replies: 42,
    views: 289,
    lastActivity: '2024-02-06T12:30:00Z'
  },
  {
    _id: 'forum3',
    topic: 'AWS vs Azure vs GCP - Which to learn first?',
    creatorName: 'Michael Chen',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    category: 'Cloud Computing',
    replies: 56,
    views: 412,
    lastActivity: '2024-02-05T20:15:00Z'
  }
];

// Learning paths
export const mockLearningPaths = [
  {
    _id: 'path1',
    title: 'Full Stack Web Developer',
    description: 'Master frontend and backend development',
    courses: ['course1', 'course5'],
    skills: ['React', 'Node.js', 'MongoDB', 'Express'],
    duration: '6 months',
    progress: 35
  },
  {
    _id: 'path2',
    title: 'Data Science Professional',
    description: 'Become a data science expert',
    courses: ['course2'],
    skills: ['Python', 'Machine Learning', 'Statistics'],
    duration: '8 months',
    progress: 0
  }
];

// Course reviews/feedback
export const mockFeedback = [
  {
    _id: 'fb1',
    userId: 'user2',
    userName: 'Sarah Johnson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    courseId: 'course1',
    rating: 5,
    comment: 'Excellent course! The instructor explains concepts clearly and the projects are very practical.',
    date: '2024-02-01'
  },
  {
    _id: 'fb2',
    userId: 'user3',
    userName: 'Michael Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    courseId: 'course1',
    rating: 4,
    comment: 'Great content overall. Would love more advanced topics in future updates.',
    date: '2024-01-28'
  }
];

// Categories
export const categories = {
  courses: ['Web Development', 'Data Science', 'Cloud Computing', 'Design', 'Cybersecurity', 'Mobile Development'],
  jobs: ['Engineering', 'Data Science', 'Design', 'DevOps', 'Cloud', 'Security', 'Management'],
  levels: ['Beginner', 'Intermediate', 'Advanced']
};
