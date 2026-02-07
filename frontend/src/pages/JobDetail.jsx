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
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Job not found</h2>
        <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
      </div>
    );
  }

  const daysAgo = Math.floor((new Date() - new Date(job.postedDate)) / (1000 * 60 * 60 * 24));

  return (
    <div className="animate-fadeIn">
      {/* Back button */}
      <Link to="/jobs" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={20} />
        Back to Jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="card">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/20 to-teal-500/20 flex items-center justify-center border border-white/10">
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-12 h-12 rounded-lg"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold mb-1">{job.title}</h1>
                <p className="text-lg text-indigo-400 font-medium">{job.company}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase size={18} />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>Posted {daysAgo === 0 ? 'today' : `${daysAgo} days ago`}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>{job.applicants} applicants</span>
              </div>
            </div>

            <div className="mt-4">
              <span className={`badge ${
                job.remote === 'Remote' ? 'badge-success' :
                job.remote === 'Hybrid' ? 'badge-warning' :
                'badge-secondary'
              }`}>
                {job.remote}
              </span>
            </div>
          </div>

          {/* Salary */}
          <div className="card bg-gradient-to-r from-teal-500/10 to-indigo-500/10 border-teal-500/30">
            <div className="flex items-center gap-3">
              <DollarSign size={24} className="text-teal-400" />
              <div>
                <p className="text-sm text-gray-400">Salary Range</p>
                <p className="text-2xl font-bold text-teal-400">{job.salary}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">About This Role</h2>
            <p className="text-gray-300 leading-relaxed">{job.description}</p>
          </div>

          {/* Requirements */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            <ul className="space-y-3">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-indigo-400">{index + 1}</span>
                  </div>
                  <span className="text-gray-300">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill) => (
                <span key={skill} className="badge badge-primary">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            {/* Apply section */}
            <div className="space-y-3 mb-6">
              <button className="btn btn-primary w-full">
                <ExternalLink size={18} />
                Apply Now
              </button>
              
              <button
                onClick={() => toggleSaveJob(id)}
                className="btn btn-secondary w-full"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck size={18} />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark size={18} />
                    Save Job
                  </>
                )}
              </button>

              <button className="btn btn-outline w-full">
                <Share2 size={18} />
                Share
              </button>
            </div>

            {/* Company info */}
            <div className="pt-6 border-t border-white/10">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Building2 size={18} className="text-indigo-400" />
                About {job.company}
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  {job.company} is a leading company in the {job.category.toLowerCase()} industry, 
                  dedicated to innovation and excellence.
                </p>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-gray-400" />
                  <span>{job.location}</span>
                </div>
              </div>
              <button className="text-indigo-400 text-sm mt-4 hover:text-indigo-300">
                View company profile →
              </button>
            </div>

            {/* Similar jobs */}
            <div className="pt-6 mt-6 border-t border-white/10">
              <h3 className="font-semibold mb-4">Similar Jobs</h3>
              <p className="text-sm text-gray-400">
                Explore more {job.category} positions
              </p>
              <Link to="/jobs" className="btn btn-outline w-full mt-4">
                Browse Similar Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
