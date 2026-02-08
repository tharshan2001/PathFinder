import { useApp } from '../context/AppContext';
import { 
  BarChart3, TrendingUp, BookOpen, Briefcase, 
  Users, Clock, Target, ArrowUpRight
} from 'lucide-react';

export default function Analytics() {
  const { user, trends, getEnrolledCourses } = useApp();
  const enrolledCourses = getEnrolledCourses();

  const weeklyData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.2 },
    { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 4.0 },
    { day: 'Fri', hours: 2.1 },
    { day: 'Sat', hours: 5.5 },
    { day: 'Sun', hours: 3.8 }
  ];

  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  const insights = [
    { label: 'Total Learning Hours', value: '42', change: '+12%' },
    { label: 'Courses Completed', value: '8', change: '+2' },
    { label: 'Skills Gained', value: '15', change: '+4' },
    { label: 'Job Match Score', value: '85%', change: '+5%' }
  ];

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--slate-900)' }}>Analytics</h1>
        <p style={{ color: 'var(--slate-500)', marginTop: '4px' }}>Track your learning progress and career development</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Courses Enrolled', value: enrolledCourses.length, icon: BookOpen, color: 'var(--primary)' },
          { label: 'Completed', value: user.completedCourses, icon: Target, color: 'var(--emerald)' },
          { label: 'Jobs Applied', value: user.appliedJobs, icon: Briefcase, color: 'var(--amber)' },
          { label: 'Network', value: user.connections, icon: Users, color: 'var(--blue)' }
        ].map((stat) => (
          <div key={stat.label} className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <stat.icon size={20} color={stat.color} />
              <span style={{ fontSize: '12px', color: 'var(--emerald)', fontWeight: 600 }}>+12%</span>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            <p style={{ fontSize: '14px', color: 'var(--slate-500)', marginTop: '4px' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Weekly activity chart */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--slate-900)' }}>Weekly Learning Activity</h2>
              <p style={{ fontSize: '14px', color: 'var(--slate-500)', marginTop: '4px' }}>Hours spent learning this week</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--emerald)' }}>
              <ArrowUpRight size={18} />
              <span style={{ fontWeight: 500 }}>+23% vs last week</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', gap: '16px' }}>
            {weeklyData.map((data) => (
              <div key={data.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--slate-500)' }}>{data.hours}h</span>
                <div 
                  style={{ 
                    width: '100%', 
                    borderRadius: '8px 8px 0 0',
                    background: 'linear-gradient(to top, var(--primary), var(--primary-hover))',
                    height: `${(data.hours / maxHours) * 140}px`,
                    transition: 'height 0.3s ease'
                  }}
                />
                <span style={{ fontSize: '14px', color: 'var(--slate-500)' }}>{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick insights */}
        <div className="card">
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '16px' }}>Quick Insights</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {insights.map((insight) => (
              <div key={insight.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '12px', background: 'var(--slate-50)' }}>
                <div>
                  <p style={{ fontSize: '14px', color: 'var(--slate-500)' }}>{insight.label}</p>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--slate-900)' }}>{insight.value}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--emerald)' }}>
                  <ArrowUpRight size={16} />
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{insight.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Skill progress */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <TrendingUp size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--slate-900)' }}>Skill Progress</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {user.skills.map((skill, index) => {
              const progress = 90 - index * 15;
              return (
                <div key={skill}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--slate-900)' }}>{skill}</span>
                    <span style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 500 }}>{progress}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--slate-200)', borderRadius: '4px' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'var(--primary)', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Market trends */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <BarChart3 size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--slate-900)' }}>Market Demand Trends</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {trends.slice(0, 5).map((trend, index) => (
              <div key={trend._id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  width: '24px', 
                  fontSize: '14px', 
                  fontWeight: 700, 
                  color: index < 3 ? 'var(--primary)' : 'var(--slate-500)' 
                }}>
                  {index + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--slate-900)' }}>{trend.skill}</span>
                    <span style={{ fontSize: '14px', color: 'var(--emerald)', fontWeight: 500 }}>{trend.growth}</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--slate-200)', borderRadius: '4px' }}>
                    <div style={{ height: '100%', width: `${trend.demandScore}%`, background: 'linear-gradient(90deg, var(--primary), var(--primary-hover))', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning time distribution */}
      {enrolledCourses.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <Clock size={20} color="var(--amber)" />
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--slate-900)' }}>Learning Time Distribution</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {enrolledCourses.slice(0, 3).map((course) => (
              <div key={course._id} style={{ padding: '16px', borderRadius: '12px', background: 'var(--slate-50)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontWeight: 500, fontSize: '14px', color: 'var(--slate-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--slate-500)' }}>{course.category}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Time spent</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>12.5 hrs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
