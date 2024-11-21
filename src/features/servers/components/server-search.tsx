"use client"


import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { DialogTitle } from "@/components/ui/dialog"

import { useServerId } from "../hooks/use-server-id"
import { type ServerWithMembersWithProfiles } from "../types"

interface ServerSearchProps {
  data: {
    label: string
    type: 'channel' | 'member',
    data: {
      id: string
      name: string
      icon: React.ReactNode
    }[] | undefined
  }[]
  server: ServerWithMembersWithProfiles
}

export default function ServerSearch({ data, server }: ServerSearchProps) {
  const router = useRouter()
  const serverId = useServerId()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
 
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  function handleSelect(id: string, type: 'channel' | 'member') {
    setOpen(false)
    if (type === 'member') {
      router.push(`/servers/${serverId}/conversations/${id}`)
    } else {
      router.push(`/servers/${serverId}/channels/${id}`)
    }
  }

  return (
    <>
      <Button variant="outline" className="h-auto w-full flex items-center justify-between gap-x-2 text-muted-foreground p-2 cursor-pointer" asChild onClick={() => setOpen(true)}>
        <div className="flex items-center w-full">
          <div className="flex items-center gap-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-semibold text-muted-foreground">
              Search
            </p>
          </div>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="p-3">{server.name}</DialogTitle>
        <CommandInput placeholder="Search channels and members" />
        <CommandList>
          <CommandEmpty>
            No results found.
          </CommandEmpty>
          {
            data?.map(({ label, type, data }) => {
              if (!data?.length) return null
              return (
                <CommandGroup key={label} heading={label}>
                  {data?.map(({ id, name, icon }) => (
                    <CommandItem key={id} onSelect={() => handleSelect(id, type)}>
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            })
          }
        </CommandList>
      </CommandDialog>
    </>
  )
}
