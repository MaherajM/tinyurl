import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';

// Lazy load pages for better performance
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const StatsPage = lazy(() => import('../pages/StatsPage'));
const HealthCheckPage = lazy(() => import('../pages/HealthCheckPage'));
const RedirectPage = lazy(() => import('../pages/RedirectPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

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
        {/* Redirect routes WITHOUT layout (clean redirect experience) */}
        <Route path="/r/:code" element={<RedirectPage />} />

        {/* Routes with Layout */}
        <Route path="/" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/stats" element={<Layout><StatsPage /></Layout>} />
        <Route path="/stats/:code" element={<Layout><StatsPage /></Layout>} />
        <Route path="/healthz" element={<Layout><HealthCheckPage /></Layout>} />

        {/* Short code redirect - should come after specific routes */}
        <Route path="/:code" element={<RedirectPage />} />

        {/* 404 page with layout */}
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </Suspense>
  );
}
