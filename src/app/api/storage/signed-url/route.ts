import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { filename, contentType } = await request.json()

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 })
    }

    const { data, error } = await supabase.storage
      .from('recordings')
      .createSignedUploadUrl(filename)

    if (error) {
      console.error('Error creating signed upload URL:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      signedUrl: data.signedUrl,
      path: data.path,
      token: data.token 
    })
  } catch (error) {
    console.error('Signed URL error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
