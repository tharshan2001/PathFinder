import { useApp } from '../context/AppContext';
import { 
  BarChart3, TrendingUp, BookOpen, Briefcase, 
  Users, Clock, Target, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';

export default function Analytics() {
  const { user, courses, jobs, trends, getEnrolledCourses } = useApp();
  const enrolledCourses = getEnrolledCourses();

  const weeklyData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.2 },
    { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 4.0 },
    { day: 'Fri', hours: 2.1 },
    { day: 'Sat', hours: 5.5 },
    { day: 'Sun', hours: 3.8 }
  ];

  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  const insights = [
    { label: 'Total Learning Hours', value: '42', change: '+12%', positive: true },
    { label: 'Courses Completed', value: '8', change: '+2', positive: true },
    { label: 'Skills Gained', value: '15', change: '+4', positive: true },
    { label: 'Job Match Score', value: '85%', change: '+5%', positive: true }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-gray-400">Track your learning progress and career development</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Courses Enrolled" value={enrolledCourses.length} icon={BookOpen} color="indigo" trend="+2" />
        <StatCard title="Completed Courses" value={user.completedCourses} icon={Target} color="teal" trend="+3" />
        <StatCard title="Jobs Applied" value={user.appliedJobs} icon={Briefcase} color="amber" trend="+1" />
        <StatCard title="Network Size" value={user.connections} icon={Users} color="emerald" trend="+8" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly activity chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Weekly Learning Activity</h2>
              <p className="text-sm text-gray-400">Hours spent learning this week</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <ArrowUpRight size={18} />
              <span className="font-medium">+23% vs last week</span>
            </div>
          </div>
          
          <div className="flex items-end justify-between h-48 gap-4">
            {weeklyData.map((data) => (
              <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs text-gray-400 mb-1">{data.hours}h</span>
                  <div 
                    className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all hover:from-indigo-500 hover:to-indigo-300"
                    style={{ height: `${(data.hours / maxHours) * 140}px` }}
                  />
                </div>
                <span className="text-sm text-gray-400">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick insights */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Quick Insights</h2>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div>
                  <p className="text-sm text-gray-400">{insight.label}</p>
                  <p className="text-xl font-bold">{insight.value}</p>
                </div>
                <div className={`flex items-center gap-1 ${insight.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {insight.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span className="text-sm font-medium">{insight.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill progress */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-teal-400" size={20} />
            <h2 className="text-lg font-semibold">Skill Progress</h2>
          </div>
          <div className="space-y-4">
            {user.skills.map((skill, index) => {
              const progress = 90 - index * 15;
              return (
                <div key={skill}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{skill}</span>
                    <span className="text-sm text-gray-400">{progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Market trends */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-indigo-400" size={20} />
            <h2 className="text-lg font-semibold">Market Demand Trends</h2>
          </div>
          <div className="space-y-4">
            {trends.slice(0, 5).map((trend, index) => (
              <div key={trend._id} className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-500 w-6">{index + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{trend.skill}</span>
                    <span className="text-sm text-emerald-400">{trend.growth}</span>
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
      </div>

      {/* Learning time distribution */}
      <div className="card mt-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="text-amber-400" size={20} />
          <h2 className="text-lg font-semibold">Learning Time Distribution</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {enrolledCourses.slice(0, 3).map((course) => (
            <div key={course._id} className="p-4 rounded-xl bg-white/5">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-gray-400">{course.category}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Time spent</span>
                <span className="font-medium">12.5 hrs</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
