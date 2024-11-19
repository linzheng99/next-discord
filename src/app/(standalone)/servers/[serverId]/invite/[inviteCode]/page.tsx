import { redirect } from "next/navigation"

import { getCurrent } from "@/lib/current-profile"

import ServerIdJoinClient from "./client"

export default async function ServerIdJoinPage() {
  const user = await getCurrent()
  if (!user) redirect('/sign-in')

  return <ServerIdJoinClient />
}
