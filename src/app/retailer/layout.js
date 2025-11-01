'use client';

import React, { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import RetailerHeader from './RetailerHeader';

export default function RetailerLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // useEffect(() => {
  //   const loginData = sessionStorage.getItem('loginData');
  //   if (!loginData && pathname.startsWith('/retailer')) {
  //     router.push('/UserLogin');
  //   }
  // }, [pathname, router]);

  return (
    <div className="dashboard-container">
      <RetailerHeader onToggle={toggleSidebar} />
      <div className="content-wrapper">
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={toggleSidebar} />
        )}
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <section className="content-area">
            <div className="content-box">
              {children}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
