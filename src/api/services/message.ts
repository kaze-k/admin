import { DeleteMsgRequest, MarkReadRequest } from "#/api"
import useUserStore from "@/stores/userStore"

import ApiRequest from "../ApiRequest"

export const getUnReadMsgs = () => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.get({ url: `/${id}/getUnReadMsgs` })
}

export const getReadedMsgs = () => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.get({ url: `/${id}/getReadedMsgs` })
}

export const markReadMsgs = (data: MarkReadRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/markReadMsg`, data })
}

export const deleteMsg = (data: DeleteMsgRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.delete({ url: `/${id}/deleteMsg`, data })
}

export const getAllMsgs = (count: number) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.get({url: `/${id}/getAllMsgs?count=${count}`})
}
