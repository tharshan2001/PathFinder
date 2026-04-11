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
*   Frontend: React 19 + Vite (functional components, Hooks)
*   Database: MongoDB with Mongoose ODM
*   State Management: Zustand
*   Styling: Tailwind CSS 4
*   Deployment: Backend → Render/Railway, Frontend → Vercel/Netlify
*   Testing: Jest (Unit), Integration tests
*   Performance Testing: Artillery.io
*   File Storage: AWS S3 for resumes & media
*   API Documentation: Swagger/OpenAPI
    

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

### API Documentation (Swagger)

Interactive API documentation is available at `/api-docs`.

**Swagger Route Files** (`backend/swagger/routes/`):

| File | Description |
|------|-------------|
| `auth.js` | Authentication endpoints (login, register, logout) |
| `users.js` | User profile & resume management |
| `courses.js` | Course CRUD operations |
| `jobs.js` | Job postings CRUD |
| `enrollments.js` | Course enrollment tracking |
| `recommendations.js` | Personalized recommendations |
| `jobApplications.js` | Job application management |
| `notifications.js` | User notifications |
| `connections.js` | User connections/networking |
| `forums.js` | Discussion forums & Q&A |
| `learningPaths.js` | Personalized learning paths |
| `trendingSkills.js` | Trending skills data |
| `analytics.js` | Analytics & reporting |
| `chat.js` | Real-time messaging |

**Accessing Swagger UI:**

```bash
# Local development
http://localhost:5080/api-docs

# After deployment
https://your-backend.onrender.com/api-docs
```
    

### Frontend Integration Notes

*   React functional components consume backend API endpoints
    
*   State Management: Context API or Redux
    
*   Session Handling: JWT stored in HttpOnly cookie or localStorage
    
*   File Uploads: Resume upload form sends multipart/form-data to /user/resume/upload
    
*   UI Components: Tailwind CSS / Bootstrap
    
*   Pages: Home/Dashboard, Course List/Detail, Job List/Detail, Recommendations, Resume Management, Profile, Analytics Dashboard
    

### Deployment Details

**Backend:** Render / Railway

*   Environment Variables: MONGO_URI, JWT_SECRET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME, PORT
*   Live API URL: `https://your-backend.onrender.com`
*   Swagger Docs: `https://your-backend.onrender.com/api-docs`

**Frontend:** Vercel / Netlify

*   Environment Variable: VITE_API_URL
*   Live Frontend URL: `https://your-frontend.vercel.app`

> **Note:** Update these URLs with your actual deployment endpoints before use.
    

**Deployment Steps:**

1.  Clone repo & install dependencies
    
2.  Set environment variables
    
3.  Start backend server (npm run start)
    
4.  Start frontend server (npm start)
    
5.  Verify endpoints and UI
    

### Testing Instructions

#### Unit Testing (Jest)

```bash
cd backend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

#### Test Structure

```
backend/__tests__/
├── middleware/
│   └── auth.test.js          # Auth middleware unit tests
├── controllers/
│   ├── logic.test.js         # Controller logic tests
│   ├── userController.test.js
│   ├── experienceController.test.js
│   ├── educationController.test.js
│   ├── certificationController.test.js
│   ├── projectController.test.js
│   ├── skillController.test.js
│   ├── connectionController.test.js
│   ├── notificationController.test.js
│   ├── forumController.test.js
│   └── enrollmentController.test.js
├── integration.test.js       # Integration tests
└── setup.js                 # Test configuration

backend/tests/performance/   # Performance tests
├── smoke-test.yml           # Quick endpoint validation
├── load-test.yml            # Comprehensive load testing
├── stress-test.yml          # Break point testing
├── spike-test.yml           # Traffic spike testing
└── processors.js           # Custom test data generators
```

#### Integration Testing

Integration tests cover full API flows:

```bash
# Run all tests including integration
npm test
```

Tests cover:
- Auth: registration, login, logout, session management
- CRUD: jobs, courses, users
- Relationships: connections, enrollments, bookmarks
- Pagination, filtering, error handling

#### Performance Testing (Artillery.io)

```bash
# Install Artillery
npm install -g artillery

# Run specific tests
npm run test:smoke       # Quick validation
npm run test:load       # Load testing
npm run test:stress     # Stress testing
npm run test:spike      # Spike testing

# Run all performance tests
npm run test:performance

# Generate report
artillery run tests/performance/load-test.yml --output results/report.json
artillery report results/report.json
```

Performance Metrics:
| Metric | Target | Critical |
|--------|--------|----------|
| Response Time (avg) | < 500ms | > 1000ms |
| Response Time (p95) | < 1000ms | > 2000ms |
| Error Rate | < 1% | > 5% |

#### Performance Test Reports

Performance test reports are generated as JSON files in `tests/performance/results/`. Use Artillery reports to visualize:

```bash
artillery report results/report.json
```

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