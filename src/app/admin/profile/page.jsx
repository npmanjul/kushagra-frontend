"use client";
import API_BASE_URL from '@/utils/constants';
import React, { useState, useEffect } from 'react';

// Icons Component
const Icons = {
  User: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  ),
  Email: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  ),
  Phone: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
  ),
  Location: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
  ),
  Calendar: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
  ),
  Briefcase: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
    </svg>
  ),
  Bank: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
    </svg>
  ),
  Document: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  ),
  Shield: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  Heart: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
  ),
  Edit: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  ),
  Check: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  Star: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  AlertCircle: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  Verified: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  Globe: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
    </svg>
  ),
  ID: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  ),
  GraduationCap: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  ),
  Award: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
    </svg>
  ),
  Money: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
      <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
    </svg>
  ),
  Building: ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5h-.75V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm-.75 3.75A.75.75 0 019 9h1.5a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM9 12a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm3.75-5.25A.75.75 0 0113.5 6H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM13.5 9a.75.75 0 000 1.5H15A.75.75 0 0015 9h-1.5zm-.75 3.75a.75.75 0 01.75-.75H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM9 19.5v-2.25a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-4.5A.75.75 0 019 19.5z" clipRule="evenodd" />
    </svg>
  ),
};

// Info Item Component
const InfoItem = ({ icon, label, value, className = "", highlight = false }) => (
  <div className={`group flex items-start gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 ${highlight ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100' : ''} ${className}`}>
    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-slate-700 break-words leading-relaxed">
        {value || <span className="text-slate-300 italic font-normal">Not provided</span>}
      </p>
    </div>
  </div>
);

// Section Card Component
const SectionCard = ({ title, icon, children, className = "", headerAction, gradient = "from-white to-slate-50/50" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-500 ${className}`}>
    <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-slate-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>
      {headerAction}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// Status Badge Component
const StatusBadge = ({ status, type = "default" }) => {
  const styles = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    inactive: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    default: "bg-slate-100 text-slate-600 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    manager: "bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border-purple-200",
    verified: "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[type] || styles.default}`}>
      {type === 'active' && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>}
      {type === 'verified' && <Icons.Verified className="h-3 w-3" />}
      {status}
    </span>
  );
};

// Progress Ring Component
const ProgressRing = ({ progress, size = 100, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <circle
          className="text-white/30"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-white">{progress}%</span>
        <span className="text-[10px] text-white/80 font-medium">Complete</span>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, color = "blue", subValue }) => {
  const colors = {
    blue: "from-blue-500 to-indigo-600",
    emerald: "from-emerald-500 to-teal-600",
    amber: "from-amber-500 to-orange-600",
    rose: "from-rose-500 to-pink-600",
    purple: "from-purple-500 to-indigo-600",
  };

  return (
    <div className="group relative bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${colors[color]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      <div className="relative">
        <div className={`w-10 h-10 bg-gradient-to-br ${colors[color]} rounded-xl flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <p className="text-xs font-medium text-slate-400 mb-0.5">{label}</p>
        <p className="text-xl font-bold text-slate-800">{value}</p>
        {subValue && <p className="text-xs text-slate-400 mt-0.5">{subValue}</p>}
      </div>
    </div>
  );
};

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-8">
    <div className="max-w-7xl mx-auto animate-pulse">
      <div className="bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl h-64 mb-8"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl h-56 shadow-sm"></div>
        ))}
      </div>
    </div>
  </div>
);

// Main Profile Page Component
const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/getcompleteprofile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (data.success) {
        setProfile(data.profile);
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError('Failed to fetch profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    const fields = [
      profile.name, profile.email, profile.phone_number, profile.gender, profile.dob,
      profile.permanentAddress?.line1, profile.employeeId, profile.nationality,
      profile.bloodGroup, profile.aadhaarNumber, profile.panNumber, profile.bank_name,
      profile.account_number, profile.ifsc_code, profile.skills?.length > 0,
      profile.education?.length > 0, profile.experience?.length > 0,
      profile.emergencyContacts?.length > 0
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const getDaysSinceJoining = () => {
    if (!profile?.dateOfJoining) return 0;
    const joinDate = new Date(profile.dateOfJoining);
    const today = new Date();
    return Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));
  };

  const formatExperienceDuration = (startDate, endDate) => {
    if (!startDate) return '';
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    const totalMonths = years * 12 + months;
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    return `${y > 0 ? `${y} yr${y > 1 ? 's' : ''}` : ''} ${m > 0 ? `${m} mo${m > 1 ? 's' : ''}` : ''}`.trim();
  };

  if (loading) return <LoadingSkeleton />;

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-slate-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icons.AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Profile</h2>
          <p className="text-slate-500 mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Icons.User className="h-4 w-4" /> },
    { id: 'employment', label: 'Employment', icon: <Icons.Briefcase className="h-4 w-4" /> },
    { id: 'documents', label: 'Documents', icon: <Icons.Document className="h-4 w-4" /> },
    { id: 'banking', label: 'Banking', icon: <Icons.Bank className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/30">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/2"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-6 lg:gap-8">
            {/* Profile Image */}
            <div className="relative group">
              <div className="relative w-32 h-32 lg:w-36 lg:h-36 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                <img
                  src={profile?.employeeImage}
                  alt={profile?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors">
                <Icons.Edit className="h-4 w-4" />
              </button>
              {profile?.isActive && (
                <div className="absolute -top-1 -right-1">
                  <span className="absolute w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-75"></span>
                  <span className="relative block w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></span>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center lg:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <StatusBadge status={profile?.role?.toUpperCase()} type="manager" />
                <StatusBadge status={profile?.employmentStatus} type="active" />
                <StatusBadge status={profile?.employmentType} type="default" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">{profile?.name}</h1>
                <p className="text-lg text-blue-200 font-medium mt-1">{profile?.employeeId}</p>
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-white/90">
                <a href={`mailto:${profile?.email}`} className="flex items-center gap-2 hover:text-white transition-colors text-sm">
                  <Icons.Email className="h-4 w-4" />
                  <span>{profile?.email}</span>
                </a>
                <a href={`tel:${profile?.phone_number}`} className="flex items-center gap-2 hover:text-white transition-colors text-sm">
                  <Icons.Phone className="h-4 w-4" />
                  <span>{profile?.phone_number}</span>
                </a>
                <div className="flex items-center gap-2 text-sm">
                  <Icons.Location className="h-4 w-4" />
                  <span>{profile?.currentAddress?.city}, {profile?.currentAddress?.state}</span>
                </div>
              </div>
            </div>

            {/* Progress Ring */}
            <div className="hidden lg:block">
              <ProgressRing progress={calculateProfileCompletion()} size={110} strokeWidth={10} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg border-b border-slate-200/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                icon={<Icons.Calendar className="h-4 w-4" />}
                label="Days with Us"
                value={getDaysSinceJoining()}
                color="blue"
              />
              <StatCard
                icon={<Icons.Check className="h-4 w-4" />}
                label="Profile"
                value={`${calculateProfileCompletion()}%`}
                color="emerald"
                subValue={`Step ${profile?.step_completed}/7`}
              />
              <StatCard
                icon={<Icons.Shield className="h-4 w-4" />}
                label="Background"
                value={profile?.backgroundCheckStatus}
                color="purple"
              />
              <StatCard
                icon={<Icons.Briefcase className="h-4 w-4" />}
                label="Experience"
                value={`${profile?.totalExperienceYears} Yrs`}
                color="amber"
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Personal Information */}
              <SectionCard
                title="Personal Information"
                icon={<Icons.User className="h-4 w-4" />}
                className="xl:col-span-2"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <InfoItem icon={<Icons.User className="h-4 w-4" />} label="Full Name" value={profile?.name} highlight />
                  <InfoItem icon={<Icons.Email className="h-4 w-4" />} label="Email" value={profile?.email} />
                  <InfoItem icon={<Icons.Phone className="h-4 w-4" />} label="Phone" value={profile?.phone_number} />
                  <InfoItem icon={<Icons.Phone className="h-4 w-4" />} label="Alt Phone" value={profile?.secondary_phone_number} />
                  <InfoItem icon={<Icons.Calendar className="h-4 w-4" />} label="Date of Birth" value={`${formatDate(profile?.dob)} (${calculateAge(profile?.dob)})`} />
                  <InfoItem icon={<Icons.User className="h-4 w-4" />} label="Gender" value={profile?.gender?.charAt(0).toUpperCase() + profile?.gender?.slice(1)} />
                  <InfoItem icon={<Icons.Heart className="h-4 w-4" />} label="Marital Status" value={profile?.maritalStatus} />
                  <InfoItem icon={<Icons.Globe className="h-4 w-4" />} label="Nationality" value={profile?.nationality} />
                  <InfoItem icon={<Icons.Heart className="h-4 w-4 text-red-500" />} label="Blood Group" value={profile?.bloodGroup} />
                </div>
              </SectionCard>

              {/* Timeline */}
              <div className="space-y-6">
                <SectionCard title="Timeline" icon={<Icons.Calendar className="h-4 w-4" />}>
                  <div className="space-y-4">
                    {[
                      { label: 'Registered', date: profile?.registration_date, color: 'blue' },
                      { label: 'Joined', date: profile?.dateOfJoining, color: 'emerald' },
                    ].map((item, idx) => (
                      <div key={idx} className="relative pl-6 pb-4 border-l-2 border-slate-200 last:pb-0">
                        <div className={`absolute left-0 top-0 w-3 h-3 -translate-x-1/2 bg-${item.color}-500 rounded-full border-2 border-white`}></div>
                        <p className={`text-xs font-bold text-${item.color}-600 uppercase`}>{item.label}</p>
                        <p className="text-sm font-semibold text-slate-700">{formatDate(item.date)}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Notes" icon={<Icons.Document className="h-4 w-4" />}>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">HR Notes</p>
                      <p className="text-sm text-slate-600">{profile?.hrNotes || 'No notes'}</p>
                    </div>
                    <div className="p-3 bg-rose-50 rounded-xl">
                      <p className="text-xs font-bold text-rose-400 uppercase mb-1">Medical Info</p>
                      <p className="text-sm text-slate-600">{profile?.medicalConditions || 'None'}</p>
                    </div>
                  </div>
                </SectionCard>
              </div>
            </div>

            {/* Address Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SectionCard title="Permanent Address" icon={<Icons.Location className="h-4 w-4" />}>
                <div className="space-y-1">
                  <InfoItem icon={<Icons.Location className="h-4 w-4" />} label="Address" value={[profile?.permanentAddress?.line1, profile?.permanentAddress?.line2].filter(Boolean).join(', ')} />
                  <div className="grid grid-cols-2 gap-1">
                    <InfoItem icon={<Icons.Building className="h-4 w-4" />} label="City" value={profile?.permanentAddress?.city} />
                    <InfoItem icon={<Icons.Globe className="h-4 w-4" />} label="State" value={profile?.permanentAddress?.state} />
                    <InfoItem icon={<Icons.Globe className="h-4 w-4" />} label="Country" value={profile?.permanentAddress?.country} />
                    <InfoItem icon={<Icons.Document className="h-4 w-4" />} label="Postal Code" value={profile?.permanentAddress?.postalCode} />
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="Current Address"
                icon={<Icons.Location className="h-4 w-4" />}
                headerAction={
                  profile?.sameAsPermanent && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                      Same as Permanent
                    </span>
                  )
                }
              >
                <div className="space-y-1">
                  <InfoItem icon={<Icons.Location className="h-4 w-4" />} label="Address" value={[profile?.currentAddress?.line1, profile?.currentAddress?.line2].filter(Boolean).join(', ')} />
                  <div className="grid grid-cols-2 gap-1">
                    <InfoItem icon={<Icons.Building className="h-4 w-4" />} label="City" value={profile?.currentAddress?.city} />
                    <InfoItem icon={<Icons.Globe className="h-4 w-4" />} label="State" value={profile?.currentAddress?.state} />
                    <InfoItem icon={<Icons.Globe className="h-4 w-4" />} label="Country" value={profile?.currentAddress?.country} />
                    <InfoItem icon={<Icons.Document className="h-4 w-4" />} label="Postal Code" value={profile?.currentAddress?.postalCode} />
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        )}

        {activeTab === 'employment' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SectionCard title="Employment Details" icon={<Icons.Briefcase className="h-4 w-4" />}>
                <div className="space-y-1">
                  <InfoItem icon={<Icons.ID className="h-4 w-4" />} label="Employee ID" value={profile?.employeeId} highlight />
                  <InfoItem icon={<Icons.User className="h-4 w-4" />} label="Role" value={profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)} />
                  <InfoItem icon={<Icons.Briefcase className="h-4 w-4" />} label="Employment Type" value={profile?.employmentType} />
                  <InfoItem icon={<Icons.Check className="h-4 w-4" />} label="Status" value={profile?.employmentStatus} />
                  <InfoItem icon={<Icons.Calendar className="h-4 w-4" />} label="Date of Joining" value={formatDate(profile?.dateOfJoining)} />
                  <InfoItem icon={<Icons.User className="h-4 w-4" />} label="Reporting Manager" value={profile?.reportingManager || 'Not Assigned'} />
                  <InfoItem icon={<Icons.Money className="h-4 w-4" />} label="Salary" value={`₹${profile?.salary?.toLocaleString('en-IN')}/month`} />
                </div>
              </SectionCard>

              <SectionCard title="Skills & Expertise" icon={<Icons.Star className="h-4 w-4" />}>
                {profile?.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-100 hover:shadow-md transition-shadow">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Icons.Star className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">No skills added yet</p>
                  </div>
                )}
              </SectionCard>
            </div>

            {/* Education */}
            <SectionCard title="Education" icon={<Icons.GraduationCap className="h-4 w-4" />}>
              {profile?.education?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl border border-slate-100 hover:shadow-md transition-all group">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Icons.GraduationCap className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 text-sm">{edu.qualification}</h4>
                          <p className="text-xs text-slate-600 truncate">{edu.institution}</p>
                          <p className="text-xs text-slate-400 mt-1">{edu.boardOrUniversity}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-semibold text-blue-600">{edu.yearOfPassing}</span>
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">{edu.percentageOrCgpa}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icons.GraduationCap className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No education details added</p>
                </div>
              )}
            </SectionCard>

            {/* Experience */}
            <SectionCard title="Work Experience" icon={<Icons.Briefcase className="h-4 w-4" />}>
              {profile?.experience?.length > 0 ? (
                <div className="space-y-4">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-xl border border-slate-100 hover:shadow-md transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                          <Icons.Building className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-slate-800">{exp.title}</h4>
                              <p className="text-sm text-slate-600">{exp.companyName}</p>
                            </div>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                              {formatExperienceDuration(exp.startDate, exp.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span>{formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}</span>
                            <span className="text-emerald-600 font-semibold">₹{exp.lastDrawnSalary?.toLocaleString('en-IN')}/month</span>
                          </div>
                          <p className="text-sm text-slate-600 mt-2">{exp.responsibilities}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icons.Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No experience added</p>
                </div>
              )}
            </SectionCard>

            {/* Certifications */}
            <SectionCard title="Certifications" icon={<Icons.Award className="h-4 w-4" />}>
              {profile?.certifications?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.certifications.map((cert, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 hover:shadow-md transition-all group">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Icons.Award className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 text-sm">{cert.title}</h4>
                          <p className="text-xs text-slate-600 truncate">{cert.issuer}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-slate-400">Issued: {formatDate(cert.issueDate)}</span>
                          </div>
                          {cert.expiryDate && (
                            <span className="text-xs text-amber-600">Expires: {formatDate(cert.expiryDate)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icons.Award className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No certifications added</p>
                </div>
              )}
            </SectionCard>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SectionCard title="Identity Documents" icon={<Icons.ID className="h-4 w-4" />}>
                <div className="space-y-1">
                  <InfoItem
                    icon={<Icons.ID className="h-4 w-4" />}
                    label="Aadhaar Number"
                    value={profile?.aadhaarNumber ? `XXXX XXXX ${profile.aadhaarNumber.slice(-4)}` : null}
                  />
                  <InfoItem icon={<Icons.Document className="h-4 w-4" />} label="PAN Number" value={profile?.panNumber} />
                  <InfoItem icon={<Icons.Globe className="h-4 w-4" />} label="Passport Number" value={profile?.passportNumber} />
                  <InfoItem icon={<Icons.Calendar className="h-4 w-4" />} label="Passport Expiry" value={formatDate(profile?.passportExpiry)} />
                </div>
              </SectionCard>

              <SectionCard title="Compliance Documents" icon={<Icons.Shield className="h-4 w-4" />}>
                <div className="space-y-1">
                  <InfoItem icon={<Icons.Document className="h-4 w-4" />} label="PF Number" value={profile?.pfNumber} />
                  <InfoItem icon={<Icons.Document className="h-4 w-4" />} label="ESI Number" value={profile?.esiNumber} />
                  <InfoItem icon={<Icons.Bank className="h-4 w-4" />} label="Tax Status" value={profile?.taxStatus} />
                </div>
              </SectionCard>
            </div>

            {/* Emergency Contacts */}
            <SectionCard title="Emergency Contacts" icon={<Icons.Phone className="h-4 w-4" />}>
              {profile?.emergencyContacts?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.emergencyContacts.map((contact, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center text-white">
                          <Icons.User className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{contact.name}</h4>
                          <p className="text-xs text-slate-500">{contact.relationship}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-rose-600 font-semibold hover:text-rose-700">
                          <Icons.Phone className="h-4 w-4" />
                          {contact.phone}
                        </a>
                        {contact.alternatePhone && (
                          <a href={`tel:${contact.alternatePhone}`} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
                            <Icons.Phone className="h-4 w-4" />
                            {contact.alternatePhone}
                          </a>
                        )}
                        <p className="text-xs text-slate-500 flex items-start gap-2">
                          <Icons.Location className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          {contact.address}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icons.AlertCircle className="h-10 w-10 text-rose-300 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No emergency contacts added</p>
                </div>
              )}
            </SectionCard>
          </div>
        )}

        {activeTab === 'banking' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SectionCard title="Bank Account Details" icon={<Icons.Bank className="h-4 w-4" />} className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <InfoItem icon={<Icons.Bank className="h-4 w-4" />} label="Bank Name" value={profile?.bank_name} highlight />
                <InfoItem icon={<Icons.User className="h-4 w-4" />} label="Account Holder" value={profile?.account_holder} />
                <InfoItem icon={<Icons.Document className="h-4 w-4" />} label="Account Number" value={profile?.account_number ? `XXXXXX${profile.account_number.slice(-4)}` : null} />
                <InfoItem icon={<Icons.Document className="h-4 w-4" />} label="IFSC Code" value={profile?.ifsc_code} />
                <InfoItem icon={<Icons.Location className="h-4 w-4" />} label="Branch" value={profile?.branch_name} />
                <InfoItem icon={<Icons.Bank className="h-4 w-4" />} label="UPI ID" value={profile?.upiId || 'Not provided'} />
              </div>
            </SectionCard>

            <div className="space-y-4">
              {/* Salary Card */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-xl shadow-emerald-500/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-emerald-100 text-sm font-medium">Monthly Salary</span>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Icons.Money className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-black">
                  ₹{profile?.salary?.toLocaleString('en-IN') || '0'}
                </p>
                <p className="text-emerald-200 text-sm mt-1">Per month</p>
              </div>

              {/* Info Card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <Icons.AlertCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-800 text-sm">Keep Updated</h4>
                    <p className="text-xs text-amber-700 mt-1">
                      Ensure your bank details are correct for timely salary processing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 group z-30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
          <Icons.Edit className="h-5 w-5" />
        </div>
      </button>
    </div>
  );
};

export default ProfilePage;