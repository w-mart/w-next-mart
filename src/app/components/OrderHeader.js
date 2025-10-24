import React from 'react';

const OrderHeader = ({ title, subtitle, stats }) => {
  return (
    <div className="page-header" style={{ background: 'white', color: '#333', padding: '30px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-30%', left: '-30%', width: '160%', height: '160%', background: 'radial-gradient(circle, rgba(0,0,0,0.02) 0%, transparent 60%)', borderRadius: '50%' }}></div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>{title}</h1>
        <p style={{ margin: 0, fontSize: '1.1rem', color: '#7f8c8d' }}>{subtitle}</p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
          {stats.map((stat, index) => (
            <div key={index} style={{ backgroundColor: '#f8f9fa', padding: '10px 18px', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid #e9ecef', color: '#495057' }}>
              <strong>{stat.label}:</strong> {stat.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;
