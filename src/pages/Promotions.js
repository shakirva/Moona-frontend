import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Form, Button, Alert, Spinner, Image, Table, Modal } from 'react-bootstrap';

export default function Promotions() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [promotions, setPromotions] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [editData, setEditData] = useState({ id: null, title: '', body: '', image_url: '' });
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const fetchPromotions = async () => {
    try {
      setListLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/promotion/all?perPage=100`);
      setPromotions(data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to load promotions');
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ( !title || !body) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setSuccess('');
    setError('');

    const formData = new FormData();
    formData.append('file', image);
    formData.append('title', title);
    formData.append('body', body);

    try {
     const { data } = await axios.post(
  `${process.env.REACT_APP_API_URL}/api/promotion/send-promotion`,
  formData,
  {
    headers: { 'Content-Type': 'multipart/form-data' },
  }
);

      setSuccess(data.message || 'Promotion sent successfully!');
      setImage(null);
      setPreview(null);
      setTitle('');
      setBody('');
      fetchPromotions();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send promotion');
    } finally {
      setLoading(false);
    }
  };

  const confirmAndDelete = async (id) => {
    const yes = window.confirm('Delete this promotion?');
    if (!yes) return;
    try {
      const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/api/promotion/${id}`);
      setSuccess(data.message || 'Promotion deleted');
      await fetchPromotions();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete');
    }
  };

  const openEdit = (p) => {
    setEditData({ id: p.id, title: p.title || '', body: p.body || '', image_url: p.image_url || '' });
    setEditImage(null);
    setEditPreview(null);
    setEditShow(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditImage(file || null);
    setEditPreview(file ? URL.createObjectURL(file) : null);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editData.id) return;
    try {
      const fd = new FormData();
      if (editImage) fd.append('file', editImage);
      fd.append('title', editData.title);
      fd.append('body', editData.body);
      const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/promotion/${editData.id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(data.message || 'Promotion updated');
      setEditShow(false);
      await fetchPromotions();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update');
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
          <Form.Control type="file" accept="image/*" onChange={handleImageChange}  />
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

      <hr className="my-4" />
      <h5 className="mb-3">Existing Promotions</h5>
      {listLoading ? (
        <div className="d-flex align-items-center">
          <Spinner animation="border" size="sm" className="me-2" /> Loading...
        </div>
      ) : (
        <Table striped bordered hover responsive size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">No promotions yet</td>
              </tr>
            ) : (
              promotions.map((p, idx) => (
                <tr key={p.id}>
                  <td>{idx + 1}</td>
                  <td>
                    {p.image_url ? (
                      <img src={p.image_url} alt="promo" style={{ width: 50, height: 50, objectFit: 'cover' }} />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{p.title}</td>
                  <td>{p.body}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openEdit(p)}>
                      Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => confirmAndDelete(p.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {/* Edit Modal */}
      <Modal show={editShow} onHide={() => setEditShow(false)} centered>
        <Form onSubmit={saveEdit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Promotion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <div className="d-flex align-items-center gap-3">
                {(editPreview || editData.image_url) && (
                  <Image src={editPreview || editData.image_url} thumbnail width={120} />
                )}
              </div>
              <Form.Control type="file" accept="image/*" onChange={handleEditImageChange} className="mt-2" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editData.body}
                onChange={(e) => setEditData({ ...editData, body: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditShow(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Card>
  );
}
