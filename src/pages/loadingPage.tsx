// components/LoadingPage.tsx
import { LoadingOutlined } from "@ant-design/icons"
import { Flex } from "antd"
import { Spin, Typography } from "antd"
import React from "react"

const { Text } = Typography

const LoadingPage: React.FC = () => {
  const icon = (
    <LoadingOutlined
      style={{ fontSize: 36 }}
      spin
    />
  )

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      style={{ height: "100vh", width: "100vw" }}
      gap={12}
    >
      <Spin indicator={icon} />
      <Text type="secondary">正在加载页面内容</Text>
    </Flex>
  )
}

export default LoadingPage
