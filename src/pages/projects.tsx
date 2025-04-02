import { createProject, deleteProject, getMembers, getProjects } from "@/api/services/projects"
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ProjectTwoTone,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
  theme,
} from "antd"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

function Projects() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [open, setOpen] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState([])
  const [members, setMembers] = useState([])
  const [selectedAssignees, setSelectedAssignees] = useState([])
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const { Title, Text } = Typography

  const { data } = useQuery({
    queryKey: ["projects", page, pageSize],
    queryFn: () => getProjects(page, pageSize),
  })

  const MemberMutation = useMutation({
    mutationFn: getMembers,
  })

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      setOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })

  useEffect(() => {
    if (open) {
      form.resetFields()
    }
  }, [open, form])

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>
        <ProjectTwoTone /> 项目管理
      </Title>
      <Card>
        <Row gutter={16}>
          <Col span={6}>
            <Card
              style={{
                width: 300,
                height: 240,
                padding: "10px",
                margin: "10px 0",
                textAlign: "center",
                cursor: "pointer",
                transition: "all .3s",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={async () => {
                const data = await MemberMutation.mutateAsync()
                setMembers(data)
                setOpen(true)
              }}
            >
              <PlusOutlined style={{ fontSize: "50px" }} />
            </Card>
          </Col>
          {data?.data?.map((project: any) => (
            <Col
              key={project.id}
              span={6}
            >
              <Card
                hoverable
                style={{
                  width: 300,
                  height: 240,
                  padding: "10px",
                  margin: "10px 0",
                  cursor: "pointer",
                  transition: "all .3s",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "#00A76F",
                }}
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <Button
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                  }}
                  type="primary"
                  danger
                  shape="circle"
                  icon={<DeleteOutlined />}
                  onClick={(event) => {
                    event.stopPropagation()
                    deleteMutation.mutate(project.id)
                  }}
                />
                <Title
                  level={4}
                  ellipsis
                >
                  {project.name}
                </Title>
                <Text
                  type="secondary"
                  ellipsis
                >
                  {project.desc ? project.desc : "无项目描述"}
                </Text>

                <Space
                  direction="vertical"
                  size="small"
                  style={{ marginTop: 12, width: "100%" }}
                >
                  <Space size="middle">
                    <ClockCircleOutlined />
                    <Text type="secondary">创建: {project.created_at}</Text>
                  </Space>
                  <Space size="middle">
                    <EditOutlined />
                    <Text type="secondary">更新: {project.created_at}</Text>
                  </Space>
                </Space>

                <Space style={{ marginTop: 16 }}>
                  <Space size="middle">
                    <UsergroupAddOutlined />
                    {project.members.length === 0 && <Text type="secondary">无成员</Text>}
                    <Avatar.Group
                      max={{
                        count: 5,
                        popover: {
                          color: "#00A76F",
                        },
                      }}
                    >
                      {project.members?.map((member: any) => (
                        <Tooltip
                          title={member.username}
                          placement="top"
                          key={member.user_id}
                        >
                          <Avatar
                            icon={<UserOutlined />}
                            src={member.avatar}
                          />
                        </Tooltip>
                      ))}
                    </Avatar.Group>
                  </Space>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
        <Card
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            marginTop: "20px",
          }}
        >
          <Pagination
            showTotal={(total) => `总共 ${total} 条`}
            current={page}
            pageSize={pageSize}
            total={data?.total}
            onChange={(page, pageSize) => {
              setPage(page)
              setPageSize(pageSize)
            }}
            showQuickJumper
            showSizeChanger
          />
        </Card>
      </Card>

      <Modal
        title="创建项目"
        open={open}
        onOk={() => form.submit()}
        onCancel={() => setOpen(false)}
      >
        <Form
          form={form}
          onFinish={(values) => {
            const data = {
              name: values.name,
              desc: values.desc,
              assignees: selectedAssignees,
              members: selectedMembers,
            }
            createMutation.mutate(data)
          }}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "请输入项目名称" }]}
            label="项目名称"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="desc"
            label="项目描述"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="assignees"
            label="项目负责人"
          >
            <Select
              mode="multiple"
              showSearch
              optionFilterProp="label"
              onChange={(selectedValues) => {
                const selectedObjects = members.filter((member: any) => selectedValues.includes(member.user_id))
                setSelectedAssignees(selectedObjects)
              }}
            >
              {members?.map((member: any) => (
                <Select.Option
                  key={member.user_id}
                  value={member.user_id}
                  label={member.username}
                >
                  {member.username}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="members"
            label="项目成员"
          >
            <Select
              mode="multiple"
              showSearch
              optionFilterProp="label"
              onChange={(selectedValues) => {
                const selectedObjects = members.filter((member: any) => selectedValues.includes(member.user_id))
                setSelectedMembers(selectedObjects)
              }}
            >
              {members?.map((member: any) => (
                <Select.Option
                  key={member.user_id}
                  value={member.user_id}
                  label={member.username}
                >
                  {member.username}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Projects
