import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { google } from 'googleapis'
import { z } from 'zod'

const exportSchema = z.object({
  meetingId: z.string().uuid(),
  accessToken: z.string().optional(), // Should be provided by frontend via Clerk
})

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { meetingId, accessToken } = exportSchema.parse(body)

    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: { actionItems: true, user: true }
    })

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }

    if (meeting.user.externalId !== clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Google Access Token is required' }, { status: 400 })
    }

    const authClient = new google.auth.OAuth2()
    authClient.setCredentials({ access_token: accessToken })

    const docs = google.docs({ version: 'v1', auth: authClient })
    const drive = google.drive({ version: 'v3', auth: authClient })

    // 1. Create a new document
    const doc = await docs.documents.create({
      requestBody: {
        title: meeting.title || 'Meeting Notes',
      },
    })

    const documentId = doc.data.documentId
    if (!documentId) {
      throw new Error('Failed to create document')
    }

    // 2. Insert content
    const requests = [
      {
        insertText: {
          location: { index: 1 },
          text: `TLDR\n${meeting.tldr || 'No TLDR available.'}\n\nSummary\n${meeting.summary || 'No summary available.'}\n\n`,
        },
      },
    ]

    if (meeting.actionItems.length > 0) {
      const actionItemsText = meeting.actionItems
        .map((item) => `- [${item.completed ? 'x' : ' '}] ${item.content}`)
        .join('\n')
      
      requests.push({
        insertText: {
          endOfSegmentLocation: { segmentId: '' },
          text: `Action Items\n${actionItemsText}\n\n`,
        },
      })
    }

    requests.push({
      insertText: {
        endOfSegmentLocation: { segmentId: '' },
        text: `Full Transcript\n${meeting.transcript || ''}`,
      },
    })

    await docs.documents.batchUpdate({
      documentId: documentId,
      requestBody: {
        requests: requests,
      },
    })

    return NextResponse.json({ 
      success: true, 
      documentId, 
      url: `https://docs.google.com/document/d/${documentId}/edit` 
    })
  } catch (error: any) {
    console.error('Google Docs export error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
