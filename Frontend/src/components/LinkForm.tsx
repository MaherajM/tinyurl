import React, { useState } from 'react';

type Props = {
  onCreate: (target: string, code?: string) => Promise<any>;
};

export default function LinkForm({ onCreate }: Props) {
  const [target, setTarget] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!target.trim()) {
      setMsg('Target URL is required');
      return;
    }
    setLoading(true);
    try {
      const created = await onCreate(target.trim(), code.trim() || undefined);
      setMsg(`✅ Created: ${created.code}`);
      setTarget('');
      setCode('');
    } catch (err: any) {
      setMsg(`❌ ${err?.message ?? 'Create failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target URL
        </label>
        <input
          type="url"
          placeholder="https://example.com/very/long/url"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full rounded border border-gray-300 shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Custom code (optional)
        </label>
        <input
          placeholder="6-8 chars, letters and numbers"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full rounded border border-gray-300 shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          maxLength={8}
        />
        <p className="text-xs text-gray-500 mt-1">
          If left empty, backend will generate a code. Must match /^[A-Za-z0-9]{'{6,8}'}$/.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Link'}
        </button>
        {msg && <div className="text-sm">{msg}</div>}
      </div>
    </form>
  );
}
