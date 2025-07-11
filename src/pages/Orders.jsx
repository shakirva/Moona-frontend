import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap';
import { capitalizeFirstLetter } from '../utils/helpers';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageInfo, setPageInfo] = useState({ prev_link: '', next_link: '', current_type: '' });
  const [searchParams, setSearchParams] = useState({
    order_id: '',
    name: '',
    email: '',
    financial_status: '',
    fulfillment_status: ''
  });

  const fetchOrders = async (direction) => {
    try {
      setLoading(true);
      if (direction) {
        setPageInfo(prev => ({
          ...prev,
          current_type: direction
        }));
      }

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, {
        params: { limit: 10, pageInfo: pageInfo, searchParams: searchParams }
      });

      // Set orders from the response
      setOrders(res.data.orders || []);
      setPageInfo(prev => ({
        ...prev,
        prev_link: res.data.prev_link || '',
        next_link: res.data.next_link || '',
      }));
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
          <Col><Form.Control type="text" placeholder="Search by Order Id" name="order_id" onChange={handleSearchChange} /></Col>
          <Col><Form.Control type="text" placeholder="Search by name" name="name" onChange={handleSearchChange} /></Col>
          <Col><Form.Control type="text" placeholder="Search by email" name="email" onChange={handleSearchChange} /></Col>
          <Col>
            <Form.Select name="financial_status" onChange={handleSearchChange}>
              <option value="">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Select name="fulfillment_status" onChange={handleSearchChange}>
              <option value="">All</option>
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
                <th>Payment Status</th>
                <th>Ship Status</th>
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
                  <td>
                    <span className={`badge rounded-pill ${order.financial_status === 'paid' ? 'text-bg-primary': 'text-bg-danger'}`}>
                      {capitalizeFirstLetter(order.financial_status)}
                    </span>
                  </td>
                  <td>{capitalizeFirstLetter(order.fulfillment_status)}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between">
            <Button disabled={!pageInfo.prev_link} onClick={() => fetchOrders('previous')}>Previous</Button>
            <Button disabled={!pageInfo.next_link} onClick={() => fetchOrders('next')}>Next</Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default Orders;
