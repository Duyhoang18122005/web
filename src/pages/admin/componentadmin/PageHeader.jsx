// src/components/PageHeader.js
import { Avatar, Col, Layout, Row, Typography } from "antd";

const { Header } = Layout;
const { Title, Text } = Typography;

const PageHeader = () => {
  return (
    <Header style={{ background: "#fff", padding: 0, paddingLeft: 20 }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4}>Hello Admin!</Title>
        </Col>
        <Col>
          <Avatar src="https://tse4.mm.bing.net/th?id=OIP.HPxkZlkBXffK_y5oWzqy2gHaE4&pid=Api&P=0&h=220" />
          <Text style={{ marginRight: 16, marginLeft: 8 }}>Duong</Text>
        </Col>
      </Row>
    </Header>
  );
};

export default PageHeader;
