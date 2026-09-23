'use client'

import Link from 'next/link'
import { useApp } from '@/lib/context'
import { Briefcase, Moon, Sun, Languages, Search } from 'lucide-react'

export default function Header() {
  const { theme, toggleTheme, lang, toggleLang, t } = useApp()

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl">
          <span className="gradient-bg p-2 rounded-xl text-white">
            <Search size={18} />
          </span>
          <span className="gradient-text">SearchMyWork</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:opacity-70 transition">
            {t('nav_jobs')}
          </Link>
          <Link href="/offers" className="hover:opacity-70 transition">
            {t('nav_offers')}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={toggleLang} className="btn btn-ghost !p-2" title="RU / EN">
            <Languages size={18} />
            <span className="text-xs font-bold uppercase">{lang}</span>
          </button>

          <button onClick={toggleTheme} className="btn btn-ghost !p-2" title="Theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <Link href="/job-form" className="btn btn-primary hidden sm:inline-flex">
            <Briefcase size={16} />
            {t('nav_post_job')}
          </Link>
        </div>
      </div>
    </header>
  )
}
