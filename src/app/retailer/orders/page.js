'use client';

import React, { useState, useEffect } from 'react';
import OrderHeader from '../../components/OrderHeader';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filteredOrders = orders.filter(order =>
    order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOrder = (id) => {
    setSelectedOrders(prev =>
      prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]
    );
  };

  const handleExportCSV = () => {
    alert('Exporting CSV... (Mock functionality)');
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const apiUrl = process.env.NEXT_PUBLIC_RETAILER_API_URL;
        const response = await fetch(`${apiUrl}/api/orders`, {
          method: 'GET',
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Flatten the order data to avoid infinite nesting
        const flattenedOrders = data.map(order => ({
          id: `#ORD-${order.orderId}`,
          product: order.items.map(item => item.productName || 'Unknown Product').join(', '), // Combine product names if multiple
          quantity: order.items.reduce((total, item) => total + item.productQuantity, 0), // Sum quantities
          status: order.orderStatus,
          date: new Date(order.orderDate).toLocaleDateString(),
          actions: 'View'
        }));

        setOrders(flattenedOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="page-content-tile">
        <p>Loading orders...</p>
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
    { label: 'Total Orders', value: orders.length },
    { label: 'Pending', value: orders.filter(o => o.status.toLowerCase() === 'placed').length },
    { label: 'This Month', value: orders.filter(o => new Date(o.date) > new Date(new Date().getFullYear(), new Date().getMonth(), 1)).length }
  ];

  return (
    <div className="page-content-tile">
      <OrderHeader
        title="Orders Management"
        subtitle="Track, manage, and monitor all your orders in one place"
        stats={stats}
      />

      <div className="actions-bar" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1, minWidth: '250px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="Search by product or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
              style={{ width: '100%', padding: '12px 45px 12px 15px', border: '2px solid #dee2e6', borderRadius: '25px', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s ease' }}
            />
            <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d', fontSize: '1.1rem' }}>🔍</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="action-btn" onClick={handleExportCSV} style={{ padding: '12px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s ease', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📊</span> Export CSV
          </button>
          <button className="action-btn" style={{ padding: '12px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s ease', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>➕</span> New Order
          </button>
        </div>
      </div>

      <div className="table-container" style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid #e9ecef' }}>
        <table className="orders-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <tr>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>
                <input type="checkbox" style={{ transform: 'scale(1.2)', cursor: 'pointer' }} />
              </th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Order ID</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Product</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Quantity</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Date</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #f1f3f4', transition: 'background-color 0.2s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#f8f9fa'} onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = 'transparent'}>
                <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>
                  <input type="checkbox" checked={selectedOrders.includes(order.id)} onChange={() => handleSelectOrder(order.id)} style={{ cursor: 'pointer' }} />
                </td>
                <td style={{ padding: '14px 12px', fontWeight: '600', color: '#007bff', borderRight: '1px solid #f1f3f4' }}>{order.id}</td>
                <td style={{ padding: '14px 12px', borderRight: '1px solid #f1f3f4', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.product}</td>
                <td style={{ padding: '14px 12px', textAlign: 'center', fontWeight: '600', borderRight: '1px solid #f1f3f4' }}>{order.quantity}</td>
                <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>
                  <span className={`status ${order.status.toLowerCase()}`} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '14px 12px', textAlign: 'center', color: '#6c757d', borderRight: '1px solid #f1f3f4' }}>{order.date}</td>
                <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button className="action-btn" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', transition: 'background-color 0.3s ease' }}>{order.actions}</button>
                    <button className="action-btn" style={{ padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', transition: 'background-color 0.3s ease' }}>⋮</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
