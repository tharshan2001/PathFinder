import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Briefcase, BookOpen, Users, TrendingUp, ArrowRight, CheckCircle, Star, Globe, Lightbulb } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { register, login, isLoading, error, clearError } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success;
    if (isLogin) {
      success = await login({ email: formData.email, password: formData.password });
    } else {
      success = await register(formData);
    }
    if (success) {
      navigate('/home');
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = 'http://localhost:5080/api/auth/google';
  };

  const features = [
    {
      icon: Briefcase,
      title: 'Job Recommendations',
      desc: 'Get personalized job matches based on your skills and experience'
    },
    {
      icon: BookOpen,
      title: 'Skill Courses',
      desc: 'Discover courses that match trending skills in your industry'
    },
    {
      icon: Users,
      title: 'Professional Network',
      desc: 'Connect with professionals in your field and expand your network'
    },
    {
      icon: TrendingUp,
      title: 'Learning Paths',
      desc: 'Follow structured learning paths to advance your career'
    },
    {
      icon: Lightbulb,
      title: 'Skills Analytics',
      desc: 'Track skill gaps and get recommendations for improvement'
    },
    {
      icon: Globe,
      title: 'Local Opportunities',
      desc: 'Find jobs and training opportunities specific to your region'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Jobs' },
    { value: '500+', label: 'Courses' },
    { value: '50K+', label: 'Professionals' },
    { value: '95%', label: 'Satisfaction' }
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-[#e0e4de] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-[#005eb5] font-headline">
              PathFinder
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLogin(true)}
                className="text-[#5c605c] hover:text-[#005eb5] font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className="px-5 py-2 bg-[#005eb5] text-white rounded-full font-semibold hover:bg-[#004c99] transition-colors"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-[#2f3330] font-headline leading-tight mb-6">
                Unlock Your Career Potential
              </h1>
              <p className="text-xl text-[#5c605c] mb-8 leading-relaxed">
                Connect with opportunities that match your skills. Get personalized job recommendations, 
                discover relevant courses, and build your professional network—all in one platform.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-2xl font-bold text-[#005eb5]">{stat.value}</div>
                    <div className="text-sm text-[#5c605c]">{stat.label}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setIsLogin(false)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#005eb5] text-white rounded-full font-semibold text-lg hover:bg-[#004c99] transition-colors"
              >
                Get Started Free <ArrowRight size={20} />
              </button>
            </div>
            
            {/* Auth Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#e0e4de]">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#2f3330] mb-2">
                  {isLogin ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-[#5c605c]">
                  {isLogin ? 'Sign in to continue your journey' : 'Start your professional journey today'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#e0e4de] rounded-xl focus:ring-2 focus:ring-[#005eb5] focus:border-transparent outline-none transition bg-[#faf9f6]"
                    required
                  />
                )}
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e0e4de] rounded-xl focus:ring-2 focus:ring-[#005eb5] focus:border-transparent outline-none transition bg-[#faf9f6]"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e0e4de] rounded-xl focus:ring-2 focus:ring-[#005eb5] focus:border-transparent outline-none transition bg-[#faf9f6]"
                  required
                />

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#005eb5] text-white py-3 rounded-xl font-semibold hover:bg-[#004c99] transition disabled:opacity-50"
                >
                  {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#e0e4de]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-[#5c605c]">or continue with</span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleAuth}
                  className="mt-4 w-full flex items-center justify-center gap-3 border border-[#e0e4de] py-3 rounded-xl hover:bg-[#faf9f6] transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-medium">Google</span>
                </button>
              </div>

              <p className="mt-6 text-center text-[#5c605c]">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={() => { setIsLogin(!isLogin); clearError(); setFormData({ name: '', email: '', password: '' }); }}
                  className="ml-1 text-[#005eb5] hover:underline font-medium"
                >
                  {isLogin ? 'Join now' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2f3330] font-headline mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-[#5c605c] max-w-2xl mx-auto">
              A complete platform designed to help you find the right job, learn new skills, and build meaningful connections.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-2xl border border-[#e0e4de] hover:border-[#005eb5] hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-[#d6e3ff] flex items-center justify-center mb-4 group-hover:bg-[#005eb5] transition-colors">
                  <feature.icon size={28} className="text-[#005eb5] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-[#2f3330] mb-2">{feature.title}</h3>
                <p className="text-[#5c605c]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-[#005eb5] to-[#00529f] rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold font-headline mb-4">
              Ready to Take the Next Step?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have accelerated their careers with PathFinder.
            </p>
            <button
              onClick={() => setIsLogin(false)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#005eb5] rounded-full font-semibold text-lg hover:bg-[#faf9f6] transition-colors"
            >
              Create Free Account <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-[#e0e4de]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold text-[#005eb5] font-headline">
              PathFinder
            </div>
            <div className="flex gap-8 text-[#5c605c]">
              <a href="#" className="hover:text-[#005eb5] transition-colors">About</a>
              <a href="#" className="hover:text-[#005eb5] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#005eb5] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#005eb5] transition-colors">Help</a>
            </div>
            <div className="text-[#5c605c]">
              © 2026 PathFinder. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;