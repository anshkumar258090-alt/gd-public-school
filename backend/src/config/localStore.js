const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../data');
const dbFile = path.join(dataDir, 'local_db.json');

const initialData = {
  school: {
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
    announcementBadge: 'Admissions 2025–26',
    announcementText: '🎉 Admissions Open for Session 2025–26 (Nursery to Class 12th)',
    showAnnouncement: true,
  },
  stats: {
    students: '1,500+',
    teachers: '75+',
    years: '16+',
    classes: 'Pre-Nur to 12th',
  },
  team: [
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
  ],
  media: [],
  notices: [
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
  ],
  enquiries: [],
};

function readDB() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(dbFile)) {
      fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2), 'utf8');
      return initialData;
    }
    const content = fs.readFileSync(dbFile, 'utf8');
    const parsed = JSON.parse(content);
    if (!parsed.enquiries) parsed.enquiries = [];
    return parsed;
  } catch (err) {
    console.error('Error reading local db:', err);
    return initialData;
  }
}

function writeDB(data) {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing local db:', err);
  }
}

module.exports = {
  readDB,
  writeDB,
};
