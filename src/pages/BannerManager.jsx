import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/banners`);
      setBanners(res.data);
    } catch (err) {
      setError('Failed to fetch banners');
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Image is required');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('image', image);
    try {
      await axios.post(`${API_BASE_URL}/api/banners`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Banner created successfully');
      setImage(null);
      fetchBanners();
    } catch (err) {
      setError('Failed to create banner');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${API_BASE_URL}/api/banners/${id}`);
      setSuccess('Banner deleted');
      fetchBanners();
    } catch (err) {
      setError('Failed to delete banner');
    }
    setLoading(false);
  };

  return (
    <div className="container py-4">
      <h2>Banner Images</h2>
      <form onSubmit={handleCreate} className="mb-4">
        <div className="mb-2">
          <input type="file" accept="image/*" onChange={handleImageChange} className="form-control" required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>Create Banner</button>
      </form>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="row">
        {banners.map(banner => (
          <div className="col-md-4 mb-3" key={banner.id}>
            <div className="card">
              <img src={`${API_BASE_URL}${banner.image_url}`} alt="Banner" className="card-img-top" style={{height:200,objectFit:'cover'}} />
              <div className="card-body text-center">
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(banner.id)} disabled={loading}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BannerManager;
