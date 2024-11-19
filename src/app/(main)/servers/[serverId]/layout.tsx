import { redirect } from "next/navigation";

import ServerSidebar from "@/features/servers/components/server-sidebar";
import { getCurrentProfile } from "@/lib/current-profile";

export default async function ServersIdLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile()

  if (!profile) redirect('/')

  return (
    <div className="h-full">
      <div className="hidden md:!flex w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar profileId={profile.id} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  )
}
