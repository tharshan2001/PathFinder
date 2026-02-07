import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function TrendingSkills() {
  const { trends } = useApp();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-teal-400" size={20} />
          <h2 className="text-lg font-semibold">Trending Skills</h2>
        </div>
        <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
          View all <ArrowUpRight size={14} />
        </a>
      </div>

      <div className="space-y-4">
        {trends.slice(0, 6).map((trend, index) => (
          <div key={trend._id} className="flex items-center gap-4">
            <span className="text-lg font-bold text-gray-500 w-6">{index + 1}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{trend.skill}</span>
                <span className="text-sm text-emerald-400 font-medium">{trend.growth}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${trend.demandScore}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
