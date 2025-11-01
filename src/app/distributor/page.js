"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
	Package,
	Truck,
	UserCheck,
	DollarSign,
	PlusCircle,
	FileText,
	Users,
	RefreshCw,
} from "lucide-react";

const DistributorDashboard = () => {
	const [username, setUsername] = useState("");
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState('');

	const handleAddOrder = () => {
		//router.push('/distributor/orders/add');
	};

	useEffect(() => {
		const userInfo = localStorage.getItem('username');
		if (userInfo) {
			const user = userInfo;//JSON.parse(userInfo);
			setUsername(user);
		} else {
			setUsername('Guest');
		}
	}, []);

	// Mock static data
	const [orders] = useState([
		{ id: "#ORD-001", orderId: "ORD-001", status: "Placed", amount: 120.5, date: "2024-10-01" },
		{ id: "#ORD-002", orderId: "ORD-002", status: "Accepted", amount: 75.0, date: "2024-10-02" },
		{ id: "#ORD-003", orderId: "ORD-003", status: "Shipped", amount: 230.25, date: "2024-10-03" },
		{ id: "#ORD-004", orderId: "ORD-004", status: "Delivered", amount: 45.0, date: "2024-10-04" },
		{ id: "#ORD-005", orderId: "ORD-005", status: "Placed", amount: 18.99, date: "2024-10-05" },
	]);

	const [payments] = useState([
		{ id: "#PAY-001", amount: 120.5, date: "2024-10-01", status: "Completed", method: "Card" },
		{ id: "#PAY-002", amount: 75.0, date: "2024-10-02", status: "Pending", method: "Bank" },
		{ id: "#PAY-003", amount: 230.25, date: "2024-10-03", status: "Completed", method: "UPI" },
	]);

	const [products] = useState([
		{ id: "#PRD-001", name: "Organic Apples", qty: 120 },
		{ id: "#PRD-002", name: "Wireless Headphones", qty: 8 },
		{ id: "#PRD-003", name: "LED Desk Lamp", qty: 25 },
	]);

	const [drivers] = useState([
		{ id: "DRV-01", name: "A. Kumar", status: "Online" },
		{ id: "DRV-02", name: "S. Patel", status: "Delivering" },
		{ id: "DRV-03", name: "R. Singh", status: "Offline" },
	]);

	const totalOrders = orders.length;
	const pendingOrders = orders.filter((o) => o.status.toLowerCase() === "placed").length;
	const acceptedOrders = orders.filter((o) => o.status.toLowerCase() === "accepted").length;
	const totalRevenue = useMemo(() => orders.reduce((s, o) => s + (o.amount || 0), 0), [orders]);

	// Small refresh UX demo
	const [refreshing, setRefreshing] = useState(false);
	const handleRefresh = () => {
		setRefreshing(true);
		setTimeout(() => setRefreshing(false), 600);
	};

	useEffect(() => {
		// small effect placeholder — could fetch real metrics here
	}, []);

	return (
		<div className="page-content-tile">
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<div>
					<h2 style={{ margin: 0 }}>Welcome, {username}</h2>
					<p style={{ margin: 0, color: "#64748b" }}>Overview of orders, payments, inventory and drivers</p>
				</div>
				<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
					<button className="add-btn" onClick={handleRefresh} aria-live="polite">
						<RefreshCw size={16} /> {refreshing ? "Refreshing…" : "Refresh"}
					</button>
					<Link href="/distributor/orders">
						<button className="add-btn"><FileText size={16} /> View Orders</button>
					</Link>
				</div>
			</div>

			<section className="summary-cards">
				<div className="stat-card" >
					<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
						<Package size={48} />
						<div>
							<h3>Total Orders</h3>
							<div className="stat-number">{orders.length}</div>
						</div>
					</div>
				</div>

				<div className="stat-card" >
					<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
						<Truck size={48} />
						<div>
							<h3>Pending</h3>
							<div className="stat-number">{orders.filter(o => o.status === 'placed').length}</div>
						</div>
					</div>
				</div>

				<div className="stat-card" >
					<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
						<UserCheck size={48} />
						<div>
							<h3>Accepted</h3>
							<div className="stat-number">{orders.filter(o => o.status === 'accepted').length}</div>
						</div>
					</div>
				</div>

				<div className="stat-card" >
					<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
						<DollarSign size={48} />
						<div>
							<h3>Revenue</h3>
							<div className="stat-number">${orders.reduce((total, o) => total + o.quantity * 10, 0)}</div>
						</div>
					</div>
				</div>
			</section>

			{/* --- FILTERS --- */}
			<section className="filters">
				<div className="filter-left">
					<input
						type="text"
						placeholder="Search by order ID, product, or status..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>

					<select value={status} onChange={(e) => setStatus(e.target.value)}>
						<option value="">All Statuses</option>
						<option value="placed">Placed</option>
						<option value="accepted">Accepted</option>
						<option value="shipped">Shipped</option>
						<option value="delivered">Delivered</option>
					</select>
				</div>

				<button className="add-product-btn" onClick={handleAddOrder}>
					<PlusCircle size={18} /> Search Order
				</button>
			</section>

			<br />
<div className="reports-section">
			<div className="report-card">
          <h4>Inventory Report</h4>
          <div className="report-stats">
            <div className="stat">
              <span className="label">Total Items:</span>
              <span className="value">175</span>
            </div>
            <div className="stat">
              <span className="label">Low Stock Items:</span>
              <span className="value">3</span>
            </div>
            <div className="stat">
              <span className="label">Expired Items:</span>
              <span className="value">0</span>
            </div>
          </div>
          <div className="report-chart">
            <div className="chart-bar total-items" style={{ width: '100%' }}></div>
            <div className="chart-bar low-stock" style={{ width: '1.7%' }}></div>
            <div className="chart-bar expired" style={{ width: '0%' }}></div>
          </div>
          <div className="chart-labels">
            <span>Total Items</span>
            <span>Low Stock</span>
            <span>Expired</span>
          </div>
        </div>
        <div className="report-card">
          <h4>Orders Report</h4>
          <div className="report-stats">
            <div className="stat">
              <span className="label">Total Orders:</span>
              <span className="value">45</span>
            </div>
            <div className="stat">
              <span className="label">Pending:</span>
              <span className="value">5</span>
            </div>
            <div className="stat">
              <span className="label">Delivered:</span>
              <span className="value">40</span>
            </div>
          </div>
          <div className="report-chart">
            <div className="chart-bar total-orders" style={{ width: '100%' }}></div>
            <div className="chart-bar pending" style={{ width: '11.1%' }}></div>
            <div className="chart-bar delivered" style={{ width: '88.9%' }}></div>
          </div>
          <div className="chart-labels">
            <span>Total</span>
            <span>Pending</span>
            <span>Delivered</span>
          </div>
        </div>
		</div>

			<section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginTop: 20 }}>
				<div>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
						<h3 style={{ margin: 0 }}>Recent Orders</h3>
						<div style={{ display: "flex", gap: 8 }}>
							<Link href="/distributor/orders"><button className="add-btn">View all</button></Link>
							<Link href="/distributor/orders/add"><button className="add-btn"><PlusCircle size={14} /> New</button></Link>
						</div>
					</div>

					<div className="table-container">
						<table className="orders-table" style={{ width: "100%" }}>
							<thead>
								<tr>
									<th>S.No</th>
									<th>Order ID</th>
									<th>Status</th>
									<th>Amount</th>
									<th>Date</th>
								</tr>
							</thead>
							<tbody>
								{orders.map((o, i) => (
									<tr key={o.id}>
										<td style={{ textAlign: "center" }}>{i + 1}</td>
										<td>{o.id}</td>
										<td><span className={`status ${o.status.toLowerCase()}`}>{o.status}</span></td>
										<td>${(o.amount || 0).toFixed(2)}</td>
										<td>{o.date}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<aside>
					<div style={{ marginTop: 20 }}>
						<h4 style={{ marginBottom: 8 }}>Recent Payments</h4>
						<div style={{ display: "grid", gap: 8 }}>
							{payments.map((p) => (
								<div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, background: "#fff", borderRadius: 8, border: "1px solid rgba(0,0,0,0.04)" }}>
									<div>
										<div style={{ fontWeight: 700 }}>{p.id}</div>
										<div style={{ color: "#64748b", fontSize: 12 }}>{p.date} • {p.method}</div>
									</div>
									<div style={{ fontWeight: 800 }}>${p.amount.toFixed(2)}</div>
								</div>
							))}
						</div>
					</div>

					<div style={{ marginTop: 20 }}>
						<h4 style={{ marginBottom: 8 }}>Drivers</h4>
						<div style={{ display: "grid", gap: 8 }}>
							{drivers.map((d) => (
								<div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, background: "#fff", borderRadius: 8, border: "1px solid rgba(0,0,0,0.04)" }}>
									<div>{d.name}</div>
									<div style={{ color: d.status === "Online" ? "#10b981" : d.status === "Delivering" ? "#f59e0b" : "#94a3b8" }}>{d.status}</div>
								</div>
							))}
						</div>
					</div>
				</aside>
			</section>
		</div>
	);
};

export default DistributorDashboard;
