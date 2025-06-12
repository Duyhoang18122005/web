import { Layout } from "antd";
import PageHeader from "./componentadmin/PageHeader";
import SidebarMenu from "./componentadmin/SidebarMenu";
const { Content } = Layout;

function TransactionHistory() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SidebarMenu />

      <Layout>
        <PageHeader />

        <Content style={{ margin: "20px" }}></Content>
      </Layout>
    </Layout>
  );
}
export default TransactionHistory;
