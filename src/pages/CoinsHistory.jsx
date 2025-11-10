// src/pages/CoinsHistory.jsx
import React, { useEffect, useState } from 'react';
import {
  Table, Modal, Button, Spinner, Alert, Form, InputGroup, Row, Col, Pagination
} from 'react-bootstrap';
import axios from 'axios';
import { API_BASE } from '../utils/helpers';

const BASE = API_BASE;
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
      // Fetch Shopify order details
      const orderRes = await axios.get(`${BASE}/api/shopify/orders/${orderId}`);
      setSelectedOrder(orderRes.data.order);
      // Fetch wallet/coin transaction linked to this order. If 404 treat as no wallet record.
      try {
        const walletRes = await axios.get(`${BASE}/api/wallet/orders/${orderId}`);
        setWallet(walletRes.data.wallet);
      } catch (wErr) {
        if (wErr.response && wErr.response.status === 404) {
          setWallet(null);
        } else {
          console.warn('Wallet fetch error:', wErr.message);
        }
      }
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
            <th>Email</th>
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
              <td>{order.email || ''}</td>
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
              <h6>🛍️ Shopify Order</h6>
              <table className="table table-borderless">
                <tr>
                  <td><strong>Order ID:</strong></td>
                  <td>{selectedOrder.id}</td>
                  <td><strong>Name:</strong></td>
                  <td>{selectedOrder.name}</td>
                </tr>
                <tr>
                  <td><strong>Customer:</strong></td>
                  <td>{selectedOrder.customer?.first_name} {selectedOrder.customer?.last_name}</td>
                  <td><strong>Total:</strong></td>
                  <td className="fw-bold">{selectedOrder.total_price} {selectedOrder.currency}</td>
                </tr>
                <tr>
                  <td><strong>Status:</strong></td>
                  <td><span className='badge rounded-pill text-bg-primary'>{selectedOrder.financial_status.toUpperCase()}</span></td>
                  <td><strong>Created At:</strong></td>
                  <td>{new Date(selectedOrder.created_at).toLocaleString()}</td>
                </tr>
              </table>

              <h6>🧾 Items ({selectedOrder.line_items.length}):</h6>
              <ul>
                {selectedOrder.line_items.map((item, index) => (
                  <li key={index}>
                    {item.quantity}× {item.title} @ {item.price}
                  </li>
                ))}
              </ul>

              <h6>💰 Wallet Transaction</h6>
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
