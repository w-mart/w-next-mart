'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const OrderDetails = () => {
  const params = useParams();
  const orderId = params.orderId;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const apiUrl = process.env.NEXT_PUBLIC_RETAILER_API_URL;
        const response = await fetch(`${apiUrl}/api/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch order details: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="page-content-tile">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content-tile">
        <div className="error-message">Error: {error}</div>
        <button onClick={() => window.history.back()} className="action-btn">Go Back</button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-content-tile">
        <div className="error-message">Order not found</div>
        <button onClick={() => window.history.back()} className="action-btn">Go Back</button>
      </div>
    );
  }

  return (
    <div className="page-content-tile">
      <div className="page-header">
        <h1>Order Details - #{order.orderId}</h1>
        <p>Complete information about this order</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        {/* Order Summary Card */}
        <div style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#495057', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Order ID:</strong> <span>#{order.orderId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Status:</strong>
              <span className={`status ${order.orderStatus?.toLowerCase() || 'unknown'}`}>
                {order.orderStatus || 'Unknown'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Order Date:</strong> <span>{new Date(order.orderDate).toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Payment Mode:</strong> <span>{order.paymentMode || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Customer Information Card */}
        <div style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#495057', borderBottom: '2px solid #28a745', paddingBottom: '10px' }}>Customer Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Retailer ID:</strong> <span>{order.retailerId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Contact Number:</strong> <span>{order.contactNumber || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Email:</strong> <span>{order.email || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address Card */}
        <div style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#495057', borderBottom: '2px solid #ffc107', paddingBottom: '10px' }}>Delivery Address</h3>
          <div style={{ lineHeight: '1.6' }}>
            <p style={{ margin: 0 }}>{order.deliveryAddress || 'N/A'}</p>
            <p style={{ margin: 0 }}>{order.city || ''} {order.state || ''} {order.zipCode || ''}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="order-section" style={{ backgroundColor: '#ffffff', border: '1px solid #dee2e6', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#495057', borderBottom: '2px solid #dc3545', paddingBottom: '10px', marginTop: 0 }}>Order Items</h2>
        <div className="table-container">
          <table className="enhanced-inventory-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#e9ecef' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Product Name</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Quantity</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Unit Price</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items && order.items.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px' }}>{item.productName || 'Unknown Product'}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{item.productQuantity}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>₹{item.productPrice?.toFixed(2)}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>₹{(item.productQuantity * item.productPrice)?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="order-total" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '4px', textAlign: 'right' }}>
          <strong style={{ fontSize: '18px', color: '#495057' }}>Total Amount: ₹{order.items ? order.items.reduce((total, item) => total + (item.productQuantity * item.productPrice), 0).toFixed(2) : '0.00'}</strong>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="order-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => window.history.back()} className="action-btn" style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Back to Orders</button>
        <button className="action-btn" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Print Invoice</button>
      </div>
    </div>
  );
};

export default OrderDetails;
