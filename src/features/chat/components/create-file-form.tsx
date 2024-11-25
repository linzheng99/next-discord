import { zodResolver } from "@hookform/resolvers/zod"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import FileUpload from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { useModalStore } from "@/hooks/use-modal-store"

import { useSendFile } from "../api/use-send-file"
import { createFileSchema } from "../schemas"


interface CreateFileFormProps {
  onCancel: () => void
}

export default function CreateFileForm({ onCancel }: CreateFileFormProps) {
  const { data } = useModalStore()
  const { apiUrl, query } = data

  const form = useForm<z.infer<typeof createFileSchema>>({
    resolver: zodResolver(createFileSchema),
    defaultValues: {
      fileUrl: "",
      content: ""
    },
  })

  const { mutate, isPending } = useSendFile()

  function onSubmit(values: z.infer<typeof createFileSchema>) {
    if (!apiUrl || !query) return

    mutate({ ...values, apiUrl, query }, {
      onSuccess: () => {
        handleClose()
      }
    })
  }

  function handleFileChange(url?: string, fileType?: string) {
    form.setValue('fileUrl', url || "")
    form.setValue('content', fileType || "")
  }

  function handleClose() {
    form.reset()
    onCancel()
  }

  return (
    <Card className="text-primary p-0 overflow-hidden">
      <CardHeader className="pt-8 px-6">
        <CardTitle className="text-2xl font-bold text-center">Add an attachment</CardTitle>
        <DialogDescription className="text-center text-zinc-500">
          Send a file as a message.
        </DialogDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload endpoint="messageFile" value={field.value} onChange={(url, fileType) => handleFileChange(url, fileType)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex">
              <Button variant="primary" className="w-full md:w-auto ml-auto" type="submit" disabled={isPending}>Send</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
