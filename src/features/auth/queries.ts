import { currentUser } from "@clerk/nextjs/server"

export async function getCurrent() {
  try {
    const user = await currentUser()
    return user
  } catch (error) {
    console.log(error)
    return null
  }
}
