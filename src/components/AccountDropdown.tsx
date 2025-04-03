import { useAction, useUserInfo } from "@/stores/userStore"
import { avatarPath } from "@/utils/resources"
import { UserOutlined } from "@ant-design/icons"
import { Avatar, Button, Divider, type MenuProps } from "antd"
import Dropdown, { type DropdownProps } from "antd/es/dropdown/dropdown"
import React from "react"
import { NavLink, useNavigate } from "react-router"

/**
 * Account Dropdown
 */
function AccountDropdown() {
  const { clearUserToken } = useAction()
  const navigate = useNavigate()
  const { username, id, avatar }: any = useUserInfo()

  const logout = () => {
    clearUserToken()
    navigate("/login", { replace: true })
  }

  const dropdownRender: DropdownProps["dropdownRender"] = (menu) => (
    <div>
      <Divider style={{ margin: 0 }} />
      {React.cloneElement(menu as React.ReactElement, {})}
    </div>
  )

  const items: MenuProps["items"] = [
    {
      label: <NavLink to="/userInfo">个人资料</NavLink>,
      key: "0",
      style: { textAlign: "center" },
      onClick: () => {
        navigate(`/users/${id}`)
      },
    },
    { type: "divider" },
    {
      label: <Button danger>退出</Button>,
      key: "1",
      style: { textAlign: "center" },
      onClick: logout,
    },
  ]

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      dropdownRender={dropdownRender}
    >
      <span style={{ display: "flex", height: 32, justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
        <Avatar
          icon={avatarPath(avatar) ? null : <UserOutlined />}
          src={avatarPath(avatar) || undefined}
        />
        <span style={{ padding: "0 10px", fontSize: 16, fontWeight: 600 }}>{username}</span>
      </span>
    </Dropdown>
  )
}

export default AccountDropdown
