import { type Channel, type ChannelType, type Server } from '@prisma/client'
import { create } from 'zustand'

export type ModalType = 'createServer' | 'invite' | 'editServer' | 'members' | 'createChannel' | 'editChannel' | 'messageFile'

export type ModalData = {
  server?: Server
  channel?: Channel
  channelType?: ChannelType
  apiUrl?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: Record<string, any>
}

interface ModalStore {
  type: ModalType | null
  data: ModalData
  isOpen: boolean
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
  onClose: () => set({ type: null, data: {}, isOpen: false }),
}))
