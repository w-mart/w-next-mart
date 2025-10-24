'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Drivers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        // Mock data for drivers
        const mockDrivers = [
          { id: 1, name: 'John Doe', vehicle: 'Truck-001', status: 'Active', location: 'New York, NY', currentOrder: '#ORD-001' },
          { id: 2, name: 'Jane Smith', vehicle: 'Van-002', status: 'Inactive', location: 'Los Angeles, CA', currentOrder: null },
          { id: 3, name: 'Mike Johnson', vehicle: 'Truck-003', status: 'Active', location: 'Chicago, IL', currentOrder: '#ORD-002' },
          { id: 4, name: 'Sarah Wilson', vehicle: 'Van-004', status: 'Active', location: 'Houston, TX', currentOrder: '#ORD-003' },
          { id: 5, name: 'Tom Brown', vehicle: 'Truck-005', status: 'Inactive', location: 'Phoenix, AZ', currentOrder: null },
        ];
        setDrivers(mockDrivers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  if (loading) {
    return (
      <div className="page-content-tile">
        <p>Loading drivers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content-tile">
        <div className="error-message">Error: {error}</div>
        <button onClick={() => window.location.reload()} className="action-btn">Retry</button>
      </div>
    );
  }

  const stats = [
    { label: 'Total Drivers', value: drivers.length },
    { label: 'Active Drivers', value: drivers.filter(d => d.status === 'Active').length },
    { label: 'Inactive Drivers', value: drivers.filter(d => d.status === 'Inactive').length },
    { label: 'On Delivery', value: drivers.filter(d => d.currentOrder).length }
  ];

  return (
    <div className="page-content-tile">
      <div className="page-header">
        <h1>Driver Dashboard</h1>
        <p>Monitor and manage your delivery drivers</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3>{stat.label}</h3>
            <div className="stat-number">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="actions-bar" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1, minWidth: '250px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="Search by name, vehicle, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
              style={{ width: '100%', padding: '12px 45px 12px 15px', border: '2px solid #dee2e6', borderRadius: '25px', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s ease' }}
            />
            <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d', fontSize: '1.1rem' }}>🔍</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="action-btn" style={{ padding: '12px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s ease', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>➕</span> Add Driver
          </button>
        </div>
      </div>

      <div className="table-container" style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid #e9ecef' }}>
        <table className="orders-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <tr>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Driver Name</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Vehicle</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Current Location</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Current Order</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((driver, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #f1f3f4', transition: 'background-color 0.2s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#f8f9fa'} onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = 'transparent'}>
                <td style={{ padding: '14px 12px', fontWeight: '600', borderRight: '1px solid #f1f3f4' }}>{driver.name}</td>
                <td style={{ padding: '14px 12px', borderRight: '1px solid #f1f3f4' }}>{driver.vehicle}</td>
                <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>
                  <span className={`status ${driver.status.toLowerCase()}`} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {driver.status}
                  </span>
                </td>
                <td style={{ padding: '14px 12px', borderRight: '1px solid #f1f3f4' }}>{driver.location}</td>
                <td style={{ padding: '14px 12px', borderRight: '1px solid #f1f3f4' }}>{driver.currentOrder || 'None'}</td>
                <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button className="action-btn" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', transition: 'background-color 0.3s ease' }}>View</button>
                    <button className="action-btn" style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', transition: 'background-color 0.3s ease' }}>Track</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="map-placeholder" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', marginTop: '24px' }}>
        <h3>Driver Tracking Map</h3>
        <div style={{ width: '100%', height: '400px', backgroundColor: '#f8fafc', border: '2px dashed #d1d5db', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <p style={{ color: '#9ca3af', fontSize: '1.1rem', fontStyle: 'italic' }}>Interactive Map - Track drivers and orders in real-time</p>
          {/* Mock map elements */}
          <div style={{ position: 'absolute', top: '20%', left: '30%', width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 0 2px #10b981' }}></div>
          <div style={{ position: 'absolute', top: '50%', left: '60%', width: '10px', height: '10px', backgroundColor: '#f59e0b', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 0 2px #f59e0b' }}></div>
          <div style={{ position: 'absolute', top: '70%', left: '40%', width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 0 2px #ef4444' }}></div>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Active Drivers</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>On Delivery</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Inactive</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drivers;
