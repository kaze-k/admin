import Logo from "@/assets/logo.png"
import router from "@/router"
import "@/styles/antd.scss"
import { Helmet } from "react-helmet-async"
import { RouterProvider } from "react-router"
import { Toaster } from "sonner"

import "./App.css"

function App() {
  return (
    <>
      <Helmet>
        <title>Kanboard Admin</title>
        <link
          rel="icon"
          href={Logo}
        />
      </Helmet>

      <Toaster />
      <RouterProvider router={router} />
    </>
  )
}

export default App
