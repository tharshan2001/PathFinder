import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Briefcase, MapPin } from 'lucide-react';
import JobCard from '../components/jobs/JobCard';

export default function Jobs() {
  const { jobs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRemote, setSelectedRemote] = useState('All');

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRemote = selectedRemote === 'All' || job.remote === selectedRemote;
    return matchesSearch && matchesRemote;
  });

  return (
    <div className="animate-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A]">Jobs</h1>
        <p className="text-[#94A3B8] mt-1">Find opportunities matching your skills</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-11"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
            <input
              type="text"
              placeholder="Location"
              className="input pl-11 w-[180px]"
            />
          </div>

          {/* Remote */}
          <select
            value={selectedRemote}
            onChange={(e) => setSelectedRemote(e.target.value)}
            className="input w-auto"
          >
            <option value="All">All Work Types</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          <button className="btn btn-primary">Search</button>
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-[#94A3B8] mb-4">{filteredJobs.length} jobs found</p>
        
        <div className="grid grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="card text-center py-16">
            <Briefcase size={48} className="mx-auto text-[#E2E8F0] mb-4" />
            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No jobs found</h3>
            <p className="text-[#94A3B8]">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
