import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Clock, Users, ArrowRight, Bookmark } from 'lucide-react';

export default function Jobs() {
  const { jobs, savedJobs, toggleSaveJob } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Engineering', 'Data Science', 'Design', 'DevOps', 'Cloud', 'Security'];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-[var(--slate-900)] mb-4">Find Your Dream Job</h1>
        
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--slate-500)]" size={18} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-12"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--slate-100)] text-[var(--slate-700)] hover:bg-[var(--slate-200)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredJobs.map(job => (
          <div key={job._id} className="card flex items-center gap-4">
            <img src={job.companyLogo} alt={job.company} className="w-16 h-16 rounded-xl" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <Link to={`/jobs/${job._id}`} className="text-lg font-semibold text-[var(--slate-900)] hover:text-[var(--primary)]">
                    {job.title}
                  </Link>
                  <p className="text-[var(--slate-700)]">{job.company}</p>
                </div>
                <button
                  onClick={() => toggleSaveJob(job._id)}
                  className={`p-2 rounded-lg transition-colors ${
                    savedJobs.includes(job._id)
                      ? 'text-[var(--primary)] bg-[var(--primary-light)]'
                      : 'text-[var(--slate-400)] hover:text-[var(--primary)]'
                  }`}
                >
                  <Bookmark size={20} fill={savedJobs.includes(job._id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-[var(--slate-500)]">
                <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                <span className="flex items-center gap-1"><Briefcase size={14} /> {job.type}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {job.remote}</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-2">
                  {job.skillsRequired.slice(0, 3).map(skill => (
                    <span key={skill} className="tag tag-primary">{skill}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-[var(--primary)]">{job.salary}</span>
                  <span className="text-sm text-[var(--slate-500)]">{job.applicants} applicants</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="card text-center py-12">
          <Briefcase size={48} className="mx-auto text-[var(--slate-300)] mb-4" />
          <p className="text-[var(--slate-500)]">No jobs found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
