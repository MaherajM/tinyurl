import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLink } from '../api';

type LinkItem = {
  code: string;
  target: string;
  clicks: number;
  createdAt: string;
  lastClickedAt?: string | null;
};

export default function StatsPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [stats, setStats] = useState<LinkItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setError('No code provided');
      return;
    }

    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLink(code);
        setStats(data);
      } catch (err: any) {
        setError(err?.message ?? 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [code]);


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded shadow p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">
            Link Statistics
          </h2>

          {loading && (
            <div className="text-center py-12 text-gray-600">
              <div className="text-3xl sm:text-4xl mb-3">📊</div>
              <p className="text-sm sm:text-base">Loading statistics...</p>
            </div>
          )}

          {error && (
            <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded text-red-700 mb-4 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {stats && !loading && !error && (
            <>
              <div className="mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded">
                <div className="text-xs sm:text-sm text-gray-600 mb-1">Short Code</div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-blue-600 break-all">
                  {stats.code}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6">
                <div className="p-3 sm:p-4 bg-gray-50 border rounded">
                  <div className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">Target URL</div>
                  <a
                    href={stats.target}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline break-all hover:text-blue-800 text-xs sm:text-sm"
                  >
                    {stats.target}
                  </a>
                </div>

                <div className="p-3 sm:p-4 bg-gray-50 border rounded">
                  <div className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">Total Clicks</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-800">
                    {stats.clicks}
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-gray-50 border rounded">
                  <div className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">Created</div>
                  <div className="text-gray-800 text-xs sm:text-sm">
                    {new Date(stats.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-gray-50 border rounded">
                  <div className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">Last Clicked</div>
                  <div className="text-gray-800 text-xs sm:text-sm">
                    {stats.lastClickedAt
                      ? new Date(stats.lastClickedAt).toLocaleString()
                      : '—'}
                  </div>
                </div>
              </div>

              <div className="mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded">
                <div className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">Short URL</div>
                <div className="font-mono text-green-700 break-all text-xs sm:text-sm">
                  {`${window.location.origin}/r/${stats.code}`}
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-6 pt-4 border-t">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition text-sm sm:text-base"
              onClick={() => navigate('/')}
            >
              ← Back to Dashboard
            </button>
            {stats && (
              <a
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-center text-sm sm:text-base"
                href={`/r/${stats.code}`}
                target="_blank"
                rel="noreferrer"
              >
                Open Redirect →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
