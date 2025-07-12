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
        setPageInfo(prev => ({ ...prev, current_type: direction }));
      }

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, {
        params: { limit: 10, pageInfo, searchParams }
      });

      setOrders(res.data.orders || []);
      setPageInfo(prev => ({
        ...prev,
        prev_link: res.data.prev_link || '',
        next_link: res.data.next_link || ''
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

  const getShipmentBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'in_transit':
      case 'in progress':
        return 'text-bg-warning';
      case 'delivered':
        return 'text-bg-success';
      case 'failure':
      case 'cancelled':
        return 'text-bg-danger';
      case 'out_for_delivery':
        return 'text-bg-info';
      default:
        return 'text-bg-secondary';
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Shopify Orders</h3>

      <Form onSubmit={handleSearchSubmit} className="mb-3">
        <Row>
          <Col><Form.Control type="text" placeholder="Search by Order ID" name="order_id" onChange={handleSearchChange} /></Col>
          <Col><Form.Control type="text" placeholder="Search by Name" name="name" onChange={handleSearchChange} /></Col>
          <Col><Form.Control type="text" placeholder="Search by Email" name="email" onChange={handleSearchChange} /></Col>
          <Col>
            <Form.Select name="financial_status" onChange={handleSearchChange}>
              <option value="">Payment Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Select name="fulfillment_status" onChange={handleSearchChange}>
              <option value="">Fulfillment Status</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="unfulfilled">Unfulfilled</option>
              <option value="partial">Partial</option>
            </Form.Select>
          </Col>
        </Row>
        <Button className="mt-3" type="submit">Apply Filters</Button>
      </Form>

      {loading && <Spinner animation="border" variant="primary" />}

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
                <th>Track</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const fulfillment = order.fulfillments?.[0];
                const trackingUrl = fulfillment?.tracking_url || fulfillment?.tracking_urls?.[0];
                const shipmentStatusRaw = order.fulfillments?.length > 0
                  ? fulfillment?.shipment_status
                  : 'Not Shipped';

                const shipmentStatus = capitalizeFirstLetter(shipmentStatusRaw || 'Not Shipped');
                const shipmentClass = getShipmentBadgeClass(shipmentStatusRaw);

                return (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{order.id}</td>
                    <td>{order.customer?.first_name} {order.customer?.last_name}</td>
                    <td>{order.email}</td>
                    <td>{order.total_price} {order.currency}</td>
                    <td>
                      <span className={`badge rounded-pill ${order.financial_status === 'paid' ? 'text-bg-primary' : 'text-bg-danger'}`}>
                        {capitalizeFirstLetter(order.financial_status)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${shipmentClass}`}>
                        {shipmentStatus}
                      </span>
                    </td>
                    <td>
                      {trackingUrl ? (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => window.open(trackingUrl, '_blank')}
                        >
                          Track
                        </Button>
                      ) : '—'}
                    </td>
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                  </tr>
                );
              })}
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
