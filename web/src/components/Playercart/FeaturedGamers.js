import { StarOutlined } from '@ant-design/icons';
import { Card, Col, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { Getplayer } from "../../data/call_api/CallApiPlayer";

const { Title, Text } = Typography;

const FeaturedGamers = () => {
  const [gamers, setGamers] = useState([]);

  useEffect(() => {
    Getplayer((err, data) => {
      if (!err) {
        setGamers(data);
      } else {
        console.error("Lỗi khi lấy dữ liệu người chơi:", err);
      }
    });
  }, []);

  return (
    <div style={{ marginBottom: '20px', padding: "20px", backgroundColor: "#111827", color: "white" }}>
      <Title level={2} style={{ color: "white", marginBottom: '25px' }}>
        <StarOutlined style={{ color: '#C084FC', marginRight: '8px' }} />
        Game Thủ Nổi Bật
      </Title>

      <Row gutter={[16, 38]} justify="start">
        {gamers.map((gamer) => {
          const name = gamer.username || "chim sẻ đi nắng";
          const gameName = gamer.game?.name || "League of Legends mobi";
          const price = `${gamer.pricePerHour || 150000} COIN`;

          return (
            <Col
              key={gamer.id}
              xs={24} sm={12} md={8} lg={6} xl={6}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Card
                bodyStyle={{ padding: 0 }}
                style={{
                  backgroundColor: "#1F2937",
                  color: "white",
                  width: "100%",
                  maxWidth: "240px",
                  height: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid #111827',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
                cover={
                  <div style={{ width: "100%", height: '160px', overflow: 'hidden' }}>
                    <img
                      alt={name}
                      src={gamer.avatar || 'https://tse1.mm.bing.net/th?id=OIP.2AXhJTWqMY-eLmxWW6UuUAHaHa&pid=Api&P=0&w=300&h=300'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                }
              >
                <div style={{
                  backgroundColor: "#202938",
                  borderRadius: '4px',
                  textAlign: 'left',
                  padding: '8px'
                }}>
                  <Text style={{ color: 'white', fontSize: "18px" }} strong>{name}</Text>
                  <br />
                  <Text style={{ color: 'white' }}>🎮 {gameName}</Text>
                  <br />
                  <Text style={{ color: '#FFD700', fontSize: '14px' }}>⭐ 4.8 sao</Text>
                  <br />
                  <Text style={{ color: '#f39c12' }}>{price}</Text>
                </div>
              </Card>
              </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default FeaturedGamers;