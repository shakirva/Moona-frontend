// src/pages/CoinsHistory.jsx
import React, { useEffect, useState } from 'react';
import {
  Table, Modal, Button, Spinner, Alert, Form, InputGroup, Row, Col, Pagination
} from 'react-bootstrap';
import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';
const ITEMS_PER_PAGE = 10;

export default function CoinsHistory() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch orders from Shopify
  useEffect(() => {
    fetchOrders();
  }, []);

  // Search & filter logic
  useEffect(() => {
    let data = [...orders];
    if (searchTerm) {
      data = data.filter(order =>
        order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm) ||
        (order.customer?.first_name + ' ' + order.customer?.last_name).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      data = data.filter(order => order.financial_status === statusFilter);
    }
    setFilteredOrders(data);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE}/api/shopify/orders`);
      setOrders(res.data.orders);
    } catch (err) {
      console.error('Failed to load Shopify orders:', err);
      setError('Failed to load orders from Shopify.');
    }
  };

  const handleOrderClick = async (orderId) => {
    setModalVisible(true);
    setSelectedOrder(null);
    setWallet(null);
    setError('');
    setLoading(true);

    try {
      const orderRes = await axios.get(`${BASE}/api/shopify/orders/${orderId}`);
      setSelectedOrder(orderRes.data.order);

      const walletRes = await axios.get(`${BASE}/api/wallet/orders/${orderId}`);
      setWallet(walletRes.data.wallet);
    } catch (err) {
      console.error(err);
      setError('Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  return (
    <div className="container mt-4">
      <h3>🪙 Coin Transactions</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Search and Filter */}
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Search by order ID, customer name, or order name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="partially_paid">Partially Paid</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Orders Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Currency</th>
            <th>Created At</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map(order => (
            <tr
              key={order.id}
              style={{ cursor: 'pointer' }}
              onClick={() => handleOrderClick(order.id)}
            >
              <td>{order.id}</td>
              <td>{order.customer?.first_name || ''} {order.customer?.last_name || ''}</td>
              <td>{order.total_price}</td>
              <td>{order.currency}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
              <td>{order.financial_status}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination>
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Modal with Order & Wallet Info */}
      <Modal show={modalVisible} onHide={() => setModalVisible(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Order & Wallet Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : selectedOrder ? (
            <>
              <h5>🛍️ Shopify Order</h5>
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Name:</strong> {selectedOrder.name}</p>
              <p><strong>Customer:</strong> {selectedOrder.customer?.first_name} {selectedOrder.customer?.last_name}</p>
              <p><strong>Total:</strong> {selectedOrder.total_price} {selectedOrder.currency}</p>
              <p><strong>Status:</strong> {selectedOrder.financial_status}</p>
              <p><strong>Created At:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>

              <h6>🧾 Items:</h6>
              <ul>
                {selectedOrder.line_items.map((item, index) => (
                  <li key={index}>
                    {item.quantity}× {item.title} @ {item.price}
                  </li>
                ))}
              </ul>

              <h5>💰 Wallet Transaction</h5>
              {wallet ? (
                <>
                  <p><strong>Coins:</strong> {wallet.coins}</p>
                  <p><strong>Type:</strong> {wallet.type}</p>
                  <p><strong>Available Coins:</strong> {wallet.available_coins}</p>
                  <p><strong>Created At:</strong> {new Date(wallet.created_at).toLocaleString()}</p>
                </>
              ) : (
                <p>No wallet record found for this order.</p>
              )}
            </>
          ) : (
            <p className="text-danger">No data to show.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalVisible(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
