import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import userApi from '../services/userApi';
import { MapPin, Briefcase, GraduationCap, Award, FolderGit2, LogOut, Edit2, Plus, Trash2, Home, Bell, Briefcase as JobIcon, MessageSquare, User, Search } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('about');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await userApi.getProfile();
      setProfile(res.data);
      setFormData({
        name: res.data.name || '',
        headline: res.data.headline || '',
        about: res.data.about || '',
        location: res.data.location || '',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await userApi.updateProfile(formData);
      setProfile({ ...profile, ...formData });
      setEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/feed' },
    { id: 'network', icon: User, label: 'Network', path: '/feed' },
    { id: 'jobs', icon: JobIcon, label: 'Jobs', path: '/feed' },
    { id: 'messaging', icon: MessageSquare, label: 'Messaging', path: '/feed' },
    { id: 'notifications', icon: Bell, label: 'Notifications', path: '/feed' },
    { id: 'profile', icon: User, label: 'Me', path: '/profile' },
  ];

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
  ];

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a66c2]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1128px] mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <div 
                className="text-3xl font-extrabold text-[#0a66c2] cursor-pointer"
                onClick={() => navigate('/feed')}
              >
                in
              </div>
              <div className="hidden md:flex items-center bg-[#eef3f8] px-3 py-2 rounded-md">
                <Search size={18} className="text-[#666]" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="bg-transparent border-none outline-none ml-2 w-48 text-sm"
                />
              </div>
            </div>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center px-3 py-1 rounded-md transition ${
                    item.id === 'profile' ? 'text-[#0a66c2]' : 'text-[#666] hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1128px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Column */}
          <div className="md:col-span-3 space-y-4">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Banner */}
              <div className="h-24 bg-gradient-to-r from-[#0a66c2] to-[#057642]"></div>
              
              <div className="px-4 pb-4">
                <div className="relative -mt-10 mb-2">
                  <div className="w-20 h-20 bg-white rounded-full p-1">
                    <div className="w-full h-full bg-[#0a66c2] rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                      {profile?.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                >
                  <LogOut size={18} />
                </button>
                
                <h3 className="font-semibold text-[#000000e6] text-lg">{profile?.name}</h3>
                <p className="text-sm text-[#666666]">{profile?.headline || 'Add a headline'}</p>
                
                <div className="mt-2">
                  <span className="text-sm text-[#666666]">{profile?.location || 'Add location'}</span>
                </div>
                
                <div className="mt-3">
                  <span className="text-[#0a66c2] font-semibold text-sm">Open to work</span>
                </div>
                
                <button
                  onClick={() => setEditing(true)}
                  className="w-full mt-4 py-1.5 bg-[#0a66c2] text-white rounded-full font-semibold text-sm hover:bg-[#004182] transition"
                >
                  Edit profile
                </button>

                <div className="border-t mt-4 pt-3">
                  <div className="flex justify-between text-sm py-1">
                    <span className="text-[#666666]">Connections</span>
                    <span className="font-semibold text-[#0a66c2]">{profile?.connectionsCount || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm py-1">
                    <span className="text-[#666666]">Profile views</span>
                    <span className="font-semibold text-[#0a66c2]">{profile?.profileViews || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h4 className="font-semibold text-[#000000e6] mb-2">Analytics</h4>
              <div className="flex items-center gap-2 text-sm text-[#666666]">
                <span>👁️</span>
                <span>Private to you</span>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs Content */}
          <div className="md:col-span-9">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-4">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
                      activeTab === tab.id
                        ? 'border-[#0a66c2] text-[#0a66c2]'
                        : 'border-transparent text-[#666666] hover:text-[#0a66c2]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              {activeTab === 'about' && <AboutTab profile={profile} setProfile={setProfile} fetchProfile={fetchProfile} />}
              {activeTab === 'experience' && <ExperienceTab experience={profile?.experience || []} refresh={fetchProfile} />}
              {activeTab === 'education' && <EducationTab education={profile?.education || []} refresh={fetchProfile} />}
              {activeTab === 'skills' && <SkillsTab skills={profile?.skills || []} refresh={fetchProfile} />}
              {activeTab === 'projects' && <ProjectsTab projects={profile?.projects || []} refresh={fetchProfile} />}
              {activeTab === 'certifications' && <CertificationsTab certifications={profile?.certifications || []} refresh={fetchProfile} />}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit intro</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#0a66c2] text-white rounded-full font-semibold hover:bg-[#004182]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// About Tab
const AboutTab = ({ profile, setProfile, fetchProfile }) => {
  const [editing, setEditing] = useState(false);
  const [about, setAbout] = useState(profile?.about || '');

  const handleSave = async () => {
    try {
      await userApi.updateProfile({ about });
      setProfile({ ...profile, about });
      setEditing(false);
    } catch (err) {
      console.error('Error updating about:', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-[#000000e6]">About</h3>
        {!editing && (
          <button onClick={() => setEditing(true)} className="text-[#0a66c2] font-semibold text-sm hover:underline">
            Edit
          </button>
        )}
      </div>
      {editing ? (
        <div>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0a66c2] outline-none"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={handleSave} className="px-4 py-1 bg-[#0a66c2] text-white rounded-full font-semibold text-sm">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="px-4 py-1 border border-gray-300 rounded-full font-semibold text-sm">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-[#00000099] whitespace-pre-wrap">{profile?.about || 'Write a summary to highlight your professional background.'}</p>
      )}
    </div>
  );
};

// Experience Tab
const ExperienceTab = ({ experience, refresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', company: '', location: '', startDate: '', endDate: '', description: '' });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await userApi.addExperience(formData);
      setShowForm(false);
      setFormData({ title: '', company: '', location: '', startDate: '', endDate: '', description: '' });
      refresh();
    } catch (err) {
      console.error('Error adding experience:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience?')) return;
    try {
      await userApi.deleteExperience(id);
      refresh();
    } catch (err) {
      console.error('Error deleting experience:', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-[#000000e6]">Experience</h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-[#0a66c2] font-semibold hover:underline">
          <Plus size={16} /> Add
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
          <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" placeholder="Company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
          <div className="flex gap-2">
            <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="flex-1 px-3 py-2 border rounded-md" required />
            <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="flex-1 px-3 py-2 border rounded-md" />
          </div>
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-md" rows={3} />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-full font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[#0a66c2] text-white rounded-full font-semibold">Save</button>
          </div>
        </form>
      )}

      {experience.length === 0 ? (
        <p className="text-[#666666]">No experience added yet.</p>
      ) : (
        <div className="space-y-6">
          {experience.map((exp) => (
            <div key={exp._id} className="flex gap-3 pb-4 border-b last:border-0">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase size={20} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold text-[#000000e6]">{exp.title}</h4>
                    <p className="text-sm text-[#00000099]">{exp.company}</p>
                    <p className="text-sm text-[#666666]">{exp.startDate?.slice(0, 7)} - {exp.endDate?.slice(0, 7) || 'Present'}</p>
                    {exp.location && <p className="text-sm text-[#666666]">{exp.location}</p>}
                  </div>
                  <button onClick={() => handleDelete(exp._id)} className="text-gray-400 hover:text-red-500 self-start">
                    <Trash2 size={16} />
                  </button>
                </div>
                {exp.description && <p className="text-sm text-[#00000099] mt-2">{exp.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Education Tab
const EducationTab = ({ education, refresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ institution: '', degree: '', field: '', startDate: '', endDate: '', grade: '' });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await userApi.addEducation(formData);
      setShowForm(false);
      setFormData({ institution: '', degree: '', field: '', startDate: '', endDate: '', grade: '' });
      refresh();
    } catch (err) {
      console.error('Error adding education:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this education?')) return;
    try {
      await userApi.deleteEducation(id);
      refresh();
    } catch (err) {
      console.error('Error deleting education:', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-[#000000e6]">Education</h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-[#0a66c2] font-semibold hover:underline">
          <Plus size={16} /> Add
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
          <input type="text" placeholder="Institution" value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" placeholder="Degree" value={formData.degree} onChange={(e) => setFormData({...formData, degree: e.target.value})} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" placeholder="Field of Study" value={formData.field} onChange={(e) => setFormData({...formData, field: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
          <div className="flex gap-2">
            <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="flex-1 px-3 py-2 border rounded-md" required />
            <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="flex-1 px-3 py-2 border rounded-md" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-full font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[#0a66c2] text-white rounded-full font-semibold">Save</button>
          </div>
        </form>
      )}

      {education.length === 0 ? (
        <p className="text-[#666666]">No education added yet.</p>
      ) : (
        <div className="space-y-6">
          {education.map((edu) => (
            <div key={edu._id} className="flex gap-3 pb-4 border-b last:border-0">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap size={20} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold text-[#000000e6]">{edu.institution}</h4>
                    <p className="text-sm text-[#00000099]">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                    <p className="text-sm text-[#666666]">{edu.startDate?.slice(0, 7)} - {edu.endDate?.slice(0, 7) || 'Present'}</p>
                  </div>
                  <button onClick={() => handleDelete(edu._id)} className="text-gray-400 hover:text-red-500 self-start">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Skills Tab
const SkillsTab = ({ skills, refresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', level: 'Intermediate' });

  const handleAdd = async (e) => {
    e.preventDefault();
    console.log('Add skill API not implemented');
    setShowForm(false);
    refresh();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-[#000000e6]">Skills</h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-[#0a66c2] font-semibold hover:underline">
          <Plus size={16} /> Add
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
          <input type="text" placeholder="Skill name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-md" required />
          <select value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} className="w-full px-3 py-2 border rounded-md">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Expert</option>
          </select>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-full font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[#0a66c2] text-white rounded-full font-semibold">Save</button>
          </div>
        </form>
      )}

      {skills.length === 0 ? (
        <p className="text-[#666666]">No skills added yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <span key={idx} className="px-3 py-1 bg-[#eef3f8] text-[#0a66c2] rounded-full text-sm font-semibold">
              {skill.name || skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Projects Tab
const ProjectsTab = ({ projects, refresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', link: '', technologies: '' });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await userApi.addProject({ ...formData, technologies: formData.technologies.split(',').map(t => t.trim()) });
      setShowForm(false);
      setFormData({ title: '', description: '', link: '', technologies: '' });
      refresh();
    } catch (err) {
      console.error('Error adding project:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await userApi.deleteProject(id);
      refresh();
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-[#000000e6]">Projects</h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-[#0a66c2] font-semibold hover:underline">
          <Plus size={16} /> Add
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
          <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-md" required />
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-md" rows={3} />
          <input type="text" placeholder="Link (URL)" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
          <input type="text" placeholder="Technologies (comma separated)" value={formData.technologies} onChange={(e) => setFormData({...formData, technologies: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-full font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[#0a66c2] text-white rounded-full font-semibold">Save</button>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <p className="text-[#666666]">No projects added yet.</p>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project._id} className="flex gap-3 pb-4 border-b last:border-0">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FolderGit2 size={20} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold text-[#000000e6]">{project.title}</h4>
                    <p className="text-sm text-[#00000099]">{project.description}</p>
                    {project.technologies?.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-[#eef3f8] text-[#0a66c2] text-xs rounded-full">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={() => handleDelete(project._id)} className="text-gray-400 hover:text-red-500 self-start">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Certifications Tab
const CertificationsTab = ({ certifications, refresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', issuer: '', date: '', credentialId: '', link: '' });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await userApi.addCertification(formData);
      setShowForm(false);
      setFormData({ name: '', issuer: '', date: '', credentialId: '', link: '' });
      refresh();
    } catch (err) {
      console.error('Error adding certification:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this certification?')) return;
    try {
      await userApi.deleteCertification(id);
      refresh();
    } catch (err) {
      console.error('Error deleting certification:', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-[#000000e6]">Certifications</h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-[#0a66c2] font-semibold hover:underline">
          <Plus size={16} /> Add
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
          <input type="text" placeholder="Certification name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" placeholder="Issuing organization" value={formData.issuer} onChange={(e) => setFormData({...formData, issuer: e.target.value})} className="w-full px-3 py-2 border rounded-md" required />
          <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
          <input type="text" placeholder="Credential ID" value={formData.credentialId} onChange={(e) => setFormData({...formData, credentialId: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
          <input type="text" placeholder="Credential URL" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-full font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[#0a66c2] text-white rounded-full font-semibold">Save</button>
          </div>
        </form>
      )}

      {certifications.length === 0 ? (
        <p className="text-[#666666]">No certifications added yet.</p>
      ) : (
        <div className="space-y-6">
          {certifications.map((cert) => (
            <div key={cert._id} className="flex gap-3 pb-4 border-b last:border-0">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award size={20} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold text-[#000000e6]">{cert.name}</h4>
                    <p className="text-sm text-[#00000099]">{cert.issuer}</p>
                    <p className="text-sm text-[#666666]">{cert.date?.slice(0, 10)}</p>
                  </div>
                  <button onClick={() => handleDelete(cert._id)} className="text-gray-400 hover:text-red-500 self-start">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
