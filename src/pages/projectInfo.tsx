import {
  addProjectMember,
  deleteProject,
  getMembers,
  getProject,
  removeProjectMember,
  setProjectAssignee,
  updateProject,
} from "@/api/services/projects"
import { getTasks } from "@/api/services/task"
import {
  DeleteOutlined,
  EditOutlined,
  MailOutlined,
  ManOutlined,
  PhoneOutlined,
  UserOutlined,
  WomanOutlined,
} from "@ant-design/icons"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Avatar, Button, Card, Col, Form, Input, List, Modal, Row, Select, Space, Tag, Tooltip, Typography } from "antd"
import { isEqual, pickBy } from "lodash"
import { useEffect, useState } from "react"
import { useLoaderData, useNavigate } from "react-router"

const { Text } = Typography

function ProjectInfo() {
  const project = useLoaderData()
  const [data, setData] = useState(project)
  const [open, setOpen] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState([])
  const [selectedAssignees, setSelectedAssignees] = useState([])
  const [taskPage, setTaskPage] = useState(1)
  const [taskPageSize, setTaskPageSize] = useState(10)
  const navigate = useNavigate()
  const [updateForm] = Form.useForm()
  const [addForm] = Form.useForm()

  useEffect(() => {
    if (openAdd) {
      addForm.resetFields()
    }
  }, [openAdd])

  const onUpdate = () => {
    setOpen(true)
  }

  const { data: members, refetch } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  })
  const { data: tasks } = useQuery({
    queryKey: ["tasks", project.id, taskPage, taskPageSize],
    queryFn: () => getTasks(project.id, taskPage, taskPageSize),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
  })

  const onDelete = () => {
    deleteMutation.mutate(project.id, {
      onSuccess: () => {
        navigate("/projects")
      },
    })
  }

  const removeMemberMutation = useMutation({
    mutationFn: removeProjectMember,
  })

  const addMemberMutation = useMutation({
    mutationFn: addProjectMember,
  })

  const assigneeMutation = useMutation({
    mutationFn: setProjectAssignee,
  })

  const updateMutation = useMutation({
    mutationFn: updateProject,
  })

  return (
    <>
      <Card
        title={data.name}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={onUpdate}
            >
              更新项目
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={onDelete}
            >
              删除项目
            </Button>
          </Space>
        }
        style={{ width: "100%" }}
      >
        <Space
          style={{ width: "100%" }}
          direction="vertical"
        >
          <Card variant="borderless">
            <Space direction="vertical">
              <Text strong>描述: </Text>
              <Text>{data.desc ? data.desc : "无"}</Text>
              <Text strong>创建时间: </Text>
              <Text>{data.created_at}</Text>
              <Text strong>更新时间: </Text>
              <Text>{data.updated_at}</Text>
            </Space>
          </Card>
          <List
            pagination={{
              position: "bottom",
              align: "center",
              pageSize: 5,
            }}
            header={
              <Row justify="space-between">
                <Col>
                  <Text strong>成员列表</Text>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    onClick={() => {
                      refetch()
                      setOpenAdd(true)
                    }}
                  >
                    添加成员
                  </Button>
                </Col>
              </Row>
            }
            bordered
            dataSource={data.members}
            itemLayout="horizontal"
            renderItem={(member: any) => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    danger
                    onClick={() => {
                      removeMemberMutation.mutate(
                        {
                          project_id: project.id,
                          members: [member.id],
                        },
                        {
                          onSuccess: async () => {
                            const newData = await getProject(project.id)
                            setData(newData)
                          },
                        },
                      )
                    }}
                  >
                    删除
                  </Button>,
                  <Button
                    type="primary"
                    onClick={() => navigate(`/users/${member.id}`)}
                  >
                    查看
                  </Button>,
                  !member.assignee ? (
                    <Button
                      onClick={() =>
                        assigneeMutation.mutate(
                          { project_id: project.id, members: [member.id], value: true },
                          {
                            onSuccess: async () => {
                              const newData = await getProject(project.id)
                              setData(newData)
                            },
                          },
                        )
                      }
                    >
                      成为负责人
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        assigneeMutation.mutate(
                          { project_id: project.id, members: [member.id], value: false },
                          {
                            onSuccess: async () => {
                              const newData = await getProject(project.id)
                              setData(newData)
                            },
                          },
                        )
                      }
                    >
                      取消负责人
                    </Button>
                  ),
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <Space>
                      <Text>{member.username}</Text>
                      <div>
                        {member.gender === 1 && (
                          <Tag
                            color="#2db7f5"
                            icon={<ManOutlined />}
                          />
                        )}
                        {member.gender === 2 && (
                          <Tag
                            color="#f50"
                            icon={<WomanOutlined />}
                          />
                        )}
                        {member.position && <Tag color="blue">{member.position}</Tag>}
                        {member.assignee && <Tag color="green">项目负责人</Tag>}
                      </div>
                    </Space>
                  }
                  description={
                    <>
                      {member.email && <Tag icon={<MailOutlined />}>{member.email}</Tag>}
                      {member.mobile && <Tag icon={<PhoneOutlined />}>{member.mobile}</Tag>}
                    </>
                  }
                />
              </List.Item>
            )}
          />

          <List
            pagination={{
              position: "bottom",
              align: "center",
              onChange: (page, pageSize) => {
                setTaskPage(page)
                setTaskPageSize(pageSize)
              },
              total: tasks?.total,
              current: taskPage,
              pageSize: taskPageSize,
            }}
            header={
              <Row justify="center">
                <Col>
                  <Text strong>任务列表</Text>
                </Col>
              </Row>
            }
            bordered
            dataSource={tasks?.data}
            itemLayout="horizontal"
            renderItem={(task: any) => (
              <List.Item>
                <Card
                  variant="borderless"
                  style={{ width: "100%" }}
                  title={task.title}
                  extra={
                    <Tag color={task.status === 0 ? "red" : "green"}>{task.status === 0 ? "未完成" : "已完成"}</Tag>
                  }
                >
                  <Space direction="vertical">
                    <Space>
                      <Text strong>任务ID:</Text>
                      {task.id}
                    </Space>
                    <Space>
                      <Text strong>创建时间:</Text>
                      {task.created_at}
                    </Space>
                    <Space>
                      <Text strong>更新时间:</Text>
                      {task.updated_at}
                    </Space>
                    <Space>
                      <Text strong>描述:</Text>
                      {task.desc}
                    </Space>
                    <Space>
                      <Text strong>截止日期:</Text>
                      {task.due_date}
                    </Space>
                    <Space>
                      <Text strong>优先级:</Text>
                      <Tag color={task.priority === 0 ? "blue" : "orange"}>
                        {task.priority === 0 ? "普通" : "高优先级"}
                      </Tag>
                    </Space>
                    <Space>
                      <Text strong>任务负责人:</Text>
                      <Avatar.Group
                        max={{
                          count: 5,
                          popover: {
                            color: "#00A76F",
                          },
                        }}
                      >
                        {task.members.map((m: any) => (
                          <Tooltip
                            title={m.username}
                            placement="top"
                            key={m.user_id}
                          >
                            <Avatar icon={<UserOutlined />}></Avatar>
                          </Tooltip>
                        ))}
                      </Avatar.Group>
                    </Space>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        </Space>
      </Card>

      <Modal
        title="更新项目"
        open={open}
        onOk={() => updateForm.submit()}
        onCancel={() => setOpen(false)}
      >
        <Form
          form={updateForm}
          initialValues={data}
          onFinish={(values) => {
            const changedValues = pickBy(values, (value, key) => !isEqual(value, data[key]))

            const newData = { ...changedValues, id: project.id }
            updateMutation.mutate(newData, {
              onSuccess: async () => {
                const newData = await getProject(project.id)
                setData(newData)
                setOpen(false)
              },
            })
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
        </Form>
      </Modal>

      <Modal
        title="添加"
        open={openAdd}
        onOk={() => addForm.submit()}
        onCancel={() => setOpenAdd(false)}
      >
        <Form
          form={addForm}
          onFinish={() => {
            const data = {
              project_id: project.id,
              members: selectedMembers,
              assignees: selectedAssignees,
            }
            addMemberMutation.mutate(data, {
              onSuccess: async () => {
                const newData = await getProject(project.id)
                setData(newData)
                setOpenAdd(false)
              },
            })
          }}
        >
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
    </>
  )
}

export default ProjectInfo
