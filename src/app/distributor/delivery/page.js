'use client';

import React, { useState } from 'react';

const Delivery = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const deliveries = [
    { id: '#DEL-001', orderId: '#ORD-001', status: 'In Transit', estimated: '2024-01-20', carrier: 'FedEx', actions: 'Track' },
    { id: '#DEL-002', orderId: '#ORD-002', status: 'Out for Delivery', estimated: '2024-01-18', carrier: 'UPS', actions: 'View' },
    { id: '#DEL-003', orderId: '#ORD-003', status: 'Delivered', estimated: '2024-01-17', carrier: 'DHL', actions: 'Confirm' },
    { id: '#DEL-004', orderId: '#ORD-004', status: 'Pending Pickup', estimated: '2024-01-19', carrier: 'USPS', actions: 'Schedule' },
    { id: '#DEL-005', orderId: '#ORD-005', status: 'In Transit', estimated: '2024-01-21', carrier: 'FedEx', actions: 'Track' },
    { id: '#DEL-006', orderId: '#ORD-006', status: 'Out for Delivery', estimated: '2024-01-19', carrier: 'UPS', actions: 'View' },
    { id: '#DEL-007', orderId: '#ORD-007', status: 'Delivered', estimated: '2024-01-16', carrier: 'DHL', actions: 'Confirm' },
    { id: '#DEL-008', orderId: '#ORD-008', status: 'Pending Pickup', estimated: '2024-01-20', carrier: 'USPS', actions: 'Schedule' },
    { id: '#DEL-009', orderId: '#ORD-009', status: 'In Transit', estimated: '2024-01-22', carrier: 'FedEx', actions: 'Track' },
    { id: '#DEL-010', orderId: '#ORD-010', status: 'Out for Delivery', estimated: '2024-01-20', carrier: 'UPS', actions: 'View' },
  ];

  const filteredDeliveries = deliveries.filter(delivery =>
    delivery.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-content-tile">
      <div className="page-header">
        <h1>Delivery</h1>
        <p>Track and manage your shipments</p>
      </div>
      <div className="actions-bar">
        <input
          type="text"
          placeholder="Search by carrier or order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Delivery ID</th>
              <th>Order ID</th>
              <th>Status</th>
              <th>Estimated Delivery</th>
              <th>Carrier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveries.map((delivery, index) => (
              <tr key={index}>
                <td>{delivery.id}</td>
                <td>{delivery.orderId}</td>
                <td>
                  <span className={`status ${delivery.status.toLowerCase().replace(' ', '-')}`}>
                    {delivery.status}
                  </span>
                </td>
                <td>{delivery.estimated}</td>
                <td>{delivery.carrier}</td>
                <td>
                  <button className="action-btn">{delivery.actions}</button>
                  {delivery.status.includes('Pending') && <button className="action-btn reschedule-btn">Reschedule</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="map-placeholder">
        <h3>Delivery Tracking Map</h3>
        <div style={{ width: '100%', height: '400px', backgroundColor: '#f8fafc', border: '2px dashed #d1d5db', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <p style={{ color: '#9ca3af', fontSize: '1.1rem', fontStyle: 'italic' }}>Interactive Map - Track deliveries and drivers in real-time</p>
          {/* Mock map elements */}
          <div style={{ position: 'absolute', top: '20%', left: '30%', width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 0 2px #10b981' }}></div>
          <div style={{ position: 'absolute', top: '50%', left: '60%', width: '10px', height: '10px', backgroundColor: '#f59e0b', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 0 2px #f59e0b' }}></div>
          <div style={{ position: 'absolute', top: '70%', left: '40%', width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 0 2px #ef4444' }}></div>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>In Transit</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Out for Delivery</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Delivered</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
