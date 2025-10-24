'use client';

import { useState, useEffect } from 'react';

const Header = () => {
  const [searchCategory, setSearchCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loginData = sessionStorage.getItem('loginData');
    if (loginData) {
      const parsedData = JSON.parse(loginData);
      setUser(parsedData.user);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('loginData');
    setIsLoggedIn(false);
    window.location.href = '/UserLogin';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search:', searchCategory, searchQuery);
  };

  if (!isLoggedIn) {
    return (
      <header className="login-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">📦</span>
            <span className="logo-text">Wholemart</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">📦</span>
          <span className="logo-text">Wholemart</span>
        </div>
      </div>

      <div className="header-center">
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="search-category"
          >
            <option value="All">All</option>
            <option value="Orders">Orders</option>
            <option value="Inventory">Inventory</option>
            <option value="Products">Products</option>
          </select>
          <input
            type="text"
            placeholder="Search DistributeHub..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">🔍</button>
        </form>
      </div>

      <div className="header-right">
        <div className="notifications">
          <button className="notification-btn">
            🔔
            <span className="badge">17</span>
          </button>
        </div>

        <div className="profile">
          <button onClick={() => setProfileOpen(!profileOpen)} className="profile-btn">
            <span className="user-initial">{user?.username?.charAt(0)?.toUpperCase() || 'U'}</span>
          </button>
          {profileOpen && (
            <div className="profile-dropdown">
              <a href="/dashboard/profile">Profile</a>
              <a href="/dashboard/settings">Settings</a>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
