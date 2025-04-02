import AccountDropdown from "@/components/AccountDropdown"
import FullscreenButton from "@/components/FullscreenButton"
import MessageButton from "@/components/MessageButton"
import { MessageOutlined, PieChartOutlined, ProjectOutlined, UserOutlined } from "@ant-design/icons"
import { Breadcrumb, Layout, Space, theme } from "antd"
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb"
import { useMatches } from "react-router"

const { Header } = Layout

const items: Record<string, string> = {
  "/": "数据概览",
  "/users": "用户管理",
  "/projects": "项目管理",
  "/messages": "消息管理",
}

function getTitle(pathname: string, item: string) {
  const iconMap: Record<string, React.ReactNode> = {
    "/": <PieChartOutlined />,
    "/users": <UserOutlined />,
    "/projects": <ProjectOutlined />,
    "/messages": <MessageOutlined />,
  }

  return (
    <>
      {iconMap[pathname]}
      <span>{item}</span>
    </>
  )
}

function MainHeader() {
  const matches = useMatches()
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const breadcrumbItems = (): BreadcrumbItemType[] => {
    const basePath = `/${matches[1].pathname.split("/")[1]}`
    const bitems: BreadcrumbItemType[] = [
      {
        href: matches[1].pathname,
        title: getTitle(basePath, items[basePath]),
      },
    ]

    if (matches[1].pathname === "/users" && matches[1].params?.id) {
      bitems.push({
        title: "用户信息",
      } as BreadcrumbItemType)
    }

    if (matches[1].pathname === "/projects" && matches[1].params?.id) {
      bitems.push({
        title: "项目信息",
      } as BreadcrumbItemType)
    }

    return bitems
  }

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 64,
        padding: "0 15px",
        background: colorBgContainer,
        borderBottom: "1px solid #f0f0f0",
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
      }}
    >
      <Breadcrumb items={breadcrumbItems()} />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Space>
          <FullscreenButton />
          <MessageButton />
        </Space>
        <div style={{ width: 2, height: 20, background: "#ccc", margin: "0 10px" }} />
        <AccountDropdown />
      </div>
    </Header>
  )
}

export default MainHeader
