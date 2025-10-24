'use client';

import React, { useState, useEffect } from 'react';
import '../../enhanced-table-styles.css';

const DraftsPage = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [showDraftDetails, setShowDraftDetails] = useState(false);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/drafts`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch drafts: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setDrafts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const viewDraft = (draft) => {
    setSelectedDraft(draft);
    setShowDraftDetails(true);
  };

  const continueDraft = (draft) => {
    // Navigate to purchase page with draft data
    const queryParams = new URLSearchParams({
      username: draft.distributorUsername,
      pincode: draft.distributorPincode,
      gstinNumber: draft.distributorGstin,
      draftId: draft.id
    });
    window.location.href = `/retailer/purchase-products?${queryParams}`;
  };

  const deleteDraft = async (draftId) => {
    if (!confirm('Are you sure you want to delete this draft?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/drafts/${draftId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete draft: ${response.status} ${response.statusText}`);
      }

      // Refresh drafts list
      fetchDrafts();
      alert('Draft deleted successfully!');
    } catch (err) {
      alert(`Error deleting draft: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="page-content-tile">
        <p>Loading drafts...</p>
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

  return (
    <div className="page-content-tile">
      <div className="page-header">
        <h1>My Draft Orders</h1>
        <p>View and continue your saved draft orders</p>
      </div>

      {drafts.length === 0 ? (
        <div style={{textAlign: 'center', padding: '40px'}}>
          <p>No draft orders found.</p>
          <button
            className="enhanced-action-btn"
            onClick={() => window.location.href = '/retailer/find-distributor'}
          >
            Start New Order
          </button>
        </div>
      ) : (
        <div className="enhanced-table-container">
          <table className="enhanced-inventory-table">
            <thead>
              <tr>
                <th>Draft Name</th>
                <th>Distributor</th>
                <th>Total Amount</th>
                <th>Items</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drafts.map((draft) => (
                <tr key={draft.id}>
                  <td>{draft.draftName}</td>
                  <td>{draft.distributorUsername}</td>
                  <td>₹{draft.totalAmount?.toFixed(2)}</td>
                  <td>{draft.items?.length || 0} items</td>
                  <td>{new Date(draft.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="enhanced-action-btn"
                      onClick={() => viewDraft(draft)}
                      style={{marginRight: '5px'}}
                    >
                      View
                    </button>
                    <button
                      className="enhanced-action-btn"
                      onClick={() => continueDraft(draft)}
                      style={{marginRight: '5px', backgroundColor: '#28a745'}}
                    >
                      Continue
                    </button>
                    <button
                      className="enhanced-action-btn delete"
                      onClick={() => deleteDraft(draft.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDraftDetails && selectedDraft && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          overflowY: 'auto'
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '800px',
            maxWidth: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3>Draft Details: {selectedDraft.draftName}</h3>
            <div style={{marginBottom: '20px'}}>
              <p><strong>Distributor:</strong> {selectedDraft.distributorUsername}</p>
              <p><strong>Created:</strong> {new Date(selectedDraft.createdAt).toLocaleString()}</p>
              <p><strong>Total Amount:</strong> ₹{selectedDraft.totalAmount?.toFixed(2)}</p>
            </div>

            <h4>Items:</h4>
            <table className="enhanced-inventory-table" style={{marginBottom: '20px'}}>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedDraft.items?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.unitPrice?.toFixed(2)}</td>
                    <td>₹{item.subtotal?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
              <button
                className="enhanced-action-btn"
                onClick={() => setShowDraftDetails(false)}
                style={{backgroundColor: '#6c757d'}}
              >
                Close
              </button>
              <button
                className="enhanced-action-btn"
                onClick={() => {
                  setShowDraftDetails(false);
                  continueDraft(selectedDraft);
                }}
                style={{backgroundColor: '#28a745'}}
              >
                Continue Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraftsPage;
