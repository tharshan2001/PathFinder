import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, BookOpen } from 'lucide-react';
import CourseCard from '../components/courses/CourseCard';
import { categories } from '../data/mockData';

export default function Courses() {
  const { courses } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="animate-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A]">Courses</h1>
        <p className="text-[#94A3B8] mt-1">Explore and learn new skills</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-11"
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input w-auto"
          >
            <option value="All">All Categories</option>
            {categories.courses.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Level */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="input w-auto"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-[#94A3B8] mb-4">{filteredCourses.length} courses found</p>
        
        <div className="grid grid-cols-3 gap-5">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="card text-center py-16">
            <BookOpen size={48} className="mx-auto text-[#E2E8F0] mb-4" />
            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No courses found</h3>
            <p className="text-[#94A3B8]">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
