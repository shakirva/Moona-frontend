import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await login(form.email, form.password);
      localStorage.setItem('adminToken', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Form onSubmit={handleSubmit} className="p-4 border rounded" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="mb-3 text-center">Admin Login</h4>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control name="email" type="email" value={form.email} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control name="password" type="password" value={form.password} onChange={handleChange} required />
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100">Login</Button>
      </Form>
    </Container>
  );
};

export default Login;
