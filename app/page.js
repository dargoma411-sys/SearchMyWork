'use client'

import { useState, useEffect } from 'react'
import Hero from '@/components/Hero'
import SearchBar from '@/components/SearchBar'
import JobsList from '@/components/JobsList'
import { useApp } from '@/lib/context'
import { Briefcase, Users } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const { t } = useApp()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: '',
    salary_min: '',
    employment_type: '',
    sort: 'new',
  })

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.append(k, v)
      })
      const res = await fetch(`/api/jobs?${params}`)
      const data = await res.json()
      setJobs(data.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchJobs()
  }

  return (
    <>
      <Hero />

      <section id="jobs" className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link href="/job-form" className="card p-6 hover:shadow-lg transition flex items-center gap-4">
            <div className="gradient-bg p-3 rounded-xl text-white"><Briefcase size={22} /></div>
            <div>
              <div className="font-bold">{t('nav_post_job')}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Для компаний</div>
            </div>
          </Link>
          <Link href="/offer-form" className="card p-6 hover:shadow-lg transition flex items-center gap-4">
            <div className="p-3 rounded-xl text-white" style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
              <Users size={22} />
            </div>
            <div>
              <div className="font-bold">{t('nav_offers')}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Для соискателей</div>
            </div>
          </Link>
        </div>

        <SearchBar filters={filters} setFilters={setFilters} onSearch={handleSearch} />

        {loading ? (
          <div className="text-center py-12" style={{ color: 'var(--muted)' }}>
            {t('loading')}
          </div>
        ) : (
          <JobsList jobs={jobs} />
        )}
      </section>
    </>
  )
}
