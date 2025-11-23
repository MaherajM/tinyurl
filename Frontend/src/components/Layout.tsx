import React from 'react';
import { Link, useLocation } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/stats', label: 'Stats' },
    { path: '/healthz', label: 'Health Check' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800">TinyLink</h1>
          </Link>
          <p className="text-xs text-gray-500 mt-1">URL Shortener POC</p>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer info */}
        <div className="absolute bottom-0 w-64 p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            Similar to bit.ly
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        {children}
      </main>
    </div>
  );
}
