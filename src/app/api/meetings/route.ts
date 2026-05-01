import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const createMeetingSchema = z.object({
  title: z.string().min(1),
})

export async function GET() {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { externalId: clerkId },
      include: {
        meetings: {
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: { actionItems: true }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ meetings: [] })
    }

    return NextResponse.json({ meetings: user.meetings })
  } catch (error) {
    console.error('List meetings error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title } = createMeetingSchema.parse(body)

    // Ensure user exists in our DB
    let user = await prisma.user.findUnique({
      where: { externalId: clerkId }
    })

    if (!user) {
      // In a real app, we might get more info from Clerk or rely on webhooks
      // For now, create a basic user record if it doesn't exist
      user = await prisma.user.create({
        data: {
          externalId: clerkId,
          email: `${clerkId}@example.com`, // Placeholder
        }
      })
    }

    const meeting = await prisma.meeting.create({
      data: {
        title,
        userId: user.id,
      }
    })

    return NextResponse.json(meeting)
  } catch (error: any) {
    console.error('Create meeting error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
