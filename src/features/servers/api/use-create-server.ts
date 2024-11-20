import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.servers['$post'], 200>
type RequestType = InferRequestType<typeof client.api.servers['$post']>

export const useCreateServer = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.servers['$post']({ json })

      if (!response.ok) {
        throw new Error('request error...')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('success！')

      router.refresh()
      void queryClient.invalidateQueries({ queryKey: ['servers'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
