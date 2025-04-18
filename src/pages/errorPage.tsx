// components/ErrorPage.tsx
import { CloseCircleOutlined, FrownOutlined, SmileOutlined, WarningOutlined } from "@ant-design/icons"
import { Button, Flex, Result } from "antd"
import { ResultStatusType } from "antd/lib/result"
import React from "react"
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router"

const ErrorPage: React.FC = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  const getStatus = (): ResultStatusType => {
    if (isRouteErrorResponse(error)) return "error"
    return 500
  }

  const getMessage = () => {
    if (isRouteErrorResponse(error)) return error.statusText
    if (error instanceof Error) return error.message
    return "未知错误，请稍后重试。"
  }

  const getIcon = () => {
    const status = getStatus()
    if (status === "error") return <CloseCircleOutlined />
    if (status === 500) return <WarningOutlined />
    if (status === 404) return <FrownOutlined />
    return <SmileOutlined />
  }

  return (
    <Flex
      justify="center"
      align="center"
      style={{ height: "100vh", width: "100vw", padding: 24 }}
    >
      <Result
        icon={getIcon()}
        status={getStatus()}
        title={`出错了 (${getStatus()})`}
        subTitle={getMessage()}
        extra={
          <Button
            type="primary"
            onClick={() => navigate("/")}
          >
            返回首页
          </Button>
        }
        style={{ padding: 24 }}
      />
    </Flex>
  )
}

export default ErrorPage
