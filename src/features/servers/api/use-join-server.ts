import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.servers[':serverId']['join']['$post'], 200>
type RequestType = InferRequestType<typeof client.api.servers[':serverId']['join']['$post']>

export const useJoinServer = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.servers[':serverId']['join']['$post']({ param, json })

      if (!response.ok) {
        throw new Error('加入失败...')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('加入成功！')

      void queryClient.invalidateQueries({ queryKey: ['servers'] })
      void queryClient.invalidateQueries({ queryKey: ['servers', data.id] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
