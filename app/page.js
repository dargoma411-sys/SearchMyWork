'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import JobsList from '@/components/JobsList'
import SearchBar from '@/components/SearchBar'
import Hero from '@/components/Hero'

export default function Home() {
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async (filters = {}) => {
    setLoading(true)
    try {
      const params = new URLSearchParams(filters)
      if (search) params.append('search', search)

      const res = await fetch(`/api/jobs?${params}`)
      const data = await res.json()
      setJobs(data.data || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchJobs()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Hero />

      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/job-form" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border-l-4 border-blue-500">
            <h3 className="font-bold text-lg mb-2">📝 Разместить вакансию</h3>
            <p className="text-gray-600 text-sm">Для работодателей и компаний</p>
          </Link>

          <Link href="/offer-form" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border-l-4 border-green-500">
            <h3 className="font-bold text-lg mb-2">💼 Создать предложение</h3>
            <p className="text-gray-600 text-sm">Для соискателей и фрилансеров</p>
          </Link>

          <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
            <h3 className="font-bold text-lg mb-2">📊 Статистика</h3>
            <p className="text-sm">{jobs.length} вакансий</p>
          </div>
        </div>

        <SearchBar search={search} setSearch={setSearch} onSearch={handleSearch} />

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Загрузка...</p>
          </div>
        ) : (
          <JobsList jobs={jobs} />
        )}
      </section>
    </main>
  )
}
