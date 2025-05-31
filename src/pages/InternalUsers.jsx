// src/pages/InternalUsers.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function InternalUsers() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/internal-users')
      .then(res => setAdmins(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Internal Users</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin.id}>
              <td>{admin.username}</td>
              <td>{admin.email}</td>
              <td>{admin.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
