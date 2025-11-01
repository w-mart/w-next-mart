'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, AlertTriangle, Package, DollarSign } from 'lucide-react';

const Inventory = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      // If no API available, mock empty list
      if (!token || !apiUrl) {
        setProducts([]);
        return;
      }
      const res = await fetch(`${apiUrl}/api/products`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
      const data = await res.json();
      const mapped = data.map(item => ({
        id: item.id,
        product: item.productName,
        quantity: item.productStockQuantity,
        productUnitPrice: item.productUnitPrice,
        mfg: item.manufacturingDate || 'N/A',
        expiry: item.expiryDate || 'N/A',
        productBrandName: item.productBrandName,
        productCategory: item.productCategory
      }));
      setProducts(mapped);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = products.filter(p =>
      (p.product?.toLowerCase().includes(search.toLowerCase()) ?? true) &&
      (category ? p.productCategory === category : true) &&
      (brand ? p.productBrandName === brand : true) &&
      (!lowStockOnly || p.quantity < 50)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [search, category, brand, lowStockOnly, products]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  const handleAddProduct = () => router.push('/distributor/add-product');

  const handleEdit = (product) => {
    setEditingRowId(product.id);
    setEditingProduct({ ...product });
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditingProduct(null);
  };

  const handleSaveEdit = () => {
    // local update only (backend integration optional)
    setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...editingProduct } : p));
    setEditingRowId(null);
    setEditingProduct(null);
  };

  const deleteProduct = (id) => {
    if (!confirm('Delete this product?')) return;
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  if (loading) return <div className="page-content-tile"><p>Loading inventory...</p></div>;
  if (error) return <div className="page-content-tile"><p className="error-message">Error: {error}</p></div>;

  return (
    <div className="page-content-tile">
      <header className="inventory-header">
        <h1>Inventory Management</h1>
        <p>Monitor and manage your stock with intelligence</p>
      </header>

      <section className="summary-cards">
        <div className="card blue">
          <Package size={24} />
          <div>
            <h2>{products.length}</h2>
            <p>Total Products</p>
          </div>
        </div>
        <div className="card orange">
          <AlertTriangle size={24} />
          <div>
            <h2>{products.filter(p => p.quantity < 50).length}</h2>
            <p>Low Stock Items</p>
          </div>
        </div>
        <div className="card green">
          <DollarSign size={24} />
          <div>
            <h2>₹{products.reduce((sum, p) => sum + (p.productUnitPrice || 0) * (p.quantity || 0), 0).toLocaleString()}</h2>
            <p>Total Inventory Value</p>
          </div>
        </div>
      </section>

      <section className="filters" style={{display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center'}}>
        <input type="text" placeholder="Search by product name..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {[...new Set(products.map(p => p.productCategory).filter(Boolean))].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={brand} onChange={e => setBrand(e.target.value)}>
          <option value="">All Brands</option>
          {[...new Set(products.map(p => p.productBrandName).filter(Boolean))].map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <label style={{display:'flex', alignItems:'center', gap:8}}>
          <input type="checkbox" checked={lowStockOnly} onChange={e => setLowStockOnly(e.target.checked)} /> Show low stock only
        </label>
        <button className="add-product-btn" onClick={handleAddProduct}><PlusCircle size={16} /> Add Product</button>
      </section>

      <div className="table-container" style={{marginTop: 16}}>
        <table className="orders-table" style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead style={{backgroundColor: '#f8f9fa'}}>
            <tr>
              <th>S.No</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>MFG Date</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length > 0 ? paginatedProducts.map((item, idx) => {
              const serial = startIndex + idx + 1;
              const isEditing = editingRowId === item.id;
              return (
                <tr key={item.id}>
                  <td style={{padding: 12, textAlign: 'center'}}>{serial}</td>
                  <td style={{padding: 12}}>{isEditing ? <input value={editingProduct.product} onChange={e => setEditingProduct(prev => ({...prev, product: e.target.value}))} /> : item.product}</td>
                  <td style={{padding: 12, textAlign: 'center'}}>{isEditing ? <input type="number" value={editingProduct.quantity} onChange={e => setEditingProduct(prev => ({...prev, quantity: parseInt(e.target.value || 0, 10)}))} /> : item.quantity}</td>
                  <td style={{padding: 12, textAlign: 'center'}}>{isEditing ? <input type="number" step="0.01" value={editingProduct.productUnitPrice} onChange={e => setEditingProduct(prev => ({...prev, productUnitPrice: parseFloat(e.target.value || 0)}))} /> : `₹${(item.productUnitPrice || 0).toFixed(2)}`}</td>
                  <td style={{padding: 12, textAlign: 'center'}}>{item.mfg}</td>
                  <td style={{padding: 12, textAlign: 'center'}}>{item.expiry}</td>
                  <td style={{padding: 12, textAlign: 'center'}}>
                    {isEditing ? (
                      <>
                        <button onClick={handleSaveEdit} className="action-btn save">Save</button>
                        <button onClick={handleCancelEdit} className="action-btn cancel">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(item)} className="action-btn edit">Edit</button>
                        <button onClick={() => deleteProduct(item.id)} className="action-btn delete">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={7} style={{textAlign:'center', padding: 16}}>No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination" style={{display:'flex', justifyContent:'center', gap:12, marginTop:16}}>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p-1))}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}>Next</button>
      </div>
    </div>
  );
};

export default Inventory;