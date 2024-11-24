'use client'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Smile } from "lucide-react"
import { useTheme } from 'next-themes'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


interface EmojiPickerProps {
  onChange: (emoji: string) => void
}

export default function EmojiPicker({ onChange }: EmojiPickerProps) {
  const { resolvedTheme } = useTheme()
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Smile className="size-6 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
        </PopoverTrigger>
        <PopoverContent side="right" className="bg-transparent border-none shadow-none drop-shadow-none mb-16" sideOffset={40}>
          <Picker
            data={data}
            theme={resolvedTheme}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onEmojiSelect={(emoji: any) => onChange(emoji.native as string)}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
