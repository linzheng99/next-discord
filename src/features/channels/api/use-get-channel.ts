"use client"

import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

interface UseGetChannelProps {
  channelId: string
}

export const useGetChannel = ({ channelId }: UseGetChannelProps) => {
  const query = useQuery({
    queryKey: ['channels', channelId],
    queryFn: async () => {
      const response = await client.api.channels[':channelId']['$get']({ param: { channelId } })

      if (!response.ok) {
        throw new Error('获取频道失败...')
      }

      const { data } = await response.json()

      return data
    }
  })
  return query
}
