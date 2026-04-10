import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Briefcase,
  CheckCircle2,
  FileText,
  FolderTree,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Send,
  TrendingUp,
  Trash2,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../stores/authStore';
import jobMarketApi from '../services/jobMarketApi';

const tabs = [
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
];

const toCsvList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const formatDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
};

const money = (value, currency = 'USD') => {
  if (value === null || value === undefined || value === '') return '-';
  return `${currency} ${Number(value).toLocaleString()}`;
};

const emptyJobForm = {
  title: '',
  description: '',
  company: '',
  location: '',
  industry: '',
  role: '',
  level: 'Mid-level',
  employmentType: 'Full-time',
  remotePolicy: 'On-site',
  skillsCsv: '',
  salaryMin: '',
  salaryMax: '',
  companyWebsite: '',
  applicationUrl: '',
};

const emptyAlertForm = {
  title: '',
  keywordsCsv: '',
  location: '',
  remotePolicy: 'any',
  frequency: 'daily',
  skillsCsv: '',
  companiesCsv: '',
};

const emptyCategoryForm = {
  name: '',
  description: '',
  type: 'industry',
  isFeatured: false,
  isActive: true,
};

const emptySkillForm = {
  skill: '',
  demandScore: '',
  growthRate: '',
  category: '',
  skillType: 'technical',
  remoteDemandScore: '',
};

const emptyApplicationForm = {
  coverLetter: '',
  resumeUrl: '',
  portfolioUrl: '',
  expectedSalaryMin: '',
  expectedSalaryMax: '',
};

function JobMarket({ guestMode = false }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const deepLinkJobId = searchParams.get('jobId');
  const { user } = useAuthStore();
  const currentUserId = user?._id || user?.id;
  const isGuestMode = guestMode && !currentUserId;

  const [activeTab, setActiveTab] = useState('jobs');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [jobStats, setJobStats] = useState({});
  const [appStats, setAppStats] = useState({});
  const [alertStats, setAlertStats] = useState({});
  const [skillStats, setSkillStats] = useState({});
  const [publicCategoryCount, setPublicCategoryCount] = useState(0);

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsMeta, setJobsMeta] = useState({ current: 1, pages: 1, total: 0 });
  const [jobFilters, setJobFilters] = useState({
    search: '',
    location: '',
    industry: '',
    role: '',
    level: '',
    employmentType: '',
    remotePolicy: '',
  });

  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState(emptyJobForm);
  const [jobFeedMode, setJobFeedMode] = useState('all');
  const [showEditJobForm, setShowEditJobForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState('');
  const [editJobForm, setEditJobForm] = useState(emptyJobForm);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetailsLoading, setJobDetailsLoading] = useState(false);
  const [highlightedJobId, setHighlightedJobId] = useState('');

  const [showApply, setShowApply] = useState(false);
  const [applyingJob, setApplyingJob] = useState(null);
  const [applicationForm, setApplicationForm] = useState(emptyApplicationForm);

  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [applicationViewMode, setApplicationViewMode] = useState('mine');
  const [applicationJobId, setApplicationJobId] = useState('');
  const [showApplicationManager, setShowApplicationManager] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicationManagerStatus, setApplicationManagerStatus] = useState('submitted');
  const [applicationReviewNotes, setApplicationReviewNotes] = useState('');
  const [interviewForm, setInterviewForm] = useState({
    date: '',
    type: 'video',
    location: '',
    notes: '',
  });
  const [communicationForm, setCommunicationForm] = useState({
    type: 'email',
    subject: '',
    message: '',
  });

  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [alertForm, setAlertForm] = useState(emptyAlertForm);
  const [alertMatches, setAlertMatches] = useState({});
  const [loadingMatchesFor, setLoadingMatchesFor] = useState('');

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoryType, setCategoryType] = useState('');
  const [categoryViewMode, setCategoryViewMode] = useState('all');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [showEditCategoryForm, setShowEditCategoryForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState('');
  const [editCategoryForm, setEditCategoryForm] = useState(emptyCategoryForm);

  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [trendingParams, setTrendingParams] = useState({ limit: 20, minDemandScore: 0 });
  const [trendingViewMode, setTrendingViewMode] = useState('all');
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [skillForm, setSkillForm] = useState(emptySkillForm);
  const [showEditSkillForm, setShowEditSkillForm] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState('');
  const [editSkillForm, setEditSkillForm] = useState(emptySkillForm);

  const userRole = String(user?.role || '').toLowerCase();
  const isAdmin = userRole === 'admin';
  const isCandidateRole = userRole === 'user' || userRole === 'mentor';
  const canRunProcessAllAlerts = isAdmin;
  const roleWorkspaceLabel = isGuestMode
    ? 'Guest Workspace'
    : isAdmin
      ? 'Admin Workspace'
      : isCandidateRole
        ? 'Candidate Workspace'
        : 'Member Workspace';
  const roleWorkspaceClass = isGuestMode
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : isAdmin
      ? 'bg-[#d6e3ff] text-[#004c99] border-[#d6e3ff]'
      : 'bg-[#d6e3ff] text-[#004c99] border-[#d6e3ff]';
  const visibleTabs = isGuestMode
    ? tabs.filter((tab) => ['jobs', 'categories', 'trending'].includes(tab.id))
    : tabs;

  const dashboardCards = useMemo(
    () => {
      if (isGuestMode) {
        return [
          {
            title: 'Active Jobs',
            value: jobStats?.overview?.totalJobs || 0,
            icon: Briefcase,
          },
          {
            title: 'Active Categories',
            value: publicCategoryCount || 0,
            icon: FolderTree,
          },
          {
            title: 'Tracked Skills',
            value: skillStats?.overview?.totalSkills || 0,
            icon: TrendingUp,
          },
          {
            title: 'Hot Skills',
            value: skillStats?.overview?.hotSkillsCount || 0,
            icon: BarChart3,
          },
        ];
      }

      return [
        {
          title: 'Active Jobs',
          value: jobStats?.overview?.totalJobs || 0,
          icon: Briefcase,
        },
        {
          title: 'Your Applications',
          value: appStats?.overview?.totalApplications || 0,
          icon: FileText,
        },
        {
          title: 'Active Alerts',
          value: alertStats?.overview?.activeAlerts || 0,
          icon: Bell,
        },
        {
          title: 'Tracked Skills',
          value: skillStats?.overview?.totalSkills || 0,
          icon: TrendingUp,
        },
      ];
    },
    [isGuestMode, jobStats, appStats, alertStats, skillStats, publicCategoryCount]
  );

  const buildJobPayload = (form) => ({
    title: form.title,
    description: form.description,
    company: form.company,
    location: form.location,
    category: {
      industry: form.industry,
      role: form.role,
      level: form.level,
    },
    employmentType: form.employmentType,
    remotePolicy: form.remotePolicy,
    skillsRequired: toCsvList(form.skillsCsv).map((name) => ({
      name,
      level: 'Intermediate',
    })),
    salary: {
      min: form.salaryMin ? Number(form.salaryMin) : undefined,
      max: form.salaryMax ? Number(form.salaryMax) : undefined,
      currency: 'USD',
    },
    companyWebsite: form.companyWebsite,
    applicationUrl: form.applicationUrl,
  });

  const mapJobToForm = (job) => ({
    title: job?.title || '',
    description: job?.description || '',
    company: job?.company || '',
    location: job?.location || '',
    industry: job?.category?.industry || '',
    role: job?.category?.role || '',
    level: job?.category?.level || 'Mid-level',
    employmentType: job?.employmentType || 'Full-time',
    remotePolicy: job?.remotePolicy || 'On-site',
    skillsCsv: (job?.skillsRequired || []).map((skill) => skill?.name).filter(Boolean).join(', '),
    salaryMin:
      job?.salary?.min === null || job?.salary?.min === undefined
        ? ''
        : String(job.salary.min),
    salaryMax:
      job?.salary?.max === null || job?.salary?.max === undefined
        ? ''
        : String(job.salary.max),
    companyWebsite: job?.companyWebsite || '',
    applicationUrl: job?.applicationUrl || '',
  });

  const loadPublicDashboard = async () => {
    setBusy(true);
    setError('');

    const [jobRes, categoryRes, skillRes] = await Promise.allSettled([
      jobMarketApi.getJobStatistics(),
      jobMarketApi.getJobCategories({ isActive: true }),
      jobMarketApi.getSkillStatistics(),
    ]);

    if (jobRes.status === 'fulfilled') {
      setJobStats(jobRes.value.data || {});
    }
    if (categoryRes.status === 'fulfilled') {
      const categoriesData = Array.isArray(categoryRes.value.data) ? categoryRes.value.data : [];
      setPublicCategoryCount(categoriesData.length);
    }
    if (skillRes.status === 'fulfilled') {
      setSkillStats(skillRes.value.data || {});
    }

    if (
      jobRes.status === 'rejected' ||
      categoryRes.status === 'rejected' ||
      skillRes.status === 'rejected'
    ) {
      setError('Some public dashboard data could not be loaded.');
    }

    setBusy(false);
  };

  const loadDashboard = async () => {
    if (!currentUserId) return;
    setBusy(true);
    setError('');

    const [jobRes, appRes, alertRes, skillRes] = await Promise.allSettled([
      jobMarketApi.getJobStatistics(),
      jobMarketApi.getApplicationStatistics({ userId: currentUserId }),
      jobMarketApi.getAlertStatistics({ userId: currentUserId }),
      jobMarketApi.getSkillStatistics(),
    ]);

    if (jobRes.status === 'fulfilled') {
      setJobStats(jobRes.value.data || {});
    }
    if (appRes.status === 'fulfilled') {
      setAppStats(appRes.value.data || {});
    }
    if (alertRes.status === 'fulfilled') {
      setAlertStats(alertRes.value.data || {});
    }
    if (skillRes.status === 'fulfilled') {
      setSkillStats(skillRes.value.data || {});
    }

    if (
      jobRes.status === 'rejected' ||
      appRes.status === 'rejected' ||
      alertRes.status === 'rejected' ||
      skillRes.status === 'rejected'
    ) {
      setError('Some dashboard data could not be loaded.');
    }

    setBusy(false);
  };

  const loadJobs = async (page = jobsPage, mode = jobFeedMode) => {
    setJobsLoading(true);
    setError('');
    try {
      if (mode === 'featured') {
        const res = await jobMarketApi.getFeaturedJobs(8);
        const jobItems = Array.isArray(res.data) ? res.data : [];
        setJobs(jobItems);
        setJobsMeta({ current: 1, pages: 1, total: jobItems.length });
        setJobsPage(1);
        return;
      }

      if (mode === 'recent') {
        const res = await jobMarketApi.getRecentJobs(8);
        const jobItems = Array.isArray(res.data) ? res.data : [];
        setJobs(jobItems);
        setJobsMeta({ current: 1, pages: 1, total: jobItems.length });
        setJobsPage(1);
        return;
      }

      if (mode === 'advanced') {
        const params = {
          q: jobFilters.search || undefined,
          page,
          limit: 8,
        };
        const res = await jobMarketApi.searchJobs(params);
        setJobs(res.data.jobs || []);
        setJobsMeta(res.data.pagination || { current: 1, pages: 1, total: 0 });
        setJobsPage(page);
        return;
      }

      const params = {
        page,
        limit: 8,
        ...jobFilters,
      };
      const res = await jobMarketApi.getJobs(params);
      setJobs(res.data.jobs || []);
      setJobsMeta(res.data.pagination || { current: 1, pages: 1, total: 0 });
      setJobsPage(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setJobsLoading(false);
    }
  };

  const loadApplications = async () => {
    if (!currentUserId) return;
    setApplicationsLoading(true);
    setError('');
    try {
      const params = applicationStatus ? { status: applicationStatus } : {};
      const res = await jobMarketApi.getUserApplications(currentUserId, params);
      setApplications(res.data.applications || []);
      setApplicationViewMode('mine');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setApplicationsLoading(false);
    }
  };

  const loadApplicationsByJob = async () => {
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    if (!applicationJobId) {
      setError('Enter a Job ID to load applications');
      return;
    }

    setApplicationsLoading(true);
    setError('');
    try {
      const params = applicationStatus ? { status: applicationStatus } : {};
      const res = await jobMarketApi.getJobApplications(applicationJobId, params);
      setApplications(res.data.applications || []);
      setApplicationViewMode('job');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load job applications');
    } finally {
      setApplicationsLoading(false);
    }
  };

  const loadApplicationsByStatusView = async () => {
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    if (!applicationStatus) {
      setError('Select a status to load applications by status');
      return;
    }

    setApplicationsLoading(true);
    setError('');
    try {
      const res = await jobMarketApi.getApplicationsByStatus(applicationStatus);
      setApplications(res.data.applications || []);
      setApplicationViewMode('status');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications by status');
    } finally {
      setApplicationsLoading(false);
    }
  };

  const reloadApplicationsView = async () => {
    if (applicationViewMode === 'job') {
      await loadApplicationsByJob();
      return;
    }

    if (applicationViewMode === 'status') {
      await loadApplicationsByStatusView();
      return;
    }

    await loadApplications();
  };

  const loadAlerts = async () => {
    if (!currentUserId) return;
    setAlertsLoading(true);
    setError('');
    try {
      const res = await jobMarketApi.getUserJobAlerts(currentUserId, { isActive: true });
      setAlerts(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load alerts');
    } finally {
      setAlertsLoading(false);
    }
  };

  const loadCategories = async () => {
    setCategoriesLoading(true);
    setError('');
    try {
      if (categoryViewMode === 'featured') {
        const res = await jobMarketApi.getFeaturedCategories(
          categoryType ? { type: categoryType, limit: 50 } : { limit: 50 }
        );
        setCategories(res.data || []);
        return;
      }

      if (categoryViewMode === 'popular') {
        const res = await jobMarketApi.getPopularCategories(
          categoryType ? { type: categoryType, limit: 50 } : { limit: 50 }
        );
        setCategories(res.data || []);
        return;
      }

      if (categoryViewMode === 'type') {
        if (!categoryType) {
          setCategories([]);
          setError('Select a category type for Type view');
          return;
        }

        const res = await jobMarketApi.getCategoriesByType(categoryType, { isActive: true });
        setCategories(res.data || []);
        return;
      }

      const params = categoryType ? { type: categoryType, isActive: true } : { isActive: true };
      const res = await jobMarketApi.getJobCategories(params);
      setCategories(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const loadTrending = async () => {
    setTrendingLoading(true);
    setError('');
    try {
      let res;

      if (trendingViewMode === 'rising') {
        res = await jobMarketApi.getRisingSkills(trendingParams);
      } else if (trendingViewMode === 'hot') {
        res = await jobMarketApi.getHotSkills(trendingParams);
      } else {
        res = await jobMarketApi.getTrendingSkills(trendingParams);
      }

      setTrending(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load trending skills');
    } finally {
      setTrendingLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUserId) return;
    loadDashboard();
  }, [currentUserId]);

  useEffect(() => {
    if (!isGuestMode) return;
    loadPublicDashboard();
  }, [isGuestMode]);

  useEffect(() => {
    if (activeTab === 'jobs') {
      loadJobs(1, jobFeedMode);
      return;
    }

    if (activeTab === 'applications') {
      if (!currentUserId) return;
      loadApplications();
      return;
    }

    if (activeTab === 'alerts') {
      if (!currentUserId) return;
      loadAlerts();
      return;
    }

    if (activeTab === 'categories') {
      loadCategories();
      return;
    }

    if (activeTab === 'trending') {
      loadTrending();
    }
  }, [activeTab, currentUserId, jobFeedMode, categoryViewMode, trendingViewMode]);

  useEffect(() => {
    if (!isGuestMode) return;
    if (activeTab === 'applications' || activeTab === 'alerts') {
      setActiveTab('jobs');
    }
  }, [activeTab, isGuestMode]);

  const handleCreateJob = async (event) => {
    event.preventDefault();
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    setError('');

    try {
      const payload = buildJobPayload(jobForm);

      await jobMarketApi.createJob(payload);
      setShowJobForm(false);
      setJobForm(emptyJobForm);
      await loadJobs(1, jobFeedMode);
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
    }
  };

  const handleViewJobDetails = async (jobId) => {
    setJobDetailsLoading(true);
    setError('');
    try {
      const res = await jobMarketApi.getJobById(jobId);
      setSelectedJob(res.data || null);
      setShowJobDetails(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load job details');
    } finally {
      setJobDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (!deepLinkJobId) return;

    if (activeTab !== 'jobs') {
      setActiveTab('jobs');
    }
  }, [deepLinkJobId, activeTab]);

  useEffect(() => {
    if (!deepLinkJobId || activeTab !== 'jobs' || jobsLoading) return;

    const target = document.getElementById(`job-card-${deepLinkJobId}`);
    if (!target) return;

    setHighlightedJobId(deepLinkJobId);
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const next = new URLSearchParams(searchParams);
    next.delete('jobId');
    setSearchParams(next, { replace: true });
  }, [deepLinkJobId, activeTab, jobsLoading, jobs, searchParams, setSearchParams]);

  const openEditJob = async (jobId) => {
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    setJobDetailsLoading(true);
    setError('');
    try {
      const res = await jobMarketApi.getJobById(jobId);
      const job = res.data || {};
      setEditingJobId(jobId);
      setEditJobForm(mapJobToForm(job));
      setShowJobForm(false);
      setShowEditJobForm(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load job for editing');
    } finally {
      setJobDetailsLoading(false);
    }
  };

  const handleUpdateJob = async (event) => {
    event.preventDefault();
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    if (!editingJobId) return;

    setError('');
    try {
      const payload = buildJobPayload(editJobForm);
      await jobMarketApi.updateJob(editingJobId, payload);
      setShowEditJobForm(false);
      setEditingJobId('');
      setEditJobForm(emptyJobForm);
      await loadJobs(jobsPage, jobFeedMode);
      await loadDashboard();

      if (selectedJob?._id === editingJobId) {
        const res = await jobMarketApi.getJobById(editingJobId);
        setSelectedJob(res.data || null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    if (!window.confirm('Delete this job posting?')) return;
    setError('');
    try {
      await jobMarketApi.deleteJob(jobId);
      await loadJobs(jobsPage, jobFeedMode);
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete job');
    }
  };

  const openApply = (job) => {
    setApplyingJob(job);
    setApplicationForm(emptyApplicationForm);
    setShowApply(true);
  };

  const handleApplyToJob = async (event) => {
    event.preventDefault();
    if (!applyingJob?._id) return;

    setError('');
    try {
      await jobMarketApi.submitApplication(applyingJob._id, {
        coverLetter: applicationForm.coverLetter,
        resumeUrl: applicationForm.resumeUrl,
        portfolioUrl: applicationForm.portfolioUrl,
        expectedSalary: {
          min: applicationForm.expectedSalaryMin
            ? Number(applicationForm.expectedSalaryMin)
            : undefined,
          max: applicationForm.expectedSalaryMax
            ? Number(applicationForm.expectedSalaryMax)
            : undefined,
          currency: 'USD',
        },
      });
      setShowApply(false);
      setApplyingJob(null);
      await loadApplications();
      await loadDashboard();
      setActiveTab('applications');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    }
  };

  const handleWithdrawApplication = async (applicationId) => {
    if (!window.confirm('Withdraw this application?')) return;
    setError('');
    try {
      await jobMarketApi.withdrawApplication(applicationId);
      await reloadApplicationsView();
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to withdraw application');
    }
  };

  const openApplicationManager = async (applicationId) => {
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    setError('');
    try {
      const res = await jobMarketApi.getApplicationById(applicationId);
      const application = res.data || null;
      setSelectedApplication(application);
      setApplicationManagerStatus(application?.status || 'submitted');
      setApplicationReviewNotes(application?.reviewNotes || '');
      setInterviewForm({
        date: application?.interviewSchedule?.date
          ? new Date(application.interviewSchedule.date).toISOString().slice(0, 16)
          : '',
        type: application?.interviewSchedule?.type || 'video',
        location: application?.interviewSchedule?.location || '',
        notes: application?.interviewSchedule?.notes || '',
      });
      setCommunicationForm({ type: 'email', subject: '', message: '' });
      setShowApplicationManager(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load application details');
    }
  };

  const handleApplicationStatusUpdate = async () => {
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    if (!selectedApplication?._id) return;

    setError('');
    try {
      await jobMarketApi.updateApplicationStatus(selectedApplication._id, {
        status: applicationManagerStatus,
        reviewNotes: applicationReviewNotes,
        reviewedBy: currentUserId,
      });

      const res = await jobMarketApi.getApplicationById(selectedApplication._id);
      setSelectedApplication(res.data || null);
      await reloadApplicationsView();
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update application status');
    }
  };

  const handleInterviewSchedule = async () => {
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    if (!selectedApplication?._id) return;
    if (!interviewForm.date) {
      setError('Interview date is required');
      return;
    }

    setError('');
    try {
      await jobMarketApi.scheduleInterview(selectedApplication._id, {
        date: interviewForm.date,
        type: interviewForm.type,
        location: interviewForm.location,
        notes: interviewForm.notes,
      });

      const res = await jobMarketApi.getApplicationById(selectedApplication._id);
      setSelectedApplication(res.data || null);
      await reloadApplicationsView();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule interview');
    }
  };

  const handleAddApplicationCommunication = async () => {
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    if (!selectedApplication?._id) return;
    if (!communicationForm.message) {
      setError('Communication message is required');
      return;
    }

    setError('');
    try {
      await jobMarketApi.addApplicationCommunication(selectedApplication._id, {
        type: communicationForm.type,
        subject: communicationForm.subject,
        message: communicationForm.message,
        sentBy: currentUserId,
      });

      const res = await jobMarketApi.getApplicationById(selectedApplication._id);
      setSelectedApplication(res.data || null);
      setCommunicationForm({ type: 'email', subject: '', message: '' });
      await reloadApplicationsView();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add communication');
    }
  };

  const handleDeleteApplication = async () => {
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    if (!selectedApplication?._id) return;
    if (!window.confirm('Delete this application?')) return;

    setError('');
    try {
      await jobMarketApi.deleteApplication(selectedApplication._id);
      setShowApplicationManager(false);
      setSelectedApplication(null);
      await reloadApplicationsView();
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete application');
    }
  };

  const handleCreateAlert = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await jobMarketApi.createJobAlert({
        title: alertForm.title,
        keywords: toCsvList(alertForm.keywordsCsv),
        location: alertForm.location,
        remotePolicy: alertForm.remotePolicy,
        frequency: alertForm.frequency,
        skills: toCsvList(alertForm.skillsCsv),
        companies: toCsvList(alertForm.companiesCsv),
      });
      setAlertForm(emptyAlertForm);
      setShowAlertForm(false);
      await loadAlerts();
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create alert');
    }
  };

  const handleToggleAlert = async (alert) => {
    setError('');
    try {
      await jobMarketApi.toggleJobAlert(alert._id, !alert.isActive);
      await loadAlerts();
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle alert');
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!window.confirm('Delete this alert?')) return;
    setError('');
    try {
      await jobMarketApi.deleteJobAlert(alertId);
      await loadAlerts();
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete alert');
    }
  };

  const handleFindMatches = async (alertId) => {
    setLoadingMatchesFor(alertId);
    setError('');
    try {
      const res = await jobMarketApi.findMatchingJobs(alertId, 5);
      setAlertMatches((prev) => ({ ...prev, [alertId]: res.data.matchingJobs || [] }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch matching jobs');
    } finally {
      setLoadingMatchesFor('');
    }
  };

  const handleProcessAlerts = async () => {
    if (!canRunProcessAllAlerts) {
      setError('Admin access required to process all alerts');
      return;
    }

    setError('');
    try {
      await jobMarketApi.processAllAlerts('daily');
      await loadAlerts();
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process alerts');
    }
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    setError('');
    try {
      await jobMarketApi.createJobCategory({
        ...categoryForm,
      });
      setCategoryForm(emptyCategoryForm);
      setShowCategoryForm(false);
      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const openEditCategory = (category) => {
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    setEditingCategoryId(category._id);
    setEditCategoryForm({
      name: category.name || '',
      description: category.description || '',
      type: category.type || 'industry',
      isFeatured: Boolean(category.isFeatured),
      isActive: category.isActive !== false,
    });
    setShowCategoryForm(false);
    setShowEditCategoryForm(true);
  };

  const handleUpdateCategory = async (event) => {
    event.preventDefault();
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    if (!editingCategoryId) return;

    setError('');
    try {
      await jobMarketApi.updateJobCategory(editingCategoryId, { ...editCategoryForm });
      setShowEditCategoryForm(false);
      setEditingCategoryId('');
      setEditCategoryForm(emptyCategoryForm);
      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    if (!window.confirm('Delete this category?')) return;
    setError('');
    try {
      await jobMarketApi.deleteJobCategory(categoryId);
      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleUpsertSkill = async (event) => {
    event.preventDefault();
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    setError('');
    try {
      await jobMarketApi.upsertTrendingSkill(skillForm.skill, {
        demandScore: skillForm.demandScore ? Number(skillForm.demandScore) : 0,
        growthRate: skillForm.growthRate ? Number(skillForm.growthRate) : 0,
        category: skillForm.category,
        skillType: skillForm.skillType,
        remoteDemandScore: skillForm.remoteDemandScore ? Number(skillForm.remoteDemandScore) : 0,
      });
      setSkillForm(emptySkillForm);
      setShowSkillForm(false);
      await loadTrending();
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upsert trending skill');
    }
  };

  const openEditSkill = (skill) => {
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    setEditingSkillId(skill._id);
    setEditSkillForm({
      skill: skill.skill || '',
      demandScore:
        skill.demandScore === null || skill.demandScore === undefined
          ? ''
          : String(skill.demandScore),
      growthRate:
        skill.growthRate === null || skill.growthRate === undefined
          ? ''
          : String(skill.growthRate),
      category: skill.category || '',
      skillType: skill.skillType || 'technical',
      remoteDemandScore:
        skill.remoteDemandScore === null || skill.remoteDemandScore === undefined
          ? ''
          : String(skill.remoteDemandScore),
    });
    setShowSkillForm(false);
    setShowEditSkillForm(true);
  };

  const handleUpdateSkill = async (event) => {
    event.preventDefault();
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    if (!editingSkillId) return;

    setError('');
    try {
      await jobMarketApi.updateTrendingSkill(editingSkillId, {
        skill: editSkillForm.skill,
        demandScore: editSkillForm.demandScore ? Number(editSkillForm.demandScore) : 0,
        growthRate: editSkillForm.growthRate ? Number(editSkillForm.growthRate) : 0,
        category: editSkillForm.category,
        skillType: editSkillForm.skillType,
        remoteDemandScore: editSkillForm.remoteDemandScore
          ? Number(editSkillForm.remoteDemandScore)
          : 0,
      });
      setShowEditSkillForm(false);
      setEditingSkillId('');
      setEditSkillForm(emptySkillForm);
      await loadTrending();
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update skill');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    if (!window.confirm('Delete this trending skill?')) return;
    setError('');
    try {
      await jobMarketApi.deleteTrendingSkill(skillId);
      await loadTrending();
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete trending skill');
    }
  };

  const handleRunSkillUpdate = async () => {
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    setError('');
    try {
      await jobMarketApi.updateSkillTrends();
      await loadTrending();
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to run trend update');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <section className="bg-linear-to-r from-[#005eb5] to-[#004c99] rounded-xl shadow-sm p-6 mb-6 text-white">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${roleWorkspaceClass}`}>
                  {roleWorkspaceLabel}
                </span>
              </div>
              <h1 className="text-2xl font-bold">Job Market</h1>
              <p className="text-sm text-white/90 mt-1">
                Jobs, applications, alerts, categories, and skill trends in one workspace.
              </p>
            </div>
            <button
              onClick={isGuestMode ? loadPublicDashboard : loadDashboard}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#004c99] rounded-lg text-sm font-medium hover:bg-[#d6e3ff] transition-colors"
              disabled={busy}
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Refresh Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            {dashboardCards.map((card) => (
              <div key={card.title} className="p-4 rounded-lg border border-white/30 bg-white/15">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/85">{card.title}</p>
                  <card.icon size={16} className="text-white/90" />
                </div>
                <p className="text-2xl font-bold text-white mt-2">{card.value}</p>
              </div>
            ))}
          </div>
        </section>

        {error ? (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5" />
            <span>{error}</span>
          </div>
        ) : null}

        {isGuestMode ? (
          <div className="mb-4 p-3 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-sm flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5" />
            <span>Guest test mode is active. You can browse public job-market data only.</span>
          </div>
        ) : null}

        {!isGuestMode && isCandidateRole ? (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-sm flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-0.5" />
            <span>Candidate mode is active. Platform management actions are restricted to admins.</span>
          </div>
        ) : null}

        <section className="bg-white rounded-xl shadow-sm p-2 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[#d6e3ff] text-[#005eb5]'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {activeTab === 'jobs' ? (
          <section className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="relative md:col-span-2">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={jobFilters.search}
                    onChange={(e) => setJobFilters((prev) => ({ ...prev, search: e.target.value }))}
                    placeholder="Search jobs by title, company, keywords"
                    className="w-full pl-9 pr-3 py-2 border rounded-lg"
                  />
                </div>
                <input
                  value={jobFilters.location}
                  onChange={(e) => setJobFilters((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Location"
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  value={jobFilters.industry}
                  onChange={(e) => setJobFilters((prev) => ({ ...prev, industry: e.target.value }))}
                  placeholder="Industry"
                  className="px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="mt-3 flex gap-2 flex-wrap">
                <select
                  value={jobFeedMode}
                  onChange={(e) => setJobFeedMode(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="all">All Jobs</option>
                  <option value="featured">Featured Jobs</option>
                  <option value="recent">Recent Jobs</option>
                  <option value="advanced">Advanced Search</option>
                </select>
                <button
                  onClick={() => loadJobs(1, jobFeedMode)}
                  className="px-4 py-2 bg-[#005eb5] text-white rounded-lg text-sm font-medium hover:bg-[#004c99] transition-colors"
                >
                  {jobFeedMode === 'advanced' ? 'Run Search' : 'Search'}
                </button>
                <button
                  onClick={() => {
                    setJobFilters({
                      search: '',
                      location: '',
                      industry: '',
                      role: '',
                      level: '',
                      employmentType: '',
                      remotePolicy: '',
                    });
                    loadJobs(1, jobFeedMode);
                  }}
                  className="px-4 py-2 border rounded-lg text-sm font-medium"
                >
                  Reset
                </button>
                {!isGuestMode && isAdmin ? (
                  <button
                    onClick={() => {
                      setShowEditJobForm(false);
                      setShowJobForm((prev) => !prev);
                    }}
                    className="ml-auto px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium inline-flex items-center gap-2 hover:bg-gray-50"
                  >
                    <Plus size={16} />
                    Post Job
                  </button>
                ) : null}
              </div>

              {showJobForm ? (
                <form onSubmit={handleCreateJob} className="mt-4 border rounded-lg p-3 bg-gray-50 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input required value={jobForm.title} onChange={(e) => setJobForm((p) => ({ ...p, title: e.target.value }))} placeholder="Job title" className="px-3 py-2 border rounded-lg" />
                    <input required value={jobForm.company} onChange={(e) => setJobForm((p) => ({ ...p, company: e.target.value }))} placeholder="Company" className="px-3 py-2 border rounded-lg" />
                    <input required value={jobForm.location} onChange={(e) => setJobForm((p) => ({ ...p, location: e.target.value }))} placeholder="Location" className="px-3 py-2 border rounded-lg" />
                    <input required value={jobForm.industry} onChange={(e) => setJobForm((p) => ({ ...p, industry: e.target.value }))} placeholder="Industry" className="px-3 py-2 border rounded-lg" />
                    <input required value={jobForm.role} onChange={(e) => setJobForm((p) => ({ ...p, role: e.target.value }))} placeholder="Role" className="px-3 py-2 border rounded-lg" />
                    <select value={jobForm.level} onChange={(e) => setJobForm((p) => ({ ...p, level: e.target.value }))} className="px-3 py-2 border rounded-lg">
                      <option>Entry-level</option>
                      <option>Mid-level</option>
                      <option>Senior</option>
                      <option>Lead</option>
                      <option>Manager</option>
                      <option>Director</option>
                    </select>
                    <select value={jobForm.employmentType} onChange={(e) => setJobForm((p) => ({ ...p, employmentType: e.target.value }))} className="px-3 py-2 border rounded-lg">
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                      <option>Freelance</option>
                      <option>Remote</option>
                    </select>
                    <select value={jobForm.remotePolicy} onChange={(e) => setJobForm((p) => ({ ...p, remotePolicy: e.target.value }))} className="px-3 py-2 border rounded-lg">
                      <option>On-site</option>
                      <option>Hybrid</option>
                      <option>Remote</option>
                      <option>Remote-friendly</option>
                    </select>
                    <input value={jobForm.salaryMin} onChange={(e) => setJobForm((p) => ({ ...p, salaryMin: e.target.value }))} placeholder="Salary min" type="number" className="px-3 py-2 border rounded-lg" />
                    <input value={jobForm.salaryMax} onChange={(e) => setJobForm((p) => ({ ...p, salaryMax: e.target.value }))} placeholder="Salary max" type="number" className="px-3 py-2 border rounded-lg" />
                    <input value={jobForm.companyWebsite} onChange={(e) => setJobForm((p) => ({ ...p, companyWebsite: e.target.value }))} placeholder="Company website" className="px-3 py-2 border rounded-lg" />
                    <input value={jobForm.applicationUrl} onChange={(e) => setJobForm((p) => ({ ...p, applicationUrl: e.target.value }))} placeholder="Application URL" className="px-3 py-2 border rounded-lg" />
                  </div>
                  <textarea
                    required
                    value={jobForm.description}
                    onChange={(e) => setJobForm((p) => ({ ...p, description: e.target.value }))}
                    rows={4}
                    placeholder="Job description"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <input
                    value={jobForm.skillsCsv}
                    onChange={(e) => setJobForm((p) => ({ ...p, skillsCsv: e.target.value }))}
                    placeholder="Required skills (comma separated)"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowJobForm(false)} className="px-4 py-2 border rounded-lg text-sm font-medium">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-[#005eb5] text-white rounded-lg text-sm font-medium">Publish Job</button>
                  </div>
                </form>
              ) : null}

              {showEditJobForm ? (
                <form onSubmit={handleUpdateJob} className="mt-4 border rounded-lg p-3 bg-gray-50 space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Edit Job</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input required value={editJobForm.title} onChange={(e) => setEditJobForm((p) => ({ ...p, title: e.target.value }))} placeholder="Job title" className="px-3 py-2 border rounded-lg" />
                    <input required value={editJobForm.company} onChange={(e) => setEditJobForm((p) => ({ ...p, company: e.target.value }))} placeholder="Company" className="px-3 py-2 border rounded-lg" />
                    <input required value={editJobForm.location} onChange={(e) => setEditJobForm((p) => ({ ...p, location: e.target.value }))} placeholder="Location" className="px-3 py-2 border rounded-lg" />
                    <input required value={editJobForm.industry} onChange={(e) => setEditJobForm((p) => ({ ...p, industry: e.target.value }))} placeholder="Industry" className="px-3 py-2 border rounded-lg" />
                    <input required value={editJobForm.role} onChange={(e) => setEditJobForm((p) => ({ ...p, role: e.target.value }))} placeholder="Role" className="px-3 py-2 border rounded-lg" />
                    <select value={editJobForm.level} onChange={(e) => setEditJobForm((p) => ({ ...p, level: e.target.value }))} className="px-3 py-2 border rounded-lg">
                      <option>Entry-level</option>
                      <option>Mid-level</option>
                      <option>Senior</option>
                      <option>Lead</option>
                      <option>Manager</option>
                      <option>Director</option>
                    </select>
                    <select value={editJobForm.employmentType} onChange={(e) => setEditJobForm((p) => ({ ...p, employmentType: e.target.value }))} className="px-3 py-2 border rounded-lg">
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                      <option>Freelance</option>
                      <option>Remote</option>
                    </select>
                    <select value={editJobForm.remotePolicy} onChange={(e) => setEditJobForm((p) => ({ ...p, remotePolicy: e.target.value }))} className="px-3 py-2 border rounded-lg">
                      <option>On-site</option>
                      <option>Hybrid</option>
                      <option>Remote</option>
                      <option>Remote-friendly</option>
                    </select>
                    <input value={editJobForm.salaryMin} onChange={(e) => setEditJobForm((p) => ({ ...p, salaryMin: e.target.value }))} placeholder="Salary min" type="number" className="px-3 py-2 border rounded-lg" />
                    <input value={editJobForm.salaryMax} onChange={(e) => setEditJobForm((p) => ({ ...p, salaryMax: e.target.value }))} placeholder="Salary max" type="number" className="px-3 py-2 border rounded-lg" />
                    <input value={editJobForm.companyWebsite} onChange={(e) => setEditJobForm((p) => ({ ...p, companyWebsite: e.target.value }))} placeholder="Company website" className="px-3 py-2 border rounded-lg" />
                    <input value={editJobForm.applicationUrl} onChange={(e) => setEditJobForm((p) => ({ ...p, applicationUrl: e.target.value }))} placeholder="Application URL" className="px-3 py-2 border rounded-lg" />
                  </div>
                  <textarea
                    required
                    value={editJobForm.description}
                    onChange={(e) => setEditJobForm((p) => ({ ...p, description: e.target.value }))}
                    rows={4}
                    placeholder="Job description"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <input
                    value={editJobForm.skillsCsv}
                    onChange={(e) => setEditJobForm((p) => ({ ...p, skillsCsv: e.target.value }))}
                    placeholder="Required skills (comma separated)"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowEditJobForm(false)} className="px-4 py-2 border rounded-lg text-sm font-medium">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-[#005eb5] text-white rounded-lg text-sm font-medium">Update Job</button>
                  </div>
                </form>
              ) : null}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {jobsLoading ? (
                <div className="col-span-full bg-white rounded-xl border p-6 text-center text-gray-500">
                  <Loader2 size={20} className="animate-spin inline mr-2" />
                  Loading jobs...
                </div>
              ) : jobs.length === 0 ? (
                <div className="col-span-full bg-white rounded-xl border p-8 text-center text-gray-500">
                  <Briefcase size={20} className="mx-auto mb-2 text-gray-400" />
                  No jobs found.
                </div>
              ) : (
                jobs.map((job) => (
                  <article
                    id={`job-card-${job._id}`}
                    key={job._id}
                    className={`bg-white rounded-xl border shadow-sm p-4 transition ${
                      highlightedJobId === job._id
                        ? 'border-teal-400 ring-2 ring-teal-100'
                        : 'hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[#d6e3ff] text-[#004c99] flex items-center justify-center text-sm font-semibold shrink-0">
                          {String(job.company || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{job.company} • {job.location}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs px-2 py-1 rounded bg-[#d6e3ff] text-[#004c99]">{job.employmentType}</span>
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{job.remotePolicy || 'On-site'}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3 line-clamp-3">{job.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(job.skillsRequired || []).slice(0, 5).map((skill) => (
                        <span key={`${job._id}-${skill.name}`} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                      <div>
                        {money(job.salary?.min, job.salary?.currency)} - {money(job.salary?.max, job.salary?.currency)}
                      </div>
                      <div>Posted {formatDate(job.postedDate || job.createdAt)}</div>
                    </div>
                    <div className="mt-4 flex gap-2 justify-end">
                      <button
                        onClick={() => handleViewJobDetails(job._id)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                      >
                        View
                      </button>
                      {isGuestMode ? (
                        <button
                          disabled
                          title="Login required"
                          className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium inline-flex items-center gap-1 cursor-not-allowed"
                        >
                          <Send size={14} />
                          Apply
                        </button>
                      ) : (
                        <button
                          onClick={() => openApply(job)}
                          className="px-3 py-2 bg-[#005eb5] text-white rounded-lg text-sm font-medium inline-flex items-center gap-1 hover:bg-[#004c99]"
                        >
                          <Send size={14} />
                          Apply
                        </button>
                      )}
                      {!isGuestMode && isAdmin ? (
                        <button
                          onClick={() => openEditJob(job._id)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                        >
                          Edit
                        </button>
                      ) : null}
                      {!isGuestMode && isAdmin ? (
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="px-3 py-2 border border-red-200 text-red-700 rounded-lg text-sm font-medium inline-flex items-center gap-1 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="flex items-center justify-between bg-white border rounded-xl p-3">
              <p className="text-sm text-gray-500">Total jobs: {jobsMeta.total || 0}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => loadJobs(Math.max(1, jobsPage - 1), jobFeedMode)}
                  disabled={jobsPage <= 1}
                  className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-sm">Page {jobsMeta.current || jobsPage} / {jobsMeta.pages || 1}</span>
                <button
                  onClick={() => loadJobs(Math.min(jobsMeta.pages || 1, jobsPage + 1), jobFeedMode)}
                  disabled={jobsPage >= (jobsMeta.pages || 1)}
                  className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === 'applications' ? (
          <section className="space-y-4">
            <div className="bg-white rounded-xl border shadow-sm p-4 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={applicationStatus}
                  onChange={(e) => setApplicationStatus(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">All statuses</option>
                  <option value="submitted">submitted</option>
                  <option value="under_review">under_review</option>
                  <option value="screening">screening</option>
                  <option value="interview_scheduled">interview_scheduled</option>
                  <option value="interviewed">interviewed</option>
                  <option value="offer_extended">offer_extended</option>
                  <option value="accepted">accepted</option>
                  <option value="rejected">rejected</option>
                  <option value="withdrawn">withdrawn</option>
                </select>
                {isAdmin ? (
                  <input
                    value={applicationJobId}
                    onChange={(e) => setApplicationJobId(e.target.value)}
                    placeholder="Job ID for recruiter view"
                    className="px-3 py-2 border rounded-lg text-sm min-w-64"
                  />
                ) : null}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={loadApplications}
                  className="px-4 py-2 bg-[#005eb5] text-white rounded-lg text-sm font-medium"
                >
                  My Applications
                </button>
                {isAdmin ? (
                  <button
                    onClick={loadApplicationsByJob}
                    className="px-4 py-2 border rounded-lg text-sm font-medium"
                  >
                    Job Applications
                  </button>
                ) : null}
                {isAdmin ? (
                  <button
                    onClick={loadApplicationsByStatusView}
                    className="px-4 py-2 border rounded-lg text-sm font-medium"
                  >
                    Status Feed
                  </button>
                ) : null}
                <span className="ml-auto text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                  View: {applicationViewMode}
                </span>
              </div>

              {isAdmin ? (
                <div className="text-xs text-gray-500">
                  Use Job Applications and Status Feed for recruiter/admin style workflows.
                </div>
              ) : null}

            </div>

            {applicationsLoading ? (
              <div className="bg-white rounded-xl border p-6 text-center text-gray-500">
                <Loader2 size={20} className="animate-spin inline mr-2" />
                Loading applications...
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-white rounded-xl border p-6 text-center text-gray-500">No applications found.</div>
            ) : (
              <div className="space-y-3">
                {applications.map((item) => (
                  <div key={item._id} className="bg-white rounded-xl border shadow-sm p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.job?.title || 'Job'}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.job?.company} • {item.job?.location}</p>
                        <p className="text-xs text-gray-500 mt-2">Applied on {formatDate(item.appliedDate)}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{item.status}</span>
                    </div>
                    <div className="mt-3 flex justify-end">
                      {isAdmin ? (
                        <button
                          onClick={() => openApplicationManager(item._id)}
                          className="px-3 py-2 border rounded-lg text-sm font-medium mr-2"
                        >
                          Manage
                        </button>
                      ) : null}
                      {item.status !== 'withdrawn' && item.status !== 'accepted' ? (
                        <button
                          onClick={() => handleWithdrawApplication(item._id)}
                          className="px-3 py-2 border rounded-lg text-sm font-medium"
                        >
                          Withdraw
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {activeTab === 'alerts' ? (
          <section className="space-y-4">
            <div className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Job Alerts</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleProcessAlerts}
                    disabled={!canRunProcessAllAlerts}
                    title={!canRunProcessAllAlerts ? 'Admin only' : undefined}
                    className="px-3 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Process All
                  </button>
                  <button
                    onClick={() => setShowAlertForm((prev) => !prev)}
                    className="px-3 py-2 bg-[#005eb5] text-white rounded-lg text-sm font-medium inline-flex items-center gap-1"
                  >
                    <Plus size={14} />
                    New Alert
                  </button>
                </div>
              </div>

              {showAlertForm ? (
                <form onSubmit={handleCreateAlert} className="mt-4 border rounded-lg p-3 bg-gray-50 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input required value={alertForm.title} onChange={(e) => setAlertForm((p) => ({ ...p, title: e.target.value }))} placeholder="Alert title" className="px-3 py-2 border rounded-lg" />
                    <input value={alertForm.location} onChange={(e) => setAlertForm((p) => ({ ...p, location: e.target.value }))} placeholder="Location" className="px-3 py-2 border rounded-lg" />
                    <input value={alertForm.keywordsCsv} onChange={(e) => setAlertForm((p) => ({ ...p, keywordsCsv: e.target.value }))} placeholder="Keywords (comma separated)" className="px-3 py-2 border rounded-lg" />
                    <input value={alertForm.skillsCsv} onChange={(e) => setAlertForm((p) => ({ ...p, skillsCsv: e.target.value }))} placeholder="Skills (comma separated)" className="px-3 py-2 border rounded-lg" />
                    <input value={alertForm.companiesCsv} onChange={(e) => setAlertForm((p) => ({ ...p, companiesCsv: e.target.value }))} placeholder="Companies (comma separated)" className="px-3 py-2 border rounded-lg" />
                    <select value={alertForm.remotePolicy} onChange={(e) => setAlertForm((p) => ({ ...p, remotePolicy: e.target.value }))} className="px-3 py-2 border rounded-lg">
                      <option value="any">any</option>
                      <option value="On-site">On-site</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Remote">Remote</option>
                      <option value="Remote-friendly">Remote-friendly</option>
                    </select>
                    <select value={alertForm.frequency} onChange={(e) => setAlertForm((p) => ({ ...p, frequency: e.target.value }))} className="px-3 py-2 border rounded-lg">
                      <option value="instant">instant</option>
                      <option value="daily">daily</option>
                      <option value="weekly">weekly</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowAlertForm(false)} className="px-4 py-2 border rounded-lg text-sm font-medium">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-[#005eb5] text-white rounded-lg text-sm font-medium">Create Alert</button>
                  </div>
                </form>
              ) : null}
            </div>

            {alertsLoading ? (
              <div className="bg-white rounded-xl border p-6 text-center text-gray-500">
                <Loader2 size={20} className="animate-spin inline mr-2" />
                Loading alerts...
              </div>
            ) : alerts.length === 0 ? (
              <div className="bg-white rounded-xl border p-6 text-center text-gray-500">No alerts yet.</div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert._id} className="bg-white rounded-xl border shadow-sm p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{alert.frequency} • {alert.remotePolicy}</p>
                        <p className="text-xs text-gray-500 mt-2">Matches so far: {alert.totalMatches || 0}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${alert.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                        {alert.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="mt-3 flex gap-2 flex-wrap">
                      <button onClick={() => handleToggleAlert(alert)} className="px-3 py-2 border rounded-lg text-sm font-medium">
                        {alert.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleFindMatches(alert._id)}
                        className="px-3 py-2 border rounded-lg text-sm font-medium"
                        disabled={loadingMatchesFor === alert._id}
                      >
                        {loadingMatchesFor === alert._id ? 'Loading...' : 'Find Matches'}
                      </button>
                      <button onClick={() => handleDeleteAlert(alert._id)} className="px-3 py-2 border rounded-lg text-sm font-medium inline-flex items-center gap-1">
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>

                    {alertMatches[alert._id]?.length ? (
                      <div className="mt-3 border rounded-lg p-3 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Top matches</p>
                        <div className="space-y-2">
                          {alertMatches[alert._id].map((job) => (
                            <div key={job._id} className="text-sm text-gray-700">
                              {job.title} • {job.company}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {activeTab === 'categories' ? (
          <section className="space-y-4">
            <div className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex gap-2">
                  <select value={categoryViewMode} onChange={(e) => setCategoryViewMode(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
                    <option value="all">all</option>
                    <option value="featured">featured</option>
                    <option value="popular">popular</option>
                    <option value="type">type</option>
                  </select>
                  <select value={categoryType} onChange={(e) => setCategoryType(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
                    <option value="">All types</option>
                    <option value="industry">industry</option>
                    <option value="role">role</option>
                    <option value="location">location</option>
                    <option value="skill">skill</option>
                  </select>
                  <button onClick={loadCategories} className="px-4 py-2 border rounded-lg text-sm font-medium">Refresh</button>
                </div>
                {!isGuestMode && isAdmin ? (
                  <button
                    onClick={() => {
                      setShowEditCategoryForm(false);
                      setShowCategoryForm((prev) => !prev);
                    }}
                    className="px-4 py-2 bg-[#005eb5] text-white rounded-lg text-sm font-medium inline-flex items-center gap-1"
                  >
                    <Plus size={14} />
                    New Category
                  </button>
                ) : null}
              </div>

              {showCategoryForm ? (
                <form onSubmit={handleCreateCategory} className="mt-4 border rounded-lg p-3 bg-gray-50 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input required value={categoryForm.name} onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className="px-3 py-2 border rounded-lg" />
                    <select value={categoryForm.type} onChange={(e) => setCategoryForm((p) => ({ ...p, type: e.target.value }))} className="px-3 py-2 border rounded-lg">
                      <option value="industry">industry</option>
                      <option value="role">role</option>
                      <option value="location">location</option>
                      <option value="skill">skill</option>
                    </select>
                    <textarea value={categoryForm.description} onChange={(e) => setCategoryForm((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Description" className="md:col-span-2 px-3 py-2 border rounded-lg" />
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={categoryForm.isFeatured} onChange={(e) => setCategoryForm((p) => ({ ...p, isFeatured: e.target.checked }))} />
                      Featured
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={categoryForm.isActive} onChange={(e) => setCategoryForm((p) => ({ ...p, isActive: e.target.checked }))} />
                      Active
                    </label>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowCategoryForm(false)} className="px-4 py-2 border rounded-lg text-sm font-medium">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-[#005eb5] text-white rounded-lg text-sm font-medium">Create Category</button>
                  </div>
                </form>
              ) : null}

              {showEditCategoryForm ? (
                <form onSubmit={handleUpdateCategory} className="mt-4 border rounded-lg p-3 bg-gray-50 space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Edit Category</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input required value={editCategoryForm.name} onChange={(e) => setEditCategoryForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className="px-3 py-2 border rounded-lg" />
                    <select value={editCategoryForm.type} onChange={(e) => setEditCategoryForm((p) => ({ ...p, type: e.target.value }))} className="px-3 py-2 border rounded-lg">
                      <option value="industry">industry</option>
                      <option value="role">role</option>
                      <option value="location">location</option>
                      <option value="skill">skill</option>
                    </select>
                    <textarea value={editCategoryForm.description} onChange={(e) => setEditCategoryForm((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Description" className="md:col-span-2 px-3 py-2 border rounded-lg" />
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={editCategoryForm.isFeatured} onChange={(e) => setEditCategoryForm((p) => ({ ...p, isFeatured: e.target.checked }))} />
                      Featured
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={editCategoryForm.isActive} onChange={(e) => setEditCategoryForm((p) => ({ ...p, isActive: e.target.checked }))} />
                      Active
                    </label>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowEditCategoryForm(false)} className="px-4 py-2 border rounded-lg text-sm font-medium">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-[#005eb5] text-white rounded-lg text-sm font-medium">Update Category</button>
                  </div>
                </form>
              ) : null}
            </div>

            {categoriesLoading ? (
              <div className="bg-white rounded-xl border p-6 text-center text-gray-500">
                <Loader2 size={20} className="animate-spin inline mr-2" />
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="bg-white rounded-xl border p-6 text-center text-gray-500">No categories found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <div key={category._id} className="bg-white rounded-xl border shadow-sm p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{category.type}</p>
                      </div>
                      {category.isFeatured ? (
                        <span className="text-xs px-2 py-1 rounded bg-amber-50 text-amber-700">Featured</span>
                      ) : null}
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{category.description || 'No description'}</p>
                    <div className="mt-3 text-xs text-gray-500">Jobs: {category.jobCount || 0}</div>
                    <div className="mt-3 flex justify-end">
                      {!isGuestMode && isAdmin ? (
                        <>
                          <button
                            onClick={() => openEditCategory(category)}
                            className="px-3 py-2 border rounded-lg text-sm font-medium inline-flex items-center gap-1 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="px-3 py-2 border rounded-lg text-sm font-medium inline-flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {activeTab === 'trending' ? (
          <section className="space-y-4">
            <div className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex gap-2">
                  <select value={trendingViewMode} onChange={(e) => setTrendingViewMode(e.target.value)} className="px-3 py-2 border rounded-lg text-sm w-36">
                    <option value="all">all</option>
                    <option value="rising">rising</option>
                    <option value="hot">hot</option>
                  </select>
                  <input
                    type="number"
                    value={trendingParams.minDemandScore}
                    onChange={(e) => setTrendingParams((p) => ({ ...p, minDemandScore: e.target.value }))}
                    placeholder="Min demand score"
                    className="px-3 py-2 border rounded-lg text-sm w-40"
                  />
                  <input
                    type="number"
                    value={trendingParams.limit}
                    onChange={(e) => setTrendingParams((p) => ({ ...p, limit: e.target.value }))}
                    placeholder="Limit"
                    className="px-3 py-2 border rounded-lg text-sm w-24"
                  />
                  <button onClick={loadTrending} className="px-4 py-2 border rounded-lg text-sm font-medium">Refresh</button>
                </div>
                {!isGuestMode && isAdmin ? (
                  <div className="flex gap-2">
                    <button onClick={handleRunSkillUpdate} className="px-4 py-2 border rounded-lg text-sm font-medium">Run Trend Update</button>
                    <button
                      onClick={() => {
                        setShowEditSkillForm(false);
                        setShowSkillForm((prev) => !prev);
                      }}
                      className="px-4 py-2 bg-[#005eb5] text-white rounded-lg text-sm font-medium inline-flex items-center gap-1"
                    >
                      <Plus size={14} />
                      Upsert Skill
                    </button>
                  </div>
                ) : null}
              </div>

              {showSkillForm ? (
                <form onSubmit={handleUpsertSkill} className="mt-4 border rounded-lg p-3 bg-gray-50 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input required value={skillForm.skill} onChange={(e) => setSkillForm((p) => ({ ...p, skill: e.target.value }))} placeholder="Skill name" className="px-3 py-2 border rounded-lg" />
                    <select value={skillForm.skillType} onChange={(e) => setSkillForm((p) => ({ ...p, skillType: e.target.value }))} className="px-3 py-2 border rounded-lg">
                      <option value="technical">technical</option>
                      <option value="soft">soft</option>
                      <option value="domain">domain</option>
                      <option value="tool">tool</option>
                      <option value="language">language</option>
                      <option value="framework">framework</option>
                    </select>
                    <input type="number" value={skillForm.demandScore} onChange={(e) => setSkillForm((p) => ({ ...p, demandScore: e.target.value }))} placeholder="Demand score (0-100)" className="px-3 py-2 border rounded-lg" />
                    <input type="number" value={skillForm.growthRate} onChange={(e) => setSkillForm((p) => ({ ...p, growthRate: e.target.value }))} placeholder="Growth rate" className="px-3 py-2 border rounded-lg" />
                    <input value={skillForm.category} onChange={(e) => setSkillForm((p) => ({ ...p, category: e.target.value }))} placeholder="Category" className="px-3 py-2 border rounded-lg" />
                    <input type="number" value={skillForm.remoteDemandScore} onChange={(e) => setSkillForm((p) => ({ ...p, remoteDemandScore: e.target.value }))} placeholder="Remote demand score" className="px-3 py-2 border rounded-lg" />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowSkillForm(false)} className="px-4 py-2 border rounded-lg text-sm font-medium">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-[#005eb5] text-white rounded-lg text-sm font-medium">Save</button>
                  </div>
                </form>
              ) : null}

              {showEditSkillForm ? (
                <form onSubmit={handleUpdateSkill} className="mt-4 border rounded-lg p-3 bg-gray-50 space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Edit Skill</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input required value={editSkillForm.skill} onChange={(e) => setEditSkillForm((p) => ({ ...p, skill: e.target.value }))} placeholder="Skill name" className="px-3 py-2 border rounded-lg" />
                    <select value={editSkillForm.skillType} onChange={(e) => setEditSkillForm((p) => ({ ...p, skillType: e.target.value }))} className="px-3 py-2 border rounded-lg">
                      <option value="technical">technical</option>
                      <option value="soft">soft</option>
                      <option value="domain">domain</option>
                      <option value="tool">tool</option>
                      <option value="language">language</option>
                      <option value="framework">framework</option>
                    </select>
                    <input type="number" value={editSkillForm.demandScore} onChange={(e) => setEditSkillForm((p) => ({ ...p, demandScore: e.target.value }))} placeholder="Demand score (0-100)" className="px-3 py-2 border rounded-lg" />
                    <input type="number" value={editSkillForm.growthRate} onChange={(e) => setEditSkillForm((p) => ({ ...p, growthRate: e.target.value }))} placeholder="Growth rate" className="px-3 py-2 border rounded-lg" />
                    <input value={editSkillForm.category} onChange={(e) => setEditSkillForm((p) => ({ ...p, category: e.target.value }))} placeholder="Category" className="px-3 py-2 border rounded-lg" />
                    <input type="number" value={editSkillForm.remoteDemandScore} onChange={(e) => setEditSkillForm((p) => ({ ...p, remoteDemandScore: e.target.value }))} placeholder="Remote demand score" className="px-3 py-2 border rounded-lg" />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowEditSkillForm(false)} className="px-4 py-2 border rounded-lg text-sm font-medium">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-[#005eb5] text-white rounded-lg text-sm font-medium">Update Skill</button>
                  </div>
                </form>
              ) : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl border p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Avg Demand Score</p>
                <p className="text-2xl font-bold mt-1">{Math.round(skillStats?.overview?.avgDemandScore || 0)}</p>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Avg Growth Rate</p>
                <p className="text-2xl font-bold mt-1">{Math.round(skillStats?.overview?.avgGrowthRate || 0)}%</p>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Hot Skills</p>
                <p className="text-2xl font-bold mt-1">{skillStats?.overview?.hotSkillsCount || 0}</p>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Rising Skills</p>
                <p className="text-2xl font-bold mt-1">{skillStats?.overview?.risingSkillsCount || 0}</p>
              </div>
            </div>

            {trendingLoading ? (
              <div className="bg-white rounded-xl border p-6 text-center text-gray-500">
                <Loader2 size={20} className="animate-spin inline mr-2" />
                Loading trends...
              </div>
            ) : trending.length === 0 ? (
              <div className="bg-white rounded-xl border p-6 text-center text-gray-500">No trending skills found.</div>
            ) : (
              <div className="space-y-3">
                {trending.map((skill) => (
                  <div key={skill._id} className="bg-white rounded-xl border shadow-sm p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{skill.skill}</h3>
                        <p className="text-sm text-gray-500 mt-1">{skill.category || 'Uncategorized'} • {skill.skillType}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-[#d6e3ff] text-[#004c99]">Demand {skill.demandScore}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div className="p-2 rounded bg-gray-50">Growth: {skill.growthRate || 0}%</div>
                      <div className="p-2 rounded bg-gray-50">Job Count: {skill.jobCount || 0}</div>
                      <div className="p-2 rounded bg-gray-50">Remote: {skill.remoteDemandScore || 0}</div>
                      <div className="p-2 rounded bg-gray-50">Updated: {formatDate(skill.lastUpdated)}</div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      {!isGuestMode && isAdmin ? (
                        <>
                          <button
                            onClick={() => openEditSkill(skill)}
                            className="px-3 py-2 border rounded-lg text-sm font-medium inline-flex items-center gap-1 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill._id)}
                            className="px-3 py-2 border rounded-lg text-sm font-medium inline-flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}
      </main>

      {showApplicationManager && selectedApplication ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Manage Application</h2>
              <button onClick={() => setShowApplicationManager(false)} className="text-gray-400 hover:text-gray-700">Close</button>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gray-50 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">{selectedApplication.job?.title || 'Job'}</p>
                <p>{selectedApplication.job?.company || '-'} • {selectedApplication.job?.location || '-'}</p>
                <p className="mt-1">Applicant: {selectedApplication.applicant?.name || '-'}</p>
              </div>

              <div className="border rounded-lg p-3 space-y-3">
                <p className="text-sm font-semibold text-gray-700">Status Management</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select value={applicationManagerStatus} onChange={(e) => setApplicationManagerStatus(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
                    <option value="submitted">submitted</option>
                    <option value="under_review">under_review</option>
                    <option value="screening">screening</option>
                    <option value="interview_scheduled">interview_scheduled</option>
                    <option value="interviewed">interviewed</option>
                    <option value="offer_extended">offer_extended</option>
                    <option value="accepted">accepted</option>
                    <option value="rejected">rejected</option>
                    <option value="withdrawn">withdrawn</option>
                  </select>
                  <button onClick={handleApplicationStatusUpdate} className="px-4 py-2 border rounded-lg text-sm font-medium">Update Status</button>
                </div>
                <textarea
                  value={applicationReviewNotes}
                  onChange={(e) => setApplicationReviewNotes(e.target.value)}
                  rows={3}
                  placeholder="Review notes"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="border rounded-lg p-3 space-y-3">
                <p className="text-sm font-semibold text-gray-700">Interview Scheduling</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="datetime-local" value={interviewForm.date} onChange={(e) => setInterviewForm((p) => ({ ...p, date: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm" />
                  <select value={interviewForm.type} onChange={(e) => setInterviewForm((p) => ({ ...p, type: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm">
                    <option value="phone">phone</option>
                    <option value="video">video</option>
                    <option value="onsite">onsite</option>
                    <option value="technical">technical</option>
                    <option value="behavioral">behavioral</option>
                  </select>
                  <input value={interviewForm.location} onChange={(e) => setInterviewForm((p) => ({ ...p, location: e.target.value }))} placeholder="Interview location/link" className="px-3 py-2 border rounded-lg text-sm" />
                  <button onClick={handleInterviewSchedule} className="px-4 py-2 border rounded-lg text-sm font-medium">Schedule Interview</button>
                </div>
                <textarea
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm((p) => ({ ...p, notes: e.target.value }))}
                  rows={2}
                  placeholder="Interview notes"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="border rounded-lg p-3 space-y-3">
                <p className="text-sm font-semibold text-gray-700">Communication</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select value={communicationForm.type} onChange={(e) => setCommunicationForm((p) => ({ ...p, type: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm">
                    <option value="email">email</option>
                    <option value="phone">phone</option>
                    <option value="portal">portal</option>
                    <option value="other">other</option>
                  </select>
                  <input value={communicationForm.subject} onChange={(e) => setCommunicationForm((p) => ({ ...p, subject: e.target.value }))} placeholder="Subject" className="px-3 py-2 border rounded-lg text-sm" />
                </div>
                <textarea
                  value={communicationForm.message}
                  onChange={(e) => setCommunicationForm((p) => ({ ...p, message: e.target.value }))}
                  rows={3}
                  placeholder="Message"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                <button onClick={handleAddApplicationCommunication} className="px-4 py-2 border rounded-lg text-sm font-medium">Add Communication</button>

                {(selectedApplication.communications || []).length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {(selectedApplication.communications || []).slice(-5).reverse().map((entry, idx) => (
                      <div key={`${selectedApplication._id}-comm-${idx}`} className="text-sm p-2 rounded bg-gray-50">
                        <p className="font-medium text-gray-800">{entry.subject || 'Communication'} • {entry.type}</p>
                        <p className="text-gray-600">{entry.message}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex justify-end">
                <button onClick={handleDeleteApplication} className="px-4 py-2 border border-red-200 text-red-700 rounded-lg text-sm font-medium">Delete Application</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showJobDetails ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Job Details</h2>
              <button onClick={() => setShowJobDetails(false)} className="text-gray-400 hover:text-gray-700">Close</button>
            </div>

            {jobDetailsLoading ? (
              <div className="p-6 text-center text-gray-500">
                <Loader2 size={20} className="animate-spin inline mr-2" />
                Loading details...
              </div>
            ) : selectedJob ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedJob.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{selectedJob.company} • {selectedJob.location}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-gray-50">Industry: {selectedJob.category?.industry || '-'}</div>
                  <div className="p-3 rounded-lg bg-gray-50">Role: {selectedJob.category?.role || '-'}</div>
                  <div className="p-3 rounded-lg bg-gray-50">Level: {selectedJob.category?.level || '-'}</div>
                  <div className="p-3 rounded-lg bg-gray-50">Type: {selectedJob.employmentType || '-'}</div>
                  <div className="p-3 rounded-lg bg-gray-50">Remote: {selectedJob.remotePolicy || '-'}</div>
                  <div className="p-3 rounded-lg bg-gray-50">Posted: {formatDate(selectedJob.postedDate || selectedJob.createdAt)}</div>
                </div>

                <div className="text-sm text-gray-700 whitespace-pre-wrap">{selectedJob.description || '-'}</div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {(selectedJob.skillsRequired || []).length ? (
                      selectedJob.skillsRequired.map((skill) => (
                        <span key={`${selectedJob._id}-${skill.name}`} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          {skill.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No skills listed.</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-gray-50">Salary: {money(selectedJob.salary?.min, selectedJob.salary?.currency)} - {money(selectedJob.salary?.max, selectedJob.salary?.currency)}</div>
                  <div className="p-3 rounded-lg bg-gray-50">Applications: {selectedJob.applicationsCount || 0}</div>
                  <div className="p-3 rounded-lg bg-gray-50">Company site: {selectedJob.companyWebsite || '-'}</div>
                  <div className="p-3 rounded-lg bg-gray-50">Apply URL: {selectedJob.applicationUrl || '-'}</div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">No job details available.</div>
            )}
          </div>
        </div>
      ) : null}

      {showApply && applyingJob ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Apply to {applyingJob.title}</h2>
              <button onClick={() => setShowApply(false)} className="text-gray-400 hover:text-gray-700">Close</button>
            </div>
            <form onSubmit={handleApplyToJob} className="space-y-3">
              <textarea
                required
                rows={4}
                value={applicationForm.coverLetter}
                onChange={(e) => setApplicationForm((p) => ({ ...p, coverLetter: e.target.value }))}
                placeholder="Cover letter"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  value={applicationForm.resumeUrl}
                  onChange={(e) => setApplicationForm((p) => ({ ...p, resumeUrl: e.target.value }))}
                  placeholder="Resume URL (optional)"
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  value={applicationForm.portfolioUrl}
                  onChange={(e) => setApplicationForm((p) => ({ ...p, portfolioUrl: e.target.value }))}
                  placeholder="Portfolio URL (optional)"
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  value={applicationForm.expectedSalaryMin}
                  onChange={(e) => setApplicationForm((p) => ({ ...p, expectedSalaryMin: e.target.value }))}
                  placeholder="Expected salary min"
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  value={applicationForm.expectedSalaryMax}
                  onChange={(e) => setApplicationForm((p) => ({ ...p, expectedSalaryMax: e.target.value }))}
                  placeholder="Expected salary max"
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowApply(false)} className="px-4 py-2 border rounded-lg text-sm font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#005eb5] text-white rounded-lg text-sm font-medium inline-flex items-center gap-1">
                  <Send size={14} />
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {!error && activeTab === 'applications' && applications.length > 0 ? (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm inline-flex items-center gap-2">
          <CheckCircle2 size={16} />
          Applications loaded
        </div>
      ) : null}

      {error ? (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm inline-flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      ) : null}

      {busy ? (
        <div className="fixed bottom-4 left-4 bg-white border rounded-lg px-3 py-2 text-sm text-gray-700 shadow inline-flex items-center gap-2">
          <BarChart3 size={16} className="text-[#005eb5]" />
          Refreshing stats...
        </div>
      ) : null}
    </div>
  );
}

export default JobMarket;
