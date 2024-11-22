import { redirect } from "next/navigation"

import { getCurrentProfile } from "@/lib/current-profile"

import ChannelIdClient from "./client"

export default async function ChannelIdPage() {
  const profile = await getCurrentProfile()

  if (!profile) return redirect('/sign-in')

  return (
    <ChannelIdClient profileId={profile.id} />
  )
}

