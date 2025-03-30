import Logo from "@/assets/logo.png"
import { MessageOutlined, PieChartOutlined, ProjectOutlined, UserOutlined } from "@ant-design/icons"
import { Layout, Menu, Tooltip } from "antd"
import type { MenuProps } from "antd"
import { useNavigate } from "react-router"

const { Sider } = Layout

type MenuItem = Required<MenuProps>["items"][number]

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const menuItems: MenuItem[] = [
  getItem("数据概览", "/", <PieChartOutlined />),
  getItem("用户管理", "/users", <UserOutlined />),
  getItem("项目管理", "/projects", <ProjectOutlined />),
  getItem("消息管理", "/messages", <MessageOutlined />),
]

function MainNav() {
  const navigate = useNavigate()
  return (
    <Sider
      style={{ borderRight: "1px solid #f0f0f0" }}
      theme="light"
      collapsed={true}
    >
      <div
        style={{ height: "48px", margin: "16px", cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <Tooltip
          title="Kanboard Admin"
          placement="right"
        >
          <img
            src={Logo}
            alt="logo"
            style={{ width: "100%" }}
          />
        </Tooltip>
      </div>
      <Menu
        theme="light"
        defaultSelectedKeys={["/"]}
        mode="inline"
        items={menuItems}
        selectedKeys={[`/${location.pathname.split("/")[1]}`]}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  )
}

export default MainNav
