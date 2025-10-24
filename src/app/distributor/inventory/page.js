'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu, Bell, User, Search, Download, AlertTriangle, Package, TrendingUp, Clock,
  CheckCircle, MoreVertical, Eye, Edit, Trash2, Filter, Calendar, DollarSign,
  ShoppingBag, BarChart3, Truck, CreditCard, AlertCircle, Plus, X, Zap, Archive
} from 'lucide-react';
import '../../enhanced-table-styles.css';

const DEFAULT_PAGE_SIZE = 12;

const Inventory = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [allProductsRaw, setAllProductsRaw] = useState([]); // original data for chart / filters
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingRowId, setEditingRowId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Filters / sorting / pagination
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // newest, price-asc, price-desc
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // UI messages
  const [message, setMessage] = useState('');
  const messageTimeoutRef = useRef(null);

  // debounce searchTerm -> debouncedSearch
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found. Please log in.');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
      const res = await fetch(`${apiUrl}/api/products`, {
        method: 'GET',
        headers: { 'accept': '*/*', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
      const data = await res.json();
      const mapped = (data || []).map(item => ({
        id: item.id,
        product: item.productName || item.product,
        quantity: (item.productStockQuantity != null) ? item.productStockQuantity : (item.quantity || 0),
        priceNumber: (item.productUnitPrice != null) ? item.productUnitPrice : (item.price || 0),
        price: `₹${((item.productUnitPrice != null) ? item.productUnitPrice : (item.price || 0)).toFixed ? ((item.productUnitPrice != null) ? item.productUnitPrice : (item.price || 0)).toFixed(2) : (item.productUnitPrice || item.price || 0)}`,
        mfg: item.manufacturingDate || item.mfg || 'N/A',
        expiry: item.expiryDate || item.expiry || 'N/A',
        productCode: item.productCode,
        productBarcode: item.productBarcode,
        productBrandName: item.productBrandName || item.brand || '',
        productCategory: item.productCategory || item.category || '',
        productUnitPrice: item.productUnitPrice || item.unitPrice || 0,
        productDiscountPercentage: item.productDiscountPercentage || 0,
        productUnit: item.productUnit || item.unit || '',
        productActive: item.productActive != null ? item.productActive : true,
        distributorCode: item.distributorCode,
        createdAt: item.createdAt || item.created_at || '',
        updatedAt: item.updatedAt || item.updated_at || '',
        description: item.description || ''
      }));
      setProducts(mapped);
      setAllProductsRaw(mapped);
      setPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // initial fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  // detect AddProduct redirect via localStorage flag
  useEffect(() => {
    try {
      if (localStorage.getItem('productAdded') === 'true') {
        localStorage.removeItem('productAdded');
        setMessage('✓ Product added successfully — inventory refreshed.');
        // clear message after 4s
        clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = setTimeout(() => setMessage(''), 4000);
        fetchProducts();
      }
    } catch (e) {
      // ignore storage errors
    }
    return () => clearTimeout(messageTimeoutRef.current);
  }, []);

  // computed unique categories & brands for filters
  const categories = useMemo(() => {
    const setC = new Set();
    allProductsRaw.forEach(p => { if (p.productCategory) setC.add(p.productCategory); });
    return Array.from(setC).sort();
  }, [allProductsRaw]);

  const brands = useMemo(() => {
    const setB = new Set();
    allProductsRaw.forEach(p => { if (p.productBrandName) setB.add(p.productBrandName); });
    return Array.from(setB).sort();
  }, [allProductsRaw]);

  // filter / sort pipeline
  const filteredSorted = useMemo(() => {
    let list = products.slice();

    // search across product name, brand, category, expiry, code
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(item =>
        (item.product && item.product.toLowerCase().includes(q)) ||
        (item.productBrandName && item.productBrandName.toLowerCase().includes(q)) ||
        (item.productCategory && item.productCategory.toLowerCase().includes(q)) ||
        (String(item.expiry || '').toLowerCase().includes(q)) ||
        (String(item.productCode || '').toLowerCase().includes(q))
      );
    }

    if (categoryFilter) list = list.filter(i => i.productCategory === categoryFilter);
    if (brandFilter) list = list.filter(i => i.productBrandName === brandFilter);
    if (lowStockOnly) list = list.filter(i => (Number(i.quantity) || 0) < 10);

    // sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.productUnitPrice || a.priceNumber || 0) - (b.productUnitPrice || b.priceNumber || 0));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.productUnitPrice || b.priceNumber || 0) - (a.productUnitPrice || a.priceNumber || 0));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else {
      // newest
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  }, [products, debouncedSearch, categoryFilter, brandFilter, lowStockOnly, sortBy]);

  // pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / pageSize));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages]);
  const paged = filteredSorted.slice((page - 1) * pageSize, page * pageSize);

  // stats
  const totalProducts = products.length;
  const lowStockProducts = products.filter(item => (Number(item.quantity) || 0) < 10).length;
  const totalInventoryValue = products.reduce((sum, item) => sum + ((Number(item.productUnitPrice) || Number(item.priceNumber) || 0) * (Number(item.quantity) || 0)), 0);

  // chart data: category => total quantity
  const categoryChart = useMemo(() => {
    const map = {};
    products.forEach(p => {
      const cat = p.productCategory || 'Uncategorized';
      map[cat] = (map[cat] || 0) + (Number(p.quantity) || 0);
    });
    return Object.entries(map).map(([k, v]) => ({ category: k, qty: v })).sort((a, b) => b.qty - a.qty);
  }, [products]);

  // API helpers
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const prev = products.slice();
    try {
      // optimistic UI remove
      setProducts(prev.filter(p => p.id !== id));
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found. Please log in.');
      const res = await fetch(`${apiUrl}/api/products/${id}`, {
        method: 'DELETE',
        headers: { accept: '*/*', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to delete product: ${res.status} ${res.statusText}`);
      setMessage('✓ Product deleted');
      clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = setTimeout(() => setMessage(''), 3500);
    } catch (err) {
      setProducts(prev);
      setError(err.message);
    }
  };

  const updateProduct = async (payload) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found. Please log in.');
      const res = await fetch(`${apiUrl}/api/products/${payload.id}`, {
        method: 'PUT',
        headers: { accept: '*/*', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`Failed to update product: ${res.status} ${res.statusText} ${txt}`);
      }
      const updated = await res.json().catch(() => payload);
      // update in UI
      setProducts(prev => prev.map(p => p.id === payload.id ? { ...p, ...payload } : p));
      setEditingRowId(null);
      setMessage('✓ Product updated');
      clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = setTimeout(() => setMessage(''), 3500);
    } catch (err) {
      setError(err.message);
    }
  };

  // edit flow
  const handleEdit = (id) => {
    const pr = products.find(p => p.id === id);
    if (!pr) return;
    setEditingRowId(id);
    setEditingProduct({ ...pr }); // shallow copy
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditingProduct(null);
  };

  const handleSaveEdit = () => {
    // basic validation
    if (!editingProduct) return;
    if (!editingProduct.product || String(editingProduct.product).trim() === '') {
      setError('Product name required');
      return;
    }
    // ensure numeric fields
    editingProduct.quantity = Number(editingProduct.quantity) || 0;
    editingProduct.productUnitPrice = Number(editingProduct.productUnitPrice || editingProduct.priceNumber) || 0;
    updateProduct(editingProduct);
  };

  const handleFieldChange = (field, value) => {
    setEditingProduct(prev => ({ ...prev, [field]: value }));
  };

  // small helper to clear error message after a while
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 7000);
    return () => clearTimeout(t);
  }, [error]);

  return (
    <div className="inventory-page">
      <div className="page-header">
        <h1>Inventory</h1>
        <p>Monitor and manage your stock</p>
      </div>

      <div className="top-grid">
        <div className="stats-grid">
          <div className="stat-card">
            <Package size={20} />
            <div className="stat-label">Total Products</div>
            <div className="stat-number">{totalProducts}</div>
            <div className="stat-sub">Items in stock</div>
          </div>

          <div className="stat-card warning">
            <AlertTriangle size={20} />
            <div className="stat-label">Low Stock</div>
            <div className="stat-number">{lowStockProducts}</div>
            <div className="stat-sub">Below threshold (10)</div>
          </div>

          <div className="stat-card success">
            <DollarSign size={20} />
            <div className="stat-label">Total Value</div>
            <div className="stat-number">₹{totalInventoryValue.toFixed(2)}</div>
            <div className="stat-sub">Inventory worth</div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <BarChart3 size={18} />
            <h3>Stock by Category</h3>
          </div>
          <CategoryBarChart data={categoryChart} />
        </div>
      </div>

      <div className="main-grid">
        <aside className="filters-panel">
          <div className="filter-row">
            <div className="search-inline">
              <Search size={16} />
              <input
                placeholder="Search by name, brand, category or expiry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-row">
            <label>Category</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="filter-row">
            <label>Brand</label>
            <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
              <option value="">All brands</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="filter-row row-inline">
            <label>
              <input type="checkbox" checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)} />
              {' '}Low stock only
            </label>
            <label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </label>
          </div>

          <div className="filter-row actions">
            <button className="btn secondary" onClick={() => { setSearchTerm(''); setCategoryFilter(''); setBrandFilter(''); setLowStockOnly(false); setSortBy('newest'); }}>
              Reset
            </button>
            <Link href="/dashboard/add-product">
              <button className="btn primary">
                <Plus size={16} /> Add Product
              </button>
            </Link>
          </div>

          <div className="filter-row small-note">
            <small>Showing {filteredSorted.length} result(s)</small>
          </div>
        </aside>

        <section className="table-section">
          {loading && (
            <div className="loading">
              <Zap size={20} /> Loading inventory...
            </div>
          )}

          {message && <div className="toast success">{message} <button onClick={() => setMessage('')} className="toast-close"><X size={14} /></button></div>}
          {error && <div className="toast error">Error: {error} <button onClick={() => setError(null)} className="toast-close"><X size={14} /></button></div>}

          {!loading && !error && (
            <>
              <div className="table-controls">
                <div>
                  <label>Page size:</label>
                  <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div>

                <div className="pagination-controls">
                  <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
                  <span>Page {page} / {totalPages}</span>
                  <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
                </div>
              </div>

              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>MFG</th>
                    <th>Expiry</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((item) => (
                    <tr key={item.id} className={(Number(item.quantity) || 0) < 10 ? 'low-stock-row' : ''}>
                      <td>
                        {editingRowId === item.id ? (
                          <input value={editingProduct.product} onChange={e => handleFieldChange('product', e.target.value)} className="edit-input"/>
                        ) : (
                          <div className="product-cell">
                            <Package size={16} />
                            <div className="pmeta">
                              <div className="pname">{item.product}</div>
                              <div className="psub">{item.description ? (item.description.slice(0, 80) + (item.description.length > 80 ? '…' : '')) : ''}</div>
                            </div>
                          </div>
                        )}
                      </td>

                      <td>{editingRowId === item.id ? (
                        <input value={editingProduct.productBrandName} onChange={e => handleFieldChange('productBrandName', e.target.value)} className="edit-input" />
                      ) : item.productBrandName}</td>

                      <td>{editingRowId === item.id ? (
                        <input value={editingProduct.productCategory} onChange={e => handleFieldChange('productCategory', e.target.value)} className="edit-input" />
                      ) : item.productCategory}</td>

                      <td className={(Number(item.quantity) || 0) < 10 ? 'low-stock' : ''}>
                        {editingRowId === item.id ? (
                          <input type="number" value={editingProduct.quantity} onChange={e => handleFieldChange('quantity', Number(e.target.value))} className="edit-input small"/>
                        ) : <span>{item.quantity}</span>}
                      </td>

                      <td>
                        {editingRowId === item.id ? (
                          <input type="number" step="0.01" value={editingProduct.productUnitPrice} onChange={e => handleFieldChange('productUnitPrice', Number(e.target.value))} className="edit-input small"/>
                        ) : <div className="price-cell"><DollarSign size={12} /> ₹{Number(item.productUnitPrice || item.priceNumber || 0).toFixed(2)}</div>}
                      </td>

                      <td>{item.mfg}</td>
                      <td>{item.expiry}</td>

                      <td>
                        <div className="actions-cell">
                          {editingRowId === item.id ? (
                            <>
                              <button className="action-btn save" onClick={handleSaveEdit}><CheckCircle size={14} /> Save</button>
                              <button className="action-btn cancel" onClick={handleCancelEdit}><X size={14} /> Cancel</button>
                            </>
                          ) : (
                            <>
                              <button className="action-btn edit" onClick={() => handleEdit(item.id)}><Edit size={14} /> Edit</button>
                              {(Number(item.quantity) || 0) < 10 && <button className="action-btn reorder"><TrendingUp size={14} /> Reorder</button>}
                              <button className="action-btn delete" onClick={() => deleteProduct(item.id)}><Trash2 size={14} /> Delete</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* fallback when no results */}
              {filteredSorted.length === 0 && <div className="no-results">No products found with current filters.</div>}

              <div className="bottom-pagination">
                <span>Showing {(filteredSorted.length === 0) ? 0 : ((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filteredSorted.length)} of {filteredSorted.length}</span>
                <div>
                  <button className="page-btn" disabled={page <= 1} onClick={() => setPage(1)}>First</button>
                  <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
                  <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
                  <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(totalPages)}>Last</button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Inventory;

/* -------------------------
   Small inline components
   ------------------------- */

function CategoryBarChart({ data }) {
  // simple SVG horizontal bar chart
  const max = Math.max(1, ...data.map(d => d.qty));
  const shown = data.slice(0, 6); // show top 6 categories
  return (
    <div className="cat-chart">
      {shown.length === 0 && <div className="placeholder">No data yet</div>}
      {shown.map((d) => {
        const pct = Math.round((d.qty / max) * 100);
        return (
          <div key={d.category} className="cat-row">
            <div className="cat-name">{d.category}</div>
            <div className="cat-bar-wrap">
              <div className="cat-bar" style={{ width: `${pct}%` }} />
            </div>
            <div className="cat-val">{d.qty}</div>
          </div>
        );
      })}
    </div>
  );
}
