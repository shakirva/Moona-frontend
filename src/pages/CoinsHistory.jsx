// src/pages/CoinsHistory.jsx
import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export default function CoinsHistory() {
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  // Load coin history on mount
  useEffect(() => {
    axios.get(`${BASE}/api/wallet/coin-history`)
      .then(res => setHistory(res.data))
      .catch(console.error);
  }, []);

  // Load order + wallet details
  const clickOrder = (id) => {
    setLoading(true);
    setShow(true);
    axios.get(`${BASE}/api/wallet/orders/${id}`)
      .then(res => setSelected(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mt-4">
      <h3>🪙 Coin Transactions</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Coins</th>
            <th>Type</th>
            <th>Available</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {history.map(tx => (
            <tr key={tx.id} onClick={() => clickOrder(tx.order_id)} style={{ cursor: 'pointer' }}>
              <td>{tx.order_id}</td>
              <td>{tx.coins}</td>
              <td>{tx.type}</td>
              <td>{tx.available_coins}</td>
              <td>{new Date(tx.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Order Details */}
      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Order & Wallet Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : selected ? (
            <>
              <h5>🛍️ Shopify Order</h5>
              <p><strong>ID:</strong> {selected.order.id}</p>
              <p><strong>Name:</strong> {selected.order.name}</p>
              <p><strong>Total:</strong> {selected.order.total_price} {selected.order.currency}</p>
              <p><strong>Created:</strong> {new Date(selected.order.created_at).toLocaleString()}</p>

              <h6>🧾 Items:</h6>
              <ul>
                {selected.order.line_items.map((item, index) => (
                  <li key={index}>
                    {item.quantity}× {item.title} (@{item.price})
                  </li>
                ))}
              </ul>

              <h5>💰 Wallet</h5>
              {selected.wallet ? (
                <>
                  <p><strong>Coins:</strong> {selected.wallet.coins}</p>
                  <p><strong>Type:</strong> {selected.wallet.type}</p>
                  <p><strong>Available:</strong> {selected.wallet.available_coins}</p>
                  <p><strong>At:</strong> {new Date(selected.wallet.created_at).toLocaleString()}</p>
                </>
              ) : (
                <p>No wallet transaction found for this order.</p>
              )}
            </>
          ) : (
            <p className="text-danger">Error loading order details.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
