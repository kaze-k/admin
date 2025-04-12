import { getReadedMsgs, getUnReadMsgs, markReadMsgs } from "@/api/services/message"
import { useMsg } from "@/api/services/websocket"
import useUserStore from "@/stores/userStore"
import { BellFilled, CheckCircleOutlined } from "@ant-design/icons"
import { useMutation } from "@tanstack/react-query"
import { Badge, Button, Card, Col, Drawer, Row, Space, Tabs, TabsProps, Tag, Tooltip, notification } from "antd"
import { useEffect, useState } from "react"

interface MsgType {
  message_type: string
  unread_count: number
  payload: any
}

function MessageCard({ message, created_at, onClick, dot }: any) {
  if (!onClick)
    return (
      <Badge styles={{ root: { width: "100%" } }}>
        <Badge.Ribbon text="已读">
          <Card
            title={
              <Row
                gutter={24}
                justify="space-between"
              >
                <Col
                  span={10}
                  style={{ display: "flex", justifyContent: "flex-start", alignContent: "center", textAlign: "left" }}
                >
                  <Space>
                    <BellFilled />
                    消息
                  </Space>
                </Col>
                <Col
                  span={14}
                  style={{ display: "flex", justifyContent: "flex-start", alignContent: "center", textAlign: "left" }}
                >
                  <Space>
                    <Tag color="blue">{created_at}</Tag>
                  </Space>
                </Col>
              </Row>
            }
            style={{ width: "100%" }}
            hoverable
          >
            <p>{message}</p>
          </Card>
        </Badge.Ribbon>
      </Badge>
    )

  return (
    <Badge
      dot={dot}
      styles={{ root: { width: "100%" } }}
    >
      <Card
        title={
          <Row
            gutter={24}
            justify="space-between"
          >
            <Col
              span={10}
              style={{ display: "flex", justifyContent: "flex-start", alignContent: "center", textAlign: "left" }}
            >
              <Space>
                <BellFilled />
                消息
              </Space>
            </Col>
            <Col
              span={10}
              style={{ display: "flex", justifyContent: "center", alignContent: "center", textAlign: "center" }}
            >
              <Space>
                <Tag color="blue">{created_at}</Tag>
              </Space>
            </Col>
            <Col
              span={4}
              style={{ display: "flex", justifyContent: "flex-end", alignContent: "center", textAlign: "right" }}
            >
              <Tooltip
                placement="top"
                title="标记为已读"
              >
                <Button
                  type="primary"
                  shape="circle"
                  onClick={onClick}
                  icon={<CheckCircleOutlined />}
                />
              </Tooltip>
            </Col>
          </Row>
        }
        style={{ width: "100%" }}
        hoverable
      >
        <p>{message}</p>
      </Card>
    </Badge>
  )
}

function MessageButton() {
  const [open, setOpen] = useState(false)
  const [api, contextHolder] = notification.useNotification()
  const [readedMsg, setReadedMsg] = useState([])
  const [unreadMsg, setUnreadMsg] = useState([])
  const Msg = useMsg()
  const msgObj: MsgType = Msg()
  const { message_type, unread_count, payload } = msgObj

  const openNotification = () => {
    if (message_type !== "new_message") return
    api.open({
      message: payload,
      placement: "bottomRight",
    })
  }

  const handleClick = async () => {
    if (open) setOpen(false)
    else setOpen(true)

    const unreadMsgData = await getUnReadMsgMutation.mutateAsync()
    setUnreadMsg(unreadMsgData)

    const readedMsgData = await getReadedMsgMutation.mutateAsync()
    setReadedMsg(readedMsgData)
  }

  const getUnReadMsgMutation = useMutation({
    mutationFn: getUnReadMsgs,
  })

  const getReadedMsgMutation = useMutation({
    mutationFn: getReadedMsgs,
  })

  useEffect(() => {
    openNotification()
    getUnReadMsgMutation.mutate(undefined, {
      onSuccess: (unreadMsgData) => {
        setUnreadMsg(unreadMsgData)
      },
    })

    getReadedMsgMutation.mutateAsync(undefined, {
      onSuccess(readedMsgData) {
        setReadedMsg(readedMsgData)
      },
    })
  }, [msgObj])

  const markReadedMutation = useMutation({
    mutationFn: markReadMsgs,
    async onSuccess() {
      const unreadMsgData = await getUnReadMsgMutation.mutateAsync()
      setUnreadMsg(unreadMsgData)

      const readedMsgData = await getReadedMsgMutation.mutateAsync()
      setReadedMsg(readedMsgData)
    },
  })

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <Badge
          size="small"
          count={unread_count}
          offset={[5, -8]}
        >
          未读
        </Badge>
      ),
      children: (
        <Space
          direction="vertical"
          style={{ width: "100%" }}
        >
          {unreadMsg.map((message: { id: number; content: string; created_at: string }) => (
            <MessageCard
              dot
              key={message.id}
              message={message.content}
              created_at={message.created_at}
              onClick={() => {
                const id = useUserStore.getState().userInfo.id
                if (id) {
                  markReadedMutation.mutate({ id: Number(id), msg_id: message.id })
                }
              }}
            />
          ))}
        </Space>
      ),
    },
    {
      key: "2",
      label: "已读",
      children: (
        <Space
          direction="vertical"
          style={{ width: "100%" }}
        >
          {readedMsg.map((message: any) => (
            <MessageCard
              key={message.id}
              message={message.content}
              created_at={message.created_at}
            />
          ))}
        </Space>
      ),
    },
  ]

  return (
    <>
      {contextHolder}
      <Badge count={unread_count}>
        <Button
          shape="circle"
          onClick={handleClick}
          icon={<BellFilled />}
        />
      </Badge>
      <Drawer
        title="消息通知"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Tabs
          defaultActiveKey="1"
          items={items}
        />
      </Drawer>
    </>
  )
}

export default MessageButton
