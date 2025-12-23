import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  XCircle,
  Clock,
  User,
  CreditCard,
  MapPin,
  Building2,
  Users,
  FileText,
  Image,
  ExternalLink,
  Shield,
  UserCheck,
  Briefcase,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Eye
} from 'lucide-react';

// Sample data
const profileData = {
  data: {
    overallStatus: "pending",
    aadhaar_image: {
      value: "https://res.cloudinary.com/dhyrkd5pe/image/upload/v1766220075/y4jwblrfa9jphf42lso6.jpg",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    aadhaar_number: {
      value: "398273921387",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    pan_image: {
      value: "https://res.cloudinary.com/dhyrkd5pe/image/upload/v1766220075/jfgp1hhtohkzhexvn0qa.jpg",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    pan_number: {
      value: "PYNMS7670Q",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    khatauni_images: {
      value: [
        {
          khatauni_id: "789237139813",
          image_url: "https://res.cloudinary.com/dhyrkd5pe/image/upload/v1766220075/zwyxldnzzjwpplke3fxj.jpg"
        },
        {
          khatauni_id: "2131232142",
          image_url: "https://res.cloudinary.com/dhyrkd5pe/image/upload/v1766220076/nuoawizjzful3j8yxzsh.png"
        }
      ],
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    address: {
      value: "f3f 3jkf",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    tehsil: {
      value: "pipalgaon",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    district: {
      value: "Prayagraj",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    state: {
      value: "uttar pradesh",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    landmark: {
      value: "ok",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    pin_code: {
      value: "211012",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    land_size: {
      value: { "$numberDecimal": "1" },
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    bank_passbook_img: {
      value: "https://res.cloudinary.com/dhyrkd5pe/image/upload/v1766220135/hpoqngmzx9mwev25xlof.jpg",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    account_number: {
      value: "89794759785903485",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    ifsc_code: {
      value: "SBIN0001534",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    account_holder: {
      value: "hi ji",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    bank_name: {
      value: "sci",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    branch_name: {
      value: "kota",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    nominee_image: {
      value: "https://res.cloudinary.com/dhyrkd5pe/image/upload/v1766220223/gxwsm5nxxxzf2jfwione.png",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    nominee_aadhaar_image: {
      value: "https://res.cloudinary.com/dhyrkd5pe/image/upload/v1766220225/j1km3pkwtvdpmbvrj7fg.jpg",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    nominee_pan_image: {
      value: "https://res.cloudinary.com/dhyrkd5pe/image/upload/v1766220226/yf4extbtqtizmi5zxszi.jpg",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    nominee_name: {
      value: "kl;qwk",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    nominee_dob: {
      value: "2000-12-11",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    nominee_phone: {
      value: "4792384732",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    nominee_email: {
      value: "anj@gmail.com",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    nominee_aadhaar: {
      value: "321313143141",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    nominee_pan: {
      value: "OPLPS7670Q",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    nominee_relation: {
      value: "mother",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    nominee_gender: {
      value: "male",
      status: "pending",
      reason: null,
      verifiedBy: null
    },
    nominee_address: {
      value: "roiehfioer",
      status: "pending",
      reason: null,
      verifiedBy: null
    }
  }
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: Clock,
      label: 'Pending'
    },
    approved: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: CheckCircle,
      label: 'Approved'
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: XCircle,
      label: 'Rejected'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

// Verifier Badge Component
const VerifierBadge = ({ role, verified, name }) => {
  const roleConfig = {
    admin: {
      bg: verified ? 'bg-purple-500' : 'bg-gray-200',
      text: verified ? 'text-white' : 'text-gray-500',
      icon: Shield,
      label: 'Admin'
    },
    supervisor: {
      bg: verified ? 'bg-blue-500' : 'bg-gray-200',
      text: verified ? 'text-white' : 'text-gray-500',
      icon: UserCheck,
      label: 'Supervisor'
    },
    manager: {
      bg: verified ? 'bg-teal-500' : 'bg-gray-200',
      text: verified ? 'text-white' : 'text-gray-500',
      icon: Briefcase,
      label: 'Manager'
    }
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${config.bg} ${config.text} transition-all duration-300`}>
      <Icon className="w-4 h-4" />
      <div className="flex flex-col">
        <span className="text-xs font-semibold">{config.label}</span>
        {verified && name && (
          <span className="text-[10px] opacity-80">{name}</span>
        )}
      </div>
      {verified && <CheckCircle className="w-4 h-4 ml-auto" />}
    </div>
  );
};

// Image Preview Component
const ImagePreview = ({ src, alt, onView }) => (
  <div className="relative group">
    <img
      src={src}
      alt={alt}
      className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 group-hover:border-indigo-400 transition-all duration-300"
    />
    <button
      onClick={() => onView(src)}
      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-all duration-300"
    >
      <Eye className="w-6 h-6 text-white" />
    </button>
  </div>
);

// Field Row Component
const FieldRow = ({ label, value, status, isImage, onViewImage, verifiedBy }) => {
  const displayValue = typeof value === 'object' && value.$numberDecimal
    ? value.$numberDecimal
    : value;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-gray-100 last:border-0 gap-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        {isImage ? (
          <ImagePreview src={displayValue} alt={label} onView={onViewImage} />
        ) : (
          <p className="text-base font-semibold text-gray-800">{displayValue}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={status} />
      </div>
    </div>
  );
};

// Section Component
const Section = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <Icon className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isOpen && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
};

// Image Viewer Modal
const ImageViewerModal = ({ isOpen, onClose, imageSrc }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
      <div className="relative max-w-4xl max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
        <img
          src={imageSrc}
          alt="Preview"
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

// Verification Panel Component
const VerificationPanel = ({ fieldKey, currentStatus, onVerify }) => {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin');

  const roles = [
    { id: 'admin', label: 'Admin', icon: Shield, color: 'purple' },
    { id: 'supervisor', label: 'Supervisor', icon: UserCheck, color: 'blue' },
    { id: 'manager', label: 'Manager', icon: Briefcase, color: 'teal' }
  ];

  return (
    <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <p className="text-sm font-medium text-gray-600 mb-3">Verify as:</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                selectedRole === role.id
                  ? `border-${role.color}-500 bg-${role.color}-50 text-${role.color}-700`
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{role.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onVerify(fieldKey, 'approved', selectedRole)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-emerald-500/25"
        >
          <CheckCircle className="w-4 h-4" />
          Approve
        </button>
        <button
          onClick={() => setShowRejectReason(!showRejectReason)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-red-500/25"
        >
          <XCircle className="w-4 h-4" />
          Reject
        </button>
      </div>
      
      {showRejectReason && (
        <div className="mt-3">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            rows={3}
          />
          <button
            onClick={() => {
              onVerify(fieldKey, 'rejected', selectedRole, reason);
              setShowRejectReason(false);
              setReason('');
            }}
            className="mt-2 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-300"
          >
            Confirm Rejection
          </button>
        </div>
      )}
    </div>
  );
};

// Main Modal Component
const ProfileVerificationModal = ({ isOpen, onClose, data = profileData.data }) => {
  const [imageViewer, setImageViewer] = useState({ isOpen: false, src: '' });
  const [expandedField, setExpandedField] = useState(null);
  const [profileStatus, setProfileStatus] = useState(data);

  const handleVerify = (fieldKey, status, role, reason = null) => {
    setProfileStatus(prev => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        status,
        reason,
        verifiedBy: {
          ...prev[fieldKey].verifiedBy,
          [role]: {
            verified: true,
            name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
            timestamp: new Date().toISOString()
          }
        }
      }
    }));
    setExpandedField(null);
  };

  const openImageViewer = (src) => {
    setImageViewer({ isOpen: true, src });
  };

  const formatLabel = (key) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getOverallProgress = () => {
    const fields = Object.keys(profileStatus).filter(k => k !== 'overallStatus');
    const approved = fields.filter(k => profileStatus[k].status === 'approved').length;
    return Math.round((approved / fields.length) * 100);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="absolute inset-4 sm:inset-8 lg:inset-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Profile Verification</h2>
                  <p className="text-indigo-200 text-sm mt-0.5">Review and verify all submitted documents</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-sm text-white/80 mb-2">
                <span>Verification Progress</span>
                <span className="font-semibold text-white">{getOverallProgress()}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${getOverallProgress()}%` }}
                />
              </div>
            </div>
            
            {/* Verifier Badges */}
            <div className="flex flex-wrap gap-3 mt-5">
              <VerifierBadge role="admin" verified={false} />
              <VerifierBadge role="supervisor" verified={false} />
              <VerifierBadge role="manager" verified={false} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Overall Status Alert */}
            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-4 ${
              profileStatus.overallStatus === 'pending'
                ? 'bg-amber-50 border border-amber-200'
                : profileStatus.overallStatus === 'approved'
                ? 'bg-emerald-50 border border-emerald-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <AlertCircle className={`w-6 h-6 ${
                profileStatus.overallStatus === 'pending'
                  ? 'text-amber-500'
                  : profileStatus.overallStatus === 'approved'
                  ? 'text-emerald-500'
                  : 'text-red-500'
              }`} />
              <div>
                <p className="font-semibold text-gray-800">
                  Overall Status: <span className="capitalize">{profileStatus.overallStatus}</span>
                </p>
                <p className="text-sm text-gray-600">
                  All fields require verification from Admin, Supervisor, and Manager
                </p>
              </div>
            </div>

            {/* Identity Documents Section */}
            <Section title="Identity Documents" icon={CreditCard}>
              {['aadhaar_image', 'aadhaar_number', 'pan_image', 'pan_number'].map((key) => (
                <div key={key}>
                  <FieldRow
                    label={formatLabel(key)}
                    value={profileStatus[key].value}
                    status={profileStatus[key].status}
                    isImage={key.includes('image')}
                    onViewImage={openImageViewer}
                    verifiedBy={profileStatus[key].verifiedBy}
                  />
                  <button
                    onClick={() => setExpandedField(expandedField === key ? null : key)}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2"
                  >
                    {expandedField === key ? 'Hide Verification Panel' : 'Verify This Field'}
                  </button>
                  {expandedField === key && (
                    <VerificationPanel
                      fieldKey={key}
                      currentStatus={profileStatus[key].status}
                      onVerify={handleVerify}
                    />
                  )}
                </div>
              ))}
            </Section>

            {/* Land Documents Section */}
            <Section title="Land Documents" icon={FileText}>
              <div className="py-4 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-3">Khatauni Documents</p>
                <div className="flex flex-wrap gap-4">
                  {profileStatus.khatauni_images.value.map((doc, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <ImagePreview
                        src={doc.image_url}
                        alt={`Khatauni ${doc.khatauni_id}`}
                        onView={openImageViewer}
                      />
                      <span className="text-xs text-gray-500">ID: {doc.khatauni_id}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <StatusBadge status={profileStatus.khatauni_images.status} />
                </div>
                <button
                  onClick={() => setExpandedField(expandedField === 'khatauni_images' ? null : 'khatauni_images')}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2"
                >
                  {expandedField === 'khatauni_images' ? 'Hide Verification Panel' : 'Verify This Field'}
                </button>
                {expandedField === 'khatauni_images' && (
                  <VerificationPanel
                    fieldKey="khatauni_images"
                    currentStatus={profileStatus.khatauni_images.status}
                    onVerify={handleVerify}
                  />
                )}
              </div>
              <FieldRow
                label="Land Size (Acres)"
                value={profileStatus.land_size.value}
                status={profileStatus.land_size.status}
              />
            </Section>

            {/* Address Section */}
            <Section title="Address Information" icon={MapPin}>
              {['address', 'tehsil', 'district', 'state', 'landmark', 'pin_code'].map((key) => (
                <div key={key}>
                  <FieldRow
                    label={formatLabel(key)}
                    value={profileStatus[key].value}
                    status={profileStatus[key].status}
                  />
                  <button
                    onClick={() => setExpandedField(expandedField === key ? null : key)}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2"
                  >
                    {expandedField === key ? 'Hide Verification Panel' : 'Verify This Field'}
                  </button>
                  {expandedField === key && (
                    <VerificationPanel
                      fieldKey={key}
                      currentStatus={profileStatus[key].status}
                      onVerify={handleVerify}
                    />
                  )}
                </div>
              ))}
            </Section>

            {/* Bank Details Section */}
            <Section title="Bank Details" icon={Building2}>
              {['bank_passbook_img', 'account_number', 'ifsc_code', 'account_holder', 'bank_name', 'branch_name'].map((key) => (
                <div key={key}>
                  <FieldRow
                    label={formatLabel(key)}
                    value={profileStatus[key].value}
                    status={profileStatus[key].status}
                    isImage={key.includes('img')}
                    onViewImage={openImageViewer}
                  />
                  <button
                    onClick={() => setExpandedField(expandedField === key ? null : key)}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2"
                  >
                    {expandedField === key ? 'Hide Verification Panel' : 'Verify This Field'}
                  </button>
                  {expandedField === key && (
                    <VerificationPanel
                      fieldKey={key}
                      currentStatus={profileStatus[key].status}
                      onVerify={handleVerify}
                    />
                  )}
                </div>
              ))}
            </Section>

            {/* Nominee Details Section */}
            <Section title="Nominee Details" icon={Users}>
              {[
                'nominee_image', 'nominee_name', 'nominee_dob', 'nominee_phone',
                'nominee_email', 'nominee_aadhaar_image', 'nominee_aadhaar',
                'nominee_pan_image', 'nominee_pan', 'nominee_relation',
                'nominee_gender', 'nominee_address'
              ].map((key) => (
                <div key={key}>
                  <FieldRow
                    label={formatLabel(key)}
                    value={profileStatus[key].value}
                    status={profileStatus[key].status}
                    isImage={key.includes('image')}
                    onViewImage={openImageViewer}
                  />
                  <button
                    onClick={() => setExpandedField(expandedField === key ? null : key)}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2"
                  >
                    {expandedField === key ? 'Hide Verification Panel' : 'Verify This Field'}
                  </button>
                  {expandedField === key && (
                    <VerificationPanel
                      fieldKey={key}
                      currentStatus={profileStatus[key].status}
                      onVerify={handleVerify}
                    />
                  )}
                </div>
              ))}
            </Section>
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <span>Pending</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  <span>Approved</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span>Rejected</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Close
                </button>
                <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25">
                  Save All Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      <ImageViewerModal
        isOpen={imageViewer.isOpen}
        onClose={() => setImageViewer({ isOpen: false, src: '' })}
        imageSrc={imageViewer.src}
      />
    </>
  );
};

// Demo App Component
export default function VerificationModel() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Profile Verification System</h1>
        <p className="text-slate-300 mb-8 max-w-md mx-auto">
          A comprehensive verification system for Admin, Supervisor, and Manager roles
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold text-lg shadow-2xl shadow-purple-500/30 transition-all duration-300 hover:scale-105"
        >
          Open Verification Modal
        </button>
      </div>

      <ProfileVerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={profileData.data}
      />
    </div>
  );
}