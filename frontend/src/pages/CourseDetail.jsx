import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, Star, Clock, Users, BookOpen, Play, 
  Bookmark, BookmarkCheck, Share2, Award, Check
} from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const { getCourseById, savedCourses, toggleSaveCourse, enrolledCourses, enrollInCourse, feedback, user } = useApp();
  
  const course = getCourseById(id);
  const isSaved = savedCourses.includes(id);
  const isEnrolled = enrolledCourses.includes(id);
  const courseFeedback = feedback.filter(f => f.courseId === id);
  const progress = user.progress[id] || 0;

  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Course not found</h2>
        <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
      </div>
    );
  }

  const modules = [
    { id: 1, title: 'Introduction & Setup', duration: '45 min', completed: true },
    { id: 2, title: 'Core Fundamentals', duration: '2 hrs', completed: true },
    { id: 3, title: 'Advanced Concepts', duration: '3 hrs', completed: true },
    { id: 4, title: 'Building Projects', duration: '4 hrs', completed: false },
    { id: 5, title: 'Best Practices', duration: '2 hrs', completed: false },
    { id: 6, title: 'Final Project', duration: '5 hrs', completed: false },
  ];

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Back button */}
      <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748B', textDecoration: 'none' }}>
        <ArrowLeft size={20} />
        Back to Courses
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Hero section */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '256px', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
              <button style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={28} color="white" style={{ marginLeft: '4px' }} />
                </div>
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: '#CCFBF1', color: '#0D9488', marginBottom: '12px', display: 'inline-block' }}>{course.category}</span>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>{course.title}</h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', color: '#64748B', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={18} color="#D97706" fill="#D97706" />
                  <span style={{ color: '#0F172A', fontWeight: 600 }}>{course.rating}</span>
                  <span>({course.totalRatings.toLocaleString()} ratings)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={18} />
                  <span>{course.enrolledUsers.toLocaleString()} students</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={18} />
                  <span>{course.duration}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BookOpen size={18} />
                  <span>{course.modules} modules</span>
                </div>
              </div>

              {/* Instructor */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={course.instructorAvatar} alt={course.instructor} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #0D9488' }} />
                <div>
                  <p style={{ fontSize: '14px', color: '#64748B' }}>Instructor</p>
                  <p style={{ fontWeight: 600, color: '#0F172A' }}>{course.instructor}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>About This Course</h2>
            <p style={{ color: '#334155', lineHeight: 1.6 }}>{course.description}</p>
          </div>

          {/* Skills */}
          <div className="card">
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>Skills You'll Learn</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {course.skills.map((skill) => (
                <span key={skill} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, background: '#CCFBF1', color: '#0D9488' }}>{skill}</span>
              ))}
            </div>
          </div>

          {/* Course content */}
          <div className="card">
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>Course Content</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {modules.map((module, index) => (
                <div
                  key={module.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    borderRadius: '12px',
                    background: module.completed ? '#F0FDFA' : '#F8FAFC',
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: module.completed ? '#0D9488' : '#E2E8F0',
                    color: module.completed ? 'white' : '#64748B',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}>
                    {module.completed ? <Check size={16} /> : index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 500, color: '#0F172A' }}>{module.title}</h3>
                  </div>
                  <span style={{ fontSize: '14px', color: '#64748B' }}>{module.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="card">
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>Student Reviews</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {courseFeedback.map((review) => (
                <div key={review._id} style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <img src={review.userAvatar} alt={review.userName} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 500, color: '#0F172A' }}>{review.userName}</span>
                        <span style={{ fontSize: '14px', color: '#64748B' }}>{review.date}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} color={i < review.rating ? '#D97706' : '#E2E8F0'} fill={i < review.rating ? '#D97706' : 'none'} />
                        ))}
                      </div>
                      <p style={{ color: '#334155', fontSize: '14px' }}>{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '96px' }}>
            {/* Price */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '36px', fontWeight: 700, color: '#0D9488' }}>${course.price}</span>
            </div>

            {/* Progress (if enrolled) */}
            {isEnrolled && (
              <div style={{ marginBottom: '24px', padding: '16px', borderRadius: '12px', background: '#F0FDFA', border: '1px solid #CCFBF1' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>Your Progress</span>
                  <span style={{ color: '#0D9488', fontWeight: 700 }}>{progress}%</span>
                </div>
                <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '4px' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: '#0D9488', borderRadius: '4px' }} />
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {isEnrolled ? (
                <button className="btn btn-primary" style={{ width: '100%' }}>
                  <Play size={18} />
                  Continue Learning
                </button>
              ) : (
                <button onClick={() => enrollInCourse(id)} className="btn btn-primary" style={{ width: '100%' }}>
                  Enroll Now
                </button>
              )}
              
              <button onClick={() => toggleSaveCourse(id)} className="btn btn-secondary" style={{ width: '100%' }}>
                {isSaved ? <><BookmarkCheck size={18} /> Saved</> : <><Bookmark size={18} /> Save for Later</>}
              </button>

              <button className="btn btn-outline" style={{ width: '100%' }}>
                <Share2 size={18} />
                Share
              </button>
            </div>

            {/* Course includes */}
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E2E8F0' }}>
              <h3 style={{ fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>This course includes:</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#334155' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Clock size={16} color="#0D9488" />
                  {course.duration} of content
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <BookOpen size={16} color="#0D9488" />
                  {course.modules} modules
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Award size={16} color="#0D9488" />
                  Certificate of completion
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Users size={16} color="#0D9488" />
                  Lifetime access
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
