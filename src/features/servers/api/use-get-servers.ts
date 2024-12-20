import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

export const useGetServers = () => {
  const query = useQuery({
    queryKey: ['servers'],
    queryFn: async () => {
      const response = await client.api.servers.$get()

      if (!response.ok) {
        throw new Error('request error...')
      }

      const { data } = await response.json()

      return data
    }
  })
  return query
}
