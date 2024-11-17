import db from '@/lib/db';

export const getServer = async (profileId: string) => {
  const server = await db.server.findFirst({
    where: {
      profileId,
    },
  })
  return server
}
