import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          🔍 SearchMyWork
        </Link>

        <nav className="flex gap-6 items-center">
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
            🏠 Вакансии
          </Link>
          <Link href="/offers" className="text-gray-700 hover:text-blue-600 transition">
            💼 Предложения
          </Link>
          <Link href="/job-form" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Разместить вакансию
          </Link>
          <Link href="/offer-form" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            Создать предложение
          </Link>
        </nav>
      </div>
    </header>
  )
}
