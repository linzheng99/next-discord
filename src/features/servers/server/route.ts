import { zValidator } from '@hono/zod-validator';
import { MemberRole } from '@prisma/client';
import { Hono } from "hono";
import { v4 as uuidv4 } from 'uuid'

import { getCurrent, getCurrentProfile } from '@/lib/current-profile';
import db from "@/lib/db";

import { createServerSchema } from '../schemas';

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

export default app
