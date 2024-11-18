import { clerkMiddleware } from '@hono/clerk-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import auth from '@/features/auth/server/route'
import services from '@/features/services/server/route'

const app = new Hono().basePath('/api')

app.use('*', clerkMiddleware())

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route('/auth', auth)
  .route('/services', services)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
