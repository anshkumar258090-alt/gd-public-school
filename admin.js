// ============================================
//  GD PUBLIC SCHOOL - ADMIN PANEL SCRIPT
// ============================================

// ===== CREDENTIALS (change here to update) =====
const ADMIN_CREDS = { user: 'admin', pass: 'gdps2024' };

// ===== LOGIN =====
function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  const err = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');

  if (u === ADMIN_CREDS.user && p === ADMIN_CREDS.pass) {
    btn.textContent = '✅ Logging in...';
    setTimeout(() => {
      document.getElementById('loginScreen').classList.add('hidden');
      document.getElementById('adminDash').classList.remove('hidden');
      loadAdminData();
    }, 600);
  } else {
    err.textContent = '❌ Invalid username or password.';
    document.getElementById('loginPass').value = '';
    setTimeout(() => { err.textContent = ''; }, 3000);
  }
}

// Enter key support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !document.getElementById('loginScreen').classList.contains('hidden')) {
    doLogin();
  }
});

function doLogout() {
  document.getElementById('adminDash').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
}

// ===== SIDEBAR TOGGLE =====
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ===== TAB SWITCHING =====
function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
  document.getElementById(`content-${tab}`).classList.add('active');
  document.getElementById(`tab-${tab}`).classList.add('active');

  const titles = {
    general: '🏠 General Info',
    stats: '📊 Statistics',
    logo: '🖼️ School Logo',
    team: '👥 Team / Staff',
    academics: '📚 Academics',
    facilities: '🏗️ Facilities',
    media: '📷 Media / Gallery',
    notices: '📢 Notice Board',
  };
  document.getElementById('topbarTitle').textContent = titles[tab] || tab;

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
}

// ===== LOAD ALL DATA INTO ADMIN FORMS =====
function loadAdminData() {
  const db = getDB();

  // General
  setVal('g_address', db.school.address);
  setVal('g_phone', db.school.phone);
  setVal('g_email', db.school.email);
  setVal('g_board', db.school.board);
  setVal('g_type', db.school.type);
  setVal('g_established', db.school.established);
  setVal('g_timings', db.school.timings);

  // Stats
  setVal('s_students', db.stats.students);
  setVal('s_teachers', db.stats.teachers);
  setVal('s_years', db.stats.years);
  setVal('s_classes', db.stats.classes);

  // Logo
  if (db.logo) {
    document.getElementById('logoPreviewImg').src = db.logo;
    document.getElementById('logoPreviewImg').classList.remove('hidden');
    document.getElementById('logoPreviewPlaceholder').classList.add('hidden');
    document.getElementById('removeLogoBtn').style.display = 'inline-flex';
  }

  // Academics
  setVal('ac_description', db.academics.description);
  setVal('ac_classRange', db.academics.classRange);
  setVal('ac_achievements', db.academics.achievements);
  setVal('ac_features', (db.academics.features || []).join('\n'));

  // Team
  renderTeamAdmin(db.team);

  // Facilities
  renderFacilitiesAdmin(db.facilities);

  // Media
  renderMediaAdmin(db.media);

  // Notices
  renderNoticesAdmin(db.notices);
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

// ===== SAVE FUNCTIONS =====

function saveGeneral() {
  const db = getDB();
  db.school.address = getVal('g_address');
  db.school.phone = getVal('g_phone');
  db.school.email = getVal('g_email');
  db.school.board = getVal('g_board');
  db.school.type = getVal('g_type');
  db.school.established = getVal('g_established');
  db.school.timings = getVal('g_timings');
  saveDB(db);
  showMsg('msg-general', '✅ General info saved successfully!');
}

function saveStats() {
  const db = getDB();
  db.stats.students = getVal('s_students');
  db.stats.teachers = getVal('s_teachers');
  db.stats.years = getVal('s_years');
  db.stats.classes = getVal('s_classes');
  saveDB(db);
  showMsg('msg-stats', '✅ Statistics saved successfully!');
}

function saveAcademics() {
  const db = getDB();
  db.academics.description = getVal('ac_description');
  db.academics.classRange = getVal('ac_classRange');
  db.academics.achievements = getVal('ac_achievements');
  const featuresRaw = getVal('ac_features');
  db.academics.features = featuresRaw.split('\n').map(f => f.trim()).filter(Boolean);
  saveDB(db);
  showMsg('msg-academics', '✅ Academics saved successfully!');
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function showMsg(id, msg, isError = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.color = isError ? '#ef4444' : '#10b981';
  setTimeout(() => { el.textContent = ''; }, 3500);
}

// ===== LOGO =====
let tempLogoData = null;

function previewLogo(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showMsg('msg-logo', '❌ File too large. Max size is 5MB.', true);
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    tempLogoData = e.target.result;
    document.getElementById('logoPreviewImg').src = tempLogoData;
    document.getElementById('logoPreviewImg').classList.remove('hidden');
    document.getElementById('logoPreviewPlaceholder').classList.add('hidden');
    document.getElementById('saveLogoBtn').disabled = false;
  };
  reader.readAsDataURL(file);
}

function saveLogo() {
  if (!tempLogoData) return;
  const db = getDB();
  db.logo = tempLogoData;
  saveDB(db);
  tempLogoData = null;
  document.getElementById('saveLogoBtn').disabled = true;
  document.getElementById('removeLogoBtn').style.display = 'inline-flex';
  showMsg('msg-logo', '✅ Logo saved successfully!');
}

function removeLogo() {
  const db = getDB();
  db.logo = '';
  saveDB(db);
  tempLogoData = null;
  document.getElementById('logoPreviewImg').src = '';
  document.getElementById('logoPreviewImg').classList.add('hidden');
  document.getElementById('logoPreviewPlaceholder').classList.remove('hidden');
  document.getElementById('saveLogoBtn').disabled = true;
  showMsg('msg-logo', '✅ Logo removed.');
}

// ===== TEAM =====
let teamData = [];

function renderTeamAdmin(team) {
  teamData = JSON.parse(JSON.stringify(team));
  const grid = document.getElementById('teamAdminGrid');
  if (!grid) return;
  grid.innerHTML = teamData.map((m, i) => `
    <div class="team-admin-card" id="teamCard-${i}">
      <div class="team-admin-card-header">
        <span class="team-card-role">${m.role}</span>
        <button class="btn-icon" onclick="removeTeamMember(${i})" title="Remove">🗑️</button>
      </div>

      <!-- Photo Upload -->
      <div style="text-align:center">
        <div class="team-photo-preview-wrap" onclick="triggerTeamPhoto(${i})">
          ${m.photo
            ? `<img src="${m.photo}" class="team-photo-preview" id="tPhoto-${i}" />`
            : `<span class="team-photo-placeholder-sm" id="tPhoto-${i}">👤</span>`
          }
          <input type="file" accept="image/*" id="tPhotoInput-${i}" class="file-input-hidden"
            onchange="handleTeamPhoto(this, ${i})" />
        </div>
        <small style="color:#94a3b8;font-size:.75rem;margin-top:4px;display:block">Click to upload photo</small>
      </div>

      <div class="input-group">
        <label>Role / Designation</label>
        <input type="text" class="admin-input" id="tRole-${i}" value="${m.role}"
          placeholder="Principal / Director..." oninput="updateTeamField(${i},'role',this.value)" />
      </div>
      <div class="input-group">
        <label>Full Name</label>
        <input type="text" class="admin-input" id="tName-${i}" value="${m.name || ''}"
          placeholder="Name will show on website..."
          oninput="updateTeamField(${i},'name',this.value)" />
      </div>
      <div class="input-group">
        <label>Qualification / Info</label>
        <input type="text" class="admin-input" id="tQual-${i}" value="${m.qualification || ''}"
          placeholder="M.A., B.Ed., 15+ years experience..."
          oninput="updateTeamField(${i},'qualification',this.value)" />
      </div>
    </div>
  `).join('');
}

function triggerTeamPhoto(i) {
  document.getElementById(`tPhotoInput-${i}`).click();
}

function handleTeamPhoto(input, i) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 3 * 1024 * 1024) {
    alert('Photo too large. Max 3MB.');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    teamData[i].photo = e.target.result;
    const wrap = document.querySelector(`#teamCard-${i} .team-photo-preview-wrap`);
    const old = document.getElementById(`tPhoto-${i}`);
    if (old) old.remove();
    const img = document.createElement('img');
    img.src = e.target.result;
    img.className = 'team-photo-preview';
    img.id = `tPhoto-${i}`;
    wrap.insertBefore(img, wrap.firstChild);
  };
  reader.readAsDataURL(file);
}

function updateTeamField(i, field, value) {
  if (teamData[i]) teamData[i][field] = value;
}

function removeTeamMember(i) {
  if (confirm(`Remove this team member?`)) {
    teamData.splice(i, 1);
    renderTeamAdmin(teamData);
  }
}

function addTeamMember() {
  const role = prompt('Enter role/designation for new member (e.g. Administrator):');
  if (!role) return;
  teamData.push({ id: Date.now(), name: '', role: role, qualification: '', photo: '' });
  renderTeamAdmin(teamData);
}

function saveTeam() {
  // Sync all field values before saving
  teamData.forEach((m, i) => {
    m.role = getVal(`tRole-${i}`) || m.role;
    m.name = getVal(`tName-${i}`);
    m.qualification = getVal(`tQual-${i}`);
  });
  const db = getDB();
  db.team = teamData;
  saveDB(db);
  showMsg('msg-team', '✅ Team members saved successfully!');
}

// ===== FACILITIES =====
let facilitiesData = [];

function renderFacilitiesAdmin(facilities) {
  facilitiesData = JSON.parse(JSON.stringify(facilities));
  const list = document.getElementById('facilitiesAdminList');
  if (!list) return;
  list.innerHTML = facilitiesData.map((f, i) => `
    <div class="facility-admin-item">
      <input type="text" class="admin-input fac-icon-input" value="${f.icon}"
        placeholder="📚" id="fIcon-${i}" title="Emoji icon"
        oninput="facilitiesData[${i}].icon=this.value" />
      <input type="text" class="admin-input" value="${f.label}"
        placeholder="Facility name" id="fLabel-${i}"
        oninput="facilitiesData[${i}].label=this.value" />
      <button class="btn-icon" onclick="removeFacility(${i})">🗑️</button>
    </div>
  `).join('');
}

function addFacility() {
  facilitiesData.push({ icon: '🏫', label: 'New Facility' });
  renderFacilitiesAdmin(facilitiesData);
}

function removeFacility(i) {
  facilitiesData.splice(i, 1);
  renderFacilitiesAdmin(facilitiesData);
}

function saveFacilities() {
  // Sync values
  facilitiesData.forEach((f, i) => {
    f.icon = getVal(`fIcon-${i}`) || f.icon;
    f.label = getVal(`fLabel-${i}`) || f.label;
  });
  const db = getDB();
  db.facilities = facilitiesData;
  saveDB(db);
  showMsg('msg-facilities', '✅ Facilities saved!');
}

// ===== MEDIA =====
let mediaData = [];

function renderMediaAdmin(media) {
  mediaData = JSON.parse(JSON.stringify(media || []));
  const grid = document.getElementById('mediaAdminGrid');
  if (!grid) return;
  if (!mediaData.length) {
    grid.innerHTML = '<p style="color:#94a3b8;text-align:center;padding:24px;">No media uploaded yet.</p>';
    return;
  }
  grid.innerHTML = mediaData.map((item, i) => `
    <div class="media-admin-item">
      ${item.type === 'video'
        ? `<video src="${item.src}" muted></video>`
        : `<img src="${item.src}" alt="media" />`
      }
      <div class="media-admin-actions">
        <input type="text" class="media-caption-input" value="${item.caption || ''}"
          placeholder="Caption (optional)" id="mCap-${i}"
          oninput="mediaData[${i}].caption=this.value" />
        <button class="btn-icon" onclick="removeMedia(${i})" title="Delete">🗑️</button>
      </div>
    </div>
  `).join('');
}

function handleMediaUpload(input) {
  const files = Array.from(input.files);
  let loaded = 0;
  files.forEach(file => {
    if (file.size > 10 * 1024 * 1024) {
      alert(`${file.name} is too large. Max 10MB per file.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const type = file.type.startsWith('video') ? 'video' : 'image';
      mediaData.push({ src: e.target.result, type, caption: '' });
      loaded++;
      if (loaded === files.length) {
        saveMediaAndRender();
      }
    };
    reader.readAsDataURL(file);
  });
}

function removeMedia(i) {
  mediaData.splice(i, 1);
  saveMediaAndRender();
}

function saveMediaAndRender() {
  // Sync captions
  mediaData.forEach((m, i) => {
    const capEl = document.getElementById(`mCap-${i}`);
    if (capEl) m.caption = capEl.value;
  });
  const db = getDB();
  db.media = mediaData;
  saveDB(db);
  renderMediaAdmin(mediaData);
  showMsg('msg-media', '✅ Media saved!');
}

// ===== NOTICES =====
function renderNoticesAdmin(notices) {
  const list = document.getElementById('noticesAdminList');
  if (!list) return;
  if (!notices || !notices.length) {
    list.innerHTML = '<p style="color:#94a3b8;padding:16px;">No notices added yet.</p>';
    return;
  }
  list.innerHTML = notices.slice().reverse().map((n, ri) => {
    const i = notices.length - 1 - ri;
    return `
      <div class="notice-admin-item">
        <div class="notice-admin-info">
          <h4>${n.title}</h4>
          <p>${n.content}</p>
          <div class="ndate">📅 ${n.date}</div>
        </div>
        <button class="btn-icon" onclick="removeNotice(${i})">🗑️</button>
      </div>
    `;
  }).join('');
}

function addNotice() {
  const title = getVal('n_title');
  const content = getVal('n_content');
  const date = getVal('n_date');

  if (!title || !content) {
    showMsg('msg-notices', '❌ Please fill in title and content.', true);
    return;
  }

  const db = getDB();
  db.notices = db.notices || [];
  db.notices.push({ title, content, date: date || new Date().toLocaleDateString('en-IN') });
  saveDB(db);

  // Clear form
  setVal('n_title', '');
  setVal('n_content', '');
  setVal('n_date', '');

  renderNoticesAdmin(db.notices);
  showMsg('msg-notices', '✅ Notice added!');
}

function removeNotice(i) {
  if (!confirm('Remove this notice?')) return;
  const db = getDB();
  db.notices.splice(i, 1);
  saveDB(db);
  renderNoticesAdmin(db.notices);
  showMsg('msg-notices', '✅ Notice removed.');
}
