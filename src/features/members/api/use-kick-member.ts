import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'


type ResponseType = InferResponseType<typeof client.api.members[':serverId']['members'][':memberId']['$delete'], 200>
type RequestType = InferRequestType<typeof client.api.members[':serverId']['members'][':memberId']['$delete']>

export const useKickMember = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[':serverId']['members'][':memberId']['$delete']({ param })

      if (!response.ok) {
        throw new Error('request error...')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('success！')

      void queryClient.invalidateQueries({ queryKey: ['servers'] })
      void queryClient.invalidateQueries({ queryKey: ['servers', data.id] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
