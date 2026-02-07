import { useApp } from '../context/AppContext';
import { MapPin, Edit2, Award, Zap } from 'lucide-react';

export default function Profile() {
  const { user, getEnrolledCourses } = useApp();
  const enrolledCourses = getEnrolledCourses();

  return (
    <div className="animate-in space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-start gap-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-2xl"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[#0F172A]">{user.name}</h1>
              <button className="btn btn-outline btn-sm">
                <Edit2 size={14} />
                Edit Profile
              </button>
            </div>
            <p className="text-[#334155] mt-1">Software Developer · Full Stack</p>
            <p className="text-sm text-[#94A3B8] flex items-center gap-1 mt-2">
              <MapPin size={14} />
              San Francisco, CA
            </p>
            <p className="text-sm text-[#0284C7] mt-2">{user.connections}+ connections</p>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-6 text-[#334155] leading-relaxed">
          Passionate about building great products. Experienced in React, Node.js, and cloud technologies. 
          Always learning and exploring new technologies.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Courses Completed', value: enrolledCourses.length, color: '#B91C1C' },
          { label: 'Hours Learned', value: '47', color: '#059669' },
          { label: 'Certificates', value: '3', color: '#D97706' },
          { label: 'Profile Views', value: '142', color: '#0284C7' },
        ].map((stat) => (
          <div key={stat.label} className="card text-center">
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-sm text-[#94A3B8] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Skills */}
        <div className="card">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span key={skill} className="tag tag-primary">{skill}</span>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="card">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Achievements</h2>
          <div className="space-y-3">
            {[
              { icon: '🚀', title: 'Fast Learner', desc: 'Completed 5 courses' },
              { icon: '🔥', title: '7-Day Streak', desc: 'Consistent learning' },
              { icon: '⭐', title: 'Top Performer', desc: 'Top 10% in quizzes' },
            ].map((badge) => (
              <div key={badge.title} className="flex items-center gap-3 p-3 rounded-xl bg-[#FAFAFA]">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="font-medium text-[#0F172A]">{badge.title}</p>
                  <p className="text-xs text-[#94A3B8]">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Learning */}
      {enrolledCourses.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Currently Learning</h2>
          <div className="space-y-4">
            {enrolledCourses.slice(0, 3).map((course) => (
              <div key={course._id} className="flex items-center gap-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-16 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#0F172A] line-clamp-1">{course.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex-1 h-2 bg-[#E2E8F0] rounded-full">
                      <div 
                        className="h-full bg-[#059669] rounded-full"
                        style={{ width: `${user.progress[course._id] || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[#059669]">
                      {user.progress[course._id] || 0}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
