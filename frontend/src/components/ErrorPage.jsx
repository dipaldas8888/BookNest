import React from "react";
import { useRouteError, Link } from "react-router-dom";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

const ErrorPage = () => {
  const error = useRouteError();
  console.error("Application Error captured by ErrorBoundary:", error);

  return (
    <div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center p-6 font-primary">
      <div className="bg-white rounded-3xl border border-gray-150 shadow-xl max-w-lg w-full p-8 text-center space-y-6">
        
        {/* Animated Error Icon */}
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Messaging */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Oops! Something went wrong</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            An unexpected application error occurred. Our team has been notified.
          </p>
        </div>

        {/* Collapsible Error Debug Details */}
        {error && (
          <div className="text-left bg-gray-50 border border-gray-150 rounded-2xl p-4">
            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">Error Information</p>
            <p className="text-xs font-mono text-red-650 break-words font-semibold">
              {error.statusText || error.message || "Unknown error details"}
            </p>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1a3a2a] hover:bg-[#254f3b] text-white font-bold py-3 px-6 rounded-xl transition text-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Page
          </button>
          
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition text-sm"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
