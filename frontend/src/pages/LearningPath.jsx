import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Route, Target, BookOpen, Briefcase, ArrowRight, Check, Lock } from 'lucide-react';

export default function LearningPath() {
  const { learningPaths, courses } = useApp();

  const activePath = learningPaths[0];
  const pathCourses = activePath.courses.map(id => courses.find(c => c._id === id)).filter(Boolean);

  const milestones = [
    { id: 1, title: 'Frontend Fundamentals', completed: true, courses: ['HTML/CSS', 'JavaScript'] },
    { id: 2, title: 'React Development', completed: true, courses: ['React Basics', 'Redux'] },
    { id: 3, title: 'Backend Development', completed: false, current: true, courses: ['Node.js', 'Express'] },
    { id: 4, title: 'Database & API', completed: false, courses: ['MongoDB', 'REST APIs'] },
    { id: 5, title: 'Deployment & DevOps', completed: false, courses: ['Docker', 'CI/CD'] }
  ];

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--slate-50), #E0F2FE)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--blue))' }}>
            <Route color="white" size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '8px' }}>{activePath.title}</h1>
            <p style={{ color: 'var(--slate-500)', marginBottom: '16px' }}>{activePath.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '14px', color: 'var(--slate-700)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={16} color="var(--primary)" />
                {activePath.duration} program
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={16} color="var(--primary)" />
                {activePath.courses.length} courses
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={16} color="var(--amber)" />
                Career-focused
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '14px', color: 'var(--slate-500)', marginBottom: '4px' }}>Your Progress</p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary)' }}>{activePath.progress}%</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Main content - Learning path */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '24px' }}>Your Learning Journey</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {milestones.map((milestone, index) => (
              <div key={milestone.id} style={{ position: 'relative' }}>
                {/* Connector line */}
                {index < milestones.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    left: '23px',
                    top: '56px',
                    width: '2px',
                    height: 'calc(100% + 24px)',
                    background: milestone.completed ? 'var(--primary)' : 'var(--slate-200)',
                  }} />
                )}
                
                <div className="card" style={{ border: milestone.current ? '2px solid var(--primary)' : undefined }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: milestone.completed ? 'var(--primary)' : milestone.current ? 'var(--primary)' : 'var(--slate-200)',
                    }}>
                      {milestone.completed ? (
                        <Check size={24} color="white" />
                      ) : milestone.current ? (
                        <span style={{ color: 'white', fontWeight: 700 }}>{milestone.id}</span>
                      ) : (
                        <Lock size={18} color="var(--slate-500)" />
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <h3 style={{ fontWeight: 600, fontSize: '16px', color: 'var(--slate-900)' }}>{milestone.title}</h3>
                        {milestone.completed && (
                          <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: '#D1FAE5', color: 'var(--emerald)' }}>Completed</span>
                        )}
                        {milestone.current && (
                          <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: 'var(--primary-light)', color: 'var(--primary)' }}>In Progress</span>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                        {milestone.courses.map((course) => (
                          <span key={course} style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '13px', background: 'var(--slate-100)', color: 'var(--slate-500)' }}>
                            {course}
                          </span>
                        ))}
                      </div>

                      {milestone.current && (
                        <button className="btn btn-primary">
                          Continue Learning
                          <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Overall progress */}
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontWeight: 600, color: 'var(--slate-900)', marginBottom: '16px' }}>Overall Progress</h3>
            <div style={{ position: 'relative', width: '128px', height: '128px', margin: '0 auto 16px' }}>
              <svg width="128" height="128" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="64" cy="64" r="56" fill="none" stroke="var(--slate-200)" strokeWidth="12" />
                <circle cx="64" cy="64" r="56" fill="none" stroke="var(--primary)" strokeWidth="12"
                  strokeDasharray={`${activePath.progress * 3.52} 352`} strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary)' }}>{activePath.progress}%</span>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--slate-500)' }}>2 of 5 milestones completed</p>
          </div>

          {/* Skills you'll gain */}
          <div className="card">
            <h3 style={{ fontWeight: 600, color: 'var(--slate-900)', marginBottom: '16px' }}>Skills You'll Gain</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {activePath.skills.map((skill) => (
                <span key={skill} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended courses */}
          <div className="card">
            <h3 style={{ fontWeight: 600, color: 'var(--slate-900)', marginBottom: '16px' }}>Continue With</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pathCourses.slice(0, 2).map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'var(--slate-50)',
                    textDecoration: 'none',
                  }}
                >
                  <img src={course.thumbnail} alt={course.title} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontWeight: 500, fontSize: '14px', color: 'var(--slate-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--slate-500)' }}>{course.duration}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
