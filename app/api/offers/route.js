import { supabase } from '@/lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const specialty = searchParams.get('specialty')
    const location = searchParams.get('location')

    let query = supabase.from('offers').select('*')

    if (specialty) query = query.ilike('specialty', `%${specialty}%`)
    if (location) query = query.eq('location', location)

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
      .from('offers')
      .insert([
        {
          user_id: body.user_id,
          name: body.name,
          specialty: body.specialty,
          expected_salary: body.expected_salary,
          experience_years: body.experience_years,
          location: body.location,
          skills: body.skills,
          bio: body.bio,
          phone: body.phone,
          telegram: body.telegram,
          email: body.email,
          portfolio_url: body.portfolio_url,
        }
      ])
      .select()

    if (error) throw error
    return Response.json({ data }, { status: 201 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
