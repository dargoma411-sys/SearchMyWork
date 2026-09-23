// ============ STATE ============
let currentPage = 'jobs';
let currentLang = localStorage.getItem('language') || 'ru';
let jobsCache = [];
let profilesCache = [];
let activeDialogId = null; // "job:1" | "profile:2"
let currentUser = JSON.parse(localStorage.getItem('smw_user') || 'null');
let showNewChatList = false;
let accountType = 'specialist';

// ============ HARDCODED JOBS ============
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
    contact_email: 'hr@morvexx-digital.ru',
    contact_phone: '+7 495 120 34 56',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 2,
    title: 'UI/UX дизайнер',
    company: 'Nebula Studio',
    category: 'design',
    location: 'Санкт-Петербург',
    employment_type: 'fulltime',
    salary_min: 120000,
    salary_max: 180000,
    description: 'Проектирование интерфейсов мобильных и веб-приложений. Работа в тесной связке с продукт-менеджером и разработчиками.',
    requirements: 'Портфолио с кейсами, опыт в Figma, понимание принципов юзабилити и дизайн-систем.',
    benefits: 'Офис в центре, ДМС, оплата конференций, современное оборудование.',
    contact_email: 'jobs@nebula-studio.ru',
    contact_phone: '+7 812 445 78 90',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: 3,
    title: 'Backend-разработчик (Node.js)',
    company: 'DataForge',
    category: 'it',
    location: 'Удалённо',
    employment_type: 'remote',
    salary_min: 180000,
    salary_max: 260000,
    description: 'Разработка микросервисов для платёжной системы. Высокая нагрузка, интересные задачи, сильная команда.',
    requirements: 'Опыт с Node.js от 4 лет, PostgreSQL, Redis, Docker, понимание принципов построения микросервисов.',
    benefits: 'Полностью удалённо, оплачиваемый отпуск, бонусы по итогам года.',
    contact_email: 'dev@dataforge.io',
    contact_phone: '+7 903 770 12 45',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    id: 4,
    title: 'Интернет-маркетолог',
    company: 'AdRocket',
    category: 'marketing',
    location: 'Москва',
    employment_type: 'fulltime',
    salary_min: 90000,
    salary_max: 140000,
    description: 'Ведение кампаний в Яндекс.Директ и Google Ads, аналитика, работа с воронкой, A/B-тесты.',
    requirements: 'Опыт от 2 лет, знание метрик, уверенная работа с аналитикой, портфолио кампаний.',
    benefits: 'Офис рядом с метро, ДМС, обучение за счёт компании.',
    contact_email: 'hr@adrocket.ru',
    contact_phone: '+7 495 330 88 21',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    id: 5,
    title: 'Менеджер по продажам B2B',
    company: 'TradeLine Group',
    category: 'sales',
    location: 'Екатеринбург',
    employment_type: 'fulltime',
    salary_min: 70000,
    salary_max: 150000,
    description: 'Работа с корпоративными клиентами, полный цикл сделки, развитие базы, участие в тендерах.',
    requirements: 'Опыт в B2B-продажах от 1 года, грамотная речь, умение вести переговоры.',
    benefits: 'Оклад + процент, обучение, карьерный рост, корпоративная связь.',
    contact_email: 'sales@tradeline.ru',
    contact_phone: '+7 343 220 55 14',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 6,
    title: 'Финансовый аналитик',
    company: 'CapitalMind',
    category: 'finance',
    location: 'Москва',
    employment_type: 'fulltime',
    salary_min: 130000,
    salary_max: 190000,
    description: 'Финансовое моделирование, бюджетирование, подготовка отчётности для руководства.',
    requirements: 'Высшее экономическое, Excel на продвинутом уровне, опыт работы с BI-инструментами.',
    benefits: 'ДМС, годовые бонусы, гибридный формат работы.',
    contact_email: 'fin@capitalmind.ru',
    contact_phone: '+7 495 901 23 67',
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
    phone: '+7 901 234 56 78',
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
    phone: '+7 902 345 67 89',
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
    phone: '+7 903 456 78 90',
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
    phone: '+7 904 567 89 01',
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
    phone: '+7 905 678 90 12',
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
    phone: '+7 906 789 01 23',
    created_at: new Date(Date.now() - 13 * 86400000).toISOString()
  }
];

// ============ TRANSLATIONS ============
const translations = {
  ru: {
    nav_jobs: 'Вакансии',
    nav_profiles: 'Специалисты',
    nav_profile: 'Анкета',
    nav_chat: 'Чат',
    search_placeholder: 'Поиск по названию...',
    all_categories: 'Все категории',
    cat_it: 'IT / Разработка',
    cat_design: 'Дизайн',
    cat_marketing: 'Маркетинг',
    cat_sales: 'Продажи',
    cat_finance: 'Финансы',
    location: 'Локация',
    employment_type: 'Тип занятости',
    emp_fulltime: 'Полная занятость',
    emp_parttime: 'Частичная',
    emp_remote: 'Удалённо',
    emp_contract: 'Контракт',
    salary_from: 'Зарплата от',
    newest: 'Сначала новые',
    salary_desc: 'Зарплата ↓',
    salary_asc: 'Зарплата ↑',
    no_jobs: 'Вакансии не найдены',
    no_profiles: 'Профили не найдены',
    specialists_title: 'Специалисты',
    profile_search: 'Поиск по имени или навыкам...',
    profile_form_title: 'Заполните анкету',
    profile_form_subtitle: 'Чтобы компания или специалист знали, кто вы. Анкета не публикуется в разделе «Специалисты» — она нужна только для чата.',
    type_specialist: 'Я специалист',
    type_company: 'Я компания',
    f_name: 'Имя и фамилия *',
    f_city: 'Город *',
    f_email: 'Email *',
    f_phone: 'Телефон',
    f_position: 'Желаемая должность *',
    f_exp: 'Опыт работы (лет)',
    f_salary: 'Ожидаемая зарплата',
    f_skills: 'Навыки (через запятую) *',
    f_about: 'О себе *',
    f_portfolio: 'Portfolio / LinkedIn / GitHub',
    f_company_name: 'Название компании *',
    f_industry: 'Сфера деятельности *',
    f_website: 'Сайт компании',
    f_company_about: 'О компании *',
    save_profile: 'Сохранить анкету',
    chat_dialogs: 'Диалоги',
    chat_choose: 'Выберите диалог',
    chat_placeholder: 'Написать сообщение...',
    send: 'Отправить',
    back_to_list: '← Назад к списку',
    back_to_specialists: '← Назад к специалистам',
    footer_tag: 'Биржа вакансий и специалистов',
    footer_contacts: 'Контакты',
    footer_docs: 'Документы',
    footer_privacy: 'Политика конфиденциальности',
    footer_terms: 'Пользовательское соглашение',
    footer_rights: 'Все права защищены.',
    chat_need_profile: 'Сначала заполните анкету',
    chat_need_profile_text: 'Чтобы писать в чат, сначала заполните <b>Анкету</b> во вкладке выше.',
    chat_empty: 'Сообщений пока нет. Напишите первым!',
    chat_select: 'Выберите диалог или создайте новый',
    chat_no_dialogs: 'Пока нет диалогов. Нажмите «+», чтобы начать.',
    chat_new_title: 'Новый чат',
    chat_jobs: 'Вакансии',
    chat_specialists: 'Специалисты',
    chat_you_are: 'Вы вошли как',
    alert_profile_saved: 'Анкета сохранена! Теперь вам доступен чат.',
    alert_need_profile: 'Чтобы написать в чат, сначала заполните Анкету.',
    years_short: 'лет опыта',
    detail_salary: 'Заработная плата',
    detail_employment: 'Тип занятости',
    detail_description: 'Описание',
    detail_requirements: 'Требования',
    detail_benefits: 'Условия работы',
    detail_contacts: 'Контакты для связи',
    detail_write_chat: 'Написать в чат',
    detail_published: 'Опубликовано',
    detail_exp: 'Опыт работы',
    detail_expected: 'Ожидаемая зарплата',
    detail_skills: 'Навыки',
    detail_about: 'О себе',
    detail_portfolio: 'Портфолио',
    detail_contacts_short: 'Контакты',
    detail_created: 'Профиль создан',
    not_specified: 'Не указано',
    discussed: 'Обсуждается'
  },
  en: {
    nav_jobs: 'Jobs',
    nav_profiles: 'Specialists',
    nav_profile: 'Profile',
    nav_chat: 'Chat',
    search_placeholder: 'Search by title...',
    all_categories: 'All categories',
    cat_it: 'IT / Development',
    cat_design: 'Design',
    cat_marketing: 'Marketing',
    cat_sales: 'Sales',
    cat_finance: 'Finance',
    location: 'Location',
    employment_type: 'Employment type',
    emp_fulltime: 'Full-time',
    emp_parttime: 'Part-time',
    emp_remote: 'Remote',
    emp_contract: 'Contract',
    salary_from: 'Salary from',
    newest: 'Newest first',
    salary_desc: 'Salary ↓',
    salary_asc: 'Salary ↑',
    no_jobs: 'No jobs found',
    no_profiles: 'No profiles found',
    specialists_title: 'Specialists',
    profile_search: 'Search by name or skills...',
    profile_form_title: 'Fill out the form',
    profile_form_subtitle: 'So a company or specialist knows who you are. The form is not published in the Specialists section — it is only used for chat.',
    type_specialist: 'I am a specialist',
    type_company: 'I am a company',
    f_name: 'Full name *',
    f_city: 'City *',
    f_email: 'Email *',
    f_phone: 'Phone',
    f_position: 'Desired position *',
    f_exp: 'Years of experience',
    f_salary: 'Expected salary',
    f_skills: 'Skills (comma separated) *',
    f_about: 'About me *',
    f_portfolio: 'Portfolio / LinkedIn / GitHub',
    f_company_name: 'Company name *',
    f_industry: 'Industry *',
    f_website: 'Company website',
    f_company_about: 'About the company *',
    save_profile: 'Save profile',
    chat_dialogs: 'Dialogs',
    chat_choose: 'Select a dialog',
    chat_placeholder: 'Write a message...',
    send: 'Send',
    back_to_list: '← Back to list',
    back_to_specialists: '← Back to specialists',
    footer_tag: 'Job and specialist marketplace',
    footer_contacts: 'Contacts',
    footer_docs: 'Documents',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',
    footer_rights: 'All rights reserved.',
    chat_need_profile: 'Fill out the form first',
    chat_need_profile_text: 'To write in chat, first fill out the <b>Profile</b> form above.',
    chat_empty: 'No messages yet. Write first!',
    chat_select: 'Select a dialog or create a new one',
    chat_no_dialogs: 'No dialogs yet. Press "+" to start.',
    chat_new_title: 'New chat',
    chat_jobs: 'Jobs',
    chat_specialists: 'Specialists',
    chat_you_are: 'Logged in as',
    alert_profile_saved: 'Profile saved! Chat is now available.',
    alert_need_profile: 'To write in chat, first fill out the Profile form.',
    years_short: 'years of experience',
    detail_salary: 'Salary',
    detail_employment: 'Employment type',
    detail_description: 'Description',
    detail_requirements: 'Requirements',
    detail_benefits: 'Benefits',
    detail_contacts: 'Contact information',
    detail_write_chat: 'Write in chat',
    detail_published: 'Published',
    detail_exp: 'Experience',
    detail_expected: 'Expected salary',
    detail_skills: 'Skills',
    detail_about: 'About',
    detail_portfolio: 'Portfolio',
    detail_contacts_short: 'Contacts',
    detail_created: 'Profile created',
    not_specified: 'Not specified',
    discussed: 'Negotiable'
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
  renderChatDialogList();
  restoreUser();
  switchAccountType('specialist');

  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const langSelect = document.getElementById('lang-select');
  if (langSelect) langSelect.value = currentLang;
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

// ============ TRANSLATIONS ============
function applyTranslations() {
  const t = translations[currentLang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key]) el.placeholder = t[key];
  });

  // Обновляем подсказку в чате и заголовок, если нужно
  if (currentPage === 'chat') updateChatUI();
  renderChatDialogList();
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
      renderChatDialogList();
      if (activeDialogId) updateChatUI();
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

  // Переключатель типа аккаунта
  document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => switchAccountType(btn.dataset.type));
  });

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

  const chatNewBtn = document.getElementById('chat-new-btn');
  if (chatNewBtn) {
    chatNewBtn.addEventListener('click', () => {
      showNewChatList = !showNewChatList;
      renderChatNewList();
    });
  }
}

// ============ ACCOUNT TYPE ============
function switchAccountType(type) {
  accountType = type;
  document.querySelectorAll('.type-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.type === type);
  });
  document.querySelectorAll('.type-fields').forEach(el => {
    el.classList.toggle('hidden', el.dataset.typeFields !== type);
  });

  // Обновляем required у полей
  const specFields = document.querySelector('[data-type-fields="specialist"]');
  const compFields = document.querySelector('[data-type-fields="company"]');

  const setRequired = (container, required) => {
    container.querySelectorAll('input, textarea').forEach(el => el.required = required);
  };

  if (type === 'specialist') {
    setRequired(specFields, true);
    setRequired(compFields, false);
  } else {
    setRequired(specFields, false);
    setRequired(compFields, true);
  }
}

// ============ NAVIGATION ============
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) targetPage.classList.add('active');

  const targetBtn = document.querySelector(`[data-page="${pageId}"]`);
  if (targetBtn) targetBtn.classList.add('active');

  currentPage = pageId;

  if (pageId === 'chat') {
    renderChatDialogList();
    updateChatUI();
  }
}

// ============ DATA LOADING ============
function loadJobs() {
  jobsCache = [...HARDCODED_JOBS];
  renderJobs(jobsCache);
}

function loadProfiles() {
  // Анкета пользователя НЕ публикуется в специалистах
  profilesCache = [...HARDCODED_PROFILES];
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
        <span>→</span>
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
        <span>${profile.experience_years ? `${profile.experience_years} ${translations[currentLang].years_short}` : ''}</span>
        <span>→</span>
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

// ============ PROFILE FORM ============
function handleProfileSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  // Преобразуем числа
  if (data.experience_years) data.experience_years = parseInt(data.experience_years);
  if (data.expected_salary) data.expected_salary = parseInt(data.expected_salary);

  currentUser = {
    type: accountType,
    name: data.name,
    email: data.email,
    city: data.city,
    phone: data.phone || '',
    // Специалист
    position: data.desired_position || '',
    experience: data.experience_years || null,
    expected_salary: data.expected_salary || null,
    skills: data.skills || '',
    about: data.about || '',
    portfolio: data.portfolio_url || '',
    // Компания
    company_name: data.company_name || '',
    industry: data.industry || '',
    website: data.website || '',
    company_about: data.company_about || ''
  };

  localStorage.setItem('smw_user', JSON.stringify(currentUser));
  alert(translations[currentLang].alert_profile_saved);
  e.target.reset();
  updateChatUI();
  navigateTo('chat');
}

// ============ CHAT ============
function restoreUser() {
  if (currentUser) updateChatUI();
}

function getDialogs() {
  return JSON.parse(localStorage.getItem('smw_dialogs') || '[]');
}

function saveDialogs(dialogs) {
  localStorage.setItem('smw_dialogs', JSON.stringify(dialogs));
}

function addDialog(dialogId) {
  const dialogs = getDialogs();
  if (!dialogs.includes(dialogId)) {
    dialogs.push(dialogId);
    saveDialogs(dialogs);
  }
}

function getChatMessages(dialogId) {
  const all = JSON.parse(localStorage.getItem('smw_chat') || '{}');
  return all[dialogId] || [];
}

function saveChatMessage(dialogId, msg) {
  const all = JSON.parse(localStorage.getItem('smw_chat') || '{}');
  if (!all[dialogId]) all[dialogId] = [];
  all[dialogId].push(msg);
  localStorage.setItem('smw_chat', JSON.stringify(all));
}

function renderChatDialogList() {
  const container = document.getElementById('chat-dialog-list');
  if (!container) return;

  const dialogs = getDialogs();
  if (!dialogs.length) {
    container.innerHTML = `<p style="font-size:13px;color:var(--muted);padding:8px 4px;">${translations[currentLang].chat_no_dialogs}</p>`;
    return;
  }

  container.innerHTML = dialogs.map(dId => {
    const [type, idStr] = dId.split(':');
    const id = parseInt(idStr);
    let title = '', subtitle = '';

    if (type === 'job') {
      const job = jobsCache.find(j => j.id === id);
      if (!job) return '';
      title = job.title;
      subtitle = job.company;
    } else {
      const prof = profilesCache.find(p => p.id === id);
      if (!prof) return '';
      title = prof.name;
      subtitle = prof.desired_position;
    }

    const active = activeDialogId === dId ? 'active' : '';
    return `
      <div class="chat-dialog-item ${active}" onclick="selectDialog('${dId}')">
        ${escapeHtml(title)}
        <small>${escapeHtml(subtitle)}</small>
        <span class="del" onclick="event.stopPropagation(); deleteDialog('${dId}')" title="Удалить">✕</span>
      </div>
    `;
  }).join('');
}

function renderChatNewList() {
  const container = document.getElementById('chat-new-list');
  if (!container) return;

  if (!showNewChatList) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  container.classList.remove('hidden');
  container.innerHTML = `
    <h4>${translations[currentLang].chat_jobs}</h4>
    ${jobsCache.map(j => `
      <div class="chat-new-item" onclick="startDialog('job', ${j.id})">
        ${escapeHtml(j.title)} — ${escapeHtml(j.company)}
      </div>
    `).join('')}
    <h4 style="margin-top:12px;">${translations[currentLang].chat_specialists}</h4>
    ${profilesCache.map(p => `
      <div class="chat-new-item" onclick="startDialog('profile', ${p.id})">
        ${escapeHtml(p.name)} — ${escapeHtml(p.desired_position)}
      </div>
    `).join('')}
  `;
}

window.selectDialog = function(dialogId) {
  activeDialogId = dialogId;
  showNewChatList = false;
  renderChatDialogList();
  renderChatNewList();
  updateChatUI();
};

window.startDialog = function(type, id) {
  const dialogId = `${type}:${id}`;
  addDialog(dialogId);
  activeDialogId = dialogId;
  showNewChatList = false;
  renderChatDialogList();
  renderChatNewList();
  updateChatUI();
};

window.deleteDialog = function(dialogId) {
  if (!confirm(currentLang === 'ru' ? 'Удалить диалог?' : 'Delete dialog?')) return;
  let dialogs = getDialogs();
  dialogs = dialogs.filter(d => d !== dialogId);
  saveDialogs(dialogs);

  // Удаляем сообщения
  const all = JSON.parse(localStorage.getItem('smw_chat') || '{}');
  delete all[dialogId];
  localStorage.setItem('smw_chat', JSON.stringify(all));

  if (activeDialogId === dialogId) activeDialogId = null;
  renderChatDialogList();
  updateChatUI();
};

function updateChatUI() {
  const header = document.getElementById('chat-header');
  const messages = document.getElementById('chat-messages');
  const input = document.getElementById('chat-input');
  const send = document.getElementById('chat-send');
  const hint = document.getElementById('chat-hint');

  if (!header || !messages) return;

  const t = translations[currentLang];

  if (!currentUser) {
    header.textContent = t.chat_need_profile;
    messages.innerHTML = `<div class="chat-empty">${t.chat_need_profile_text}</div>`;
    if (input) input.disabled = true;
    if (send) send.disabled = true;
    if (hint) hint.textContent = '';
    return;
  }

  if (!activeDialogId) {
    header.textContent = t.chat_choose;
    messages.innerHTML = `<div class="chat-empty">${t.chat_select}</div>`;
    if (input) input.disabled = true;
    if (send) send.disabled = true;
    if (hint) hint.textContent = `${t.chat_you_are}: ${currentUser.name}`;
    return;
  }

  const [type, idStr] = activeDialogId.split(':');
  const id = parseInt(idStr);
  let title = '';

  if (type === 'job') {
    const job = jobsCache.find(j => j.id === id);
    if (job) title = `${job.title} — ${job.company}`;
  } else {
    const prof = profilesCache.find(p => p.id === id);
    if (prof) title = `${prof.name} — ${prof.desired_position}`;
  }

  header.textContent = title || t.chat_choose;
  if (hint) hint.textContent = `${t.chat_you_are}: ${currentUser.name} (${currentUser.email})`;

  if (input) input.disabled = false;
  if (send) send.disabled = false;

  const msgs = getChatMessages(activeDialogId);
  if (!msgs.length) {
    messages.innerHTML = `<div class="chat-empty">${t.chat_empty}</div>`;
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
  if (!activeDialogId) return;
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  const msg = {
    author: currentUser.email,
    authorName: currentUser.name,
    text: text,
    time: new Date().toISOString()
  };
  saveChatMessage(activeDialogId, msg);
  input.value = '';
  updateChatUI();
}

// ============ DETAIL VIEWS ============
window.showJobDetail = function(jobId) {
  const job = jobsCache.find(j => j.id === jobId);
  if (!job) return;
  const t = translations[currentLang];
  const content = document.getElementById('job-detail-content');
  if (!content) return;

  content.innerHTML = `
    <div class="detail-header">
      <h1 class="detail-title">${escapeHtml(job.title)}</h1>
      <p class="detail-subtitle">${escapeHtml(job.company)} • ${escapeHtml(job.location)}</p>
    </div>
    <div class="detail-section">
      <h3>${t.detail_salary}</h3>
      <p>${job.salary_min ? formatSalary(job.salary_min) + (job.salary_max ? ' – ' + formatSalary(job.salary_max) : '') : t.not_specified}</p>
    </div>
    <div class="detail-section">
      <h3>${t.detail_employment}</h3>
      <p>${getEmploymentLabel(job.employment_type)}</p>
    </div>
    <div class="detail-section">
      <h3>${t.detail_description}</h3>
      <p>${escapeHtml(job.description)}</p>
    </div>
    ${job.requirements ? `
    <div class="detail-section">
      <h3>${t.detail_requirements}</h3>
      <p>${escapeHtml(job.requirements)}</p>
    </div>` : ''}
    ${job.benefits ? `
    <div class="detail-section">
      <h3>${t.detail_benefits}</h3>
      <p>${escapeHtml(job.benefits)}</p>
    </div>` : ''}
    <div class="contact-info">
      <h3>${t.detail_contacts}</h3>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(job.contact_email)}">${escapeHtml(job.contact_email)}</a></p>
      ${job.contact_phone ? `<p><strong>${currentLang === 'ru' ? 'Телефон' : 'Phone'}:</strong> <a href="tel:${escapeHtml(job.contact_phone)}">${escapeHtml(job.contact_phone)}</a></p>` : ''}
    </div>
    <button class="btn-primary" style="margin-top:24px;" onclick="openChatForJob(${job.id})">${t.detail_write_chat}</button>
    <p style="margin-top: 24px; font-size: 12px; color: var(--muted);">
      ${t.detail_published}: ${formatDate(job.created_at)}
    </p>
  `;

  navigateTo('job-detail');
};

window.showProfileDetail = function(profileId) {
  const profile = profilesCache.find(p => p.id === profileId);
  if (!profile) return;
  const t = translations[currentLang];
  const content = document.getElementById('profile-detail-content');
  if (!content) return;

  content.innerHTML = `
    <div class="detail-header">
      <div class="profile-avatar" style="width: 80px; height: 80px; font-size: 32px;">${getInitials(profile.name)}</div>
      <h1 class="detail-title">${escapeHtml(profile.name)}</h1>
      <p class="detail-subtitle">${escapeHtml(profile.desired_position)} • ${escapeHtml(profile.city)}</p>
    </div>
    <div class="detail-section">
      <h3>${t.detail_exp}</h3>
      <p>${profile.experience_years ? `${profile.experience_years} ${t.years_short}` : t.not_specified}</p>
    </div>
    <div class="detail-section">
      <h3>${t.detail_expected}</h3>
      <p>${profile.expected_salary ? formatSalary(profile.expected_salary) : t.discussed}</p>
    </div>
    <div class="detail-section">
      <h3>${t.detail_skills}</h3>
      <div class="skills-tags">
        ${(profile.skills || '').split(',').map(skill => 
          `<span class="skill-tag">${escapeHtml(skill.trim())}</span>`
        ).join('')}
      </div>
    </div>
    <div class="detail-section">
      <h3>${t.detail_about}</h3>
      <p>${escapeHtml(profile.about)}</p>
    </div>
    ${profile.portfolio_url ? `
    <div class="detail-section">
      <h3>${t.detail_portfolio}</h3>
      <p><a href="${escapeHtml(profile.portfolio_url)}" target="_blank" rel="noopener">${escapeHtml(profile.portfolio_url)}</a></p>
    </div>` : ''}
    <div class="contact-info">
      <h3>${t.detail_contacts_short}</h3>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a></p>
      ${profile.phone ? `<p><strong>${currentLang === 'ru' ? 'Телефон' : 'Phone'}:</strong> <a href="tel:${escapeHtml(profile.phone)}">${escapeHtml(profile.phone)}</a></p>` : ''}
    </div>
    <button class="btn-primary" style="margin-top:24px;" onclick="openChatForProfile(${profile.id})">${t.detail_write_chat}</button>
    <p style="margin-top: 24px; font-size: 12px; color: var(--muted);">
      ${t.detail_created}: ${formatDate(profile.created_at)}
    </p>
  `;

  navigateTo('profile-detail');
};

window.openChatForJob = function(jobId) {
  if (!currentUser) {
    alert(translations[currentLang].alert_need_profile);
    navigateTo('create-profile');
    return;
  }
  navigateTo('chat');
  startDialog('job', jobId);
};

window.openChatForProfile = function(profileId) {
  if (!currentUser) {
    alert(translations[currentLang].alert_need_profile);
    navigateTo('create-profile');
    return;
  }
  navigateTo('chat');
  startDialog('profile', profileId);
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
    it: currentLang === 'ru' ? 'IT / Разработка' : 'IT / Development',
    design: currentLang === 'ru' ? 'Дизайн' : 'Design',
    marketing: currentLang === 'ru' ? 'Маркетинг' : 'Marketing',
    sales: currentLang === 'ru' ? 'Продажи' : 'Sales',
    finance: currentLang === 'ru' ? 'Финансы' : 'Finance'
  };
  return labels[cat] || cat;
}

function getEmploymentLabel(type) {
  const labels = {
    fulltime: currentLang === 'ru' ? 'Полная занятость' : 'Full-time',
    parttime: currentLang === 'ru' ? 'Частичная' : 'Part-time',
    remote: currentLang === 'ru' ? 'Удалённо' : 'Remote',
    contract: currentLang === 'ru' ? 'Контракт' : 'Contract'
  };
  return labels[type] || type;
}
