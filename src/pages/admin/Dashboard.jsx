import { Card, Col, Layout, Row, Statistic, Typography } from "antd";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import PageHeader from "./componentadmin/PageHeader";
import SidebarMenu from "./componentadmin/SidebarMenu";

const { Content } = Layout;
const { Title, Text } = Typography;

const data = [
  { month: "Jan", Player: 40, User: 40, Orders: 55 },
  { month: "Feb", Player: 50, User: 50, Orders: 70 },
  { month: "Mar", Player: 45, User: 45, Orders: 60 },
  { month: "Apr", Player: 60, User: 60, Orders: 75 },
  { month: "May", Player: 0, User: 0, Orders: 0 },
  { month: "Jun", Player: 0, User: 0, Orders: 0 },
  { month: "Jul", Player: 0, User: 0, Orders: 0 },
  { month: "Aug", Player: 0, User: 0, Orders: 0 },
  { month: "Sep", Player: 0, User: 0, Orders: 0 },
  { month: "Oct", Player: 0, User: 0, Orders: 0 },
  { month: "Nov", Player: 0, User: 0, Orders: 0 },
  { month: "Dec", Player: 0, User: 0, Orders: 0 },
];

const areaChartData = [
  { month: "Jan", value: 200 },
  { month: "Feb", value: 450 },
  { month: "Mar", value: 300 },
  { month: "Apr", value: 500 },
  { month: "May", value: 600 },
  { month: "Jun", value: 300 },
  { month: "Jul", value: 750 },
  { month: "Aug", value: 400 },
  { month: "Sep", value: 650 },
  { month: "Oct", value: 850 },
  { month: "Nov", value: 700 },
  { month: "Dec", value: 900 },
];

const Dashboard = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SidebarMenu />

      <Layout>
        <PageHeader title="Hello Admin!" username="Duong" />

        <Content style={{ margin: "20px" }}>
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic title="User" value={3.0} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Order" value={5.0} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Player" value={200} />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 24 }}>
            <Col span={12}>
              <Card title="User, Orders, Player Over 12 Months">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Player" fill="#f0564a" />
                    <Bar dataKey="User" fill="#28a745" />
                    <Bar dataKey="Orders" fill="#007bff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col span={12}>
              <Card title="Area Chart Over 12 Months">
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart
                    data={areaChartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 900]} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
