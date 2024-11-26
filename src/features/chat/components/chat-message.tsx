import { format } from "date-fns"
import { Loader2, ServerCrash } from "lucide-react"
import { type ElementRef, Fragment, useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { type MemberWithProfile } from "@/types"

import useChatQuery from "../hooks/use-chat-query"
import useChatScroll from "../hooks/use-chat-scroll"
import useChatSocket from "../hooks/use-chat-socket"
import { type MessageWithMemberWithProfile } from "../types"
import ChatItem from "./chat-item"
import ChatWelcome from "./chat-welcome"

interface ChatMessageProps {
  name: string // 用户名
  member: MemberWithProfile // 成员
  chatId: string // 频道或对话ID
  apiUrl: string // 获取 message 的 API 地址
  socketUrl: string // WebSocket 连接地址
  socketQuery: Record<string, string> // Socket 连接查询参数
  paramKey: 'channelId' | 'conversationId' // 用于区分是频道还是私聊的参数键
  paramValue: string // Socket 连接参数值
  type: 'channel' | 'conversation' // 聊天类型：频道或私聊
}

const DATE_FORMAT = 'yyyy年MM月dd日 HH:mm'

export default function ChatMessage({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type
}: ChatMessageProps) {
  const queryKey = `chat:${chatId}`
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update`

  const chatRef = useRef<ElementRef<'div'>>(null)
  const bottomRef = useRef<ElementRef<'div'>>(null)

  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
  })
  useChatSocket({
    queryKey,
    addKey,
    updateKey
  })
  useChatScroll({
    chatRef,
    bottomRef,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage, // 是否还有更多历史消息可以加载
    loadMore: fetchNextPage,
    count: data?.pages[0].items.length ?? 0
  })

  useEffect(() => {
    console.log('data--------->', data)
  }, [data])

  if (status === 'pending') {
    return (
      <div className="flex flex-1 h-full justify-center items-center overflow-y-auto">
        <div className="flex flex-col items-center gap-y-4">
          <Loader2 className="h-7 w-7 animate-spin text-zinc-500" />
          <p className="text-md text-zinc-500 dark:text-zinc-400">
            Loading messages...
          </p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-1 h-full justify-center items-center overflow-y-auto">
        <div className="flex flex-col items-center gap-y-4">
          <ServerCrash className="h-7 w-7 text-zinc-500 dark:text-zinc-400" />
          <p className="text-md text-zinc-500 dark:text-zinc-400">
            Failed to load messages.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div ref={chatRef} className="flex flex-col h-full overflow-y-auto">
      {!hasNextPage && (
        <div className="flex-1 flex">
          <ChatWelcome name={name} type={type} />
        </div>
      )}
      
      {hasNextPage && (
        <div className="px-4 pt-4">
          {isFetchingNextPage ? (
            <div className="text-xs text-zinc-500 dark:text-zinc-400 flex justify-center">
              <Loader2 className="h-3 w-3 animate-spin text-zinc-500 dark:text-zinc-400" />
            </div>
          ) : (
            <Button 
              onClick={() => fetchNextPage()} 
              variant="ghost" 
              size="sm" 
              className="w-full text-zinc-500 dark:text-zinc-400"
            >
              Load more
            </Button>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col-reverse px-4 pb-4">
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                member={message.member}
                currentMember={member}
                content={message.content}
                deleted={message.deleted}
                fileUrl={message.fileUrl ?? undefined}
                isUpdated={message.updatedAt !== message.createdAt}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
