'use client';

import React, { useState } from 'react';

const Alerts = () => {
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const alerts = [
    { id: '#ALT-001', type: 'Low Stock', message: 'Product A stock is below 10 units', date: '2024-01-17', actions: 'View Inventory' },
    { id: '#ALT-002', type: 'Expiry Alert', message: 'Product C expires in 30 days', date: '2024-01-16', actions: 'Manage' },
    { id: '#ALT-003', type: 'New Order', message: 'Order #ORD-005 received', date: '2024-01-15', actions: 'View Order' },
    { id: '#ALT-004', type: 'Payment Due', message: 'Invoice #INV-001 due in 3 days', date: '2024-01-14', actions: 'Pay Now' },
    { id: '#ALT-005', type: 'Urgent', message: 'System maintenance scheduled for tonight', date: '2024-01-13', actions: 'Acknowledge' },
    { id: '#ALT-006', type: 'Info', message: 'New feature added to dashboard', date: '2024-01-12', actions: 'Learn More' },
    { id: '#ALT-007', type: 'Warning', message: 'High traffic detected', date: '2024-01-11', actions: 'Monitor' },
    { id: '#ALT-008', type: 'Low Stock', message: 'Product B stock is below 5 units', date: '2024-01-10', actions: 'View Inventory' },
    { id: '#ALT-009', type: 'Expiry Alert', message: 'Product D expires in 7 days', date: '2024-01-09', actions: 'Manage' },
    { id: '#ALT-010', type: 'New Order', message: 'Order #ORD-010 received', date: '2024-01-08', actions: 'View Order' },
  ];

  const activeAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));

  const typeCounts = activeAlerts.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1;
    return acc;
  }, {});

  const handleDismiss = (id) => {
    setDismissedAlerts([...dismissedAlerts, id]);
  };

  const getAlertClass = (type) => {
    if (type === 'Urgent') return 'alert-urgent';
    if (type === 'Warning') return 'alert-warning';
    if (type === 'Info') return 'alert-info';
    return 'alert-default';
  };

  return (
    <div className="page-content-tile">
      <div className="page-header">
        <h1>Alerts</h1>
        <p>Monitor important notifications and alerts</p>
      </div>
      <div className="alert-summary">
        {Object.entries(typeCounts).map(([type, count]) => (
          <span key={type} className={`alert-count ${getAlertClass(type)}`}>
            {type}: {count}
          </span>
        ))}
      </div>
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Alert ID</th>
              <th>Type</th>
              <th>Message</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeAlerts.map((alert, index) => (
              <tr key={index}>
                <td>{alert.id}</td>
                <td>
                  <span className={`status ${getAlertClass(alert.type)}`}>
                    {alert.type}
                  </span>
                </td>
                <td>{alert.message}</td>
                <td>{alert.date}</td>
                <td>
                  <button className="action-btn">{alert.actions}</button>
                  <button className="action-btn dismiss-btn" onClick={() => handleDismiss(alert.id)}>Dismiss</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Alerts;
