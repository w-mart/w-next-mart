'use client';

import React, { useState } from 'react';

const Reports = () => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const salesData = [
    { month: 'Jan', sales: 1200, profit: 300 },
    { month: 'Feb', sales: 1500, profit: 450 },
    { month: 'Mar', sales: 1800, profit: 540 },
    { month: 'Apr', sales: 2000, profit: 600 },
    { month: 'May', sales: 2200, profit: 660 },
    { month: 'Jun', sales: 2500, profit: 750 },
    { month: 'Jul', sales: 2800, profit: 840 },
    { month: 'Aug', sales: 3000, profit: 900 },
  ];

  const handleExport = () => {
    alert('Exporting report... (Mock functionality)');
  };

  return (
    <div className="page-content-tile">
      <div className="page-header">
        <h1>Reports</h1>
        <p>View sales, inventory, and performance reports</p>
      </div>
      <div className="actions-bar">
        <div className="date-filter">
          <label>From: <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} /></label>
          <label>To: <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} /></label>
        </div>
        <button className="action-btn export-btn" onClick={handleExport}>Export PDF</button>
      </div>
      <div className="reports-grid">
        <div className="report-card">
          <h3>Sales Summary</h3>
          <table className="reports-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Sales ($)</th>
                <th>Profit ($)</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((data, index) => (
                <tr key={index}>
                  <td>{data.month}</td>
                  <td>{data.sales}</td>
                  <td>{data.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="report-card">
          <h3>Sales Bar Chart</h3>
          <div className="bar-chart">
            {salesData.map((data, index) => (
              <div key={index} className="bar-container">
                <div className="bar" style={{ height: `${(data.sales / 3000) * 100}%` }}></div>
                <span className="bar-label">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="report-card">
          <h3>Inventory Report</h3>
          <p>Total Items: 175</p>
          <p>Low Stock Items: 3</p>
          <p>Expired Items: 0</p>
          <div className="chart-placeholder">
            <p>[Placeholder for Inventory Chart]</p>
          </div>
        </div>
        <div className="report-card">
          <h3>Orders Report</h3>
          <p>Total Orders: 45</p>
          <p>Pending: 5</p>
          <p>Delivered: 40</p>
          <div className="chart-placeholder">
            <p>[Placeholder for Orders Chart]</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
