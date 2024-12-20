'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useModalStore } from "@/hooks/use-modal-store"

import { useSendMessage } from "../api/use-send-message"
import { chatInputSchema } from "../schemas"
import EmojiPicker from "./emoji-picker"

interface ChatInputProps {
  name: string
  type: 'channel' | 'conversation'
  apiUrl: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: Record<string, any>
}

export default function ChatInput({ name, type, apiUrl, query }: ChatInputProps) {
  const { onOpen } = useModalStore()
  const form = useForm<z.infer<typeof chatInputSchema>>({
    resolver: zodResolver(chatInputSchema),
    defaultValues: {
      content: "",
    },
  })

  const { mutate, isPending } = useSendMessage()

  function onSubmit(values: z.infer<typeof chatInputSchema>) {
    mutate({ content: values.content, apiUrl, query }, {
      onSuccess: () => {
        form.reset()
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => onOpen('messageFile', { apiUrl, query })}
                    className="absolute left-8 top-7 size-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full flex items-center justify-center p-1">
                    <Plus className="size-4 text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    placeholder={`Message ${type === 'conversation' ? name : `#${name}`}`}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none text-zinc-900 dark:text-zinc-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}
                    disabled={isPending}
                  />
                  <div className="absolute right-8 top-7 cursor-pointer">
                    <EmojiPicker onChange={(emoji) => field.onChange(field.value + emoji)} />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
