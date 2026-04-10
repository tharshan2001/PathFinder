import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Briefcase, MapPin, Sparkles } from 'lucide-react';

import { getRecommendedJobs } from '../services/skillProfileApi';

const RecommendedJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRecommendedJobs = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getRecommendedJobs();
      setJobs(response?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load recommended jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendedJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        <section className="bg-gradient-to-r from-[#007AFF] to-[#0056B3] rounded-xl p-6 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="inline-flex items-center gap-2 text-xs bg-white/20 border border-white/30 px-2.5 py-1 rounded-full mb-3">
                <Sparkles size={14} />
                Personalized Matches
              </p>
              <h1 className="text-2xl font-bold">Recommended Jobs</h1>
              <p className="text-sm text-white/90 mt-1">
                These jobs are matched from your skill profile and market requirements.
              </p>
            </div>
            <button
              onClick={() => navigate('/skill-gap-analysis')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#0056B3] text-sm font-semibold hover:bg-[#E5F1FF] transition"
            >
              Skill Gap Analysis
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 inline-flex items-start gap-2 w-full">
            <AlertTriangle size={16} className="mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="bg-white border rounded-xl p-10 text-center text-gray-500">Loading recommendations...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
            No recommended jobs found yet. Add more skills in your profile to improve recommendations.
          </div>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <article key={job._id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:border-[#E5F1FF] transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-xl bg-[#E5F1FF] text-[#0056B3] flex items-center justify-center font-semibold text-lg">
                      {String(job.company || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 leading-tight">{job.title}</h2>
                      <p className="text-sm text-gray-600 mt-1">{job.company}</p>
                      <p className="text-xs text-gray-500 inline-flex items-center gap-1 mt-1">
                        <MapPin size={13} />
                        {job.location || 'Location not specified'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs rounded-full bg-[#E5F1FF] border border-[#E5F1FF] text-[#0056B3] font-semibold">
                    {job.matchPercentage || 0}% match
                  </span>
                </div>

                <p className="text-sm text-gray-700 mt-4 line-clamp-3">{job.description || 'No description provided.'}</p>

                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {(job.skillsRequired || []).slice(0, 6).map((skill) => (
                      <span
                        key={`${job._id}-${skill.name}`}
                        className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="text-gray-600">{job.employmentType || 'Full-time'}</span>
                  <button
                    onClick={() => navigate(`/jobs?jobId=${encodeURIComponent(job._id)}`)}
                    className="inline-flex items-center gap-1 text-[#007AFF] font-medium hover:text-[#0056B3]"
                  >
                    Open in Job Market
                    <Briefcase size={14} />
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default RecommendedJobs;

