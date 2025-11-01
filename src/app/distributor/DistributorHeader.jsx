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

  useEffect(() => {
    // Simulate fetching user data from session storage
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

  const toggleUserDropdown = () => setDropdownOpen((s) => !s);

  return (
    // Header: White background, subtle shadow, sticky top
    <header className={`dashboard-header sticky top-0 z-40 ${HEADER_BG_COLOR} border-b border-gray-100 shadow-sm`}>
      <div className="flex items-center justify-between gap-6 px-6 py-3.5"> 
        
        {/* --- Left Section: Menu Toggle & Brand --- */}
        <div className="flex items-center gap-4"> {/* Reduced gap from 6 to 4 to match image's density */}
          {/* Menu Button: Rounded, clean hover state */}
          <button
            onClick={onToggle}
            className="distributor-header-btn p-2 text-gray-700 rounded-md hover:bg-gray-100"
            aria-label="Toggle Navigation Menu"
          >
            <Menu size={20} />
          </button>

          {/* WholeMart Brand Name: More impactful font style */}
          <span className={`text-xl font-bold text-gray-900 tracking-tight`}>
            <h1 className={PRIMARY_COLOR_TEXT}>WholeMart</h1>
          </span>
        </div>

        {/* --- Center Section: NEW Search Bar --- */}
        {/* Added a modern search bar to fill the central space, which was empty in the image */}
        <div className="search-input-container">
          <Search className="search-input-icon" size={18} />
          <input
            className="search-input"
            type="text"
            placeholder="Search products, orders, or support..."
            aria-label="Search"
          />
        </div>

        {/* --- Right Section: Notifications & User Menu --- */}
        <div className="flex items-center gap-3">
          
          {/* Notifications Icon: Clean, rounded button with badge */}
          <button
            className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white" />
          </button>

          {/* User Profile Icon/Dropdown: Added for complete user functionality */}
          <div className="relative">
            <button
              onClick={toggleUserDropdown}
              className={`distributor-header-btn flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 ${PRIMARY_COLOR_RING}`}
              aria-expanded={dropdownOpen}
            >
              {/* User Avatar: Matches brand accent */}
              <div className={`w-8 h-8 ${PRIMARY_COLOR_BG} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                {user ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              {/* Username (optional, hidden on smaller screens) */}
              <span className="text-sm font-medium text-gray-800 hidden lg:inline-block">{user ? user.username : 'User'}</span>
              {/* Chevron icon for dropdown indication */}
              <ChevronDown size={14} className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : 'rotate-0'} hidden lg:inline-block`} />
            </button>

            {/* Dropdown Content */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 shadow-xl rounded-lg py-1 z-50 transition ease-out duration-100 transform opacity-100 scale-100">
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user ? user.username : 'Guest User'}</p>
                  <p className="text-xs font-normal text-gray-500">Distributor Access</p>
                </div>
                <a href="/profile" className={`flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#F0FAFB] ${PRIMARY_COLOR_TEXT} transition-colors cursor-pointer`}>
                  <User size={18} /> <span>Profile Settings</span>
                </a>
                <div 
                  onClick={handleLogout} 
                  className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-t border-gray-100 mt-1"
                >
                  <LogOut size={18} /> <span>Sign Out</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DistributorHeader;