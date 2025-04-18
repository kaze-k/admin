import { getProject } from "@/api/services/projects"
import { getUser } from "@/api/services/users"
import UsersTable from "@/components/usersTable"
import Main from "@/layouts"
import Dashboard from "@/pages/dashboard"
import ErrorPage from "@/pages/errorPage"
import Login from "@/pages/login"
import Messages from "@/pages/messages"
import Page404 from "@/pages/page404"
import ProjectInfo from "@/pages/projectInfo"
import Projects from "@/pages/projects"
import UserInfo from "@/pages/userInfo"
import useUserStore from "@/stores/userStore"
import { LoaderFunctionArgs, createBrowserRouter, redirect } from "react-router"

const children = [
  {
    index: true,
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/users",
    children: [
      {
        index: true,
        path: "/users/",
        Component: UsersTable,
      },
      {
        path: "/users/:id",
        Component: UserInfo,
        loader: async ({ params }: LoaderFunctionArgs) => {
          const { id } = params
          const res = await getUser(Number(id))
          if (!res) {
            throw redirect("/404")
          }

          return res
        },
      },
    ],
  },
  {
    path: "/projects",
    children: [
      {
        index: true,
        path: "/projects/",
        Component: Projects,
      },
      {
        path: "/projects/:id",
        Component: ProjectInfo,
        loader: async ({ params }: LoaderFunctionArgs) => {
          const { id } = params
          const res = await getProject(Number(id))
          if (!res) {
            throw redirect("/404")
          }

          return res
        },
      },
    ],
  },
  {
    path: "/messages",
    Component: Messages,
  },
]

const router = createBrowserRouter([
  {
    path: "/",
    ErrorBoundary: ErrorPage,
    Component: Main,
    children: children,
    loader: async () => {
      const userToken = useUserStore.getState().userToken
      if (!userToken.accessToken) {
        throw redirect("/login")
      }
      return
    },
  },
  {
    path: "/login",
    Component: Login,
    loader: async () => {
      const userToken = useUserStore.getState().userToken
      if (userToken.accessToken) {
        throw redirect("/")
      }
      return
    },
  },
  {
    path: "*",
    loader: async () => {
      throw redirect("/404")
    },
  },
  {
    path: "/404",
    Component: Page404,
  },
])

export default router
