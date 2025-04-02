import useUserStore from "@/stores/userStore"
import { useEffect, useState } from "react"
import useWebSocket from "react-use-websocket"

export const useMsg = () => {
  return function Msg(): any {
    const [data, setData] = useState({
      message_type: "",
      unread_count: 0,
      payload: "",
    })
    const id = useUserStore.getState().userInfo.id
    const { accessToken } = useUserStore.getState().userToken
    const { lastMessage } = useWebSocket(
      `${import.meta.env.VITE_WS_DOMAIN}${import.meta.env.VITE_BASE_URL}/${id}/ws?token=${accessToken}`,
      {
        heartbeat: false,
        shouldReconnect: () => true,
      },
    )

    useEffect(() => {
      if (lastMessage && lastMessage?.data) {
        setData(JSON.parse(lastMessage.data))
      }
    }, [lastMessage])

    return data
  }
}
