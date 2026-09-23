import { supabase } from '@/lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return Response.json({ error: 'user_id required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user_id},recipient_id.eq.${user_id}`)
      .order('created_at', { ascending: false })

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
      .from('messages')
      .insert([
        {
          sender_id: body.sender_id,
          recipient_id: body.recipient_id,
          content: body.content,
          job_id: body.job_id,
        }
      ])
      .select()

    if (error) throw error
    return Response.json({ data }, { status: 201 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
