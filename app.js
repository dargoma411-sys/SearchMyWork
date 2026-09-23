// ============ STATE ============
let currentPage = 'jobs';
let currentLang = localStorage.getItem('language') || 'ru';
let jobsCache = [];
let profilesCache = [];
let activeChatJobId = null;
let currentUser = JSON.parse(localStorage.getItem('smw_user') || 'null');

// ============ HARDCODED JOBS (публикует только владелец) ============
const HARDCODED_JOBS = [
  {
    id: 1,
    title: 'Frontend-разработчик (React)',
    company: 'Morvexx Digital',
    category: 'it',
    location: 'Москва / Удалённо',
    employment_type: 'remote',
    salary_min: 150000,
    salary_max: 220000,
    description: 'Разработка интерфейсов для крупной SaaS-платформы. Работа в команде из 8 инженеров, современный стек, код-ревью, CI/CD.',
    requirements: '3+ года опыта с React, уверенное знание TypeScript, Redux/Zustand, опыт работы с REST и GraphQL.',
    benefits: 'Удалённая работа, гибкий график, ДМС, компенсация обучения, техника от компании.',
    contact_email: 'Work@Morvexx.ru',
    contact_phone: '+7 999 999 99 99',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 2,
    title: 'UI/UX дизайнер',
    company: 'Morvexx Digital',
    category: 'design',
    location: 'Санкт-Петербург',
    employment_type: 'fulltime',
    salary_min: 120000,
    salary_max: 180000,
    description: 'Проектирование интерфейсов мобильных и веб-приложений. Работа в тесной связке с продукт-менеджером и разработчиками.',
    requirements: 'Портфолио с кейсами, опыт в Figma, понимание принципов юзабилити и дизайн-систем.',
    benefits: 'Офис в центре, ДМС, оплата конференций, современное оборудование.',
    contact_email: 'Work@Morvexx.ru',
    contact_phone: '+7 999 999 99 99',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: 3,
    title: 'Backend-разработчик (Node.js)',
    company: 'Morvexx Digital',
    category: 'it',
    location: 'Удалённо',
    employment_type: 'remote',
    salary_min: 180000,
    salary_max: 260000,
    description: 'Разработка микросервисов для платёжной системы. Высокая нагрузка, интересные задачи, сильная команда.',
    requirements: 'Опыт с Node.js от 4 лет, PostgreSQL, Redis, Docker, понимание принципов построения микросервисов.',
    benefits: 'Полностью удалённо, оплачиваемый отпуск, бонусы по итогам года.',
    contact_email: 'Work@Morvexx.ru',
    contact_phone: '+7 999 999 99 99',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    id: 4,
    title: 'Интернет-маркетолог',
    company: 'Morvexx Digital',
    category: 'marketing',
    location: 'Москва',
    employment_type: 'fulltime',
    salary_min: 90000,
    salary_max: 140000,
    description: 'Ведение кампаний в Яндекс.Директ и Google Ads, аналитика, работа с воронкой, A/B-тесты.',
    requirements: 'Опыт от 2 лет, знание метрик, уверенная работа с аналитикой, портфолио кампаний.',
    benefits: 'Офис рядом с метро, ДМС, обучение за счёт компании.',
    contact_email: 'Work@Morvexx.ru',
    contact_phone: '+7 999 999 99 99',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    id: 5,
    title: 'Менеджер по продажам B2B',
    company: 'Morvexx Digital',
    category: 'sales',
    location: 'Екатеринбург',
    employment_type: 'fulltime',
    salary_min: 70000,
    salary_max: 150000,
    description: 'Работа с корпоративными клиентами, полный цикл сделки, развитие базы, участие в тендерах.',
    requirements: 'Опыт в B2B-продажах от 1 года, грамотная речь, умение вести переговоры.',
    benefits: 'Оклад + процент, обучение, карьерный рост, корпоративная связь.',
    contact_email: 'Work@Morvexx.ru',
    contact_phone: '+7 999 999 99 99',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 6,
    title: 'Финансовый аналитик',
    company: 'Morvexx Digital',
    category: 'finance',
    location: 'Москва',
    employment_type: 'fulltime',
    salary_min: 130000,
    salary_max: 190000,
    description: 'Финансовое моделирование, бюджетирование, подготовка отчётности для руководства.',
    requirements: 'Высшее экономическое, Excel на продвинутом уровне, опыт работы с BI-инструментами.',
    benefits: 'ДМС, годовые бонусы, гибридный формат работы.',
    contact_email: 'Work@Morvexx.ru',
    contact_phone: '+7 999 999 99 99',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString()
  }
];

// ============ HARDCODED PROFILES ============
const HARDCODED_PROFILES = [
  {
    id: 1,
    name: 'Алексей Иванов',
    desired_position: 'Senior Frontend Developer',
    city: 'Москва',
    experience_years: 6,
    expected_salary: 250000,
    skills: 'React, TypeScript, Next.js, Redux, GraphQL',
    about: 'Разрабатываю сложные веб-приложения более 6 лет. Люблю чистый код, менторство и оптимизацию производительности.',
    portfolio_url: 'https://github.com/alexivanov',
    email: 'alex.ivanov@example.com',
    phone: '+7 900 111 22 33',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 2,
    name: 'Мария Петрова',
    desired_position: 'UI/UX Designer',
    city: 'Санкт-Петербург',
    experience_years: 4,
    expected_salary: 160000,
    skills: 'Figma, Sketch, Prototyping, User Research, Design System',
    about: 'Создаю интерфейсы, которые любят пользователи. Работала над 20+ проектами в финтехе и e-commerce.',
    portfolio_url: 'https://behance.net/mariapetrova',
    email: 'maria.p@example.com',
    phone: '+7 900 222 33 44',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 3,
    name: 'Дмитрий Соколов',
    desired_position: 'Backend Developer (Node.js)',
    city: 'Удалённо',
    experience_years: 5,
    expected_salary: 230000,
    skills: 'Node.js, NestJS, PostgreSQL, Docker, Kubernetes, AWS',
    about: 'Проектирую высоконагруженные системы. Опыт миграции монолита в микросервисы.',
    portfolio_url: 'https://github.com/dsokolov',
    email: 'd.sokolov@example.com',
    phone: '+7 900 333 44 55',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: 4,
    name: 'Екатерина Новикова',
    desired_position: 'Product Manager',
    city: 'Москва',
    experience_years: 7,
    expected_salary: 280000,
    skills: 'Product Strategy, Analytics, A/B Testing, Roadmap, Agile',
    about: 'Запустила 3 продукта с нуля до миллиона пользователей. Умею работать с данными и командами.',
    portfolio_url: '',
    email: 'e.novikova@example.com',
    phone: '+7 900 444 55 66',
    created_at: new Date(Date.now() - 9 * 86400000).toISOString()
  },
  {
    id: 5,
    name: 'Артём Кузнецов',
    desired_position: 'DevOps Engineer',
    city: 'Казань',
    experience_years: 5,
    expected_salary: 220000,
    skills: 'Docker, Kubernetes, CI/CD, Terraform, Prometheus, Linux',
    about: 'Автоматизирую всё, что можно автоматизировать. Строю надёжную инфраструктуру для команд разработки.',
    portfolio_url: 'https://github.com/akuznetsov',
    email: 'a.kuznetsov@example.com',
    phone: '+7 900 555 66 77',
    created_at: new Date(Date.now() - 11 * 86400000).toISOString()
  },
  {
    id: 6,
    name: 'Ольга Морозова',
    desired_position: 'Data Analyst',
    city: 'Новосибирск',
    experience_years: 3,
    expected_salary: 130000,
    skills: 'SQL, Python, Tableau, Power BI, Statistics',
    about: 'Превращаю данные в решения. Опыт в продуктовой и маркетинговой аналитике.',
    portfolio_url: '',
    email: 'o.morozova@example.com',
    phone: '+7 900 666 77 88',
    created_at: new Date(Date.now() - 13 * 86400000).toISOString()
  }
];

// ============ TRANSLATIONS ============
const translations = {
  ru: {
    search_placeholder: 'Поиск по названию...',
    all_categories: 'Все категории',
    location: 'Локация',
    employment_type: 'Тип занятости',
    salary_from: 'Зарплата от',
    newest: 'Сначала новые',
    salary_desc: 'Зарплата ↓',
    salary_asc: 'Зарплата ↑',
    no_jobs: 'Вакансии не найдены',
    no_profiles: 'Профили не найдены',
    create_profile: 'Сохранить анкету',
    back_to_list: '← Назад к списку'
  },
  en: {
    search_placeholder: 'Search by title...',
    all_categories: 'All categories',
    location: 'Location',
    employment_type: 'Employment type',
    salary_from: 'Salary from',
    newest: 'Newest first',
    salary_desc: 'Salary ↓',
    salary_asc: 'Salary ↑',
    no_jobs: 'No jobs found',
    no_profiles: 'No profiles found',
    create_profile: 'Save profile',
    back_to_list: '← Back to list'
  }
};

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderThemeIcon();
  applyTranslations();
  setupEventListeners();
  loadJobs();
  loadProfiles();
  renderChatJobList();
  restoreUser();
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ============ THEME ============
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function renderThemeIcon() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.innerHTML = `
    <svg class="icon-moon" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
    <svg class="icon-sun" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8" fill="currentColor" stroke="none"/>
    </svg>
  `;
}

// ============ TRANSLATIONS APPLY ============
function applyTranslations() {
  const t = translations[currentLang];
  const searchInput = document.querySelector('#search-input');
  if (searchInput) searchInput.placeholder = t.search_placeholder;
  const locInput = document.querySelector('#location-filter');
  if (locInput) locInput.placeholder = t.location;
  const salInput = document.querySelector('#salary-min');
  if (salInput) salInput.placeholder = t.salary_from;
  const catSelect = document.querySelector('#category-filter');
  if (catSelect && catSelect.options[0]) catSelect.options[0].textContent = t.all_categories;
  const empSelect = document.querySelector('#employment-type');
  if (empSelect && empSelect.options[0]) empSelect.options[0].textContent = t.employment_type;
  const sortSelect = document.querySelector('#sort-by');
  if (sortSelect) {
    sortSelect.options[0].textContent = t.newest;
    sortSelect.options[1].textContent = t.salary_desc;
    sortSelect.options[2].textContent = t.salary_asc;
  }
}

// ============ EVENT LISTENERS ============
function setupEventListeners() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.page));
  });

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.value = currentLang;
    langSelect.addEventListener('change', (e) => {
      currentLang = e.target.value;
      localStorage.setItem('language', currentLang);
      applyTranslations();
      renderJobs(jobsCache);
      renderProfiles(profilesCache);
    });
  }

  ['search-input', 'category-filter', 'location-filter', 'employment-type', 'salary-min', 'sort-by'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', filterJobs);
  });

  const profSearch = document.getElementById('profile-search');
  if (profSearch) profSearch.addEventListener('input', filterProfiles);

  const profileForm = document.getElementById('profile-form');
  if (profileForm) profileForm.addEventListener('submit', handleProfileSubmit);

  const backJobs = document.getElementById('back-to-jobs');
  if (backJobs) backJobs.addEventListener('click', () => navigateTo('jobs'));

  const backProf = document.getElementById('back-to-profiles');
  if (backProf) backProf.addEventListener('click', () => navigateTo('profiles'));

  const chatSend = document.getElementById('chat-send');
  if (chatSend) chatSend.addEventListener('click', sendChatMessage);

  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }
}

function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) targetPage.classList.add('active');

  const targetBtn = document.querySelector(`[data-page="${pageId}"]`);
  if (targetBtn) targetBtn.classList.add('active');

  currentPage = pageId;

  if (pageId === 'chat') updateChatUI();
}

// ============ DATA LOADING ============
function loadJobs() {
  jobsCache = [...HARDCODED_JOBS];
  renderJobs(jobsCache);
}

function loadProfiles() {
  const saved = JSON.parse(localStorage.getItem('smw_profiles') || '[]');
  profilesCache = [...saved, ...HARDCODED_PROFILES];
  renderProfiles(profilesCache);
}

// ============ RENDERING ============
function renderJobs(jobs) {
  const container = document.getElementById('jobs-list');
  if (!container) return;

  if (!jobs.length) {
    showEmptyState(container.id, translations[currentLang].no_jobs);
    return;
  }

  container.innerHTML = jobs.map(job => `
    <div class="card" onclick="showJobDetail(${job.id})">
      <h3 class="card-title">${escapeHtml(job.title)}</h3>
      <p class="card-company">${escapeHtml(job.company)} • ${escapeHtml(job.location)}</p>
      <div class="card-meta">
        <span class="badge category">${getCategoryLabel(job.category)}</span>
        <span class="badge">${getEmploymentLabel(job.employment_type)}</span>
        ${job.salary_min ? `<span class="badge salary">${formatSalary(job.salary_min)}${job.salary_max ? '-' + formatSalary(job.salary_max) : ''}</span>` : ''}
      </div>
      <p class="card-description">${escapeHtml(job.description)}</p>
      <div class="card-footer">
        <span>${formatDate(job.created_at)}</span>
        <span>Подробнее →</span>
      </div>
    </div>
  `).join('');
}

function renderProfiles(profiles) {
  const container = document.getElementById('profiles-list');
  if (!container) return;

  if (!profiles.length) {
    showEmptyState(container.id, translations[currentLang].no_profiles);
    return;
  }

  container.innerHTML = profiles.map(profile => `
    <div class="card" onclick="showProfileDetail(${profile.id})">
      <div class="profile-avatar">${getInitials(profile.name)}</div>
      <h3 class="card-title">${escapeHtml(profile.name)}</h3>
      <p class="card-company">${escapeHtml(profile.desired_position)} • ${escapeHtml(profile.city)}</p>
      <div class="skills-tags">
        ${(profile.skills || '').split(',').slice(0, 5).map(skill => 
          `<span class="skill-tag">${escapeHtml(skill.trim())}</span>`
        ).join('')}
      </div>
      <p class="card-description">${escapeHtml(profile.about)}</p>
      <div class="card-footer">
        <span>${profile.experience_years ? `${profile.experience_years} лет опыта` : ''}</span>
        <span>Профиль →</span>
      </div>
    </div>
  `).join('');
}

function showEmptyState(containerId, message) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <p>${message}</p>
    </div>
  `;
}

// ============ FILTERING ============
function filterJobs() {
  let filtered = [...jobsCache];

  const search = document.getElementById('search-input').value.toLowerCase();
  const category = document.getElementById('category-filter').value;
  const location = document.getElementById('location-filter').value.toLowerCase();
  const employmentType = document.getElementById('employment-type').value;
  const salaryMin = parseInt(document.getElementById('salary-min').value) || 0;
  const sortBy = document.getElementById('sort-by').value;

  if (search) {
    filtered = filtered.filter(job => 
      job.title.toLowerCase().includes(search) || 
      job.company.toLowerCase().includes(search)
    );
  }
  if (category) filtered = filtered.filter(job => job.category === category);
  if (location) filtered = filtered.filter(job => job.location.toLowerCase().includes(location));
  if (employmentType) filtered = filtered.filter(job => job.employment_type === employmentType);
  if (salaryMin > 0) filtered = filtered.filter(job => job.salary_min >= salaryMin);

  if (sortBy === 'salary-desc') {
    filtered.sort((a, b) => (b.salary_min || 0) - (a.salary_min || 0));
  } else if (sortBy === 'salary-asc') {
    filtered.sort((a, b) => (a.salary_min || 0) - (b.salary_min || 0));
  } else {
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  renderJobs(filtered);
}

function filterProfiles() {
  const search = document.getElementById('profile-search').value.toLowerCase();
  let filtered = [...profilesCache];

  if (search) {
    filtered = filtered.filter(profile => 
      profile.name.toLowerCase().includes(search) || 
      (profile.skills && profile.skills.toLowerCase().includes(search)) ||
      profile.desired_position.toLowerCase().includes(search)
    );
  }

  renderProfiles(filtered);
}

// ============ PROFILE FORM (анкета) ============
function handleProfileSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const profileData = Object.fromEntries(formData.entries());

  profileData.expected_salary = profileData.expected_salary ? parseInt(profileData.expected_salary) : null;
  profileData.experience_years = profileData.experience_years ? parseInt(profileData.experience_years) : null;

  const saved = JSON.parse(localStorage.getItem('smw_profiles') || '[]');
  profileData.id = Date.now();
  profileData.created_at = new Date().toISOString();
  saved.unshift(profileData);
  localStorage.setItem('smw_profiles', JSON.stringify(saved));

  // Сохраняем текущего пользователя для чата
  currentUser = {
    name: profileData.name,
    email: profileData.email,
    position: profileData.desired_position
  };
  localStorage.setItem('smw_user', JSON.stringify(currentUser));

  alert(currentLang === 'ru' ? 'Анкета сохранена! Теперь вам доступен чат.' : 'Profile saved! Chat is now available.');
  e.target.reset();
  loadProfiles();
  updateChatUI();
  navigateTo('profiles');
}

// ============ CHAT ============
function restoreUser() {
  if (currentUser) updateChatUI();
}

function getChatMessages(jobId) {
  const all = JSON.parse(localStorage.getItem('smw_chat') || '{}');
  return all[jobId] || [];
}

function saveChatMessage(jobId, msg) {
  const all = JSON.parse(localStorage.getItem('smw_chat') || '{}');
  if (!all[jobId]) all[jobId] = [];
  all[jobId].push(msg);
  localStorage.setItem('smw_chat', JSON.stringify(all));
}

function renderChatJobList() {
  const container = document.getElementById('chat-job-list');
  if (!container) return;
  container.innerHTML = jobsCache.map(job => `
    <div class="chat-job-item" data-job-id="${job.id}" onclick="selectChatJob(${job.id})">
      ${escapeHtml(job.title)}<br><small style="opacity:0.7">${escapeHtml(job.company)}</small>
    </div>
  `).join('');
}

window.selectChatJob = function(jobId) {
  activeChatJobId = jobId;
  document.querySelectorAll('.chat-job-item').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.jobId) === jobId);
  });
  updateChatUI();
};

function updateChatUI() {
  const header = document.getElementById('chat-header');
  const messages = document.getElementById('chat-messages');
  const input = document.getElementById('chat-input');
  const send = document.getElementById('chat-send');
  const hint = document.getElementById('chat-hint');

  if (!header || !messages) return;

  if (!currentUser) {
    header.textContent = 'Заполните анкету';
    messages.innerHTML = `<div class="chat-empty">Чтобы писать в чат, сначала заполните <b>Анкету</b> во вкладке выше.</div>`;
    if (input) input.disabled = true;
    if (send) send.disabled = true;
    if (hint) hint.textContent = '';
    return;
  }

  if (!activeChatJobId) {
    header.textContent = 'Выберите вакансию';
    messages.innerHTML = `<div class="chat-empty">Выберите вакансию слева, чтобы начать переписку.</div>`;
    if (input) input.disabled = true;
    if (send) send.disabled = true;
    if (hint) hint.textContent = `Вы вошли как ${currentUser.name}`;
    return;
  }

  const job = jobsCache.find(j => j.id === activeChatJobId);
  if (job) header.textContent = `${job.title} — ${job.company}`;
  if (hint) hint.textContent = `Вы вошли как ${currentUser.name} (${currentUser.email})`;

  if (input) input.disabled = false;
  if (send) send.disabled = false;

  const msgs = getChatMessages(activeChatJobId);
  if (!msgs.length) {
    messages.innerHTML = `<div class="chat-empty">Сообщений пока нет. Напишите первым!</div>`;
  } else {
    messages.innerHTML = msgs.map(m => `
      <div class="chat-msg ${m.author === currentUser.email ? 'me' : 'other'}">
        ${escapeHtml(m.text)}
        <span class="meta">${escapeHtml(m.authorName)} • ${formatTime(m.time)}</span>
      </div>
    `).join('');
    messages.scrollTop = messages.scrollHeight;
  }
}

function sendChatMessage() {
  if (!currentUser) return;
  if (!activeChatJobId) return;
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  const msg = {
    author: currentUser.email,
    authorName: currentUser.name,
    text: text,
    time: new Date().toISOString()
  };
  saveChatMessage(activeChatJobId, msg);
  input.value = '';
  updateChatUI();
}

// ============ DETAIL VIEWS ============
window.showJobDetail = function(jobId) {
  const job = jobsCache.find(j => j.id === jobId);
  if (!job) return;

  const content = document.getElementById('job-detail-content');
  if (!content) return;

  content.innerHTML = `
    <div class="detail-header">
      <h1 class="detail-title">${escapeHtml(job.title)}</h1>
      <p class="detail-subtitle">${escapeHtml(job.company)} • ${escapeHtml(job.location)}</p>
    </div>
    <div class="detail-section">
      <h3>Заработная плата</h3>
      <p>${job.salary_min ? formatSalary(job.salary_min) + (job.salary_max ? ' – ' + formatSalary(job.salary_max) : '') : 'Не указана'}</p>
    </div>
    <div class="detail-section">
      <h3>Тип занятости</h3>
      <p>${getEmploymentLabel(job.employment_type)}</p>
    </div>
    <div class="detail-section">
      <h3>Описание</h3>
      <p>${escapeHtml(job.description)}</p>
    </div>
    ${job.requirements ? `
    <div class="detail-section">
      <h3>Требования</h3>
      <p>${escapeHtml(job.requirements)}</p>
    </div>` : ''}
    ${job.benefits ? `
    <div class="detail-section">
      <h3>Условия работы</h3>
      <p>${escapeHtml(job.benefits)}</p>
    </div>` : ''}
    <div class="contact-info">
      <h3>Контакты для связи</h3>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(job.contact_email)}">${escapeHtml(job.contact_email)}</a></p>
      ${job.contact_phone ? `<p><strong>Телефон:</strong> <a href="tel:${escapeHtml(job.contact_phone)}">${escapeHtml(job.contact_phone)}</a></p>` : ''}
    </div>
    <button class="btn-primary" style="margin-top:24px;" onclick="openChatForJob(${job.id})">Написать в чат</button>
    <p style="margin-top: 24px; font-size: 12px; color: var(--muted);">
      Опубликовано: ${formatDate(job.created_at)}
    </p>
  `;

  navigateTo('job-detail');
};

window.showProfileDetail = function(profileId) {
  const profile = profilesCache.find(p => p.id === profileId);
  if (!profile) return;

  const content = document.getElementById('profile-detail-content');
  if (!content) return;

  content.innerHTML = `
    <div class="detail-header">
      <div class="profile-avatar" style="width: 80px; height: 80px; font-size: 32px;">${getInitials(profile.name)}</div>
      <h1 class="detail-title">${escapeHtml(profile.name)}</h1>
      <p class="detail-subtitle">${escapeHtml(profile.desired_position)} • ${escapeHtml(profile.city)}</p>
    </div>
    <div class="detail-section">
      <h3>Опыт работы</h3>
      <p>${profile.experience_years ? `${profile.experience_years} лет` : 'Не указан'}</p>
    </div>
    <div class="detail-section">
      <h3>Ожидаемая зарплата</h3>
      <p>${profile.expected_salary ? formatSalary(profile.expected_salary) : 'Обсуждается'}</p>
    </div>
    <div class="detail-section">
      <h3>Навыки</h3>
      <div class="skills-tags">
        ${(profile.skills || '').split(',').map(skill => 
          `<span class="skill-tag">${escapeHtml(skill.trim())}</span>`
        ).join('')}
      </div>
    </div>
    <div class="detail-section">
      <h3>О себе</h3>
      <p>${escapeHtml(profile.about)}</p>
    </div>
    ${profile.portfolio_url ? `
    <div class="detail-section">
      <h3>Портфолио</h3>
      <p><a href="${escapeHtml(profile.portfolio_url)}" target="_blank" rel="noopener">${escapeHtml(profile.portfolio_url)}</a></p>
    </div>` : ''}
    <div class="contact-info">
      <h3>Контакты</h3>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a></p>
      ${profile.phone ? `<p><strong>Телефон:</strong> <a href="tel:${escapeHtml(profile.phone)}">${escapeHtml(profile.phone)}</a></p>` : ''}
    </div>
    <p style="margin-top: 24px; font-size: 12px; color: var(--muted);">
      Профиль создан: ${formatDate(profile.created_at)}
    </p>
  `;

  navigateTo('profile-detail');
};

window.openChatForJob = function(jobId) {
  if (!currentUser) {
    alert('Чтобы написать в чат, сначала заполните Анкету.');
    navigateTo('create-profile');
    return;
  }
  navigateTo('chat');
  selectChatJob(jobId);
};

// ============ HELPERS ============
function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(currentLang === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString(currentLang === 'ru' ? 'ru-RU' : 'en-US', {
    hour: '2-digit', minute: '2-digit'
  });
}

function formatSalary(amount) {
  return new Intl.NumberFormat(currentLang === 'ru' ? 'ru-RU' : 'en-US').format(amount) + ' ₽';
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function getCategoryLabel(cat) {
  const labels = {
    it: 'IT / Разработка',
    design: 'Дизайн',
    marketing: 'Маркетинг',
    sales: 'Продажи',
    finance: 'Финансы'
  };
  return labels[cat] || cat;
}

function getEmploymentLabel(type) {
  const labels = {
    fulltime: 'Полная занятость',
    parttime: 'Частичная',
    remote: 'Удалённо',
    contract: 'Контракт'
  };
  return labels[type] || type;
}
