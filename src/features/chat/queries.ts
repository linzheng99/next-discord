
import db from "@/lib/db"


export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
  const conversation = await findConversation(memberOneId, memberTwoId) || await createConversation(memberOneId, memberTwoId)

  if (!conversation) return createConversation(memberOneId, memberTwoId)

  return conversation
}

// 查找私人对话
export const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const conversation = await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })

    return conversation
  } catch (error) {
    console.log(error)
    return null
  }
}

// 创建私人对话
export const createConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const conversation = await db.conversation.create({
      data: { memberOneId, memberTwoId },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })

    return conversation
  } catch (error) {
    console.log(error)
    return null
  }
}
