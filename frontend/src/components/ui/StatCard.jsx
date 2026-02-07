export default function StatCard({ title, value, icon: Icon, trend, color = 'indigo' }) {
  const colorClasses = {
    indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30',
    teal: 'from-teal-500/20 to-teal-600/10 border-teal-500/30',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
    rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/30',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30'
  };

  const iconColors = {
    indigo: 'text-indigo-400',
    teal: 'text-teal-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
    emerald: 'text-emerald-400'
  };

  return (
    <div className={`card bg-gradient-to-br ${colorClasses[color]} hover-lift`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend} <span className="text-gray-500">vs last month</span>
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl bg-white/5 ${iconColors[color]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
