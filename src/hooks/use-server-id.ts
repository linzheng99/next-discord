import { useParams } from "next/navigation"

export function useServerId() {
  const params = useParams()
  return params.serverId as string
}
