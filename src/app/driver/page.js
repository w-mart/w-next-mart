'use client';

const Dashboard = () => {
  return (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h1>Welcome to Driver Dashboard</h1>
        <p>Your daily overview</p>
      </div>



      <div className="stats-grid">
        <div className="stat-card">
          <h3>Orders</h3>
          <p className="stat-number">12</p>
          <span className="stat-label pending">Pending</span>
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

    </div>
  );
};

export default Dashboard;
