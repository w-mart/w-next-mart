'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import for navigation
/* enhanced-table-styles.css consolidated into globals.css */
import { PlusCircle, Edit, Trash2, DollarSign, AlertTriangle, Package, Truck, UserCheck, UserX, MapPin } from 'lucide-react';

const Delivery = () => {
  // --- STATE MANAGEMENT ---
  const [deliveries, setDeliveries] = useState([]); // Original list from API or static
  const [filteredDeliveries, setFilteredDeliveries] = useState([]); // List after filters are applied

  // Filter states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // UI/Data Fetching states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Inline editing states
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingDelivery, setEditingDelivery] = useState(null);

  const router = useRouter(); // Hook for programmatic navigation

  // Static deliveries data (can be replaced with API call)
  const initialDeliveries = [
    { id: '#DEL-001', orderId: '#ORD-001', status: 'In Transit', estimated: '2024-01-20', carrier: 'FedEx' },
    { id: '#DEL-002', orderId: '#ORD-002', status: 'Out for Delivery', estimated: '2024-01-18', carrier: 'UPS' },
    { id: '#DEL-003', orderId: '#ORD-003', status: 'Delivered', estimated: '2024-01-17', carrier: 'DHL' },
    { id: '#DEL-004', orderId: '#ORD-004', status: 'Pending Pickup', estimated: '2024-01-19', carrier: 'USPS' },
    { id: '#DEL-005', orderId: '#ORD-005', status: 'In Transit', estimated: '2024-01-21', carrier: 'FedEx' },
    { id: '#DEL-006', orderId: '#ORD-006', status: 'Out for Delivery', estimated: '2024-01-19', carrier: 'UPS' },
    { id: '#DEL-007', orderId: '#ORD-007', status: 'Delivered', estimated: '2024-01-16', carrier: 'DHL' },
    { id: '#DEL-008', orderId: '#ORD-008', status: 'Pending Pickup', estimated: '2024-01-20', carrier: 'USPS' },
    { id: '#DEL-009', orderId: '#ORD-009', status: 'In Transit', estimated: '2024-01-22', carrier: 'FedEx' },
    { id: '#DEL-010', orderId: '#ORD-010', status: 'Out for Delivery', estimated: '2024-01-20', carrier: 'UPS' },
  ];

  // --- DATA INITIALIZATION ---
  useEffect(() => {
    setDeliveries(initialDeliveries);
  }, []);

  // --- FILTERING LOGIC ---
  useEffect(() => {
    let filtered = deliveries.filter(delivery =>
      (delivery.carrier?.toLowerCase().includes(search.toLowerCase()) ?? true) ||
      (delivery.orderId?.toLowerCase().includes(search.toLowerCase()) ?? true) ||
      (delivery.id?.toLowerCase().includes(search.toLowerCase()) ?? true) &&
      (status ? delivery.status.toLowerCase().replace(' ', '-') === status : true)
    );
    setFilteredDeliveries(filtered);
    setCurrentPage(1);
  }, [search, status, deliveries]);

  // --- PAGINATION LOGIC ---
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeliveries = filteredDeliveries.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);

  // --- CRUD OPERATIONS ---
  const deleteDelivery = async (id) => {
    if (!window.confirm("Are you sure you want to delete this delivery?")) {
        return;
    }
    try {
      setDeliveries(deliveries.filter(delivery => delivery.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateDelivery = async (updatedDelivery) => {
    try {
      const updatedDeliveries = deliveries.map(d =>
        d.id === updatedDelivery.id ? { ...d, ...updatedDelivery } : d
      );
      setDeliveries(updatedDeliveries);
      setEditingRowId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // --- EVENT HANDLERS ---
  const handleAddDelivery = () => {
    router.push('/distributor/delivery/add');
  };

  const handleEdit = (delivery) => {
    setEditingRowId(delivery.id);
    setEditingDelivery({ ...delivery });
  };

  const handleSaveEdit = () => {
    updateDelivery(editingDelivery);
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditingDelivery(null);
  };

  const handleFieldChange = (field, value) => {
    setEditingDelivery(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <p>Loading deliveries...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="page-content-tile">
      <header className="inventory-header">
        <h2>Delivery Management</h2>
        <p>Track and manage your shipments</p>
      </header>

      {/* --- SUMMARY CARDS --- */}
      <section className="summary-cards">
        <div className="stat-card" >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Package size={48} />
            <div>
              <h4>Total Deliveries</h4>
              <div className="stat-number">{deliveries.length}</div>
            </div>
          </div>
        </div>

        <div className="stat-card" >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Truck size={48} />
            <div>
              <h4>In Transit</h4>
              <div className="stat-number">{deliveries.filter(d => d.status === 'In Transit').length}</div>
            </div>
          </div>
        </div>

        <div className="stat-card" >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <UserCheck size={48} />
            <div>
              <h4>Delivered</h4>
              <div className="stat-number">{deliveries.filter(d => d.status === 'Delivered').length}</div>
            </div>
          </div>
        </div>

        <div className="stat-card" >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <AlertTriangle size={48} />
            <div>
              <h4>Pending Pickup</h4>
              <div className="stat-number">{deliveries.filter(d => d.status === 'Pending Pickup').length}</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FILTERS --- */}
      <section className="filters">
        <div className="filter-left">
          <input
            type="text"
            placeholder="Search by delivery ID, order ID, or carrier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="in-transit">In Transit</option>
            <option value="out-for-delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="pending-pickup">Pending Pickup</option>
          </select>
        </div>

      </section>
      {/* --- DELIVERIES TABLE --- */}
      <div className="table-container" style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid #e9ecef', marginTop: '20px' }}>
        <table className="orders-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <tr>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>S.No</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Delivery ID</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Order ID</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Estimated Delivery</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Carrier</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDeliveries.length > 0 ? (
              paginatedDeliveries.map((delivery, index) => {
                const isEditing = editingRowId === delivery.id;
                const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <tr key={`${delivery.id}-${index}`} style={{ borderBottom: '1px solid #f1f3f4', transition: 'background-color 0.2s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#f8f9fa'} onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>
                      {serialNumber}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'left', borderRight: '1px solid #f1f3f4' }}>
                      {isEditing ? (
                        <input type="text" value={editingDelivery.id} onChange={(e) => handleFieldChange('id', e.target.value)} />
                      ) : (
                        delivery.id
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'left', borderRight: '1px solid #f1f3f4' }}>
                      {isEditing ? (
                        <input type="text" value={editingDelivery.orderId} onChange={(e) => handleFieldChange('orderId', e.target.value)} />
                      ) : (
                        delivery.orderId
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>
                      {isEditing ? (
                        <select value={editingDelivery.status.toLowerCase().replace(' ', '-')} onChange={(e) => handleFieldChange('status', e.target.value.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()))}>
                          <option value="in-transit">In Transit</option>
                          <option value="out-for-delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="pending-pickup">Pending Pickup</option>
                        </select>
                      ) : (
                        <span className={`status ${delivery.status.toLowerCase().replace(' ', '-')}`}>
                          {delivery.status}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>
                      {isEditing ? (
                        <input type="date" value={editingDelivery.estimated} onChange={(e) => handleFieldChange('estimated', e.target.value)} />
                      ) : (
                        delivery.estimated
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>
                      {isEditing ? (
                        <input type="text" value={editingDelivery.carrier} onChange={(e) => handleFieldChange('carrier', e.target.value)} />
                      ) : (
                        delivery.carrier
                      )}
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
                            <button className="action-btn edit" onClick={() => handleEdit(delivery)}>Edit</button>
                            <button className="action-btn delete" onClick={() => deleteDelivery(delivery.id)}>Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '14px 12px' }}>No deliveries found.</td>
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
