import { useEffect, useState } from "react"

interface UseChatScrollProps {
  chatRef: React.RefObject<HTMLDivElement> // 聊天容器
  bottomRef: React.RefObject<HTMLDivElement> // 底部容器
  shouldLoadMore: boolean // 是否还有更多历史消息可以加载
  loadMore: () => void // 加载更多
  count: number // 消息数量,用于触发重新计算滚动
}

export default function useChatScroll({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count
}: UseChatScrollProps) {
  // 是否初始化
  const [hasInitialized, setHasInitialized] = useState(false)

  // 处理向上滚动加载更多消息的逻辑
  useEffect(() => {
    const topDiv = chatRef?.current
    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop

      // 当滚动到顶部且还有更多消息可加载时，触发加载
      if (scrollTop === 0 && shouldLoadMore) {
        loadMore()
      }
    }

    topDiv?.addEventListener('scroll', handleScroll)

    return () => {
      topDiv?.removeEventListener('scroll', handleScroll)
    }
  }, [shouldLoadMore, loadMore, chatRef])

  // useEffect(() => {
  //   const topDiv = chatRef?.current
  //   if (!topDiv) {
  //     return
  //   }
  //   const MESSAGE_HEIGHT = 72 * 10 // 每条消息的固定高度

  //   // TODO
  //   // 通过消息数量计算高度，对比 clientHeight, 如果实际内容高度小于容器高度，继续加载更多
  //   // 高度除以10条的高度720，然后依次加载, 如果得出来是2，则加载2次
  //   const loadCount = Math.floor(topDiv.scrollHeight / MESSAGE_HEIGHT)
  //   console.log(loadCount)
  //   if (loadCount > 0) {
  //     for (let i = 0; i < loadCount; i++) {
  //       loadMore()
  //       setTimeout(() => {
  //         bottomRef?.current?.scrollIntoView({ behavior: 'smooth' })
  //       }, 1000)
  //     }
  //   }

  // }, [hasInitialized])

  // 处理自动滚动到消息底部
  useEffect(() => {
    const bottomDiv = bottomRef?.current
    const topDiv = chatRef?.current

    function scrollToBottom() {
      setTimeout(() => {
        bottomRef?.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }

    // 是否需要自动滚动
    const shouldAutoScroll = () => {
      // 首次加载时自动滚动到底部
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true)
        return true
      }
      if (!topDiv) {
        return false
      }

      // scrollHeight 是元素的总高度
      // scrollTop 是元素顶部被卷入的距离
      // clientHeight 是元素的可见部分的高度
      // distanceToBottom 是元素底部还有多少距离
      const distanceToBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight
      return distanceToBottom <= 100
    }


    // 执行是否需要自动滚动
    if (shouldAutoScroll()) {
      scrollToBottom()
    }

  }, [bottomRef, chatRef, count, hasInitialized])
}
