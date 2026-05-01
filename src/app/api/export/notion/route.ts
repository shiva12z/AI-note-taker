import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { Client } from '@notionhq/client'
import { z } from 'zod'

const exportSchema = z.object({
  meetingId: z.string().uuid(),
  notionToken: z.string().optional(), // In case the user provides it directly
  databaseId: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { meetingId, notionToken, databaseId } = exportSchema.parse(body)

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

    const token = notionToken || process.env.NOTION_API_KEY
    if (!token) {
      return NextResponse.json({ error: 'Notion API key not configured' }, { status: 400 })
    }

    const notion = new Client({ auth: token })

    // If databaseId is provided, create a page in that database
    // Otherwise, we might need a parent page ID to create a new page
    const parentId = databaseId || process.env.NOTION_DATABASE_ID

    if (!parentId) {
      return NextResponse.json({ error: 'Notion Database/Parent ID not provided' }, { status: 400 })
    }

    const children: any[] = [
      {
        object: 'block',
        type: 'heading_1',
        heading_1: { rich_text: [{ type: 'text', text: { content: 'TLDR' } }] },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: [{ type: 'text', text: { content: meeting.tldr || 'No TLDR available.' } }] },
      },
      {
        object: 'block',
        type: 'heading_1',
        heading_1: { rich_text: [{ type: 'text', text: { content: 'Summary' } }] },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: [{ type: 'text', text: { content: meeting.summary || 'No summary available.' } }] },
      },
    ]

    if (meeting.actionItems.length > 0) {
      children.push({
        object: 'block',
        type: 'heading_1',
        heading_1: { rich_text: [{ type: 'text', text: { content: 'Action Items' } }] },
      })

      meeting.actionItems.forEach((item) => {
        children.push({
          object: 'block',
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: item.content } }],
            checked: item.completed,
          },
        })
      })
    }

    // Add Full Transcript at the end
    children.push({
      object: 'block',
      type: 'heading_1',
      heading_1: { rich_text: [{ type: 'text', text: { content: 'Full Transcript' } }] },
    })

    // Notion paragraphs have a limit of 2000 characters
    const transcriptChunks = meeting.transcript?.match(/[\s\S]{1,2000}/g) || []
    transcriptChunks.forEach((chunk) => {
      children.push({
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: [{ type: 'text', text: { content: chunk } }] },
      })
    })

    const response = await notion.pages.create({
      parent: { database_id: parentId },
      properties: {
        title: {
          title: [
            {
              text: {
                content: meeting.title || 'Meeting Notes',
              },
            },
          ],
        },
      },
      children: children.slice(0, 100), // Notion has a limit of 100 children per request
    })

    return NextResponse.json({ success: true, url: (response as any).url })
  } catch (error: any) {
    console.error('Notion export error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
