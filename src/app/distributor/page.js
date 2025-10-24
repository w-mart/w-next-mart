'use client';

const Dashboard = () => {
  return (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h1>Welcome to Distributor Dashboard</h1>
        <p>Your daily overview</p>
      </div>



      <div className="stats-grid">
        <div className="stat-card">
          <h3>Orders</h3>
          <p className="stat-number">12</p>
          <span className="stat-label pending">Pending</span>
        </div>
        <div className="stat-card">
          <h3>Inventory</h3>
          <p className="stat-number">34</p>
          <span className="stat-label low-stock">Low Stock</span>
        </div>
        <div className="stat-card">
          <h3>Deliveries</h3>
          <p className="stat-number">25</p>
          <span className="stat-label in-transit">In Transit</span>
        </div>
        <div className="stat-card">
          <h3>Alerts</h3>
          <p className="stat-number">5</p>
          <span className="stat-label active">Active</span>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <p className="stat-number">$45,230</p>
          <span className="stat-label positive">+12%</span>
        </div>
        <div className="stat-card">
          <h3>Customers</h3>
          <p className="stat-number">1,234</p>
          <span className="stat-label positive">+5%</span>
        </div>
        <div className="stat-card">
          <h3>Returns</h3>
          <p className="stat-number">8</p>
          <span className="stat-label negative">-2%</span>
        </div>
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p className="stat-number">$67,890</p>
          <span className="stat-label positive">+8%</span>
        </div>
      </div>

      <div className="placeholder-sections">
        <div className="section">
          <h2>Your Orders</h2>
          <table className="mini-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#ORD-001</td>
                <td>Pending</td>
                <td>2024-01-15</td>
              </tr>
              <tr>
                <td>#ORD-002</td>
                <td>Shipped</td>
                <td>2024-01-14</td>
              </tr>
              <tr>
                <td>#ORD-003</td>
                <td>Delivered</td>
                <td>2024-01-13</td>
              </tr>
            </tbody>
          </table>
          <a href="/dashboard/orders">View all</a>
        </div>
        <div className="section">
          <h2>Your Inventory</h2>
          <table className="mini-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Expiry</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Product A</td>
                <td>50</td>
                <td>2025-01-01</td>
              </tr>
              <tr>
                <td>Product B</td>
                <td>20</td>
                <td>2025-01-05</td>
              </tr>
              <tr>
                <td>Product C</td>
                <td>5</td>
                <td>2024-12-10</td>
              </tr>
            </tbody>
          </table>
          <a href="/dashboard/inventory">View details</a>
        </div>
        <div className="section">
          <h2>Recent Deliveries</h2>
          <table className="mini-table">
            <thead>
              <tr>
                <th>Delivery ID</th>
                <th>Status</th>
                <th>Carrier</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#DEL-001</td>
                <td>In Transit</td>
                <td>FedEx</td>
              </tr>
              <tr>
                <td>#DEL-002</td>
                <td>Out for Delivery</td>
                <td>UPS</td>
              </tr>
              <tr>
                <td>#DEL-003</td>
                <td>Delivered</td>
                <td>DHL</td>
              </tr>
            </tbody>
          </table>
          <a href="/dashboard/delivery">View deliveries</a>
        </div>
        <div className="section">
          <h2>Alerts</h2>
          <table className="mini-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Low Stock</td>
                <td>Product A stock low</td>
                <td>2024-01-17</td>
              </tr>
              <tr>
                <td>Expiry Alert</td>
                <td>Product C expires soon</td>
                <td>2024-01-16</td>
              </tr>
              <tr>
                <td>New Order</td>
                <td>Order #ORD-005 received</td>
                <td>2024-01-15</td>
              </tr>
            </tbody>
          </table>
          <a href="/dashboard/alerts">View details</a>
        </div>
      </div>

      <div className="activity-timeline">
        <h2>Recent Activity</h2>
        <ul>
          <li>
            <span className="activity-time">10:30 AM</span>
            <span className="activity-desc">Order #ORD-001 placed by Customer A</span>
          </li>
          <li>
            <span className="activity-time">9:45 AM</span>
            <span className="activity-desc">Product B added to inventory</span>
          </li>
          <li>
            <span className="activity-time">8:20 AM</span>
            <span className="activity-desc">Delivery #DEL-002 out for delivery</span>
          </li>
          <li>
            <span className="activity-time">7:15 AM</span>
            <span className="activity-desc">Alert: Low stock for Product C</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
