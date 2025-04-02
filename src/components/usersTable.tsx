import { CreateUserRequest, SearchUserRequest, UpdateUserRequest } from "#/api"
import { createUser, deleteUser, getUsers, searchUsers, updateUser } from "@/api/services/users"
import { DeleteFilled, EditFilled, MoreOutlined, UserOutlined } from "@ant-design/icons"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Card, Form, Input, InputNumber, Select, Space, Table, Tag, Typography, theme } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router"

import UserCreateModal from "./userCreateModal"
import UserEditModal from "./userEditModal"

const { Title } = Typography

function UsersTable() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState<SearchUserRequest | null>(null)
  const queryClient = useQueryClient()
  const { useForm } = Form
  const navigate = useNavigate()
  const [form] = useForm()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editData, setEditData] = useState({})

  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const handleOk = (value: UpdateUserRequest) => {
    updateUserMutation.mutate({ ...value, id: (editData as UpdateUserRequest).id })
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const handleCreateOk = (value: CreateUserRequest) => {
    createUserMutation.mutate(value)
    setIsCreateOpen(false)
  }

  const handleCreateCancel = () => {
    setIsCreateOpen(false)
  }

  const { data: userData, isLoading } = useQuery({
    queryKey: ["users", searchParams, page, pageSize],
    queryFn: () =>
      searchParams
        ? searchUsers({
            ...searchParams,
            page,
            page_size: pageSize,
          })
        : getUsers(page, pageSize),
    placeholderData: keepPreviousData,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const handleSearch = (data: SearchUserRequest) => {
    setSearchParams(data)
    setPage(1)
  }

  const handleReset = () => {
    form.resetFields()
    setSearchParams(null)
    setPage(1)
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "职位",
      dataIndex: "position",
      key: "position",
      render: (_: unknown, { position }: any) => {
        if (position) {
          return <Tag color="#2db7f5">{position}</Tag>
        }
        return <Tag color="#f50">无</Tag>
      },
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      render: (_: unknown, { gender }: any) => {
        if (gender === 1) {
          return <Tag color="blue">男</Tag>
        } else if (gender === 2) {
          return <Tag color="purple">女</Tag>
        }
      },
    },
    {
      title: "账号来源",
      dataIndex: "create_from",
      key: "create_from",
      render: (_: unknown, { create_from }: any) => {
        if (create_from) {
          return <Tag color="yellow">Kanboard</Tag>
        }
        return <Tag color="cyan">Kanboard Admin</Tag>
      },
    },
    {
      title: "管理员",
      dataIndex: "is_admin",
      key: "is_admin",
      render: (_: unknown, { is_admin }: any) => {
        if (is_admin) {
          return <Tag color="green">是</Tag>
        }
        return <Tag color="red">否</Tag>
      },
    },
    {
      title: "登录",
      dataIndex: "loginable",
      key: "loginable",
      render: (_: unknown, { loginable }: any) => {
        if (loginable) {
          return <Tag color="green">可登录</Tag>
        }
        return <Tag color="red">不可登录</Tag>
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, data: any) => {
        const { id } = data
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditFilled />}
              onClick={() => {
                setEditData(data)
                setIsModalOpen(true)
              }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<DeleteFilled />}
              onClick={() => deleteMutation.mutate(id)}
              danger
            />
            <Button
              shape="circle"
              icon={<MoreOutlined />}
              color="cyan"
              variant="solid"
              onClick={() => {
                navigate(`/users/${id}`)
              }}
            />
          </Space>
        )
      },
    },
  ]

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>
        <UserOutlined style={{ color: "#1890ff" }} /> 用户管理
      </Title>
      <Card
        variant="borderless"
        style={{
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: "20px",
          }}
        >
          <Form
            layout="inline"
            form={form}
            onFinish={handleSearch}
          >
            <Form.Item name="id">
              <InputNumber
                min={1}
                style={{ width: 80 }}
                placeholder="id"
              />
            </Form.Item>
            <Form.Item name="username">
              <Input
                style={{ width: 200 }}
                allowClear
                placeholder="用户名"
              />
            </Form.Item>
            <Form.Item name="position">
              <Input
                style={{ width: 200 }}
                allowClear
                placeholder="职位"
              />
            </Form.Item>
            <Form.Item name="gender">
              <Select
                style={{ width: 100 }}
                showSearch
                allowClear
                placeholder="性别"
                optionFilterProp="label"
                options={[
                  { value: 1, label: "男" },
                  { value: 2, label: "女" },
                ]}
              />
            </Form.Item>
            <Form.Item name="create_from">
              <Select
                style={{ width: 150 }}
                showSearch
                allowClear
                placeholder="账号来源"
                optionFilterProp="label"
                options={[
                  { value: 0, label: "Kanboard Admin" },
                  { value: 1, label: "Kanboard" },
                ]}
              />
            </Form.Item>
            <Form.Item name="loginable">
              <Select
                style={{ width: 120 }}
                showSearch
                allowClear
                placeholder="是否可登录"
                optionFilterProp="label"
                options={[
                  { value: true, label: "可登录" },
                  { value: false, label: "不可登录" },
                ]}
              />
            </Form.Item>
            <Form.Item name="is_admin">
              <Select
                style={{ width: 120 }}
                showSearch
                allowClear
                placeholder="是否管理员"
                optionFilterProp="label"
                options={[
                  { value: true, label: "是" },
                  { value: false, label: "否" },
                ]}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                >
                  搜索
                </Button>
                <Button
                  type="primary"
                  onClick={handleReset}
                >
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
          <Button
            type="primary"
            onClick={() => setIsCreateOpen(true)}
          >
            添加用户
          </Button>
        </div>
        <Table
          style={{
            width: "100%",
          }}
          bordered
          size="small"
          scroll={{ y: 500 }}
          rowKey="id"
          loading={isLoading}
          dataSource={userData?.data}
          columns={columns}
          pagination={{
            position: ["bottomRight"],
            showTotal: (total) => `总共 ${total} 条`,
            total: userData?.total,
            current: page,
            pageSize: pageSize,
            onChange: (page, pageSize) => {
              setPage(page)
              setPageSize(pageSize)
            },
            showQuickJumper: true,
            showSizeChanger: true,
          }}
        />
      </Card>
      <UserEditModal
        initialValues={editData}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      />
      <UserCreateModal
        open={isCreateOpen}
        onOk={handleCreateOk}
        onCancel={handleCreateCancel}
      />
    </div>
  )
}

export default UsersTable
