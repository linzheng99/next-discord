import { type Message } from "@prisma/client"
import { NextResponse } from "next/server"

import { getCurrentProfile } from "@/lib/current-profile"
import db from "@/lib/db"

const MESSAGES_BATCH = 10

export const GET = async (req: Request) => {
  const profileId = await getCurrentProfile()

  const { searchParams } = new URL(req.url)

  const channelId = searchParams.get('channelId')
  const cursor = searchParams.get('cursor')

  if (!profileId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  if (!channelId) {
    return new NextResponse('Channel ID is required', { status: 400 })
  }

  let messages: Message[] = []

  try {
    // 如果游标存在,则通过游标进行分页,获取后面数据
    if (cursor) {
      messages = await db.message.findMany({
        where: {
          channelId
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
      messages = await db.message.findMany({
        where: {
          channelId
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
    console.log('[MESSAGES_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
