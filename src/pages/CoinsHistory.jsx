import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container } from 'react-bootstrap';

const BASE_URL = process.env.REACT_APP_API_URL;

export default function CoinsHistory() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/wallet/coins-history`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          console.error('Invalid data:', data);
          setHistory([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching coin history:', err);
        setError('Failed to load history');
      });
  }, []);

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold text-primary">Coins History</h2>

      {error && <p className="text-danger">{error}</p>}

      <Table bordered hover responsive className="shadow-sm">
        <thead className="table-light">
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Order ID</th>
            <th>Type</th>
            <th>Coins</th>
            <th>Available Coins After</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(history) && history.map((entry, idx) => (
            <tr key={idx}>
              <td>{entry.userName}</td>
              <td>{entry.userEmail}</td>
              <td>{entry.userMobile}</td>
              <td>{entry.orderId || '-'}</td>
              <td className={entry.type === 'credit' ? 'text-success' : 'text-danger'}>
                {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
              </td>
              <td>{entry.coins}</td>
              <td>{entry.available_coins}</td>
              <td>{new Date(entry.created_at).toLocaleString()}</td>
            </tr>
          ))}
          {history.length === 0 && !error && (
            <tr>
              <td colSpan="8" className="text-center text-muted py-4">No coin transactions yet.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}
