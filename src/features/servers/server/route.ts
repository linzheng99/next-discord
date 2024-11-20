import { zValidator } from '@hono/zod-validator';
import { MemberRole } from '@prisma/client';
import { Hono } from "hono";
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod';

import { getCurrent, getCurrentProfile } from '@/lib/current-profile';
import db from "@/lib/db";

import { createServerSchema, editServerSchema } from '../schemas';

const app = new Hono()
  .post('/', zValidator('json', createServerSchema), async (c) => {
    const profile = await getCurrentProfile()

    if (!profile) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { name, imageUrl } = c.req.valid('json')

    const server = await db.server.create({
      data: {
        name,
        imageUrl,
        inviteCode: uuidv4(),
        profileId: profile.id,
        channels: {
          create: [
            { name: 'general', type: 'TEXT', profileId: profile.id }
          ]
        },
        members: {
          create: [
            { profileId: profile.id, role: MemberRole.ADMIN }
          ]
        }
      }
    })

    return c.json({ data: server })
  })
  .get('/', async (c) => {
    const profile = await getCurrentProfile()

    if (!profile) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const servers = await db.server.findMany({
      where: {
        members: {
          some: { profileId: profile.id }
        }
      }
    })

    return c.json({ data: servers })
  })
  .get('/:serverId', async (c) => {
    const user = await getCurrent()

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { serverId } = c.req.param()

    const server = await db.server.findUnique({
      where: {
        id: serverId,
      },
      include: {
        channels: {
          orderBy: {
            createdAt: 'asc'
          }
        },
        members: {
          include: {
            profile: true
          },
          orderBy: {
            role: 'asc'
          }
        }
      }
    })

    return c.json({ data: server })
  })
  .patch('/:serverId/invite-code', async (c) => {
    const profile = await getCurrentProfile()

    if (!profile) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { serverId } = c.req.param()

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id
      },
      data: {
        inviteCode: uuidv4()
      }
    })

    return c.json({ data: server })
  })
  .post('/:serverId/join',
    zValidator('json', z.object({ inviteCode: z.string() })),
    async (c) => {
      const profile = await getCurrentProfile()

      if (!profile) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { serverId } = c.req.param()
      const { inviteCode } = c.req.valid('json')

      const existingServer = await db.server.findUnique({
        where: {
          id: serverId,
          inviteCode,
          members: {
            some: { profileId: profile.id }
          }
        }
      })

      if (existingServer) {
        return c.json({ error: 'Server already joined' }, 400)
      }

      const server = await db.server.update({
        where: {
          id: serverId,
          inviteCode
        },
        data: {
          members: {
            create: [
              { profileId: profile.id }
            ]
          }
        },
      })

      return c.json({ data: server })
    })
  .patch('/:serverId', zValidator('json', editServerSchema), async (c) => {
    const profile = await getCurrentProfile()

    if (!profile) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { serverId } = c.req.param()
    const { name, imageUrl } = c.req.valid('json')

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id
      },
      data: {
        name,
        imageUrl
      }
    })

    return c.json({ data: server })
  })
  .patch('/:serverId/members/:memberId/role',
    zValidator('json', z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {
      const profile = await getCurrentProfile()

      if (!profile) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { serverId, memberId } = c.req.param()
      const { role } = c.req.valid('json')

      if (!serverId || !memberId) {
        return c.json({ error: 'Server or member not found' }, 404)
      }

      const server = await db.server.update({
        where: {
          id: serverId,
          profileId: profile.id
        },
        data: {
          members: {
            update: {
              where: {
                id: memberId,
                profileId: {
                  not: profile.id
                }
              },
              data: { role }
            }
          }
        },
        include: {
          members: {
            include: {
              profile: true
            },
            orderBy: {
              role: 'asc'
            }
          }
        }
      })

      return c.json({ data: server })
    })

export default app
