'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import for navigation
/* enhanced-table-styles.css consolidated into globals.css */
import { PlusCircle, Edit, Trash2, DollarSign, AlertTriangle, Package, TrendingUp } from 'lucide-react';

const Inventory = () => {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState([]); // Original list from API
  const [filteredProducts, setFilteredProducts] = useState([]); // List after filters are applied
  
  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // UI/Data Fetching states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Inline editing states
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const router = useRouter(); // Hook for programmatic navigation

  // --- DATA FETCHING ---
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
          // ... (include any other properties you need)
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

  // --- FILTERING LOGIC ---
  useEffect(() => {
    let filtered = products.filter(p =>
      (p.product?.toLowerCase().includes(search.toLowerCase()) ?? true) &&
      (category ? p.productCategory === category : true) &&
      (brand ? p.productBrandName === brand : true) &&
      (!lowStockOnly || p.quantity < 50)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); 
  }, [search, category, brand, lowStockOnly, products]);

  // --- PAGINATION LOGIC ---
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // --- CRUD OPERATIONS ---
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
        return;
    }
    try {
      const token = localStorage.getItem('authToken');
      setProducts(products.filter(product => product.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      const updatedProducts = products.map(p =>
        p.id === updatedProduct.id ? { ...p, ...updatedProduct, price: `₹${updatedProduct.productUnitPrice.toFixed(2)}` } : p
      );
      setProducts(updatedProducts);
      setEditingRowId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // --- EVENT HANDLERS ---
  const handleAddProduct = () => {
    router.push('/distributor/add-product');
  };

  const handleEdit = (product) => {
    setEditingRowId(product.id);
    setEditingProduct({ ...product });
  };

  const handleSaveEdit = () => {
    updateProduct(editingProduct);
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditingProduct(null);
  };

  const handleFieldChange = (field, value) => {
    setEditingProduct(prev => ({ ...prev, [field]: value }));
  };
  
  if (loading) return <p>Loading inventory...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="page-content-tile">
      <header className="inventory-header">
        <h2>Inventory Management</h2>
        <p>Monitor and manage your stock with intelligence</p>
      </header>

      {/* --- SUMMARY CARDS --- */}
			<section className="summary-cards">
        <div className="stat-card" >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Package size={48} />
            <div>
              <h4>Total Products</h4>
              <div className="stat-number">{products.length}</div>
            </div>
          </div>
        </div>

        <div className="stat-card" >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <AlertTriangle size={38} />
            <div>
              <h4>Low Stock </h4>
              <div className="stat-number">{products.filter(p => p.quantity < 50).length}</div>
            </div>
          </div>
        </div>

        <div className="stat-card" >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <DollarSign size={38} />
            <div>
              <h4>Inventory Value</h4>
              <div className="stat-number">₹{products.reduce((sum, p) => sum + p.productUnitPrice * p.quantity, 0).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="stat-card" >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <TrendingUp size={38} />
            <div>
              <h4>Category</h4>
              <div className="stat-number">
                {products.length > 0
                  ? (() => {
                      const categoryCount = products.reduce((acc, p) => {
                        acc[p.productCategory] = (acc[p.productCategory] || 0) + 1;
                        return acc;
                      }, {});
                      const topCategory = Object.keys(categoryCount).reduce((a, b) =>
                        categoryCount[a] > categoryCount[b] ? a : b
                      );
                      return topCategory || 'N/A';
                    })()
                  : 'N/A'
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FILTERS --- */}
<section className="filters">
  <div className="filter-left">
    <input
      type="text"
      placeholder="Search by product name..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <select value={category} onChange={(e) => setCategory(e.target.value)}>
      <option value="">All Categories</option>
      {[...new Set(products.map(p => p.productCategory).filter(Boolean))].map(
        (cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        )
      )}
    </select>

    <select value={brand} onChange={(e) => setBrand(e.target.value)}>
      <option value="">All Brands</option>
      {[...new Set(products.map(p => p.productBrandName).filter(Boolean))].map(
        (br) => (
          <option key={br} value={br}>
            {br}
          </option>
        )
      )}
    </select>

    <button
      className={`low-stock-btn ${lowStockOnly ? 'active' : ''}`}
      onClick={() => setLowStockOnly(!lowStockOnly)}
    >
      Show low stock only
    </button>
  </div>

  <button className="add-product-btn" onClick={handleAddProduct}>
    <PlusCircle size={18} /> Add Product
  </button>
</section>


      {/* --- PRODUCT TABLE --- */}
      <div className="table-container" style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid #e9ecef', marginTop: '20px' }}>
        <table className="orders-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <tr>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>S.No</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Product</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Quantity</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Price</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>MFG Date</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057', borderRight: '1px solid #dee2e6' }}>Expiry Date</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 'bold', color: '#495057' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((item, index) => {
                const isEditing = editingRowId === item.id;
                const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <tr key={`${item.id}-${index}`} style={{ borderBottom: '1px solid #f1f3f4', transition: 'background-color 0.2s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#f8f9fa'} onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>
                      {serialNumber}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'left', borderRight: '1px solid #f1f3f4' }}>
                      {isEditing ? (
                        <input type="text" value={editingProduct.product} onChange={(e) => handleFieldChange('product', e.target.value)} />
                      ) : (
                        item.product
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4', fontWeight: '600', color: item.quantity < 10 ? '#dc3545' : '#212529' }}>
                      {isEditing ? (
                        <input type="number" value={editingProduct.quantity} onChange={(e) => handleFieldChange('quantity', parseInt(e.target.value, 10))} />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>
                      {isEditing ? (
                        <input type="number" step="0.01" value={editingProduct.productUnitPrice} onChange={(e) => handleFieldChange('productUnitPrice', parseFloat(e.target.value))} />
                      ) : (
                        `₹${item.price}`
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>
                       {isEditing ? (
                        <input type="date" value={editingProduct.mfg} onChange={(e) => handleFieldChange('mfg', e.target.value)} />
                      ) : (
                        item.mfg
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #f1f3f4' }}>
                       {isEditing ? (
                        <input type="date" value={editingProduct.expiry} onChange={(e) => handleFieldChange('expiry', e.target.value)} />
                      ) : (
                        item.expiry
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
                            <button className="action-btn edit" onClick={() => handleEdit(item)}>Edit</button>
                            <button className="action-btn delete" onClick={() => deleteProduct(item.id)}>Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '14px 12px' }}>No products found.</td>
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

export default Inventory;