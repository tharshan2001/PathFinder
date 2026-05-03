import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useToastStore } from '../stores/toastStore';
import userApi from '../services/userApi';

import { MapPin, Briefcase, GraduationCap, Award, FolderGit2, Edit2, Plus, Trash2, FileText, Download, Upload, X, Check, Pencil, Save } from 'lucide-react';

const Section = ({ title, children, icon, onAdd, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {icon && <div className="w-6 h-6 flex items-center justify-center">{icon}</div>}
          <h3 className="text-sm font-700 text-slate-900 uppercase tracking-wide">{title}</h3>
        </div>
        {onAdd && (
          <button onClick={onAdd} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors">
            <Plus size={18} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

const ItemActions = ({ onEdit, onDelete }) => (
  <div className="flex gap-1 mt-2">
    {onEdit && (
      <button onClick={onEdit} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors">
        <Pencil size={14} />
      </button>
    )}
    {onDelete && (
      <button onClick={onDelete} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors">
        <Trash2 size={14} />
      </button>
    )}
  </div>
);

const Modal = ({ isOpen, onClose, title, onSubmit, children, submitText = 'Save' }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="modal-content bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-700 text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          {children}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg font-600 text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-600 hover:bg-blue-700">
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user: authUser } = useAuthStore();
  const toast = useToastStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({});
  const [uploadingResume, setUploadingResume] = useState(false);

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
      toast.success('Profile updated successfully');
    } catch (err) {
      // Error toast handled by API interceptor
    }
  };

  const openAddModal = (type) => {
    setModalType(type);
    setEditingItem(null);
    setItemForm(getInitialFormData(type));
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setItemForm(getInitialFormData(type, item));
  };

  const getInitialFormData = (type, item = null) => {
    switch (type) {
      case 'experience':
        return { title: item?.title || '', company: item?.company || '', startDate: item?.startDate?.slice(0, 7) || '', endDate: item?.endDate?.slice(0, 7) || '', description: item?.description || '' };
      case 'education':
        return { school: item?.school || '', degree: item?.degree || '', fieldOfStudy: item?.fieldOfStudy || '', startYear: item?.startYear || '', endYear: item?.endYear || '' };
      case 'project':
        return { title: item?.title || '', description: item?.description || '', technologies: item?.technologies?.join(', ') || '', url: item?.url || '' };
      case 'certification':
        return { name: item?.name || '', issuer: item?.issuer || '', date: item?.date?.slice(0, 10) || '', credentialId: item?.credentialId || '' };
      case 'skill':
        return { name: item?.skill || item?.name || '', level: item?.level || 'Beginner' };
      default:
        return {};
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...itemForm };
      if (modalType === 'skill') {
        data.skill = data.name;
      }
      if (modalType === 'project') {
        data.technologies = data.technologies.split(',').map(t => t.trim()).filter(t => t);
      }
      
      if (editingItem) {
        switch (modalType) {
          case 'experience': await userApi.updateExperience(editingItem._id, data); break;
          case 'education': await userApi.updateEducation(editingItem._id, data); break;
          case 'project': await userApi.updateProject(editingItem._id, data); break;
          case 'certification': await userApi.updateCertification(editingItem._id, data); break;
        }
      } else {
        switch (modalType) {
          case 'experience': await userApi.addExperience(data); break;
          case 'education': await userApi.addEducation(data); break;
          case 'project': await userApi.addProject(data); break;
          case 'certification': await userApi.addCertification(data); break;
          case 'skill': await userApi.addSkill(data); break;
        }
      }
      setModalType(null);
      fetchProfile();
      toast.success(editingItem ? 'Item updated successfully' : 'Item added successfully');
    } catch (err) {
      // Error toast handled by API interceptor
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    try {
      switch (type) {
        case 'experience': await userApi.deleteExperience(id); break;
        case 'education': await userApi.deleteEducation(id); break;
        case 'project': await userApi.deleteProject(id); break;
        case 'certification': await userApi.deleteCertification(id); break;
        case 'skill': await userApi.deleteSkill(id); break;
        case 'resume': await userApi.deleteResume(id); break;
      }
      fetchProfile();
      toast.success('Item deleted successfully');
    } catch (err) {
      // Error toast handled by API interceptor
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('resume', file);
    
    setUploadingResume(true);
    try {
      await userApi.uploadResume(formData);
      fetchProfile();
      setModalType(null);
      toast.success('Resume uploaded successfully');
    } catch (err) {
      // Error toast handled by API interceptor
    } finally {
      setUploadingResume(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-300 border-t-blue-600 mx-auto"></div>
          <p className="text-slate-500 text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Experience', value: profile?.experience?.length || 0 },
    { label: 'Education', value: profile?.education?.length || 0 },
    { label: 'Skills', value: profile?.skills?.length || 0 },
    { label: 'Projects', value: profile?.projects?.length || 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-down { animation: slideDown 0.5s ease-out; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        .profile-header {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 1px solid rgba(15, 23, 42, 0.08);
        }
        .stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,249,250,0.8) 100%);
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
        }
        .section-item {
          transition: all 0.2s ease;
          background: linear-gradient(135deg, rgba(248,249,250,0.8) 0%, rgba(241,245,249,0.8) 100%);
        }
        .section-item:hover {
          background: linear-gradient(135deg, rgba(241,245,249,0.9) 0%, rgba(226,232,240,0.9) 100%);
        }
        .skill-badge {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          animation: slideDown 0.4s ease-out backwards;
        }
        .modal-backdrop {
          animation: fadeIn 0.2s ease-out;
        }
        .modal-content {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Header */}
        <div className="profile-header rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg ring-4 ring-white">
              <span className="text-4xl font-bold">{profile?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-800 text-slate-900 leading-tight">{profile?.name}</h1>
                  <p className="text-base text-blue-600 font-600 mt-1">{profile?.headline || 'Add a headline'}</p>
                  {profile?.location && (
                    <p className="text-sm text-slate-600 mt-2 flex items-center gap-1.5">
                      <MapPin size={14} className="text-blue-500" />
                      {profile.location}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors duration-200 flex-shrink-0"
                >
                  <Edit2 size={18} />
                </button>
              </div>
              <div className="mt-4 text-sm font-medium text-slate-600">
                {profile?.connectionsCount || 0} connections
              </div>
            </div>
          </div>
          {profile?.about && (
            <div className="border-t border-slate-200/60 pt-4">
              <p className="text-sm text-slate-700 leading-relaxed">{profile.about}</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card rounded-xl p-4 text-center border border-slate-200/60 backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-xs font-medium text-slate-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Experience */}
        <Section title="Experience" icon={<Briefcase size={18} className="text-blue-500" />} onAdd={() => openAddModal('experience')}>
          {profile.experience?.length === 0 ? (
            <p className="text-sm text-slate-500">No experience added</p>
          ) : (
            <div className="space-y-2.5">
              {profile.experience.slice(0, 5).map((exp) => (
                <div key={exp._id} className="section-item rounded-lg p-3 border border-slate-200/60">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-600 text-sm text-slate-900">{exp.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{exp.company}</p>
                      <p className="text-xs text-slate-500 mt-1">{exp.startDate?.slice(0, 7)} → {exp.endDate?.slice(0, 7) || 'Now'}</p>
                    </div>
                    <ItemActions onEdit={() => openEditModal('experience', exp)} onDelete={() => handleDelete('experience', exp._id)} />
                  </div>
                </div>
              ))}
              {profile.experience?.length > 5 && (
                <p className="text-xs text-blue-600 font-medium pt-1">+{profile.experience.length - 5} more</p>
              )}
            </div>
          )}
        </Section>

        {/* Education */}
        <Section title="Education" icon={<GraduationCap size={18} className="text-purple-500" />} onAdd={() => openAddModal('education')}>
          {profile.education?.length === 0 ? (
            <p className="text-sm text-slate-500">No education added</p>
          ) : (
            <div className="space-y-2.5">
              {profile.education.slice(0, 5).map((edu) => (
                <div key={edu._id} className="section-item rounded-lg p-3 border border-slate-200/60">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-600 text-sm text-slate-900">{edu.school}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{edu.degree}</p>
                      <p className="text-xs text-slate-500 mt-1">{edu.startYear} - {edu.endYear || 'Present'}</p>
                    </div>
                    <ItemActions onEdit={() => openEditModal('education', edu)} onDelete={() => handleDelete('education', edu._id)} />
                  </div>
                </div>
              ))}
              {profile.education?.length > 5 && (
                <p className="text-xs text-blue-600 font-medium pt-1">+{profile.education.length - 5} more</p>
              )}
            </div>
          )}
        </Section>

        {/* Skills */}
        <Section title="Skills" icon={<Award size={18} className="text-amber-500" />} onAdd={() => openAddModal('skill')} className="md:col-span-2">
          {profile.skills?.length === 0 ? (
            <p className="text-sm text-slate-500">No skills added</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.skills.slice(0, 12).map((skill, idx) => (
                <div key={idx} className="skill-badge px-3 py-1.5 text-white text-xs font-500 rounded-full shadow-sm flex items-center gap-1">
                  <span>{skill?.skill || skill?.name || skill}</span>
                  <button onClick={() => handleDelete('skill', skill?.skill || skill?.name || skill)} className="hover:text-red-200">
                    <X size={12} />
                  </button>
                </div>
              ))}
              {profile.skills?.length > 12 && (
                <span className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-500 rounded-full">
                  +{profile.skills.length - 12}
                </span>
              )}
            </div>
          )}
        </Section>

        {/* Projects */}
        <Section title="Projects" icon={<FolderGit2 size={18} className="text-green-500" />} onAdd={() => openAddModal('project')} className="md:col-span-2">
          {profile.projects?.length === 0 ? (
            <p className="text-sm text-slate-500">No projects added</p>
          ) : (
            <div className="space-y-2.5">
              {profile.projects.slice(0, 5).map((project) => (
                <div key={project._id} className="section-item rounded-lg p-3 border border-slate-200/60">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h4 className="font-600 text-sm text-slate-900">{project.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{project.description}</p>
                      {project.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.slice(0, 4).map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white text-slate-600 text-xs rounded-full border border-slate-200">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ItemActions onEdit={() => openEditModal('project', project)} onDelete={() => handleDelete('project', project._id)} />
                  </div>
                </div>
              ))}
              {profile.projects?.length > 5 && (
                <p className="text-xs text-blue-600 font-medium pt-1">+{profile.projects.length - 5} more</p>
              )}
            </div>
          )}
        </Section>

        {/* Certifications */}
        <Section title="Certifications" icon={<Award size={18} className="text-amber-500" />} onAdd={() => openAddModal('certification')} className="md:col-span-2">
          {profile.certifications?.length === 0 ? (
            <p className="text-sm text-slate-500">No certifications added</p>
          ) : (
            <div className="space-y-2.5">
              {profile.certifications.slice(0, 5).map((cert) => (
                <div key={cert._id} className="section-item rounded-lg p-3 border border-slate-200/60">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-600 text-sm text-slate-900">{cert.name}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{cert.issuer}</p>
                      <p className="text-xs text-slate-500 mt-1">{cert.date?.slice(0, 10)}</p>
                    </div>
                    <ItemActions onEdit={() => openEditModal('certification', cert)} onDelete={() => handleDelete('certification', cert._id)} />
                  </div>
                </div>
              ))}
              {profile.certifications?.length > 5 && (
                <p className="text-xs text-blue-600 font-medium pt-1">+{profile.certifications.length - 5} more</p>
              )}
            </div>
          )}
        </Section>

        {/* Resumes */}
        <Section title="Resumes" icon={<FileText size={18} className="text-indigo-500" />} onAdd={() => openAddModal('resume')} className="md:col-span-2">
          {profile.resumes?.length === 0 ? (
            <div className="text-center py-6">
              <FileText size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500 mb-3">No resumes uploaded yet</p>
              <button 
                onClick={() => openAddModal('resume')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Upload size={16} />
                Upload Resume
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {profile.resumes.map((resume) => (
                <div
                  key={resume._id}
                  className="section-item rounded-lg p-3 flex items-center justify-between border border-slate-200/60 group"
                >
                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center gap-3 hover:border-blue-300 cursor-pointer"
                  >
                    <FileText size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors block truncate">
                        {resume.fileName}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(resume.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Download size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                  </a>
                  <button
                    onClick={() => handleDelete('resume', resume._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-2"
                    title="Delete resume"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => openAddModal('resume')}
                className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Plus size={14} />
                Add Another Resume
              </button>
            </div>
          )}
        </Section>
      </main>

      {/* Edit Modal */}
      {editing && (
        <div className="modal-backdrop fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="modal-content bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl ring-1 ring-slate-900/5">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-xl font-700 text-slate-900">Edit Profile</h3>
              <button
                onClick={() => setEditing(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-600 text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-600 text-slate-700 mb-2">Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-600 text-slate-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-600 text-slate-700 mb-2">About</label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 font-600 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Experience Modal */}
      <Modal isOpen={modalType === 'experience'} onClose={() => setModalType(null)} title={editingItem ? 'Edit Experience' : 'Add Experience'} onSubmit={handleItemSubmit}>
        <div className="space-y-3">
          <input type="text" placeholder="Job Title" value={itemForm.title || ''} onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" required />
          <input type="text" placeholder="Company" value={itemForm.company || ''} onChange={(e) => setItemForm({ ...itemForm, company: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" required />
          <div className="flex gap-2">
            <input type="month" placeholder="Start Date" value={itemForm.startDate || ''} onChange={(e) => setItemForm({ ...itemForm, startDate: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            <input type="month" placeholder="End Date" value={itemForm.endDate || ''} onChange={(e) => setItemForm({ ...itemForm, endDate: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
          </div>
          <textarea placeholder="Description" value={itemForm.description || ''} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" rows={3} />
        </div>
      </Modal>

      {/* Education Modal */}
      <Modal isOpen={modalType === 'education'} onClose={() => setModalType(null)} title={editingItem ? 'Edit Education' : 'Add Education'} onSubmit={handleItemSubmit}>
        <div className="space-y-3">
          <input type="text" placeholder="School/University" value={itemForm.school || ''} onChange={(e) => setItemForm({ ...itemForm, school: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" required />
          <input type="text" placeholder="Degree" value={itemForm.degree || ''} onChange={(e) => setItemForm({ ...itemForm, degree: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" required />
          <input type="text" placeholder="Field of Study" value={itemForm.fieldOfStudy || ''} onChange={(e) => setItemForm({ ...itemForm, fieldOfStudy: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
          <div className="flex gap-2">
            <input type="number" placeholder="Start Year" value={itemForm.startYear || ''} onChange={(e) => setItemForm({ ...itemForm, startYear: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            <input type="number" placeholder="End Year" value={itemForm.endYear || ''} onChange={(e) => setItemForm({ ...itemForm, endYear: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
          </div>
        </div>
      </Modal>

      {/* Project Modal */}
      <Modal isOpen={modalType === 'project'} onClose={() => setModalType(null)} title={editingItem ? 'Edit Project' : 'Add Project'} onSubmit={handleItemSubmit}>
        <div className="space-y-3">
          <input type="text" placeholder="Project Title" value={itemForm.title || ''} onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" required />
          <textarea placeholder="Description" value={itemForm.description || ''} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" rows={3} />
          <input type="text" placeholder="Technologies (comma separated)" value={itemForm.technologies || ''} onChange={(e) => setItemForm({ ...itemForm, technologies: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
          <input type="url" placeholder="Project URL" value={itemForm.url || ''} onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
        </div>
      </Modal>

      {/* Certification Modal */}
      <Modal isOpen={modalType === 'certification'} onClose={() => setModalType(null)} title={editingItem ? 'Edit Certification' : 'Add Certification'} onSubmit={handleItemSubmit}>
        <div className="space-y-3">
          <input type="text" placeholder="Certification Name" value={itemForm.name || ''} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" required />
          <input type="text" placeholder="Issuing Organization" value={itemForm.issuer || ''} onChange={(e) => setItemForm({ ...itemForm, issuer: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" required />
          <input type="date" placeholder="Date" value={itemForm.date || ''} onChange={(e) => setItemForm({ ...itemForm, date: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
          <input type="text" placeholder="Credential ID" value={itemForm.credentialId || ''} onChange={(e) => setItemForm({ ...itemForm, credentialId: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
        </div>
      </Modal>

      {/* Skill Modal */}
      <Modal isOpen={modalType === 'skill'} onClose={() => setModalType(null)} title={editingItem ? 'Edit Skill' : 'Add Skill'} onSubmit={handleItemSubmit} submitText="Add Skill">
        <div className="space-y-3">
          <input type="text" placeholder="Skill Name" value={itemForm.name || ''} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" required />
          <select value={itemForm.level || 'Beginner'} onChange={(e) => setItemForm({ ...itemForm, level: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </Modal>

      {/* Resume Upload Modal */}
      <Modal isOpen={modalType === 'resume'} onClose={() => setModalType(null)} title="Upload Resume">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
            <Upload size={32} className="text-slate-400 mx-auto mb-3" />
            <p className="text-sm text-slate-600 mb-2">Drag and drop or click to upload</p>
            <p className="text-xs text-slate-400 mb-3">PDF, DOC, DOCX up to 10MB</p>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
              {uploadingResume ? 'Uploading...' : 'Select File'}
              <input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                className="hidden" 
                onChange={handleResumeUpload} 
                disabled={uploadingResume} 
              />
            </label>
          </div>
          {uploadingResume && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              Uploading your resume...
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Profile;