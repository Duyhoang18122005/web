// src/components/SidebarMenu.js
import {
  AppstoreOutlined,
  AreaChartOutlined,
  CalendarOutlined,
  DashboardOutlined,
  LoginOutlined,
  MessageOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
// import logo from "../../../image/logo.png";

const { Sider } = Layout;

const SidebarMenu = () => {
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    navigate(`/${e.key}`);
  };

  return (
    <Sider theme="light" width={200}>
      <div style={{ padding: 20, textAlign: "center" }}>
        {/* <img src={logo} style={{ width: 45 }} alt="Logo" /> */}
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={[window.location.pathname.replace("/", "")]}
        onClick={handleMenuClick}
      >
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          Dashboard
        </Menu.Item>
        <Menu.Item key="managegame" icon={<MessageOutlined />}>
          User Management
        </Menu.Item>
        <Menu.Item key="transaction" icon={<TagsOutlined />}>
          List Game
        </Menu.Item>
        <Menu.Item key="transactionhistory" icon={<CalendarOutlined />}>
          Transaction History
        </Menu.Item>
        <Menu.Item key="admin/playerregistration" icon={<AreaChartOutlined />}>
          Player Registration
        </Menu.Item>
        <Menu.Item key="ui" icon={<AppstoreOutlined />}>
          UI Elements
        </Menu.Item>
        <Menu.Item key="cards" icon={<AppstoreOutlined />}>
          Cards
        </Menu.Item>
        <Menu.Item key="login" icon={<LoginOutlined />}>
          Login
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SidebarMenu;
