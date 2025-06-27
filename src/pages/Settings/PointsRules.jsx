import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Row, Col, Card } from 'react-bootstrap';
import moment from 'moment';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export default function PointsRules() {
  const [rules, setRules] = useState([]);
  const [formData, setFormData] = useState({
    min_amount: '',
    max_amount: '',
    percentage: '',
    points_valid_days: '',
    expiry_date: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchRules = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/points-rules`);
      setRules(res.data);
    } catch (err) {
      console.error('Failed to fetch rules', err);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { min_amount, max_amount, percentage, points_valid_days, expiry_date } = formData;

    if (!min_amount || !max_amount || !percentage || !points_valid_days || !expiry_date) {
      alert('Please fill all fields.');
      return;
    }

    if (Number(min_amount) >= Number(max_amount)) {
      alert('Min amount must be less than Max amount.');
      return;
    }

    const isDuplicate = rules.some(rule =>
      Number(rule.min_amount) === Number(min_amount) &&
      Number(rule.max_amount) === Number(max_amount) &&
      rule.id !== editingId
    );

    if (isDuplicate) {
      alert('A rule with this Min/Max range already exists.');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/api/points-rules/${editingId}`, formData);
      } else {
        await axios.post(`${BASE_URL}/api/points-rules`, formData);
      }

      setFormData({
        min_amount: '',
        max_amount: '',
        percentage: '',
        points_valid_days: '',
        expiry_date: ''
      });
      setEditingId(null);
      fetchRules();
    } catch (err) {
      console.error('Submit failed:', err);
    }
  };

  const handleEdit = rule => {
    setFormData({
      min_amount: rule.min_amount,
      max_amount: rule.max_amount,
      percentage: rule.percentage,
      points_valid_days: rule.points_valid_days,
      expiry_date: moment(rule.expiry_date).format('YYYY-MM-DD')
    });
    setEditingId(rule.id);
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this rule?')) {
      try {
        await axios.delete(`${BASE_URL}/api/points-rules/${id}`);
        fetchRules();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="fw-bold text-primary mb-3">Settings &gt; Points Rules</h4>

      <Card className="mb-4 p-3 shadow-sm">
        <h5>{editingId ? 'Edit Rule' : 'Create Rule'}</h5>
        <Form>
          <Row className="g-3 mt-2">
            <Col md={2}>
              <Form.Label>Min Amount</Form.Label>
              <Form.Control
                type="number"
                name="min_amount"
                value={formData.min_amount}
                onChange={handleChange}
              />
            </Col>
            <Col md={2}>
              <Form.Label>Max Amount</Form.Label>
              <Form.Control
                type="number"
                name="max_amount"
                value={formData.max_amount}
                onChange={handleChange}
              />
            </Col>
            <Col md={2}>
              <Form.Label>Offer %</Form.Label>
              <Form.Control
                type="number"
                name="percentage"
                value={formData.percentage}
                onChange={handleChange}
              />
            </Col>
            <Col md={2}>
              <Form.Label>Valid Days</Form.Label>
              <Form.Control
                type="number"
                name="points_valid_days"
                value={formData.points_valid_days}
                onChange={handleChange}
              />
            </Col>
            <Col md={2}>
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
              />
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button variant="success" onClick={handleSubmit}>
                {editingId ? 'Update' : 'Save'}
              </Button>
            </Col>
            <Col md={1} className="d-flex align-items-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setFormData({
                    min_amount: '',
                    max_amount: '',
                    percentage: '',
                    points_valid_days: '',
                    expiry_date: ''
                  });
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Table bordered hover>
        <thead className="table-light">
          <tr>
            <th>Min</th>
            <th>Max</th>
            <th>Offer %</th>
            <th>Expiry Date</th>
            <th>Valid Days</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rules.map(rule => (
            <tr key={rule.id}>
              <td>{rule.min_amount}</td>
              <td>{rule.max_amount}</td>
              <td>{rule.percentage}%</td>
              <td>{moment(rule.expiry_date).format('YYYY-MM-DD')}</td>
              <td>{rule.points_valid_days}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleEdit(rule)}>
                  Edit
                </Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(rule.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
