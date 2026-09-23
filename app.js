// ============ STATE ============
let currentPage = 'jobs';
let currentLang = localStorage.getItem('language') || 'ru';
let jobsCache = [];
let profilesCache = [];
let activeDialogId = null;
let currentUser = JSON.parse(localStorage.getItem('smw_user') || 'null');
let accountType = 'specialist';

// ============ HARDCODED JOBS ============
const HARDCODED_JOBS = [
  {
    id: 1,
    category: 'it',
    employment_type: 'remote',
    salary_min: 150000,
    salary_max: 220000,
    contact_email: 'hr@morvexx-digital.ru',
    contact_phone: '+7 495 120 34 56',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    ru: {
      title: 'Frontend-разработчик (React)',
      company: 'Morvexx Digital',
      location: 'Москва / Удалённо',
      description: 'Разработка интерфейсов для крупной SaaS-платформы. Работа в команде из 8 инженеров, современный стек, код-ревью, CI/CD.',
      requirements: '3+ года опыта с React, уверенное знание TypeScript, Redux/Zustand, опыт работы с REST и GraphQL.',
      benefits: 'Удалённая работа, гибкий график, ДМС, компенсация обучения, техника от компании.'
    },
    en: {
      title: 'Frontend Developer (React)',
      company: 'Morvexx Digital',
      location: 'Moscow / Remote',
      description: 'Building interfaces for a large SaaS platform. Working in a team of 8 engineers, modern stack, code review, CI/CD.',
      requirements: '3+ years with React, strong TypeScript, Redux/Zustand, experience with REST and GraphQL.',
      benefits: 'Remote work, flexible schedule, health insurance, education reimbursement, company hardware.'
    }
  },
  {
    id: 2,
    category: 'design',
    employment_type: 'fulltime',
    salary_min: 120000,
    salary_max: 180000,
    contact_email: 'jobs@nebula-studio.ru',
    contact_phone: '+7 812 445 78 90',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    ru: {
      title: 'UI/UX дизайнер',
      company: 'Nebula Studio',
      location: 'Санкт-Петербург',
      description: 'Проектирование интерфейсов мобильных и веб-приложений. Работа в тесной связке с продукт-менеджером и разработчиками.',
      requirements: 'Портфолио с кейсами, опыт в Figma, понимание принципов юзабилити и дизайн-систем.',
      benefits: 'Офис в центре, ДМС, оплата конференций, современное оборудование.'
    },
    en: {
      title: 'UI/UX Designer',
      company: 'Nebula Studio',
      location: 'Saint Petersburg',
      description: 'Designing interfaces for mobile and web apps. Working closely with a product manager and developers.',
      requirements: 'Portfolio with cases, experience in Figma, understanding of usability and design systems.',
      benefits: 'Central office, health insurance, conference coverage, modern equipment.'
    }
  },
  {
    id: 3,
    category: 'it',
    employment_type: 'remote',
    salary_min: 180000,
    salary_max: 260000,
    contact_email: 'dev@dataforge.io',
    contact_phone: '+7 903 770 12 45',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    ru: {
      title: 'Backend-разработчик (Node.js)',
      company: 'DataForge',
      location: 'Удалённо',
      description: 'Разработка микросервисов для платёжной системы. Высокая нагрузка, интересные задачи, сильная команда.',
      requirements: 'Опыт с Node.js от 4 лет, PostgreSQL, Redis, Docker, понимание принципов построения микросервисов.',
      benefits: 'Полностью удалённо, оплачиваемый отпуск, бонусы по итогам года.'
    },
    en: {
      title: 'Backend Developer (Node.js)',
      company: 'DataForge',
      location: 'Remote',
      description: 'Developing microservices for a payment system. High load, interesting tasks, strong team.',
      requirements: '4+ years with Node.js, PostgreSQL, Redis, Docker, understanding of microservices architecture.',
      benefits: 'Fully remote, paid vacation, year-end bonuses.'
    }
  },
  {
    id: 4,
    category: 'marketing',
    employment_type: 'fulltime',
    salary_min: 90000,
    salary_max: 140000,
    contact_email: 'hr@adrocket.ru',
    contact_phone: '+7 495 330 88 21',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    ru: {
      title: 'Интернет-маркетолог',
      company: 'AdRocket',
      location: 'Москва',
      description: 'Ведение кампаний в Яндекс.Директ и Google Ads, аналитика, работа с воронкой, A/B-тесты.',
      requirements: 'Опыт от 2 лет, знание метрик, уверенная работа с аналитикой, портфолио кампаний.',
      benefits: 'Офис рядом с метро, ДМС, обучение за счёт компании.'
    },
    en: {
      title: 'Digital Marketer',
      company: 'AdRocket',
      location: 'Moscow',
      description: 'Running campaigns in Yandex.Direct and Google Ads, analytics, funnel work, A/B tests.',
      requirements: '2+ years of experience, knowledge of metrics, confident analytics skills, campaign portfolio.',
      benefits: 'Office near metro, health insurance, company-paid training.'
    }
  },
  {
    id: 5,
    category: 'sales',
    employment_type: 'fulltime',
    salary_min: 70000,
    salary_max: 150000,
    contact_email: 'sales@tradeline.ru',
    contact_phone: '+7 343 220 55 14',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    ru: {
      title: 'Менеджер по продажам B2B',
      company: 'TradeLine Group',
      location: 'Екатеринбург',
      description: 'Работа с корпоративными клиентами, полный цикл сделки, развитие базы, участие в тендерах.',
      requirements: 'Опыт в B2B-продажах от 1 года, грамотная речь, умение вести переговоры.',
      benefits: 'Оклад + процент, обучение, карьерный рост, корпоративная связь.'
    },
    en: {
      title: 'B2B Sales Manager',
      company: 'TradeLine Group',
      location: 'Yekaterinburg',
      description: 'Working with corporate clients, full sales cycle, database growth, participation in tenders.',
      requirements: '1+ year in B2B sales, strong communication, negotiation skills.',
      benefits: 'Base + commission, training, career growth, corporate phone.'
    }
  },
  {
    id: 6,
    category: 'finance',
    employment_type: 'fulltime',
    salary_min: 130000,
    salary_max: 190000,
    contact_email: 'fin@capitalmind.ru',
    contact_phone: '+7 495 901 23 67',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    ru: {
      title: 'Финансовый аналитик',
      company: 'CapitalMind',
      location: 'Москва',
      description: 'Финансовое моделирование, бюджетирование, подготовка отчётности для руководства.',
      requirements: 'Высшее экономическое, Excel на продвинутом уровне, опыт работы с BI-инструментами.',
      benefits: 'ДМС, годовые бонусы, гибридный формат работы.'
    },
    en: {
      title: 'Financial Analyst',
      company: 'CapitalMind',
      location: 'Moscow',
      description: 'Financial modeling, budgeting, preparing reports for management.',
      requirements: 'Degree in economics, advanced Excel, experience with BI tools.',
      benefits: 'Health insurance, annual bonuses, hybrid work format.'
    }
  }
];

// ============ HARDCODED PROFILES ============
const HARDCODED_PROFILES = [
  {
    id: 1,
    experience_years: 6,
    expected_salary: 250000,
    portfolio_url: 'https://github.com/alexivanov',
    email: 'alex.ivanov@example.com',
    phone: '+7 901 234 56 78',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    ru: {
      name: 'Алексей Иванов',
      desired_position: 'Senior Frontend Developer',
      city: 'Москва',
      skills: 'React, TypeScript, Next.js, Redux, GraphQL',
      about: 'Разрабатываю сложные веб-приложения более 6 лет. Люблю чистый код, менторство и оптимизацию производительности.'
    },
    en: {
      name: 'Alexey Ivanov',
      desired_position: 'Senior Frontend Developer',
      city: 'Moscow',
      skills: 'React, TypeScript, Next.js, Redux, GraphQL',
      about: 'Building complex web apps for 6+ years. Love clean code, mentoring and performance optimization.'
    }
  },
  {
    id: 2,
    experience_years: 4,
    expected_salary: 160000,
    portfolio_url: 'https://behance.net/mariapetrova',
    email: 'maria.p@example.com',
    phone: '+7 902 345 67 89',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    ru: {
      name: 'Мария Петрова',
      desired_position: 'UI/UX Designer',
      city: 'Санкт-Петербург',
      skills: 'Figma, Sketch, Prototyping, User Research, Design System',
      about: 'Создаю интерфейсы, которые любят пользователи. Работала над 20+ проектами в финтехе и e-commerce.'
    },
    en: {
      name: 'Maria Petrova',
      desired_position: 'UI/UX Designer',
      city: 'Saint Petersburg',
      skills: 'Figma, Sketch, Prototyping, User Research, Design System',
      about: 'Creating interfaces users love. Worked on 20+ projects in fintech and e-commerce.'
    }
  },
  {
    id: 3,
    experience_years: 5,
    expected_salary: 230000,
    portfolio_url: 'https://github.com/dsokolov',
    email: 'd.sokolov@example.com',
    phone: '+7 903 456 78 90',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    ru: {
      name: 'Дмитрий Соколов',
      desired_position: 'Backend Developer (Node.js)',
      city: 'Удалённо',
      skills: 'Node.js, NestJS, PostgreSQL, Docker, Kubernetes, AWS',
      about: 'Проектирую высоконагруженные системы. Опыт миграции монолита в микросервисы.'
    },
    en: {
      name: 'Dmitry Sokolov',
      desired_position: 'Backend Developer (Node.js)',
      city: 'Remote',
      skills: 'Node.js, NestJS, PostgreSQL, Docker, Kubernetes, AWS',
      about: 'Designing high-load systems. Experience migrating monolith to microservices.'
    }
  },
  {
    id: 4,
    experience_years: 7,
    expected_salary: 280000,
    portfolio_url: '',
    email: 'e.novikova@example.com',
    phone: '+7 904 567 89 01',
    created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
    ru: {
      name: 'Екатерина Новикова',
      desired_position: 'Product Manager',
      city: 'Москва',
      skills: 'Product Strategy, Analytics, A/B Testing, Roadmap, Agile',
      about: 'Запустила 3 продукта с нуля до миллиона пользователей. Умею работать с данными и командами.'
    },
    en: {
      name: 'Ekaterina Novikova',
      desired_position: 'Product Manager',
      city: 'Moscow',
      skills: 'Product Strategy, Analytics, A/B Testing, Roadmap, Agile',
      about: 'Launched 3 products from scratch to a million users. Skilled with data and teams.'
    }
  },
  {
    id: 5,
    experience_years: 5,
    expected_salary: 220000,
    portfolio_url: 'https://github.com/akuznetsov',
    email: 'a.kuznetsov@example.com',
    phone: '+7 905 678 90 12',
    created_at: new Date(Date.now() - 11 * 86400000).toISOString(),
    ru: {
      name: 'Артём Кузнецов',
      desired_position: 'DevOps Engineer',
      city: 'Казань',
      skills: 'Docker, Kubernetes, CI/CD, Terraform, Prometheus, Linux',
      about: 'Автоматизирую всё, что можно автоматизировать. Строю надёжную инфраструктуру для команд разработки.'
    },
    en: {
      name: 'Artem Kuznetsov',
      desired_position: 'DevOps Engineer',
      city: 'Kazan',
      skills: 'Docker, Kubernetes, CI/CD, Terraform, Prometheus, Linux',
      about: 'Automating everything that can be automated. Building reliable infrastructure for dev teams.'
    }
  },
  {
    id: 6,
    experience_years: 3,
    expected_salary: 130000,
    portfolio_url: '',
    email: 'o.morozova@example.com',
    phone: '+7 906 789 01 23',
    created_at: new Date(Date.now() - 13 * 86400000).toISOString(),
    ru: {
      name: 'Ольга Морозова',
      desired_position: 'Data Analyst',
      city: 'Новосибирск',
      skills: 'SQL, Python, Tableau, Power BI, Statistics',
      about: 'Превращаю данные в решения. Опыт в продуктовой и маркетинговой аналитике.'
    },
    en: {
      name: 'Olga Morozova',
      desired_position: 'Data Analyst',
      city: 'Novosibirsk',
      skills: 'SQL, Python, Tableau, Power BI, Statistics',
      about: 'Turning data into decisions. Experience in product and marketing analytics.'
    }
  }
];

// ============ TRANSLATIONS ============
const translations = {
  ru: {
    nav_jobs: 'Вакансии',
    nav_profiles: 'Специалисты',
    nav_profile: 'Анкета',
    nav_chat: 'Чат',
    search_prefix: 'Поиск:',
    no_jobs: 'Ничего не найдено',
    no_profiles: 'Ничего не найдено',
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
    pv_role: 'Тип аккаунта',
    edit_profile: 'Изменить анкету',
    edit: 'изменить',
    role_specialist_label: 'Специалист',
    role_company_label: 'Компания',
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
    chat_select: 'Откройте вакансию или специалиста и нажмите «Написать в чат»',
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
    discussed: 'Обсуждается',
    phone: 'Телефон'
  },
  en: {
    nav_jobs: 'Jobs',
    nav_profiles: 'Specialists',
    nav_profile: 'Profile',
    nav_chat: 'Chat',
    search_prefix: 'Search:',
    no_jobs: 'Nothing found',
    no_profiles: 'Nothing found',
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
    pv_role: 'Account type',
    edit_profile: 'Edit profile',
    edit: 'change',
    role_specialist_label: 'Specialist',
    role_company_label: 'Company',
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
    chat_select: 'Open a job or specialist and click "Write in chat"',
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
    discussed: 'Negotiable',
    phone: 'Phone'
  }
};

// ============ HELPERS ============
function getLocalizedJob(job) {
  const base = {
    id: job.id,
    category: job.category,
    employment_type: job.employment_type,
    salary_min: job.salary_min,
    salary_max: job.salary_max,
    contact_email: job.contact_email,
    contact_phone: job.contact_phone,
    created_at: job.created_at
  };
  return { ...base, ...(job[currentLang] || job.ru) };
}

function getLocalizedProfile(profile) {
  const base = {
    id: profile.id,
    experience_years: profile.experience_years,
    expected_salary: profile.expected_salary,
    portfolio_url: profile.portfolio_url,
    email: profile.email,
    phone: profile.phone,
    created_at: profile.created_at
  };
  return { ...base, ...(profile[currentLang] || profile.ru) };
}

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
  renderProfileView();

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
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>
      <line x1="12" y1="2" x2="12" y2="4"/>
      <line x1="12" y1="20" x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/>
      <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="4" y2="12"/>
      <line x1="20" y1="12" x2="22" y2="12"/>
      <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/>
      <line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/>
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

  const jobsSearch = document.getElementById('jobs-search');
  if (jobsSearch) jobsSearch.placeholder = t.search_prefix;
  const profilesSearch = document.getElementById('profiles-search');
  if (profilesSearch) profilesSearch.placeholder = t.search_prefix;

  if (currentPage === 'chat') updateChatUI();
  if (currentPage === 'create-profile') renderProfileView();

  if (currentPage === 'job-detail' && window.__currentJobId) {
    showJobDetail(window.__currentJobId);
  }
  if (currentPage === 'profile-detail' && window.__currentProfileId) {
    showProfileDetail(window.__currentProfileId);
  }

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

  const jobsSearch = document.getElementById('jobs-search');
  if (jobsSearch) {
    jobsSearch.addEventListener('input', filterJobs);
    jobsSearch.addEventListener('keyup', filterJobs);
  }

  const profilesSearch = document.getElementById('profiles-search');
  if (profilesSearch) {
    profilesSearch.addEventListener('input', filterProfiles);
    profilesSearch.addEventListener('keyup', filterProfiles);
  }

  const profileForm = document.getElementById('profile-form');
  if (profileForm) profileForm.addEventListener('submit', handleProfileSubmit);

  document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => switchAccountType(btn.dataset.type));
  });

  const profileEditBtn = document.getElementById('profile-edit-btn');
  if (profileEditBtn) profileEditBtn.addEventListener('click', openProfileEdit);

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

// ============ ACCOUNT TYPE ============
function switchAccountType(type) {
  accountType = type;
  document.querySelectorAll('.type-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.type === type);
  });
  document.querySelectorAll('.type-fields').forEach(el => {
    el.classList.toggle('hidden', el.dataset.typeFields !== type);
  });

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

  if (pageId === 'create-profile') {
    renderProfileView();
  }
}

// ============ DATA LOADING ============
function loadJobs() {
  jobsCache = [...HARDCODED_JOBS];
  renderJobs(jobsCache);
}

function loadProfiles() {
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

  container.innerHTML = jobs.map(rawJob => {
    const job = getLocalizedJob(rawJob);
    return `
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
    `;
  }).join('');
}

function renderProfiles(profiles) {
  const container = document.getElementById('profiles-list');
  if (!container) return;

  if (!profiles.length) {
    showEmptyState(container.id, translations[currentLang].no_profiles);
    return;
  }

  container.innerHTML = profiles.map(rawProfile => {
    const profile = getLocalizedProfile(rawProfile);
    return `
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
    `;
  }).join('');
}

function showEmptyState(containerId, message) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <p>${message}</p>
    </div>
  `;
}

// ============ FILTERING ============
function filterJobs() {
  const input = document.getElementById('jobs-search');
  if (!input) return;
  const query = (input.value || '').toLowerCase().trim();

  if (!query) {
    renderJobs(jobsCache);
    return;
  }

  const words = query.split(/\s+/).filter(Boolean);

  const filtered = jobsCache.filter(rawJob => {
    const job = getLocalizedJob(rawJob);
    const haystack = [
      job.title, job.company, job.location, job.description,
      job.requirements || '', job.benefits || '',
      getCategoryLabel(job.category),
      getEmploymentLabel(job.employment_type),
      job.salary_min ? String(job.salary_min) : '',
      job.salary_max ? String(job.salary_max) : ''
    ].join(' ').toLowerCase();

    return words.every(w => haystack.includes(w));
  });

  renderJobs(filtered);
}

function filterProfiles() {
  const input = document.getElementById('profiles-search');
  if (!input) return;
  const query = (input.value || '').toLowerCase().trim();

  if (!query) {
    renderProfiles(profilesCache);
    return;
  }

  const words = query.split(/\s+/).filter(Boolean);

  const filtered = profilesCache.filter(rawProfile => {
    const profile = getLocalizedProfile(rawProfile);
    const haystack = [
      profile.name, profile.desired_position, profile.city,
      profile.skills || '', profile.about || '',
      profile.experience_years ? String(profile.experience_years) : '',
      profile.expected_salary ? String(profile.expected_salary) : ''
    ].join(' ').toLowerCase();

    return words.every(w => haystack.includes(w));
  });

  renderProfiles(filtered);
}

// ============ PROFILE VIEW / EDIT ============
function renderProfileView() {
  const viewEl = document.getElementById('profile-view');
  const editEl = document.getElementById('profile-edit');
  if (!viewEl || !editEl) return;

  if (!currentUser) {
    viewEl.classList.add('hidden');
    editEl.classList.remove('hidden');
    return;
  }

  viewEl.classList.remove('hidden');
  editEl.classList.add('hidden');

  const t = translations[currentLang];
  const isCompany = currentUser.type === 'company';

  const roleEl = document.getElementById('pv-role');
  if (roleEl) roleEl.textContent = isCompany ? t.role_company_label : t.role_specialist_label;

  const fields = [];
  const push = (label, value) => {
    fields.push({ label, value: (value === 0 || value) ? String(value) : '—' });
  };

  if (isCompany) {
    push(t.f_company_name, currentUser.company_name);
    push(t.f_name, currentUser.name);
    push(t.f_city, currentUser.city);
    push(t.f_industry, currentUser.industry);
    push(t.f_email, currentUser.email);
    push(t.f_phone, currentUser.phone);
    push(t.f_website, currentUser.website);
    push(t.f_company_about, currentUser.company_about);
  } else {
    push(t.f_name, currentUser.name);
    push(t.f_position, currentUser.position);
    push(t.f_city, currentUser.city);
    push(t.f_exp, currentUser.experience);
    push(t.f_salary, currentUser.expected_salary);
    push(t.f_skills, currentUser.skills);
    push(t.f_about, currentUser.about);
    push(t.f_portfolio, currentUser.portfolio);
    push(t.f_email, currentUser.email);
    push(t.f_phone, currentUser.phone);
  }

  const container = document.getElementById('profile-view-fields');
  container.innerHTML = fields.map(f => `
    <div class="pv-row">
      <span class="pv-label">${escapeHtml(f.label)}</span>
      <span class="pv-value">${escapeHtml(f.value)}</span>
      <button type="button" class="pv-change">${t.edit}</button>
    </div>
  `).join('');

  container.querySelectorAll('.pv-change').forEach(btn => {
    btn.addEventListener('click', openProfileEdit);
  });

  const editBtn = document.getElementById('profile-edit-btn');
  if (editBtn) editBtn.textContent = t.edit_profile;
}

function openProfileEdit() {
  const viewEl = document.getElementById('profile-view');
  const editEl = document.getElementById('profile-edit');
  if (!viewEl || !editEl) return;

  viewEl.classList.add('hidden');
  editEl.classList.remove('hidden');

  const form = document.getElementById('profile-form');
  if (!form || !currentUser) return;

  switchAccountType(currentUser.type || 'specialist');

  form.name.value = currentUser.name || '';
  form.city.value = currentUser.city || '';
  form.email.value = currentUser.email || '';
  form.phone.value = currentUser.phone || '';

  if (form.desired_position) form.desired_position.value = currentUser.position || '';
  if (form.experience_years) form.experience_years.value = currentUser.experience != null ? currentUser.experience : '';
  if (form.expected_salary) form.expected_salary.value = currentUser.expected_salary != null ? currentUser.expected_salary : '';
  if (form.skills) form.skills.value = currentUser.skills || '';
  if (form.about) form.about.value = currentUser.about || '';
  if (form.portfolio_url) form.portfolio_url.value = currentUser.portfolio || '';

  if (form.company_name) form.company_name.value = currentUser.company_name || '';
  if (form.industry) form.industry.value = currentUser.industry || '';
  if (form.website) form.website.value = currentUser.website || '';
  if (form.company_about) form.company_about.value = currentUser.company_about || '';
}

// ============ PROFILE SUBMIT ============
function handleProfileSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  if (data.experience_years) data.experience_years = parseInt(data.experience_years);
  if (data.expected_salary) data.expected_salary = parseInt(data.expected_salary);

  currentUser = {
    type: accountType,
    name: data.name || '',
    email: data.email || '',
    city: data.city || '',
    phone: data.phone || '',
    position: data.desired_position || '',
    experience: data.experience_years || null,
    expected_salary: data.expected_salary || null,
    skills: data.skills || '',
    about: data.about || '',
    portfolio: data.portfolio_url || '',
    company_name: data.company_name || '',
    industry: data.industry || '',
    website: data.website || '',
    company_about: data.company_about || ''
  };

  localStorage.setItem('smw_user', JSON.stringify(currentUser));
  alert(translations[currentLang].alert_profile_saved);
  renderProfileView();
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
    container.innerHTML = '';
    return;
  }

  container.innerHTML = dialogs.map(dId => {
    const [type, idStr] = dId.split(':');
    const id = parseInt(idStr);
    let title = '', subtitle = '';

    if (type === 'job') {
      const raw = jobsCache.find(j => j.id === id);
      if (!raw) return '';
      const job = getLocalizedJob(raw);
      title = job.title;
      subtitle = job.company;
    } else {
      const raw = profilesCache.find(p => p.id === id);
      if (!raw) return '';
      const prof = getLocalizedProfile(raw);
      title = prof.name;
      subtitle = prof.desired_position;
    }

    const active = activeDialogId === dId ? 'active' : '';
    return `
      <div class="chat-dialog-item ${active}" onclick="selectDialog('${dId}')">
        ${escapeHtml(title)}
        <small>${escapeHtml(subtitle)}</small>
        <span class="del" onclick="event.stopPropagation(); deleteDialog('${dId}')" title="✕">✕</span>
      </div>
    `;
  }).join('');
}

window.selectDialog = function(dialogId) {
  activeDialogId = dialogId;
  renderChatDialogList();
  updateChatUI();
};

window.deleteDialog = function(dialogId) {
  if (!confirm(currentLang === 'ru' ? 'Удалить диалог?' : 'Delete dialog?')) return;
  let dialogs = getDialogs();
  dialogs = dialogs.filter(d => d !== dialogId);
  saveDialogs(dialogs);

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
    const raw = jobsCache.find(j => j.id === id);
    if (raw) {
      const job = getLocalizedJob(raw);
      title = `${job.title} — ${job.company}`;
    }
  } else {
    const raw = profilesCache.find(p => p.id === id);
    if (raw) {
      const prof = getLocalizedProfile(raw);
      title = `${prof.name} — ${prof.desired_position}`;
    }
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
  window.__currentJobId = jobId;
  const raw = jobsCache.find(j => j.id === jobId);
  if (!raw) return;
  const job = getLocalizedJob(raw);
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
      ${job.contact_phone ? `<p><strong>${t.phone}:</strong> <a href="tel:${escapeHtml(job.contact_phone)}">${escapeHtml(job.contact_phone)}</a></p>` : ''}
    </div>
    <button class="btn-primary" style="margin-top:24px;" onclick="openChatForJob(${job.id})">${t.detail_write_chat}</button>
    <p style="margin-top: 24px; font-size: 12px; color: var(--muted);">
      ${t.detail_published}: ${formatDate(job.created_at)}
    </p>
  `;

  navigateTo('job-detail');
};

window.showProfileDetail = function(profileId) {
  window.__currentProfileId = profileId;
  const raw = profilesCache.find(p => p.id === profileId);
  if (!raw) return;
  const profile = getLocalizedProfile(raw);
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
      ${profile.phone ? `<p><strong>${t.phone}:</strong> <a href="tel:${escapeHtml(profile.phone)}">${escapeHtml(profile.phone)}</a></p>` : ''}
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
  const dialogId = `job:${jobId}`;
  addDialog(dialogId);
  activeDialogId = dialogId;
  renderChatDialogList();
  navigateTo('chat');
  updateChatUI();
};

window.openChatForProfile = function(profileId) {
  if (!currentUser) {
    alert(translations[currentLang].alert_need_profile);
    navigateTo('create-profile');
    return;
  }
  const dialogId = `profile:${profileId}`;
  addDialog(dialogId);
  activeDialogId = dialogId;
  renderChatDialogList();
  navigateTo('chat');
  updateChatUI();
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
