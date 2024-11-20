import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'


type ResponseType = InferResponseType<typeof client.api.servers[':serverId']['members'][':memberId']['$delete'], 200>
type RequestType = InferRequestType<typeof client.api.servers[':serverId']['members'][':memberId']['$delete']>

export const useMemberDeleteServer = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.servers[':serverId']['members'][':memberId']['$delete']({ param })

      if (!response.ok) {
        throw new Error('删除失败...')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('删除成功！')

      void queryClient.invalidateQueries({ queryKey: ['servers'] })
      void queryClient.invalidateQueries({ queryKey: ['servers', data.id] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
