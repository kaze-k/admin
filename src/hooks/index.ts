import { getVersion } from "@tauri-apps/api/app"
import { useEffect, useState } from "react"

export function useIsTauri(): { isTauri: boolean; isReady: boolean } {
  const [isTauri, setIsTauri] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    getVersion()
      .then(() => {
        setIsTauri(true)
        setIsReady(true)
      })
      .catch(() => {
        setIsTauri(false)
        setIsReady(true)
      })
  }, [])

  return { isTauri, isReady }
}
