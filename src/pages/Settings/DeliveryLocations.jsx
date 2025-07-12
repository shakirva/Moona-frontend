import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const DeliveryLocations = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/delivery-settings`);
      setLocations(res.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Delivery Locations</h3>
      <table className="table table-bordered table-hover mt-3">
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
          {locations.map((loc, index) => (
            <tr key={loc.id}>
              <td>{index + 1}</td>
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
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryLocations;
