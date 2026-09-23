'use client'

import { useApp } from '@/lib/context'
import { Search, SlidersHorizontal } from 'lucide-react'

const CATEGORIES = ['IT', 'Дизайн', 'Маркетинг', 'Продажи', 'HR', 'Финансы']
const LOCATIONS = ['Москва', 'Санкт-Петербург', 'Берлин', 'Удалённо']

export default function SearchBar({ filters, setFilters, onSearch }) {
  const { t } = useApp()

  const update = (key, value) => setFilters({ ...filters, [key]: value })

  return (
    <div className="card p-5 mb-8">
      <form onSubmit={onSearch} className="grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--muted)' }}
          />
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            className="input !pl-11"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          <Search size={16} />
          {t('search_button')}
        </button>
      </form>

      <div className="flex items-center gap-2 mt-4 mb-3 text-sm font-semibold" style={{ color: 'var(--muted)' }}>
        <SlidersHorizontal size={14} />
        {t('filters')}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <select
          className="input"
          value={filters.category}
          onChange={(e) => update('category', e.target.value)}
        >
          <option value="">{t('all_categories')}</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className="input"
          value={filters.location}
          onChange={(e) => update('location', e.target.value)}
        >
          <option value="">{t('all_locations')}</option>
          {LOCATIONS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <input
          type="number"
          className="input"
          placeholder={t('salary_from')}
          value={filters.salary_min}
          onChange={(e) => update('salary_min', e.target.value)}
        />

        <select
          className="input"
          value={filters.employment_type}
          onChange={(e) => update('employment_type', e.target.value)}
        >
          <option value="">{t('all_types')}</option>
          <option value="full-time">{t('full_time')}</option>
          <option value="part-time">{t('part_time')}</option>
          <option value="freelance">{t('freelance')}</option>
          <option value="contract">{t('contract')}</option>
        </select>
      </div>

      <div className="mt-3">
        <select
          className="input"
          value={filters.sort}
          onChange={(e) => update('sort', e.target.value)}
        >
          <option value="new">{t('sort_new')}</option>
          <option value="salary_high">{t('sort_salary_high')}</option>
          <option value="salary_low">{t('sort_salary_low')}</option>
        </select>
      </div>
    </div>
  )
}
