import { SchoolInfo, SchoolStats, TeamMember, MediaItem, SchoolNotice, AdmissionEnquiry } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Default fallback data
export const DEFAULT_SCHOOL: SchoolInfo = {
  address: 'Main Campus, Sector 4, Civil Lines, Near City Center',
  phone: '+91 98765 43210 / +91 12345 67890',
  email: 'info@gdpublicschool.edu.in',
  board: 'CBSE Affiliated (Affiliation No: 2130000)',
  type: 'Co-Educational English Medium (K-12)',
  established: '2008',
  timings: 'Mon - Sat: 08:00 AM - 02:00 PM',
  logoUrl: '',
  heroDescription:
    'Dedicated to nurturing curious minds, strong values, and visionary leaders through holistic and quality education with modern facilities, smart labs, and sports arenas.',
};

export const DEFAULT_STATS: SchoolStats = {
  students: '1,500+',
  teachers: '75+',
  years: '16+',
  classes: 'Pre-Nur to 12th',
};

export const DEFAULT_TEAM: TeamMember[] = [
  {
    _id: 'director',
    role: 'Director',
    name: '',
    qualification: '',
    experience: '',
    bio: '',
    email: '',
    photoUrl: '',
    order: 1,
    isActive: true,
  },
  {
    _id: 'md',
    role: 'Managing Director',
    name: '',
    qualification: '',
    experience: '',
    bio: '',
    email: '',
    photoUrl: '',
    order: 2,
    isActive: true,
  },
  {
    _id: 'principal',
    role: 'Principal',
    name: '',
    qualification: '',
    experience: '',
    bio: '',
    email: '',
    photoUrl: '',
    order: 3,
    isActive: true,
  },
  {
    _id: 'vp',
    role: 'Vice Principal',
    name: '',
    qualification: '',
    experience: '',
    bio: '',
    email: '',
    photoUrl: '',
    order: 4,
    isActive: true,
  },
];

export const DEFAULT_NOTICES: SchoolNotice[] = [
  {
    _id: '1',
    title: 'Admissions Open for Academic Session 2025-26',
    content: 'Registration forms for Nursery to Class 9th & 11th are now available in the school office and online portal.',
    date: new Date().toISOString(),
    isActive: true,
  },
  {
    _id: '2',
    title: 'Annual Sports Meet & Cultural Fiesta',
    content: 'All parents and guardians are cordially invited to attend the Annual Sports Day scheduled for this month.',
    date: new Date().toISOString(),
    isActive: true,
  },
];

// Helper to safely write to localStorage without crashing if quota exceeded
export function safeSetLocalStorage(key: string, value: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`[LocalStorage] Quota exceeded or error saving "${key}":`, err);
  }
}

// Helper to get auth header
export function getAuthHeader(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('gdps_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Convert file to base64 for local fallback preview
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || '');
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

// Compress image to small base64 for offline fallback without exceeding localStorage quota
export function compressImageToBase64(file: File, maxWidth = 400, maxHeight = 400, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof window === 'undefined') {
        resolve((e.target?.result as string) || '');
        return;
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve((e.target?.result as string) || '');
        }
      };
      img.onerror = () => resolve((e.target?.result as string) || '');
      img.src = (e.target?.result as string) || '';
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

// Fetch helper with error catching
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...getAuthHeader(),
        ...options.headers,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`[API] Fetch to ${endpoint} failed:`, error);
    return null;
  }
}

// --- Auth APIs ---
export async function loginAdmin(credentials: { username: string; password: string }) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (data.success && data.token) {
      localStorage.setItem('gdps_admin_token', data.token);
      localStorage.removeItem('gdps_offline_mode');
    }
    return data;
  } catch (err) {
    // If backend is offline or unreachable, allow seamless login if credentials match admin / gdps2024
    if (credentials.username === 'admin' && credentials.password === 'gdps2024') {
      const offlineToken = 'offline_admin_token_' + Date.now();
      localStorage.setItem('gdps_admin_token', offlineToken);
      localStorage.setItem('gdps_offline_mode', 'true');
      return { success: true, token: offlineToken, username: 'admin', isOffline: true };
    }
    return { success: false, message: 'Invalid username or password' };
  }
}

export async function verifyAdmin(): Promise<boolean> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('gdps_admin_token') : null;
  if (!token) return false;
  if (token.startsWith('offline_admin_token_')) return true;

  try {
    const res = await fetch(`${API_BASE}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return Boolean(data.valid);
  } catch {
    // Backend momentarily offline but token exists
    return true;
  }
}

export function logoutAdmin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('gdps_admin_token');
    localStorage.removeItem('gdps_offline_mode');
  }
}

// --- School Info APIs ---
export async function getSchoolInfo(): Promise<SchoolInfo> {
  // Check local storage override first
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('gdps_local_school');
    if (local) {
      try {
        return { ...DEFAULT_SCHOOL, ...JSON.parse(local) };
      } catch {}
    }
  }

  const res = await apiFetch<{ success: boolean; data: SchoolInfo }>('/api/school');
  if (res && res.success && res.data) {
    return { ...DEFAULT_SCHOOL, ...res.data };
  }
  return DEFAULT_SCHOOL;
}

export async function updateSchoolInfo(data: Partial<SchoolInfo>) {
  const res = await apiFetch<{ success: boolean; data: SchoolInfo }>('/api/school', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (typeof window !== 'undefined') {
    const current = await getSchoolInfo();
    const updated = { ...current, ...data };
    safeSetLocalStorage('gdps_local_school', JSON.stringify(updated));
  }

  return res || { success: true, data: data as SchoolInfo };
}

export async function uploadSchoolLogo(file: File) {
  const formData = new FormData();
  formData.append('logo', file);
  const res = await apiFetch<{ success: boolean; logoUrl: string; data: SchoolInfo }>('/api/school/logo', {
    method: 'POST',
    body: formData,
  });

  if (res && res.success && res.logoUrl) {
    if (typeof window !== 'undefined') {
      const current = await getSchoolInfo();
      safeSetLocalStorage('gdps_local_school', JSON.stringify({ ...current, logoUrl: res.logoUrl }));
    }
    return res;
  }

  // Fallback: compress image
  let localDataUrl = '';
  if (typeof window !== 'undefined') {
    try {
      localDataUrl = await compressImageToBase64(file, 200, 200, 0.8);
      const current = await getSchoolInfo();
      safeSetLocalStorage('gdps_local_school', JSON.stringify({ ...current, logoUrl: localDataUrl }));
    } catch (e) {}
  }

  return { success: true, logoUrl: localDataUrl, data: {} as SchoolInfo };
}

export async function deleteSchoolLogo() {
  if (typeof window !== 'undefined') {
    const current = await getSchoolInfo();
    localStorage.setItem('gdps_local_school', JSON.stringify({ ...current, logoUrl: '' }));
  }
  const res = await apiFetch<{ success: boolean; message: string }>('/api/school/logo', {
    method: 'DELETE',
  });
  return res || { success: true, message: 'Logo removed' };
}

// --- Stats APIs ---
export async function getSchoolStats(): Promise<SchoolStats> {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('gdps_local_stats');
    if (local) {
      try {
        return { ...DEFAULT_STATS, ...JSON.parse(local) };
      } catch {}
    }
  }

  const res = await apiFetch<{ success: boolean; data: SchoolStats }>('/api/stats');
  if (res && res.success && res.data) {
    return { ...DEFAULT_STATS, ...res.data };
  }
  return DEFAULT_STATS;
}

export async function updateSchoolStats(data: Partial<SchoolStats>) {
  if (typeof window !== 'undefined') {
    const current = await getSchoolStats();
    const updated = { ...current, ...data };
    localStorage.setItem('gdps_local_stats', JSON.stringify(updated));
  }

  const res = await apiFetch<{ success: boolean; data: SchoolStats }>('/api/stats', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  return res || { success: true, data: data as SchoolStats };
}

// --- Team APIs ---
export async function getTeamMembers(): Promise<TeamMember[]> {
  const res = await apiFetch<{ success: boolean; data: TeamMember[] }>('/api/team');
  if (res && res.success && res.data && res.data.length > 0) {
    if (typeof window !== 'undefined') {
      safeSetLocalStorage('gdps_local_team', JSON.stringify(res.data));
    }
    return res.data;
  }

  // Fallback to local storage if API is unreachable
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('gdps_local_team');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
  }

  return DEFAULT_TEAM;
}

export async function createTeamMember(data: {
  name: string;
  role: string;
  qualification?: string;
  experience?: string;
  bio?: string;
  email?: string;
  order?: number;
}) {
  const res = await apiFetch<{ success: boolean; data: TeamMember }>('/api/team', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const member: TeamMember = res?.data || {
    _id: 'member_' + Date.now(),
    name: data.name,
    role: data.role,
    qualification: data.qualification || '',
    experience: data.experience || '',
    bio: data.bio || '',
    email: data.email || '',
    photoUrl: '',
    order: data.order || 0,
    isActive: true,
  };

  if (typeof window !== 'undefined') {
    const team = await getTeamMembers();
    safeSetLocalStorage('gdps_local_team', JSON.stringify([...team, member]));
  }

  return { success: true, data: member };
}

export async function updateTeamMember(id: string, data: Partial<TeamMember>) {
  const res = await apiFetch<{ success: boolean; data: TeamMember }>(`/api/team/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (res && res.success && res.data) {
    if (typeof window !== 'undefined') {
      const team = await getTeamMembers();
      const updated = team.map((m) => (m._id === id ? res.data : m));
      safeSetLocalStorage('gdps_local_team', JSON.stringify(updated));
    }
    return res;
  }

  // Local fallback if API is unreachable
  if (typeof window !== 'undefined') {
    const team = await getTeamMembers();
    const updated = team.map((m) => (m._id === id ? { ...m, ...data } : m));
    safeSetLocalStorage('gdps_local_team', JSON.stringify(updated));
    const member = updated.find((m) => m._id === id);
    return { success: true, data: member || (data as TeamMember) };
  }

  return { success: true, data: data as TeamMember };
}

export async function uploadTeamPhoto(id: string, file: File) {
  const formData = new FormData();
  formData.append('photo', file);

  const res = await apiFetch<{ success: boolean; data: TeamMember }>(`/api/team/${id}/photo`, {
    method: 'POST',
    body: formData,
  });

  if (res && res.success && res.data) {
    if (typeof window !== 'undefined') {
      const team = await getTeamMembers();
      const updated = team.map((m) => (m._id === id ? res.data : m));
      safeSetLocalStorage('gdps_local_team', JSON.stringify(updated));
    }
    return res;
  }

  // Offline / local fallback: compress image to small preview without exceeding localStorage quota
  let localDataUrl = '';
  if (typeof window !== 'undefined') {
    try {
      localDataUrl = await compressImageToBase64(file, 400, 400, 0.7);
      const team = await getTeamMembers();
      const updated = team.map((m) => (m._id === id ? { ...m, photoUrl: localDataUrl } : m));
      safeSetLocalStorage('gdps_local_team', JSON.stringify(updated));
      const member = updated.find((m) => m._id === id);
      return { success: true, data: member || ({} as TeamMember) };
    } catch (e) {
      console.warn('Fallback photo compression failed:', e);
    }
  }

  return { success: false, data: {} as TeamMember };
}

export async function deleteTeamMember(id: string) {
  const res = await apiFetch<{ success: boolean; message: string }>(`/api/team/${id}`, {
    method: 'DELETE',
  });

  if (typeof window !== 'undefined') {
    const team = await getTeamMembers();
    const filtered = team.filter((m) => m._id !== id);
    safeSetLocalStorage('gdps_local_team', JSON.stringify(filtered));
  }

  return res || { success: true, message: 'Member deleted' };
}

// --- Media Gallery APIs ---
export async function getMediaGallery(): Promise<MediaItem[]> {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('gdps_local_media');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
  }

  const res = await apiFetch<{ success: boolean; data: MediaItem[] }>('/api/media');
  if (res && res.success && res.data) {
    return res.data;
  }
  return [];
}

export async function uploadMediaFiles(files: File[], captions: string[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  formData.append('captions', JSON.stringify(captions));

  const res = await apiFetch<{ success: boolean; data: MediaItem[] }>('/api/media', {
    method: 'POST',
    body: formData,
  });

  if (res && res.success && res.data) {
    if (typeof window !== 'undefined') {
      const current = await getMediaGallery();
      safeSetLocalStorage('gdps_local_media', JSON.stringify([...res.data, ...current]));
    }
    return res;
  }

  // Fallback if backend offline
  const localItems: MediaItem[] = [];
  if (typeof window !== 'undefined') {
    for (let i = 0; i < files.length; i++) {
      try {
        const b64 = await compressImageToBase64(files[i], 800, 600, 0.7);
        localItems.push({
          _id: 'media_' + Date.now() + '_' + i,
          url: b64,
          caption: captions[i] || 'Campus Photo',
          type: files[i].type.startsWith('video/') ? 'video' : 'image',
          order: i + 1,
        });
      } catch (e) {}
    }
    const current = await getMediaGallery();
    safeSetLocalStorage('gdps_local_media', JSON.stringify([...localItems, ...current]));
  }

  return { success: true, data: localItems };
}

export async function deleteMediaItem(id: string) {
  const res = await apiFetch<{ success: boolean; message: string }>(`/api/media/${id}`, {
    method: 'DELETE',
  });

  if (typeof window !== 'undefined') {
    const media = await getMediaGallery();
    const filtered = media.filter((m) => m._id !== id);
    safeSetLocalStorage('gdps_local_media', JSON.stringify(filtered));
  }

  return res || { success: true, message: 'Deleted' };
}

// --- Notices APIs ---
export async function getNotices(): Promise<SchoolNotice[]> {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('gdps_local_notices');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
  }

  const res = await apiFetch<{ success: boolean; data: SchoolNotice[] }>('/api/notices');
  if (res && res.success && res.data && res.data.length > 0) {
    return res.data;
  }
  return DEFAULT_NOTICES;
}

export async function createNotice(data: { title: string; content: string; date?: string }) {
  const newNotice: SchoolNotice = {
    _id: 'notice_' + Date.now(),
    title: data.title,
    content: data.content,
    date: data.date || new Date().toISOString(),
    isActive: true,
  };

  if (typeof window !== 'undefined') {
    const notices = await getNotices();
    localStorage.setItem('gdps_local_notices', JSON.stringify([newNotice, ...notices]));
  }

  const res = await apiFetch<{ success: boolean; data: SchoolNotice }>('/api/notices', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return res || { success: true, data: newNotice };
}

export async function deleteNotice(id: string) {
  if (typeof window !== 'undefined') {
    const notices = await getNotices();
    const filtered = notices.filter((n) => n._id !== id);
    localStorage.setItem('gdps_local_notices', JSON.stringify(filtered));
  }

  const res = await apiFetch<{ success: boolean; message: string }>(`/api/notices/${id}`, {
    method: 'DELETE',
  });

  return res || { success: true, message: 'Deleted' };
}

// --- Admission Enquiries APIs ---
export async function submitEnquiry(data: {
  parentName: string;
  phone: string;
  email?: string;
  studentGrade: string;
  message?: string;
}) {
  const newEnquiry: AdmissionEnquiry = {
    _id: 'enq_' + Date.now(),
    parentName: data.parentName,
    phone: data.phone,
    email: data.email || '',
    studentGrade: data.studentGrade || 'Class 1',
    message: data.message || '',
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('gdps_local_enquiries');
    const list = local ? JSON.parse(local) : [];
    localStorage.setItem('gdps_local_enquiries', JSON.stringify([newEnquiry, ...list]));
  }

  const res = await apiFetch<{ success: boolean; data: AdmissionEnquiry }>('/api/enquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return res || { success: true, data: newEnquiry };
}

export async function getEnquiries(): Promise<AdmissionEnquiry[]> {
  const localList: AdmissionEnquiry[] = [];
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('gdps_local_enquiries');
    if (local) {
      try {
        localList.push(...JSON.parse(local));
      } catch {}
    }
  }

  const res = await apiFetch<{ success: boolean; data: AdmissionEnquiry[] }>('/api/enquiries');
  if (res && res.success && res.data) {
    // Merge remote and any locally stored offline entries without duplicate ids
    const remote = res.data;
    const remoteIds = new Set(remote.map((r) => r._id));
    const combined = [...remote, ...localList.filter((l) => !remoteIds.has(l._id))];
    return combined;
  }

  return localList;
}

export async function updateEnquiryStatus(id: string, status: 'new' | 'contacted') {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('gdps_local_enquiries');
    if (local) {
      try {
        const list: AdmissionEnquiry[] = JSON.parse(local);
        const updated = list.map((item) => (item._id === id ? { ...item, status } : item));
        localStorage.setItem('gdps_local_enquiries', JSON.stringify(updated));
      } catch {}
    }
  }

  const res = await apiFetch<{ success: boolean; data: AdmissionEnquiry }>(`/api/enquiries/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });

  return res || { success: true };
}

export async function deleteEnquiry(id: string) {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('gdps_local_enquiries');
    if (local) {
      try {
        const list: AdmissionEnquiry[] = JSON.parse(local);
        const filtered = list.filter((item) => item._id !== id);
        localStorage.setItem('gdps_local_enquiries', JSON.stringify(filtered));
      } catch {}
    }
  }

  const res = await apiFetch<{ success: boolean; message: string }>(`/api/enquiries/${id}`, {
    method: 'DELETE',
  });

  return res || { success: true, message: 'Deleted' };
}
