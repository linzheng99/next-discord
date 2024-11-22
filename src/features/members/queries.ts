import db from "@/lib/db"

export const getCurrentMember = async (serverId: string, profileId: string) => {
  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId
    },
    include: {
      profile: true
    }
  })

  return member
}
