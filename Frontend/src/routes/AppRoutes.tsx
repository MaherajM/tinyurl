import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-gray-600">Loading...</div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<>Welcome to Dashboard</>} />
      </Routes>
    </Suspense>
  );
}
