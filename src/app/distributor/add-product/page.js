'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Package, PlusCircle, Truck, FileText } from 'lucide-react';
/* enhanced-table-styles.css consolidated into globals.css */

const AddProduct = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [inventoryStats, setInventoryStats] = useState({
    totalProducts: 0,
    addedToday: 0,
    lowStock: 0,
    categories: 0
  });

  // Fetch real-time inventory stats
  useEffect(() => {
    const fetchInventoryStats = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const distributorCode = localStorage.getItem('distributorCode');

        if (!token || !distributorCode) return;

        const response = await fetch(`http://localhost:8081/api/products/stats/${distributorCode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setInventoryStats({
            totalProducts: data.totalProducts || 0,
            addedToday: data.addedToday || 0,
            lowStock: data.lowStock || 0,
            categories: data.categories || 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch inventory stats:', error);
      }
    };

    fetchInventoryStats();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    mfgDate: '',
    expiryDate: '',
    category: '',
    description: '',
    image: null,
    brandName: '',
    stockQuantity: '',
    discountPercentage: '',
    unit: ''
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else setPreview(null);
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Product name is required';
      if (!formData.category) newErrors.category = 'Category is required';
    } else if (step === 2) {
      if (parseFloat(formData.price) <= 0)
        newErrors.price = 'Price must be greater than 0';
      if (new Date(formData.expiryDate) <= new Date(formData.mfgDate))
        newErrors.expiryDate = 'Expiry must be after MFG date';
      if (!formData.brandName.trim())
        newErrors.brandName = 'Brand name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setMessage('');
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      const distributorCode = localStorage.getItem('distributorCode');
      if (!token || !userId || !distributorCode) {
        setMessage('✗ Error: User not authenticated.');
        return;
      }

      const response = await fetch('http://localhost:8081/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: userId,
          distributorCode,
          productName: formData.name,
          productBrandName: formData.brandName,
          productCategory: formData.category,
          productUnitPrice: parseFloat(formData.price),
          productStockQuantity: parseInt(formData.stockQuantity),
          productDiscountPercentage: parseFloat(formData.discountPercentage),
          productUnit: formData.unit,
          description: formData.description,
          manufacturingDate: formData.mfgDate,
          expiryDate: formData.expiryDate,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('✓ Product added successfully!');
        setTimeout(() => router.push('/distributor/inventory'), 600);
      } else setMessage('✗ Error: ' + (data.message || 'Failed to add'));
    } catch (err) {
      console.error('Add product error:', err);
      setMessage('✗ Network or server error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-content-tile">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>Add Product</h2>
          <p style={{ margin: 0, color: "#64748b" }}>Add new products to your inventory</p>
        </div>
      </div>

      {/* Summary Tiles */}
      <section className="summary-cards">
        <div className="stat-card" >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Package size={48} />
            <div>
              <h4>Total Products</h4>
              <div className="stat-number">{inventoryStats.totalProducts}</div>
            </div>
          </div>
        </div>

        <div className="stat-card" >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <PlusCircle size={48} />
            <div>
              <h4>Added Today</h4>
              <div className="stat-number">{inventoryStats.addedToday}</div>
            </div>
          </div>
        </div>

        <div className="stat-card" >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Truck size={48} />
            <div>
              <h4>Low Stock</h4>
              <div className="stat-number">{inventoryStats.lowStock}</div>
            </div>
          </div>
        </div>

        <div className="stat-card" >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <FileText size={48} />
            <div>
              <h4>Categories</h4>
              <div className="stat-number">{inventoryStats.categories}</div>
            </div>
          </div>
        </div>
      </section>
<br/>
      {/* Product Details Form Below Stats */}
      <div className="add-product-page">
        <div className="form-section">
        <h2>Add Product</h2>
        <div className="steps">
          <span className={step === 1 ? 'active' : ''}>1 Basic Info</span>
          <span className={step === 2 ? 'active' : ''}>2 Pricing & Stock</span>
          <span className={step === 3 ? 'active' : ''}>3 Image & Preview</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* STEP 1 */}
          {step === 1 && (
            <div className="form-step">
              <label>Product Name*</label>
              <input name="name" value={formData.name} onChange={handleChange}/>
              {errors.name && <small className="error">{errors.name}</small>}

              <label>Category*</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Food">Food</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <small className="error">{errors.category}</small>}

              <label>Description</label>
              <textarea name="description" rows="3" value={formData.description} onChange={handleChange}/>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="form-step">
              <label>Price (₹)*</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange}/>
              {errors.price && <small className="error">{errors.price}</small>}

              <label>MFG Date*</label>
              <input type="date" name="mfgDate" value={formData.mfgDate} onChange={handleChange}/>

              <label>Expiry Date*</label>
              <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange}/>
              {errors.expiryDate && <small className="error">{errors.expiryDate}</small>}

              <label>Brand Name*</label>
              <input name="brandName" value={formData.brandName} onChange={handleChange}/>
              {errors.brandName && <small className="error">{errors.brandName}</small>}

              <label>Stock Quantity*</label>
              <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange}/>

              <label>Discount (%)</label>
              <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange}/>

              <label>Unit*</label>
              <select name="unit" value={formData.unit} onChange={handleChange}>
                <option value="">Select Unit</option>
                <option value="pcs">Pieces</option>
                <option value="kg">Kilograms</option>
                <option value="liters">Liters</option>
                <option value="boxes">Boxes</option>
              </select>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="form-step">
              <label>Product Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange}/>
              {preview && <img src={preview} alt="Preview" className="preview-img" />}
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="form-actions">
            {step > 1 && <button type="button" onClick={prevStep}>← Back</button>}
            {step < 3 && <button type="button" onClick={nextStep}>Next →</button>}
            {step === 3 && (
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding…' : 'Add Product'}
              </button>
            )}
          </div>
        </form>
        {message && <p className={`message ${message.startsWith('✓') ? 'success' : 'error'}`}>{message}</p>}
        </div>

        {/* RIGHT PREVIEW PANEL */}
        <div className="preview-section">
          <h3>Live Preview</h3>
          {preview ? (
            <img src={preview} alt="Product Preview" className="preview-img-large"/>
          ) : (
            <div className="placeholder">No image selected</div>
          )}
          <div className="preview-details">
            <p><strong>{formData.name || 'Product Name'}</strong></p>
            <p>₹{formData.price || '0.00'}</p>
            <p>{formData.category || 'Category'}</p>
            <p>{formData.description || 'Description will appear here.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
