import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLinks, createLink, deleteLink } from '../api';
import LinkForm from '../components/LinkForm';
import LinkList from '../components/LinkList';

export type LinkItem = {
  code: string;
  target: string;
  clicks: number;
  createdAt: string;
  lastClickedAt?: string | null;
};

export type LinkListResponse = {
  count: number;
  links: LinkItem[];
};

export default function DashboardPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLinks();
      setLinks(data.links);
      setTotalCount(data.count);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleCreate = async (target: string, code?: string) => {
    setError(null);
    try {
      const created = await createLink({ target, code });
      setLinks((s) => [created, ...s]);
      return created;
    } catch (err: any) {
      setError(err?.message ?? 'Create failed');
      throw err;
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm(`Delete short link "${code}"?`)) return;
    try {
      await deleteLink(code);
      setLinks((s) => s.filter((l) => l.code !== code));
    } catch (err: any) {
      alert(err?.message ?? 'Delete failed');
    }
  };

  const openStats = (code: string) => {
    navigate(`/stats/${code}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded p-6">
          <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
          <p className="text-sm text-gray-600 mb-6">
            Create, manage, and track your shortened URLs
          </p>

          {/* Link Creation Form */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h2 className="text-lg font-medium mb-3">Create New Link</h2>
            <LinkForm onCreate={handleCreate} />
          </div>

          {/* Links List */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">Your Links</h2>
              {totalCount > 0 && (
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  Total: {totalCount}
                </span>
              )}
            </div>
            {loading && (
              <div className="text-center py-8 text-gray-600">
                Loading links...
              </div>
            )}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 mb-4">
                {error}
              </div>
            )}
            {!loading && !error && (
              <LinkList
                links={links}
                onDelete={handleDelete}
                onViewStats={openStats}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
