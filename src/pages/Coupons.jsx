import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const baseUrl = 'http://localhost:5001';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialFormState());

  function initialFormState() {
    return {
      name: '',
      description: '',
      code: '',
      min_order_value: '',
      max_order_value: '',
      offer_percentage: '',
      expiry_date: '',
    };
  }

  // Fetch all coupons
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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialFormState());
    setIsEditMode(false);
    setEditId(null);
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await axios.put(`${baseUrl}/api/coupons/${editId}`, form);
      } else {
        await axios.post(`${baseUrl}/api/coupons`, form);
      }
      fetchCoupons();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving coupon:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await axios.delete(`${baseUrl}/api/coupons/${id}`);
      if (res.data.success) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error('Error deleting coupon:', err);
    }
  };

  const handleEdit = (coupon) => {
    setForm({ ...coupon, expiry_date: coupon.expiry_date.split('T')[0] });
    setEditId(coupon.id);
    setIsEditMode(true);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Coupons</h4>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          Add Coupon
        </Button>
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
                  <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(c)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(c.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No coupons found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit Coupon' : 'Add Coupon'}</Modal.Title>
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
              <Form.Group className="mb-3" key={name}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            {isEditMode ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Coupons;
