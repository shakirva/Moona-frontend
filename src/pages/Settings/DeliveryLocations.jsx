import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const DeliveryLocations = () => {
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filteredData = locations.filter((loc) =>
      loc.zone.toLowerCase().includes(lowerSearch) ||
      loc.municipality.toLowerCase().includes(lowerSearch) ||
      loc.district.toLowerCase().includes(lowerSearch)
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

  return (
    <div className="container mt-4">
      <h3>Delivery Locations</h3>

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
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center text-muted">
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
