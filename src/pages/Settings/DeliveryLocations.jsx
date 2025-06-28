import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Table } from 'react-bootstrap';

export default function DeliveryLocations() {
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    full_name: '',
    villa_building_number: '',
    zone: '',
    street: '',
    location_type: 'Apartment',
    phone_number: '',
    preferred_delivery_timing: '',
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
    const payload = {
      zone: formData.zone,
      municipality: formData.municipality || 'Default Municipality',
      district: formData.street || 'Default District',
      delivery_fee: parseFloat(formData.free_delivery_order_amount || '0'),
      status: parseInt(formData.status || '1'),
    };

    console.log("Sending payload:", payload); // Debug line
    await axios.post('http://localhost:5001/api/delivery-settings', payload);
    setShowModal(false);
    setFormData({
      id: null,
      full_name: '',
      villa_building_number: '',
      zone: '',
      street: '',
      location_type: 'Apartment',
      phone_number: '',
      preferred_delivery_timing: '',
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
            <th>Full Name</th>
            <th>Villa/Building No.</th>
            <th>Zone</th>
            <th>Street</th>
            <th>Type</th>
            <th>Phone</th>
            <th>Timing</th>
            <th>Free Delivery ≥</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.length ? (
            locations.map((loc, idx) => (
              <tr key={loc.id}>
                <td>{idx + 1}</td>
                <td>{loc.full_name}</td>
                <td>{loc.villa_building_number}</td>
                <td>{loc.zone}</td>
                <td>{loc.street}</td>
                <td>{loc.location_type}</td>
                <td>{loc.phone_number}</td>
                <td>{loc.preferred_delivery_timing}</td>
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
              <td colSpan="11" className="text-center">No locations found.</td>
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
            <Form.Group className="mb-2">
              <Form.Label>Full Name</Form.Label>
              <Form.Control name="full_name" value={formData.full_name} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Villa/Building Number</Form.Label>
              <Form.Control name="villa_building_number" value={formData.villa_building_number} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Zone</Form.Label>
              <Form.Control name="zone" value={formData.zone} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Street</Form.Label>
              <Form.Control name="street" value={formData.street} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Delivery Location Type</Form.Label>
              <Form.Select name="location_type" value={formData.location_type} onChange={handleChange}>
                <option>Apartment</option>
                <option>House</option>
                <option>Office</option>
                <option>Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control name="phone_number" value={formData.phone_number} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Preferred Delivery Timing</Form.Label>
              <Form.Control name="preferred_delivery_timing" value={formData.preferred_delivery_timing} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Free Delivery Order Amount (QAR)</Form.Label>
              <Form.Control
                type="number"
                name="free_delivery_order_amount"
                value={formData.free_delivery_order_amount}
                onChange={handleChange}
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
