import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Spinner, Alert, Card, Row, Col, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const UserDetails = () => {
  const { shopifyId } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserDetails();
  }, [shopifyId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${shopifyId}`);
      setUser(userRes.data.user);
      setOrders(userRes.data.orders || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!user) return <Alert variant="warning">User not found.</Alert>;

  return (
    <Container className="mt-4">
      <h3>User Details</h3>
      <Card className="mb-3">
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.mobile}</p>
              <p><strong>Coins:</strong> {user.coins}</p>
              <p><strong>Total Spent:</strong> QAR {parseFloat(user.shopify_total_spent).toFixed(2)}</p>
              <p><strong>Orders:</strong> {user.shopify_orders_count}</p>
              <p><strong>Created At:</strong> {new Date(user.shopify_created_at).toLocaleDateString()}</p>
            </Col>
            <Col md={6}>
              <p><strong>Address:</strong></p>
              <p>
                {[user.address1, user.address2, user.city, user.province, user.zip, user.country]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <p><strong>Device ID:</strong> {user.device_id}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <h5>User Orders</h5>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order.id}>
                <td>{idx + 1}</td>
                <td>{order.id}</td>
                <td>QAR {parseFloat(order.total_price).toFixed(2)}</td>
                <td>{order.financial_status}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default UserDetails;
