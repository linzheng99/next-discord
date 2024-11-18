import { zValidator } from '@hono/zod-validator';
import { Hono } from "hono";
import { z } from "zod";

import db from "@/lib/db";

const app = new Hono()
  .get(
    '/',
    zValidator('query', z.object({
      profileId: z.string()
    })),
    async (c) => {
      const servers = await db.server.findMany({
        where: {
          profileId: c.req.param('profileId')
        }
      })

      return c.json({ data: servers })
    })

export default app
