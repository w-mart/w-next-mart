'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/api/products`, {
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
        const mappedProducts = data.map(item => ({
          id: item.id,
          product: item.productName,
          quantity: item.productStockQuantity,
          price: `₹${item.productUnitPrice.toFixed(2)}`,
          mfg: item.manufacturingDate || 'N/A',
          expiry: item.expiryDate || 'N/A',
          productCode: item.productCode,
          productBarcode: item.productBarcode,
          productBrandName: item.productBrandName,
          productCategory: item.productCategory,
          productUnitPrice: item.productUnitPrice,
          productDiscountPercentage: item.productDiscountPercentage,
          productUnit: item.productUnit,
          productActive: item.productActive,
          distributorCode: item.distributorCode,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          description: item.description
        }));
        setProducts(mappedProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredInventory = products.filter(item =>
    item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.expiry.includes(searchTerm)
  );

  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status} ${response.statusText}`);
      }
      // Refresh the products list
      setProducts(products.filter(product => product.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedProduct)
      });
      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.status} ${response.statusText}`);
      }
      // Refresh the products list
      const updatedProducts = products.map(product =>
        product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
      );
      setProducts(updatedProducts);
      setEditingRowId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (id) => {
    const product = products.find(p => p.id === id);
    setEditingProduct({ ...product });
    setEditingRowId(id);
  };

  const handleSaveEdit = (id) => {
    updateProduct(editingProduct);
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
  };

  const handleFieldChange = (field, value) => {
    setEditingProduct(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="page-content-tile">
      <div className="page-header">
        <h1>Inventory</h1>
        <p>Monitor your stock levels</p>
      </div>
      <div className="actions-bar">
        <input
          type="text"
          placeholder="Search by product or expiry date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <Link href="/retailer/add-product">
          <button className="add-btn">Add Product</button>
        </Link>
      </div>
      {loading && <div className="loading-message">Loading inventory...</div>}
      {error && <div className="error-message">Error: {error}</div>}
      {!loading && !error && (
        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>MFG Date</th>
                <th>Expiry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item, index) => (
                <tr key={index}>
                  <td>
                    {editingRowId === item.id ? (
                      <input
                        type="text"
                        value={editingProduct.product}
                        onChange={(e) => handleFieldChange('product', e.target.value)}
                      />
                    ) : (
                      item.product
                    )}
                  </td>
                  <td className={item.quantity < 10 ? 'low-stock' : ''}>
                    {editingRowId === item.id ? (
                      <input
                        type="number"
                        value={editingProduct.quantity}
                        onChange={(e) => handleFieldChange('quantity', parseInt(e.target.value))}
                      />
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td>
                    {editingRowId === item.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editingProduct.productUnitPrice}
                        onChange={(e) => handleFieldChange('productUnitPrice', parseFloat(e.target.value))}
                      />
                    ) : (
                      item.price
                    )}
                  </td>
                  <td>{item.mfg}</td>
                  <td>{item.expiry}</td>
                  <td>
                    {editingRowId === item.id ? (
                      <>
                        <button className="action-btn" onClick={() => handleSaveEdit(item.id)}>Save</button>
                        <button className="action-btn" onClick={handleCancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="action-btn" onClick={() => handleEdit(item.id)}>Edit</button>
                        {item.quantity < 10 && <button className="action-btn reorder-btn">Reorder</button>}
                        <button className="action-btn delete" onClick={() => deleteProduct(item.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inventory;
