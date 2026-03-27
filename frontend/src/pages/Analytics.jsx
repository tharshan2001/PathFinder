import { useApp } from '../context/AppContext';
import { TrendingUp, BarChart3, Target, Zap } from 'lucide-react';

export default function Analytics() {
  const { trends, user } = useApp();

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-[var(--slate-900)]">Skill Analytics</h1>
        <p className="text-[var(--slate-500)] mt-2">Track market trends and skill demand</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <div className="w-12 h-12 rounded-xl bg-[var(--primary-light)] flex items-center justify-center mb-3">
            <TrendingUp size={24} className="text-[var(--primary)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--slate-900)]">{trends[0].growth}</p>
          <p className="text-sm text-[var(--slate-500)]">Top Growing Skill</p>
        </div>
        <div className="card">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
            <BarChart3 size={24} className="text-[var(--blue)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--slate-900)]">{user.skills.length}</p>
          <p className="text-sm text-[var(--slate-500)]">Skills Added</p>
        </div>
        <div className="card">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
            <Target size={24} className="text-[var(--purple)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--slate-900)]">85%</p>
          <p className="text-sm text-[var(--slate-500)]">Profile Completion</p>
        </div>
        <div className="card">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
            <Zap size={24} className="text-[var(--amber)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--slate-900)]">142</p>
          <p className="text-sm text-[var(--slate-500)]">Profile Views</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-[var(--slate-900)] mb-4">Skill Demand Trends</h2>
        <div className="space-y-4">
          {trends.map(trend => (
            <div key={trend._id} className="flex items-center gap-4">
              <div className="w-32">
                <p className="font-medium text-[var(--slate-900)]">{trend.skill}</p>
                <p className="text-xs text-[var(--slate-500)]">{trend.category}</p>
              </div>
              <div className="flex-1 h-4 bg-[var(--slate-100)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--emerald)] rounded-full"
                  style={{ width: `${trend.demandScore}%` }}
                />
              </div>
              <div className="w-20 text-right">
                <p className="font-semibold text-[var(--emerald)]">{trend.growth}</p>
                <p className="text-xs text-[var(--slate-500)]">demand</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
