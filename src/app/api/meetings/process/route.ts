import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import openai from '@/lib/openai'
import axios from 'axios'
import { z } from 'zod'
import { MeetingStatus } from '@prisma/client'

const processSchema = z.object({
  meetingId: z.string().uuid(),
  audioUrl: z.string().url(),
})

export async function POST(request: Request) {
  let meetingId: string | undefined
  try {
    const body = await request.json()
    const validated = processSchema.parse(body)
    meetingId = validated.meetingId
    const { audioUrl } = validated

    // 1. Update status to PROCESSING
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { status: MeetingStatus.PROCESSING, audioUrl },
    })

    // 2. Download audio file
    const response = await axios.get(audioUrl, { responseType: 'arraybuffer' })
    const audioBuffer = Buffer.from(response.data)

    // 3. Transcribe with Whisper
    // We need to create a File object for the OpenAI SDK
    const file = new File([audioBuffer], 'audio.mp3', { type: 'audio/mpeg' })
    
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    })

    const transcript = transcription.text

    // 4. Generate Summary, TLDR, and Action Items with GPT-4o
    const prompt = `
      Analyze the following meeting transcript and provide:
      1. A concise TLDR (max 3 sentences).
      2. A structured summary with bullet points.
      3. A list of specific action items.

      Format the output as JSON with the following keys:
      {
        "tldr": "...",
        "summary": "...",
        "actionItems": ["...", "..."]
      }

      Transcript:
      ${transcript}
    `

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that summarizes meetings.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    })

    const result = JSON.parse(aiResponse.choices[0].message.content || '{}')

    // 5. Update database with results
    await prisma.$transaction(async (tx) => {
      await tx.meeting.update({
        where: { id: meetingId },
        data: {
          transcript,
          summary: result.summary,
          tldr: result.tldr,
          status: MeetingStatus.COMPLETED,
        },
      })

      if (result.actionItems && Array.isArray(result.actionItems)) {
        await tx.actionItem.createMany({
          data: result.actionItems.map((item: string) => ({
            meetingId,
            content: item,
          })),
        })
      }
    })

    return NextResponse.json({ success: true, meetingId })
  } catch (error: any) {
    console.error('Processing error:', error)
    
    // Attempt to mark as failed if we have a meetingId
    try {
      if (meetingId) {
        await prisma.meeting.update({
          where: { id: meetingId },
          data: { status: MeetingStatus.FAILED },
        })
      }
    } catch (e) {
      // Ignore secondary error
    }

    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
