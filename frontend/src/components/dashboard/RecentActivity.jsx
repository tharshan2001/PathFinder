import { Activity, BookOpen, Briefcase, Award, Check } from 'lucide-react';

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'course_progress',
      icon: BookOpen,
      color: 'text-indigo-400 bg-indigo-500/20',
      title: 'Completed Module 5',
      subtitle: 'Complete React Developer Course',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'job_applied',
      icon: Briefcase,
      color: 'text-teal-400 bg-teal-500/20',
      title: 'Applied to job',
      subtitle: 'Senior React Developer at TechCorp',
      time: '5 hours ago'
    },
    {
      id: 3,
      type: 'course_enrolled',
      icon: Check,
      color: 'text-emerald-400 bg-emerald-500/20',
      title: 'Enrolled in new course',
      subtitle: 'AWS Cloud Practitioner',
      time: '1 day ago'
    },
    {
      id: 4,
      type: 'achievement',
      icon: Award,
      color: 'text-amber-400 bg-amber-500/20',
      title: 'Earned achievement',
      subtitle: 'First Course Completed',
      time: '2 days ago'
    }
  ];

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="text-indigo-400" size={20} />
        <h2 className="text-lg font-semibold">Recent Activity</h2>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${activity.color}`}>
              <activity.icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{activity.title}</p>
              <p className="text-sm text-gray-400 line-clamp-1">{activity.subtitle}</p>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
