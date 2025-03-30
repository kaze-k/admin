import ApiRequest from "../ApiRequest"

export const dashboard = () => ApiRequest.get({ url: "/dashboard" })

export const getRecentTasks = () => ApiRequest.get({ url: "/getRecentTasks" })
