// src/pages/Dashboard.jsx
import { Card, Row, Col, Container } from 'react-bootstrap';
import { FaUsers, FaCoins, FaBell, FaUserCheck, FaUserPlus, FaRegClock } from 'react-icons/fa';

export default function Dashboard() {
  const cardStyle = {
    minHeight: '150px', color: 'white', border: 'none', borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold text-primary">Dashboard Overview</h2>
      <Row className="g-4">
        <Col md={4}><Card style={{ ...cardStyle, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}><Card.Body className="d-flex justify-content-between align-items-center"><div><Card.Title>Total Users</Card.Title><Card.Text className="fs-3 fw-semibold">120</Card.Text></div><FaUsers size={36} /></Card.Body></Card></Col>
        <Col md={4}><Card style={{ ...cardStyle, background: 'linear-gradient(135deg, #43cea2, #185a9d)' }}><Card.Body className="d-flex justify-content-between align-items-center"><div><Card.Title>Total Coins</Card.Title><Card.Text className="fs-3 fw-semibold">3,500</Card.Text></div><FaCoins size={36} /></Card.Body></Card></Col>
        <Col md={4}><Card style={{ ...cardStyle, background: 'linear-gradient(135deg, #ff758c, #ff7eb3)' }}><Card.Body className="d-flex justify-content-between align-items-center"><div><Card.Title>Notifications Sent</Card.Title><Card.Text className="fs-3 fw-semibold">25</Card.Text></div><FaBell size={36} /></Card.Body></Card></Col>
        <Col md={4}><Card style={{ ...cardStyle, background: 'linear-gradient(135deg, #f7971e, #ffd200)' }}><Card.Body className="d-flex justify-content-between align-items-center"><div><Card.Title>Active Users</Card.Title><Card.Text className="fs-3 fw-semibold">87</Card.Text></div><FaUserCheck size={36} /></Card.Body></Card></Col>
        <Col md={4}><Card style={{ ...cardStyle, background: 'linear-gradient(135deg, #00c6ff, #0072ff)' }}><Card.Body className="d-flex justify-content-between align-items-center"><div><Card.Title>New Users</Card.Title><Card.Text className="fs-3 fw-semibold">15</Card.Text></div><FaUserPlus size={36} /></Card.Body></Card></Col>
        <Col md={4}><Card style={{ ...cardStyle, background: 'linear-gradient(135deg, #c471f5, #fa71cd)' }}><Card.Body className="d-flex justify-content-between align-items-center"><div><Card.Title>Pending Requests</Card.Title><Card.Text className="fs-3 fw-semibold">6</Card.Text></div><FaRegClock size={36} /></Card.Body></Card></Col>
      </Row>

      <Card className="mt-5 shadow-sm border-0 rounded-4">
        <Card.Header className="bg-light fw-bold fs-5">Recent Activity</Card.Header>
        <Card.Body>
          <ul className="mb-0 ps-3">
            <li>🟢 Admin <strong>John</strong> added a new user – <small className="text-muted">2h ago</small></li>
            <li>💰 Coins credited to user <strong>#101</strong> – <small className="text-muted">1h ago</small></li>
            <li>📣 Notification sent to all users – <small className="text-muted">30m ago</small></li>
            <li>📝 Admin <strong>Priya</strong> updated internal user roles – <small className="text-muted">15m ago</small></li>
          </ul>
        </Card.Body>
      </Card>
    </Container>
  );
}
