"use client";
import React from "react";
import { logout } from "@/utils/api";

export default function NoticeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-lg p-4">
      <div className="relative w-full max-w-lg sm:max-w-xl lg:max-w-2xl bg-white rounded-3xl shadow-2xl px-6 py-12 sm:px-8 sm:py-16 animate-fadeIn scale-up flex flex-col items-center justify-center">
   
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-5 rounded-full shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-600"
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
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
          Account Pending Approval
        </h2>

        {/* Message */}
        <p className="text-gray-700 max-w-[500px] text-center text-sm sm:text-base lg:text-lg leading-relaxed">
          Your account is not active yet. Please wait for approval. It may take
          up to <span className="font-semibold">24 hours</span>.
        </p>

        {/* Contact Info */}
        <div className="text-center mt-4 text-sm sm:text-base lg:text-lg">
          <p className="text-gray-700">Contact Admin:</p>
          <p className="text-gray-700 mt-1">
            📞 <span className="font-medium">+91-9876543210</span> | ✉️{" "}
            <span className="font-medium">admin@example.com</span>
          </p>
        </div>
        <button className="px-15 py-3 mt-6 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed" onClick={logout}>
        Logout
        </button>   
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .scale-up {
          transform-origin: center;
        }
      `}</style>
    </div>
  );
}