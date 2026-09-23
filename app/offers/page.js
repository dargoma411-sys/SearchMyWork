'use client'

import { useState, useEffect } from 'react'
import Hero from '@/components/Hero'

export default function OffersPage() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(false)
  const [specialty, setSpecialty] = useState('')

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (specialty) params.append('specialty', specialty)

      const res = await fetch(`/api/offers?${params}`)
      const data = await res.json()
      setOffers(data.data || [])
    } catch (error) {
      console.error('Error fetching offers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchOffers()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Hero />

      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">💼 Предложения соискателей</h2>

        <form onSubmit={handleSearch} className="mb-8 flex gap-4">
          <input
            type="text" placeholder="Специальность..."
            value={specialty} onChange={(e) => setSpecialty(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
          >
            🔍 Поиск
          </button>
        </form>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Загрузка...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">😅 Предложений не найдено</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{offer.name}</h3>
                    <p className="text-gray-600">💼 {offer.specialty}</p>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {offer.expected_salary} ₽
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{offer.bio}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {offer.skills && offer.skills.split(',').slice(0, 4).map((skill, i) => (
                    <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {skill.trim()}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                  <div>📍 {offer.location}</div>
                  <div>⏱️ {offer.experience_years} лет опыта</div>
                  <div>📧 {offer.email}</div>
                  {offer.telegram && <div>💬 {offer.telegram}</div>}
                </div>

                {offer.portfolio_url && (
                  <a
                    href={offer.portfolio_url} target="_blank" rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                  >
                    🔗 Портфолио
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
