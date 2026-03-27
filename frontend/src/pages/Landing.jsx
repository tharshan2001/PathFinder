import { Link } from 'react-router-dom';
import { 
  Compass, 
  BookOpen, 
  Briefcase, 
  TrendingUp, 
  Users,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Target,
  Globe,
  Award
} from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: BookOpen,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with hands-on projects and real-world skills.'
    },
    {
      icon: Briefcase,
      title: 'Job Matching',
      description: 'Get personalized job recommendations based on your skills and career goals.'
    },
    {
      icon: TrendingUp,
      title: 'Skill Analytics',
      description: 'Track your progress and identify skill gaps with detailed analytics.'
    },
    {
      icon: Users,
      title: 'Professional Network',
      description: 'Connect with professionals in your field and grow your network.'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Active Learners' },
    { value: '1,200+', label: 'Courses' },
    { value: '500+', label: 'Hiring Partners' },
    { value: '85%', label: 'Job Placement' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[var(--slate-200)]">
        <div className="container mx-auto max-w-[1200px] px-4">
          <div className="flex items-center justify-between h-[70px]">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center">
                <Compass className="text-white" size={22} />
              </div>
              <span className="text-xl font-bold text-[var(--slate-900)]">PathFinder</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link to="/feed" className="text-[var(--slate-700)] hover:text-[var(--primary)] font-medium">
                Explore
              </Link>
              <Link to="/courses" className="text-[var(--slate-700)] hover:text-[var(--primary)] font-medium">
                Courses
              </Link>
              <Link to="/jobs" className="text-[var(--slate-700)] hover:text-[var(--primary)] font-medium">
                Jobs
              </Link>
              <Link 
                to="/feed" 
                className="btn btn-primary"
              >
                <LogIn size={18} />
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-[140px] pb-[100px] px-4 bg-gradient-to-b from-[var(--slate-50)] to-white">
        <div className="container mx-auto max-w-[1200px]">
          <div className="flex items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-sm font-medium mb-6">
                <Sparkles size={16} />
                AI-Powered Career Platform
              </div>
              <h1 className="text-5xl font-bold text-[var(--slate-900)] leading-tight">
                Discover Your Path to<br />
                <span className="text-[var(--primary)]">Success</span>
              </h1>
              <p className="text-xl text-[var(--slate-600)] mt-6 max-w-[540px]">
                Master in-demand skills, connect with industry professionals, and land your dream job. Your career journey starts here.
              </p>
              <div className="flex gap-4 mt-8">
                <Link to="/feed" className="btn btn-primary text-base px-8 py-4">
                  Get Started Free
                  <ArrowRight size={20} />
                </Link>
                <Link to="/courses" className="btn btn-outline text-base px-8 py-4">
                  Browse Courses
                </Link>
              </div>
              <div className="flex items-center gap-8 mt-10">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-[var(--slate-900)]">{stat.value}</p>
                    <p className="text-sm text-[var(--slate-500)]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 hidden lg:block">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-72 h-72 bg-[var(--primary-light)] rounded-full opacity-50 blur-3xl" />
                <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-purple-100 rounded-full opacity-50 blur-3xl" />
                <div className="relative grid grid-cols-2 gap-4">
                  <div className="card p-6 animate-float" style={{ animationDelay: '0s' }}>
                    <div className="w-12 h-12 rounded-xl bg-[var(--primary-light)] flex items-center justify-center mb-4">
                      <Target size={24} className="text-[var(--primary)]" />
                    </div>
                    <h3 className="font-semibold text-[var(--slate-900)]">Personalized Path</h3>
                    <p className="text-sm text-[var(--slate-500)] mt-2">AI recommendations tailored to your goals</p>
                  </div>
                  <div className="card p-6 animate-float" style={{ animationDelay: '0.2s' }}>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                      <Globe size={24} className="text-[var(--blue)]" />
                    </div>
                    <h3 className="font-semibold text-[var(--slate-900)]">Global Opportunities</h3>
                    <p className="text-sm text-[var(--slate-500)] mt-2">Access jobs from top companies worldwide</p>
                  </div>
                  <div className="card p-6 animate-float" style={{ animationDelay: '0.4s' }}>
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                      <Award size={24} className="text-[var(--amber)]" />
                    </div>
                    <h3 className="font-semibold text-[var(--slate-900)]">Verified Certificates</h3>
                    <p className="text-sm text-[var(--slate-500)] mt-2">Earn credentials recognized by employers</p>
                  </div>
                  <div className="card p-6 animate-float" style={{ animationDelay: '0.6s' }}>
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                      <TrendingUp size={24} className="text-[var(--purple)]" />
                    </div>
                    <h3 className="font-semibold text-[var(--slate-900)]">Skill Tracking</h3>
                    <p className="text-sm text-[var(--slate-500)] mt-2">Monitor your growth with detailed analytics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-[100px] px-4 bg-[var(--slate-50)]">
        <div className="container mx-auto max-w-[1200px]">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--slate-900)]">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-[var(--slate-600)] mt-4 max-w-[600px] mx-auto">
              A complete platform designed to accelerate your career growth
            </p>
          </div>
          
          <div className="grid grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-[var(--primary-light)] flex items-center justify-center mx-auto mb-6">
                  <feature.icon size={32} className="text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--slate-900)] mb-3">{feature.title}</h3>
                <p className="text-[var(--slate-600)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-[100px] px-4">
        <div className="container mx-auto max-w-[1200px]">
          <div className="card bg-gradient-to-r from-[var(--primary)] to-[var(--emerald)] text-white p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-[600px] mx-auto">
              Join thousands of professionals who have transformed their careers with PathFinder.
            </p>
            <Link 
              to="/feed" 
              className="btn bg-white text-[var(--primary)] hover:bg-[var(--slate-100)] text-base px-10 py-4 inline-flex"
            >
              Get Started Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-[var(--slate-900)] text-white">
        <div className="container mx-auto max-w-[1200px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center">
                <Compass className="text-white" size={22} />
              </div>
              <span className="text-xl font-bold">PathFinder</span>
            </div>
            <p className="text-[var(--slate-400)]">© 2024 PathFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const LogIn = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);
