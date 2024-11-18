import db from '@/lib/db';

export const getFirstServer = async (profileId: string) => {
  const server = await db.server.findFirst({
    where: {
      profileId,
    },
  })
  return server
}
