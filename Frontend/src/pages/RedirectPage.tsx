import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRedirectTarget } from "../api";

/**
 * RedirectPage - Handles short link redirects
 *
 * Flow:
 * 1. Calls backend API to get redirect URL
 * 2. If found: Redirects to target URL (increments click count)
 * 3. If not found: Shows error message with option to go to dashboard
 *
 * Route: /r/:code or /:code
 */
export default function RedirectPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  // Use ref to track if redirect has been attempted
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!code) {
      setError("No short code provided");
      setLoading(false);
      return;
    }

    // Prevent duplicate executions (React Strict Mode causes double render in dev)
    if (hasRedirected.current) {
      console.log("Redirect already attempted, skipping...");
      return;
    }

    const performRedirect = async () => {
      // Mark as redirected before making API call
      hasRedirected.current = true;

      try {
        console.log("Checking link with code:", code);

        // Call API to get target URL - increments click count ONCE
        const targetUrl = await getRedirectTarget(code);

        console.log("Link found, redirecting to:", targetUrl);
        setRedirectUrl(targetUrl);

        // Redirect to target URL
        window.location.href = targetUrl;
      } catch (err: any) {
        console.error("Redirect error:", err);
        setError(err?.message ?? "Failed to load redirect URL");
        setLoading(false);
      }
    };

    performRedirect();
  }, [code]);

  // Loading state
  if (loading && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Redirecting...
          </h2>
          <p className="text-gray-600 mb-4">Taking you to your destination</p>
          {redirectUrl && (
            <p className="text-sm text-gray-500 font-mono bg-white px-4 py-2 rounded inline-block">
              {redirectUrl}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="text-6xl mb-4">=L</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Link Not Found
          </h1>
          <p className="text-gray-600 mb-2">
            The short link{" "}
            <span className="font-mono font-semibold text-blue-600">
              /{code}
            </span>{" "}
            does not exist.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            It may have been deleted or never created.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Try Again
            </button>
          </div>

          {/* Error details for debugging */}
          <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded text-left">
            <p className="text-xs text-red-700">
              <strong>Error:</strong> {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
