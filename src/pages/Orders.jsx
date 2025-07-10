import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Table, Spinner, Alert,
  Button, Form, Row, Col
} from 'react-bootstrap';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageInfo, setPageInfo] = useState({});
  const [searchParams, setSearchParams] = useState({
    name: '',
    email: '',
    financial_status: '',
    fulfillment_status: ''
  });

  const fetchOrders = async (direction = 'next') => {
    try {
      setLoading(true);
      const params = {
        limit: 10,
        ...searchParams,
        ...(direction === 'next' && pageInfo.next ? { page_info: pageInfo.next } : {}),
        ...(direction === 'prev' && pageInfo.prev ? { page_info: pageInfo.prev } : {}),
      };

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, { params });
      setOrders(res.data.orders || []);

      const linkHeader = res.headers.link;
      const newPageInfo = {};
      if (linkHeader) {
        const links = linkHeader.split(',').map(link => link.trim());
        links.forEach(link => {
          const [url, rel] = link.split(';');
          const match = url.match(/page_info=([^&>]+)/);
          if (match) {
            if (rel.includes('next')) newPageInfo.next = match[1];
            if (rel.includes('previous')) newPageInfo.prev = match[1];
          }
        });
      }
      setPageInfo(newPageInfo);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearchChange = (e) => {
    setSearchParams(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPageInfo({});
    fetchOrders();
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Shopify Orders</h3>

      <Form onSubmit={handleSearchSubmit} className="mb-3">
        <Row>
          <Col md={3}><Form.Control type="text" placeholder="Search by name" name="name" onChange={handleSearchChange} /></Col>
          <Col md={3}><Form.Control type="text" placeholder="Search by email" name="email" onChange={handleSearchChange} /></Col>
          <Col md={3}>
            <Form.Select name="financial_status" onChange={handleSearchChange}>
              <option value="">Financial Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select name="fulfillment_status" onChange={handleSearchChange}>
              <option value="">Fulfillment Status</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="unfulfilled">Unfulfilled</option>
              <option value="partial">Partial</option>
            </Form.Select>
          </Col>
        </Row>
        <Button className="mt-2" type="submit">Apply Filters</Button>
      </Form>

      {loading && <Spinner animation="border" />}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.id}</td>
                  <td>{order.customer?.first_name} {order.customer?.last_name}</td>
                  <td>{order.email}</td>
                  <td>{order.total_price} {order.currency}</td>
                  <td>{order.fulfillment_status || 'Unfulfilled'}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between">
            <Button disabled={!pageInfo.prev} onClick={() => fetchOrders('prev')}>Previous</Button>
            <Button disabled={!pageInfo.next} onClick={() => fetchOrders('next')}>Next</Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default Orders;
