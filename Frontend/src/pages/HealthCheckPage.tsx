import { useEffect, useState } from 'react';
import { getHealthCheck } from '../api';

type HealthStatus = {
  status: string;
  timestamp: string;
  uptime?: number;
  message?: string;
};

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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold mb-2">Health Check</h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Monitor backend API status and connectivity
              </p>
            </div>
          </div>

          <div className={`border rounded-lg p-4 sm:p-6 ${getStatusBgColor()}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl sm:text-3xl">
                {error ? '❌' : health?.status === 'ok' || health?.status === 'healthy' ? '✅' : '⚠️'}
              </div>
              <div>
                <h2 className={`text-lg sm:text-xl font-semibold ${getStatusColor()}`}>
                  {error ? 'Unhealthy' : health?.status?.toUpperCase() || 'Unknown'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  {lastChecked
                    ? `Last checked: ${lastChecked.toLocaleTimeString()}`
                    : 'Not checked yet'}
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-3 p-3 bg-white rounded border border-red-300">
                <p className="text-xs sm:text-sm text-red-700">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}

            {health && !error && (
              <div className="mt-3 space-y-2">
                {health.message && (
                  <div className="text-xs sm:text-sm text-gray-700">
                    <strong>Message:</strong> {health.message}
                  </div>
                )}
                {health.timestamp && (
                  <div className="text-xs sm:text-sm text-gray-700">
                    <strong>Server Time:</strong> {new Date(health.timestamp).toLocaleString()}
                  </div>
                )}
                {health.uptime !== undefined && (
                  <div className="text-xs sm:text-sm text-gray-700">
                    <strong>Uptime:</strong> {Math.floor(health.uptime / 60)} minutes
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">API Endpoint</h3>
            <p className="text-xs sm:text-sm text-blue-800 font-mono break-all">
              {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/healthz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
