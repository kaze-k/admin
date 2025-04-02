import useUserStore from "@/stores/userStore"

import ApiRequest from "../ApiRequest"

export const dashboard = () => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.get({ url: `/${id}/dashboard` })
}

export const getRecentTasks = () => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.get({ url: `/${id}/getRecentTasks` })
}
