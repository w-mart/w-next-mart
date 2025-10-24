'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const FindDistributor = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [gstin, setGstin] = useState('');
  const [pincode, setPincode] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewingDistributor, setViewingDistributor] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    // Navigate to purchase products page with query parameters
    const queryParams = new URLSearchParams({
      username: name,
      pincode: pincode,
      gstinNumber: gstin
    });

    router.push(`/retailer/purchase-products?${queryParams}`);
  };

  const handleView = (distributor) => {
    setViewingDistributor(distributor);
  };

  const handleCloseView = () => {
    setViewingDistributor(null);
  };

  return (
    <div className="page-content-tile">
      <div className="page-header">
        <h1>Find Distributor</h1>
        <p>Search for distributors by name or GSTIN to purchase products</p>
      </div>
      <form onSubmit={handleSearch} className="form-container">
        <div className="form-group">
          <label htmlFor="name">Distributor Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter distributor name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="gstin">GSTIN Number</label>
          <input
            type="text"
            id="gstin"
            value={gstin}
            onChange={(e) => setGstin(e.target.value)}
            placeholder="Enter GSTIN number"
          />
        </div>
        <div className="form-group">
          <label htmlFor="pincode">Pincode</label>
          <input
            type="text"
            id="pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter pincode"
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <div className="error-message">Error: {error}</div>}
      {results.length > 0 && (
        <div className="table-container">
          <h2>Search Results</h2>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>GSTIN</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((distributor) => (
                <tr key={distributor.id}>
                  <td>{distributor.name}</td>
                  <td>{distributor.gstin}</td>
                  <td>{distributor.location}</td>
                  <td>
                    <Link href={`/retailer/purchase-products?distributor=${distributor.id}`}>
                      <button className="action-btn">Purchase Products</button>
                    </Link>
                    <button className="action-btn view-btn" onClick={() => handleView(distributor)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {viewingDistributor && (
        <div className="modal">
          <div className="modal-content">
            <h2>Distributor Details</h2>
            <div className="distributor-details">
              <p><strong>Name:</strong> {viewingDistributor.name}</p>
              <p><strong>GSTIN:</strong> {viewingDistributor.gstin}</p>
              <p><strong>Location:</strong> {viewingDistributor.location}</p>
              {viewingDistributor.contact && <p><strong>Contact:</strong> {viewingDistributor.contact}</p>}
              {viewingDistributor.email && <p><strong>Email:</strong> {viewingDistributor.email}</p>}
              {viewingDistributor.phone && <p><strong>Phone:</strong> {viewingDistributor.phone}</p>}
              {viewingDistributor.address && <p><strong>Address:</strong> {viewingDistributor.address}</p>}
            </div>
            <div className="modal-actions">
              <button onClick={handleCloseView}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindDistributor;
