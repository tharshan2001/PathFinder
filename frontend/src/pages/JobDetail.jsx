import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapPin, Briefcase, Clock, Users, ArrowLeft, Check, Send, Bookmark } from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const { getJobById, savedJobs, toggleSaveJob } = useApp();
  const job = getJobById(id);
  const isSaved = savedJobs.includes(id);

  if (!job) {
    return <div className="card">Job not found</div>;
  }

  return (
    <div className="space-y-6">
      <Link to="/jobs" className="text-[var(--primary)] hover:underline flex items-center gap-1">
        <ArrowLeft size={16} /> Back to Jobs
      </Link>

      <div className="card">
        <div className="flex items-start gap-6">
          <img src={job.companyLogo} alt={job.company} className="w-20 h-20 rounded-xl" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--slate-900)]">{job.title}</h1>
            <p className="text-lg text-[var(--slate-700)] mt-1">{job.company}</p>
            
            <div className="flex items-center gap-4 mt-3 text-[var(--slate-500)]">
              <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
              <span className="flex items-center gap-1"><Briefcase size={16} /> {job.type}</span>
              <span className="flex items-center gap-1"><Clock size={16} /> {job.remote}</span>
            </div>

            <p className="text-xl font-semibold text-[var(--primary)] mt-4">{job.salary}</p>
            <p className="text-sm text-[var(--slate-500)] mt-1">{job.applicants} applicants</p>

            <div className="flex items-center gap-4 mt-6">
              <button className="btn btn-primary">
                <Send size={18} /> Apply Now
              </button>
              <button 
                onClick={() => toggleSaveJob(job._id)}
                className={`btn ${isSaved ? 'btn-secondary' : 'btn-outline'}`}
              >
                <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                {isSaved ? 'Saved' : 'Save Job'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-[var(--slate-900)] mb-4">Job Description</h2>
        <p className="text-[var(--slate-700)] leading-relaxed">{job.description}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-[var(--slate-900)] mb-4">Requirements</h2>
        <ul className="space-y-2">
          {job.requirements.map((req, index) => (
            <li key={index} className="flex items-center gap-3 text-[var(--slate-700)]">
              <Check size={16} className="text-[var(--primary)]" />
              {req}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-[var(--slate-900)] mb-4">Required Skills</h2>
        <div className="flex flex-wrap gap-2">
          {job.skillsRequired.map(skill => (
            <span key={skill} className="tag tag-primary">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
