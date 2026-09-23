// ============ SUPABASE CONFIGURATION ============
// ВАЖНО: Полный URL обязательно должен начинаться с https:// и заканчиваться .supabase.co
const SUPABASE_URL = 'https://kyqktfdjzdbpixfbouux.supabase.co'; 
// Проверь этот ключ в Dashboard -> Settings -> API -> Project API keys -> anon public
const SUPABASE_ANON_KEY = 'sb_publishable_yvOhRNjFtvx0RpXZo7C5WA_DsfgBZ3M'; 

// Загружаем Supabase JS через CDN. 
// Так как мы используем обычный <script>, библиотека повесится в window.supabase
(function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = initApp; // Когда загрузится, запускаем наше приложение
    document.head.appendChild(script);
})();

let supabaseClient = null;

function initApp() {
    // Создаем клиент после загрузки библиотеки
    if (!window.supabase) {
        console.error("Supabase library failed to load");
        return;
    }
    
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Теперь запускаем остальной код
    startLogic();
}

// ============ STATE ============
let currentPage = 'jobs';
let currentLang = localStorage.getItem('language') || 'ru';
let jobsCache = [];
let profilesCache = [];

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
    post_job: 'Опубликовать вакансию',
    create_profile: 'Создать профиль',
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
    post_job: 'Post job vacancy',
    create_profile: 'Create profile',
    back_to_list: '← Back to list'
  }
};

// ============ MAIN LOGIC STARTER ============
function startLogic() {
    initTheme();
    applyTranslations(); // Применяем язык сразу
    
    // Ждем DOMContentLoaded, если страница еще грузится, или выполняем сразу
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupEventListeners();
            loadJobs();
            loadProfiles();
        });
    } else {
        setupEventListeners();
        loadJobs();
        loadProfiles();
    }
}

// ============ THEME & LANG ============
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle');
  if(btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function applyTranslations() {
  const t = translations[currentLang];
  
  const searchInput = document.querySelector('#search-input');
  if(searchInput) searchInput.placeholder = t.search_placeholder;
  
  const locInput = document.querySelector('#location-filter');
  if(locInput) locInput.placeholder = t.location;
  
  const salInput = document.querySelector('#salary-min');
  if(salInput) salInput.placeholder = t.salary_from;
  
  const catSelect = document.querySelector('#category-filter');
  if(catSelect && catSelect.options[0]) catSelect.options[0].textContent = t.all_categories;
  
  const empSelect = document.querySelector('#employment-type');
  if(empSelect && empSelect.options[0]) empSelect.options[0].textContent = t.employment_type;
  
  const sortSelect = document.querySelector('#sort-by');
  if(sortSelect) {
      sortSelect.options[0].textContent = t.newest;
      sortSelect.options[1].textContent = t.salary_desc;
      sortSelect.options[2].textContent = t.salary_asc;
  }
}

// ============ EVENT LISTENERS ============
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      navigateTo(page);
    });
  });
  
  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle');
  if(themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(next);
    });
  }
  
  // Language switcher
  const langSelect = document.getElementById('lang-select');
  if(langSelect) {
    langSelect.value = currentLang;
    langSelect.addEventListener('change', (e) => {
      currentLang = e.target.value;
      localStorage.setItem('language', currentLang);
      applyTranslations();
      // Перерисовываем контент, чтобы тексты обновились
      renderJobs(jobsCache); 
      renderProfiles(profilesCache);
    });
  }
  
  // Filters
  ['search-input', 'category-filter', 'location-filter', 'employment-type', 'salary-min', 'sort-by'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener('input', filterJobs);
  });
  
  const profSearch = document.getElementById('profile-search');
  if(profSearch) profSearch.addEventListener('input', filterProfiles);
  
  // Forms
  const jobForm = document.getElementById('job-form');
  if(jobForm) jobForm.addEventListener('submit', handleJobSubmit);
  
  const profileForm = document.getElementById('profile-form');
  if(profileForm) profileForm.addEventListener('submit', handleProfileSubmit);
  
  // Detail navigation
  const backJobs = document.getElementById('back-to-jobs');
  if(backJobs) backJobs.addEventListener('click', () => navigateTo('jobs'));
  
  const backProf = document.getElementById('back-to-profiles');
  if(backProf) backProf.addEventListener('click', () => navigateTo('profiles'));
}

function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  
  const targetPage = document.getElementById(`page-${pageId}`);
  if(targetPage) targetPage.classList.add('active');
  
  const targetBtn = document.querySelector(`[data-page="${pageId}"]`);
  if(targetBtn) targetBtn.classList.add('active');
  
  currentPage = pageId;
}

// ============ DATA LOADING ============
async function loadJobs() {
  try {
    const { data, error } = await supabaseClient
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    jobsCache = data || [];
    renderJobs(jobsCache);
  } catch (err) {
    console.error('Error loading jobs:', err);
    showEmptyState('jobs-list', translations[currentLang].no_jobs);
  }
}

async function loadProfiles() {
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    profilesCache = data || [];
    renderProfiles(profilesCache);
  } catch (err) {
    console.error('Error loading profiles:', err);
    showEmptyState('profiles-list', translations[currentLang].no_profiles);
  }
}

// ============ RENDERING ============
function renderJobs(jobs) {
  const container = document.getElementById('jobs-list');
  if(!container) return;
  
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
  if(!container) return;
  
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
  if(!container) return;
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
  
  if (category) {
    filtered = filtered.filter(job => job.category === category);
  }
  
  if (location) {
    filtered = filtered.filter(job => job.location.toLowerCase().includes(location));
  }
  
  if (employmentType) {
    filtered = filtered.filter(job => job.employment_type === employmentType);
  }
  
  if (salaryMin > 0) {
    filtered = filtered.filter(job => job.salary_min >= salaryMin);
  }
  
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

// ============ FORM HANDLERS ============
async function handleJobSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const jobData = Object.fromEntries(formData.entries());
  
  jobData.salary_min = jobData.salary_min ? parseInt(jobData.salary_min) : null;
  jobData.salary_max = jobData.salary_max ? parseInt(jobData.salary_max) : null;
  
  try {
    const { data, error } = await supabaseClient
      .from('jobs')
      .insert([jobData])
      .select();
    
    if (error) throw error;
    
    alert(currentLang === 'ru' ? 'Вакансия опубликована!' : 'Job posted successfully!');
    e.target.reset();
    await loadJobs();
    navigateTo('jobs');
  } catch (err) {
    console.error('Error posting job:', err);
    alert(currentLang === 'ru' ? 'Ошибка при публикации вакансии' : 'Error posting job');
  }
}

async function handleProfileSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const profileData = Object.fromEntries(formData.entries());
  
  profileData.expected_salary = profileData.expected_salary ? parseInt(profileData.expected_salary) : null;
  profileData.experience_years = profileData.experience_years ? parseInt(profileData.experience_years) : null;
  
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .insert([profileData])
      .select();
    
    if (error) throw error;
    
    alert(currentLang === 'ru' ? 'Профиль создан!' : 'Profile created successfully!');
    e.target.reset();
    await loadProfiles();
    navigateTo('profiles');
  } catch (err) {
    console.error('Error creating profile:', err);
    alert(currentLang === 'ru' ? 'Ошибка при создании профиля' : 'Error creating profile');
  }
}

// ============ DETAIL VIEWS ============
window.showJobDetail = async function(jobId) {
  const job = jobsCache.find(j => j.id === jobId);
  if (!job) return;
  
  const content = document.getElementById('job-detail-content');
  if(!content) return;

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
    </div>
    ` : ''}
    
    ${job.benefits ? `
    <div class="detail-section">
      <h3>Условия работы</h3>
      <p>${escapeHtml(job.benefits)}</p>
    </div>
    ` : ''}
    
    <div class="contact-info">
      <h3>Контакты для связи</h3>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(job.contact_email)}">${escapeHtml(job.contact_email)}</a></p>
      ${job.contact_phone ? `<p><strong>Телефон:</strong> <a href="tel:${escapeHtml(job.contact_phone)}">${escapeHtml(job.contact_phone)}</a></p>` : ''}
    </div>
    
    <p style="margin-top: 24px; font-size: 12px; color: var(--muted);">
      Опубликовано: ${formatDate(job.created_at)}
    </p>
  `;
  
  navigateTo('job-detail');
};

window.showProfileDetail = async function(profileId) {
  const profile = profilesCache.find(p => p.id === profileId);
  if (!profile) return;
  
  const content = document.getElementById('profile-detail-content');
  if(!content) return;

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
    </div>
    ` : ''}
    
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

// ============ HELPERS ============
function escapeHtml(text) {
  if(!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(currentLang === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function formatSalary(amount) {
  return new Intl.NumberFormat(currentLang === 'ru' ? 'ru-RU' : 'en-US').format(amount) + ' ₽';
}

function getInitials(name) {
  if(!name) return '?';
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
