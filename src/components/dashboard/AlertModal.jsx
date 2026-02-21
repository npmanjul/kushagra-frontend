"use client";
import React from "react";
import { logout } from "@/utils/api";

export default function AlertModal({ isOpen, title, message }) {
  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/70 backdrop-blur-lg px-4">
      <div className="relative w-full max-w-6xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden animate-slideIn max-h-[95vh] overflow-y-auto">
        {/* Horizontal Layout */}
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Visual Impact */}
          <div className="relative md:w-2/5 bg-gradient-to-br from-red-500 via-red-600 to-rose-700 p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center overflow-hidden min-h-[250px] md:min-h-0">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl animate-blob" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-300 rounded-full blur-3xl animate-blob animation-delay-2000" />
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-300 rounded-full blur-3xl animate-blob animation-delay-4000" />
            </div>

            {/* Shield Icon with Glow */}
            <div className="relative z-10 mb-4 md:mb-6">
              <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl scale-150 animate-pulse-slow" />
              <div className="relative bg-white/20 backdrop-blur-md p-5 sm:p-6 md:p-8 rounded-full border-2 sm:border-4 border-white/40 shadow-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 text-white drop-shadow-2xl"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 2L3 7v5c0 5.25 3.75 10.125 9 11.25C17.25 22.125 21 17.25 21 12V7l-9-5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3m0 3h.01"
                  />
                </svg>
              </div>
            </div>

            {/* Text on Left Side */}
            <div className="relative z-10 text-center px-4">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 md:mb-3 tracking-tight drop-shadow-lg">
                Access Restricted
              </h3>
              <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-xs">
                Your account has been temporarily blocked by the administrator
              </p>
            </div>

          </div>

          {/* Right Side - Content */}
          <div className="md:w-3/5 p-6 sm:p-8 md:p-12">
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 md:mb-3 tracking-tight">
                {title || "Account Blocked"}
              </h2>
              <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-gradient-to-r from-red-500 to-orange-400 rounded-full" />
            </div>

            {/* Warning Message */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-4 sm:p-5 md:p-6 mb-6 md:mb-8 shadow-sm">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 bg-red-100 p-2 sm:p-3 rounded-xl mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M21 12A9 9 0 1112 3a9 9 0 019 9z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-red-900 mb-1.5 sm:mb-2">
                    Your account is blocked by admin
                  </p>
                  <p className="text-sm sm:text-base text-red-700 leading-relaxed">
                    {message ||
                      "For further details, please contact the administrator."}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Options */}
            <div className="space-y-3 sm:space-y-4">
              {/* Admin Card */}
              <div className="group flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 md:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 cursor-pointer transform hover:-translate-y-1">
                <div className="flex-shrink-0 bg-blue-500 group-hover:bg-blue-600 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1">
                    Contact Admin
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Reach out for account review & reactivation
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 group-hover:text-blue-600 flex-shrink-0 transition-all duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>

              {/* Warehouse Manager Card */}
              <div className="group flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 hover:border-emerald-400 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 md:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100 cursor-pointer transform hover:-translate-y-1">
                <div className="flex-shrink-0 bg-emerald-500 group-hover:bg-emerald-600 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-16 0H3m6-10h2m-2 4h2m4-4h2m-2 4h2"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1">
                    Near Warehouse Manager
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Visit your nearest warehouse for immediate help
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400 group-hover:text-emerald-600 flex-shrink-0 transition-all duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>

            {/* Logout Button */}
            <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full group flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl p-3.5 sm:p-4 transition-all duration-300 hover:shadow-xl hover:shadow-red-200 transform hover:scale-[1.02] font-semibold text-sm sm:text-base"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-12 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Logout from Account</span>
              </button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-2 mt-4 md:mt-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
              <p className="text-xs sm:text-sm text-gray-500 font-medium text-center">
                If this is a mistake, contact support immediately.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(30px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1.5); }
          50% { opacity: 0.6; transform: scale(1.7); }
        }
        .animate-slideIn {
          animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}