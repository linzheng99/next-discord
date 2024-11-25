import { type Server as HttpServer } from 'http'
import { type NextApiRequest } from 'next'
import { Server as SocketIOServer } from 'socket.io'

import { type NextApiResponseServerIo } from '@/types'

export const config = {
  api: {
    bodyParser: false,
  },
}

function ioHandler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (!res.socket.server.io) {
    const path = '/api/socket/io'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const httpServer: HttpServer = res.socket.server as any 
    const io = new SocketIOServer(httpServer, {
      path,
      addTrailingSlash: false,
    })
    res.socket.server.io = io
  }

  res.end()
}

export default ioHandler
