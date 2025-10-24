'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import '../../enhanced-table-styles.css';

const PurchaseProducts = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const pincode = searchParams.get('pincode');
  const gstinNumber = searchParams.get('gstinNumber');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [draftName, setDraftName] = useState('');
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    deliveryAddress: '',
    city: '',
    state: '',
    zipCode: '',
    contactNumber: '',
    email: ''
  });
  const [retailerInfo, setRetailerInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const addToCart = (product) => {
    const qty = quantities[product.productId] || 1;
    if (qty > 0) {
      // Always add as a new item, even if the same product
      setCart([...cart, { ...product, id: product.productId, quantity: qty, cartId: Date.now() }]);
      // Reset quantity to 1 for next addition
      setQuantities(prev => ({ ...prev, [product.productId]: 1 }));
    }
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const updateCartQuantity = (cartId, newQuantity) => {
    if (newQuantity > 0) {
      setCart(cart.map(item =>
        item.cartId === cartId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const updateQuantity = (productId, qty) => {
    setQuantities(prev => ({ ...prev, [productId]: qty }));
  };

  const saveAsDraft = async () => {
    if (!draftName.trim()) {
      alert('Please enter a draft name');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const draftData = {
        draftName: draftName.trim(),
        distributorUsername: username,
        distributorPincode: pincode,
        distributorGstin: gstinNumber,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.productUnitPrice,
          subtotal: parseFloat(item.productUnitPrice) * item.quantity
        })),
        totalAmount: parseFloat(getTotal()),
        createdAt: new Date().toISOString()
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/drafts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(draftData)
      });

      if (!response.ok) {
        throw new Error(`Failed to save draft: ${response.status} ${response.statusText}`);
      }

      alert('Draft saved successfully!');
      setShowDraftModal(false);
      setDraftName('');
      setCart([]); // Clear cart after saving draft
    } catch (err) {
      alert(`Error saving draft: ${err.message}`);
    }
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      const priceNum = parseFloat(item.productUnitPrice);
      return total + (priceNum * item.quantity);
    }, 0).toFixed(2);
  };

  useEffect(() => {
    if (username && pincode && gstinNumber) {
      fetchProducts();
      loadDraftIfExists();
    } else {
      setError('Missing search parameters');
      setLoading(false);
    }
  }, [username, pincode, gstinNumber]);

  const loadDraftIfExists = async () => {
    const draftId = searchParams.get('draftId');
    if (!draftId) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/drafts/${draftId}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const draft = await response.json();
        // Load draft items into cart
        const cartItems = draft.items.map(item => ({
          id: item.productId,
          productName: item.productName,
          productUnitPrice: item.unitPrice,
          quantity: item.quantity,
          cartId: Date.now() + Math.random() // Unique cart ID
        }));
        setCart(cartItems);
      }
    } catch (err) {
      console.error('Error loading draft:', err);
    }
  };

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

      // Set distributorId from the first product (assuming all products from same distributor)
      if (data.length > 0 && data[0].distributorId) {
        localStorage.setItem('distributorId', data[0].distributorId);
      }

      // Fetch retailer info for checkout
      await fetchRetailerInfo();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRetailerInfo = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/retailers/profile`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRetailerInfo(data);
        // Pre-fill checkout data with retailer info
        setCheckoutData(prev => ({
          ...prev,
          contactNumber: data.contactNumber || '',
          email: data.email || ''
        }));
      }
    } catch (err) {
      console.error('Error fetching retailer info:', err);
    }
  };



  const handleCheckout = async () => {
    if (isSubmitting) return; // Prevent multiple submissions

    // Validate required fields
    if (!checkoutData.deliveryAddress.trim() || !checkoutData.city.trim() ||
        !checkoutData.state.trim() || !checkoutData.zipCode.trim() ||
        !checkoutData.contactNumber.trim() || !checkoutData.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const distributorId = localStorage.getItem('distributorId');
    if (!distributorId) {
      alert('Distributor information not loaded. Please try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const retailerCode = parseInt(localStorage.getItem('userId'), 10);
      const orderData = {
        retailerId: retailerCode,
        distributorId: parseInt(distributorId, 10),
        paymentMode: 'COD',
        deliveryAddress: checkoutData.deliveryAddress.trim(),
        city: checkoutData.city.trim(),
        state: checkoutData.state.trim(),
        zipCode: checkoutData.zipCode.trim(),
        contactNumber: checkoutData.contactNumber.trim(),
        email: checkoutData.email.trim(),
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: parseFloat(item.productUnitPrice)
        }))
      };

      const apiUrl = process.env.NEXT_PUBLIC_RETAILER_API_URL;
      console.log('API URL:', apiUrl);
      console.log('Order Data:', orderData);

      const response = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      let responseText;
      try {
        responseText = await response.text();
        console.log('Response text:', responseText);
      } catch (textError) {
        console.error('Error reading response text:', textError);
        throw new Error(`Failed to read response: ${textError.message}`);
      }

      let result;
      if (responseText && responseText.trim()) {
        try {
          result = JSON.parse(responseText);
          console.log('Parsed result:', result);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          console.error('Response text that failed to parse:', responseText);
          result = null;
        }
      } else {
        console.warn('Response text is empty or null');
        result = null;
      }

      if (!response.ok) {
        const errorMessage = result?.message || result?.error || responseText || 'Unknown error';
        throw new Error(`Failed to place order: ${response.status} ${response.statusText} - ${errorMessage}`);
      }
      alert('Order placed successfully! Order ID: ' + result.orderId);
      setShowCheckoutModal(false);
      setCart([]); // Clear cart after successful order
      // Redirect to orders page or dashboard
      window.location.href = '/retailer/orders';
    } catch (err) {
      console.error('Checkout error:', err);
      alert(`Error placing order: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content-tile">
        <p>Loading products...</p>
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
        <h1>Purchase Products from Distributor {username}</h1>
        <p>Select products to purchase</p>
      </div>
      <div className="enhanced-table-container">
        <table className="enhanced-inventory-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>MFG Date</th>
              <th>Expiry Date</th>
              <th>Price (₹)</th>
              <th>Available Quantity</th>
              <th>Unit</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={`${product.productId}-${index}`}>
                <td>{product.productName}</td>
                <td>{product.manufacturingDate || 'N/A'}</td>
                <td>{product.expiryDate || 'N/A'}</td>
                <td>₹{product.productUnitPrice?.toFixed(2)}</td>
                <td>{product.productStockQuantity}</td>
                <td>{product.productUnit}</td>
                <td>{product.productBrandName}</td>
                <td>{product.productCategory}</td>
                <td>
                  <button className="enhanced-action-btn" onClick={() => addToCart(product)}>Add to Cart</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {cart.length > 0 && (
        <div className="enhanced-cart-summary">
          <h2>Cart Summary</h2>
          <table className="enhanced-inventory-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={item.cartId || index}>
                  <td>{item.productName}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateCartQuantity(item.cartId, parseInt(e.target.value) || 1)}
                      style={{width: '60px'}}
                    />
                  </td>
                  <td>₹{item.productUnitPrice?.toFixed(2)}</td>
                  <td>₹{(parseFloat(item.productUnitPrice) * item.quantity).toFixed(2)}</td>
                  <td>
                    <button className="enhanced-action-btn delete" onClick={() => removeFromCart(item.cartId)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="enhanced-cart-total">
            <strong>Total: ₹{getTotal()}</strong>
            <button className="enhanced-action-btn" style={{marginLeft: '10px'}} onClick={() => setShowDraftModal(true)}>Save as Draft</button>
            <button className="enhanced-submit-btn" style={{marginLeft: '10px'}} onClick={() => setShowCheckoutModal(true)}>Checkout</button>
          </div>
        </div>
      )}

      {showDraftModal && (
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
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px',
            maxWidth: '90%'
          }}>
            <h3>Save Order as Draft</h3>
            <div style={{marginBottom: '15px'}}>
              <label htmlFor="draftName" style={{display: 'block', marginBottom: '5px'}}>Draft Name:</label>
              <input
                type="text"
                id="draftName"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Enter draft name"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
              <button
                className="enhanced-submit-btn"
                onClick={() => setShowDraftModal(false)}
                style={{backgroundColor: '#6c757d'}}
              >
                Cancel
              </button>
              <button
                className="enhanced-submit-btn"
                onClick={saveAsDraft}
              >
                Save Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {showCheckoutModal && (
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
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '500px',
            maxWidth: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3>Checkout - Order Details</h3>

            {/* Order Summary */}
            <div style={{marginBottom: '20px'}}>
              <h4>Order Summary</h4>
              <table className="enhanced-inventory-table" style={{fontSize: '14px'}}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={item.cartId || index}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.productUnitPrice?.toFixed(2)}</td>
                      <td>₹{(parseFloat(item.productUnitPrice) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{textAlign: 'right', marginTop: '10px', fontWeight: 'bold'}}>
                Total: ₹{getTotal()}
              </div>
            </div>

            {/* Delivery Address Form */}
            <div style={{marginBottom: '20px'}}>
              <h4>Delivery Address</h4>
              <div style={{display: 'grid', gap: '10px'}}>
                <div>
                  <label htmlFor="deliveryAddress" style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Address:</label>
                  <textarea
                    id="deliveryAddress"
                    value={checkoutData.deliveryAddress}
                    onChange={(e) => setCheckoutData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                    placeholder="Enter delivery address"
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                    required
                  />
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                  <div>
                    <label htmlFor="city" style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>City:</label>
                    <input
                      type="text"
                      id="city"
                      value={checkoutData.city}
                      onChange={(e) => setCheckoutData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="City"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>State:</label>
                    <input
                      type="text"
                      id="state"
                      value={checkoutData.state}
                      onChange={(e) => setCheckoutData(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="State"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="zipCode" style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>ZIP Code:</label>
                  <input
                    type="text"
                    id="zipCode"
                    value={checkoutData.zipCode}
                    onChange={(e) => setCheckoutData(prev => ({ ...prev, zipCode: e.target.value }))}
                    placeholder="ZIP Code"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div style={{marginBottom: '20px'}}>
              <h4>Contact Information</h4>
              <div style={{display: 'grid', gap: '10px'}}>
                <div>
                  <label htmlFor="contactNumber" style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Contact Number:</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    value={checkoutData.contactNumber}
                    onChange={(e) => setCheckoutData(prev => ({ ...prev, contactNumber: e.target.value }))}
                    placeholder="Contact Number"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={checkoutData.email}
                    onChange={(e) => setCheckoutData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{marginBottom: '20px'}}>
              <h4>Payment Method</h4>
              <div style={{padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6'}}>
                <strong>Cash on Delivery (COD)</strong>
                <p style={{margin: '5px 0 0 0', fontSize: '14px', color: '#6c757d'}}>
                  Pay when your order is delivered to your doorstep.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
              <button
                className="enhanced-submit-btn"
                onClick={() => setShowCheckoutModal(false)}
                style={{backgroundColor: '#6c757d'}}
              >
                Cancel
              </button>
              <button
                className="enhanced-submit-btn"
                onClick={handleCheckout}
                disabled={isSubmitting}
                style={{backgroundColor: isSubmitting ? '#6c757d' : '#28a745'}}
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order (COD)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseProducts;
