export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">SearchMyWork</h3>
            <p className="text-sm">Платформа для поиска работы и размещения вакансий</p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Для соискателей</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white">Поиск вакансий</a></li>
              <li><a href="/offer-form" className="hover:text-white">Создать предложение</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Для работодателей</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/offers" className="hover:text-white">Найти таланты</a></li>
              <li><a href="/job-form" className="hover:text-white">Разместить вакансию</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Контакты</h4>
            <p className="text-sm">📧 info@searchmywork.com</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; 2024 SearchMyWork. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
