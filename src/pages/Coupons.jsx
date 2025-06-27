import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const baseUrl = 'http://localhost:5001'; // Backend URL

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    code: '',
    min_order_value: '',
    max_order_value: '',
    offer_percentage: '',
    expiry_date: '',
  });

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/coupons`);
      setCoupons(res.data);
    } catch (err) {
      console.error('Error fetching coupons:', err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${baseUrl}/api/coupons`, form);
      fetchCoupons(); // Refresh list
      setShowModal(false);
      setForm({
        name: '',
        description: '',
        code: '',
        min_order_value: '',
        max_order_value: '',
        offer_percentage: '',
        expiry_date: '',
      });
    } catch (err) {
      console.error('Error saving coupon:', err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Coupons</h5>
        <Button onClick={() => setShowModal(true)}>Add Coupon</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Offer %</th>
            <th>Min Order</th>
            <th>Max Order</th>
            <th>Expiry</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.length > 0 ? (
            coupons.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.code}</td>
                <td>{c.offer_percentage}%</td>
                <td>{c.min_order_value}</td>
                <td>{c.max_order_value}</td>
                <td>{new Date(c.expiry_date).toLocaleDateString()}</td>
                <td>
                  <Button size="sm" variant="danger" disabled>Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No coupons found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Coupon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {[
              { label: 'Name', name: 'name' },
              { label: 'Description', name: 'description' },
              { label: 'Code', name: 'code' },
              { label: 'Min Order Value', name: 'min_order_value', type: 'number' },
              { label: 'Max Order Value', name: 'max_order_value', type: 'number' },
              { label: 'Offer %', name: 'offer_percentage', type: 'number' },
              { label: 'Expiry Date', name: 'expiry_date', type: 'date' },
            ].map(({ label, name, type = 'text' }) => (
              <Form.Group className="mb-2" key={name}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Coupons;
