import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Building2,
  Landmark,
  Hash,
  Wheat,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Users,
  Shield,
  Sparkles,
  Eye,
  Download,
  ChevronRight,
  IndianRupee,
  Banknote,
  PiggyBank,
  Receipt,
  History,
  BadgeCheck,
  Wallet,
  Loader2,
  ImageIcon,
  ExternalLink,
  UserCircle,
  Home,
  FileImage,
  Heart,
} from 'lucide-react';
import API_BASE_URL from '@/utils/constants';

const ProfileViewModal = ({ isOpen, onClose, farmerId }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch farmer details
  useEffect(() => {
    if (isOpen && farmerId) {
      fetchFarmerDetails();
    }
  }, [isOpen, farmerId]);

  const fetchFarmerDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/getfarmerdetails?farmerId=${farmerId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const result = await response.json();
      
      if (result.success) {
        setFarmer(result.data);
      } else {
        setError(result.message || 'Failed to fetch farmer details');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching farmer details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'documents', label: 'Documents', icon: FileImage },
    { id: 'bank', label: 'Bank Details', icon: Building2 },
    { id: 'nominee', label: 'Nominee', icon: Heart },
  ];

  const getStatusBadge = (status) => {
    const configs = {
      approved: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
      active: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
      pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
      rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
      inactive: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500' },
    };
    const config = configs[status?.toLowerCase()] || configs.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`}></span>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    return phone.length === 10 ? `+91 ${phone}` : phone;
  };

  const getLandSize = (landSize) => {
    if (!landSize) return 'N/A';
    if (typeof landSize === 'object' && landSize.$numberDecimal) {
      return `${landSize.$numberDecimal} Acres`;
    }
    return `${landSize} Acres`;
  };

  const getInitials = (name) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const InfoCard = ({ icon: Icon, label, value, color = 'indigo', copyable = false }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
      <div className={`p-2 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-lg shadow-sm`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-sm font-semibold text-gray-900 truncate">{value || 'N/A'}</p>
      </div>
      {copyable && value && (
        <button
          onClick={() => navigator.clipboard.writeText(value)}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
          title="Copy"
        >
          <FileText className="w-3 h-3 text-gray-500" />
        </button>
      )}
    </div>
  );

  const ImageCard = ({ label, imageUrl, onView }) => (
    <div className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
      <p className="text-xs text-gray-500 font-medium mb-2">{label}</p>
      <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => onView(imageUrl)}
                className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </button>
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4 text-gray-700" />
              </a>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );

  // Image Preview Modal
  const ImagePreviewModal = ({ imageUrl, onClose }) => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={imageUrl}
          alt="Preview"
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">
          {/* Loading State */}
          {loading && (
            <div className="flex-1 flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Loading farmer details...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex-1 flex items-center justify-center py-20">
              <div className="text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-900 font-semibold mb-2">Failed to load data</p>
                <p className="text-gray-500 mb-4">{error}</p>
                <button
                  onClick={fetchFarmerDetails}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          {farmer && !loading && (
            <>
              {/* Header */}
              <div className="relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
                </div>

                <div className="relative px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {farmer.user_image ? (
                          <img
                            src={farmer.user_image}
                            alt={farmer.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-xl cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => setImagePreview(farmer.user_image)}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl border border-white/30 shadow-xl">
                            {getInitials(farmer.name)}
                          </div>
                        )}
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${farmer.is_active ? 'bg-green-500' : 'bg-gray-500'}`}>
                          {farmer.is_active ? (
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          ) : (
                            <XCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold text-white capitalize">{farmer.name}</h2>
                          {farmer.overallStatus === 'approved' && (
                            <BadgeCheck className="w-5 h-5 text-yellow-300" />
                          )}
                        </div>
                        <p className="text-white/70 text-sm">ID: {farmer.farmerId}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 text-white/80 text-xs">
                            <Phone className="w-3 h-3" />
                            {formatPhone(farmer.phone_number)}
                          </span>
                          <span className="flex items-center gap-1 text-white/80 text-xs">
                            <Calendar className="w-3 h-3" />
                            Joined {formatDate(farmer.registration_date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="hidden sm:block">
                        {getStatusBadge(farmer.overallStatus)}
                      </div>
                      <button
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex bg-gray-50 px-4 py-2 gap-2 flex-shrink-0 border-b border-gray-200 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 min-w-fit px-4 py-2 flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-white text-gray-800 shadow-md'
                          : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm whitespace-nowrap">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 via-white to-gray-50">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-600" />
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <InfoCard icon={User} label="Full Name" value={farmer.name} />
                        <InfoCard icon={Phone} label="Phone Number" value={formatPhone(farmer.phone_number)} copyable />
                        <InfoCard icon={Mail} label="Email Address" value={farmer.email} copyable />
                        <InfoCard icon={Calendar} label="Date of Birth" value={formatDate(farmer.dob)} />
                        <InfoCard icon={UserCircle} label="Gender" value={farmer.gender?.charAt(0).toUpperCase() + farmer.gender?.slice(1)} />
                        <InfoCard icon={Hash} label="Farmer ID" value={farmer.farmerId} copyable />
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                        Address & Land Details
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <InfoCard icon={Home} label="Address" value={farmer.address} />
                        <InfoCard icon={MapPin} label="Landmark" value={farmer.landmark} />
                        <InfoCard icon={MapPin} label="Tehsil" value={farmer.tehsil} />
                        <InfoCard icon={MapPin} label="District" value={farmer.district} />
                        <InfoCard icon={MapPin} label="State" value={farmer.state} />
                        <InfoCard icon={Hash} label="PIN Code" value={farmer.pin_code} copyable />
                        <InfoCard icon={Wheat} label="Land Size" value={getLandSize(farmer.land_size)} />
                      </div>
                    </div>

                    {/* Status Information */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-indigo-600" />
                        Account Status
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-2">Overall Status</p>
                          {getStatusBadge(farmer.overallStatus)}
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-2">Account Status</p>
                          {getStatusBadge(farmer.is_active ? 'active' : 'inactive')}
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-2">Registration Date</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatDate(farmer.registration_date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div className="space-y-6">
                    {/* Identity Documents */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-indigo-600" />
                        Identity Documents
                      </h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <InfoCard icon={Hash} label="Aadhaar Number" value={farmer.aadhaar_number} copyable />
                        <InfoCard icon={CreditCard} label="PAN Number" value={farmer.pan_number} copyable />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <ImageCard
                          label="User Photo"
                          imageUrl={farmer.user_image}
                          onView={setImagePreview}
                        />
                        <ImageCard
                          label="Aadhaar Card"
                          imageUrl={farmer.aadhaar_image}
                          onView={setImagePreview}
                        />
                        <ImageCard
                          label="PAN Card"
                          imageUrl={farmer.pan_image}
                          onView={setImagePreview}
                        />
                      </div>
                    </div>

                    {/* Khatauni Documents */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        Khatauni Documents ({farmer.khatauni_images?.length || 0})
                      </h3>
                      {farmer.khatauni_images && farmer.khatauni_images.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {farmer.khatauni_images.map((doc, index) => (
                            <div key={doc.khatauni_id} className="bg-gray-50 rounded-xl p-3">
                              <p className="text-xs text-gray-500 font-medium mb-2 truncate" title={doc.khatauni_id}>
                                Khatauni {index + 1}
                              </p>
                              <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group">
                                <img
                                  src={doc.image_url}
                                  alt={`Khatauni ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => setImagePreview(doc.image_url)}
                                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                                    title="View"
                                  >
                                    <Eye className="w-4 h-4 text-gray-700" />
                                  </button>
                                  <a
                                    href={doc.image_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                                    title="Open in new tab"
                                  >
                                    <ExternalLink className="w-4 h-4 text-gray-700" />
                                  </a>
                                </div>
                              </div>
                              <p className="text-xs text-gray-400 mt-2 truncate" title={doc.khatauni_id}>
                                ID: {doc.khatauni_id}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>No khatauni documents uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Bank Tab */}
                {activeTab === 'bank' && (
                  <div className="space-y-6">
                    {/* Bank Account Details */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-600" />
                        Bank Account Details
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <InfoCard icon={User} label="Account Holder" value={farmer.account_holder} />
                        <InfoCard icon={CreditCard} label="Account Number" value={farmer.account_number} copyable />
                        <InfoCard icon={Hash} label="IFSC Code" value={farmer.ifsc_code} copyable />
                        <InfoCard icon={Building2} label="Bank Name" value={farmer.bank_name} />
                        <InfoCard icon={Landmark} label="Branch Name" value={farmer.branch_name} />
                      </div>
                    </div>

                    {/* Bank Passbook */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FileImage className="w-4 h-4 text-indigo-600" />
                        Bank Passbook / Cancelled Cheque
                      </h3>
                      <div className="max-w-md">
                        <ImageCard
                          label="Bank Passbook Image"
                          imageUrl={farmer.bank_passbook_img}
                          onView={setImagePreview}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Nominee Tab */}
                {activeTab === 'nominee' && (
                  <div className="space-y-6">
                    {/* Nominee Information */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-600" />
                        Nominee Information
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <InfoCard icon={User} label="Nominee Name" value={farmer.nominee_name} />
                        <InfoCard icon={Heart} label="Relationship" value={farmer.nominee_relation?.charAt(0).toUpperCase() + farmer.nominee_relation?.slice(1)} />
                        <InfoCard icon={UserCircle} label="Gender" value={farmer.nominee_gender?.charAt(0).toUpperCase() + farmer.nominee_gender?.slice(1)} />
                        <InfoCard icon={Calendar} label="Date of Birth" value={formatDate(farmer.nominee_dob)} />
                        <InfoCard icon={Phone} label="Phone Number" value={formatPhone(farmer.nominee_phone)} copyable />
                        <InfoCard icon={Mail} label="Email Address" value={farmer.nominee_email} copyable />
                        <InfoCard icon={Hash} label="Aadhaar Number" value={farmer.nominee_aadhaar} copyable />
                        <InfoCard icon={CreditCard} label="PAN Number" value={farmer.nominee_pan} copyable />
                        <InfoCard icon={Home} label="Address" value={farmer.nominee_address} />
                      </div>
                    </div>

                    {/* Nominee Documents */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FileImage className="w-4 h-4 text-indigo-600" />
                        Nominee Documents
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <ImageCard
                          label="Nominee Photo"
                          imageUrl={farmer.nominee_image}
                          onView={setImagePreview}
                        />
                        <ImageCard
                          label="Nominee Aadhaar Card"
                          imageUrl={farmer.nominee_aadhaar_image}
                          onView={setImagePreview}
                        />
                        <ImageCard
                          label="Nominee PAN Card"
                          imageUrl={farmer.nominee_pan_image}
                          onView={setImagePreview}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Farmer ID: {farmer.farmerId} | Last updated: {formatDate(farmer.registration_date)}
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button
                      onClick={onClose}
                      className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Close button for loading/error states */}
          {(loading || error) && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex-shrink-0">
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {imagePreview && (
        <ImagePreviewModal imageUrl={imagePreview} onClose={() => setImagePreview(null)} />
      )}
    </>
  );
};

export default ProfileViewModal;