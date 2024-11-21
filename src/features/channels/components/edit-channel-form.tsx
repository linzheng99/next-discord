'use client'

import "@uploadthing/react/styles.css"

import { zodResolver } from "@hookform/resolvers/zod"
import { ChannelType } from "@prisma/client"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useModalStore } from "@/hooks/use-modal-store"

import { useEditChannel } from "../api/use-edit-channel"
import { editChannelSchema } from "../schemas"

interface EditChannelFormProps {
  onCancel: () => void
}

export default function EditChannelForm({ onCancel }: EditChannelFormProps) {
  const { data: { channel } } = useModalStore()

  const form = useForm<z.infer<typeof editChannelSchema>>({
    resolver: zodResolver(editChannelSchema),
    defaultValues: {
      name: channel?.name || "",
      type: channel?.type || ChannelType.TEXT,
      channelId: channel?.id || "",
      serverId: channel?.serverId || "",
    },
  })

  useEffect(() => {
    if (channel) {
      form.setValue('name', channel.name)
      form.setValue('type', channel.type)
      form.setValue('serverId', channel.serverId)
      form.setValue('channelId', channel.id)
    }
  }, [channel])


  const { mutate: editChannel, isPending } = useEditChannel()

  function onSubmit(values: z.infer<typeof editChannelSchema>) {
    editChannel(
      { json: { ...values } },
      {
        onSuccess: () => {
          handleClose()
        }
      }
    )
  }

  function handleClose() {
    form.reset()
    onCancel()
  }

  return (
    <Card className="text-primary p-0 overflow-hidden">
      <CardHeader className="pt-8 px-6">
        <CardTitle className="text-2xl font-bold text-center">Create Channel</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold">
                      Channel name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter channel name" className="focus-visible:ring-0 text-primary focus-visible:ring-offset-0" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold">
                      Channel type
                    </FormLabel>
                    <FormControl>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder="Select channel type" />
                        </SelectTrigger>
                        <SelectContent>
                          {
                            Object.values(ChannelType).map((type) => (
                              <SelectItem className="capitalize" key={type} value={type}>
                                {type.toLowerCase()}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            <div className="flex">
              <Button variant="primary" className="w-full md:w-auto ml-auto" type="submit" disabled={isPending}>Create</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
