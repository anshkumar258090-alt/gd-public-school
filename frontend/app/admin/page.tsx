'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  AdmissionEnquiry,
  SchoolInfo,
  SchoolStats,
  TeamMember,
  MediaItem,
  SchoolNotice,
} from '@/lib/types';
import {
  loginAdmin,
  verifyAdmin,
  logoutAdmin,
  getSchoolInfo,
  updateSchoolInfo,
  uploadSchoolLogo,
  deleteSchoolLogo,
  getSchoolStats,
  updateSchoolStats,
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  uploadTeamPhoto,
  deleteTeamMember,
  getMediaGallery,
  uploadMediaFiles,
  deleteMediaItem,
  getNotices,
  createNotice,
  deleteNotice,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  DEFAULT_SCHOOL,
  DEFAULT_STATS,
  DEFAULT_TEAM,
} from '@/lib/api';
import {
  ShieldCheck,
  Lock,
  User,
  LogOut,
  ArrowLeft,
  Building,
  Image as ImageIcon,
  Users,
  BarChart3,
  Camera,
  Bell,
  Save,
  Trash2,
  Plus,
  Upload,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Loader2,
  Inbox,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Check,
  RotateCcw,
  Search,
  Download,
  RefreshCw,
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<
    'team' | 'enquiries' | 'announcement' | 'branding' | 'general' | 'stats' | 'media' | 'notices'
  >('team');

  // Status message
  const [statusMsg, setStatusMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // School data states
  const [school, setSchool] = useState<SchoolInfo>(DEFAULT_SCHOOL);
  const [stats, setStats] = useState<SchoolStats>(DEFAULT_STATS);
  const [team, setTeam] = useState<TeamMember[]>(DEFAULT_TEAM);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [notices, setNotices] = useState<SchoolNotice[]>([]);
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>([]);
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | 'new' | 'contacted'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dataLoading, setDataLoading] = useState(false);

  // Logo upload state
  const [logoUploading, setLogoUploading] = useState(false);

  // Team upload / editing state
  const [memberUploading, setMemberUploading] = useState<string | null>(null);
  const [newMember, setNewMember] = useState({
    role: '',
    name: '',
    qualification: '',
    experience: '',
    bio: '',
    email: '',
    order: 0,
  });
  const [showAddMember, setShowAddMember] = useState(false);

  // Media upload state
  const [mediaUploading, setMediaUploading] = useState(false);
  const [mediaCaption, setMediaCaption] = useState('');

  // Notice state
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Check auth on load
  useEffect(() => {
    async function checkAuth() {
      const isValid = await verifyAdmin();
      setIsAuthenticated(isValid);
      setAuthLoading(false);
      if (isValid) {
        fetchAllData();
      }
    }
    checkAuth();
  }, []);

  const fetchAllData = async () => {
    setDataLoading(true);
    try {
      const [sData, stData, tData, mData, nData, eData] = await Promise.all([
        getSchoolInfo(),
        getSchoolStats(),
        getTeamMembers(),
        getMediaGallery(),
        getNotices(),
        getEnquiries(),
      ]);
      if (sData) setSchool(sData);
      if (stData) setStats(stData);
      if (tData) setTeam(tData);
      if (mData) setMedia(mData);
      if (nData) setNotices(nData);
      if (eData) setEnquiries(eData);
    } catch (e) {
      console.error(e);
      showStatus('Failed to load some data from server', 'error');
    } finally {
      setDataLoading(false);
    }
  };

  const handleUpdateEnquiryStatus = async (id: string, newStatus: 'new' | 'contacted') => {
    try {
      await updateEnquiryStatus(id, newStatus);
      setEnquiries(enquiries.map((e) => (e._id === id ? { ...e, status: newStatus } : e)));
      showStatus(newStatus === 'contacted' ? 'Enquiry marked as Contacted!' : 'Enquiry marked as New');
    } catch {
      showStatus('Failed to update enquiry status', 'error');
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      await deleteEnquiry(id);
      setEnquiries(enquiries.filter((e) => e._id !== id));
      showStatus('Enquiry record deleted');
    } catch {
      showStatus('Failed to delete enquiry', 'error');
    }
  };

  const handleRefreshEnquiries = async () => {
    try {
      const eData = await getEnquiries();
      if (eData) {
        setEnquiries(eData);
        showStatus('Enquiries refreshed from server!');
      }
    } catch {
      showStatus('Failed to refresh enquiries', 'error');
    }
  };

  const exportEnquiriesToCSV = () => {
    if (enquiries.length === 0) {
      showStatus('No enquiries to export', 'error');
      return;
    }
    const headers = ['Parent / Guardian Name', 'Contact Mobile', 'Email Address', 'Grade Applying For', 'Date & Time', 'Status', 'Message / Query'];
    const rows = enquiries.map((e) => [
      `"${(e.parentName || '').replace(/"/g, '""')}"`,
      `"${(e.phone || '').replace(/"/g, '""')}"`,
      `"${(e.email || '').replace(/"/g, '""')}"`,
      `"${(e.studentGrade || '').replace(/"/g, '""')}"`,
      `"${e.createdAt ? new Date(e.createdAt).toLocaleString('en-IN') : ''}"`,
      `"${e.status || 'new'}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GD_Public_School_Admission_Enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showStatus('Enquiries exported to CSV successfully!');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await loginAdmin({ username, password });
      if (res && res.success) {
        setIsAuthenticated(true);
        fetchAllData();
      } else {
        setLoginError(res?.message || 'Invalid username or password');
      }
    } catch {
      setLoginError('Cannot connect to backend server. Ensure backend is running.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
  };

  // --- Logo Actions ---
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    try {
      const res = await uploadSchoolLogo(file);
      if (res && res.success) {
        setSchool({ ...school, logoUrl: res.logoUrl });
        showStatus('School logo updated successfully!');
      } else {
        showStatus('Failed to upload logo', 'error');
      }
    } catch {
      showStatus('Error uploading logo to server', 'error');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleLogoDelete = async () => {
    if (!confirm('Are you sure you want to remove the school logo?')) return;
    try {
      await deleteSchoolLogo();
      setSchool({ ...school, logoUrl: '' });
      showStatus('Logo removed');
    } catch {
      showStatus('Failed to delete logo', 'error');
    }
  };

  // --- Team Member Actions ---
  const handleTeamPhotoUpload = async (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMemberUploading(id);
    try {
      const res = await uploadTeamPhoto(id, file);
      if (res && res.success && res.data) {
        setTeam((prev) => prev.map((m) => (m._id === id ? { ...m, ...res.data } : m)));
        showStatus('Photo uploaded successfully!');
      } else {
        showStatus('Failed to upload photo', 'error');
      }
    } catch (err: any) {
      console.error('Photo upload error:', err);
      showStatus(err?.message || 'Error uploading photo', 'error');
    } finally {
      setMemberUploading(null);
    }
  };

  const handleTeamMemberUpdate = async (id: string, updatedFields: Partial<TeamMember>) => {
    try {
      const res = await updateTeamMember(id, updatedFields);
      if (res && res.success) {
        setTeam((prev) => prev.map((m) => (m._id === id ? { ...m, ...res.data } : m)));
        showStatus('Staff member details saved!');
      } else {
        showStatus('Could not save details', 'error');
      }
    } catch (err: any) {
      console.error('Update staff error:', err);
      showStatus('Error updating staff details', 'error');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.role) return;

    try {
      const res = await createTeamMember(newMember);
      if (res && res.success) {
        setTeam([...team, res.data]);
        setNewMember({
          role: '',
          name: '',
          qualification: '',
          experience: '',
          bio: '',
          email: '',
          order: team.length + 1,
        });
        setShowAddMember(false);
        showStatus('New staff position added!');
      }
    } catch {
      showStatus('Failed to add staff member', 'error');
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff entry?')) return;
    try {
      await deleteTeamMember(id);
      setTeam(team.filter((m) => m._id !== id));
      showStatus('Staff entry deleted');
    } catch {
      showStatus('Failed to delete staff member', 'error');
    }
  };

  // --- General School Info Actions ---
  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateSchoolInfo(school);
      if (res && res.success) {
        showStatus('School details updated successfully!');
      }
    } catch {
      showStatus('Error saving school information', 'error');
    }
  };

  // --- Stats Actions ---
  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateSchoolStats(stats);
      if (res && res.success) {
        showStatus('Key statistics updated successfully!');
      }
    } catch {
      showStatus('Error saving statistics', 'error');
    }
  };

  // --- Media Gallery Actions ---
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setMediaUploading(true);

    try {
      const captions = fileArray.map(() => mediaCaption || 'Campus Photo');
      const res = await uploadMediaFiles(fileArray, captions);
      if (res && res.success && res.data) {
        setMedia([...res.data, ...media]);
        setMediaCaption('');
        showStatus('Photos uploaded to Gallery!');
      }
    } catch {
      showStatus('Error uploading media files', 'error');
    } finally {
      setMediaUploading(false);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('Delete this photo from gallery?')) return;
    try {
      await deleteMediaItem(id);
      setMedia(media.filter((m) => m._id !== id));
      showStatus('Media item removed');
    } catch {
      showStatus('Failed to delete media', 'error');
    }
  };

  // --- Notice Board Actions ---
  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;

    try {
      const res = await createNotice(newNotice);
      if (res && res.success) {
        setNotices([res.data, ...notices]);
        setNewNotice({ title: '', content: '' });
        showStatus('Circular published to notice board!');
      }
    } catch {
      showStatus('Failed to publish notice', 'error');
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!confirm('Delete this notice?')) return;
    try {
      await deleteNotice(id);
      setNotices(notices.filter((n) => n._id !== id));
      showStatus('Notice removed');
    } catch {
      showStatus('Failed to delete notice', 'error');
    }
  };

  // --- RENDER LOGIN IF NOT AUTHENTICATED ---
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-sky-600 font-bold">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Authenticating Admin...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-scope min-h-screen bg-gradient-to-br from-sky-900 via-sky-800 to-slate-900 flex flex-col justify-center items-center p-4">
        <style dangerouslySetInnerHTML={{ __html: `
          .admin-scope input,
          .admin-scope textarea,
          .admin-scope select {
            color: #0f172a !important;
            -webkit-text-fill-color: #0f172a !important;
            background-color: #ffffff !important;
            caret-color: #0284c7 !important;
            font-weight: 600 !important;
          }
          .admin-scope input::placeholder,
          .admin-scope textarea::placeholder {
            color: #64748b !important;
            -webkit-text-fill-color: #64748b !important;
            opacity: 0.85 !important;
            font-weight: 400 !important;
          }
          .admin-scope input:focus,
          .admin-scope textarea:focus,
          .admin-scope select:focus {
            color: #0f172a !important;
            -webkit-text-fill-color: #0f172a !important;
            border-color: #0284c7 !important;
          }
        `}} />
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-sky-200 text-slate-900">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-600/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">GD Public School</h1>
            <p className="text-xs font-bold text-sky-600 tracking-wider uppercase mt-1">
              Admin Control Centre
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="gdps@2027"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white font-bold rounded-xl text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Access Dashboard</span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link
              href="/"
              className="flex items-center gap-1.5 hover:text-sky-600 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to School Website</span>
            </Link>
            <span className="text-[11px] text-slate-400 font-medium">Authorized Access Only</span>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER AUTHENTICATED DASHBOARD ---
  return (
    <div className="admin-scope min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      <style dangerouslySetInnerHTML={{ __html: `
        .admin-scope input,
        .admin-scope textarea,
        .admin-scope select {
          color: #0f172a !important;
          -webkit-text-fill-color: #0f172a !important;
          background-color: #ffffff !important;
          caret-color: #0284c7 !important;
          font-weight: 600 !important;
        }
        .admin-scope input::placeholder,
        .admin-scope textarea::placeholder {
          color: #64748b !important;
          -webkit-text-fill-color: #64748b !important;
          opacity: 0.85 !important;
          font-weight: 400 !important;
        }
        .admin-scope input:focus,
        .admin-scope textarea:focus,
        .admin-scope select:focus {
          color: #0f172a !important;
          -webkit-text-fill-color: #0f172a !important;
          border-color: #0284c7 !important;
        }
      `}} />
      {/* Top Admin Header */}
      <header className="bg-white border-b border-sky-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                GD Public School
              </h1>
              <span className="text-[10px] sm:text-[11px] text-sky-600 font-bold uppercase tracking-wider block">
                Admin Control Dashboard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition border border-sky-200"
            >
              <span>Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition border border-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Status Notification */}
      {statusMsg && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-top-4 duration-300 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 w-full flex-1">
        {/* Top KPI Quick Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-5 sm:mb-6">
          <div
            onClick={() => setActiveTab('enquiries')}
            className={`cursor-pointer rounded-2xl p-3 sm:p-5 border transition shadow-sm flex items-center justify-between ${
              activeTab === 'enquiries'
                ? 'bg-sky-600 text-white border-sky-600 ring-2 ring-sky-300'
                : 'bg-white hover:border-sky-300 text-slate-800 border-slate-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${
                  activeTab === 'enquiries'
                    ? 'bg-white/20 text-white'
                    : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}
              >
                <Inbox className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block opacity-75">
                  Admission Leads
                </span>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                  <span className="text-base sm:text-xl font-black">
                    {enquiries.length}
                  </span>
                  {enquiries.filter((e) => e.status === 'new').length > 0 && (
                    <span
                      className={`text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full ${
                        activeTab === 'enquiries'
                          ? 'bg-white text-rose-600'
                          : 'bg-rose-500 text-white animate-pulse'
                      }`}
                    >
                      {enquiries.filter((e) => e.status === 'new').length} New
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('team')}
            className={`cursor-pointer rounded-2xl p-3 sm:p-5 border transition shadow-sm flex items-center justify-between ${
              activeTab === 'team'
                ? 'bg-sky-600 text-white border-sky-600 ring-2 ring-sky-300'
                : 'bg-white hover:border-sky-300 text-slate-800 border-slate-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${
                  activeTab === 'team'
                    ? 'bg-white/20 text-white'
                    : 'bg-sky-50 text-sky-600 border border-sky-100'
                }`}
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block opacity-75">
                  Leadership Staff
                </span>
                <span className="text-base sm:text-xl font-black block mt-0.5">
                  {team.length} Positions
                </span>
              </div>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('media')}
            className={`cursor-pointer rounded-2xl p-3 sm:p-5 border transition shadow-sm flex items-center justify-between ${
              activeTab === 'media'
                ? 'bg-sky-600 text-white border-sky-600 ring-2 ring-sky-300'
                : 'bg-white hover:border-sky-300 text-slate-800 border-slate-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${
                  activeTab === 'media'
                    ? 'bg-white/20 text-white'
                    : 'bg-sky-50 text-sky-600 border border-sky-100'
                }`}
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block opacity-75">
                  Campus Gallery
                </span>
                <span className="text-base sm:text-xl font-black block mt-0.5">
                  {media.length} Photos
                </span>
              </div>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('notices')}
            className={`cursor-pointer rounded-2xl p-3 sm:p-5 border transition shadow-sm flex items-center justify-between ${
              activeTab === 'notices'
                ? 'bg-sky-600 text-white border-sky-600 ring-2 ring-sky-300'
                : 'bg-white hover:border-sky-300 text-slate-800 border-slate-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${
                  activeTab === 'notices'
                    ? 'bg-white/20 text-white'
                    : 'bg-sky-50 text-sky-600 border border-sky-100'
                }`}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block opacity-75">
                  Notice Board
                </span>
                <span className="text-base sm:text-xl font-black block mt-0.5">
                  {notices.length} Circulars
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Mobile touch-friendly horizontal scroll) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-6 sm:mb-8 border-b border-slate-200 no-scrollbar touch-pan-x">
          <button
            onClick={() => setActiveTab('team')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
              activeTab === 'team'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Principal & Leadership ({team.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition relative ${
              activeTab === 'enquiries'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Admission Enquiries ({enquiries.length})</span>
            {enquiries.filter((e) => e.status === 'new').length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white animate-pulse">
                {enquiries.filter((e) => e.status === 'new').length} New
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('announcement')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
              activeTab === 'announcement'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Top Announcement Bar</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
              activeTab === 'branding'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>School Logo</span>
          </button>

          <button
            onClick={() => setActiveTab('general')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
              activeTab === 'general'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>School Info & Contact</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
              activeTab === 'stats'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Key Stats Counter</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
              activeTab === 'media'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Gallery & Media ({media.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
              activeTab === 'notices'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notice Board ({notices.length})</span>
          </button>
        </div>

        {/* TAB 1: TEAM & LEADERSHIP (Principal, Director, MD, VP) */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  School Leadership Staff (Principal, MD, Director, etc.)
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Upload photos and enter names for each position. Photos are stored securely in Cloudinary.
                </p>
              </div>

              <button
                onClick={() => setShowAddMember(!showAddMember)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddMember ? 'Cancel' : 'Add New Role'}</span>
              </button>
            </div>

            {/* Add New Member Form Drawer */}
            {showAddMember && (
              <form
                onSubmit={handleAddMember}
                className="bg-white p-6 rounded-3xl border border-sky-200 shadow-md space-y-4"
              >
                <h4 className="font-bold text-slate-900 text-sm">Add New Staff Position</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Designation / Role *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Academic Coordinator"
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-xs focus:ring-2 focus:ring-sky-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Leave blank or enter name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-xs focus:ring-2 focus:ring-sky-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Academic Qualifications
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. M.Sc., B.Ed., Ph.D."
                      value={newMember.qualification}
                      onChange={(e) => setNewMember({ ...newMember, qualification: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-xs focus:ring-2 focus:ring-sky-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Experience / Achievements
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 15+ Years in CBSE Administration"
                      value={newMember.experience}
                      onChange={(e) => setNewMember({ ...newMember, experience: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-xs focus:ring-2 focus:ring-sky-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. principal@gdpublicschool.edu.in"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-xs focus:ring-2 focus:ring-sky-500 shadow-sm"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Desk Message / About Them (Bio)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Enter a short bio or desk message for parents and students..."
                      value={newMember.bio}
                      onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-xs focus:ring-2 focus:ring-sky-500 shadow-sm"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition"
                >
                  Save New Role
                </button>
              </form>
            )}

            {/* Cards for each team member */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {team.map((member) => (
                <div
                  key={member._id}
                  className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-sky-100 shadow-sm flex flex-col md:flex-row gap-5 sm:gap-6 items-start"
                >
                  {/* Photo upload box */}
                  <div className="flex flex-col items-center gap-2 shrink-0 w-full md:w-40">
                    <div className="relative w-36 h-40 rounded-2xl bg-slate-100 border-2 border-dashed border-sky-300 overflow-hidden flex items-center justify-center shadow-inner">
                      {member.photoUrl ? (
                        <Image
                          src={member.photoUrl}
                          alt={member.role || 'Staff Member'}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-center p-2 text-slate-400">
                          <Camera className="w-8 h-8 mx-auto text-sky-400 mb-1" />
                          <span className="text-[10px] font-bold block text-sky-700">
                            Blank Photo
                          </span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">
                            Click button below
                          </span>
                        </div>
                      )}

                      {memberUploading === member._id && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                          <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                      )}
                    </div>

                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-xl text-[11px] font-bold transition w-full justify-center shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{member.photoUrl ? 'Change Photo' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleTeamPhotoUpload(member._id, e)}
                      />
                    </label>
                  </div>

                  {/* Form fields */}
                  <div className="flex-1 w-full space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
                        {member.role || 'Staff Member'}
                      </span>
                      <button
                        onClick={() => handleDeleteMember(member._id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition"
                        title="Delete Role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Designation / Role
                        </label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) =>
                            setTeam(
                              team.map((m) =>
                                m._id === member._id ? { ...m, role: e.target.value } : m
                              )
                            )
                          }
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-xs focus:ring-2 focus:ring-sky-500 shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={member.name || ''}
                          placeholder="e.g. Dr. Rajesh Sharma"
                          onChange={(e) =>
                            setTeam(
                              team.map((m) =>
                                m._id === member._id ? { ...m, name: e.target.value } : m
                              )
                            )
                          }
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-xs focus:ring-2 focus:ring-sky-500 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Academic Qualifications
                        </label>
                        <input
                          type="text"
                          value={member.qualification || ''}
                          placeholder="e.g. M.Sc. (Physics), M.Ed., Ph.D."
                          onChange={(e) =>
                            setTeam(
                              team.map((m) =>
                                m._id === member._id
                                  ? { ...m, qualification: e.target.value }
                                  : m
                              )
                            )
                          }
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-xs focus:ring-2 focus:ring-sky-500 shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Experience / Tenure
                        </label>
                        <input
                          type="text"
                          value={member.experience || ''}
                          placeholder="e.g. 18+ Years in Education"
                          onChange={(e) =>
                            setTeam(
                              team.map((m) =>
                                m._id === member._id
                                  ? { ...m, experience: e.target.value }
                                  : m
                              )
                            )
                          }
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-xs focus:ring-2 focus:ring-sky-500 shadow-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Desk Message / Bio (About {member.role})
                      </label>
                      <textarea
                        rows={2}
                        value={member.bio || ''}
                        placeholder={`Message from the ${member.role} to students and parents...`}
                        onChange={(e) =>
                          setTeam(
                            team.map((m) =>
                              m._id === member._id ? { ...m, bio: e.target.value } : m
                            )
                          )
                        }
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-xs focus:ring-2 focus:ring-sky-500 shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Official Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={member.email || ''}
                        placeholder="e.g. principal@gdpublicschool.edu.in"
                        onChange={(e) =>
                          setTeam(
                            team.map((m) =>
                              m._id === member._id ? { ...m, email: e.target.value } : m
                            )
                          )
                        }
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-xs focus:ring-2 focus:ring-sky-500 shadow-sm"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() =>
                          handleTeamMemberUpdate(member._id, {
                            role: member.role,
                            name: member.name,
                            qualification: member.qualification,
                            experience: member.experience,
                            bio: member.bio,
                            email: member.email,
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Profile & Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: ADMISSION ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            {/* Top Bar with Counters */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    Admission Enquiries & Parent Leads
                  </h3>
                  {enquiries.filter((e) => e.status === 'new').length > 0 && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-500 text-white animate-pulse">
                      {enquiries.filter((e) => e.status === 'new').length} New Pending
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Enquiries submitted through the website Request Admission Information form.
                </p>
              </div>

              {/* Quick Filter Buttons */}
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
                <button
                  onClick={() => setEnquiryFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    enquiryFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({enquiries.length})
                </button>
                <button
                  onClick={() => setEnquiryFilter('new')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    enquiryFilter === 'new'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>New</span>
                  <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
                    {enquiries.filter((e) => e.status === 'new').length}
                  </span>
                </button>
                <button
                  onClick={() => setEnquiryFilter('contacted')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    enquiryFilter === 'contacted'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Contacted ({enquiries.filter((e) => e.status === 'contacted').length})
                </button>
              </div>
            </div>

            {/* Search and Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by parent name, mobile, email, grade, or query..."
                  className="w-full pl-10 pr-12 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2 text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefreshEnquiries}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition shadow-sm"
                  title="Reload from server"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={exportEnquiriesToCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  title="Download CSV spreadsheet for Excel"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* List of Enquiries */}
            {enquiries
              .filter((e) => enquiryFilter === 'all' || e.status === enquiryFilter)
              .filter((e) => {
                if (!searchQuery.trim()) return true;
                const q = searchQuery.toLowerCase();
                return (
                  (e.parentName && e.parentName.toLowerCase().includes(q)) ||
                  (e.phone && e.phone.toLowerCase().includes(q)) ||
                  (e.email && e.email.toLowerCase().includes(q)) ||
                  (e.studentGrade && e.studentGrade.toLowerCase().includes(q)) ||
                  (e.message && e.message.toLowerCase().includes(q))
                );
              }).length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-sky-100 shadow-sm text-center">
                <div className="w-16 h-16 rounded-3xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4 border border-sky-100">
                  <Inbox className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  {searchQuery ? 'No Matching Enquiries' : 'No Admission Enquiries Found'}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                  {searchQuery
                    ? `No enquiries matched "${searchQuery}". Try a different search keyword.`
                    : 'When parents fill out the "Request Admission Information" form on your school website, their contact details and questions will instantly appear here!'}
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {enquiries
                  .filter((e) => enquiryFilter === 'all' || e.status === enquiryFilter)
                  .filter((e) => {
                    if (!searchQuery.trim()) return true;
                    const q = searchQuery.toLowerCase();
                    return (
                      (e.parentName && e.parentName.toLowerCase().includes(q)) ||
                      (e.phone && e.phone.toLowerCase().includes(q)) ||
                      (e.email && e.email.toLowerCase().includes(q)) ||
                      (e.studentGrade && e.studentGrade.toLowerCase().includes(q)) ||
                      (e.message && e.message.toLowerCase().includes(q))
                    );
                  })
                  .map((item) => (
                    <div
                      key={item._id}
                      className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border shadow-sm transition-all duration-200 flex flex-col justify-between space-y-4 ${
                        item.status === 'new'
                          ? 'border-sky-300 ring-2 ring-sky-100'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-bold text-slate-900">
                                {item.parentName}
                              </h4>
                              {item.status === 'new' ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200">
                                  New Lead
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                  Contacted
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN') : 'Recent'}
                            </span>
                          </div>

                          <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-100 shrink-0">
                            {item.studentGrade || 'Class 1'}
                          </span>
                        </div>

                        {/* Contact details */}
                        <div className="grid sm:grid-cols-2 gap-2 pt-1">
                          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                            <a
                              href={`tel:${item.phone}`}
                              className="text-xs font-bold text-slate-800 hover:text-sky-600 flex items-center gap-1.5 truncate"
                            >
                              <Phone className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              <span>{item.phone}</span>
                            </a>
                            <a
                              href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-bold text-emerald-600 hover:underline shrink-0 ml-1"
                            >
                              WhatsApp
                            </a>
                          </div>

                          {item.email ? (
                            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center">
                              <a
                                href={`mailto:${item.email}`}
                                className="text-xs font-semibold text-slate-700 hover:text-sky-600 flex items-center gap-1.5 truncate"
                              >
                                <Mail className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                <span className="truncate">{item.email}</span>
                              </a>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-400 italic">
                              No email provided
                            </div>
                          )}
                        </div>

                        {/* Message Box */}
                        {item.message ? (
                          <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 text-xs text-slate-700 space-y-1">
                            <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">
                              Parent Query / Notes:
                            </span>
                            <p className="italic whitespace-pre-line leading-relaxed">
                              &ldquo;{item.message}&rdquo;
                            </p>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic pt-1">
                            No specific query message attached.
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                        {item.status === 'new' ? (
                          <button
                            onClick={() => handleUpdateEnquiryStatus(item._id, 'contacted')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark as Contacted</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateEnquiryStatus(item._id, 'new')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reopen / Mark as New</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteEnquiry(item._id)}
                          className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-600 p-1.5 text-xs transition"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BRANDING & SCHOOL LOGO */}
        {activeTab === 'branding' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">School Emblem & Logo</h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload your official school logo. If blank, a default graduation emblem with GDPS monogram is shown.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-sky-50/60 rounded-2xl border border-sky-100">
              <div className="relative w-36 h-36 rounded-3xl bg-white border-2 border-dashed border-sky-300 flex items-center justify-center overflow-hidden shadow-inner">
                {school.logoUrl ? (
                  <Image
                    src={school.logoUrl}
                    alt="School Logo"
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="text-center p-3 text-slate-400">
                    <ImageIcon className="w-10 h-10 mx-auto text-sky-400 mb-1" />
                    <span className="text-xs font-bold text-sky-700">Logo Blank</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Ready to upload
                    </span>
                  </div>
                )}

                {logoUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                )}
              </div>

              <div className="space-y-3 flex-1 text-center sm:text-left">
                <h4 className="font-bold text-slate-800 text-base">
                  {school.logoUrl ? 'Official Logo Active' : 'No Custom Logo Uploaded'}
                </h4>
                <p className="text-xs text-slate-600 max-w-md">
                  Supported formats: PNG, JPG, WEBP, SVG. Transparent background recommended for best appearance.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition shadow-sm">
                    <Upload className="w-4 h-4" />
                    <span>Upload Logo from Computer</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </label>

                  {school.logoUrl && (
                    <button
                      onClick={handleLogoDelete}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Logo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: TOP ANNOUNCEMENT & MARQUEE BAR */}
        {activeTab === 'announcement' && (
          <form
            onSubmit={handleSaveGeneral}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200 uppercase tracking-wider">
                    Header Strip
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">Top Announcement & Ticker Bar</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Customize the scrolling notification ticker, badge tag, and admissions alert at the very top of your website.
                </p>
              </div>

              {/* Show/Hide Toggle */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
                <span className="text-xs font-bold text-slate-700">Display Announcement Bar:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={school.showAnnouncement !== false}
                    onChange={(e) => setSchool({ ...school, showAnnouncement: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>

            {/* Live Interactive Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Live Website Header Preview
              </span>
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#050811] text-slate-300 py-2.5 px-4 shadow-xl">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 shrink-0 bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-cyan-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <Sparkles className="w-3 h-3 text-cyan-300" />
                    <span>{school.announcementBadge || 'Admissions 2025–26'}</span>
                  </div>
                  <div className="truncate flex-1 text-slate-200 text-xs font-medium">
                    {school.announcementText || '🎉 Admissions Open for Session 2025–26 (Nursery to Class 12th)'}
                    <span className="text-slate-500 mx-2">•</span>
                    <span className="text-cyan-400">Helpline: {school.phone || '+91 98765 43210'}</span>
                  </div>
                  <span className="text-slate-500 text-xs cursor-not-allowed">✕</span>
                </div>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="grid sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Badge Tag / Pill Label
                </label>
                <input
                  type="text"
                  value={school.announcementBadge || ''}
                  onChange={(e) => setSchool({ ...school, announcementBadge: e.target.value })}
                  placeholder="e.g. Admissions 2025–26"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none shadow-sm"
                />
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  Shown in the glowing cyan pill at the start of the strip (e.g. <em>Admissions 2025–26</em>, <em>Annual Exam 2025</em>, <em>Notice</em>).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Helpline Numbers (Shown in Marquee)
                </label>
                <input
                  type="text"
                  value={school.phone || ''}
                  onChange={(e) => setSchool({ ...school, phone: e.target.value })}
                  placeholder="+91 98765 43210 / +91 12345 67890"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none shadow-sm"
                />
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  Clicking this on the homepage allows visitors to immediately call school helpline.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Main Announcement Ticker Text
                </label>
                <textarea
                  rows={2}
                  value={school.announcementText || ''}
                  onChange={(e) => setSchool({ ...school, announcementText: e.target.value })}
                  placeholder="e.g. 🎉 Admissions Open for Session 2025–26 (Nursery to Class 12th)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none shadow-sm"
                />
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  This text scrolls continuously across the marquee ticker on desktop and is highlighted on mobile devices.
                </p>
              </div>
            </div>

            {/* Quick Templates / Presets */}
            <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-2">
              <span className="text-xs font-bold text-sky-900 block">
                ⚡ Quick Presets (Click to apply):
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSchool({
                      ...school,
                      announcementBadge: 'Admissions 2025–26',
                      announcementText:
                        '🎉 Admissions Open for Session 2025–26 (Nursery to Class 12th) — Limited Seats Available!',
                    })
                  }
                  className="px-3 py-1.5 bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-medium transition"
                >
                  🎓 Admissions Open 2025–26
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSchool({
                      ...school,
                      announcementBadge: 'Annual Exams',
                      announcementText:
                        '📢 Annual Term Examination Datesheet & Admit Cards are now published on the portal.',
                    })
                  }
                  className="px-3 py-1.5 bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-medium transition"
                >
                  📝 Exam Schedule Notice
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSchool({
                      ...school,
                      announcementBadge: 'Sports Meet',
                      announcementText:
                        '🏆 Annual Sports Meet & Cultural Fiesta scheduled this month. Parents are cordially invited!',
                    })
                  }
                  className="px-3 py-1.5 bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-medium transition"
                >
                  🏆 Annual Sports Fiesta
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSchool({
                      ...school,
                      announcementBadge: 'Vacation Notice',
                      announcementText:
                        '☀️ School will remain closed for Summer Vacation from 15th May to 30th June.',
                    })
                  }
                  className="px-3 py-1.5 bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-medium transition"
                >
                  ☀️ Vacation Notice
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Announcement Bar</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: GENERAL INFO & CONTACT */}
        {activeTab === 'general' && (
          <form
            onSubmit={handleSaveGeneral}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-slate-900">General School Details</h3>
              <p className="text-xs text-slate-500 mt-1">
                Update school contact information, board affiliation, address, and hero description.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Board Affiliation
                </label>
                <input
                  type="text"
                  value={school.board}
                  onChange={(e) => setSchool({ ...school, board: e.target.value })}
                  placeholder="e.g. CBSE Affiliated"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  School Category / Type
                </label>
                <input
                  type="text"
                  value={school.type}
                  onChange={(e) => setSchool({ ...school, type: e.target.value })}
                  placeholder="e.g. Co-Educational English Medium"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Year Established
                </label>
                <input
                  type="text"
                  value={school.established}
                  onChange={(e) => setSchool({ ...school, established: e.target.value })}
                  placeholder="e.g. 2008"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Campus Timings
                </label>
                <input
                  type="text"
                  value={school.timings}
                  onChange={(e) => setSchool({ ...school, timings: e.target.value })}
                  placeholder="e.g. 08:00 AM - 02:00 PM"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Numbers (Helpline)
                </label>
                <input
                  type="text"
                  value={school.phone}
                  onChange={(e) => setSchool({ ...school, phone: e.target.value })}
                  placeholder="+91 98765 43210 / +91 12345 67890"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={school.email}
                  onChange={(e) => setSchool({ ...school, email: e.target.value })}
                  placeholder="info@gdpublicschool.edu.in"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none shadow-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Campus Physical Address
                </label>
                <input
                  type="text"
                  value={school.address}
                  onChange={(e) => setSchool({ ...school, address: e.target.value })}
                  placeholder="Campus Address, City, State, PIN"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none shadow-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Homepage Hero Description
                </label>
                <textarea
                  rows={3}
                  value={school.heroDescription}
                  onChange={(e) => setSchool({ ...school, heroDescription: e.target.value })}
                  placeholder="Short introductory overview displayed prominently at the top of the homepage"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none shadow-sm"
                />
              </div>

              {/* Top Announcement Bar quick settings */}
              <div className="sm:col-span-2 p-4 bg-sky-50/70 border border-sky-100 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Top Announcement / Marquee Bar Settings</span>
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={school.showAnnouncement !== false}
                      onChange={(e) => setSchool({ ...school, showAnnouncement: e.target.checked })}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span>Show on Website</span>
                  </label>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={school.announcementBadge || ''}
                      onChange={(e) => setSchool({ ...school, announcementBadge: e.target.value })}
                      placeholder="e.g. Admissions 2025–26"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-xs shadow-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Marquee Ticker Text</label>
                    <input
                      type="text"
                      value={school.announcementText || ''}
                      onChange={(e) => setSchool({ ...school, announcementText: e.target.value })}
                      placeholder="e.g. 🎉 Admissions Open for Session 2025–26 (Nursery to Class 12th)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-xs shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save School Information</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: KEY STATS */}
        {activeTab === 'stats' && (
          <form
            onSubmit={handleSaveStats}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-slate-900">Key Statistics Counter</h3>
              <p className="text-xs text-slate-500 mt-1">
                Shown on the homepage counter strip to highlight school size and achievements.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Total Students
                </label>
                <input
                  type="text"
                  value={stats.students}
                  onChange={(e) => setStats({ ...stats, students: e.target.value })}
                  placeholder="e.g. 1,500+"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-sky-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Qualified Teachers
                </label>
                <input
                  type="text"
                  value={stats.teachers}
                  onChange={(e) => setStats({ ...stats, teachers: e.target.value })}
                  placeholder="e.g. 75+"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-sky-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Years of Legacy
                </label>
                <input
                  type="text"
                  value={stats.years}
                  onChange={(e) => setStats({ ...stats, years: e.target.value })}
                  placeholder="e.g. 16+"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-sky-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Grades / Classes
                </label>
                <input
                  type="text"
                  value={stats.classes}
                  onChange={(e) => setStats({ ...stats, classes: e.target.value })}
                  placeholder="e.g. Nur to 12th"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-sky-500 shadow-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Statistics</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 5: MEDIA & GALLERY */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Upload Campus Photos</h3>
              <p className="text-xs text-slate-500">
                Select one or multiple photos to upload directly to Cloudinary gallery.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Caption for Uploaded Photos (Optional)
                  </label>
                  <input
                    type="text"
                    value={mediaCaption}
                    onChange={(e) => setMediaCaption(e.target.value)}
                    placeholder="e.g. Annual Sports Day 2025"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-sky-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold transition shadow-sm">
                    {mediaUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Choose Files & Upload</span>
                      </>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      disabled={mediaUploading}
                      onChange={handleMediaUpload}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Existing Media Grid */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm">
              <h4 className="font-bold text-slate-900 text-base mb-4">
                Uploaded Gallery Items ({media.length})
              </h4>

              {media.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Camera className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-semibold">No photos uploaded to database yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Use the upload box above to add event and campus photos.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {media.map((item) => (
                    <div
                      key={item._id}
                      className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col"
                    >
                      <div className="relative aspect-video w-full bg-slate-100">
                        <Image
                          src={item.url}
                          alt={item.caption || 'Media'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700 truncate">
                          {item.caption || 'No caption'}
                        </span>
                        <button
                          onClick={() => handleDeleteMedia(item._id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                          title="Delete photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: NOTICES */}
        {activeTab === 'notices' && (
          <div className="space-y-6">
            {/* Create Notice Form */}
            <form
              onSubmit={handleAddNotice}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-4"
            >
              <h3 className="text-xl font-bold text-slate-900">Publish New Circular</h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Circular Title *
                </label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="e.g. Schedule for Quarterly Formative Assessments"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-sky-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Notice Details / Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Detailed instructions for students, parents, and guardians..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-sky-500 shadow-sm"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Notice</span>
                </button>
              </div>
            </form>

            {/* Existing Notices List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm">
              <h4 className="font-bold text-slate-900 text-base mb-4">
                Active Notices & Circulars ({notices.length})
              </h4>

              <div className="space-y-3">
                {notices.map((n) => (
                  <div
                    key={n._id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4"
                  >
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{n.title}</h5>
                      <p className="text-xs text-slate-600 mt-1 whitespace-pre-line">
                        {n.content}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-2 block">
                        Published: {new Date(n.date).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteNotice(n._id)}
                      className="text-slate-400 hover:text-rose-600 p-2 transition"
                      title="Delete notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
