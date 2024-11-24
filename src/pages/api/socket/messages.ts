import { type NextApiRequest } from "next";

import { getCurrentProfileByUserId } from "@/lib/current-profile";
import db from "@/lib/db";
import { type NextApiResponseServerIo } from "@/types";

async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { content, fileUrl, userId } = req.body
    const { channelId, serverId } = req.query

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const profile = await getCurrentProfileByUserId(userId as string)

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!channelId || !serverId) {
      return res.status(400).json({ error: 'Channel or server ID is required' })
    }

    if (!content) {
      return res.status(400).json({ error: 'Content is required' })
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: { profileId: profile.id }
        }
      },
      include: {
        members: true
      }
    })

    if (!server) {
      return res.status(404).json({ error: 'Server not found' })
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: server.id
      }
    })

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' })
    }

    const member = server.members.find((member) => member.profileId === profile.id)

    if (!member) {
      return res.status(404).json({ error: 'Member not found' })
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channel.id,
        memberId: member.id
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      }
    })

    const channelKey = `chat:${channel.id}:messages`

    res?.socket?.server?.io?.emit(channelKey, message)

    return res.status(200).json(message)

  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export default handler
