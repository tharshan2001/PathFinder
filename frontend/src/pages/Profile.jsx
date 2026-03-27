import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Edit2, 
  Mail, 
  Phone, 
  Globe, 
  Linkedin,
  Github,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
  Plus
} from 'lucide-react';

export default function Profile() {
  const { user, getEnrolledCourses } = useApp();
  const enrolledCourses = getEnrolledCourses();

  const experience = [
    {
      company: 'TechCorp Inc.',
      title: 'Senior Software Developer',
      location: 'San Francisco, CA',
      period: '2022 - Present',
      description: 'Leading frontend development team, implementing scalable React applications.'
    },
    {
      company: 'StartupXYZ',
      title: 'Full Stack Developer',
      location: 'Remote',
      period: '2020 - 2022',
      description: 'Built and maintained multiple client projects using React, Node.js, and MongoDB.'
    }
  ];

  const education = [
    {
      school: 'University of California',
      degree: 'Bachelor of Science in Computer Science',
      period: '2016 - 2020',
      location: 'Berkeley, CA'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-start gap-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-2xl border-4 border-[var(--primary-light)]"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--slate-900)]">{user.name}</h1>
                <p className="text-[var(--slate-700)] mt-1">Senior Software Developer at TechCorp Inc.</p>
                <p className="flex items-center gap-2 text-sm text-[var(--slate-500)] mt-2">
                  <MapPin size={16} />
                  San Francisco, CA · Open to work
                </p>
              </div>
              <button className="btn btn-outline btn-sm">
                <Edit2 size={14} />
                Edit Profile
              </button>
            </div>
            
            <div className="flex items-center gap-6 mt-4 text-sm">
              <p className="text-[var(--primary)] font-medium">{user.connections}+ connections</p>
              <p className="text-[var(--slate-500)]">{user.completedCourses} courses completed</p>
            </div>

            <div className="flex gap-3 mt-4">
              <a href="#" className="text-[var(--slate-500)] hover:text-[var(--primary)]">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-[var(--slate-500)] hover:text-[var(--primary)]">
                <Github size={20} />
              </a>
              <a href="#" className="text-[var(--slate-500)] hover:text-[var(--primary)]">
                <Globe size={20} />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-6 text-[var(--slate-700)] leading-relaxed">
          Passionate about building great products and solving complex problems. Experienced in React, Node.js, and cloud technologies. 
          Always learning and exploring new technologies. Looking for opportunities to work on impactful projects with a great team.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-[var(--primary)]">{enrolledCourses.length}</p>
          <p className="text-sm text-[var(--slate-500)]">Courses Enrolled</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-[var(--emerald)]">47</p>
          <p className="text-sm text-[var(--slate-500)]">Hours Learned</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-[var(--amber)]">3</p>
          <p className="text-sm text-[var(--slate-500)]">Certificates</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-[var(--blue)]">142</p>
          <p className="text-sm text-[var(--slate-500)]">Profile Views</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Skills */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--slate-900)]">Skills</h2>
            <button className="text-[var(--primary)] hover:underline text-sm flex items-center gap-1">
              <Plus size={14} /> Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span 
                key={skill}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--primary-light)] text-[var(--primary)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="card">
          <h2 className="text-lg font-semibold text-[var(--slate-900)] mb-4">Achievements</h2>
          <div className="space-y-3">
            {[
              { icon: '🚀', title: 'Fast Learner', desc: 'Completed 5 courses' },
              { icon: '🔥', title: '7-Day Streak', desc: 'Consistent learning' },
              { icon: '⭐', title: 'Top Performer', desc: 'Top 10% in quizzes' },
            ].map((badge) => (
              <div 
                key={badge.title} 
                className="flex items-center gap-3 p-3 rounded-xl bg-[var(--slate-50)]"
              >
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="font-medium text-[var(--slate-900)]">{badge.title}</p>
                  <p className="text-xs text-[var(--slate-500)]">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--slate-900)] flex items-center gap-2">
            <Briefcase size={20} />
            Experience
          </h2>
          <button className="text-[var(--primary)] hover:underline text-sm flex items-center gap-1">
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-6">
          {experience.map((exp, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--slate-100)] flex items-center justify-center flex-shrink-0">
                <Briefcase size={20} className="text-[var(--slate-500)]" />
              </div>
              <div className="flex-1 pb-6 border-b border-[var(--slate-200)] last:border-0 last:pb-0">
                <h3 className="font-semibold text-[var(--slate-900)]">{exp.title}</h3>
                <p className="text-[var(--slate-700)]">{exp.company} · {exp.location}</p>
                <p className="text-sm text-[var(--slate-500)] mt-1 flex items-center gap-1">
                  <Calendar size={14} />
                  {exp.period}
                </p>
                <p className="text-sm text-[var(--slate-600)] mt-2">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--slate-900)] flex items-center gap-2">
            <GraduationCap size={20} />
            Education
          </h2>
          <button className="text-[var(--primary)] hover:underline text-sm flex items-center gap-1">
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--slate-100)] flex items-center justify-center flex-shrink-0">
                <GraduationCap size={20} className="text-[var(--slate-500)]" />
              </div>
              <div className="flex-1 pb-4 border-b border-[var(--slate-200)] last:border-0 last:pb-0">
                <h3 className="font-semibold text-[var(--slate-900)]">{edu.school}</h3>
                <p className="text-[var(--slate-700)]">{edu.degree}</p>
                <p className="text-sm text-[var(--slate-500)] mt-1 flex items-center gap-1">
                  <Calendar size={14} />
                  {edu.period} · {edu.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Learning */}
      {enrolledCourses.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-[var(--slate-900)] mb-4">Currently Learning</h2>
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course._id} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--slate-50)]">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-16 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--slate-900)] truncate">{course.title}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 h-2 bg-[var(--slate-200)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[var(--primary)] rounded-full"
                        style={{ width: `${user.progress[course._id] || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[var(--primary)]">
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
