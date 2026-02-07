import { useApp } from '../context/AppContext';
import { Lightbulb, Sparkles, Target, TrendingUp } from 'lucide-react';
import CourseCard from '../components/courses/CourseCard';
import JobCard from '../components/jobs/JobCard';

export default function Recommendations() {
  const { courses, jobs, user, trends } = useApp();

  // Simulated recommendations based on user skills
  const recommendedCourses = courses.filter(course => 
    course.skills.some(skill => !user.skills.includes(skill))
  ).slice(0, 4);

  const recommendedJobs = jobs.filter(job =>
    job.skillsRequired.some(skill => user.skills.includes(skill))
  ).slice(0, 4);

  // Skills user should learn
  const skillsToLearn = trends.slice(0, 5).filter(trend => 
    !user.skills.includes(trend.skill)
  );

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="glass-card p-6 bg-gradient-to-r from-amber-500/10 to-indigo-500/10 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="text-amber-400" size={28} />
          <h1 className="text-3xl font-bold">Personalized Recommendations</h1>
        </div>
        <p className="text-gray-400">
          Based on your skills and interests, we've curated these opportunities for you.
        </p>
      </div>

      {/* Skills to learn */}
      <div className="card mb-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-teal-400" size={22} />
          <h2 className="text-xl font-semibold">Skills to Learn Next</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {skillsToLearn.map((trend) => (
            <div 
              key={trend._id}
              className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-teal-500/10 border border-indigo-500/20 hover-lift cursor-pointer"
            >
              <h3 className="font-semibold mb-1">{trend.skill}</h3>
              <p className="text-xs text-gray-400 mb-2">Demand Score</p>
              <div className="flex items-center justify-between">
                <div className="progress-bar flex-1 mr-2">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${trend.demandScore}%` }}
                  />
                </div>
                <span className="text-emerald-400 text-sm font-medium">{trend.growth}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why these recommendations */}
      <div className="card mb-8 bg-gradient-to-r from-indigo-500/5 to-transparent">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/20">
            <Sparkles className="text-indigo-400" size={24} />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Why These Recommendations?</h3>
            <p className="text-gray-400 text-sm">
              These suggestions are based on your current skills ({user.skills.join(', ')}), 
              trending market demands, and similar profiles in your industry. We analyze job market 
              trends to help you stay competitive.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended courses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Target className="text-indigo-400" size={22} />
            <h2 className="text-xl font-semibold">Recommended Courses</h2>
          </div>
          <span className="text-sm text-gray-400">Based on skill gaps</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </div>

      {/* Recommended jobs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Target className="text-teal-400" size={22} />
            <h2 className="text-xl font-semibold">Jobs Matching Your Skills</h2>
          </div>
          <span className="text-sm text-gray-400">Based on your profile</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recommendedJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
