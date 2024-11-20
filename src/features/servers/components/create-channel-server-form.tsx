'use client'

import "@uploadthing/react/styles.css"

import { zodResolver } from "@hookform/resolvers/zod"
import { ChannelType } from "@prisma/client"
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

import { useCreateChannelServer } from "../api/use-create-channel-server"
import { useServerId } from "../hooks/use-server-id"
import { createChannelSchema } from "../schemas"

interface CreateChannelServerFormProps {
  onCancel: () => void
}

export default function CreateChannelServerForm({ onCancel }: CreateChannelServerFormProps) {
  const serverId = useServerId()
  const form = useForm<z.infer<typeof createChannelSchema>>({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  })

  const { mutate: createChannel, isPending } = useCreateChannelServer()

  function onSubmit(values: z.infer<typeof createChannelSchema>) {
    createChannel(
      { json: values, param: { serverId } },
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
