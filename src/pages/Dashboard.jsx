// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Container, Spinner } from 'react-bootstrap';
import {
  FaUsers,
  FaCoins,
  FaBell,
  FaUserPlus
} from 'react-icons/fa';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/dashboard/stats`);
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [API_BASE_URL]);

  const cardStyle = {
    minHeight: '150px',
    color: 'white',
    border: 'none',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center my-5 text-danger">
        ⚠️ Failed to load dashboard stats.
      </div>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold text-primary">Dashboard Overview</h2>
      <Row className="g-4">
        <Col md={4}>
          <Card style={{ ...cardStyle, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>Total Users</Card.Title>
                <Card.Text className="fs-3 fw-semibold">{stats.total_users}</Card.Text>
              </div>
              <FaUsers size={36} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card style={{ ...cardStyle, background: 'linear-gradient(135deg, #43cea2, #185a9d)' }}>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>Total Coupons</Card.Title>
                <Card.Text className="fs-3 fw-semibold">{stats.total_coupons}</Card.Text>
              </div>
              <FaCoins size={36} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card style={{ ...cardStyle, background: 'linear-gradient(135deg, #ff758c, #ff7eb3)' }}>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>Wallet Orders</Card.Title>
                <Card.Text className="fs-3 fw-semibold">{stats.total_orders}</Card.Text>
              </div>
              <FaBell size={36} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card style={{ ...cardStyle, background: 'linear-gradient(135deg, #00c6ff, #0072ff)' }}>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>Internal Users</Card.Title>
                <Card.Text className="fs-3 fw-semibold">{stats.total_internal_users}</Card.Text>
              </div>
              <FaUserPlus size={36} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity (Optional UI)
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
      */}
    </Container>
  );
}
