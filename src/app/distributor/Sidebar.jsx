'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Truck, BarChart3,Package, Plus,Users,CreditCard,AlertCircle } from 'lucide-react';

// Function to get menu items for driver
const getDISTRIBUTORMenuItems = () => {
  return [
    { name: 'Dashboard', path: '/distributor', icon: LayoutDashboard, hasNotification: false },
      { name: 'Orders', path: '/distributor/orders', icon: ShoppingBag, hasNotification: true },
      { name: 'Inventory', path: '/distributor/inventory', icon: Package, hasNotification: true },
      { name: 'Add Product', path: '/distributor/add-product', icon: Plus, hasNotification: false },
      { name: 'Delivery', path: '/distributor/delivery', icon: Truck, hasNotification: false },
      { name: 'Drivers', path: '/distributor/drivers', icon: Users, hasNotification: false },
      { name: 'Reports', path: '/distributor/reports', icon: BarChart3, hasNotification: true },
      { name: 'Payments', path: '/distributor/payments', icon: CreditCard, hasNotification: false },
      { name: 'Alerts', path: '/distributor/alerts', icon: AlertCircle, hasNotification: true },
    ];
};

const Sidebar = ({ isOpen }) => {
  const pathname = usePathname();
  const [menuItems, setMenuItems] = useState([]);
  const [userRole, setUserRole] = useState('DISTRIBUTOR');

  useEffect(() => {
    setMenuItems(getDISTRIBUTORMenuItems());
    setUserRole('DISTRIBUTOR');
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
