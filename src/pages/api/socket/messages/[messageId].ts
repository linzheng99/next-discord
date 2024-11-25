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
    const { messageId, serverId, channelId } = req.query
    const { content, userId } = req.body

    const profile = await getCurrentProfileByUserId(userId as string)

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    if (!serverId || !channelId) {
      return res.status(400).json({ error: 'Server ID or Channel ID is required' })
    }

    // 检查是否存在服务器
    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id
          }
        }
      },
      include: {
        members: true
      }
    })

    if (!server) {
      return res.status(404).json({ error: 'Server not found' })
    }

    // 检查是否存在频道
    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string
      }
    })

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' })
    }

    // 检查成员是否在内
    const member = server.members.find((member) => member.profileId === profile.id)

    if (!member) {
      return res.status(404).json({ error: 'Member not found' })
    }

    // 获取原消息
    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string
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
    if (!message || message.deleted) {
      return res.status(404).json({ error: 'Message not found' })
    }
    // 检查消息是否属于消息的主人
    const isMessageOwner = message.memberId === member.id
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
      message = await db.message.update({
        where: {
          id: messageId as string
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

      message = await db.message.update({
        where: {
          id: messageId as string
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
    const updateKey = `chat:${channelId as string}:messages:update`
    res?.socket?.server?.io?.emit(updateKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
