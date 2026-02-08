import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { MapPin, Clock, Bookmark, BookmarkCheck, DollarSign, Building2 } from 'lucide-react';

export default function JobCard({ job }) {
  const { savedJobs, toggleSaveJob } = useApp();
  const isSaved = savedJobs.includes(job._id);

  const daysAgo = Math.floor((new Date() - new Date(job.postedDate)) / (1000 * 60 * 60 * 24));

  return (
    <div className="card card-hover">
      <div style={{ display: 'flex', gap: '16px' }}>
        {/* Company logo */}
        <img
          src={job.companyLogo}
          alt={job.company}
          style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px', 
            objectFit: 'cover',
            background: 'var(--slate-100)',
            flexShrink: 0,
          }}
        />

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
              <h3 style={{ fontWeight: 600, color: 'var(--slate-900)', fontSize: '15px' }}>
                {job.title}
              </h3>
            </Link>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleSaveJob(job._id);
              }}
              style={{
                padding: '6px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {isSaved ? (
                <BookmarkCheck size={18} color="var(--primary)" />
              ) : (
                <Bookmark size={18} color="var(--slate-500)" />
              )}
            </button>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--slate-700)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <Building2 size={14} />
            {job.company}
          </p>
          
          <p style={{ fontSize: '14px', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <MapPin size={14} />
            {job.location}
            <span style={{
              marginLeft: '8px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
            }}>
              {job.remote}
            </span>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
            <p style={{ fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <DollarSign size={14} />
              {job.salary}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
