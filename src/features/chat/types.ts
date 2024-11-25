import { type Message } from "@prisma/client"

import { type MemberWithProfile } from "@/types"

export type MessageWithMemberWithProfile = Message & {
  member: MemberWithProfile
}
