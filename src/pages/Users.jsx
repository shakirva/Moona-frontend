import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../utils/helpers';
import {
  Table, Container, Spinner, Alert, Button,
  Form, Row, Col, Pagination, Modal
} from 'react-bootstrap';




const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [coinFilter, setCoinFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, coinFilter, currentPage]);

  const fetchUsers = async () => {
   try {
  setLoading(true);
  const res = await axios.get(`${API_BASE}/api/user`, {
    params: {
      search: searchTerm,
      filter: coinFilter,
      page: currentPage,
      limit: usersPerPage,
    },
  });

      setUsers(res.data.users);
      setTotalPages(res.data.pagination.totalPages || 1);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber !== currentPage) setCurrentPage(pageNumber);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Users</h3>

      {/* Search and Filter */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by name, email or Shopify ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={coinFilter}
            onChange={(e) => {
              setCoinFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Coins</option>
            <option value="zero">0 Coins</option>
            <option value="positive">&gt; 0 Coins</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Shopify ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Coins</th>
                  <th>Total Spent</th>
                  <th>Orders</th>
                  <th>Created At</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{(currentPage - 1) * usersPerPage + index + 1}</td>
                      <td>{user.shopify_id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.coins}</td>
                      <td>QAR {parseFloat(user.shopify_total_spent).toFixed(2)}</td>
                      <td>{user.shopify_orders_count}</td>
                      <td>
                        {user.shopify_created_at
                          ? new Date(user.shopify_created_at).toLocaleDateString()
                          : ''}
                      </td>
                      <td>
                        {[user.address1, user.address2, user.city, user.province, user.zip, user.country]
                          .filter(Boolean)
                          .join(', ')}
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          href={`/admin/users/${user.shopify_id}`}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="justify-content-center">
              {[...Array(totalPages).keys()].map((num) => (
                <Pagination.Item
                  key={num + 1}
                  active={num + 1 === currentPage}
                  onClick={() => handlePageChange(num + 1)}
                >
                  {num + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
      )}

      {/* View User Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p><strong>Shopify ID:</strong> {selectedUser.shopify_id}</p>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Coins:</strong> {selectedUser.coins}</p>
              <p><strong>Total Spent:</strong> QAR {parseFloat(selectedUser.shopify_total_spent).toFixed(2)}</p>
              <p><strong>Orders:</strong> {selectedUser.shopify_orders_count}</p>
              <p><strong>Created At:</strong> {selectedUser.shopify_created_at ? new Date(selectedUser.shopify_created_at).toLocaleDateString() : ''}</p>
              <p><strong>Address:</strong><br />
                {[selectedUser.address1, selectedUser.address2, selectedUser.city, selectedUser.province, selectedUser.zip, selectedUser.country]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default User;
