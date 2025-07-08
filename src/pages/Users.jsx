import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Spinner, Alert } from 'react-bootstrap';

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user`);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Users</h3>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Shopify ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Coins</th>
                <th>Total Spent</th>
                <th>Orders</th>
                <th>Created At</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.shopify_id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile}</td>
                    <td>{user.coins}</td>
                    <td>QAR {parseFloat(user.shopify_total_spent).toFixed(2)}</td>
                    <td>{user.shopify_orders_count}</td>
                    <td>{user.shopify_created_at ? new Date(user.shopify_created_at).toLocaleDateString() : ''}</td>
                    <td>
                      {[user.address1, user.address2, user.city, user.province, user.zip, user.country]
                        .filter(Boolean)
                        .join(', ')}
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
      )}
    </Container>
  );
};

export default User;
