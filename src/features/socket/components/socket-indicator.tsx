'use client'

import { useSocket } from "@/components/socket-provider"
import { Badge } from "@/components/ui/badge"

export const SocketIndicator = () => {
  const { isConnected } = useSocket()

  if (!isConnected) {
    return (
      <Badge variant="outline" className="text-xs bg-yellow-600 border-none text-white">
        Fallback: Polling every 1s
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="text-xs bg-emerald-600 border-none text-white">
      Live: Real-time updates
    </Badge>
  )
}
