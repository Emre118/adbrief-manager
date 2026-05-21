const API_BASE = '/api';

let token = localStorage.getItem('adbrief_token');
let currentUser = JSON.parse(localStorage.getItem('adbrief_user') || 'null');
let currentBriefs = [];

const elements = {
  authSection: document.getElementById('authSection'),
  dashboardSection: document.getElementById('dashboardSection'),
  logoutButton: document.getElementById('logoutButton'),
  showLogin: document.getElementById('showLogin'),
  showRegister: document.getElementById('showRegister'),
  loginForm: document.getElementById('loginForm'),
  registerForm: document.getElementById('registerForm'),
  welcomeText: document.getElementById('welcomeText'),
  summaryCards: document.getElementById('summaryCards'),
  briefForm: document.getElementById('briefForm'),
  formTitle: document.getElementById('formTitle'),
  editingBriefId: document.getElementById('editingBriefId'),
  saveBriefButton: document.getElementById('saveBriefButton'),
  cancelEditButton: document.getElementById('cancelEditButton'),
  briefList: document.getElementById('briefList'),
  searchInput: document.getElementById('searchInput'),
  statusFilter: document.getElementById('statusFilter'),
  platformFilter: document.getElementById('platformFilter'),
  priorityFilter: document.getElementById('priorityFilter'),
  toast: document.getElementById('toast')
};

function init() {
  bindEvents();

  if (token && currentUser) {
    showDashboard();
    loadDashboard();
  } else {
    showAuth();
  }
}

function bindEvents() {
  elements.showLogin.addEventListener('click', () => switchAuthTab('login'));
  elements.showRegister.addEventListener('click', () => switchAuthTab('register'));
  elements.loginForm.addEventListener('submit', handleLogin);
  elements.registerForm.addEventListener('submit', handleRegister);
  elements.logoutButton.addEventListener('click', logout);
  elements.briefForm.addEventListener('submit', handleBriefSubmit);
  elements.cancelEditButton.addEventListener('click', resetBriefForm);

  elements.searchInput.addEventListener('input', debounce(loadBriefs, 300));
  elements.statusFilter.addEventListener('change', loadBriefs);
  elements.platformFilter.addEventListener('change', loadBriefs);
  elements.priorityFilter.addEventListener('change', loadBriefs);
}

function switchAuthTab(tab) {
  const showLogin = tab === 'login';

  elements.showLogin.classList.toggle('active', showLogin);
  elements.showRegister.classList.toggle('active', !showLogin);
  elements.loginForm.classList.toggle('hidden', !showLogin);
  elements.registerForm.classList.toggle('hidden', showLogin);
}

function showAuth() {
  elements.authSection.classList.remove('hidden');
  elements.dashboardSection.classList.add('hidden');
  elements.logoutButton.classList.add('hidden');
}

function showDashboard() {
  elements.authSection.classList.add('hidden');
  elements.dashboardSection.classList.remove('hidden');
  elements.logoutButton.classList.remove('hidden');
  elements.welcomeText.textContent = `Welcome, ${currentUser.name}`;
}

async function handleLogin(event) {
  event.preventDefault();

  const payload = {
    email: document.getElementById('loginEmail').value,
    password: document.getElementById('loginPassword').value
  };

  try {
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    setSession(result);
    showDashboard();
    await loadDashboard();
    showToast('Login successful.');
  } catch (error) {
    showToast(error.message);
  }
}

async function handleRegister(event) {
  event.preventDefault();

  const payload = {
    name: document.getElementById('registerName').value,
    email: document.getElementById('registerEmail').value,
    password: document.getElementById('registerPassword').value
  };

  try {
    const result = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    setSession(result);
    showDashboard();
    await loadDashboard();
    showToast('Account created successfully.');
  } catch (error) {
    showToast(error.message);
  }
}

function setSession(result) {
  token = result.token;
  currentUser = result.user;
  localStorage.setItem('adbrief_token', token);
  localStorage.setItem('adbrief_user', JSON.stringify(currentUser));
}

function logout() {
  token = null;
  currentUser = null;
  currentBriefs = [];
  localStorage.removeItem('adbrief_token');
  localStorage.removeItem('adbrief_user');
  resetBriefForm();
  showAuth();
  showToast('Logged out.');
}

async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detailMessage = data.details ? ` ${Object.values(data.details).join(' ')}` : '';
    throw new Error(`${data.message || 'Request failed.'}${detailMessage}`);
  }

  return data;
}

async function loadDashboard() {
  await Promise.all([loadSummary(), loadBriefs()]);
}

async function loadSummary() {
  try {
    const { summary } = await apiRequest('/briefs/summary');
    renderSummary(summary);
  } catch (error) {
    showToast(error.message);
  }
}

function renderSummary(summary) {
  const cards = [
    ['Total', summary.total],
    ['Total Budget', formatNumber(summary.totalBudget)],
    ['High Priority', summary.highPriorityCount],
    ['Next Deadline', summary.nearestDeadline || 'None'],
    ['Draft', summary.byStatus.Draft],
    ['In Progress', summary.byStatus['In Progress']],
    ['Ready', summary.byStatus.Ready],
    ['Published', summary.byStatus.Published],
    ['Archived', summary.byStatus.Archived]
  ];

  elements.summaryCards.innerHTML = cards.map(([label, value]) => `
    <div class="summary-card">
      <strong>${escapeHtml(value)}</strong>
      <span>${escapeHtml(label)}</span>
    </div>
  `).join('');
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

async function loadBriefs() {
  try {
    const params = new URLSearchParams();

    if (elements.searchInput.value.trim()) params.set('search', elements.searchInput.value.trim());
    if (elements.statusFilter.value) params.set('status', elements.statusFilter.value);
    if (elements.platformFilter.value) params.set('platform', elements.platformFilter.value);
    if (elements.priorityFilter.value) params.set('priority', elements.priorityFilter.value);

    const query = params.toString() ? `?${params.toString()}` : '';
    const { briefs } = await apiRequest(`/briefs${query}`);

    currentBriefs = briefs;
    renderBriefList(briefs);
  } catch (error) {
    showToast(error.message);
  }
}

function renderBriefList(briefs) {
  if (!briefs.length) {
    elements.briefList.innerHTML = `
      <div class="empty-state">
        No campaign briefs found. Create your first brief or change the filters.
      </div>
    `;
    return;
  }

  elements.briefList.innerHTML = briefs.map((brief) => `
    <article class="brief-card">
      <div class="brief-card-header">
        <div>
          <h3>${escapeHtml(brief.title)}</h3>
          <p><strong>Brand:</strong> ${escapeHtml(brief.brandName)}</p>
        </div>
        <span class="badge">${escapeHtml(brief.status)}</span>
      </div>

      <div class="badges">
        <span class="badge">${escapeHtml(brief.platform)}</span>
        <span class="badge">${escapeHtml(brief.objective)}</span>
        <span class="badge">${escapeHtml(brief.priority)}</span>
        <span class="badge">Budget: ${Number(brief.budget).toLocaleString()}</span>
      </div>

      <p><strong>Deadline:</strong> ${escapeHtml(brief.deadline)}</p>
      ${brief.startDate ? `<p><strong>Start:</strong> ${escapeHtml(brief.startDate)}</p>` : ''}
      ${brief.targetAudience ? `<p><strong>Audience:</strong> ${escapeHtml(brief.targetAudience)}</p>` : ''}
      ${brief.notes ? `<p><strong>Notes:</strong> ${escapeHtml(brief.notes)}</p>` : ''}

      <div class="brief-actions">
        <button type="button" onclick="editBrief(${brief.id})">Edit</button>
        <button type="button" class="secondary" onclick="deleteBrief(${brief.id})">Delete</button>
      </div>
    </article>
  `).join('');
}

async function handleBriefSubmit(event) {
  event.preventDefault();

  const payload = collectBriefFormData();
  const validationError = validateBriefFormData(payload);

  if (validationError) {
    showToast(validationError);
    return;
  }

  const editingId = elements.editingBriefId.value;
  const isEditing = Boolean(editingId);

  try {
    await apiRequest(isEditing ? `/briefs/${editingId}` : '/briefs', {
      method: isEditing ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });

    resetBriefForm();
    await loadDashboard();
    showToast(isEditing ? 'Campaign brief updated.' : 'Campaign brief created.');
  } catch (error) {
    showToast(error.message);
  }
}

function collectBriefFormData() {
  return {
    title: document.getElementById('title').value,
    brandName: document.getElementById('brandName').value,
    platform: document.getElementById('platform').value,
    objective: document.getElementById('objective').value,
    budget: Number(document.getElementById('budget').value),
    startDate: document.getElementById('startDate').value || null,
    deadline: document.getElementById('deadline').value,
    targetAudience: document.getElementById('targetAudience').value,
    priority: document.getElementById('priority').value,
    status: document.getElementById('status').value,
    notes: document.getElementById('notes').value
  };
}

function validateBriefFormData(data) {
  if (data.title.trim().length < 3) return 'Title must be at least 3 characters long.';
  if (data.brandName.trim().length < 2) return 'Brand name must be at least 2 characters long.';
  if (!data.deadline) return 'Deadline is required.';
  if (!Number.isFinite(data.budget) || data.budget <= 0) return 'Budget must be a positive number.';

  if (data.startDate && data.deadline && new Date(data.deadline) < new Date(data.startDate)) {
    return 'Deadline cannot be earlier than start date.';
  }

  return null;
}

function editBrief(id) {
  const brief = currentBriefs.find((item) => item.id === id);

  if (!brief) {
    showToast('Brief could not be found in the current list.');
    return;
  }

  elements.editingBriefId.value = brief.id;
  elements.formTitle.textContent = 'Edit Campaign Brief';
  elements.saveBriefButton.textContent = 'Update Brief';
  elements.cancelEditButton.classList.remove('hidden');

  document.getElementById('title').value = brief.title;
  document.getElementById('brandName').value = brief.brandName;
  document.getElementById('platform').value = brief.platform;
  document.getElementById('objective').value = brief.objective;
  document.getElementById('budget').value = brief.budget;
  document.getElementById('startDate').value = brief.startDate || '';
  document.getElementById('deadline').value = brief.deadline;
  document.getElementById('targetAudience').value = brief.targetAudience || '';
  document.getElementById('priority').value = brief.priority;
  document.getElementById('status').value = brief.status;
  document.getElementById('notes').value = brief.notes || '';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteBrief(id) {
  const confirmed = window.confirm('Are you sure you want to delete this campaign brief?');

  if (!confirmed) return;

  try {
    await apiRequest(`/briefs/${id}`, { method: 'DELETE' });
    await loadDashboard();
    showToast('Campaign brief deleted.');
  } catch (error) {
    showToast(error.message);
  }
}

function resetBriefForm() {
  elements.briefForm.reset();
  elements.editingBriefId.value = '';
  elements.formTitle.textContent = 'Create Campaign Brief';
  elements.saveBriefButton.textContent = 'Save Brief';
  elements.cancelEditButton.classList.add('hidden');
  document.getElementById('priority').value = 'Medium';
  document.getElementById('status').value = 'Draft';
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.remove('hidden');

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    elements.toast.classList.add('hidden');
  }, 3500);
}

function debounce(fn, delay) {
  let timeoutId;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

window.editBrief = editBrief;
window.deleteBrief = deleteBrief;

init();
