// src/pages/UserDetails.js
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`/api/admin/users/${id}`)
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>{user.name}'s Details</h1>
      <p>Email: {user.email}</p>
      <p>Coins: {user.coins}</p>
      <h3>History</h3>
      <ul>
        {user.history.map((entry, index) => (
          <li key={index}>{entry.date}: {entry.amount} coins</li>
        ))}
      </ul>
    </div>
  );
}