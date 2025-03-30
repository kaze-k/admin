import useUserStore from "@/stores/userStore"

import ApiRequest from "../ApiRequest"

export const getTasks = (projectId: number, page: number, pageSize: number) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.get({ url: `/${id}/getProjectTask?id=${projectId}&page=${page}&page_size=${pageSize}` })
}
