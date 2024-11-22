import db from '@/lib/db';

export const getServers = async (profileId: string) => {
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId
        }
      }
    },
  })
  return servers
}

// 获取一个服务器中包含的 general 频道 并自己在内，按创建时间排序
export const getGeneralServer = async (profileId: string, serverId: string) => {
  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId
        }
      }
    },
    include: {
      channels: {
        where: {
          name: 'general',
        },
        orderBy: {
          createdAt: 'asc',
        }
      }
    }
  })
  return server
}
