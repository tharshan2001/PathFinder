import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bookmark, BookOpen, Briefcase } from 'lucide-react';
import CourseCard from '../components/courses/CourseCard';
import JobCard from '../components/jobs/JobCard';

export default function SavedItems() {
  const { getSavedCourses, getSavedJobs } = useApp();
  const [activeTab, setActiveTab] = useState('courses');
  
  const savedCourses = getSavedCourses();
  const savedJobs = getSavedJobs();

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--primary-light)' }}>
          <Bookmark color="var(--primary)" size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--slate-900)' }}>Saved Items</h1>
          <p style={{ color: 'var(--slate-500)', marginTop: '4px' }}>Your bookmarked courses and jobs</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setActiveTab('courses')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: 500,
            border: activeTab === 'courses' ? '1px solid var(--primary)' : '1px solid var(--slate-200)',
            background: activeTab === 'courses' ? 'var(--primary-light)' : 'white',
            color: activeTab === 'courses' ? 'var(--primary)' : 'var(--slate-500)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <BookOpen size={18} />
          Courses ({savedCourses.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: 500,
            border: activeTab === 'jobs' ? '1px solid var(--primary)' : '1px solid var(--slate-200)',
            background: activeTab === 'jobs' ? 'var(--primary-light)' : 'white',
            color: activeTab === 'jobs' ? 'var(--primary)' : 'var(--slate-500)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Briefcase size={18} />
          Jobs ({savedJobs.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'courses' ? (
        savedCourses.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {savedCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
            <BookOpen size={48} color="var(--slate-200)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '8px' }}>No saved courses</h3>
            <p style={{ color: 'var(--slate-500)' }}>Courses you save will appear here</p>
          </div>
        )
      ) : (
        savedJobs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {savedJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
            <Briefcase size={48} color="var(--slate-200)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '8px' }}>No saved jobs</h3>
            <p style={{ color: 'var(--slate-500)' }}>Jobs you save will appear here</p>
          </div>
        )
      )}
    </div>
  );
}
