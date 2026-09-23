'use client'

import { useApp } from '@/lib/context'

export default function Footer() {
  const { t } = useApp()

  return (
    <footer
      className="border-t mt-16 py-10"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="font-extrabold text-lg gradient-text mb-2">SearchMyWork</div>
          <p style={{ color: 'var(--muted)' }}>
            {t('hero_subtitle')}
          </p>
        </div>
        <div>
          <div className="font-semibold mb-2">{t('nav_jobs')}</div>
          <ul className="space-y-1" style={{ color: 'var(--muted)' }}>
            <li><a href="/" className="hover:opacity-70">{t('nav_jobs')}</a></li>
            <li><a href="/offers" className="hover:opacity-70">{t('nav_offers')}</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Email</div>
          <p style={{ color: 'var(--muted)' }}>info@searchmywork.com</p>
        </div>
      </div>
      <div
        className="text-center text-xs mt-8 pt-6 border-t"
        style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}
      >
        © {new Date().getFullYear()} SearchMyWork
      </div>
    </footer>
  )
}
