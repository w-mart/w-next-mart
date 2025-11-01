"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const SearchResultsClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const username = searchParams.get('username');
  const pincode = searchParams.get('pincode');
  const gstinNumber = searchParams.get('gstinNumber');

  useEffect(() => {
    if (username && pincode && gstinNumber) {
      fetchProducts();
    } else {
      setError('Missing search parameters');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, pincode, gstinNumber]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const queryParams = new URLSearchParams({
        username: username,
        pincode: pincode,
        gstinNumber: gstinNumber
      });

      const response = await fetch(`${apiUrl}/api/products/search?${queryParams}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handlePurchaseSelected = () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product to purchase');
      return;
    }

    const selectedProductData = products.filter(product =>
      selectedProducts.includes(product.id)
    );

    localStorage.setItem('selectedProducts', JSON.stringify(selectedProductData));

    router.push(`/retailer/purchase-products?distributor=${username}&pincode=${pincode}&gstin=${gstinNumber}`);
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      return total + (product.productUnitPrice * product.productStockQuantity);
    }, 0);
  };

  if (loading) {
    return (
      <div className="page-content-tile">
        <div className="loading-message">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content-tile">
        <div className="error-message">Error: {error}</div>
        <button onClick={() => router.back()} className="action-btn">Go Back</button>
      </div>
    );
  }

  return (
    <div className="page-content-tile">
      <div className="page-header">
        <h1>Product Search Results</h1>
        <p>Products from distributor: {username}</p>
      </div>

      <div className="actions-bar">
        <button onClick={() => router.back()} className="action-btn">Back to Search</button>
        <button
          onClick={handlePurchaseSelected}
          className="action-btn purchase-btn"
          disabled={selectedProducts.length === 0}
        >
          Purchase Selected ({selectedProducts.length})
        </button>
      </div>

      {products.length > 0 ? (
        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Product Name</th>
                <th>MFG Date</th>
                <th>Expiry Date</th>
                <th>Price (₹)</th>
                <th>Available Quantity</th>
                <th>Unit</th>
                <th>Brand</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleProductSelect(product.id)}
                    />
                  </td>
                  <td>{product.productName}</td>
                  <td>{product.manufacturingDate || 'N/A'}</td>
                  <td>{product.expiryDate || 'N/A'}</td>
                  <td>₹{product.productUnitPrice?.toFixed(2)}</td>
                  <td>{product.productStockQuantity}</td>
                  <td>{product.productUnit}</td>
                  <td>{product.productBrandName}</td>
                  <td>{product.productCategory}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="summary-section">
            <h3>Summary</h3>
            <p><strong>Total Products:</strong> {products.length}</p>
            <p><strong>Total Value:</strong> ₹{calculateTotal().toFixed(2)}</p>
            <p><strong>Selected Products:</strong> {selectedProducts.length}</p>
          </div>
        </div>
      ) : (
        <div className="no-results">
          <p>No products found for the selected distributor.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsClient;
