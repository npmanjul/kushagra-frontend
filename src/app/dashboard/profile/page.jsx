"use client";
import React, { useEffect, useState } from 'react';
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  CreditCard,
  FileText,
  Users,
  Building,
  Landmark,
  Hash,
  Shield,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  Leaf,
  Copy,
  ExternalLink,
  Home,
  Map,
  Navigation,
  Heart,
  Download,
  Edit3,
  Headphones,
  CheckCircle2,
  Sparkles,
  BadgeCheck,
  Zap,
} from 'lucide-react';
import API_BASE_URL from '@/utils/constants';

// Animated Background Component
const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse" />
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-400/30 to-emerald-400/30 rounded-full blur-3xl animate-pulse delay-1000" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-500" />
  </div>
);

// Floating Particles
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${3 + Math.random() * 4}s`,
        }}
      />
    ))}
  </div>
);

// Info Row Component with enhanced styling
const InfoRow = ({ icon: Icon, label, value, onCopy, copied }) => (
  <div className="group relative flex items-start justify-between py-4 px-4 -mx-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-300">
    <div className="flex items-start gap-4 flex-1">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
        <div className="relative p-2.5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100/50 group-hover:border-emerald-200 group-hover:shadow-lg group-hover:shadow-emerald-500/10 transition-all duration-300">
          <Icon className="w-4 h-4 text-emerald-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-sm font-semibold text-gray-800 break-all leading-relaxed">{value || 'N/A'}</p>
      </div>
    </div>
    {onCopy && value && (
      <button 
        onClick={() => onCopy(value)} 
        className="p-2 hover:bg-white hover:shadow-lg rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-90"
      >
        {copied === value ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400 hover:text-emerald-500" />
        )}
      </button>
    )}
  </div>
);

// Enhanced Document Card Component
const DocumentCard = ({ title, imageUrl, onView }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500">
    <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <img 
        src={imageUrl} 
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
        <button 
          onClick={() => onView(imageUrl)}
          className="p-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500 hover:bg-white"
        >
          <Eye className="w-6 h-6 text-emerald-600" />
        </button>
      </div>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700">
          Click to view
        </div>
      </div>
    </div>
    <div className="p-4 bg-gradient-to-r from-white to-gray-50/50">
      <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
        <FileText className="w-4 h-4 text-emerald-500" />
        {title}
      </h4>
    </div>
  </div>
);

// Enhanced Section Card Component
const SectionCard = ({ title, icon: Icon, children, className = '', collapsible = false, defaultOpen = true, headerRight, gradient = 'emerald' }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const gradients = {
    emerald: 'from-emerald-500 to-teal-600',
    blue: 'from-blue-500 to-indigo-600',
    purple: 'from-purple-500 to-pink-600',
    orange: 'from-orange-500 to-amber-600',
  };

  return (
    <div className={`group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100/80 overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500 ${className}`}>
      {/* Decorative gradient line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradients[gradient]} opacity-80`} />
      
      <div 
        className={`flex items-center justify-between p-6 ${collapsible ? 'cursor-pointer' : ''}`}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradients[gradient]} rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
            <div className={`relative p-3 bg-gradient-to-br ${gradients[gradient]} rounded-2xl shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            {collapsible && (
              <p className="text-xs text-gray-400 mt-0.5">{isOpen ? 'Click to collapse' : 'Click to expand'}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {headerRight}
          {collapsible && (
            <div className={`p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`}>
              <ChevronUp className="w-5 h-5 text-gray-500" />
            </div>
          )}
        </div>
      </div>
      
      <div className={`overflow-hidden transition-all duration-500 ${!collapsible || isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Enhanced Image Modal Component
const ImageModal = ({ isOpen, onClose, imageUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn" 
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl w-full max-h-[90vh] bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl animate-scaleIn" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href={imageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 bg-gray-100 hover:bg-emerald-100 hover:text-emerald-600 rounded-xl transition-all duration-300"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <button 
              onClick={onClose} 
              className="p-2.5 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-xl transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="overflow-auto max-h-[calc(90vh-5rem)] bg-gradient-to-br from-gray-50 to-gray-100 p-4">
          <img src={imageUrl} alt={title} className="w-full h-auto rounded-2xl shadow-xl" />
        </div>
      </div>
    </div>
  );
};

// Enhanced Progress Bar Component
const ProgressBar = ({ value, max, label }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {value}
          </span>
          <span className="text-sm text-gray-400">/ {max}</span>
        </div>
      </div>
      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/20" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg animate-pulse" />
        </div>
      </div>
      <p className="text-xs text-gray-400 text-right">{Math.round(percentage)}% completed</p>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, gradient }) => (
  <div className="relative group">
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
    <div className="relative px-5 py-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-4 h-4 text-gray-400" />
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-md font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, title, description, gradient, onClick }) => (
  <button 
    onClick={onClick}
    className="group w-full flex items-center gap-4 p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
  >
    <div className={`relative flex-shrink-0`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300`} />
      <div className={`relative p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <div className="text-left flex-1">
      <p className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">{title}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
    <ChevronDown className="w-5 h-5 text-gray-300 group-hover:text-gray-400 -rotate-90 group-hover:translate-x-1 transition-all duration-300" />
  </button>
);

// Main Farmer Profile Component
const FarmerProfile = () => {
  const [modalImage, setModalImage] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setProfile(data.profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedField(text);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatAadhaar = (aadhaar) => {
    if (!aadhaar) return 'N/A';
    return aadhaar.replace(/(\d{4})/g, '$1 ').trim();
  };

  const calculateAge = (dob) => {
    if (!dob) return '';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-2xl opacity-30 animate-pulse" />
          <div className="relative flex flex-col items-center gap-6 p-12 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-emerald-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-emerald-500 animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">Loading your profile</p>
              <p className="text-sm text-gray-500 mt-1">Please wait a moment...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/50 to-teal-50/50">
      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.5s ease-out; }
      `}</style>

      {/* Toast Notification */}
      {copiedField && (
        <div className="fixed top-6 right-6 z-50 animate-slideUp">
          <div className="flex items-center gap-3 px-5 py-3 bg-gray-900/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium">Copied to clipboard!</span>
          </div>
        </div>
      )}

      {/* Image Modal */}
      <ImageModal 
        isOpen={!!modalImage}
        onClose={() => setModalImage(null)}
        imageUrl={modalImage?.url}
        title={modalImage?.title}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700" />
        <AnimatedBackground />
        <FloatingParticles />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-36">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
            {/* Profile Image */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-white/30 to-white/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative">
                <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl backdrop-blur-sm">
                  <img 
                    src={profile.user_image} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {profile.is_active && (
                  <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-2xl shadow-xl">
                    <BadgeCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-4">
                <h1 className="text-4xl font-bold text-white capitalize tracking-tight">{profile.name}</h1>
                {profile.is_active && (
                  <span className="px-3 py-1 bg-emerald-400/20 backdrop-blur-sm text-emerald-100 text-sm font-medium rounded-full border border-emerald-400/30">
                    Verified
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-white/80 text-sm mb-6">
                <span className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-xl">
                  <Hash className="w-4 h-4" />
                  {profile.farmerId}
                </span>
                <span className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-xl">
                  <Phone className="w-4 h-4" />
                  {profile.phone_number}
                </span>
                <span className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-xl">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <StatCard 
                  icon={Leaf}
                  label="Total Land"
                  value={`${profile.land_size?.$numberDecimal || '0'} Acres`}
                  gradient="from-emerald-400 to-teal-500"
                />
                <StatCard 
                  icon={Calendar}
                  label="Registered On"
                  value={formatDate(profile.registration_date)}
                  gradient="from-blue-400 to-indigo-500"
                />
                <StatCard 
                  icon={MapPin}
                  label="District"
                  value={profile.district || 'N/A'}
                  gradient="from-purple-400 to-pink-500"
                />
              </div>
            </div>

            {/* Status Card - Desktop */}
            <div className="hidden xl:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-3xl blur-xl" />
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 min-w-[240px]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-semibold">Account Status</span>
                  </div>
                  
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                    profile.is_active 
                      ? 'bg-emerald-400/20 text-emerald-100 border border-emerald-400/30' 
                      : 'bg-red-400/20 text-red-100 border border-red-400/30'
                  }`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${profile.is_active ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
                    {profile.is_active ? 'Active & Verified' : 'Inactive'}
                  </div>
                  
                  <div className="mt-6">
                    <ProgressBar 
                      value={profile.step_completed || 0} 
                      max={6} 
                      label="Profile Completion"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249, 250, 251)" fillOpacity="0.5"/>
            <path d="M0 120L60 115C120 110 240 100 360 95C480 90 600 90 720 92C840 94 960 98 1080 100C1200 102 1320 102 1380 102L1440 102V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249, 250, 251)"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <SectionCard title="Personal Information" icon={User} gradient="emerald">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <InfoRow 
                  icon={User} 
                  label="Full Name" 
                  value={profile.name}
                  copied={copiedField}
                />
                <InfoRow 
                  icon={Calendar} 
                  label="Date of Birth" 
                  value={`${formatDate(profile.dob)} (${calculateAge(profile.dob)})`}
                  copied={copiedField}
                />
                <InfoRow 
                  icon={User} 
                  label="Gender" 
                  value={profile.gender}
                  copied={copiedField}
                />
                <InfoRow 
                  icon={Phone} 
                  label="Phone Number" 
                  value={profile.phone_number}
                  onCopy={handleCopy}
                  copied={copiedField}
                />
                <InfoRow 
                  icon={Mail} 
                  label="Email Address" 
                  value={profile.email}
                  onCopy={handleCopy}
                  copied={copiedField}
                />
                <InfoRow 
                  icon={Hash} 
                  label="Farmer ID" 
                  value={profile.farmerId}
                  onCopy={handleCopy}
                  copied={copiedField}
                />
              </div>
            </SectionCard>

            {/* Address Information */}
            <SectionCard title="Address Information" icon={MapPin} gradient="blue">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <InfoRow 
                  icon={Home} 
                  label="Address" 
                  value={profile.address}
                />
                <InfoRow 
                  icon={Navigation} 
                  label="Landmark" 
                  value={profile.landmark}
                />
                <InfoRow 
                  icon={Building} 
                  label="Tehsil" 
                  value={profile.tehsil}
                />
                <InfoRow 
                  icon={Map} 
                  label="District" 
                  value={profile.district}
                />
                <InfoRow 
                  icon={MapPin} 
                  label="State" 
                  value={profile.state}
                />
                <InfoRow 
                  icon={Hash} 
                  label="PIN Code" 
                  value={profile.pin_code}
                />
              </div>
            </SectionCard>

            {/* Bank Details */}
            <SectionCard title="Bank Details" icon={CreditCard} gradient="purple">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <InfoRow 
                  icon={User} 
                  label="Account Holder" 
                  value={profile.account_holder}
                />
                <InfoRow 
                  icon={CreditCard} 
                  label="Account Number" 
                  value={profile.account_number}
                  onCopy={handleCopy}
                  copied={copiedField}
                />
                <InfoRow 
                  icon={Building} 
                  label="Bank Name" 
                  value={profile.bank_name?.toUpperCase()}
                />
                <InfoRow 
                  icon={Landmark} 
                  label="Branch Name" 
                  value={profile.branch_name}
                />
                <InfoRow 
                  icon={Hash} 
                  label="IFSC Code" 
                  value={profile.ifsc_code}
                  onCopy={handleCopy}
                  copied={copiedField}
                />
              </div>
              
              {profile.bank_passbook_img && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-500" />
                    Bank Passbook
                  </h4>
                  <div className="w-full max-w-xs">
                    <DocumentCard 
                      title="Passbook Image"
                      imageUrl={profile.bank_passbook_img}
                      onView={(url) => setModalImage({ url, title: 'Bank Passbook' })}
                    />
                  </div>
                </div>
              )}
            </SectionCard>

            {/* Nominee Details */}
            <SectionCard title="Nominee Details" icon={Users} gradient="orange" collapsible defaultOpen={false}>
              <div className="flex flex-col md:flex-row gap-8">
                {profile.nominee_image && (
                  <div className="flex-shrink-0">
                    <div 
                      className="relative group w-28 h-28 rounded-2xl overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-emerald-400 transition-all duration-300 shadow-lg"
                      onClick={() => setModalImage({ url: profile.nominee_image, title: 'Nominee Photo' })}
                    >
                      <img 
                        src={profile.nominee_image} 
                        alt={profile.nominee_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <InfoRow icon={User} label="Name" value={profile.nominee_name} />
                  <InfoRow icon={Heart} label="Relation" value={profile.nominee_relation} />
                  <InfoRow icon={Calendar} label="Date of Birth" value={`${formatDate(profile.nominee_dob)} (${calculateAge(profile.nominee_dob)})`} />
                  <InfoRow icon={User} label="Gender" value={profile.nominee_gender} />
                  <InfoRow icon={Phone} label="Phone" value={profile.nominee_phone} />
                  <InfoRow icon={Mail} label="Email" value={profile.nominee_email} />
                  <InfoRow icon={FileText} label="Aadhaar" value={formatAadhaar(profile.nominee_aadhaar)} />
                  <InfoRow icon={FileText} label="PAN" value={profile.nominee_pan} />
                  <div className="md:col-span-2">
                    <InfoRow icon={MapPin} label="Address" value={profile.nominee_address} />
                  </div>
                </div>
              </div>

              {(profile.nominee_aadhaar_image || profile.nominee_pan_image) && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-500" />
                    Nominee Documents
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profile.nominee_aadhaar_image && (
                      <DocumentCard 
                        title="Aadhaar Card"
                        imageUrl={profile.nominee_aadhaar_image}
                        onView={(url) => setModalImage({ url, title: 'Nominee Aadhaar Card' })}
                      />
                    )}
                    {profile.nominee_pan_image && (
                      <DocumentCard 
                        title="PAN Card"
                        imageUrl={profile.nominee_pan_image}
                        onView={(url) => setModalImage({ url, title: 'Nominee PAN Card' })}
                      />
                    )}
                  </div>
                </div>
              )}
            </SectionCard>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Mobile Status Card */}
            <div className="xl:hidden">
              <SectionCard title="Account Status" icon={Shield} gradient="emerald">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                  profile.is_active 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${profile.is_active ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                  {profile.is_active ? 'Active & Verified' : 'Inactive'}
                </div>
                <div className="mt-6">
                  <ProgressBar 
                    value={profile.step_completed || 0} 
                    max={6} 
                    label="Profile Completion"
                  />
                </div>
              </SectionCard>
            </div>

            {/* Identity Documents */}
            <SectionCard title="Identity Documents" icon={FileText} gradient="emerald">
              <div className="space-y-1">
                <InfoRow 
                  icon={FileText} 
                  label="Aadhaar Number" 
                  value={formatAadhaar(profile.aadhaar_number)}
                  onCopy={() => handleCopy(profile.aadhaar_number)}
                  copied={copiedField}
                />
                <InfoRow 
                  icon={FileText} 
                  label="PAN Number" 
                  value={profile.pan_number}
                  onCopy={() => handleCopy(profile.pan_number)}
                  copied={copiedField}
                />
              </div>

              {(profile.aadhaar_image || profile.pan_image) && (
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                  {profile.aadhaar_image && (
                    <DocumentCard 
                      title="Aadhaar"
                      imageUrl={profile.aadhaar_image}
                      onView={(url) => setModalImage({ url, title: 'Aadhaar Card' })}
                    />
                  )}
                  {profile.pan_image && (
                    <DocumentCard 
                      title="PAN"
                      imageUrl={profile.pan_image}
                      onView={(url) => setModalImage({ url, title: 'PAN Card' })}
                    />
                  )}
                </div>
              )}
            </SectionCard>

            {/* Land Details */}
            <SectionCard title="Land Details" icon={Leaf} gradient="emerald">
              <div className="relative p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">Total Land Size</p>
                    <p className="text-3xl font-bold text-emerald-700">{profile.land_size?.$numberDecimal || '0'}</p>
                    <p className="text-sm text-emerald-600 font-medium">Acres</p>
                  </div>
                  <div className="p-4 bg-white/80 rounded-2xl shadow-lg">
                    <Leaf className="w-8 h-8 text-emerald-500" />
                  </div>
                </div>
              </div>

              {profile.khatauni_images && profile.khatauni_images.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    Khatauni Documents
                    <span className="ml-auto px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      {profile.khatauni_images.length}
                    </span>
                  </h4>
                  <div className="space-y-4">
                    {profile.khatauni_images?.map((doc, index) => (
                      <div 
                        key={doc.khatauni_id}
                        className="group relative overflow-hidden rounded-2xl border border-gray-200 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
                        onClick={() => setModalImage({ url: doc.image_url, title: `Khatauni Document ${index + 1}` })}
                      >
                        <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100">
                          <img 
                            src={doc.image_url} 
                            alt={`Khatauni ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4">
                            <div className="flex items-center justify-between w-full">
                              <span className="text-white text-sm font-medium">{doc.khatauni_id}</span>
                              <Eye className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>

            {/* Quick Actions */}
            <SectionCard title="Quick Actions" icon={Zap} gradient="blue">
              <div className="space-y-3">
                <QuickActionButton 
                  icon={Download}
                  title="Download Profile"
                  description="Get PDF copy of your profile"
                  gradient="from-emerald-500 to-teal-600"
                />
                <QuickActionButton 
                  icon={Edit3}
                  title="Edit Profile"
                  description="Update your information"
                  gradient="from-blue-500 to-indigo-600"
                />
                <QuickActionButton 
                  icon={Headphones}
                  title="Contact Support"
                  description="Get help with your account"
                  gradient="from-purple-500 to-pink-600"
                />
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      {/* Footer Gradient */}
      <div className="h-32 bg-gradient-to-t from-emerald-50/50 to-transparent" />
    </div>
  );
};

export default FarmerProfile;