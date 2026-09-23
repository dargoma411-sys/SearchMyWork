'use client'

import { useApp } from '@/lib/context'
import { MapPin, Clock, Building2, Briefcase } from 'lucide-react'

export default function JobsList({ jobs }) {
  const { t } = useApp()

  if (jobs.length === 0) {
    return (
      <div className="card p-12 text-center">
        <Briefcase size={48} className="mx-auto mb-4" style={{ color: 'var(--muted)' }} />
        <p className="text-lg font-semibold mb-1">{t('no_jobs')}</p>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{t('no_jobs_hint')}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <article
          key={job.id}
          className="card p-6 hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
        >
          <div className="flex justify-between items-start gap-4 mb-3">
            <div>
              <h3 className="text-xl font-bold mb-1">{job.title}</h3>
              <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--muted)' }}>
                <Building2 size={14} />
                {job.company_id}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold gradient-text whitespace-nowrap">
                {job.salary_from?.toLocaleString('ru')} ₽
              </div>
              {job.salary_to && (
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  до {job.salary_to.toLocaleString('ru')} ₽
                </div>
              )}
            </div>
          </div>

          <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--muted)' }}>
            {job.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills?.split(',').slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: 'rgba(79,70,229,0.1)', color: '#4F46E5' }}
              >
                {skill.trim()}
              </span>
            ))}
          </div>

          <div
            className="flex flex-wrap justify-between items-center gap-3 text-xs pt-4 border-t"
            style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}
          >
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {job.experience_years} {t('years')}
              </span>
            </div>
            <span
              className="px-3 py-1 rounded-full font-medium"
              style={{ background: 'var(--bg)' }}
            >
              {t(job.employment_type?.replace('-', '_')) || job.employment_type}
            </span>
          </div>
        </article>
      ))}
    </div>
  )
}
