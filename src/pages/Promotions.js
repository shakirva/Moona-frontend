// src/pages/Promotions.js
import { useState } from 'react';
import axios from 'axios';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

export default function Promotions() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('body', body);

    try {
      const { data } = await axios.post('/api/admin/send-promotion', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(data.message);
      setImage(null);
      setTitle('');
      setBody('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error sending promotion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <h3 className="mb-4 text-primary">Send Promotion</h3>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Body</Form.Label>
          <Form.Control as="textarea" rows={3} value={body} onChange={(e) => setBody(e.target.value)} required />
        </Form.Group>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Send Promotion'}
        </Button>
      </Form>
    </Card>
  );
}
