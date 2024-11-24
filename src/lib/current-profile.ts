import { auth, currentUser } from "@clerk/nextjs/server"

import db from "@/lib/db"

export async function getCurrent() {
  try {
    const user = await currentUser()
    return user
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function getCurrentProfile() {
  const { userId } = await auth()

  if (!userId) return null

  const profile = await db.profile.findUnique({
    where: {
      userId
    }
  })

  return profile
}

export async function getCurrentProfileByUserId(userId: string) {
  const profile = await db.profile.findUnique({
    where: {
      userId
    }
  })

  return profile
}
