Path Finder - Skill Training & Job Recommendation Web App
=========================================================

BSc (Hons) in IT – SE3040: Application Frameworks Team Project
--------------------------------------------------------------

### Project Overview

This full stack web application helps users discover local skill training courses and job opportunities based on trending skills in the job market. It provides personalized recommendations, progress tracking, feedback, and social interactions, similar to LinkedIn Learning or Coursera, but tailored for local skill demand.

**Key Features:**

*   Courses CRUD and categorization
    
*   Job postings CRUD and trends analysis
    
*   Personalized course/job recommendations
    
*   Resume upload & management with AWS S3
    
*   User feedback and ratings for courses
    
*   Analytics and dashboards for users and admin
    
*   Social features: saved courses, messaging, notifications
    
*   Sub-document support for user resumes, experience, education, projects, and certifications
    

### Architecture Overview

**Tech Stack:**

*   Backend: Node.js + Express.js
    
*   Frontend: React.js (functional components, Hooks)
    
*   Database: MongoDB
    
*   State Management: Context API / Redux
    
*   Styling: Tailwind CSS / Bootstrap
    
*   Deployment: Backend → Render/Railway, Frontend → Vercel/Netlify
    
*   Testing: Jest, Supertest, Artillery
    
*   File Storage: AWS S3 for resumes & media
    

**Architecture Diagram:**

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   [Frontend React App] --> REST API --> [Backend Express.js] --> [MongoDB Database] --> [AWS S3 Storage]     |                 |                |                      |     Context API/Redux   Routes/Controllers  Collections for:   Resumes & Media Files     |                 |                |     Components           Services/Logic      Users, Courses, Jobs, Trends, Recommendations, Feedback   `

### Core Components & Responsibilities

**Learning / Course Components**

1.  Course Management: CRUD for courses
    
2.  Course Categories: Organize by industry, skill, level
    
3.  Course Enrollment: Track user enrollment
    
4.  Course Progress Tracker: Monitor user progress
    
5.  Course Ratings & Feedback: Users rate/review courses
    

**Job / Market Components**

1.  Job Postings: CRUD for job opportunities
    
2.  Job Categories: Organize jobs by industry/role/location
    
3.  Job Applications: Track applications per user
    
4.  Job Alerts / Notifications: Notify users of new jobs
    
5.  Trending Skills / Jobs: Track popular skills
    

**User & Resume Management**

1.  User Profile CRUD
    
2.  Resume Upload: AWS S3 integration
    
3.  Sub-documents for experience, education, projects, and certifications
    
4.  Resume Retrieval & Deletion
    
5.  Resume metadata tracking (upload date, file URL)
    

**Recommendation & Analytics**

1.  Recommendation Engine: Suggest courses/jobs
    
2.  Skill Gap Analysis: Compare user skills vs trends
    
3.  Learning Path Builder: Personalized skill paths
    
4.  Dashboard / Analytics: Show user/admin statistics
    
5.  Reports Generation: Export trends & insights
    

**Social / Interaction Components**

1.  User Connections / Network: Add mentors/peers
    
2.  Messaging / Chat System: Peer communication
    
3.  Saved Courses / Jobs: Bookmark functionality
    
4.  Discussion Forums / Q&A: Community knowledge sharing
    
5.  Notifications / Alerts: Real-time alerts
    

### MongoDB Collections

CollectionKey FieldsDescriptionusers\_id, name, email, password, role, skills, savedCourses, resumes, experience, education, projects, certificationsUser profile & authenticationresumes\_id, fileUrl, uploadedAtUser uploaded resumescourses\_id, title, category, description, provider, level, location, rating, enrolledUsersTraining coursesjobs\_id, title, company, category, location, skillsRequired, postedDateJob postingstrends\_id, skill, demandScore, dateTrackedTrending skills/job datarecommendations\_id, userId, courseIds, jobIds, generatedAtPersonalized recommendationsfeedback\_id, userId, courseId, rating, comment, dateUser reviews for coursesapplications\_id, userId, jobId, status, appliedDateJob applicationsnotifications\_id, userId, type, message, readStatus, dateUser alerts & notificationsconnections\_id, userId, connectedUserId, status, dateConnectedUser networkmessages\_id, senderId, receiverId, message, timestampChat systemlearningPaths\_id, userId, recommendedCourses, recommendedJobsPersonalized learning pathsforums\_id, topic, creatorId, postsDiscussion topics and posts

### RESTful API Endpoints (Sample)

**User & Resume**

*   GET /user/get
    
*   PUT /user/update
    
*   PUT /user/deactivate
    
*   POST /user/resume/upload
    
*   GET /user/resume/all
    
*   DELETE /user/resume/delete
    

**Courses**

*   GET /courses
    
*   GET /courses/:id
    
*   POST /courses
    
*   PUT /courses/:id
    
*   DELETE /courses/:id
    

**Jobs**

*   GET /jobs
    
*   GET /jobs/:id
    
*   POST /jobs
    
*   PUT /jobs/:id
    
*   DELETE /jobs/:id
    

**Recommendations**

*   GET /recommendations/:userId
    
*   POST /recommendations
    

**Feedback**

*   GET /feedback/course/:courseId
    
*   POST /feedback
    
*   PUT /feedback/:id
    
*   DELETE /feedback/:id
    

**Job Applications**

*   POST /applications
    
*   GET /applications/:userId
    
*   PUT /applications/:id
    

**Notifications**

*   GET /notifications/:userId
    
*   PUT /notifications/:id
    

### Frontend Integration Notes

*   React functional components consume backend API endpoints
    
*   State Management: Context API or Redux
    
*   Session Handling: JWT stored in HttpOnly cookie or localStorage
    
*   File Uploads: Resume upload form sends multipart/form-data to /user/resume/upload
    
*   UI Components: Tailwind CSS / Bootstrap
    
*   Pages: Home/Dashboard, Course List/Detail, Job List/Detail, Recommendations, Resume Management, Profile, Analytics Dashboard
    

### Deployment Details

**Backend:** Render / Railway

*   Environment Variables: MONGO\_URI, JWT\_SECRET, AWS\_ACCESS\_KEY\_ID, AWS\_SECRET\_ACCESS\_KEY, AWS\_BUCKET\_NAME
    
*   Live API URL: https://your-backend.onrender.com
    

**Frontend:** Vercel / Netlify

*   Environment Variable: REACT\_APP\_API\_URL
    
*   Live Frontend URL: https://your-frontend.vercel.app
    

**Deployment Steps:**

1.  Clone repo & install dependencies
    
2.  Set environment variables
    
3.  Start backend server (npm run start)
    
4.  Start frontend server (npm start)
    
5.  Verify endpoints and UI
    

### Testing Plan

*   Unit Testing: Jest for controllers, services, utils
    
*   Integration Testing: Supertest for API endpoints
    
*   Performance Testing: Artillery.io for load simulation
    

### Git Workflow

*   main → Production
    
*   dev → Integration
    
*   feature/\* → Component/feature branches
    
*   Commit messages: feat: add course model, fix: correct recommendation logic, feat: AWS S3 resume upload
    

### Future Enhancements

*   ML-powered recommendation engine
    
*   Real-time notifications (WebSockets)
    
*   Advanced analytics dashboard with charts
    
*   Gamification (badges, skill levels)
    
*   Multi-file resume support and parsing for skill extraction