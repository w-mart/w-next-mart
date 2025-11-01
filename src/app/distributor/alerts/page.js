'use client';

import React, { useState, useEffect } from 'react';
/* enhanced-table-styles.css consolidated into globals.css */
import { AlertTriangle, Info, Zap, Package, Clock, CreditCard, Wrench, TrendingUp, Eye, Calendar } from 'lucide-react';

const Alerts = () => {
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const alerts = [
    { id: '#ALT-010', type: 'New Order', message: 'Order #ORD-010 received', date: '2024-01-08', actions: 'View Order' },
    { id: '#ALT-004', type: 'Payment Due', message: 'Invoice #INV-001 due in 3 days', date: '2024-01-14', actions: 'Pay Now' },
    { id: '#ALT-007', type: 'Warning', message: 'High traffic detected', date: '2024-01-11', actions: 'Monitor' },
    { id: '#ALT-008', type: 'Low Stock', message: 'Product B stock is below 5 units', date: '2024-01-10', actions: 'View Inventory' },
    { id: '#ALT-009', type: 'Expiry Alert', message: 'Product D expires in 7 days', date: '2024-01-09', actions: 'Manage' },
     ];

  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const activeAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));

  // Filtering
  useEffect(() => {
    const filtered = activeAlerts.filter(a =>
      (a.id?.toLowerCase().includes(search.toLowerCase()) ?? true) ||
      (a.type?.toLowerCase().includes(search.toLowerCase()) ?? true) ||
      (a.message?.toLowerCase().includes(search.toLowerCase()) ?? true)
    ).filter(a => (typeFilter ? a.type.toLowerCase() === typeFilter : true));

    setFilteredAlerts(filtered);
    setCurrentPage(1);
  }, [search, typeFilter, dismissedAlerts]);

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlerts = filteredAlerts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / itemsPerPage));

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

  const getIcon = (type) => {
    switch (type) {
      case 'Low Stock': return <Package size={24} />;
      case 'Expiry Alert': return <Clock size={24} />;
      case 'New Order': return <Eye size={24} />;
      case 'Payment Due': return <CreditCard size={24} />;
      case 'Urgent': return <Zap size={24} />;
      case 'Info': return <Info size={24} />;
      case 'Warning': return <AlertTriangle size={24} />;
      default: return <AlertTriangle size={24} />;
    }
  };

  const getCardClass = (type) => {
    switch (type) {
      case 'Urgent': return 'red';
      case 'Warning': return 'orange';
      case 'Info': return 'blue';
      case 'Low Stock': return 'yellow';
      case 'Expiry Alert': return 'purple';
      case 'New Order': return 'green';
      case 'Payment Due': return 'teal';
      default: return 'gray';
    }
  };

  return (
    <div className="page-content-tile">
      <header className="inventory-header">
        <h1>Alerts</h1>
        <p>Monitor important notifications and alerts</p>
      </header>

      <section className="summary-cards">
        <div className="stat-card">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <AlertTriangle size={38} />
            <div>
              <h3>Total Alerts</h3>
              <div className="stat-number">{activeAlerts.length}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Zap size={38} />
            <div>
              <h3>Urgent Alerts</h3>
              <div className="stat-number">{activeAlerts.filter(a => a.type === 'Urgent').length}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <AlertTriangle size={38} />
            <div>
              <h3>Warnings</h3>
              <div className="stat-number">{activeAlerts.filter(a => a.type === 'Warning').length}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Info size={38} />
            <div>
              <h3>Info Alerts</h3>
              <div className="stat-number">{activeAlerts.filter(a => a.type === 'Info').length}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="filters">
        <div className="filter-left">
          <input type="text" placeholder="Search by alert ID, type or message..." value={search} onChange={(e) => setSearch(e.target.value)} />

          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            {Object.keys(typeCounts).map(type => (
              <option key={type} value={type.toLowerCase()}>{type}</option>
            ))}
          </select>
        </div>
      </section>

      <div className="table-container" style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid #e9ecef', marginTop: '20px' }}>
        <table className="orders-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <tr>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>S.No</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Alert ID</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Type</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Message</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Date</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAlerts.length > 0 ? (
              paginatedAlerts.map((alert, index) => {
                const serialNumber = startIndex + index + 1;
                return (
                  <tr key={`${alert.id}-${index}`} style={{ borderBottom: '1px solid #f1f3f4', transition: 'background-color 0.2s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#f8f9fa'} onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>{serialNumber}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'left', borderRight: '1px solid #f1f3f4' }}>{alert.id}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>
                      <span className={`status ${getAlertClass(alert.type)}`}>{alert.type}</span>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'left', borderRight: '1px solid #f1f3f4' }}>{alert.message}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>{alert.date}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button className="action-btn">{alert.actions}</button>
                        <button className="action-btn dismiss-btn" onClick={() => handleDismiss(alert.id)}>Dismiss</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '14px 12px' }}>No alerts found.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', transition: 'background-color 0.3s ease' }}>Previous</button>
          <span>Page {currentPage} of {totalPages || 1}</span>
          <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(currentPage + 1)} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', transition: 'background-color 0.3s ease' }}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
