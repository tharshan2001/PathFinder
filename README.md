# Path Finder - Skill Training & Job Recommendation Web App

## BSc (Hons) in IT – SE3040: Application Frameworks Team Project

### Project Overview
This full stack web application helps users discover local skill training courses and job opportunities based on trending skills in the job market. It provides personalized recommendations, progress tracking, and feedback, similar to LinkedIn Learning or Coursera, but tailored for local skill demand.

**Key Features:**
- Courses CRUD and categorization
- Job postings CRUD and trends analysis
- Personalized course/job recommendations
- User feedback and ratings for courses
- Analytics and dashboards for users and admin
- Social features: saved courses, messaging, notifications

---

### Architecture Overview
**Tech Stack:**
- Backend: Node.js + Express.js
- Frontend: React.js (functional components, Hooks)
- Database: MongoDB
- State Management: Context API (or Redux)
- Styling: Tailwind CSS / Bootstrap
- Deployment: Backend → Render/Railway, Frontend → Vercel/Netlify
- Testing: Jest, Supertest, Artillery

**Architecture Diagram:**

```
[Frontend React App] --> REST API --> [Backend Express.js] --> [MongoDB Database]
	   |                 |                |
   Context API/Redux   Routes/Controllers   Collections for:
	   |                 |                |
   Components           Services/Logic      Courses, Jobs, Trends, Recommendations, Feedback, Users
```

---

### Core Components & Responsibilities

**Learning / Course Components**
1. Course Management: CRUD for courses
2. Course Categories: Organize by industry, skill, level
3. Course Enrollment: Track user enrollment
4. Course Progress Tracker: Monitor user progress
5. Course Ratings & Feedback: Users rate/review courses

**Job / Market Components**
1. Job Postings: CRUD for job opportunities
2. Job Categories: Organize jobs by industry/role/location
3. Job Applications: Track applications per user
4. Job Alerts / Notifications: Notify users of new jobs
5. Trending Skills / Jobs: Track popular skills

**Recommendation & Analytics**
1. Recommendation Engine: Suggest courses/jobs
2. Skill Gap Analysis: Compare user skills vs trends
3. Learning Path Builder: Personalized skill paths
4. Dashboard / Analytics: Show user/admin statistics
5. Reports Generation: Export trends & insights

**Social / Interaction Components**
1. User Connections / Network: Add mentors/peers
2. Messaging / Chat System: Peer communication
3. Saved Courses / Jobs: Bookmark functionality
4. Discussion Forums / Q&A: Community knowledge sharing
5. Notifications / Alerts: Real-time alerts

---

### MongoDB Collections

| Collection      | Key Fields                                      | Description                       |
|-----------------|-------------------------------------------------|-----------------------------------|
| users           | _id, name, email, password, role, skills, savedCourses | User profile & authentication     |
| courses         | _id, title, category, description, provider, level, location, rating, enrolledUsers | Training courses                  |
| jobs            | _id, title, company, category, location, skillsRequired, postedDate | Job postings                      |
| trends          | _id, skill, demandScore, dateTracked            | Trending skills/job data           |
| recommendations | _id, userId, courseIds, jobIds, generatedAt     | Personalized recommendations       |
| feedback        | _id, userId, courseId, rating, comment, date    | User reviews for courses           |
| applications    | _id, userId, jobId, status, appliedDate         | Job applications                   |
| notifications   | _id, userId, type, message, readStatus, date    | User alerts & notifications        |
| connections     | _id, userId, connectedUserId, status, dateConnected | User network                  |
| messages        | _id, senderId, receiverId, message, timestamp   | Chat system                        |
| learningPaths   | _id, userId, recommendedCourses, recommendedJobs | Personalized learning paths        |
| forums          | _id, topic, creatorId, posts                    | Discussion topics and posts        |

---

### RESTful API Endpoints (Sample)

**Courses**
- GET /courses
- GET /courses/:id
- POST /courses
- PUT /courses/:id
- DELETE /courses/:id

**Jobs**
- GET /jobs
- GET /jobs/:id
- POST /jobs
- PUT /jobs/:id
- DELETE /jobs/:id

**Recommendations**
- GET /recommendations/:userId
- POST /recommendations

**Feedback**
- GET /feedback/course/:courseId
- POST /feedback
- PUT /feedback/:id
- DELETE /feedback/:id

**Job Applications**
- POST /applications
- GET /applications/:userId
- PUT /applications/:id

**Notifications**
- GET /notifications/:userId
- PUT /notifications/:id

---

### Frontend Integration Notes
- React functional components consume backend API endpoints
- State Management: Context API or Redux
- Session Handling: JWT stored in HttpOnly cookie or localStorage
- UI Components: Tailwind CSS / Bootstrap
- Pages: Home/Dashboard, Course List/Detail, Job List/Detail, Recommendations, Profile, Analytics Dashboard

---

### Deployment Details

**Backend:** Render / Railway
- Environment Variables: `MONGO_URI`, `JWT_SECRET`
- Live API URL: `https://your-backend.onrender.com`

**Frontend:** Vercel / Netlify
- Environment Variable: `REACT_APP_API_URL`
- Live Frontend URL: `https://your-frontend.vercel.app`

**Deployment Steps:**
1. Clone repo & install dependencies
2. Set environment variables
3. Start backend server (`npm run start`)
4. Start frontend server (`npm start`)
5. Verify endpoints and UI

---

### Testing Plan
- Unit Testing: Jest for controllers, services, utils
- Integration Testing: Supertest for API endpoints
- Performance Testing: Artillery.io for load simulation

---

### Git Workflow
- `main` → Production
- `dev` → Integration
- `feature/*` → Component/feature branches
- Commit messages: `feat: add course model`, `fix: correct recommendation logic`

---

### Future Enhancements
- ML-powered recommendation engine
- Real-time notifications (WebSockets)
- Advanced analytics dashboard with charts
- Gamification (badges, skill levels)
