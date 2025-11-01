import React from 'react';
import SearchResultsClient from './SearchResultsClient';

export default function SearchResultsPage() {
  return (
    <React.Suspense fallback={<div className="page-content-tile"><p>Loading...</p></div>}>
      <SearchResultsClient />
    </React.Suspense>
  );
}
