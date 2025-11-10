import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const DeliveryLocations = () => {
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state for creating a new delivery location
  const [newLocation, setNewLocation] = useState({
    id: null,
    zone: '',
    municipality: '',
    district: '',
    delivery_fee: '20',
    free_delivery_order_amount: '200',
    status: true,
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    const lowerSearch = (search || '').toLowerCase();
    const filteredData = locations.filter((loc) =>
      String(loc.zone || '').toLowerCase().includes(lowerSearch) ||
      String(loc.municipality || '').toLowerCase().includes(lowerSearch) ||
      String(loc.district || '').toLowerCase().includes(lowerSearch)
    );
    setFiltered(filteredData);
    setCurrentPage(1); // reset to first page on search
  }, [search, locations]);

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/delivery-settings`);
      setLocations(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const paginatedData = () => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  };

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewLocation((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetMessageAfter = (ms = 2500) => {
    setTimeout(() => setMessage({ type: '', text: '' }), ms);
  };

  const submitNewLocation = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Basic validation
    if (!newLocation.zone || !newLocation.municipality || !newLocation.district) {
      setMessage({ type: 'danger', text: 'Please fill Zone, Municipality and District.' });
      resetMessageAfter();
      return;
    }

    const payload = {
      zone: newLocation.zone,
      municipality: newLocation.municipality,
      district: newLocation.district,
      delivery_fee: Number(newLocation.delivery_fee || 0),
      free_delivery_order_amount: Number(newLocation.free_delivery_order_amount || 200),
      status: Boolean(newLocation.status),
    };

    try {
      setSaving(true);
      // API supports create and update via POST; include id when editing
      const body = isEditing ? { ...payload, id: newLocation.id } : payload;
      await axios.post(`${API_BASE_URL}/api/delivery-settings`, body);
      setMessage({ type: 'success', text: isEditing ? 'Location updated successfully.' : 'Location added successfully.' });
      setNewLocation({ id: null, zone: '', municipality: '', district: '', delivery_fee: '20', free_delivery_order_amount: '200', status: true });
      setIsEditing(false);
      await fetchLocations();
    } catch (error) {
      console.error('Error adding location:', error);
      const text = error?.response?.data?.message || 'Failed to add location.';
      setMessage({ type: 'danger', text });
    } finally {
      setSaving(false);
      resetMessageAfter();
    }
  };

  const deleteLocation = async (id) => {
    if (!id) return;
    const confirmed = window.confirm('Delete this location? This action cannot be undone.');
    if (!confirmed) return;
    try {
      setDeletingId(id);
      await axios.delete(`${API_BASE_URL}/api/delivery-settings/delivery-locations/${id}`);
      setMessage({ type: 'success', text: 'Location deleted.' });
      await fetchLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
      const text = error?.response?.data?.message || 'Failed to delete location.';
      setMessage({ type: 'danger', text });
    } finally {
      setDeletingId(null);
      resetMessageAfter();
    }
  };

  return (
    <div className="container mt-4">
      <h3>Delivery Locations</h3>

      {/* Alerts */}
      {message.text && (
        <div className={`alert alert-${message.type} mt-3`} role="alert">
          {message.text}
        </div>
      )}

      {/* Create new location */}
      <form className="row gy-2 gx-2 align-items-end mt-3" onSubmit={submitNewLocation}>
        <div className="col-md-2">
          <label className="form-label">Zone</label>
          <input
            name="zone"
            value={newLocation.zone}
            onChange={handleFormChange}
            className="form-control"
            placeholder="e.g., 91"
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Municipality</label>
          <input
            name="municipality"
            value={newLocation.municipality}
            onChange={handleFormChange}
            className="form-control"
            placeholder="Municipality"
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">District</label>
          <input
            name="district"
            value={newLocation.district}
            onChange={handleFormChange}
            className="form-control"
            placeholder="District"
            required
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Delivery Fee (QAR)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="delivery_fee"
            value={newLocation.delivery_fee}
            onChange={handleFormChange}
            className="form-control"
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Free Delivery Order Amount</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="free_delivery_order_amount"
            value={newLocation.free_delivery_order_amount}
            onChange={handleFormChange}
            className="form-control"
          />
        </div>
        <div className="col-md-1 form-check mt-4 ms-2">
          <input
            type="checkbox"
            id="status"
            name="status"
            className="form-check-input"
            checked={!!newLocation.status}
            onChange={handleFormChange}
          />
          <label className="form-check-label" htmlFor="status">Enabled</label>
        </div>
        <div className="col-md-12 mt-2 d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Location'}
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setNewLocation({ id: null, zone: '', municipality: '', district: '', delivery_fee: '20', free_delivery_order_amount: '200', status: true });
                setIsEditing(false);
              }}
              disabled={saving}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search zone, municipality, district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Zone</th>
            <th>Municipality</th>
            <th>District</th>
            <th>Delivery Fee (QAR)</th>
            <th>Free Delivery Order Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData().map((loc, index) => (
            <tr key={loc.id}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{loc.zone}</td>
              <td>{loc.municipality}</td>
              <td>{loc.district}</td>
              <td>{parseFloat(loc.delivery_fee).toFixed(2)}</td>
              <td>{loc.free_delivery_order_amount}</td>
              <td>
                <span className={`badge ${loc.status ? 'bg-success' : 'bg-danger'}`}>
                  {loc.status ? 'Enabled' : 'Disabled'}
                </span>
              </td>
              <td style={{ width: 180 }}>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      setNewLocation({
                        id: loc.id,
                        zone: String(loc.zone ?? ''),
                        municipality: String(loc.municipality ?? ''),
                        district: String(loc.district ?? ''),
                        delivery_fee: String(loc.delivery_fee ?? '0'),
                        free_delivery_order_amount: String(loc.free_delivery_order_amount ?? '200'),
                        status: !!loc.status,
                      });
                      setIsEditing(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteLocation(loc.id)}
                    disabled={deletingId === loc.id}
                  >
                    {deletingId === loc.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                No matching delivery locations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
            </li>

            {[...Array(totalPages)].map((_, idx) => (
              <li
                key={idx}
                className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(idx + 1)}>
                  {idx + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default DeliveryLocations;
