import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Spinner, Alert, Button } from 'react-bootstrap';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageInfo, setPageInfo] = useState({});

  const fetchOrders = async (direction = 'next') => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, {
        params: {
          limit: 10,
          ...(direction === 'next' && pageInfo.next ? { page_info: pageInfo.next } : {}),
          ...(direction === 'prev' && pageInfo.prev ? { page_info: pageInfo.prev } : {}),
        }
      });

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

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Shopify Orders</h3>

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
