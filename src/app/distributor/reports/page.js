'use client';

import React, { useState } from 'react';
import { TrendingUp, Package } from 'lucide-react';

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
      <header className="inventory-header">
        <h2>Reports</h2>
        <p>View sales, inventory, and performance reports</p>
      </header>

      <section className="summary-cards">
        <div className="stat-card">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <TrendingUp size={38} />
            <div>
              <h4>Total Sales</h4>
              <div className="stat-number">${salesData.reduce((sum, data) => sum + data.sales, 0)}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <TrendingUp size={38} />
            <div>
              <h4>Total Profit</h4>
              <div className="stat-number">${salesData.reduce((sum, data) => sum + data.profit, 0)}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Package size={38} />
            <div>
              <h4>Inventory Items</h4>
              <div className="stat-number">175</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Package size={38} />
            <div>
              <h4>Total Orders</h4>
              <div className="stat-number">45</div>
            </div>
          </div>
        </div>
      </section>

      <section className="filters">
        <div className="filter-left">
          <label>From: <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} /></label>
          <label>To: <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} /></label>
        </div>
        <button className="add-product-btn" onClick={handleExport}>
          Export PDF
        </button>
      </section>
      <div className="reports-section">
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
          <div className="chart-container">
            {salesData.map((data, index) => (
              <div key={index} className="bar" data-month={data.month} style={{ height: `${(data.sales / 3000) * 100}%` }}></div>
            ))}
          </div>
        </div>
        <div className="report-card">
          <h4>Inventory Report</h4>
          <div className="report-stats">
            <div className="stat">
              <span className="label">Total Items:</span>
              <span className="value">175</span>
            </div>
            <div className="stat">
              <span className="label">Low Stock Items:</span>
              <span className="value">3</span>
            </div>
            <div className="stat">
              <span className="label">Expired Items:</span>
              <span className="value">0</span>
            </div>
          </div>
          <div className="report-chart">
            <div className="chart-bar total-items" style={{ width: '100%' }}></div>
            <div className="chart-bar low-stock" style={{ width: '1.7%' }}></div>
            <div className="chart-bar expired" style={{ width: '0%' }}></div>
          </div>
          <div className="chart-labels">
            <span>Total Items</span>
            <span>Low Stock</span>
            <span>Expired</span>
          </div>
        </div>
        <div className="report-card">
          <h4>Orders Report</h4>
          <div className="report-stats">
            <div className="stat">
              <span className="label">Total Orders:</span>
              <span className="value">45</span>
            </div>
            <div className="stat">
              <span className="label">Pending:</span>
              <span className="value">5</span>
            </div>
            <div className="stat">
              <span className="label">Delivered:</span>
              <span className="value">40</span>
            </div>
          </div>
          <div className="report-chart">
            <div className="chart-bar total-orders" style={{ width: '100%' }}></div>
            <div className="chart-bar pending" style={{ width: '11.1%' }}></div>
            <div className="chart-bar delivered" style={{ width: '88.9%' }}></div>
          </div>
          <div className="chart-labels">
            <span>Total</span>
            <span>Pending</span>
            <span>Delivered</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
