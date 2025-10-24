import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");
  const [userType, setUserType] = useState("DISTRIBUTOR");
  const [roles] = useState(["RETAILER", "DISTRIBUTOR", "DRIVER", "SUPER_ADMIN"]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gstin, setGstin] = useState("");
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify({
          username: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store token in localStorage
        localStorage.setItem('authToken', data.token);
        // Assuming the API returns user role; default to DISTRIBUTOR if not
        const userRole = data.user.role;
        localStorage.setItem('userRole', userRole);
        // Store userId and distributorCode if available
        if (data.user) {
          localStorage.setItem('userId', data.user.id || '');
          localStorage.setItem('distributorCode', data.user.distributorCode || '');
          localStorage.setItem('retailerCode', data.user.retailerCode || '');
          localStorage.setItem('driverCode', data.user.driverCode || '');
          localStorage.setItem('regionAdminCode', data.user.regionAdminCode || '');
          localStorage.setItem('username', data.user.username || '');
        }

        setMessage("✓ Login successful! Redirecting...");
        // Brief delay for message visibility, then redirect
        setTimeout(() => {
          if (userRole === 'RETAILER') {
            router.push('/retailer');
          } else if (userRole === 'DRIVER') {
            router.push('/driver');
          } else if (userRole === 'DISTRIBUTOR') {
            router.push('/distributor');
          } else {
            router.push('/superadmin')
          }
        }, 50);
      } else {
        setMessage("✗ Error: " + (data.message || data.error || "Invalid credentials"));
      }
    } catch (err) {
      setMessage("✗ Error: Network error or server unavailable");
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    if (password !== confirmPassword) {
      setMessage("✗ Passwords do not match!");
      return;
    }
    setIsLoading(true);
    try {
      const signupData = {
        username,
        email,
        password,
        firstName,
        lastName,
        phone,
        role: userType,
      };

      if (userType === "RETAILER" || userType === "DISTRIBUTOR") {
        signupData.shopName = shopName;
        signupData.gstinNumber = gstin;
        signupData.address = address;
        signupData.city = city;
        signupData.state = state;
        signupData.pinCode = pinCode;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✓ Account created successfully!");
        setTimeout(() => {
          setActiveTab("login");
          setMessage("");
        }, 300);
      } else {
        setMessage("✗ Error: " + (data.message || data.error || "Registration failed"));
      }
    } catch (err) {
      setMessage("✗ Error: Network error or server unavailable");
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .auth-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .auth-container {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
          padding: 48px;
          width: 100%;
          max-width: 520px;
          animation: slideUp 0.6s ease-out;
        }
        .logo-circle {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
          animation: float 3s ease-in-out infinite;
          color: white;
          font-size: 32px;
          font-weight: bold;
        }
        .brand-title {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
          text-align: center;
        }
        .brand-subtitle {
          color: #718096;
          font-size: 14px;
          text-align: center;
          margin-bottom: 36px;
        }
        .tab-switcher {
          position: relative;
          display: flex;
          background: #f7fafc;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 32px;
        }
        .tab-btn {
          flex: 1;
          padding: 12px 24px;
          border: none;
          background: transparent;
          color: #718096;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
        }
        .tab-btn.active {
          color: white;
        }
        .tab-indicator {
          position: absolute;
          top: 4px;
          left: 4px;
          width: calc(50% - 4px);
          height: calc(100% - 8px);
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 10px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .tab-indicator.right {
          left: calc(50%);
        }
        .auth-form {
          animation: fadeIn 0.4s ease-out;
        }
        .form-title {
          font-size: 28px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 8px;
        }
        .form-subtitle {
          color: #718096;
          font-size: 14px;
          margin-bottom: 28px;
        }
        .input-group {
          margin-bottom: 20px;
        }
        .input-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
        }
        .input-field {
          width: 100%;
          padding: 13px 16px;
          font-size: 15px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          color: #2d3748;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        .input-field:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .input-field::placeholder {
          color: #cbd5e0;
        }
        .select-field {
          width: 100%;
          padding: 13px 16px;
          font-size: 15px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          color: #2d3748;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .select-field:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          font-size: 14px;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          color: #4a5568;
          cursor: pointer;
        }
        .checkbox-input {
          margin-right: 8px;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        .forgot-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          cursor: pointer;
        }
        .forgot-link:hover {
          color: #764ba2;
        }
        .divider {
          display: flex;
          align-items: center;
          margin: 28px 0 24px;
        }
        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }
        .divider-text {
          padding: 0 16px;
          color: #718096;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .submit-btn {
          width: 100%;
          padding: 15px 32px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(102, 126, 234, 0.4);
        }
        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .message {
          margin-top: 20px;
          padding: 14px 18px;
          border-radius: 10px;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
        }
        .message.success {
          background: #c6f6d5;
          color: #22543d;
          border: 2px solid #9ae6b4;
        }
        .message.error {
          background: #fed7d7;
          color: #742a2a;
          border: 2px solid #fc8181;
        }
        @media (max-width: 640px) {
          .auth-container {
            padding: 32px 24px;
          }
          .brand-title {
            font-size: 26px;
          }
          .form-title {
            font-size: 24px;
          }
          .input-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="auth-container">
        <div className="logo-circle">D</div>
        <h1 className="brand-title">DistribHub</h1>
        <p className="brand-subtitle">Your Distribution Management Solution</p>

        <div className="tab-switcher">
          <button
            className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("login");
              setMessage("");
            }}
          >
            Login
          </button>
          <button
            className={`tab-btn ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("signup");
              setMessage("");
            }}
          >
            Sign Up
          </button>
          <div className={`tab-indicator ${activeTab === "signup" ? "right" : ""}`}></div>
        </div>

        {activeTab === "login" && (
          <div className="auth-form">
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">Enter your credentials to continue</p>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a className="forgot-link">Forgot password?</a>
            </div>

            <button className="submit-btn" onClick={handleLogin} disabled={isLoading}>
              {isLoading ? <span className="loading-spinner"></span> : "Sign In"}
            </button>
          </div>
        )}

        {activeTab === "signup" && (
          <div className="auth-form">
            <h2 className="form-title">Create Account</h2>
            <p className="form-subtitle">Join DistribHub today</p>

            <div className="input-group">
              <label className="input-label">Account Type</label>
              <select
                className="select-field"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label className="input-label">First Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Last Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Username</label>
              <input
                type="text"
                className="input-field"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <input
                type="tel"
                className="input-field"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Confirm Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {(userType === "RETAILER" || userType === "DISTRIBUTOR") && (
              <>
                <div className="divider">
                  <span className="divider-text">Business Information</span>
                </div>

                <div className="input-group">
                  <label className="input-label">Shop/Business Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Your Business Name"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">GSTIN Number</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="22AAAAA0000A1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Business Address</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Street Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label className="input-label">City</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">State</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Maharashtra"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Pin Code</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="400001"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                  />
                </div>
              </>
            )}

            <button className="submit-btn" onClick={handleSignup} disabled={isLoading}>
              {isLoading ? <span className="loading-spinner"></span> : "Create Account"}
            </button>
          </div>
        )}

        {message && (
          <div className={`message ${message.includes("✓") ? "success" : "error"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;