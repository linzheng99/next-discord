import { type DirectMessage } from "@prisma/client"
import { NextResponse } from "next/server"

import { getCurrentProfile } from "@/lib/current-profile"
import db from "@/lib/db"

const MESSAGES_BATCH = 10

export const GET = async (req: Request) => {
  const profileId = await getCurrentProfile()

  const { searchParams } = new URL(req.url)

  const conversationId = searchParams.get('conversationId')
  const cursor = searchParams.get('cursor')

  if (!profileId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  if (!conversationId) {
    return new NextResponse('Conversation ID is required', { status: 400 })
  }

  let messages: DirectMessage[] = []

  try {
    // 如果游标存在,则通过游标进行分页,获取后面数据
    if (cursor) {
      messages = await db.directMessage.findMany({
        where: {
          conversationId
        },
        cursor: {
          id: cursor
        },
        take: MESSAGES_BATCH,
        skip: 1,
        include: {
          member: {
            include: {
              profile: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      messages = await db.directMessage.findMany({
        where: {
          conversationId
        },
        take: MESSAGES_BATCH,
        include: {
          member: {
            include: {
              profile: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }

    let nextCursor = null

    // 如果消息数量等于批量大小，则设置下一个游标
    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id
    }

    return NextResponse.json({
      items: messages,
      nextCursor
    })
  } catch (error) {
    console.log('[DIRECT_MESSAGES_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
