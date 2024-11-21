import { type Member, type Profile,type Server } from "@prisma/client"

export type ServerWithMembersWithProfiles = Server & {
  members: MemberWithProfile[]
}

export type MemberWithProfile = Member & { profile: Profile }

