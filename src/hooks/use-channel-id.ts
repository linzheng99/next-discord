import { useParams } from "next/navigation"

export function useChannelId() {
  const params = useParams()
  return params.channelId as string
}
