import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Star, Clock, Users, Bookmark, BookmarkCheck } from 'lucide-react';

export default function CourseCard({ course }) {
  const { savedCourses, toggleSaveCourse, enrolledCourses } = useApp();
  const isSaved = savedCourses.includes(course._id);
  const isEnrolled = enrolledCourses.includes(course._id);

  return (
    <div className="card card-hover" style={{ padding: '0', overflow: 'hidden' }}>
      {/* Thumbnail */}
      <div style={{ position: 'relative' }}>
        <img
          src={course.thumbnail}
          alt={course.title}
          style={{ width: '100%', height: '140px', objectFit: 'cover' }}
        />
        
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSaveCourse(course._id);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            padding: '8px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isSaved ? (
            <BookmarkCheck size={16} color="#0D9488" />
          ) : (
            <Bookmark size={16} color="#64748B" />
          )}
        </button>

        {isEnrolled && (
          <span style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: '#CCFBF1',
            color: '#0D9488',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
          }}>
            Enrolled
          </span>
        )}
      </div>

      <div style={{ padding: '16px' }}>
        <Link to={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
          {/* Level & Category */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              background: course.level === 'Beginner' ? '#D1FAE5' : course.level === 'Intermediate' ? '#FEF3C7' : '#CCFBF1',
              color: course.level === 'Beginner' ? '#059669' : course.level === 'Intermediate' ? '#D97706' : '#0D9488',
            }}>
              {course.level}
            </span>
            <span style={{ fontSize: '12px', color: '#64748B' }}>{course.category}</span>
          </div>

          {/* Title */}
          <h3 style={{ 
            fontWeight: 600, 
            color: '#0F172A', 
            fontSize: '15px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
          }}>
            {course.title}
          </h3>

          {/* Provider */}
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>{course.provider}</p>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={14} color="#D97706" fill="#D97706" />
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>{course.rating}</span>
            </div>
            <span style={{ fontSize: '12px', color: '#64748B' }}>({course.totalRatings.toLocaleString()})</span>
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', fontSize: '12px', color: '#64748B' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              {course.duration}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={12} />
              {course.enrolledUsers.toLocaleString()}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
