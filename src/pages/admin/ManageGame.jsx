import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Layout,
  Modal,
  Select,
  Table,
  Upload,
  message,
} from "antd";
import { useEffect, useState } from "react";
import PageHeader from "./componentadmin/PageHeader";
import SidebarMenu from "./componentadmin/SidebarMenu";

const { Content } = Layout;
const { Option } = Select;

const mockGames = [
  {
    id: 1,
    name: "Game 1",
    description:
      "Description for Game 1 - This is a longer description to test truncation.",
    category: "MOBA",
    platform: "PC",
    status: "ACTIVE",
    image: null,
  },
  {
    id: 2,
    name: "Game 2",
    description: "Description for Game 2 - Another longer description example.",
    category: "FPS",
    platform: "MOBILE",
    status: "INACTIVE",
    image: null,
  },
];

// Hàm convert file thành base64
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function ManageGame() {
  const [games, setGames] = useState(mockGames);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();

  // Khi editingGame thay đổi (mở modal edit hoặc thêm mới), cập nhật form
  useEffect(() => {
    if (editingGame) {
      // set dữ liệu của game đang edit
      form.setFieldsValue({
        ...editingGame,
        image: editingGame.image
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: editingGame.image,
              },
            ]
          : [],
      });
    } else {
      form.resetFields();
    }
  }, [editingGame, form]);

  const handleAddEditGame = async (values) => {
    try {
      let imageBase64 = editingGame ? editingGame.image : null; // giữ ảnh cũ nếu không upload lại

      if (values.image && values.image.length > 0) {
        // Nếu upload ảnh mới thì convert thành base64
        // Nếu ảnh không phải là file mới (có url) thì giữ lại
        const file = values.image[0].originFileObj;
        if (file) {
          imageBase64 = await getBase64(file);
        } else if (values.image[0].url) {
          imageBase64 = values.image[0].url;
        }
      } else {
        // Nếu xóa ảnh trong form (không có file nào)
        imageBase64 = null;
      }

      const gameData = {
        ...values,
        image: imageBase64,
      };

      if (editingGame) {
        setGames((prev) =>
          prev.map((game) =>
            game.id === editingGame.id ? { ...game, ...gameData } : game
          )
        );
        message.success("Game updated successfully!");
      } else {
        const newGame = { ...gameData, id: games.length + 1 };
        setGames((prev) => [...prev, newGame]);
        message.success("Game added successfully!");
      }
      setIsModalVisible(false);
      setEditingGame(null);
      form.resetFields();
    } catch (error) {
      message.error("Error processing image");
    }
  };

  const handleDeleteGame = (id) => {
    setGames((prev) => prev.filter((game) => game.id !== id));
    message.success("Game deleted successfully!");
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) => index + 1,
      width: 50,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (img) =>
        img ? (
          <img
            src={img}
            alt="game"
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          <div
            style={{
              width: 60,
              height: 60,
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            No Image
          </div>
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (text.length > 50 ? text.slice(0, 50) + "..." : text),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <span>
          <Button
            type="default"
            icon={<EditOutlined />}
            style={{
              color: "#fff",
              backgroundColor: "#faad14",
              borderColor: "#faad14",
            }}
            onClick={() => {
              setEditingGame(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteGame(record.id)}
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const handleOpenModal = () => {
    setEditingGame(null); // reset để thêm mới
    setIsModalVisible(true);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SidebarMenu />

      <Layout>
        <PageHeader />

        <Content style={{ margin: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <h2 style={{ marginRight: 20 }}>Game Management</h2>
            <Input.Search
              placeholder="Search by game name"
              onSearch={handleSearch}
              style={{ width: 300 }}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e.target.value);
                }
              }}
            />
            <Button
              type="primary"
              onClick={handleOpenModal}
              style={{ marginLeft: 20 }}
            >
              Add Game
            </Button>
          </div>

          <Table
            dataSource={filteredGames}
            columns={columns}
            rowKey="id"
            bordered
            style={{ marginTop: 20 }}
            rowClassName={(record, index) =>
              index % 2 === 0 ? "row-light" : "row-dark"
            }
          />

          <Modal
            title={editingGame ? "Edit Game" : "Add Game"}
            visible={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              setEditingGame(null);
              form.resetFields();
            }}
            footer={null}
          >
            <Form form={form} onFinish={handleAddEditGame} layout="vertical">
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  { required: true, message: "Please input the game name!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: "Please input the game description!",
                  },
                ]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item
                name="category"
                label="Category"
                rules={[
                  { required: true, message: "Please select the category!" },
                ]}
              >
                <Select>
                  <Option value="MOBA">MOBA</Option>
                  <Option value="FPS">FPS</Option>
                  <Option value="RPG">RPG</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="platform"
                label="Platform"
                rules={[
                  { required: true, message: "Please select the platform!" },
                ]}
              >
                <Select>
                  <Option value="PC">PC</Option>
                  <Option value="MOBILE">MOBILE</Option>
                  <Option value="CONSOLE">CONSOLE</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="status"
                label="Status"
                rules={[
                  { required: true, message: "Please select the status!" },
                ]}
              >
                <Select>
                  <Option value="ACTIVE">ACTIVE</Option>
                  <Option value="INACTIVE">INACTIVE</Option>
                  <Option value="MAINTENANCE">MAINTENANCE</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="image"
                label="Game Image"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e && e.fileList;
                }}
                rules={[
                  {
                    required: !editingGame,
                    message: "Please upload game image!",
                  },
                ]}
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  {editingGame ? "Update" : "Add"}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
}

export default ManageGame;
