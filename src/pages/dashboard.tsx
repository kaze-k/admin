import { dashboard, getRecentTasks } from "@/api/services/dashboard"
import { Line, Pie } from "@ant-design/charts"
import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  DisconnectOutlined,
  DownCircleOutlined,
  FireOutlined,
  FlagTwoTone,
  LinkOutlined,
  ManOutlined,
  PieChartTwoTone,
  ProfileTwoTone,
  ProjectTwoTone,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
  WomanOutlined,
} from "@ant-design/icons"
import { useQuery } from "@tanstack/react-query"
import { Card, Col, Row, Statistic, Table, Tag, Typography } from "antd"
import { useState } from "react"

const { Title } = Typography

function Dashboard() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(2)
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboard,
  })

  const projectData = data?.project
  const taskData = data?.task
  const userData = data?.user

  const { data: taskList } = useQuery({
    queryKey: ["taskList"],
    queryFn: getRecentTasks,
  })

  // 用户注册趋势图
  const userTrendData = userData?.created_at?.map((time: any, index: any) => ({
    time: new Date(time).toLocaleDateString(),
    userCount: index + 1,
  }))

  const userTrendConfig = userData && {
    data: userTrendData,
    xField: "time",
    yField: "userCount",
    point: {
      size: 5,
      shape: "diamond",
    },
  }

  // 任务优先级分布（饼图）
  const taskPriorityData = [
    { type: "高", value: taskData?.high },
    { type: "普通", value: taskData?.medium },
    { type: "低", value: taskData?.low },
  ]

  const taskPriorityConfig = taskData && {
    appendPadding: 10,
    data: taskPriorityData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
  }

  // 项目创建时间趋势
  const projectTrendData = projectData?.created_at?.map((time: any, index: any) => ({
    time: new Date(time).toLocaleDateString(),
    projectCount: index + 1,
  }))

  const projectTrendConfig = projectData && {
    data: projectTrendData,
    xField: "time",
    yField: "projectCount",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
        fontSize: 12,
      },
    },
  }

  // 数据趋势图（示例：任务创建数量趋势）
  const taskTrendData = taskData?.created_at?.map((time: any, index: any) => ({
    time: new Date(time).toLocaleDateString(),
    taskCount: index + 1,
  }))

  const config = taskData && {
    data: taskTrendData,
    xField: "time",
    yField: "taskCount",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
        fontSize: 12,
      },
    },
  }

  // 最近任务列表
  const taskColumns = [
    { title: "所属项目", dataIndex: "project_name", key: "project_id" },
    { title: "任务名称", dataIndex: "title", key: "title" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (_: unknown, { status }: any) => (
        <Tag color={status === 0 ? "red" : "blue"}>{status === 0 ? "未完成" : status === 1 ? "进行中" : "已完成"}</Tag>
      ),
    },
    {
      title: "优先级",
      dataIndex: "priority",
      key: "priority",
      render: (_: unknown, { priority }: any) => (
        <Tag color={priority === 0 ? "#2ba1e3" : priority === 1 ? "#ff0000" : "#fad314"}>
          {priority === 0 ? "普通" : priority === 1 ? "高" : "低"}
        </Tag>
      ),
    },
    { title: "创建时间", dataIndex: "created_at", key: "created_at" },
  ]

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>
        <PieChartTwoTone /> 数据概览
      </Title>

      <Row gutter={24}>
        <Col span={12}>
          <Card>
            <Statistic
              title="项目总数"
              prefix={<ProjectTwoTone />}
              value={projectData?.count}
            />
            <Statistic
              title="最新项目"
              prefix={<ClockCircleTwoTone />}
              value={new Date(projectData?.created_at[projectData?.created_at?.length - 1])?.toLocaleString()}
            />
            <Statistic
              title="最新任务"
              prefix={<ClockCircleTwoTone />}
              value={new Date(taskData?.created_at[taskData?.created_at?.length - 1])?.toLocaleString()}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <Statistic
              title={
                <>
                  创建于 <Tag color="cyan">Kanboard Admin</Tag>的用户
                </>
              }
              prefix={<UserOutlined style={{ color: "cyan" }} />}
              value={userData?.create_from_admin}
            />
            <Statistic
              title={
                <>
                  创建于 <Tag color="lime">kanboard</Tag>的用户
                </>
              }
              prefix={<UserOutlined style={{ color: "lime" }} />}
              value={userData?.create_from_kanboard}
            />
            <Statistic
              title="最新创建用户"
              prefix={<ClockCircleTwoTone />}
              value={new Date(userData?.created_at[userData?.created_at?.length - 1])?.toLocaleString()}
            />
          </Card>
        </Col>
      </Row>

      <Row
        gutter={24}
        style={{ marginTop: "20px" }}
      >
        <Col span={6}>
          <Card>
            <Statistic
              title="管理员总数"
              prefix={<UserOutlined style={{ color: "red" }} />}
              value={userData?.admin}
            />
            <Statistic
              title="可登录用户"
              prefix={<LinkOutlined style={{ color: "green" }} />}
              value={userData?.loginable}
            />
            <Statistic
              title="不可登录用户"
              prefix={<DisconnectOutlined style={{ color: "red" }} />}
              value={userData?.unloginable}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="用户总数"
              prefix={<TeamOutlined style={{ color: "green" }} />}
              value={userData?.count}
            />
            <Statistic
              title="男性用户"
              prefix={<ManOutlined style={{ color: "blue" }} />}
              value={userData?.male}
            />
            <Statistic
              title="女性用户"
              prefix={<WomanOutlined style={{ color: "red" }} />}
              value={userData?.female}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="任务总数"
              prefix={<ProfileTwoTone />}
              value={taskData?.count}
            />
            <Statistic
              title="未完成任务"
              prefix={<FlagTwoTone />}
              value={taskData?.undo}
            />
            <Statistic
              title="已完成任务"
              prefix={<CheckCircleTwoTone />}
              value={taskData?.done}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="高优先级任务"
              prefix={<FireOutlined style={{ color: "red" }} />}
              value={taskData?.high}
            />
            <Statistic
              title="普通优先级任务"
              prefix={<UnorderedListOutlined style={{ color: "blue" }} />}
              value={taskData?.medium}
            />
            <Statistic
              title="低优先级任务"
              prefix={<DownCircleOutlined style={{ color: "green" }} />}
              value={taskData?.low}
            />
          </Card>
        </Col>
      </Row>

      <Row
        gutter={16}
        style={{ marginTop: "20px" }}
      >
        <Col span={12}>
          <Card
            title="用户注册趋势"
            style={{ height: "100%" }}
          >
            <Line {...userTrendConfig} />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="任务优先级分布">
            <Pie {...taskPriorityConfig} />
          </Card>
        </Col>
      </Row>

      <Row
        gutter={16}
        style={{ marginTop: "20px" }}
      >
        <Col span={12}>
          <Card title="任务趋势图">
            <Line {...config} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="项目创建趋势">
            <Line {...projectTrendConfig} />
          </Card>
        </Col>
      </Row>

      <Row
        gutter={16}
        style={{ marginTop: "20px" }}
      >
        <Col span={24}>
          <Card title="最近任务">
            <Table
              columns={taskColumns}
              dataSource={taskList}
              rowKey="id"
              pagination={{
                current: page,
                pageSize: pageSize,
                onChange: (page, pageSize) => {
                  setPage(page)
                  setPageSize(pageSize)
                },
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
