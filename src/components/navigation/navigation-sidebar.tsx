import { UserButton } from "@clerk/nextjs"

import { ModeToggle } from "@/components/mode-toggle"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getCurrentProfile } from "@/features/auth/queries"
import db from "@/lib/db"

import NavigationAction from "./navigation-action"
import NavigationItem from "./navigation-item"

export default async function NavigationSidebar() {
  const profile = await getCurrentProfile()

  if (!profile) return null

  const servers = await db.server.findMany({
    where: {
      members: {
        some: { profileId: profile.id }
      }
    }
  })

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-[#2b2b37] py-3">
      <NavigationAction />
      <Separator className="w-10 h-[2px] bg-zinc-300 dark:bg-zinc-700 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <NavigationItem
            key={server.id}
            id={server.id}
            imageUrl={server.imageUrl}
            name={server.name}
          />
        ))}
      </ScrollArea>
      <div className="flex flex-col items-center gap-y-4 pb-3 mb-auto">
        <ModeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]"
            }
          }}
        />
      </div>
    </div>)
}
