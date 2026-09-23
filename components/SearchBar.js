export default function SearchBar({ search, setSearch, onSearch }) {
  return (
    <form onSubmit={onSearch} className="mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Должность, навыки, компания..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Все города</option>
          <option>Москва</option>
          <option>Санкт-Петербург</option>
          <option>Удалённо</option>
        </select>
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          🔍 Поиск
        </button>
      </div>
    </form>
  )
}
