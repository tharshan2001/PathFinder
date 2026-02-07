import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bookmark, BookOpen, Briefcase, Trash2 } from 'lucide-react';
import CourseCard from '../components/courses/CourseCard';
import JobCard from '../components/jobs/JobCard';

export default function SavedItems() {
  const { getSavedCourses, getSavedJobs, toggleSaveCourse, toggleSaveJob } = useApp();
  const [activeTab, setActiveTab] = useState('courses');
  
  const savedCourses = getSavedCourses();
  const savedJobs = getSavedJobs();

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-indigo-500/20">
          <Bookmark className="text-indigo-400" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Saved Items</h1>
          <p className="text-gray-400">Your bookmarked courses and jobs</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'courses'
              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <BookOpen size={18} />
          Courses ({savedCourses.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'jobs'
              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Briefcase size={18} />
          Jobs ({savedJobs.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'courses' ? (
        savedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 card">
            <BookOpen size={48} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No saved courses</h3>
            <p className="text-gray-400">Courses you save will appear here</p>
          </div>
        )
      ) : (
        savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {savedJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 card">
            <Briefcase size={48} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No saved jobs</h3>
            <p className="text-gray-400">Jobs you save will appear here</p>
          </div>
        )
      )}
    </div>
  );
}
