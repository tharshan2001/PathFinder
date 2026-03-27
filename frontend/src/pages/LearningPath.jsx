import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Target, Clock, BookOpen, ArrowRight, Play } from 'lucide-react';

export default function LearningPath() {
  const { learningPaths, courses } = useApp();

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-[var(--slate-900)]">Learning Paths</h1>
        <p className="text-[var(--slate-500)] mt-2">Structured paths to master new skills</p>
      </div>

      <div className="space-y-4">
        {learningPaths.map(path => (
          <div key={path._id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[var(--slate-900)]">{path.title}</h2>
                <p className="text-[var(--slate-500)] mt-1">{path.description}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-sm text-[var(--slate-500)]">
                    <Clock size={14} /> {path.duration}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-[var(--slate-500)]">
                    <BookOpen size={14} /> {path.courses.length} courses
                  </span>
                  <span className="flex items-center gap-1 text-sm text-[var(--slate-500)]">
                    <Target size={14} /> {path.skills.length} skills
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {path.skills.map(skill => (
                    <span key={skill} className="tag tag-primary">{skill}</span>
                  ))}
                </div>
              </div>
              {path.progress > 0 ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-[var(--primary)] flex items-center justify-center">
                    <span className="font-bold text-[var(--primary)]">{path.progress}%</span>
                  </div>
                  <button className="btn btn-primary btn-sm mt-3">
                    <Play size={14} /> Continue
                  </button>
                </div>
              ) : (
                <button className="btn btn-primary">
                  Start Path <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
