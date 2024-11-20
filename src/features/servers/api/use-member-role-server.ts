import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'


type ResponseType = InferResponseType<typeof client.api.servers[':serverId']['members'][':memberId']['role']['$patch'], 200>
type RequestType = InferRequestType<typeof client.api.servers[':serverId']['members'][':memberId']['role']['$patch']>

export const useMemberRoleServer = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.servers[':serverId']['members'][':memberId']['role']['$patch']({ json, param })

      if (!response.ok) {
        throw new Error('更新失败...')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('更新成功！')

      void queryClient.invalidateQueries({ queryKey: ['servers'] })
      void queryClient.invalidateQueries({ queryKey: ['servers', data.id] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
