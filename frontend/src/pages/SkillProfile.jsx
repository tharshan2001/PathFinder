import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Briefcase, Plus, Sparkles, Trash2 } from 'lucide-react';

import {
  addSkillToProfile,
  deleteSkillFromProfile,
  getMySkillProfile,
  updateSkillInProfile,
} from '../services/skillProfileApi';

const levels = ['Beginner', 'Intermediate', 'Advanced'];

const SkillProfile = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(new Set());
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner' });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');
  const [editLevel, setEditLevel] = useState('Beginner');

  const loadSkillProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getMySkillProfile();
      setSkills(response?.data?.skills || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setSkills([]);
      } else {
        setError(err.response?.data?.message || 'Failed to load skill profile');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkillProfile();
  }, []);

  const hasSelectedSkills = useMemo(() => selectedSkills.size > 0, [selectedSkills]);
  const selectedSkillNames = useMemo(() => Array.from(selectedSkills), [selectedSkills]);
  const canUpdateSelectedSkill = selectedSkillNames.length === 1;
  const selectedSkill = useMemo(
    () => skills.find((skill) => skill.name === selectedSkillNames[0]) || null,
    [skills, selectedSkillNames]
  );

  useEffect(() => {
    if (selectedSkill?.level) {
      setEditLevel(selectedSkill.level);
    } else {
      setEditLevel('Beginner');
    }
  }, [selectedSkill]);

  const toggleSkillSelection = (skillName) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(skillName)) {
        next.delete(skillName);
      } else {
        next.add(skillName);
      }
      return next;
    });
  };

  const handleAddSkill = async (event) => {
    event.preventDefault();
    const trimmedName = newSkill.name.trim();
    const normalizedName = trimmedName.toLowerCase();

    if (!trimmedName) {
      setError('Skill name is required');
      return;
    }

    const exists = skills.some((skill) => String(skill.name || '').trim().toLowerCase() === normalizedName);
    if (exists) {
      setError('This skill is already in your profile. Please use a different skill name.');
      return;
    }

    setActionLoading('add');
    setError('');

    try {
      const response = await addSkillToProfile({ name: trimmedName, level: newSkill.level });
      setSkills(response?.data?.skills || []);
      setNewSkill({ name: '', level: 'Beginner' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setActionLoading('');
    }
  };

  const handleDeleteSelectedSkills = async () => {
    if (!hasSelectedSkills) return;

    setActionLoading('delete');
    setError('');

    try {
      await Promise.all(Array.from(selectedSkills).map((skillName) => deleteSkillFromProfile(skillName)));
      await loadSkillProfile();
      setSelectedSkills(new Set());
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete selected skills');
    } finally {
      setActionLoading('');
    }
  };

  const handleUpdateSelectedSkill = async () => {
    if (!canUpdateSelectedSkill || !selectedSkill) return;

    setActionLoading('update');
    setError('');

    try {
      const response = await updateSkillInProfile(selectedSkill.name, editLevel);
      setSkills(response?.data?.skills || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update selected skill');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        <section className="bg-gradient-to-r from-[#007AFF] to-[#0056B3] rounded-xl p-6 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="inline-flex items-center gap-2 text-xs bg-white/20 border border-white/30 px-2.5 py-1 rounded-full mb-3">
                <Sparkles size={14} />
                Personal Growth Hub
              </p>
              <h1 className="text-2xl font-bold">My Skill Profile</h1>
              <p className="text-sm text-white/90 mt-1">
                Track your skills, keep levels updated, and unlock smart recommendations.
              </p>
            </div>
            <button
              onClick={() => navigate('/recommended-jobs')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#0056B3] text-sm font-semibold hover:bg-[#E5F1FF] transition"
            >
              <Briefcase size={16} />
              Recommended Jobs
            </button>
          </div>
        </section>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 inline-flex items-start gap-2 w-full">
            <AlertTriangle size={16} className="mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Add New Skill</h2>
          <form onSubmit={handleAddSkill} className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              value={newSkill.name}
              onChange={(e) => setNewSkill((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Skill name"
              className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
            />
            <select
              value={newSkill.level}
              onChange={(e) => setNewSkill((prev) => ({ ...prev, level: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
            >
              {levels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={actionLoading === 'add'}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#007AFF] text-white text-sm font-medium hover:bg-[#0056B3] disabled:opacity-60"
            >
              <Plus size={16} />
              {actionLoading === 'add' ? 'Adding...' : 'Add Skill'}
            </button>
          </form>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-lg font-semibold text-gray-900">Your Skills ({skills.length})</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={editLevel}
                onChange={(e) => setEditLevel(e.target.value)}
                disabled={!canUpdateSelectedSkill || actionLoading === 'update'}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] disabled:opacity-50"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <button
                onClick={handleUpdateSelectedSkill}
                disabled={!canUpdateSelectedSkill || actionLoading === 'update'}
                className="px-4 py-2 rounded-lg bg-[#007AFF] text-white text-sm font-medium hover:bg-[#0056B3] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'update' ? 'Updating...' : 'Update Selected'}
              </button>
              <button
                onClick={handleDeleteSelectedSkills}
                disabled={!hasSelectedSkills || actionLoading === 'delete'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-700 text-sm font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={16} />
                {actionLoading === 'delete' ? 'Deleting...' : 'Delete Selected'}
              </button>
            </div>
          </div>
          {!canUpdateSelectedSkill && hasSelectedSkills ? (
            <p className="mt-2 text-xs text-gray-500">Select exactly one skill to update its level.</p>
          ) : null}

          <div className="mt-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading your skills...</div>
            ) : skills.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No skills yet. Add your first skill to build your profile.</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {skills.map((skill) => (
                  <label
                    key={skill.name}
                    className="flex items-center justify-between gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="inline-flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedSkills.has(skill.name)}
                        onChange={() => toggleSkillSelection(skill.name)}
                        className="h-4 w-4 rounded border-gray-300 text-[#007AFF] focus:ring-[#007AFF]"
                      />
                      <span className="font-medium text-gray-900">{skill.name}</span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#E5F1FF] text-[#0056B3] border border-[#E5F1FF]">
                      {skill.level}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SkillProfile;

