// src/pages/Notifications.jsx
import { useState } from 'react';
import axios from 'axios';
import { Card, Button, Form, Alert, Spinner } from 'react-bootstrap';

export default function Notifications() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const sendNotification = async (e) => {
  e.preventDefault();
  setLoading(true);
  setSuccess('');
  setError('');

  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/admin/send-notification`,
      { title, message }
    );
    setSuccess(`Sent to ${data.sent} users, ${data.failed} failed.`);
  } catch (err) {
    setError(err.response?.data?.error || 'Error sending notification');
  } finally {
    setLoading(false);
  }
};


  return (
    <Card className="p-4 shadow-sm">
      <h3 className="mb-4 text-primary">Send Notification</h3>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={sendNotification}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter notification title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Send Notification'}
        </Button>
      </Form>
    </Card>
  );
}
