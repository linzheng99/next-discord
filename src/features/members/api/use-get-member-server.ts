"use client"

import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

interface UseGetMemberServerProps {
  serverId: string
}

export const useGetMemberServer = ({ serverId }: UseGetMemberServerProps) => {
  const query = useQuery({
    queryKey: ['members', serverId],
    queryFn: async () => {
      const response = await client.api.members[':serverId']['$get']({ param: { serverId } })

      if (!response.ok) {
        throw new Error('获取成员失败...')
      }

      const { data } = await response.json()

      return data
    }
  })
  return query
}
