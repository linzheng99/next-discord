import { useInfiniteQuery } from '@tanstack/react-query'
import qs from 'query-string'


interface UseChatQueryProps {
  queryKey: string // 查询的唯一键
  apiUrl: string // 获取 message 的 API 地址
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
}

export default function useChatQuery({ queryKey, apiUrl, paramKey, paramValue }: UseChatQueryProps) {

  // 获取消息
  const fetchMessages = async ({ pageParam = undefined }: { pageParam: string | number | undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam ? pageParam : undefined, // 游标
          [paramKey]: paramValue // 参数
        }
      },
      { skipNull: true } // 跳过 null 值
    )

    const res = await fetch(url)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res.json()
  }

  // 使用无限查询
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage, // 是否正在获取下一页
    status
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: ({ pageParam }) => fetchMessages({ pageParam }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    initialPageParam: 0,
  })

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  }
}
