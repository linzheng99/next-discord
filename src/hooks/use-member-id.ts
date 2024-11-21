import { useParams } from "next/navigation"

export function useMemberId() {
  const params = useParams()
  return params.memberId as string
}
