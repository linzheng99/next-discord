import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

export const useGetServer = (serverId: string) => {
  const query = useQuery({
    queryKey: ['servers', serverId],
    queryFn: async () => {
      const response = await client.api.servers[`:serverId`].$get({ param: { serverId } })

      if (!response.ok) {
        throw new Error('request error...')
      }

      const { data } = await response.json()

      return data
    }
  })
  return query
}
