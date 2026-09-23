import { supabase } from '@/lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const location = searchParams.get('location')
    const salary_min = searchParams.get('salary_min')

    let query = supabase.from('jobs').select('*')

    if (search) query = query.ilike('title', `%${search}%`)
    if (location) query = query.eq('location', location)
    if (salary_min) query = query.gte('salary_from', parseInt(salary_min))

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return Response.json({ data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          title: body.title,
          description: body.description,
          company_id: body.company_id,
          salary_from: body.salary_from,
          salary_to: body.salary_to,
          experience_years: body.experience_years,
          location: body.location,
          employment_type: body.employment_type,
          skills: body.skills,
          category: body.category,
          expires_at: body.expires_at,
        }
      ])
      .select()

    if (error) throw error
    return Response.json({ data }, { status: 201 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
