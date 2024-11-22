import { clerkMiddleware } from '@hono/clerk-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import auth from '@/features/auth/server/route'
import channels from '@/features/channels/server/route'
import chat from '@/features/chat/server/route'
import members from '@/features/members/server/route'
import servers from '@/features/servers/server/route'

const app = new Hono().basePath('/api')

app.use('*', clerkMiddleware())

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route('/auth', auth)
  .route('/servers', servers)
  .route('/channels', channels)
  .route('/members', members)
  .route('/chat', chat)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
