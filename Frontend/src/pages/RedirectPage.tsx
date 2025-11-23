import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

  useEffect(() => {
    if (!code) {
      setError("No short code provided");
      setLoading(false);
      return;
    }

    const performRedirect = async () => {
      setLoading(true);
      setError(null);

      try {
        const BASE =
          import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";
        console.log("Redirecting using base URL:", BASE);

        const response = await fetch(`${BASE}/api/links/redirect/${code}`, {
          method: "GET",
          redirect: "manual", // Don't auto-follow redirects
        });

        if (
          response.type === "opaqueredirect" ||
          response.status === 302 ||
          response.status === 301
        ) {
          // Backend is redirecting - get the location header
          const location = response.headers.get("Location");
          if (location) {
            setRedirectUrl(location);
            setTimeout(() => {
              window.location.href = location;
            }, 500);
            return;
          }
        }

        // Handle JSON response (alternative approach)
        if (response.ok) {
          const data = await response.json();
          if (data.target || data.url) {
            const targetUrl = data.target || data.url;
            setRedirectUrl(targetUrl);
            setTimeout(() => {
              window.location.href = targetUrl;
            }, 500);
            return;
          }
        }

        // If we get here, the link wasn't found
        if (response.status === 404) {
          setError("Short link not found");
        } else {
          setError("Failed to redirect");
        }
        setLoading(false);
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
