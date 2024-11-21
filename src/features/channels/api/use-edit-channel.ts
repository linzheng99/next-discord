import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.channels['edit-channels']['$patch'], 200>
type RequestType = InferRequestType<typeof client.api.channels['edit-channels']['$patch']>

export const useEditChannel = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.channels['edit-channels']['$patch']({ json })

      if (!response.ok) {
        throw new Error('request error...')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('success！')

      void queryClient.invalidateQueries({ queryKey: ['servers'] })
      void queryClient.invalidateQueries({ queryKey: ['server', data.id] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
