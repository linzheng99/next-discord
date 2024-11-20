import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.servers[':serverId']['channels']['$post'], 200>
type RequestType = InferRequestType<typeof client.api.servers[':serverId']['channels']['$post']>

export const useCreateChannelServer = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.servers[':serverId']['channels']['$post']({ json, param })

      if (!response.ok) {
        throw new Error('request error...')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('success！')

      router.refresh()
      void queryClient.invalidateQueries({ queryKey: ['servers'] })
      void queryClient.invalidateQueries({ queryKey: ['server', data.id] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
