import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const StatsPage = lazy(() => import('../pages/StatsPage'));
const HealthCheckPage = lazy(() => import('../pages/HealthCheckPage'));
const RedirectPage = lazy(() => import('../pages/RedirectPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-gray-600">Loading...</div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/r/:code" element={<RedirectPage />} />

        <Route path="/" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/stats" element={<Layout><StatsPage /></Layout>} />
        <Route path="/stats/:code" element={<Layout><StatsPage /></Layout>} />
        <Route path="/healthz" element={<Layout><HealthCheckPage /></Layout>} />

        <Route path="/:code" element={<RedirectPage />} />

        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </Suspense>
  );
}
