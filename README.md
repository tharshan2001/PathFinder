# Path Finder - Skill Training & Job Recommendation Web App

BSc (Hons) in IT – SE3040: Application Frameworks Team Project

---

## Project Overview

This full stack web application helps users discover local skill training courses and job opportunities based on trending skills in the job market. It provides personalized recommendations, progress tracking, feedback, and social interactions, similar to LinkedIn Learning or Coursera, but tailored for local skill demand.

### Key Features

- Courses CRUD and categorization
- Job postings CRUD and trends analysis
- Personalized course/job recommendations
- Resume upload & management with AWS S3
- User feedback and ratings for courses
- Analytics and dashboards for users and admin
- Social features: saved courses, messaging, notifications
- Sub-document support for user resumes, experience, education, projects, and certifications

---

## Architecture Overview

### Tech Stack

| Category | Technology |
|----------|------------|
| Backend | Node.js + Express.js |
| Frontend | React 19 + Vite (functional components, Hooks) |
| Database | MongoDB with Mongoose ODM |
| State Management | Zustand |
| Styling | Tailwind CSS 4 |
| Backend Deployment | Render / Railway |
| Frontend Deployment | Vercel / Netlify |
| Testing | Jest (Unit), Integration tests |
| Performance Testing | Artillery.io |
| File Storage | AWS S3 for resumes & media |
| API Documentation | Swagger/OpenAPI |

### Architecture Diagram

```
[Frontend React App] --> REST API --> [Backend Express.js] --> [MongoDB Atlas]
        |                   |                  |
   Vite Build          Routes/Controllers     Collections:
        |                   |           Users, Courses, Jobs, Trends,
        v                   v           Feedback, Applications
   Vercel/Netlify   Services/Logic      |
        |                          v
   [Cloud CDN]              [AWS S3 Storage]
```

---

## Core Components & Responsibilities

### Learning / Course Components

1. Course Management: CRUD for courses
2. Course Categories: Organize by industry, skill, level
3. Course Enrollment: Track user enrollment
4. Course Progress Tracker: Monitor user progress
5. Course Ratings & Feedback: Users rate/review courses

### Job / Market Components

1. Job Postings: CRUD for job opportunities
2. Job Categories: Organize jobs by industry/role/location
3. Job Applications: Track applications per user
4. Job Alerts / Notifications: Notify users of new jobs
5. Trending Skills / Jobs: Track popular skills

### User & Resume Management

1. User Profile CRUD
2. Resume Upload: AWS S3 integration
3. Sub-documents for experience, education, projects, and certifications
4. Resume Retrieval & Deletion
5. Resume metadata tracking (upload date, file URL)

### Recommendation & Analytics

1. Recommendation Engine: Suggest courses/jobs
2. Skill Gap Analysis: Compare user skills vs trends
3. Learning Path Builder: Personalized skill paths
4. Dashboard / Analytics: Show user/admin statistics
5. Reports Generation: Export trends & insights

### Social / Interaction Components

1. User Connections / Network: Add mentors/peers
2. Messaging / Chat System: Peer communication
3. Saved Courses / Jobs: Bookmark functionality
4. Discussion Forums / Q&A: Community knowledge sharing
5. Notifications / Alerts: Real-time alerts

---

## MongoDB Collections

| Collection | Key Fields | Description |
|------------|-----------|-------------|
| `users` | `_id, name, email, password, role, skills, savedCourses, resumes, experience, education, projects, certifications` | User profile & authentication |
| `resumes` | `_id, fileUrl, uploadedAt` | User uploaded resumes |
| `courses` | `_id, title, category, description, provider, level, location, rating, enrolledUsers` | Training courses |
| `jobs` | `_id, title, company, category, location, skillsRequired, postedDate` | Job postings |
| `trends` | `_id, skill, demandScore, date` | Trending skills/job data |
| `recommendations` | `_id, userId, courseIds, jobIds, generatedAt` | Personalized recommendations |
| `feedback` | `_id, userId, courseId, rating, comment, date` | User reviews for courses |
| `applications` | `_id, userId, jobId, status, appliedDate` | Job applications |
| `notifications` | `_id, userId, type, message, readStatus, date` | User alerts & notifications |
| `connections` | `_id, userId, connectedUserId, status, date` | Connected user network |
| `messages` | `_id, senderId, receiverId, message, timestamp` | Chat system |
| `learningPaths` | `_id, userId, recommendedCourses, recommendedJobs` | Personalized learning paths |
| `forums` | `_id, topic, creatorId, posts` | Discussion topics and posts |

---

## RESTful API Endpoints

### User & Resume

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/get` | Get current user profile |
| PUT | `/user/update` | Update user profile |
| PUT | `/user/deactivate` | Deactivate account |
| POST | `/user/resume/upload` | Upload resume |
| GET | `/user/resume/all` | Get all resumes |
| DELETE | `/user/resume/delete` | Delete a resume |

### Courses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/courses` | List all courses |
| GET | `/courses/:id` | Get course by ID |
| POST | `/courses` | Create course |
| PUT | `/courses/:id` | Update course |
| DELETE | `/courses/:id` | Delete course |

### Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jobs` | List all jobs |
| GET | `/jobs/:id` | Get job by ID |
| POST | `/jobs` | Create job |
| PUT | `/jobs/:id` | Update job |
| DELETE | `/jobs/:id` | Delete job |

### Recommendations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/recommendations/:userId` | Get user recommendations |
| POST | `/recommendations` | Generate recommendations |

### Feedback

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/feedback/course/:courseId` | Get course feedback |
| POST | `/feedback` | Submit feedback |
| PUT | `/feedback/:id` | Update feedback |
| DELETE | `/feedback/:id` | Delete feedback |

### Job Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/applications` | Submit application |
| GET | `/applications/:userId` | Get user applications |
| PUT | `/applications/:id` | Update application |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications/:userId` | Get user notifications |
| PUT | `/notifications/:id` | Update notification |

---

## API Documentation (Swagger)

Interactive API documentation is available at `/api-docs`.

### Swagger Route Files

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
| `jobMarket.js` | Job market statistics & trends |

### Accessing Swagger UI

```bash
# Local development
http://localhost:5080/api-docs

# After deployment
https://api.cloudbox.my/api-docs
```

---

## Frontend Integration Notes

- React functional components consume backend API endpoints
- State Management: Zustand (centralized state management)
- Session Handling: JWT stored in localStorage
- File Uploads: Resume upload form sends multipart/form-data to `/user/resume/upload`
- UI Components: Tailwind CSS 4
- Pages: Home/Dashboard, Course List/Detail, Job List/Detail, Recommendations, Resume Management, Profile, Analytics Dashboard, Network, Messaging, Forums

---

## Deployment Details

### Live URLs

| Service | URL |
|---------|-----|
| Frontend (Live App) | `https://cloudbox.my` |
| Backend (API) | `https://api.cloudbox.my` |
| API Documentation | `https://api.cloudbox.my/api-docs` |

---

### Backend Deployment (Render/Railway)

#### Setup Steps

1. **Create new Web Service on Render/Railway**
   - Connect your GitHub repository
   - Select the `backend` folder as root directory

2. **Configure Build Settings**
   - Build Command: `npm install`
   - Start Command: `npm start` or `node server.js`

3. **Environment Variables**

   | Variable | Value | Description |
   |----------|-------|-------------|
   | `MONGO_URI` | `mongodb+srv://...` | MongoDB Atlas connection string |
   | `JWT_SECRET` | `your-secret-key` | JWT signing secret |
   | `AWS_ACCESS_KEY_ID` | `AKIA...` | AWS S3 access key (optional) |
   | `AWS_SECRET_ACCESS_KEY` | `...` | AWS S3 secret key (optional) |
   | `AWS_BUCKET_NAME` | `pathfinder-resumes` | S3 bucket name (optional) |
   | `PORT` | `5080` | Server port |
   | `ADMIN_EMAILS` | `admin@example.com` | Admin email addresses |

4. **Deploy**
   - Click "Deploy" and wait for build completion
   - Note the deployed URL (e.g., `https://pathfinder-api.onrender.com`)

---

### Frontend Deployment (Vercel/Netlify)

#### Setup Steps

1. **Import Project**
   - Vercel: Import from GitHub at vercel.com
   - Netlify: Create new site from GitHub at app.netlify.com

2. **Configure Build Settings**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**

   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | `https://api.cloudbox.my` |
   | `VITE_ADMIN_EMAILS` | `admin@example.com` |

4. **Deploy**
   - Click "Deploy" and wait for build completion
   - Note the deployed URL (e.g., `https://pathfinder-frontend.vercel.app`)

---

### Alternative: VPS Deployment

For self-hosted deployment on a VPS (Virtual Private Server):

#### Server Requirements

| Requirement | Specification |
|-------------|---------------|
| OS | Ubuntu 20.04+ / Debian 11+ |
| RAM | 2GB+ |
| Storage | 40GB+ SSD |
| Web Server | Nginx (reverse proxy) |
| Process Manager | PM2 |
| Database | MongoDB (local or Atlas cloud) |

#### VPS Deployment Steps

1. Clone repo on VPS
2. Install dependencies: `npm install` in both backend and frontend
3. Set environment variables
4. Build frontend: `cd frontend && npm run build`
5. Configure Nginx to serve frontend static files
6. Start backend with PM2: `pm2 start backend/server.js --name pathfinder-api`
7. Configure SSL with certbot
8. Verify endpoints and UI

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/pathfinder/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

### Deployment Verification

After deployment, verify:

1. **Backend Health Check**
   ```bash
   curl https://api.cloudbox.my/api/health
   ```

2. **API Documentation**
   - Visit `https://api.cloudbox.my/api-docs` endpoint
   - Test a few endpoints

3. **Frontend Connectivity**
   - Open `https://cloudbox.my`
   - Test user registration/login
   - Verify API calls work correctly

---

## Testing Instructions

### Unit Testing (Jest)

```bash
cd backend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure

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
└── processors.js            # Custom test data generators
```

### Integration Testing

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

### Performance Testing (Artillery.io)

```bash
# Install Artillery
npm install -g artillery

# Run specific tests
npm run test:smoke       # Quick validation
npm run test:load        # Load testing
npm run test:stress      # Stress testing
npm run test:spike       # Spike testing

# Run all performance tests
npm run test:performance

# Generate report
artillery run tests/performance/load-test.yml --output results/report.json
artillery report results/report.json
```

### Performance Metrics

| Metric | Target | Critical |
|--------|--------|----------|
| Response Time (avg) | < 500ms | > 1000ms |
| Response Time (p95) | < 1000ms | > 2000ms |
| Error Rate | < 1% | > 5% |

### Performance Test Reports

Performance test reports are generated as JSON files in `tests/performance/results/`. Use Artillery reports to visualize:

```bash
artillery report results/report.json
```

---

## Course Module End-to-End Validation Plan

This plan validates the full Learning / Course Components scope through the live frontend (`/courses`) and backend APIs.

### Admin Workflow Notes

1. Admin panel route: `/courses/admin`
2. Only admin users (role `admin` or configured admin emails) can create/update/delete courses
3. Each course must include a valid `courseUrl` (`http`/`https`) added by admin
4. Learners enroll first, then use **Start Course** to open the admin-provided course link
5. Admin can delete any course review from the admin panel

### Prerequisites

1. Start backend:
   - `cd backend`
   - `npm install`
   - `npm run dev`

2. Start frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

3. Register/login with a valid user

### Validation Scope Matrix

1. **Course Management (CRUD)**
   - Create a course from the Courses page form
   - Edit same course from the course card
   - Delete same course and verify list refresh

2. **Course Categories (industry / skill / level)**
   - Create courses with different categories and levels
   - Use `industry`, `level`, and `skill` filters
   - Verify filtered data returns expected cards

3. **Course Enrollment**
   - Enroll into a course from course card
   - Verify enrollment appears in user enrollment list

4. **Course Progress Tracker**
   - Update progress to 25, 50, 75, and 100
   - Verify visual progress bar and `completed` behavior at 100

5. **Course Ratings & Feedback**
   - Submit feedback after enrolling
   - Update and delete feedback
   - Verify course average rating and review count update correctly

### API Negative Test Cases

| Test Case | Expected Response |
|-----------|------------------|
| Create course with missing required fields | `400` |
| Enroll same user in same course twice | `409` |
| Update progress with value `< 0` or `> 100` | `400` |
| Submit feedback without enrollment | `403` |
| Submit duplicate feedback for same course/user | `409` |
| Update/Delete another user's feedback | `403` |

### Exit Criteria

All validation cases pass and all five course components behave correctly from frontend UI to MongoDB persistence.

---

## Git Workflow

| Branch | Purpose |
|--------|---------|
| `main` | Production |
| `dev` | Integration |
| `feature/*` | Component/feature branches |

### Commit Message Format

```
feat: add course model
fix: correct recommendation logic
feat: AWS S3 resume upload
```

---

## Future Enhancements

- ML-powered recommendation engine
- Real-time notifications (WebSockets)
- Advanced analytics dashboard with charts
- Gamification (badges, skill levels)
- Multi-file resume support and parsing for skill extraction
