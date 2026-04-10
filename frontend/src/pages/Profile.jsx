import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import userApi from '../services/userApi';
import Navbar from '../components/Navbar';
import { MapPin, Briefcase, GraduationCap, Award, FolderGit2, Edit2, Plus, Trash2, FileText, Download, Upload, X, Check } from 'lucide-react';

const Section = ({ title, children, action, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-[#E5E5EA] overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-[#F5F5F7] transition-colors"
      >
        <h3 className="text-[17px] font-semibold text-[#1D1D1F]">{title}</h3>
        {action && <span className="text-[#007AFF] text-[14px] font-medium">{action}</span>}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

const Profile = () => {
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
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {/* Compact Profile Header */}
        <div className="bg-white rounded-[16px] shadow-sm border border-[#E5E5EA] p-5">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-[#007AFF] rounded-[16px] flex items-center justify-center text-white text-3xl font-bold">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-[24px] font-bold text-[#1D1D1F]">{profile?.name}</h1>
                  <p className="text-[15px] text-[#86868B]">{profile?.headline || 'Add headline'}</p>
                  {profile?.location && (
                    <p className="text-[13px] text-[#86868B] mt-1 flex items-center gap-1">
                      <MapPin size={12} /> {profile.location}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 border border-[#E5E5EA] rounded-[10px] text-[14px] font-medium text-[#86868B] hover:bg-[#F5F5F7] transition-colors"
                >
                  Edit
                </button>
              </div>
              <p className="text-[13px] text-[#007AFF] mt-2 font-medium">
                {profile?.connectionsCount || 0} connections
              </p>
            </div>
          </div>
          
          {profile?.about && (
            <div className="mt-4 pt-4 border-t border-[#E5E5EA]">
              <p className="text-[15px] text-[#86868B] leading-relaxed">{profile.about}</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-[12px] shadow-sm border border-[#E5E5EA] p-4 text-center">
            <div className="text-[24px] font-bold text-[#007AFF]">{profile?.experience?.length || 0}</div>
            <div className="text-[13px] text-[#86868B]">Experience</div>
          </div>
          <div className="bg-white rounded-[12px] shadow-sm border border-[#E5E5EA] p-4 text-center">
            <div className="text-[24px] font-bold text-[#007AFF]">{profile?.education?.length || 0}</div>
            <div className="text-[13px] text-[#86868B]">Education</div>
          </div>
          <div className="bg-white rounded-[12px] shadow-sm border border-[#E5E5EA] p-4 text-center">
            <div className="text-[24px] font-bold text-[#007AFF]">{profile?.skills?.length || 0}</div>
            <div className="text-[13px] text-[#86868B]">Skills</div>
          </div>
        </div>

        {/* Experience */}
        <Section title="Experience" action={<Plus size={16} />}>
          {profile.experience?.length === 0 ? (
            <p className="text-[15px] text-[#86868B] py-4">No experience added yet</p>
          ) : (
            <div className="space-y-3">
              {profile.experience.map((exp) => (
                <div key={exp._id} className="flex gap-3 p-3 bg-[#F5F5F7] rounded-[12px]">
                  <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center shrink-0">
                    <Briefcase size={18} className="text-[#007AFF]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[15px] text-[#1D1D1F]">{exp.title}</h4>
                    <p className="text-[14px] text-[#86868B]">{exp.company}</p>
                    <p className="text-[12px] text-[#A1A1A6] mt-1">
                      {exp.startDate?.slice(0, 7)} - {exp.endDate?.slice(0, 7) || 'Present'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Education */}
        <Section title="Education">
          {profile.education?.length === 0 ? (
            <p className="text-[15px] text-[#86868B] py-4">No education added yet</p>
          ) : (
            <div className="space-y-3">
              {profile.education.map((edu) => (
                <div key={edu._id} className="flex gap-3 p-3 bg-[#F5F5F7] rounded-[12px]">
                  <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center shrink-0">
                    <GraduationCap size={18} className="text-[#5856D6]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[15px] text-[#1D1D1F]">{edu.school}</h4>
                    <p className="text-[14px] text-[#86868B]">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</p>
                    <p className="text-[12px] text-[#A1A1A6] mt-1">{edu.startYear} - {edu.endYear || 'Present'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Skills */}
        <Section title="Skills">
          {profile.skills?.length === 0 ? (
            <p className="text-[15px] text-[#86868B] py-4">No skills added yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <span key={idx} className="px-4 py-2 bg-[#E5F1FF] text-[#007AFF] rounded-full text-[14px] font-medium">
                  {skill?.skill || skill?.name || skill}
                </span>
              ))}
            </div>
          )}
        </Section>

        {/* Projects */}
        <Section title="Projects">
          {profile.projects?.length === 0 ? (
            <p className="text-[15px] text-[#86868B] py-4">No projects added yet</p>
          ) : (
            <div className="space-y-3">
              {profile.projects.map((project) => (
                <div key={project._id} className="p-3 bg-[#F5F5F7] rounded-[12px]">
                  <h4 className="font-semibold text-[15px] text-[#1D1D1F]">{project.title}</h4>
                  <p className="text-[14px] text-[#86868B] mt-1">{project.description}</p>
                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-white text-[#86868B] text-[12px] rounded-full">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Certifications */}
        <Section title="Certifications">
          {profile.certifications?.length === 0 ? (
            <p className="text-[15px] text-[#86868B] py-4">No certifications added yet</p>
          ) : (
            <div className="space-y-3">
              {profile.certifications.map((cert) => (
                <div key={cert._id} className="flex gap-3 p-3 bg-[#F5F5F7] rounded-[12px]">
                  <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center shrink-0">
                    <Award size={18} className="text-[#FF9500]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[15px] text-[#1D1D1F]">{cert.name}</h4>
                    <p className="text-[14px] text-[#86868B]">{cert.issuer}</p>
                    <p className="text-[12px] text-[#A1A1A6] mt-1">{cert.date?.slice(0, 10)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Resumes */}
        <Section title="Resumes">
          {profile.resumes?.length === 0 ? (
            <p className="text-[15px] text-[#86868B] py-4">No resumes uploaded yet</p>
          ) : (
            <div className="space-y-2">
              {profile.resumes.map((resume) => (
                <div key={resume._id} className="flex items-center justify-between p-3 bg-[#F5F5F7] rounded-[10px]">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-[#86868B]" />
                    <span className="text-[15px] text-[#1D1D1F]">{resume.fileName}</span>
                  </div>
                  {resume.fileUrl && (
                    <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[#007AFF] hover:underline text-[14px]">
                      Download
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>
      </main>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-[#E5E5EA]">
              <h3 className="text-[20px] font-bold text-[#1D1D1F]">Edit Profile</h3>
              <button onClick={() => setEditing(false)} className="text-[#86868B] hover:text-[#1D1D1F]">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-5 space-y-4">
              <div>
                <label className="block text-[14px] font-medium text-[#86868B] mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F5F7] rounded-[12px] text-[17px] focus:ring-2 focus:ring-[#007AFF] outline-none"
                />
              </div>
              <div>
                <label className="block text-[14px] font-medium text-[#86868B] mb-2">Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F5F7] rounded-[12px] text-[17px] focus:ring-2 focus:ring-[#007AFF] outline-none"
                />
              </div>
              <div>
                <label className="block text-[14px] font-medium text-[#86868B] mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F5F7] rounded-[12px] text-[17px] focus:ring-2 focus:ring-[#007AFF] outline-none"
                />
              </div>
              <div>
                <label className="block text-[14px] font-medium text-[#86868B] mb-2">About</label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#F5F5F7] rounded-[12px] text-[17px] focus:ring-2 focus:ring-[#007AFF] outline-none resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 px-4 py-3 border border-[#E5E5EA] rounded-[12px] font-semibold text-[15px] text-[#86868B] hover:bg-[#F5F5F7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#007AFF] text-white rounded-[12px] font-semibold text-[15px] hover:bg-[#0056B3]"
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

export default Profile;