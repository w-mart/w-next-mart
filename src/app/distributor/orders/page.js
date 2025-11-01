'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import for navigation
import Link from 'next/link';
/* enhanced-table-styles.css consolidated into globals.css */
import { PlusCircle, Edit, Trash2, DollarSign, AlertTriangle, Package, Truck, UserCheck, UserX, MapPin, Calendar } from 'lucide-react';

const Orders = () => {
  // --- STATE MANAGEMENT ---
  const [orders, setOrders] = useState([]); // Original list from API
  const [filteredOrders, setFilteredOrders] = useState([]); // List after filters are applied

  // Filter states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // UI/Data Fetching states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inline editing states
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);

  const router = useRouter(); // Hook for programmatic navigation

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const distributorId = localStorage.getItem('userId');
        if (!distributorId) {
          throw new Error('No distributor ID found. Please log in again.');
        }

        const apiUrl = process.env.NEXT_PUBLIC_RETAILER_API_URL;
        const response = await fetch(`${apiUrl}/api/orders/distributor/${distributorId}`, {
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

        // Flatten the order data
        const flattenedOrders = data.map(order => ({
          id: `#ORD-${order.orderId}`,
          orderId: order.orderId,
          product: order.items.map(item => item.productName || 'Unknown Product').join(', '),
          quantity: order.items.reduce((total, item) => total + item.productQuantity, 0),
          status: order.orderStatus || 'Unknown',
          date: new Date(order.orderDate).toLocaleDateString(),
          items: order.items
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

  // --- FILTERING LOGIC ---
  useEffect(() => {
    let filtered = orders.filter(o =>
      (o.product?.toLowerCase().includes(search.toLowerCase()) ?? true) ||
      (o.status?.toLowerCase().includes(search.toLowerCase()) ?? true) ||
      (o.id?.toLowerCase().includes(search.toLowerCase()) ?? true) &&
      (status ? o.status.toLowerCase() === status : true)
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [search, status, orders]);

  // --- PAGINATION LOGIC ---
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // --- CRUD OPERATIONS ---
  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
        return;
    }
    try {
      // Assume delete API
      setOrders(orders.filter(order => order.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateOrder = async (updatedOrder) => {
    try {
      // Assume update API
      const updatedOrders = orders.map(o =>
        o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o
      );
      setOrders(updatedOrders);
      setEditingRowId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // --- EVENT HANDLERS ---
  const handleAddOrder = () => {
    router.push('/distributor/orders/add');
  };

  const handleEdit = (order) => {
    setEditingRowId(order.id);
    setEditingOrder({ ...order });
  };

  const handleSaveEdit = () => {
    updateOrder(editingOrder);
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditingOrder(null);
  };

  const handleFieldChange = (field, value) => {
    setEditingOrder(prev => ({ ...prev, [field]: value }));
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = process.env.NEXT_PUBLIC_RETAILER_API_URL;
      const response = await fetch(`${apiUrl}/api/orders/${orderId}/accept`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'accepted' })
      });

      if (!response.ok) {
        throw new Error(`Failed to accept order: ${response.status} ${response.statusText}`);
      }

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === orderId ? { ...order, status: 'accepted' } : order
        )
      );

      alert('Order accepted successfully!');
    } catch (err) {
      alert(`Error accepting order: ${err.message}`);
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="page-content-tile">
      <header className="inventory-header">
        <h2>Order Management</h2>
        <p>Monitor and manage orders from retailers</p>
      </header>

      {/* --- SUMMARY CARDS --- */}
			<section className="summary-cards">
        <div className="stat-card" >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Package size={48} />
            <div>
              <h3>Total Orders</h3>
              <div className="stat-number">{orders.length}</div>
            </div>
          </div>
        </div>

        <div className="stat-card" >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Truck size={48} />
            <div>
              <h3>Pending</h3>
              <div className="stat-number">{orders.filter(o => o.status === 'placed').length}</div>
            </div>
          </div>
        </div>

        <div className="stat-card" >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <UserCheck size={48} />
            <div>
              <h3>Accepted</h3>
              <div className="stat-number">{orders.filter(o => o.status === 'accepted').length}</div>
            </div>
          </div>
        </div>

        {/*<div className="stat-card" >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Calendar size={48} />
            <div>
              <h2>Monthly Orders</h2>
              <div className="stat-number">{orders.filter(o => {
                const orderDate = new Date(o.date);
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
              }).length}</div>
            </div>
          </div>
        </div>*/}

        <div className="stat-card" >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <DollarSign size={48} />
            <div>
              <h3>Revenue</h3>
              <div className="stat-number">${orders.reduce((total, o) => total + o.quantity * 10, 0)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FILTERS --- */}
      <section className="filters">
        <div className="filter-left">
          <input
            type="text"
            placeholder="Search by order ID, product, or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="placed">Placed</option>
            <option value="accepted">Accepted</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <button className="add-product-btn" onClick={handleAddOrder}>
          <PlusCircle size={18} /> Add Order
        </button>
      </section>

      {/* --- ORDERS TABLE --- */}
      <div className="table-container" style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid #e9ecef', marginTop: '20px' }}>
        <table className="orders-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <tr>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>S.No</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Order ID</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Product</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Quantity</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Date</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order, index) => {
                const isEditing = editingRowId === order.id;
                const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <tr key={`${order.id}-${index}`} style={{ borderBottom: '1px solid #f1f3f4', transition: 'background-color 0.2s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#f8f9fa'} onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>
                      {serialNumber}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'left', borderRight: '1px solid #f1f3f4' }}>
                      {isEditing ? (
                        <input type="text" value={editingOrder.id} onChange={(e) => handleFieldChange('id', e.target.value)} />
                      ) : (
                        order.id
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'left', borderRight: '1px solid #f1f3f4' }}>
                      {isEditing ? (
                        <input type="text" value={editingOrder.product} onChange={(e) => handleFieldChange('product', e.target.value)} />
                      ) : (
                        order.product
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>
                      {isEditing ? (
                        <input type="number" value={editingOrder.quantity} onChange={(e) => handleFieldChange('quantity', e.target.value)} />
                      ) : (
                        order.quantity
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>
                      {isEditing ? (
                        <select value={editingOrder.status} onChange={(e) => handleFieldChange('status', e.target.value)}>
                          <option value="placed">Placed</option>
                          <option value="accepted">Accepted</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      ) : (
                        <span className={`status ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>
                      {order.date}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        {isEditing ? (
                          <>
                            <button className="action-btn save" onClick={handleSaveEdit}>Save</button>
                            <button className="action-btn cancel" onClick={handleCancelEdit}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <Link href={`/distributor/orders/${order.orderId}`}>
                              <button className="action-btn">View</button>
                            </Link>
                            {order.status === 'placed' && (
                              <button className="action-btn" onClick={() => handleAcceptOrder(order.orderId)}>Accept</button>
                            )}
                            <button className="action-btn edit" onClick={() => handleEdit(order)}>Edit</button>
                            <button className="action-btn delete" onClick={() => deleteOrder(order.id)}>Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '14px 12px' }}>No orders found.</td>
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

      {/* --- ORDER TRACKING MAP --- */}
      <div className="map-placeholder" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', marginTop: '24px' }}>
        <h3>Order Tracking Map</h3>
        <div style={{ width: '100%', height: '400px', backgroundColor: '#f8fafc', border: '2px dashed #d1d5db', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <p style={{ color: '#9ca3af', fontSize: '1.1rem', fontStyle: 'italic' }}>Interactive Map - Track orders and deliveries in real-time</p>
          {/* Mock map elements */}
          <div style={{ position: 'absolute', top: '20%', left: '30%', width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 0 2px #10b981' }}></div>
          <div style={{ position: 'absolute', top: '50%', left: '60%', width: '10px', height: '10px', backgroundColor: '#f59e0b', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 0 2px #f59e0b' }}></div>
          <div style={{ position: 'absolute', top: '70%', left: '40%', width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 0 2px #ef4444' }}></div>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Placed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Accepted</span>
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

export default Orders;
