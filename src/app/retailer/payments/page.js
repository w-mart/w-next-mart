'use client';

import React, { useState } from 'react';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const payments = [
    { id: '#PAY-001', amount: '$1,200.00', date: '2024-01-15', status: 'Completed', method: 'Credit Card', actions: 'View Receipt' },
    { id: '#PAY-002', amount: '$750.00', date: '2024-01-14', status: 'Pending', method: 'Bank Transfer', actions: 'Confirm' },
    { id: '#PAY-003', amount: '$2,500.00', date: '2024-01-13', status: 'Completed', method: 'PayPal', actions: 'View Receipt' },
    { id: '#PAY-004', amount: '$450.00', date: '2024-01-12', status: 'Failed', method: 'Credit Card', actions: 'Retry' },
    { id: '#PAY-005', amount: '$1,800.00', date: '2024-01-11', status: 'Completed', method: 'Credit Card', actions: 'View Receipt' },
    { id: '#PAY-006', amount: '$600.00', date: '2024-01-10', status: 'Pending', method: 'PayPal', actions: 'Confirm' },
    { id: '#PAY-007', amount: '$3,000.00', date: '2024-01-09', status: 'Completed', method: 'Bank Transfer', actions: 'View Receipt' },
    { id: '#PAY-008', amount: '$900.00', date: '2024-01-08', status: 'Failed', method: 'Credit Card', actions: 'Retry' },
    { id: '#PAY-009', amount: '$1,500.00', date: '2024-01-07', status: 'Completed', method: 'PayPal', actions: 'View Receipt' },
    { id: '#PAY-010', amount: '$400.00', date: '2024-01-06', status: 'Pending', method: 'Bank Transfer', actions: 'Confirm' },
  ];

  const filteredPayments = payments.filter(payment =>
    payment.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.date.includes(searchTerm)
  );

  const totalBalance = payments
    .filter(payment => payment.status === 'Completed')
    .reduce((sum, payment) => sum + parseFloat(payment.amount.replace(/[$,]/g, '')), 0);

  const handleAddPayment = () => {
    alert('Add Payment form would open here (Mock functionality)');
  };

  return (
    <div className="page-content-tile">
      <div className="page-header">
        <h1>Payments</h1>
        <p>View and manage your payment history</p>
      </div>
      <div className="balance-summary">
        <h3>Total Balance: ${totalBalance.toFixed(2)}</h3>
      </div>
      <div className="actions-bar">
        <input
          type="text"
          placeholder="Search by method or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <button className="action-btn add-payment-btn" onClick={handleAddPayment}>Add Payment</button>
      </div>
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Method</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment, index) => (
              <tr key={index}>
                <td>{payment.id}</td>
                <td>{payment.amount}</td>
                <td>{payment.date}</td>
                <td>
                  <span className={`status ${payment.status.toLowerCase()}`}>
                    {payment.status}
                  </span>
                </td>
                <td>{payment.method}</td>
                <td>
                  <button className="action-btn">{payment.actions}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
