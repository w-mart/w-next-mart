import React from 'react';
import PurchaseProductsClient from './PurchaseProductsClient';

export default function PurchaseProductsPage() {
  return (
    <React.Suspense fallback={<div className="page-content-tile"><p>Loading...</p></div>}>
      <PurchaseProductsClient />
    </React.Suspense>
  );
}
