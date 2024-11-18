'use client'

import "@uploadthing/react/styles.css"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import FileUpload from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useCreateServer } from "../api/use-create-server"
import { createServerSchema } from "../schemas"

export default function CreateServerForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof createServerSchema>>({
    resolver: zodResolver(createServerSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  })

  const { mutate, isPending } = useCreateServer()

  function onSubmit(values: z.infer<typeof createServerSchema>) {
    mutate({ json: values }, {
      onSuccess: () => {
        form.reset()
        router.push(`/`)
      }
    })
  }

  return (
    <Dialog open={true}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">Customize your server</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and image. You can always change it later.
          </DialogDescription>
        </DialogHeader>
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
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter server name" disabled={isPending} className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" type="submit" disabled={isPending}>Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  )
}
