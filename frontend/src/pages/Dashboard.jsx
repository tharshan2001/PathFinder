import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, TrendingUp, Briefcase } from 'lucide-react';
import CourseCard from '../components/courses/CourseCard';
import JobCard from '../components/jobs/JobCard';

export default function Dashboard() {
  const { user, courses, jobs, trends, getEnrolledCourses } = useApp();
  const enrolledCourses = getEnrolledCourses();

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome */}
      <div>
        <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#0F172A' }}>
          Welcome back, {user.name.split(' ')[0]} 👋
        </h1>
        <p style={{ color: '#94A3B8', marginTop: '4px' }}>Here's what's happening with your learning journey</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Courses Enrolled', value: enrolledCourses.length, color: '#B91C1C' },
          { label: 'Hours Learned', value: '47', color: '#059669' },
          { label: 'Skills Gained', value: '12', color: '#D97706' },
          { label: 'Certificates', value: '3', color: '#0284C7' },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '30px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '4px' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Continue Learning */}
      {enrolledCourses.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A' }}>Continue Learning</h2>
            <Link to="/courses" style={{ fontSize: '14px', color: '#B91C1C', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {enrolledCourses.slice(0, 2).map((course) => (
              <Link 
                key={course._id} 
                to={`/courses/${course._id}`}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  background: '#FAFAFA',
                  textDecoration: 'none',
                }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{ width: '80px', height: '56px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: 'rgba(0,0,0,0.3)', 
                    borderRadius: '8px' 
                  }}>
                    <Play size={20} color="white" fill="white" />
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</h3>
                  <p style={{ fontSize: '14px', color: '#94A3B8' }}>{course.provider}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#059669' }}>{user.progress[course._id] || 0}%</p>
                  <div style={{ width: '96px', height: '8px', background: '#E2E8F0', borderRadius: '4px', marginTop: '4px' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        background: '#059669', 
                        borderRadius: '4px',
                        width: `${user.progress[course._id] || 0}%`
                      }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Featured Courses */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A' }}>Recommended Courses</h2>
            <Link to="/courses" style={{ fontSize: '14px', color: '#B91C1C', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Browse all <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {courses.slice(0, 4).map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>

        {/* Trending Skills */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <TrendingUp size={18} color="#B91C1C" />
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A' }}>Trending Skills</h2>
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {trends.slice(0, 5).map((trend, i) => (
              <div key={trend._id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '12px', 
                  fontWeight: 700,
                  background: i === 0 ? '#B91C1C' : i === 1 ? '#D97706' : i === 2 ? '#059669' : '#F1F5F9',
                  color: i < 3 ? 'white' : '#94A3B8',
                }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>{trend.skill}</p>
                  <p style={{ fontSize: '12px', color: '#059669' }}>{trend.growth} growth</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} color="#B91C1C" />
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A' }}>Jobs For You</h2>
          </div>
          <Link to="/jobs" style={{ fontSize: '14px', color: '#B91C1C', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View all jobs <ArrowRight size={14} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {jobs.slice(0, 4).map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
