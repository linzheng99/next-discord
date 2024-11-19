import { redirect } from "next/navigation"

import { getCurrent } from "@/lib/current-profile"

export default async function ServerIdPage() {
  const user = await getCurrent()
  if (!user) redirect('/sign-in')

  return <div>ServerIdPage</div>
}
