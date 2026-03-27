import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, Users, BookOpen, ArrowRight, Bookmark } from 'lucide-react';

export default function Courses() {
  const { courses, savedCourses, toggleSaveCourse, enrolledCourses, enrollInCourse } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Web Development', 'Data Science', 'Cloud Computing', 'Design', 'Cybersecurity'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-[var(--slate-900)] mb-4">Explore Courses</h1>
        
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--slate-500)]" size={18} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-12"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--slate-100)] text-[var(--slate-700)] hover:bg-[var(--slate-200)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filteredCourses.map(course => (
          <div key={course._id} className="card card-hover p-0 overflow-hidden">
            <div className="relative">
              <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
              <button
                onClick={(e) => { e.preventDefault(); toggleSaveCourse(course._id); }}
                className={`absolute top-3 right-3 p-2 rounded-lg transition-colors ${
                  savedCourses.includes(course._id)
                    ? 'text-[var(--primary)] bg-white'
                    : 'text-white bg-black/30 hover:bg-black/50'
                }`}
              >
                <Bookmark size={16} fill={savedCourses.includes(course._id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            <Link to={`/courses/${course._id}`} className="block p-4">
              <span className="tag tag-primary text-xs">{course.category}</span>
              <h3 className="font-semibold text-[var(--slate-900)] mt-2 line-clamp-2">{course.title}</h3>
              <p className="text-sm text-[var(--slate-500)] mt-1">{course.provider}</p>
              
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="flex items-center gap-1 text-[var(--amber)]">
                  <Star size={14} fill="currentColor" /> {course.rating}
                </span>
                <span className="flex items-center gap-1 text-[var(--slate-500)]">
                  <Clock size={14} /> {course.duration}
                </span>
                <span className="flex items-center gap-1 text-[var(--slate-500)]">
                  <Users size={14} /> {course.enrolledUsers.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--slate-200)]">
                <span className="font-semibold text-[var(--primary)]">${course.price}</span>
                {enrolledCourses.includes(course._id) ? (
                  <span className="text-sm font-medium text-[var(--emerald)]">Enrolled</span>
                ) : (
                  <button 
                    onClick={(e) => { e.preventDefault(); enrollInCourse(course._id); }}
                    className="text-sm font-medium text-[var(--primary)] hover:underline"
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="card text-center py-12">
          <BookOpen size={48} className="mx-auto text-[var(--slate-300)] mb-4" />
          <p className="text-[var(--slate-500)]">No courses found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
