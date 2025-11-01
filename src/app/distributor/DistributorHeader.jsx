'use client';

import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, User, ChevronDown, LogOut, LayoutGrid } from 'lucide-react';

// Color variables (keeping our popular Aqua Blue accent)
const PRIMARY_COLOR_TEXT = 'text-[#00M3B5]'; // Aqua Blue
const PRIMARY_COLOR_BG = 'bg-[#00F3B5]'; 
const PRIMARY_COLOR_RING = 'focus:ring-[#00A3B5]'; 
const HEADER_BG_COLOR = 'bg-blue'; // Clean white background for an elevated feel

const DistributorHeader = ({ onToggle }) => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch user data from local storage
    const loginData = localStorage.getItem('loginData');
    if (loginData) {
      const parsedData = JSON.parse(loginData);
      setUser(parsedData.user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loginData');
    window.location.href = '/UserLogin';
  };

  const toggleUserDropdown = () => setDropdownOpen((s) => !s);

  return (
    <header className="distributor-header">
      <div className="header-content">
        <div className="header-left">
          <button
            onClick={onToggle}
            className="menu-btn"
            aria-label="Toggle Navigation Menu"
          >
            <Menu size={20} />
          </button>

          <span className="brand-name">
            <h1>WholeMart</h1>
          </span>
        </div>

        <div className="header-center">
          <div className="search-input-container">
            <Search className="search-input-icon" size={18} />
            <input
              className="search-input"
              type="text"
              placeholder="Search products, orders, or support..."
              aria-label="Search"
            />
          </div>
        </div>

        <div className="header-right">
          <button
            className="notification-btn"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="notification-badge" />
          </button>

          <div className="user-menu">
            <button
              onClick={toggleUserDropdown}
              className={`user-btn ${dropdownOpen ? 'open' : ''}`}
              aria-expanded={dropdownOpen}
            >
              <div className="user-avatar">
                {mounted && user ? user.username.charAt(0).toUpperCase() : ''}
              </div>
              <span className="user-name">{mounted && user ? user.username : 'User'}</span>
              <ChevronDown size={14} className="chevron-icon" />
            </button>

            {dropdownOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <p>{mounted && user ? user.username : 'Guest User'}</p>
                  <p>Distributor Access</p>
                </div>
                <a href="/profile" className="dropdown-link">
                  <User size={18} /> <span>Profile Settings</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="dropdown-logout"
                >
                  <LogOut size={18} /> <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DistributorHeader;