import React from "react";
import type { LinkItem } from "../pages/DashboardPage";

type Props = {
  links: LinkItem[];
  onDelete: (code: string) => void;
  onViewStats: (code: string) => void;
};

export default function LinkList({ links, onDelete, onViewStats }: Props) {
  if (!links?.length) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded border border-dashed">
        No links yet. Create one above to get started!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {links?.map((l) => (
        <div
          key={l.code}
          className="flex items-center justify-between gap-4 border rounded-lg p-4 bg-white hover:shadow-md transition"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <a
                className="font-mono text-sm font-semibold text-blue-600 hover:text-blue-800 underline"
                href={`/r/${l.code}`}
                target="_blank"
                rel="noreferrer"
                title="Open short link (will redirect to target and track clicks)"
              >
                /{l.code}
              </a>
              <div className="text-sm text-gray-700 truncate" title={l.target}>
                → {l.target}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{l.clicks} clicks</span>
              <span>{new Date(l.createdAt).toLocaleDateString()}</span>
              {l.lastClickedAt && (
                <span>
                  Last: {new Date(l.lastClickedAt).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium transition"
              onClick={() => onViewStats(l.code)}
              title="View detailed statistics"
            >
              Stats
            </button>
            <button
              className="px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium transition"
              onClick={() => onDelete(l.code)}
              title="Delete this link"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
