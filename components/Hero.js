'use client'

import Link from 'next/link'
import { useApp } from '@/lib/context'
import { Sparkles } from 'lucide-react'

export default function Hero() {
  const { t } = useApp()

  return (
    <section className="relative overflow-hidden">
      <div className="gradient-bg text-white">
        <div className="max-w-5xl mx-auto text-center px-4 py-24">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm mb-6">
            <Sparkles size={14} />
            <span>SearchMyWork</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            {t('hero_title')}
          </h1>
          <p className="text-lg md:text-xl text-white/85 mb-10 max-w-2xl mx-auto">
            {t('hero_subtitle')}
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <a href="#jobs" className="btn bg-white text-gray-900 hover:opacity-90">
              {t('hero_cta')}
            </a>
            <Link href="/job-form" className="btn btn-ghost !text-white !border-white/40 hover:!bg-white/10">
              {t('nav_post_job')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
