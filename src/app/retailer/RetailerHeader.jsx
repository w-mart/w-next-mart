'use client';

import React, { useState, useEffect } from "react";
import "./RetailerLayout.css";
import { Bell, Menu, Search, ChevronDown, LogOut, User } from "lucide-react";

const RetailerHeader = ({ onToggle }) => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const loginData = sessionStorage.getItem('loginData');
    if (loginData) {
      const parsedData = JSON.parse(loginData);
      setUser(parsedData.user);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('loginData');
    window.location.href = '/UserLogin';
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="topbar">
      <div className="header-left">
        <button className="menu-btn" onClick={onToggle}>
          <Menu size={22} />
        </button>
        <div className="logo">
          <span className="logo-text">WholeMart</span>
        </div>
        {user && <div className="welcome-message">Welcome, {user.username}</div>}
      </div>
      <div className="header-center">
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Search products, orders..." />
        </div>
      </div>
      <div className="header-actions">
        <button className="bell-btn">
          <Bell size={22} />
          <span className="notif-dot"></span>
        </button>
        <div className="user-dropdown">
          <button className="user-btn" onClick={toggleDropdown}>
            <div className="user-icon">{user ? user.username.charAt(0).toUpperCase() : 'U'}</div>
            <ChevronDown size={16} />
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item">
                <User size={16} />
                Profile
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default RetailerHeader;
