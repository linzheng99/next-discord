import { type Member, type Profile, type Server } from "@prisma/client"
import { type Server as NetServer, type Socket } from 'net'
import { type NextApiResponse } from 'next'
import { type Server as SocketIOServer } from 'socket.io'

export type ServerWithMembersWithProfiles = Server & {
  members: MemberWithProfile[]
}

export type MemberWithProfile = Member & { profile: Profile }


export type ServerWithMembersAndProfiles = Server & {
  members: (Member & { profile: Profile })[]
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}


