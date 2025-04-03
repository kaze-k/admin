import { ChangePasswordRequest, CreateUserRequest, LoginRequest, SearchUserRequest, UpdateUserRequest } from "#/api"
import useUserStore from "@/stores/userStore"

import ApiRequest from "../ApiRequest"

export const captcha = () => ApiRequest.get({ url: "/captcha" })

export const login = (data: LoginRequest) => ApiRequest.post({ url: "/login", data: data })

export const getUsers = (page: number, page_size: number) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.get({ url: `/${id}/getUsers?page=${page}&page_size=${page_size}` })
}

export const searchUsers = (data: SearchUserRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/searchUser`, data })
}

export const deleteUser = (deleteId: number) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.delete({ url: `/${id}/deleteUser`, data: { id: deleteId } })
}

export const updateUser = (data: UpdateUserRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.put({ url: `/${id}/updateUser`, data })
}

export const uploadAvatar = (data: FormData) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/uploadAvatar`, data, headers: { "Content-Type": "multipart/form-data" } })
}

export const createUser = (data: CreateUserRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/createUser`, data })
}

export const getUser = (userId: number) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.post({ url: `/${id}/getUser`, data: { id: userId } })
}

export const changePassword = (data: ChangePasswordRequest) => {
  const id = useUserStore.getState().userInfo.id
  return ApiRequest.put({ url: `/${id}/changePassword`, data })
}
