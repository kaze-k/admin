import { useIsTauri } from "@/hooks"
import useUserStore from "@/stores/userStore"
import { useEffect, useState } from "react"
import useWebSocket from "react-use-websocket"

export const useMsg = () => {
  const { isTauri, isReady } = useIsTauri()
  return function Msg(): any {
    const [socketUrl, setSocketUrl] = useState<string | null>(null)
    const [data, setData] = useState({
      message_type: "",
      unread_count: 0,
      payload: "",
    })
    const id = useUserStore.getState().userInfo.id
    const { accessToken } = useUserStore.getState().userToken

    useEffect(() => {
      if (!id || !accessToken) return

      const mode = import.meta.env.MODE
      if (mode !== "tauri") {
        setSocketUrl(`${import.meta.env.VITE_WS_DOMAIN}${import.meta.env.VITE_BASE_URL}/${id}/ws?token=${accessToken}`)
      }

      if (isTauri && isReady && mode === "tauri") {
        setSocketUrl(`${import.meta.env.VITE_BASE_WS}/${id}/ws?token=${accessToken}`)
        return
      } else if (!isTauri && isReady && mode === "tauri") {
        if (!import.meta.env.VITE_WS_DOMAIN) {
          setSocketUrl(`${import.meta.env.VITE_BASE_WS}/${id}/ws?token=${accessToken}`)
          return
        }
      }
    }, [id, accessToken, isTauri, isReady])

    const isConn = Boolean(isReady && id && accessToken && socketUrl)

    const { lastMessage } = useWebSocket(isConn ? socketUrl : null, {
      heartbeat: false,
      share: true,
      shouldReconnect: () => true,
    })

    useEffect(() => {
      if (lastMessage && lastMessage?.data) {
        setData(JSON.parse(lastMessage.data))
      }
    }, [lastMessage])

    return data
  }
}
