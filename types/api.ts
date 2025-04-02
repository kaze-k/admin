export interface Result<T = any> {
  status?: number
  code?: 0 | -1
  message?: string
  data?: T
}

export interface LoginRequest {
  username: string
  password: string
  captchaId: string
  captchaAnswer: string
}

export interface SearchUserRequest {
  page: number
  page_size: number
  username?: string
  id?: number
  position?: string
  create_from?: number
  is_admin?: boolean
  is_leader?: boolean
  gender?: number
}

export interface UpdateUserRequest {
  id: number
  avatar?: number
  email?: string
  mobile?: string
  gender?: number
  position?: string
  is_admin?: boolean
  is_leader?: boolean
}

export interface CreateUserRequest {
  username: string
  password: string
  email?: string
  mobile?: string
  gender: number
  position?: string
  is_admin: boolean
  is_leader: boolean
  avatar?: number
}

export interface ChangePasswordRequest {
  id: number
  newPassword: string
}

export interface CreateProjectRequest {
  name: string
  desc?: string
  members?: number[]
}

export interface UpdateProjectRequest {
  id: number
  name?: string
  desc?: string
}

interface Member {
  user_id: number
  username: string
}

export interface AddProjectMemberRequest {
  project_id: number
  assignees?: Member[]
  members: Member[]
}

export interface RemoveProjectMember {
  project_id: number
  members: number[]
}

export interface AddAssigneeRequest {
  project_id: number
  members: number[]
  value: boolean
}

export interface MarkReadRequest {
  id: number
  msg_id: number
}

export interface DeleteMsgRequest {
  msg_id: string
}
