import { useApp } from '../context/AppContext';
import { MapPin, Edit2 } from 'lucide-react';

export default function Profile() {
  const { user, getEnrolledCourses } = useApp();
  const enrolledCourses = getEnrolledCourses();

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Profile Header */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{ width: '96px', height: '96px', borderRadius: '16px' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A' }}>{user.name}</h1>
              <button className="btn btn-outline btn-sm">
                <Edit2 size={14} />
                Edit Profile
              </button>
            </div>
            <p style={{ color: '#334155', marginTop: '4px' }}>Software Developer · Full Stack</p>
            <p style={{ fontSize: '14px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
              <MapPin size={14} />
              San Francisco, CA
            </p>
            <p style={{ fontSize: '14px', color: '#0D9488', marginTop: '8px' }}>{user.connections}+ connections</p>
          </div>
        </div>

        <p style={{ marginTop: '24px', color: '#334155', lineHeight: 1.6 }}>
          Passionate about building great products. Experienced in React, Node.js, and cloud technologies. 
          Always learning and exploring new technologies.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Courses Completed', value: enrolledCourses.length, color: '#0D9488' },
          { label: 'Hours Learned', value: '47', color: '#059669' },
          { label: 'Certificates', value: '3', color: '#D97706' },
          { label: 'Profile Views', value: '142', color: '#0284C7' },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Skills */}
        <div className="card">
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>Skills</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {user.skills.map((skill) => (
              <span key={skill} style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                background: '#CCFBF1',
                color: '#0D9488',
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="card">
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>Achievements</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: '🚀', title: 'Fast Learner', desc: 'Completed 5 courses' },
              { icon: '🔥', title: '7-Day Streak', desc: 'Consistent learning' },
              { icon: '⭐', title: 'Top Performer', desc: 'Top 10% in quizzes' },
            ].map((badge) => (
              <div key={badge.title} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: '#F8FAFC' }}>
                <span style={{ fontSize: '24px' }}>{badge.icon}</span>
                <div>
                  <p style={{ fontWeight: 500, color: '#0F172A' }}>{badge.title}</p>
                  <p style={{ fontSize: '12px', color: '#64748B' }}>{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Learning */}
      {enrolledCourses.length > 0 && (
        <div className="card">
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>Currently Learning</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {enrolledCourses.slice(0, 3).map((course) => (
              <div key={course._id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{ width: '64px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                    <div style={{ flex: 1, height: '8px', background: '#E2E8F0', borderRadius: '4px' }}>
                      <div 
                        style={{ height: '100%', background: '#0D9488', borderRadius: '4px', width: `${user.progress[course._id] || 0}%` }}
                      />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#0D9488' }}>
                      {user.progress[course._id] || 0}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
