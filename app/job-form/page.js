'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function JobForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company_id: '',
    salary_from: '',
    salary_to: '',
    experience_years: '',
    location: '',
    employment_type: 'full-time',
    skills: '',
    category: '',
    expires_at: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        alert('✅ Вакансия успешно размещена!')
        router.push('/')
      } else {
        const err = await res.json()
        alert('❌ Ошибка: ' + (err.error || 'неизвестно'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-8">📝 Разместить вакансию</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text" name="title" placeholder="Название должности *"
              value={formData.title} onChange={handleChange} required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text" name="company_id" placeholder="Название компании *"
              value={formData.company_id} onChange={handleChange} required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <textarea
            name="description" placeholder="Описание вакансии *"
            value={formData.description} onChange={handleChange} required rows="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input
              type="number" name="salary_from" placeholder="Зарплата от *"
              value={formData.salary_from} onChange={handleChange} required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number" name="salary_to" placeholder="Зарплата до"
              value={formData.salary_to} onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number" name="experience_years" placeholder="Опыт (лет) *"
              value={formData.experience_years} onChange={handleChange} required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text" name="location" placeholder="Локация *"
              value={formData.location} onChange={handleChange} required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="employment_type" value={formData.employment_type} onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="full-time">Полный день</option>
              <option value="part-time">Неполный день</option>
              <option value="freelance">Фриланс</option>
              <option value="contract">Контракт</option>
            </select>
          </div>

          <input
            type="text" name="skills" placeholder="Навыки (через запятую) *"
            value={formData.skills} onChange={handleChange} required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text" name="category" placeholder="Категория (IT, HR...) *"
            value={formData.category} onChange={handleChange} required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date" name="expires_at"
            value={formData.expires_at} onChange={handleChange} required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? '⏳ Загрузка...' : '📤 Разместить вакансию'}
          </button>
        </form>
      </div>
    </div>
  )
}
