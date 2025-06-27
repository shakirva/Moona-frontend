import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export default function GeneralSettings() {
  const [formData, setFormData] = useState({
    min_order_value: '',
    support_contact: '',
  });

  // Fetch existing settings
  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/settings/general`);
      if (res.data) {
        setFormData(res.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      alert('Failed to load general settings.');
    }
  };

  // Handle input change
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save settings to server
  const handleSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}/api/settings/general`, formData);
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="container mt-4">
      <h4 className="fw-bold text-primary mb-3">Settings &gt; General</h4>
      <Card className="p-4 shadow-sm">
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="min_order_value">
                <Form.Label>Minimum Order Value (QAR)</Form.Label>
                <Form.Control
                  type="number"
                  name="min_order_value"
                  value={formData.min_order_value}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="support_contact">
                <Form.Label>Support Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  name="support_contact"
                  value={formData.support_contact}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="success" onClick={handleSubmit}>
            Save Settings
          </Button>
        </Form>
      </Card>
    </div>
  );
}
