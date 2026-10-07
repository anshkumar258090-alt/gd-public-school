// ============================================
//  GD PUBLIC SCHOOL - DATA STORE (localStorage)
// ============================================

const DB_KEY = 'gdps_data';

const DEFAULT_DATA = {
  school: {
    address: '',
    phone: '',
    email: '',
    board: '',
    type: '',
    established: '',
    timings: '',
    announcementBadge: 'Admissions 2025–26',
    announcementText: 'Admissions Open 2025–26',
    showAnnouncement: true,
  },
  stats: {
    students: '',
    teachers: '',
    years: '',
    classes: '',
  },
  academics: {
    description: '',
    classRange: '',
    achievements: '',
    features: ['CBSE / State Board Affiliated', 'Smart Classrooms', 'Experienced Faculty', 'Co-curricular Activities', 'Sports & Physical Education']
  },
  facilities: [
    { icon: '📚', label: 'Library' },
    { icon: '🖥️', label: 'Computer Lab' },
    { icon: '⚗️', label: 'Science Lab' },
    { icon: '⚽', label: 'Sports Ground' },
    { icon: '🎨', label: 'Art Room' },
    { icon: '🎭', label: 'Auditorium' },
    { icon: '🍽️', label: 'Canteen' },
    { icon: '🚌', label: 'Transport' },
  ],
  team: [
    { id: 1, name: '', role: 'Principal', qualification: '', photo: '' },
    { id: 2, name: '', role: 'Director', qualification: '', photo: '' },
    { id: 3, name: '', role: 'Managing Director', qualification: '', photo: '' },
    { id: 4, name: '', role: 'Vice Principal', qualification: '', photo: '' },
  ],
  media: [],
  notices: [],
  logo: '',
};

function getDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA));
    const saved = JSON.parse(raw);
    // Merge defaults for any missing keys
    return deepMerge(JSON.parse(JSON.stringify(DEFAULT_DATA)), saved);
  } catch { return JSON.parse(JSON.stringify(DEFAULT_DATA)); }
}

function saveDB(data) {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
}

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && target[key]) {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
