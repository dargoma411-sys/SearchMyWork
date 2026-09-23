'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext()

const translations = {
  ru: {
    nav_jobs: 'Вакансии',
    nav_offers: 'Соискатели',
    nav_post_job: 'Разместить вакансию',
    hero_title: 'Найди работу мечты',
    hero_subtitle: 'Тысячи вакансий и талантов в одном месте',
    hero_cta: 'Найти работу',
    search_placeholder: 'Должность, навыки, компания...',
    search_button: 'Найти',
    filters: 'Фильтры',
    category: 'Категория',
    location: 'Локация',
    salary_from: 'Зарплата от',
    employment: 'Тип занятости',
    sort: 'Сортировка',
    sort_new: 'Сначала новые',
    sort_salary_high: 'Зарплата ↑',
    sort_salary_low: 'Зарплата ↓',
    all_categories: 'Все категории',
    all_locations: 'Все города',
    all_types: 'Любой',
    full_time: 'Полный день',
    part_time: 'Неполный день',
    freelance: 'Фриланс',
    contract: 'Контракт',
    remote: 'Удалённо',
    years: 'лет',
    no_jobs: 'Вакансии не найдены',
    no_jobs_hint: 'Попробуйте изменить фильтры',
    loading: 'Загрузка...',
    apply: 'Откликнуться',
    stats_jobs: 'вакансий',
  },
  en: {
    nav_jobs: 'Jobs',
    nav_offers: 'Candidates',
    nav_post_job: 'Post a job',
    hero_title: 'Find your dream job',
    hero_subtitle: 'Thousands of jobs and talents in one place',
    hero_cta: 'Find a job',
    search_placeholder: 'Position, skills, company...',
    search_button: 'Search',
    filters: 'Filters',
    category: 'Category',
    location: 'Location',
    salary_from: 'Salary from',
    employment: 'Employment',
    sort: 'Sort',
    sort_new: 'Newest first',
    sort_salary_high: 'Salary ↑',
    sort_salary_low: 'Salary ↓',
    all_categories: 'All categories',
    all_locations: 'All locations',
    all_types: 'Any',
    full_time: 'Full-time',
    part_time: 'Part-time',
    freelance: 'Freelance',
    contract: 'Contract',
    remote: 'Remote',
    years: 'years',
    no_jobs: 'No jobs found',
    no_jobs_hint: 'Try changing filters',
    loading: 'Loading...',
    apply: 'Apply',
    stats_jobs: 'jobs',
  },
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const [lang, setLang] = useState('ru')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    const savedLang = localStorage.getItem('lang') || 'ru'
    setTheme(savedTheme)
    setLang(savedLang)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  const toggleLang = () => {
    const next = lang === 'ru' ? 'en' : 'ru'
    setLang(next)
    localStorage.setItem('lang', next)
  }

  const t = (key) => translations[lang][key] || key

  return (
    <AppContext.Provider value={{ theme, lang, toggleTheme, toggleLang, t }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
