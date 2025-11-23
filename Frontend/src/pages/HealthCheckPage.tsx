import React, { useEffect, useState } from 'react';
import { getHealthCheck } from '../api';

type HealthStatus = {
  status: string;
  timestamp: string;
  uptime?: number;
  message?: string;
};

/**
 * HealthCheckPage - System health monitoring
 *
 * Displays backend health status and connectivity
 */
export default function HealthCheckPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHealthCheck();
      setHealth(data);
      setLastChecked(new Date());
    } catch (err: any) {
      setError(err?.message ?? 'Health check failed');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusColor = () => {
    if (error) return 'text-red-600';
    if (health?.status === 'ok' || health?.status === 'healthy') return 'text-green-600';
    return 'text-yellow-600';
  };

  const getStatusBgColor = () => {
    if (error) return 'bg-red-50 border-red-200';
    if (health?.status === 'ok' || health?.status === 'healthy') return 'bg-green-50 border-green-200';
    return 'bg-yellow-50 border-yellow-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-2">Health Check</h1>
              <p className="text-sm text-gray-600">
                Monitor backend API status and connectivity
              </p>
            </div>
            {/* <button
              onClick={checkHealth}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Checking...' : 'Refresh'}
            </button> */}
          </div>

          {/* Status Card */}
          <div className={`border rounded-lg p-6 ${getStatusBgColor()}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">
                {error ? '❌' : health?.status === 'ok' || health?.status === 'healthy' ? '✅' : '⚠️'}
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${getStatusColor()}`}>
                  {error ? 'Unhealthy' : health?.status?.toUpperCase() || 'Unknown'}
                </h2>
                <p className="text-sm text-gray-600">
                  {lastChecked
                    ? `Last checked: ${lastChecked.toLocaleTimeString()}`
                    : 'Not checked yet'}
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-3 p-3 bg-white rounded border border-red-300">
                <p className="text-sm text-red-700">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}

            {health && !error && (
              <div className="mt-3 space-y-2">
                {health.message && (
                  <div className="text-sm text-gray-700">
                    <strong>Message:</strong> {health.message}
                  </div>
                )}
                {health.timestamp && (
                  <div className="text-sm text-gray-700">
                    <strong>Server Time:</strong> {new Date(health.timestamp).toLocaleString()}
                  </div>
                )}
                {health.uptime !== undefined && (
                  <div className="text-sm text-gray-700">
                    <strong>Uptime:</strong> {Math.floor(health.uptime / 60)} minutes
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">API Endpoint</h3>
            <p className="text-sm text-blue-800 font-mono">
              {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/healthz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
