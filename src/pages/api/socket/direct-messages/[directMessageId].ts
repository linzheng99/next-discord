import { MemberRole } from "@prisma/client";
import { type NextApiRequest } from "next";

import { getCurrentProfileByUserId } from "@/lib/current-profile";
import db from "@/lib/db";
import { type NextApiResponseServerIo } from "@/types";

// 删除或更新消息
export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { directMessageId, conversationId } = req.query
    const { content, userId } = req.body

    const profile = await getCurrentProfileByUserId(userId as string)

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID is required' })
    }




    // 检查是否存在频道
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id
            }
          },
          {
            memberTwo: {
              profileId: profile.id
            }
          }
        ]
      },
      include: {
        memberOne: {
          include: {
            profile: true
          }
        },
        memberTwo: {
          include: {
            profile: true
          }
        }
      }
    })

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    // 检查成员是否在内
    const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo

    if (!member) {
      return res.status(404).json({ error: 'Member not found' })
    }

    // 获取原消息
    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      }
    })

    // 检查消息是否存在 或 是否被删除
    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: 'Message not found' })
    }
    // 检查消息是否属于消息的主人
    const isMessageOwner = directMessage.memberId === member.id
    // 检查成员是否为管理员
    const isAdmin = member.role === MemberRole.ADMIN
    // 检查成员是否为主持人
    const isModerator = member.role === MemberRole.MODERATOR
    // 检查成员是否可以操作消息
    const canModify = isMessageOwner || isAdmin || isModerator

    if (!canModify) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // 删除消息
    if (req.method === 'DELETE') {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string
        },
        data: {
          deleted: true,
          content: 'This message has been deleted.',
          fileUrl: null,
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        }
      })
    }

    // 更新消息
    if (req.method === 'PATCH') {
      if (!isMessageOwner) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string
        },
        data: {
          content
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        }
      })
    }

    // 发送消息更新事件
    const updateKey = `chat:${conversationId as string}:messages:update`
    res?.socket?.server?.io?.emit(updateKey, directMessage)

    return res.status(200).json(directMessage)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
