import { useState } from 'react';
import axios from 'axios';
import { Card, Form, Button, Alert, Spinner, Image } from 'react-bootstrap';

export default function Promotions() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !title || !body) {
      setError('All fields are required');
      return;
    }

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

      setSuccess(data.message || 'Promotion sent successfully!');
      setImage(null);
      setPreview(null);
      setTitle('');
      setBody('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send promotion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <h4 className="text-primary mb-3">📣 Send Promotional Push</h4>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Promotion Image</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} required />
          {preview && <Image src={preview} thumbnail className="mt-2" width={200} />}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter promotion title"
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter notification message"
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Sending...
            </>
          ) : (
            'Send Promotion'
          )}
        </Button>
      </Form>
    </Card>
  );
}
