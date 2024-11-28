## Stack

- [Next.js](https://nextjs.org/)
- [supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Hono](https://hono.dev/)
- [@tanstack/react-query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [socket.io](https://socket.io/)
- [livekit](https://livekit.io/) 音视频
- [uploadthing](https://uploadthing.com/) 图片上传
- [clerk](https://clerk.com/) 认证

### Databases

使用 supabase 的 postgres 数据库


### 图片上传

使用 uploadthing 上传图片

## .env
```
DATABASE_URL=

DIRECT_URL=
```

## .env.local
```
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

UPLOADTHING_TOKEN=

LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
```

## Getting Started

```bash
npm install --legacy-peer-deps

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## File Structure

- app (页面)
  - (auth)           - 认证相关页面布局
  - (main)      - 主面板布局
  - (standalone)     - 独立页面布局
  - api (http 请求路由)
- components (组件)
  - (ui)             - shadcn/ui 组件
- features (Feature-First 架构)
  - Servers (聊天服务器)
    - api (CRUD API)
    - hooks (hooks)
    - components (组件)
    - server (与服务器端交互)
    - queries (查询)
    - schemas (请求的配置)
    - types (类型)
  - chat (聊天功能)
  - ...
- hooks (hooks)
- lib (库)
- pages (socket.io 路由)
- types (类型)
- middleware.ts (中间件)


# Study Project


