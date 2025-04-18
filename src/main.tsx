// react
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider } from "antd"
import zhCN from "antd/locale/zh_CN"
import { Suspense } from "react"
import ReactDOM from "react-dom/client"
// helmet
import { HelmetProvider } from "react-helmet-async"

// root component
import App from "./App"
import LoadingPage from "./pages/loadingPage"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <HelmetProvider>
    <QueryClientProvider client={new QueryClient()}>
      <Suspense fallback={<LoadingPage />}>
        <ConfigProvider
          theme={{ token: { colorPrimary: "#00A76F" } }}
          locale={zhCN}
        >
          <App />
        </ConfigProvider>
      </Suspense>
    </QueryClientProvider>
  </HelmetProvider>,
)
