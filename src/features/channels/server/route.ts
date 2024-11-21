import { zValidator } from "@hono/zod-validator";
import { MemberRole } from "@prisma/client";
import { Hono } from "hono";

import { getCurrentProfile } from "@/lib/current-profile";
import db from "@/lib/db";

import { createChannelSchema, editChannelSchema } from "../schemas";

const app = new Hono()
  .post('/create-channel', zValidator('json', createChannelSchema), async (c) => {
    const profile = await getCurrentProfile()

    if (!profile) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { name, type, serverId } = c.req.valid('json')

    if (!name || !type || !serverId) {
      return c.json({ error: 'Name, type and serverId are required' }, 400)
    }

    if (name === 'general') {
      return c.json({ error: 'Name cannot be "general"' }, 400)
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          create: [{ name, type, profileId: profile.id }]
        }
      }
    })

    return c.json({ data: server })
  })
  .delete('/:serverId/channels/:channelId', async (c) => {
    const profile = await getCurrentProfile()

    if (!profile) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { serverId, channelId } = c.req.param()

    if (!serverId || !channelId) {
      return c.json({ error: 'Server or channel not found' }, 404)
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          deleteMany: {
            id: channelId,
            name: {
              not: 'general'
            }
          }
        }
      }
    })

    return c.json({ data: server })
  })
  .patch('/edit-channels', zValidator('json', editChannelSchema), async (c) => {
    const profile = await getCurrentProfile()

    if (!profile) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { name, type, serverId, channelId } = c.req.valid('json')

    if (!name || !type || !serverId || !channelId) {
      return c.json({ error: 'Name, type, serverId and channelId are required' }, 400)
    }
    if (name === 'general') {
      return c.json({ error: 'Name cannot be "general"' }, 400)
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          update: {
            where: { id: channelId, NOT: { name: 'general' } },
            data: { name, type }
          }
        }
      }
    })

    return c.json({ data: server })
  })

export default app
