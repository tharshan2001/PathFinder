import { useApp } from '../context/AppContext';
import { Lightbulb, Sparkles, Target, TrendingUp } from 'lucide-react';
import CourseCard from '../components/courses/CourseCard';
import JobCard from '../components/jobs/JobCard';

export default function Recommendations() {
  const { courses, jobs, user, trends } = useApp();

  const recommendedCourses = courses.filter(course => 
    course.skills.some(skill => !user.skills.includes(skill))
  ).slice(0, 4);

  const recommendedJobs = jobs.filter(job =>
    job.skillsRequired.some(skill => user.skills.includes(skill))
  ).slice(0, 4);

  const skillsToLearn = trends.slice(0, 5).filter(trend => 
    !user.skills.includes(trend.skill)
  );

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #F0FDFA, #CCFBF1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Lightbulb color="#D97706" size={28} />
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#0F172A' }}>Personalized Recommendations</h1>
        </div>
        <p style={{ color: '#64748B' }}>
          Based on your skills and interests, we've curated these opportunities for you.
        </p>
      </div>

      {/* Skills to learn */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <TrendingUp color="#0D9488" size={22} />
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A' }}>Skills to Learn Next</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
          {skillsToLearn.map((trend) => (
            <div 
              key={trend._id}
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: '#F0FDFA',
                border: '1px solid #CCFBF1',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
            >
              <h3 style={{ fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>{trend.skill}</h3>
              <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>Demand Score</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, height: '6px', background: '#E2E8F0', borderRadius: '3px', marginRight: '8px' }}>
                  <div style={{ height: '100%', width: `${trend.demandScore}%`, background: '#0D9488', borderRadius: '3px' }} />
                </div>
                <span style={{ fontSize: '14px', color: '#059669', fontWeight: 500 }}>{trend.growth}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why these recommendations */}
      <div className="card" style={{ background: 'linear-gradient(90deg, #F0FDFA, transparent)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: '#CCFBF1' }}>
            <Sparkles color="#0D9488" size={24} />
          </div>
          <div>
            <h3 style={{ fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>Why These Recommendations?</h3>
            <p style={{ color: '#64748B', fontSize: '14px' }}>
              These suggestions are based on your current skills ({user.skills.join(', ')}), 
              trending market demands, and similar profiles in your industry.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended courses */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target color="#0D9488" size={22} />
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A' }}>Recommended Courses</h2>
          </div>
          <span style={{ fontSize: '14px', color: '#64748B' }}>Based on skill gaps</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {recommendedCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </div>

      {/* Recommended jobs */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target color="#0D9488" size={22} />
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A' }}>Jobs Matching Your Skills</h2>
          </div>
          <span style={{ fontSize: '14px', color: '#64748B' }}>Based on your profile</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {recommendedJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
