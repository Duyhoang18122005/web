import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Layout,
  message,
  Modal,
  Select,
  Table,
} from "antd";
import { useState } from "react";
import PageHeader from "./componentadmin/PageHeader";
import SidebarMenu from "./componentadmin/SidebarMenu";

const { Content } = Layout;
const { Option } = Select;

const mockUsers = [
  {
    id: 1,
    username: "johndoe",
    email: "john@example.com",
    password: "********",
    fullName: "John Doe",
    phoneNumber: "0123456789",
    address: "123 Street, City",
    role: "Admin",
  },
  {
    id: 2,
    username: "janedoe",
    email: "jane@example.com",
    password: "********",
    fullName: "Jane Doe",
    phoneNumber: "0987654321",
    address: "456 Avenue, City",
    role: "User",
  },
];

function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id ? { ...user, ...values } : user
        )
      );
      message.success("User updated successfully!");
    } else {
      const newUser = {
        ...values,
        id: users.length + 1,
      };
      setUsers((prev) => [...prev, newUser]);
      message.success("User added successfully!");
    }
    handleCancel();
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    setIsModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
    message.success("User deleted successfully!");
  };

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
      width: 50,
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Password",
      dataIndex: "password",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <>
          <Button
            type="default"
            icon={<EditOutlined />}
            style={{
              color: "#fff",
              backgroundColor: "#faad14",
              borderColor: "#faad14",
            }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  // Lọc người dùng theo từ khóa tìm kiếm
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SidebarMenu />

      <Layout>
        <PageHeader />

        <Content style={{ margin: "20px" }}>
          {/* Container cho tiêu đề, thanh tìm kiếm và nút */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <h2 style={{ margin: 0 }}>User Management</h2>

            <Input
              placeholder="Search by username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />

            <Button type="primary" onClick={showModal}>
              Add User
            </Button>
          </div>

          <Table
            dataSource={filteredUsers}
            columns={columns}
            rowKey="id"
            bordered
            rowClassName={(_, index) =>
              index % 2 === 0 ? "row-light" : "row-dark"
            }
          />

          <Modal
            title={editingUser ? "Edit User" : "Add User"}
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={editingUser || {}}
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Please enter username" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please enter email" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ required: true, message: "Please enter full name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: "Please enter address" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: "Please select role" }]}
              >
                <Select placeholder="Select a role">
                  <Option value="Admin">Admin</Option>
                  <Option value="User">User</Option>
                  <Option value="Moderator">Player</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  {editingUser ? "Update" : "Add"}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
}

export default UserManagement;
