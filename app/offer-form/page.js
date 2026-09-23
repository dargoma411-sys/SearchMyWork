'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OfferForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    specialty: '',
    expected_salary: '',
    experience_years: '',
    location: '',
    skills: '',
    bio: '',
    phone: '',
    telegram: '',
    email: '',
    portfolio_url: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          user_id: Date.now().toString()
        })
      })

      if (res.ok) {
        alert('✅ Ваше предложение успешно размещено!')
        router.push('/offers')
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
        <h1 className="text-3xl font-bold mb-8">💼 Создать предложение о работе</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text" name="name" placeholder="Ваше имя *"
              value={formData.name} onChange={handleChange} required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text" name="specialty" placeholder="Специальность *"
              value={formData.specialty} onChange={handleChange} required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <textarea
            name="bio" placeholder="Расскажи о себе *"
            value={formData.bio} onChange={handleChange} required rows="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input
              type="number" name="expected_salary" placeholder="Желаемая зарплата *"
              value={formData.expected_salary} onChange={handleChange} required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number" name="experience_years" placeholder="Опыт (лет) *"
              value={formData.experience_years} onChange={handleChange} required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text" name="location" placeholder="Город *"
              value={formData.location} onChange={handleChange} required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <input
            type="text" name="skills" placeholder="Навыки (через запятую) *"
            value={formData.skills} onChange={handleChange} required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />

          <div className="border-t pt-6">
            <h2 className="font-bold mb-4">📞 Контактная информация</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="email" name="email" placeholder="Email *"
                value={formData.email} onChange={handleChange} required
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                type="tel" name="phone" placeholder="Телефон"
                value={formData.phone} onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <input
                type="text" name="telegram" placeholder="Telegram"
                value={formData.telegram} onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                type="url" name="portfolio_url" placeholder="Портфолио (ссылка)"
                value={formData.portfolio_url} onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? '⏳ Загрузка...' : '📤 Опубликовать предложение'}
          </button>
        </form>
      </div>
    </div>
  )
}
