import { deleteMsg, getAllMsgs } from "@/api/services/message"
import { avatarPath } from "@/utils/resources"
import { DeleteFilled, MessageTwoTone, UserOutlined } from "@ant-design/icons"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Avatar, Button, Card, Table, Tag, Tooltip, Typography } from "antd"
import { useState } from "react"

const { Title } = Typography

function Messages() {
  const [count, setCount] = useState(10)
  const [page, setPage] = useState(1)

  const { data, refetch } = useQuery({
    queryKey: ["messages", count],
    queryFn: () => getAllMsgs(count),
  })

  const deleteMsgMutation = useMutation({
    mutationFn: deleteMsg,
    onSuccess: () => {
      refetch()
    },
  })

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "内容",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "接收人",
      dataIndex: "to",
      key: "to",
      render: (_: unknown, data: any) =>
        data?.to && data?.to?.length > 0 ? (
          <Avatar.Group
            max={{
              count: 5,
            }}
          >
            {data.to.map((item: any) => (
              <Tooltip
                key={item.user_id}
                title={item.username}
              >
                <Avatar
                  icon={item?.avatar ? null : <UserOutlined />}
                  src={avatarPath(item?.avatar) || undefined}
                />
              </Tooltip>
            ))}
          </Avatar.Group>
        ) : (
          <Tag color="red">无</Tag>
        ),
    },
    {
      title: "删除",
      key: "delete",
      render: (_: unknown, data: any) => {
        return (
          <Button
            danger
            icon={<DeleteFilled />}
            onClick={() => {
              deleteMsgMutation.mutate({ msg_id: data.id })
            }}
          />
        )
      },
    },
  ]

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>
        <MessageTwoTone /> 消息管理
      </Title>
      <Card>
        <Table
          rowKey="id"
          style={{ width: "100%" }}
          scroll={{ y: 500 }}
          columns={columns}
          dataSource={data}
          pagination={{
            position: ["bottomCenter"],
            showTitle: true,
            showLessItems: true,
            showPrevNextJumpers: true,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSize: count,
            current: page,
            pageSizeOptions: ["10", "20", "30", "40", "50"],
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => {
              setPage(page)
              setCount(pageSize)
            },
          }}
        />
      </Card>
    </div>
  )
}

export default Messages
