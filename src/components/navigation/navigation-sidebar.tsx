'use client'

import { UserButton } from "@clerk/nextjs"

import { ModeToggle } from "@/components/mode-toggle"
import PageError from "@/components/page-error"
import PageLoader from "@/components/page-loader"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useGetServers } from "@/features/servers/api/use-get-services"

import NavigationAction from "./navigation-action"
import NavigationItem from "./navigation-item"

export default function NavigationSidebar() {
  const { data: servers, isLoading: isLoadingServers } = useGetServers()

  if (isLoadingServers) {
    return <PageLoader />
  }

  if (!servers) {
    return <PageError message="服务器数据获取失败..." />
  }

  return (
    <div className="space-y-4 py-3 flex lg:hidden flex-col w-full h-full text-primary dark:bg-[#2b2b37] bg-[#e5e5e5]">
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
