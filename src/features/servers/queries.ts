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
