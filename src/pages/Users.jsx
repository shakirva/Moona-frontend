import { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
const ITEMS_PER_PAGE = 10;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/users`);
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, selectedCountry, selectedCity, users]);

  const filterUsers = () => {
    let temp = [...users];

    if (searchTerm) {
      temp = temp.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCountry) {
      temp = temp.filter(user => user.country === selectedCountry);
    }

    if (selectedCity) {
      temp = temp.filter(user => user.city === selectedCity);
    }

    setFilteredUsers(temp);
    setCurrentPage(1);
  };

  const handleView = (user) => {
    alert(`View User:\n\nName: ${user.name}\nEmail: ${user.email}\nMobile: ${user.mobile}\nCoins: ${user.coins}`);
  };

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const uniqueCountries = [...new Set(users.map(u => u.country).filter(Boolean))];
  const uniqueCities = [...new Set(users.map(u => u.city).filter(Boolean))];

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Users</h2>

      {/* Search & Filters */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, or mobile"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-control"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">All Countries</option>
            {uniqueCountries.map((country, i) => (
              <option key={i} value={country}>{country}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-control"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">All Cities</option>
            {uniqueCities.map((city, i) => (
              <option key={i} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Points</th>
                  <th>Shopify ID</th>
                  <th>Orders</th>
                  <th>Total Spent (QR)</th>
                  <th>City</th>
                  <th>Country</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile}</td>
                    <td>{user.coins}</td>
                    <td>{user.shopify_id}</td>
                    <td>{user.shopify_orders_count}</td>
                    <td>QR {parseFloat(user.shopify_total_spent || 0).toFixed(2)}</td>
                    <td>{user.city}</td>
                    <td>{user.country}</td>
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => handleView(user)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => changePage(currentPage - 1)}>Previous</button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => changePage(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => changePage(currentPage + 1)}>Next</button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
