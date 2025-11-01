'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import for navigation
/* enhanced-table-styles.css consolidated into globals.css */
import { PlusCircle, Edit, Trash2, DollarSign, AlertTriangle, Package, Truck, UserCheck, UserX, MapPin } from 'lucide-react';

const Drivers = () => {
  // --- STATE MANAGEMENT ---
  const [drivers, setDrivers] = useState([]); // Original list from API
  const [filteredDrivers, setFilteredDrivers] = useState([]); // List after filters are applied

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
  const [editingDriver, setEditingDriver] = useState(null);

  const router = useRouter(); // Hook for programmatic navigation

  // --- DATA FETCHING ---
  useEffect(() => {
    async function fetchDrivers() {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${apiUrl}/api/user/drivers`, {
          method: 'GET',
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch drivers: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const mappedDrivers = data.map(item => ({
          id: item.id,
          firstName: item.firstName || '',
          lastName: item.lastName || '',
          deliveryVehicleNumber: item.deliveryVehicleNumber || '',
          active: item.active,
          deliveryCurrentLocation: item.deliveryCurrentLocation || '',
          deliveryAvailabilityStatus: item.deliveryAvailabilityStatus || '',
          // ... (include any other properties you need)
        }));
        setDrivers(mappedDrivers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDrivers();
  }, []);

  // --- FILTERING LOGIC ---
  useEffect(() => {
    let filtered = drivers.filter(d =>
      (d.firstName?.toLowerCase().includes(search.toLowerCase()) ?? true) ||
      (d.lastName?.toLowerCase().includes(search.toLowerCase()) ?? true) ||
      (d.deliveryVehicleNumber?.toLowerCase().includes(search.toLowerCase()) ?? true) ||
      (d.deliveryAvailabilityStatus?.toLowerCase().includes(search.toLowerCase()) ?? true) &&
      (status ? (status === 'active' ? d.active : !d.active) : true)
    );
    setFilteredDrivers(filtered);
    setCurrentPage(1);
  }, [search, status, drivers]);

  // --- PAGINATION LOGIC ---
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDrivers = filteredDrivers.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);

  // --- CRUD OPERATIONS ---
  const deleteDriver = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) {
        return;
    }
    try {
      const token = localStorage.getItem('authToken');
      setDrivers(drivers.filter(driver => driver.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateDriver = async (updatedDriver) => {
    try {
      const updatedDrivers = drivers.map(d =>
        d.id === updatedDriver.id ? { ...d, ...updatedDriver } : d
      );
      setDrivers(updatedDrivers);
      setEditingRowId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // --- EVENT HANDLERS ---
  const handleAddDriver = () => {
    router.push('/distributor/drivers/add');
  };

  const handleEdit = (driver) => {
    setEditingRowId(driver.id);
    setEditingDriver({ ...driver });
  };

  const handleSaveEdit = () => {
    updateDriver(editingDriver);
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditingDriver(null);
  };

  const handleFieldChange = (field, value) => {
    setEditingDriver(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <p>Loading drivers...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="page-content-tile">
      <header className="inventory-header">
        <h2>Driver Management</h2>
        <p>Monitor and manage your delivery drivers</p>
      </header>

      {/* --- SUMMARY CARDS --- */}
      <section className="summary-cards">
        <div className="stat-card">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Truck size={38} />
            <div>
              <h4>Total Drivers</h4>
              <div className="stat-number">{drivers.length}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <UserCheck size={38} />
            <div>
              <h4>Active Drivers</h4>
              <div className="stat-number">{drivers.filter(d => d.active).length}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <UserX size={38} />
            <div>
              <h4>Inactive Drivers</h4>
              <div className="stat-number">{drivers.filter(d => !d.active).length}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Truck size={38} />
            <div>
              <h4>On Duty</h4>
              <div className="stat-number">{drivers.filter(d => d.deliveryAvailabilityStatus === 'On Duty' || d.deliveryAvailabilityStatus === 'Available').length}</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FILTERS --- */}
      <section className="filters">
        <div className="filter-left">
          <input
            type="text"
            placeholder="Search by name, vehicle, or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button className="add-product-btn" onClick={handleAddDriver}>
          <PlusCircle size={18} /> Add Driver
        </button>
      </section>

      {/* --- DRIVERS TABLE --- */}
      <div className="table-container" style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid #e9ecef', marginTop: '20px' }}>
        <table className="orders-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <tr>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>S.No</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Driver Name</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Vehicle</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Current Location</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Current Order</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDrivers.length > 0 ? (
              paginatedDrivers.map((driver, index) => {
                const isEditing = editingRowId === driver.id;
                const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <tr key={`${driver.id}-${index}`} style={{ borderBottom: '1px solid #f1f3f4', transition: 'background-color 0.2s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#f8f9fa'} onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>
                      {serialNumber}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'left', borderRight: '1px solid #f1f3f4' }}>
                      {isEditing ? (
                        <>
                          <input type="text" value={editingDriver.firstName} onChange={(e) => handleFieldChange('firstName', e.target.value)} placeholder="First Name" />
                          <input type="text" value={editingDriver.lastName} onChange={(e) => handleFieldChange('lastName', e.target.value)} placeholder="Last Name" />
                        </>
                      ) : (
                        `${driver.firstName} ${driver.lastName}`
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'left', borderRight: '1px solid #f1f3f4' }}>
                      {isEditing ? (
                        <input type="text" value={editingDriver.deliveryVehicleNumber} onChange={(e) => handleFieldChange('deliveryVehicleNumber', e.target.value)} />
                      ) : (
                        driver.deliveryVehicleNumber || 'N/A'
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>
                      {isEditing ? (
                        <select value={editingDriver.active ? 'active' : 'inactive'} onChange={(e) => handleFieldChange('active', e.target.value === 'active')}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      ) : (
                        <span className={`status ${driver.active ? 'active' : 'inactive'}`} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {driver.active ? <UserCheck size={16} /> : <UserX size={16} />}
                          {driver.active ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'left', borderRight: '1px solid #f1f3f4' }}>
                      {isEditing ? (
                        <input type="text" value={editingDriver.deliveryCurrentLocation} onChange={(e) => handleFieldChange('deliveryCurrentLocation', e.target.value)} />
                      ) : (
                        driver.deliveryCurrentLocation || 'N/A'
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'left', borderRight: '1px solid #f1f3f4' }}>
                      {driver.deliveryAvailabilityStatus || 'Available'}
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
                            <button className="action-btn edit" onClick={() => handleEdit(driver)}>Edit</button>
                            <button className="action-btn delete" onClick={() => deleteDriver(driver.id)}>Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '14px 12px' }}>No drivers found.</td>
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

      {/* --- DRIVER TRACKING MAP --- */}
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
