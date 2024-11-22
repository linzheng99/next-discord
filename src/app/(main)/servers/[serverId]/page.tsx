import { redirect } from "next/navigation"

import { getGeneralServer } from "@/features/servers/queries"
import { getCurrent, getCurrentProfile } from "@/lib/current-profile"

interface ServerIdPageProps {
  params: Promise<{
    serverId: string
  }>
}

export default async function ServerIdPage({ params }: ServerIdPageProps) {
  const user = await getCurrent()
  if (!user) redirect('/sign-in')

  const profile = await getCurrentProfile()
  if (!profile) redirect('/sign-in')
  const { serverId } = await params

  const server = await getGeneralServer(profile.id, serverId)
  const initialChannel = server?.channels[0]
  if (!initialChannel) return null

  return redirect(`/servers/${serverId}/channels/${server?.channels[0]?.id}`)
}
