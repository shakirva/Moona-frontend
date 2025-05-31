// src/pages/CoinsHistory.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CoinsHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/coins-history')
      .then(res => setHistory(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Coins History</h1>
      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, idx) => (
            <tr key={idx}>
              <td>{entry.userName}</td>
              <td>{entry.amount}</td>
              <td>{new Date(entry.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
