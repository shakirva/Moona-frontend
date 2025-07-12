import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const InternalUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    mobile: '',
    user_type: 'Employee',
  });

  // 🔄 Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/internal-users/all');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch internal users', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 📝 Handle form input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Create or update user
  const handleCreateOrUpdate = async () => {
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5001/api/internal-users/update/${formData.id}`, formData);
      } else {
        await axios.post('http://localhost:5001/api/internal-users/create', formData);
      }
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving user');
      console.error('Error saving user', err);
    }
  };

  // ✏️ Populate form for editing
  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
      mobile: user.mobile,
      user_type: user.user_type,
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  // ❌ Delete user
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/internal-users/delete/${id}`);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
      console.error(err);
    }
  };

  // 🔄 Reset form
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      password: '',
      mobile: '',
      user_type: 'Employee',
    });
    setIsEditMode(false);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Internal Users</h4>
        <Button variant="primary" onClick={() => {
          resetForm();
          setShowModal(true);
        }}>
          + Add User
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>User Type</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={user.id}>
              <td>{i + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>{user.user_type}</td>
              <td>{new Date(user.created_at).toLocaleString()}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(user)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Password {isEditMode ? '(leave blank to keep unchanged)' : ''}</Form.Label>
              <Form.Control
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isEditMode ? 'Optional' : 'Required'}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Mobile number"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>User Type</Form.Label>
              <Form.Select
                name="user_type"
                value={formData.user_type}
                onChange={handleChange}
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleCreateOrUpdate}>
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InternalUsers;
