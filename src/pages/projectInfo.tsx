import {
  addProjectMember,
  deleteProject,
  getMembers,
  getProject,
  removeProjectMember,
  setProjectAssignee,
  updateProject,
} from "@/api/services/projects"
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
import { Avatar, Button, Card, Col, Form, Input, List, Modal, Row, Select, Space, Tag, Typography } from "antd"
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

  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
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
          <Card>
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
                    onClick={() => setOpenAdd(true)}
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
