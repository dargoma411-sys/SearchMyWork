import Link from 'next/link'

export default function JobsList({ jobs }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-gray-500 text-lg">😅 Вакансий не найдено</p>
        <p className="text-gray-400 text-sm mt-2">Попробуй изменить фильтры или вернись позже</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-blue-500">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
              <p className="text-gray-600">🏢 {job.company_id}</p>
            </div>
            <span className="text-2xl font-bold text-green-600">
              {job.salary_from} ₽
            </span>
          </div>

          <p className="text-gray-700 mb-4">{job.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills && job.skills.split(',').slice(0, 3).map((skill, i) => (
              <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {skill.trim()}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex gap-4">
              <span>📍 {job.location}</span>
              <span>⏱️ {job.experience_years} лет опыта</span>
            </div>
            <span className="text-xs bg-gray-100 px-3 py-1 rounded">
              {job.employment_type}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
