'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
/* enhanced-table-styles.css consolidated into globals.css */
import { PlusCircle, DollarSign, AlertTriangle } from 'lucide-react';

const Payments = () => {
  // Data & UI state (static for now)
  const [payments, setPayments] = useState([
    { id: '#PAY-001', paymentId: 'PAY-001', amount: 1200, amountFormatted: '$1,200.00', date: '2024-01-15', status: 'Completed', method: 'Credit Card', orderId: 'ORD-001' },
    { id: '#PAY-002', paymentId: 'PAY-002', amount: 750, amountFormatted: '$750.00', date: '2024-01-14', status: 'Pending', method: 'Bank Transfer', orderId: 'ORD-002' },
    { id: '#PAY-003', paymentId: 'PAY-003', amount: 2500, amountFormatted: '$2,500.00', date: '2024-01-13', status: 'Completed', method: 'PayPal', orderId: 'ORD-003' },
    { id: '#PAY-004', paymentId: 'PAY-004', amount: 450, amountFormatted: '$450.00', date: '2024-01-12', status: 'Failed', method: 'Credit Card', orderId: 'ORD-004' },
    { id: '#PAY-005', paymentId: 'PAY-005', amount: 1800, amountFormatted: '$1,800.00', date: '2024-01-11', status: 'Completed', method: 'Credit Card', orderId: 'ORD-005' },
    { id: '#PAY-006', paymentId: 'PAY-006', amount: 600, amountFormatted: '$600.00', date: '2024-01-10', status: 'Pending', method: 'PayPal', orderId: 'ORD-006' },
    { id: '#PAY-007', paymentId: 'PAY-007', amount: 3000, amountFormatted: '$3,000.00', date: '2024-01-09', status: 'Completed', method: 'Bank Transfer', orderId: 'ORD-007' },
    { id: '#PAY-008', paymentId: 'PAY-008', amount: 900, amountFormatted: '$900.00', date: '2024-01-08', status: 'Failed', method: 'Credit Card', orderId: 'ORD-008' },
    { id: '#PAY-009', paymentId: 'PAY-009', amount: 1500, amountFormatted: '$1,500.00', date: '2024-01-07', status: 'Completed', method: 'PayPal', orderId: 'ORD-009' },
    { id: '#PAY-010', paymentId: 'PAY-010', amount: 400, amountFormatted: '$400.00', date: '2024-01-06', status: 'Pending', method: 'Bank Transfer', orderId: 'ORD-010' }
  ]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);

  const router = useRouter();

  // Using static data for now — no API calls

  // Filtering
  useEffect(() => {
    const filtered = payments.filter(p =>
      (p.method?.toLowerCase().includes(search.toLowerCase()) ?? true) ||
      (p.id?.toLowerCase().includes(search.toLowerCase()) ?? true) ||
      (p.orderId?.toString().toLowerCase().includes(search.toLowerCase()) ?? true)
    ).filter(p => (status ? p.status.toLowerCase() === status : true));

    setFilteredPayments(filtered);
    setCurrentPage(1);
  }, [search, status, payments]);

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / itemsPerPage));

  // CRUD-ish actions (local only)
  const deletePayment = (id) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return;
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  const updatePayment = (updated) => {
    setPayments(prev => prev.map(p => p.id === updated.id ? { ...p, ...updated } : p));
    setEditingRowId(null);
  };

  const handleAddPayment = () => router.push('/distributor/payments/add');

  const handleEdit = (payment) => {
    setEditingRowId(payment.id);
    setEditingPayment({ ...payment });
  };

  const handleSaveEdit = () => updatePayment(editingPayment);
  const handleCancelEdit = () => { setEditingRowId(null); setEditingPayment(null); };
  const handleFieldChange = (field, value) => setEditingPayment(prev => ({ ...prev, [field]: value }));

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  const totalReceived = payments.filter(p => p.status === 'completed' || p.status === 'Completed').reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div className="page-content-tile">
      <header className="inventory-header">
        <h2>Payments</h2>
        <p>View and manage payments from retailers</p>
      </header>

      <section className="summary-cards">
        <div className="stat-card">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <DollarSign size={38} />
            <div>
              <h4>Total Received</h4>
              <div className="stat-number">${totalReceived.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <AlertTriangle size={38} />
            <div>
              <h4>Failed</h4>
              <div className="stat-number">{payments.filter(p => p.status === 'failed' || p.status === 'Failed').length}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <PlusCircle size={38} />
            <div>
              <h4>Total Payments</h4>
              <div className="stat-number">{payments.length}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <DollarSign size={38} />
            <div>
              <h4>Pending Payments</h4>
              <div className="stat-number">{payments.filter(p => p.status === 'pending' || p.status === 'Pending').length}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="filters">
        <div className="filter-left">
          <input type="text" placeholder="Search by payment ID, method or order..." value={search} onChange={(e) => setSearch(e.target.value)} />

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        
      </section>

      <div className="table-container" style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid #e9ecef', marginTop: '20px' }}>
        <table className="orders-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <tr>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>S.No</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Payment ID</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Amount</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Date</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Method</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.length > 0 ? (
              paginatedPayments.map((p, index) => {
                const isEditing = editingRowId === p.id;
                const serialNumber = startIndex + index + 1;
                return (
                  <tr key={`${p.id}-${index}`} style={{ borderBottom: '1px solid #f1f3f4', transition: 'background-color 0.2s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#f8f9fa'} onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>{serialNumber}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'left', borderRight: '1px solid #f1f3f4' }}>{isEditing ? <input type="text" value={editingPayment.id} onChange={(e) => handleFieldChange('id', e.target.value)} /> : p.id}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'left', borderRight: '1px solid #f1f3f4' }}>{isEditing ? <input type="number" value={editingPayment.amount} onChange={(e) => handleFieldChange('amount', Number(e.target.value))} /> : p.amountFormatted}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>{isEditing ? (
                      <select value={editingPayment.status} onChange={(e) => handleFieldChange('status', e.target.value)}>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                    ) : (
                      <span className={`status ${p.status.toLowerCase()}`}>{p.status}</span>
                    )}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>{p.date}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>{p.method}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        {isEditing ? (
                          <>
                            <button className="action-btn save" onClick={handleSaveEdit}>Save</button>
                            <button className="action-btn cancel" onClick={handleCancelEdit}>Cancel</button>
                          </>
                        ) : (
                          <>
                            {p.orderId ? (
                              <Link href={`/distributor/orders/${p.orderId}`}>
                                <button className="action-btn">View Order</button>
                              </Link>
                            ) : <button className="action-btn">Receipt</button>}
                            <button className="action-btn edit" onClick={() => handleEdit(p)}>Edit</button>
                            <button className="action-btn delete" onClick={() => deletePayment(p.id)}>Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '14px 12px' }}>No payments found.</td>
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

export default Payments;
