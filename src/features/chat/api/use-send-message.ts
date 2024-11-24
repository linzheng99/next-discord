"use client"

import { useUser } from '@clerk/nextjs'
import { type Member, type Message, type Profile } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import qs from 'query-string'

interface RequestParams {
  content: string
  apiUrl: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: Record<string, any>
}

type MessageWithMember = Message & {
  member: Member & {
    profile: Profile
  }
}


export const useSendMessage = () => {
  const { user } = useUser()
  return useMutation<MessageWithMember, Error, RequestParams>({
    mutationFn: async ({ content, apiUrl, query }: RequestParams) => {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query
      })

      const response = await axios.post(url, { content, userId: user?.id })
      return response.data as MessageWithMember
    }
  })
}
