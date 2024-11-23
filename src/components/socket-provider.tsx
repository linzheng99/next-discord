'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { io as ClientIO } from 'socket.io-client'

type SocketContextProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any
  isConnected: boolean
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [socket, setSocket] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL!

    if (!siteUrl) {
      console.error('NEXT_PUBLIC_APP_URL is not defined')
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const socketInstance = new (ClientIO as any)(siteUrl, {
      path: '/api/socket/io',
      addTrailingSlash: false,
    })

    console.log('socketInstance', socketInstance)

    // 连接状态监听
    socketInstance.on("connecting", () => {
      console.log('Connecting to socket...');
    });


    socketInstance.on('connect', () => {
      console.log('Socket connected')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    // 如果没有自动连接，手动连接
    if (!socketInstance.connected) {
      console.log('Manually connecting socket...');
      socketInstance.connect();
    }

    setSocket(socketInstance)

    console.log('socket', socket)
    console.log('isConnected', isConnected)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}

