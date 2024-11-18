import { zValidator } from '@hono/zod-validator';
import { MemberRole } from '@prisma/client';
import { Hono } from "hono";
import { v4 as uuidv4 } from 'uuid'
import { z } from "zod";

import { getCurrentProfile } from '@/features/auth/queries';
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
  .get(
    '/',
    zValidator('query', z.object({
      profileId: z.string()
    })),
    async (c) => {
      const { profileId } = c.req.valid('query')

      const servers = await db.server.findMany({
        where: {
          profileId
        }
      })

      return c.json({ data: servers })
    })

export default app
