'use client'

import "@uploadthing/react/styles.css"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import FileUpload from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useModalStore } from "@/hooks/use-modal-store"
import { useServerId } from "@/hooks/use-server-id";

import { useEditServer } from "../api/use-edit-server"
import { editServerSchema } from "../schemas"

interface EditServerFormProps {
  onCancel: () => void
}

export default function EditServerForm({ onCancel }: EditServerFormProps) {
  const serverId = useServerId()
  const { data: { server } } = useModalStore()

  const form = useForm<z.infer<typeof editServerSchema>>({
    resolver: zodResolver(editServerSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  })

  const { mutate, isPending } = useEditServer()

  function onSubmit(values: z.infer<typeof editServerSchema>) {
    mutate({ json: values, param: { serverId } }, {
      onSuccess: () => {
        handleClose()
      }
    })
  }

  function handleClose() {
    form.reset()
    onCancel()
  }

  useEffect(() => {
    if (server) {
      form.setValue('name', server.name)
      form.setValue('imageUrl', server.imageUrl)
    }
  }, [server, form])



  return (
    <Card className="text-primary p-0 overflow-hidden">
      <CardHeader className="pt-8 px-6">
        <CardTitle className="text-2xl font-bold text-center">Customize your server</CardTitle>
        <CardDescription className="text-center text-zinc-500">
          Give your server a personality with a name and image. You can always change it later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload endpoint="serverImage" value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold">
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter server name" disabled={isPending} className="focus-visible:ring-0 text-primary focus-visible:ring-offset-0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex">
              <Button variant="primary" className="w-full md:w-auto ml-auto" type="submit" disabled={isPending}>Save</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
