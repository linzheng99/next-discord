import { MemberRole } from "@prisma/client";
import { z } from "zod";

export const updateMemberRoleSchema = z.object({
  role: z.nativeEnum(MemberRole),
  serverId: z.string(),
  memberId: z.string(),
})
