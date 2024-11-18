import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

interface UseGetServicesProps {
  profileId: string
}

export const useGetServices = ({ profileId }: UseGetServicesProps) => {
  const query = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      if (!profileId) return null

      const response = await client.api.services.$get({
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
