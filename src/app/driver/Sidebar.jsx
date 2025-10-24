'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Truck, BarChart3, AlertCircle } from 'lucide-react';

// Function to get menu items for driver
const getDriverMenuItems = () => {
  return [
    { name: 'Dashboard', path: '/driver', icon: LayoutDashboard, hasNotification: false },
    { name: 'Orders', path: '/driver/orders', icon: ShoppingBag, hasNotification: true },
    { name: 'Delivery', path: '/driver/delivery', icon: Truck, hasNotification: false },
    { name: 'Reports', path: '/driver/reports', icon: BarChart3, hasNotification: true },
    { name: 'Alerts', path: '/driver/alerts', icon: AlertCircle, hasNotification: true },
  ];
};

const Sidebar = ({ isOpen }) => {
  const pathname = usePathname();
  const [menuItems, setMenuItems] = useState([]);
  const [userRole, setUserRole] = useState('DRIVER');

  useEffect(() => {
    setMenuItems(getDriverMenuItems());
    setUserRole('DRIVER');
  }, []);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      {/* Menu */}
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <li key={item.name} className={isActive ? 'active' : ''}>
                <a href={item.path}>
                  <Icon size={20} />
                  <span>{item.name}</span>
                  {item.hasNotification && <span className="menu-dot"></span>}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="sidebar-user">
        <div className="user-avatar">U</div>
        <div className="user-info">
          <span className="user-name">User Name</span>
          <span className="user-role">{userRole.replace('_', ' ')}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
