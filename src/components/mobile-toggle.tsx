"use client"

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import ServerSidebar from "@/features/servers/components/server-sidebar";

import NavigationSidebar from "./navigation/navigation-sidebar";
import { Button } from "./ui/button";

interface MobileToggleProps {
  profileId: string
}

export default function MobileToggle({ profileId }: MobileToggleProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <VisuallyHidden>
          <SheetTitle>Sheet Content</SheetTitle>
        </VisuallyHidden>
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSidebar profileId={profileId} />
      </SheetContent>
    </Sheet>
  )
}
