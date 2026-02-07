import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, MapPin, Briefcase, Clock, DollarSign, 
  Users, Bookmark, BookmarkCheck, Share2, ExternalLink, Building2
} from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const { getJobById, savedJobs, toggleSaveJob } = useApp();
  
  const job = getJobById(id);
  const isSaved = savedJobs.includes(id);

  if (!job) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Job not found</h2>
        <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
      </div>
    );
  }

  const daysAgo = Math.floor((new Date() - new Date(job.postedDate)) / (1000 * 60 * 60 * 24));

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Back button */}
      <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748B', textDecoration: 'none' }}>
        <ArrowLeft size={20} />
        Back to Jobs
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: '#F0FDFA', border: '1px solid #CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={job.companyLogo} alt={job.company} style={{ width: '48px', height: '48px', borderRadius: '8px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{job.title}</h1>
                <p style={{ fontSize: '18px', color: '#0D9488', fontWeight: 500 }}>{job.company}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: '#64748B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} />
                <span>{job.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={18} />
                <span>{job.type}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} />
                <span>Posted {daysAgo === 0 ? 'today' : `${daysAgo} days ago`}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} />
                <span>{job.applicants} applicants</span>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <span style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                background: job.remote === 'Remote' ? '#D1FAE5' : job.remote === 'Hybrid' ? '#FEF3C7' : '#F1F5F9',
                color: job.remote === 'Remote' ? '#059669' : job.remote === 'Hybrid' ? '#D97706' : '#64748B',
              }}>
                {job.remote}
              </span>
            </div>
          </div>

          {/* Salary */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #F0FDFA, #E0F2FE)', border: '1px solid #CCFBF1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <DollarSign size={24} color="#0D9488" />
              <div>
                <p style={{ fontSize: '14px', color: '#64748B' }}>Salary Range</p>
                <p style={{ fontSize: '24px', fontWeight: 700, color: '#0D9488' }}>{job.salary}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>About This Role</h2>
            <p style={{ color: '#334155', lineHeight: 1.6 }}>{job.description}</p>
          </div>

          {/* Requirements */}
          <div className="card">
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>Requirements</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {job.requirements.map((req, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <span style={{ fontSize: '12px', color: '#0D9488', fontWeight: 600 }}>{index + 1}</span>
                  </div>
                  <span style={{ color: '#334155' }}>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div className="card">
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>Required Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {job.skillsRequired.map((skill) => (
                <span key={skill} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, background: '#CCFBF1', color: '#0D9488' }}>{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '96px' }}>
            {/* Apply section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <button className="btn btn-primary" style={{ width: '100%' }}>
                <ExternalLink size={18} />
                Apply Now
              </button>
              
              <button onClick={() => toggleSaveJob(id)} className="btn btn-secondary" style={{ width: '100%' }}>
                {isSaved ? <><BookmarkCheck size={18} /> Saved</> : <><Bookmark size={18} /> Save Job</>}
              </button>

              <button className="btn btn-outline" style={{ width: '100%' }}>
                <Share2 size={18} />
                Share
              </button>
            </div>

            {/* Company info */}
            <div style={{ paddingTop: '24px', borderTop: '1px solid #E2E8F0' }}>
              <h3 style={{ fontWeight: 600, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} color="#0D9488" />
                About {job.company}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#334155' }}>
                <p>
                  {job.company} is a leading company in the {job.category.toLowerCase()} industry, 
                  dedicated to innovation and excellence.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B' }}>
                  <MapPin size={14} />
                  <span>{job.location}</span>
                </div>
              </div>
              <button style={{ color: '#0D9488', fontSize: '14px', marginTop: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
                View company profile →
              </button>
            </div>

            {/* Similar jobs */}
            <div style={{ paddingTop: '24px', marginTop: '24px', borderTop: '1px solid #E2E8F0' }}>
              <h3 style={{ fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>Similar Jobs</h3>
              <p style={{ fontSize: '14px', color: '#64748B' }}>
                Explore more {job.category} positions
              </p>
              <Link to="/jobs" className="btn btn-outline" style={{ width: '100%', marginTop: '16px' }}>
                Browse Similar Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
