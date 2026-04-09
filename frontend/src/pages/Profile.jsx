import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import userApi from '../services/userApi';
import Navbar from '../components/Navbar';
import { MapPin, Briefcase, GraduationCap, Award, FolderGit2, Edit2, Plus, Trash2, FileText, Download, Upload } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuthStore();
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

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-#f4f4f0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-#005eb5"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-#f4f4f0">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-[#005eb5] to-[#004c99] rounded-t-lg"></div>
          
          <div className="px-6 pb-6">
            <div className="relative flex items-end -mt-12 mb-4">
              <div className="w-24 h-24 bg-#005eb5 rounded-full flex items-center justify-center text-white text-3xl font-semibold border-4 border-white">
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => setEditing(true)}
                className="ml-4 mb-2 px-4 py-1.5 border border-#e0e4de rounded-md text-sm font-medium text-gray-600 hover:bg-#f4f4f0"
              >
                Edit Profile
              </button>
            </div>
            
            <div>
              <h1 className="text-2xl font-semibold text-#2f3330">{profile?.name}</h1>
              <p className="text-lg text-gray-600">{profile?.headline || 'Add headline'}</p>
              
              {profile?.location && (
                <p className="text-sm text-#5c605c mt-1 flex items-center gap-1">
                  <MapPin size={14} /> {profile.location}
                </p>
              )}
              
              <p className="text-sm text-#005eb5 mt-1 font-medium">
                {profile?.connectionsCount || 0} connections
              </p>
            </div>
            
            {profile?.about && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-semibold text-#2f3330 mb-2">About</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{profile.about}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <ExperienceTab experience={profile?.experience || []} refresh={fetchProfile} />
          <EducationTab education={profile?.education || []} refresh={fetchProfile} />
          <SkillsTab skills={profile?.skills || []} refresh={fetchProfile} />
          <ProjectsTab projects={profile?.projects || []} refresh={fetchProfile} />
          <CertificationsTab certifications={profile?.certifications || []} refresh={fetchProfile} />
          <ResumesTab refresh={fetchProfile} />
        </div>
      </main>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-#e0e4de rounded-md focus:ring-2 focus:ring-[#005eb5] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full px-3 py-2 border border-#e0e4de rounded-md focus:ring-2 focus:ring-[#005eb5] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-#e0e4de rounded-md focus:ring-2 focus:ring-[#005eb5] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-#e0e4de rounded-md focus:ring-2 focus:ring-[#005eb5] focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 px-4 py-2 border border-#e0e4de rounded-full font-semibold hover:bg-#f4f4f0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-#005eb5 text-white rounded-full font-semibold hover:bg-[#004c99]"
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
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-#2f3330">Experience</h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-#005eb5 font-semibold hover:underline">
          <Plus size={16} /> Add
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-#f4f4f0 rounded-lg p-4 mb-4 space-y-3">
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
            <button type="submit" className="px-4 py-2 bg-#005eb5 text-white rounded-full font-semibold">Save</button>
          </div>
        </form>
      )}

      {experience.length === 0 ? (
        <p className="text-#5c605c">No experience added yet.</p>
      ) : (
        <div className="space-y-6">
          {experience.map((exp) => (
            <div key={exp._id} className="flex gap-3 pb-4 border-b last:border-0">
              <div className="w-12 h-12 bg-#e6e9e4 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase size={20} className="text-#5c605c" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold text-#2f3330">{exp.title}</h4>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    <p className="text-sm text-#5c605c">{exp.startDate?.slice(0, 7)} - {exp.endDate?.slice(0, 7) || 'Present'}</p>
                    {exp.location && <p className="text-sm text-#5c605c">{exp.location}</p>}
                  </div>
                  <button onClick={() => handleDelete(exp._id)} className="text-gray-400 hover:text-red-500 self-start">
                    <Trash2 size={16} />
                  </button>
                </div>
                {exp.description && <p className="text-sm text-gray-600 mt-2">{exp.description}</p>}
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
      const educationData = {
        school: formData.institution,
        degree: formData.degree,
        fieldOfStudy: formData.field,
        startYear: formData.startDate ? parseInt(formData.startDate.split('-')[0]) : null,
        endYear: formData.endDate ? parseInt(formData.endDate.split('-')[0]) : null,
        grade: formData.grade,
      };
      await userApi.addEducation(educationData);
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
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-#2f3330">Education</h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-#005eb5 font-semibold hover:underline">
          <Plus size={16} /> Add
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-#f4f4f0 rounded-lg p-4 mb-4 space-y-3">
          <input type="text" placeholder="Institution" value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" placeholder="Degree" value={formData.degree} onChange={(e) => setFormData({...formData, degree: e.target.value})} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" placeholder="Field of Study" value={formData.field} onChange={(e) => setFormData({...formData, field: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
          <div className="flex gap-2">
            <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="flex-1 px-3 py-2 border rounded-md" required />
            <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="flex-1 px-3 py-2 border rounded-md" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-full font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-#005eb5 text-white rounded-full font-semibold">Save</button>
          </div>
        </form>
      )}

      {education.length === 0 ? (
        <p className="text-#5c605c">No education added yet.</p>
      ) : (
        <div className="space-y-6">
          {education.map((edu) => (
            <div key={edu._id} className="flex gap-3 pb-4 border-b last:border-0">
              <div className="w-12 h-12 bg-#e6e9e4 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap size={20} className="text-#5c605c" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold text-#2f3330">{edu.school}</h4>
                    <p className="text-sm text-gray-600">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</p>
                    <p className="text-sm text-#5c605c">{edu.startYear} - {edu.endYear || 'Present'}</p>
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
    try {
      await userApi.addSkill({ skill: formData.name, level: formData.level });
      setShowForm(false);
      setFormData({ name: '', level: 'Intermediate' });
      refresh();
    } catch (err) {
      console.error('Error adding skill:', err);
    }
  };

  const handleDelete = async (skillName) => {
    if (!confirm(`Delete skill "${skillName}"?`)) return;
    try {
      await userApi.deleteSkill(skillName);
      refresh();
    } catch (err) {
      console.error('Error deleting skill:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-#2f3330">Skills</h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-#005eb5 font-semibold hover:underline">
          <Plus size={16} /> Add
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-#f4f4f0 rounded-lg p-4 mb-4 space-y-3">
          <input type="text" placeholder="Skill name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-md" required />
          <select value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} className="w-full px-3 py-2 border rounded-md">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Expert</option>
          </select>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-full font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-#005eb5 text-white rounded-full font-semibold">Save</button>
          </div>
        </form>
      )}

      {skills.length === 0 ? (
        <p className="text-#5c605c">No skills added yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-[#d6e3ff] text-[#004c99] rounded-full text-sm font-semibold">
              {skill?.skill || skill?.name || skill}
              <button onClick={() => handleDelete(skill?.skill || skill?.name || skill)} className="ml-1 text-[#005eb5] hover:text-red-500">
                <Trash2 size={12} />
              </button>
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
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-#2f3330">Projects</h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-#005eb5 font-semibold hover:underline">
          <Plus size={16} /> Add
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-#f4f4f0 rounded-lg p-4 mb-4 space-y-3">
          <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-md" required />
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-md" rows={3} />
          <input type="text" placeholder="Link (URL)" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
          <input type="text" placeholder="Technologies (comma separated)" value={formData.technologies} onChange={(e) => setFormData({...formData, technologies: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-full font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-#005eb5 text-white rounded-full font-semibold">Save</button>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <p className="text-#5c605c">No projects added yet.</p>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project._id} className="flex gap-3 pb-4 border-b last:border-0">
              <div className="w-12 h-12 bg-#e6e9e4 rounded-lg flex items-center justify-center flex-shrink-0">
                <FolderGit2 size={20} className="text-#5c605c" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold text-#2f3330">{project.title}</h4>
                    <p className="text-sm text-gray-600">{project.description}</p>
                    {project.technologies?.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-[#d6e3ff] text-[#004c99] text-xs rounded-full">{tech}</span>
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
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-#2f3330">Certifications</h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-#005eb5 font-semibold hover:underline">
          <Plus size={16} /> Add
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-#f4f4f0 rounded-lg p-4 mb-4 space-y-3">
          <input type="text" placeholder="Certification name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" placeholder="Issuing organization" value={formData.issuer} onChange={(e) => setFormData({...formData, issuer: e.target.value})} className="w-full px-3 py-2 border rounded-md" required />
          <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
          <input type="text" placeholder="Credential ID" value={formData.credentialId} onChange={(e) => setFormData({...formData, credentialId: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
          <input type="text" placeholder="Credential URL" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-full font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-#005eb5 text-white rounded-full font-semibold">Save</button>
          </div>
        </form>
      )}

      {certifications.length === 0 ? (
        <p className="text-#5c605c">No certifications added yet.</p>
      ) : (
        <div className="space-y-6">
          {certifications.map((cert) => (
            <div key={cert._id} className="flex gap-3 pb-4 border-b last:border-0">
              <div className="w-12 h-12 bg-#e6e9e4 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award size={20} className="text-#5c605c" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold text-#2f3330">{cert.name}</h4>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                    <p className="text-sm text-#5c605c">{cert.date?.slice(0, 10)}</p>
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

// Resumes Tab
const ResumesTab = ({ refresh }) => {
  const [resumes, setResumes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await userApi.getResumes();
      setResumes(res.data.resumes || []);
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('resume', file);
    
    setUploading(true);
    try {
      await userApi.uploadResume(formData);
      setShowForm(false);
      fetchResumes();
      refresh();
    } catch (err) {
      console.error('Error uploading resume:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this resume?')) return;
    try {
      await userApi.deleteResume(id);
      fetchResumes();
      refresh();
    } catch (err) {
      console.error('Error deleting resume:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-#2f3330">Resumes</h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-#005eb5 font-semibold hover:underline">
          <Plus size={16} /> Add
        </button>
      </div>

      {showForm && (
        <div className="bg-#f4f4f0 rounded-lg p-4 mb-4">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-#e0e4de rounded-lg cursor-pointer hover:bg-#e6e9e4 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-#5c605c">Click to upload PDF, DOC, or DOCX</p>
            </div>
            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleUpload} disabled={uploading} />
          </label>
          {uploading && <p className="text-center text-sm text-#005eb5 mt-2">Uploading...</p>}
        </div>
      )}

      {resumes.length === 0 ? (
        <p className="text-#5c605c">No resumes uploaded yet.</p>
      ) : (
        <div className="space-y-3">
          {resumes.map((resume) => (
            <div key={resume._id} className="flex items-center justify-between p-3 bg-#f4f4f0 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-#5c605c" />
                  <div>
                  <p className="font-medium text-#2f3330">{resume.fileName}</p>
                  <p className="text-xs text-#5c605c">{new Date(resume.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {resume.fileUrl && (
                  <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer" className="text-#005eb5 hover:text-[#004c99]">
                    <Download size={18} />
                  </a>
                )}
                <button onClick={() => handleDelete(resume._id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
