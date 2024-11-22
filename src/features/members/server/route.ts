import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { getCurrentProfile } from "@/lib/current-profile";
import db from "@/lib/db";

import { updateMemberRoleSchema } from "../schemas";

const app = new Hono()
  .patch('/role',
    zValidator('json', updateMemberRoleSchema),
    async (c) => {
      const profile = await getCurrentProfile()

      if (!profile) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { serverId, memberId, role } = c.req.valid('json')

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
  .delete('/:serverId/members/:memberId', async (c) => {
    const profile = await getCurrentProfile()

    if (!profile) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { serverId, memberId } = c.req.param()

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
          deleteMany: {
            id: memberId,
            profileId: {
              not: profile.id
            }
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
  .get('/:serverId', async (c) => {
    const profile = await getCurrentProfile()
    if (!profile) return c.json({ error: 'Unauthorized' }, 401)

    const { serverId } = c.req.param()

    const member = await db.member.findMany({
      where: {
        serverId,
        profileId: profile.id
      }
    })

    return c.json({ data: member })
  })

export default app
