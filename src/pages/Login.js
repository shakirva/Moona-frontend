import React, { useState } from 'react';
import axios from 'axios';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/api/login', {
        email,
        password,
      });

      // Save token if needed
      localStorage.setItem('adminToken', response.data.token);
      setError('');
      alert('Login success!');
      window.location.href = '/dashboard'; // or redirect properly

    } catch (err) {
      setError('Login failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@moona.com" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
