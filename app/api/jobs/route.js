import { supabase } from '@/lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const location = searchParams.get('location')
    const salary_min = searchParams.get('salary_min')
    const category = searchParams.get('category')
    const employment_type = searchParams.get('employment_type')
    const sort = searchParams.get('sort') || 'new'

    let query = supabase.from('jobs').select('*')

    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,company_id.ilike.%${search}%`)
    if (location) query = query.eq('location', location)
    if (salary_min) query = query.gte('salary_from', parseInt(salary_min))
    if (category) query = query.eq('category', category)
    if (employment_type) query = query.eq('employment_type', employment_type)

    if (sort === 'salary_high') query = query.order('salary_from', { ascending: false })
    else if (sort === 'salary_low') query = query.order('salary_from', { ascending: true })
    else query = query.order('created_at', { ascending: false })

    const { data, error } = await query
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
      .insert([{
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
      }])
      .select()
    if (error) throw error
    return Response.json({ data }, { status: 201 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
