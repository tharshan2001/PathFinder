import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, BarChart3, CheckCircle2, Sparkles, TriangleAlert } from 'lucide-react';
import Navbar from '../components/Navbar';
import { getSkillGapAnalysis } from '../services/skillProfileApi';

const SkillGapAnalysis = () => {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnalysis = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getSkillGapAnalysis();
      setAnalysis(response?.data || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load skill gap analysis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysis();
  }, []);

  const userSkills = analysis?.userSkills || [];
  const topMarketSkills = analysis?.topMarketSkills || [];
  const missingSkills = analysis?.missingSkills || [];
  const weakSkills = analysis?.weakSkills || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        <section className="bg-gradient-to-r from-[#007AFF] to-[#0056B3] rounded-xl p-6 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="inline-flex items-center gap-2 text-xs bg-white/20 border border-white/30 px-2.5 py-1 rounded-full mb-3">
                <Sparkles size={14} />
                Market Readiness
              </p>
              <h1 className="text-2xl font-bold">Skill Gap Analysis</h1>
              <p className="text-sm text-white/90 mt-1">
                See where you are strong, what the market needs, and what to improve next.
              </p>
            </div>
            <button
              onClick={() => navigate('/recommended-courses')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#0056B3] text-sm font-semibold hover:bg-[#E5F1FF] transition"
            >
              Recommended Courses
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
          <div className="bg-white border rounded-xl p-10 text-center text-gray-500">Analyzing your skill profile...</div>
        ) : !analysis ? (
          <div className="bg-white border rounded-xl p-10 text-center text-gray-500">No analysis data available.</div>
        ) : (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Gap Score</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{analysis.gapScore || 0}</p>
              </div>
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Your Skills</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{userSkills.length}</p>
              </div>
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Missing Skills</p>
                <p className="text-2xl font-bold text-amber-600 mt-2">{missingSkills.length}</p>
              </div>
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Weak Skills</p>
                <p className="text-2xl font-bold text-red-600 mt-2">{weakSkills.length}</p>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white border rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#007AFF]" />
                  Your Current Skills
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {userSkills.length === 0 ? (
                    <p className="text-sm text-gray-500">No skills found.</p>
                  ) : (
                    userSkills.map((skill) => (
                      <span key={skill.name} className="text-xs px-2.5 py-1 rounded-full bg-[#E5F1FF] text-[#0056B3] border border-[#E5F1FF]">
                        {skill.name} - {skill.level}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white border rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 size={18} className="text-[#007AFF]" />
                  Top Market Skills
                </h2>
                <div className="mt-4 space-y-3">
                  {topMarketSkills.length === 0 ? (
                    <p className="text-sm text-gray-500">No market skills data found.</p>
                  ) : (
                    topMarketSkills.map((skill, index) => {
                      const percent = Math.max(10, Math.min(100, Number(skill.demandCount || 0) * 10));
                      return (
                        <div key={`${skill.name}-${index}`}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-800 font-medium capitalize">{skill.name}</span>
                            <span className="text-gray-500">{skill.demandCount} jobs</span>
                          </div>
                          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#007AFF] rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white border rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <TriangleAlert size={18} className="text-amber-600" />
                  Missing Skills
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {missingSkills.length === 0 ? (
                    <p className="text-sm text-gray-500">Great! No high-demand skills are missing.</p>
                  ) : (
                    missingSkills.map((skill) => (
                      <span key={skill.name} className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                        {skill.name} ({skill.demandCount})
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white border rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-600" />
                  Weak Skills
                </h2>
                <div className="mt-4 space-y-2">
                  {weakSkills.length === 0 ? (
                    <p className="text-sm text-gray-500">Nice work. No weak skills detected in top-demand areas.</p>
                  ) : (
                    weakSkills.map((skill) => (
                      <div key={skill.name} className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm">
                        <span className="font-medium text-red-700 capitalize">{skill.name}</span>
                        <span className="text-red-600"> - Recommended level: {skill.recommendedLevel}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default SkillGapAnalysis;

