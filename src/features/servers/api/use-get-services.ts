"use client"

import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

interface UseGetServersProps {
  profileId: string
}

export const useGetServers = ({ profileId }: UseGetServersProps) => {
  const query = useQuery({
    queryKey: ['servers', profileId],
    queryFn: async () => {
      if (!profileId) return null

      const response = await client.api.servers.$get({
        query: {
          profileId
        }
      })

      if (!response.ok) {
        throw new Error('获取服务失败...')
      }

      const { data } = await response.json()

      return data
    }
  })
  return query
}
