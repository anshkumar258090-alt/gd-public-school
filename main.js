// ============================================
//  GD PUBLIC SCHOOL - MAIN WEBSITE SCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  loadAllData();
  initNavbar();
  initScrollAnimations();
  initContactForm();
  initLightbox();
});

// ===== LOAD ALL DATA FROM DB =====
function loadAllData() {
  const db = getDB();

  // LOGO
  const logoImg = document.getElementById('schoolLogoImg');
  const logoPlaceholder = document.getElementById('logoPlaceholder');
  if (db.logo) {
    logoImg.src = db.logo;
    logoImg.classList.remove('hidden');
    logoPlaceholder.classList.add('hidden');
  }

  // STATS
  setText('statStudents', db.stats.students || '–');
  setText('statTeachers', db.stats.teachers || '–');
  setText('statYears', db.stats.years || '–');
  setText('statClasses', db.stats.classes || '–');

  // SCHOOL INFO
  setText('schoolAddress', db.school.address || '–');
  setText('schoolPhone', db.school.phone || '–');
  setText('schoolEmail', db.school.email || '–');
  setText('schoolBoard', db.school.board || '–');
  setText('schoolType', db.school.type || '–');
  setText('schoolEstablished', db.school.established || '–');
  setText('schoolTimings', db.school.timings || '–');

  // ANNOUNCEMENT BAR
  const announceBar = document.getElementById('announceBar');
  if (db.school.showAnnouncement === false) {
    if (announceBar) announceBar.style.display = 'none';
  } else {
    if (announceBar) announceBar.style.display = '';
    const navAnnounceBadge = document.getElementById('navAnnounceBadge');
    if (navAnnounceBadge && db.school.announcementBadge) {
      navAnnounceBadge.textContent = db.school.announcementBadge;
    }
    const navAnnounceText = document.getElementById('navAnnounceText');
    if (navAnnounceText && db.school.announcementText) {
      navAnnounceText.textContent = db.school.announcementText;
    }
  }
  const navPhone = document.getElementById('navPhone');
  if (navPhone) navPhone.textContent = db.school.phone || '–';

  // CONTACT SECTION
  setText('contactAddress', db.school.address || '–');
  setText('contactPhone', db.school.phone || '–');
  setText('contactEmail', db.school.email || '–');
  setText('contactTimings', db.school.timings || '–');

  // ACADEMICS
  setText('academicsDesc', db.academics.description || 'Our curriculum integrates modern teaching methodologies with time-tested academic practices, ensuring students excel in all areas.');
  setText('classRange', db.academics.classRange ? `Class ${db.academics.classRange}` : 'Class –');
  setText('achievements', db.academics.achievements || '–');

  const featureList = document.getElementById('featureList');
  if (featureList && db.academics.features && db.academics.features.length) {
    featureList.innerHTML = db.academics.features.map(f => `<li>✅ ${f}</li>`).join('');
  }

  // FACILITIES
  renderFacilities(db.facilities);

  // TEAM
  renderTeam(db.team);

  // MEDIA
  renderMedia(db.media);

  // NOTICES
  renderNotices(db.notices);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ===== FACILITIES =====
function renderFacilities(facilities) {
  const grid = document.getElementById('facilitiesGrid');
  if (!grid || !facilities) return;
  grid.innerHTML = facilities.map(f => `
    <div class="facility-item fade-in">
      <span class="facility-icon">${f.icon}</span>
      <span class="fac-label">${f.label}</span>
    </div>
  `).join('');
}

// ===== TEAM =====
function renderTeam(team) {
  const grid = document.getElementById('teamGrid');
  if (!grid) return;
  grid.innerHTML = team.map(member => `
    <div class="team-card fade-in">
      <div class="team-photo-wrap">
        ${member.photo
          ? `<img src="${member.photo}" alt="${member.name || member.role}" class="team-photo" />`
          : `<div class="team-placeholder">👤</div>`
        }
      </div>
      <div class="team-info">
        <div class="team-name">${member.name || '<em style="color:#94a3b8;font-style:italic">Name to be updated</em>'}</div>
        <span class="team-role">${member.role}</span>
        <div class="team-qual">${member.qualification || ''}</div>
      </div>
    </div>
  `).join('');
  // re-trigger scroll observer
  observeElements();
}

// ===== MEDIA =====
function renderMedia(media) {
  const grid = document.getElementById('mediaGrid');
  if (!grid) return;
  if (!media || media.length === 0) {
    grid.innerHTML = `
      <div class="media-empty">
        <div class="media-empty-icon">🖼️</div>
        <p>Media will appear here once uploaded from Admin Panel.</p>
      </div>`;
    return;
  }
  grid.innerHTML = media.map((item, i) => `
    <div class="media-item fade-in" onclick="openLightbox('${item.src}','${item.type || 'image'}')">
      ${item.type === 'video'
        ? `<video src="${item.src}" muted></video>`
        : `<img src="${item.src}" alt="${item.caption || 'School Media'}" />`
      }
      <div class="media-caption">${item.caption || ''}</div>
    </div>
  `).join('');
  observeElements();
}

// ===== NOTICES =====
function renderNotices(notices) {
  const list = document.getElementById('noticeList');
  if (!list) return;
  if (!notices || notices.length === 0) {
    list.innerHTML = `<div class="notice-empty">No notices yet. Admin can add notices from the Admin Panel.</div>`;
    return;
  }
  list.innerHTML = notices.slice().reverse().map(n => `
    <div class="notice-item fade-in">
      <span class="notice-icon">📢</span>
      <div class="notice-text">
        <h4>${n.title}</h4>
        <p>${n.content}</p>
        <div class="notice-date">📅 ${n.date}</div>
      </div>
    </div>
  `).join('');
  observeElements();
}

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const progress = document.getElementById('navProgress');
  const hamburger = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Progress bar
    const scrollable = document.body.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progress) progress.style.width = pct + '%';

    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    let found = false;
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      if (!found && window.scrollY >= top && window.scrollY < bottom) {
        found = true;
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  });

  // Hamburger toggle → mobile drawer
  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }
}

// Close mobile nav (called from HTML onclick)
function closeMobileNav() {
  const mobileDrawer = document.getElementById('mobileDrawer');
  const hamburger = document.getElementById('hamburger');
  if (mobileDrawer) mobileDrawer.classList.remove('open');
  if (hamburger) hamburger.classList.remove('open');
  document.body.style.overflow = '';
}


// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  observeElements();
}

function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in').forEach(el => {
    if (!el.classList.contains('visible')) observer.observe(el);
  });
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = '✅ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

// ===== LIGHTBOX =====
let lightboxEl;
function initLightbox() {
  lightboxEl = document.createElement('div');
  lightboxEl.className = 'lightbox';
  lightboxEl.innerHTML = `
    <button class="lightbox-close" onclick="closeLightbox()">✕</button>
    <div id="lightboxContent"></div>
  `;
  document.body.appendChild(lightboxEl);
  lightboxEl.addEventListener('click', (e) => {
    if (e.target === lightboxEl) closeLightbox();
  });
}

function openLightbox(src, type) {
  const content = document.getElementById('lightboxContent');
  if (!content) return;
  if (type === 'video') {
    content.innerHTML = `<video src="${src}" controls autoplay style="max-width:90vw;max-height:85vh;border-radius:16px;"></video>`;
  } else {
    content.innerHTML = `<img src="${src}" alt="Media" />`;
  }
  lightboxEl.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxEl.classList.remove('open');
  document.body.style.overflow = '';
  const content = document.getElementById('lightboxContent');
  if (content) content.innerHTML = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});
