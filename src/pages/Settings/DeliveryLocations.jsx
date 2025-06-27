import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Table } from 'react-bootstrap';

export default function DeliveryLocations() {
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    zone_number: '',
    municipality: '',
    district: '',
    delivery_fee: '',
    free_delivery_order_amount: '200',
    status: '1',
  });

  const fetchLocations = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/delivery-settings');
      setLocations(res.data);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.post('http://localhost:5001/api/delivery-settings', {
        ...formData,
        delivery_fee: parseFloat(formData.delivery_fee),
        free_delivery_order_amount: parseFloat(formData.free_delivery_order_amount),
        status: parseInt(formData.status),
      });
      setShowModal(false);
      setFormData({
        id: null,
        zone_number: '',
        municipality: '',
        district: '',
        delivery_fee: '',
        free_delivery_order_amount: '200',
        status: '1',
      });
      fetchLocations();
    } catch (err) {
      console.error('Save error:', err.response?.data || err.message);
      alert('Error saving location.');
    }
  };

  const openEditModal = (location) => {
    setFormData({
      ...location,
      delivery_fee: String(location.delivery_fee),
      free_delivery_order_amount: String(location.free_delivery_order_amount),
      status: String(location.status),
    });
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Delivery Locations</h4>
        <Button onClick={() => setShowModal(true)}>Add New</Button>
      </div>

      <Table bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Zone</th>
            <th>Municipality</th>
            <th>District</th>
            <th>Fee (QAR)</th>
            <th>Free Delivery Above (QAR)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.length ? (
            locations.map((loc, idx) => (
              <tr key={loc.id}>
                <td>{idx + 1}</td>
                <td>{loc.zone_number}</td>
                <td>{loc.municipality}</td>
                <td>{loc.district}</td>
                <td>{loc.delivery_fee}</td>
                <td>{loc.free_delivery_order_amount}</td>
                <td>
                  <span className={`badge ${loc.status ? 'bg-success' : 'bg-secondary'}`}>
                    {loc.status ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td>
                  <Button size="sm" onClick={() => openEditModal(loc)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">No locations found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? 'Edit' : 'Add'} Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Zone Number</Form.Label>
              <Form.Control
                name="zone_number"
                value={formData.zone_number}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Municipality</Form.Label>
              <Form.Control
                name="municipality"
                value={formData.municipality}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>District</Form.Label>
              <Form.Control
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Delivery Fee (QAR)</Form.Label>
              <Form.Control
                type="number"
                name="delivery_fee"
                value={formData.delivery_fee}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Free Delivery Order Amount (QAR)</Form.Label>
              <Form.Control
                type="number"
                name="free_delivery_order_amount"
                value={formData.free_delivery_order_amount}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange}>
                <option value="1">Enabled</option>
                <option value="0">Disabled</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
