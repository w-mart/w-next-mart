'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, Truck, BarChart3, CreditCard, AlertCircle, Plus, Users, Search } from 'lucide-react';

// Function to get menu items based on role
const getMenuItems = (role) => {
  const baseItems = {
    DISTRIBUTOR: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, hasNotification: false },
      { name: 'Orders', path: '/dashboard/orders', icon: ShoppingBag, hasNotification: true },
      { name: 'Inventory', path: '/dashboard/inventory', icon: Package, hasNotification: true },
      { name: 'Add Product', path: '/dashboard/add-product', icon: Plus, hasNotification: false },
      { name: 'Delivery', path: '/dashboard/delivery', icon: Truck, hasNotification: false },
      { name: 'Drivers', path: '/dashboard/drivers', icon: Users, hasNotification: false },
      { name: 'Reports', path: '/dashboard/reports', icon: BarChart3, hasNotification: true },
      { name: 'Payments', path: '/dashboard/payments', icon: CreditCard, hasNotification: false },
      { name: 'Alerts', path: '/dashboard/alerts', icon: AlertCircle, hasNotification: true },
    ],
    RETAILER: [
      { name: 'Dashboard', path: '/retailer', icon: LayoutDashboard, hasNotification: false },
      { name: 'Orders', path: '/retailer/orders', icon: ShoppingBag, hasNotification: true },
      { name: 'Available Products', path: '/retailer/inventory', icon: Package, hasNotification: true },
      { name: 'Add Product', path: '/retailer/add-product', icon: Plus, hasNotification: false },
      { name: 'Delivery', path: '/retailer/delivery', icon: Truck, hasNotification: false },
      { name: 'Find Distributor', path: '/retailer/find-distributor', icon: Search, hasNotification: false },
      { name: 'Reports', path: '/retailer/reports', icon: BarChart3, hasNotification: true },
      { name: 'Payments', path: '/retailer/payments', icon: CreditCard, hasNotification: false },
      { name: 'Alerts', path: '/retailer/alerts', icon: AlertCircle, hasNotification: true },
    ],
    DRIVER: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, hasNotification: false },
      { name: 'Orders', path: '/dashboard/orders', icon: ShoppingBag, hasNotification: true },
      { name: 'Delivery', path: '/dashboard/delivery', icon: Truck, hasNotification: false },
      { name: 'Reports', path: '/dashboard/reports', icon: BarChart3, hasNotification: true },
      { name: 'Alerts', path: '/dashboard/alerts', icon: AlertCircle, hasNotification: true },
    ],
    SUPER_ADMIN: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, hasNotification: false },
      { name: 'Orders', path: '/dashboard/orders', icon: ShoppingBag, hasNotification: true },
      { name: 'Inventory', path: '/dashboard/inventory', icon: Package, hasNotification: true },
      { name: 'Add Product', path: '/dashboard/add-product', icon: Plus, hasNotification: false },
      { name: 'Delivery', path: '/dashboard/delivery', icon: Truck, hasNotification: false },
      { name: 'Drivers', path: '/dashboard/drivers', icon: Users, hasNotification: false },
      { name: 'Reports', path: '/dashboard/reports', icon: BarChart3, hasNotification: true },
      { name: 'Payments', path: '/dashboard/payments', icon: CreditCard, hasNotification: false },
      { name: 'Alerts', path: '/dashboard/alerts', icon: AlertCircle, hasNotification: true },
    ],
  };

  return baseItems[role] || baseItems['DISTRIBUTOR']; // Default to DISTRIBUTOR if role not found
};

const Sidebar = ({ isOpen }) => {
  const pathname = usePathname();
  const [menuItems, setMenuItems] = useState([]);
  const [userRole, setUserRole] = useState('RETAILER');

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'RETAILER';
    setUserRole(role);
    setMenuItems(getMenuItems(role));
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
