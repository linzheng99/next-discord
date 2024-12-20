import { z } from "zod"

export const chatInputSchema = z.object({
  content: z.string().min(1, { message: 'Message cannot be empty.' }),
})

export const createFileSchema = z.object({
  fileUrl: z.string().min(1, { message: 'Attachment cannot be empty.' }),
  content: z.string().min(1, { message: 'Attachment content cannot be empty.' }),
})

export const editChatContentSchema = z.object({
  content: z.string().min(1, { message: 'Chat content cannot be empty.' }),
})
