import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Briefcase,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Hash,
  Landmark,
  ChevronRight,
  Download,
  ChevronLeft,
  Maximize2,
  RotateCw,
  Eye,
  BadgeCheck,
  Clock,
  Shield,
  Info,
  Copy,
  Share2,
  Printer,
  Building2,
  CreditCard,
  GraduationCap,
  Heart,
  AlertCircle,
  Loader2,
  RefreshCw,
  Wallet,
  FileCheck,
  Activity,
  UserCheck,
  Globe,
  Droplet,
  Home,
  Award,
  History,
  PhoneCall,
  UserCog,
} from "lucide-react";
import API_BASE_URL from "@/utils/constants";

const StaffViewModal = ({ isOpen, onClose, staffId }) => {
  const [activeTab, setActiveTab] = useState("identity");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageRotation, setImageRotation] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copiedField, setCopiedField] = useState(null);

  // API States
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch staff data from API
  useEffect(() => {
    if (isOpen && staffId) {
      fetchStaffData();
    }
  }, [isOpen, staffId]);

  const fetchStaffData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/employee/getstaffdetail?staffId=${staffId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const result = await response.json();

      if (result.success) {
        setStaff(result.data);
      } else {
        setError(result.message || "Failed to fetch staff details");
      }
    } catch (err) {
      setError("Failed to fetch staff details. Please try again.");
      console.error("Error fetching staff:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("identity");
      setStaff(null);
      setError(null);
      setSelectedImage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (_error) {
      return dateString;
    }
  };

  // Helper function to format address
  const formatAddress = (address) => {
    if (!address) return "N/A";
    const parts = [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.country,
      address.postalCode,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  // Copy to clipboard function
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Download image function
  const handleDownloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `staff-profile-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (_error) {
      window.open(imageUrl, "_blank");
    }
  };

  // Print profile function
  const handlePrint = () => {
    window.print();
  };

  // Share profile function
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Staff Profile - ${staff?.name}`,
        text: `View profile of ${staff?.name}`,
        url: window.location.href,
      });
    }
  };

  // Open image viewer with all images context
  const openImageViewer = (image, images = [image]) => {
    const imageArray = Array.isArray(images) ? images : [images];
    setAllImages(imageArray);
    setCurrentImageIndex(
      imageArray.indexOf(image) !== -1 ? imageArray.indexOf(image) : 0
    );
    setSelectedImage(image);
    setImageRotation(0);
  };

  // Navigate images
  const navigateImage = (direction) => {
    const newIndex =
      direction === "next"
        ? (currentImageIndex + 1) % allImages.length
        : (currentImageIndex - 1 + allImages.length) % allImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
    setImageRotation(0);
  };

  // Image Popup Modal Component
  const ImagePopup = ({ image, onClose }) => {
    if (!image) return null;
    return (
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60]"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 group z-10"
        >
          <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
        </button>
        {allImages.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
            <span className="text-white text-sm font-medium">
              {currentImageIndex + 1} / {allImages.length}
            </span>
          </div>
        )}
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("prev");
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 group"
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("next");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 group"
            >
              <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          </>
        )}
        <div
          className="relative max-w-[85vw] max-h-[85vh] p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <img
              src={image}
              alt="Staff"
              className="max-w-full max-h-[75vh] object-contain transition-transform duration-500"
              style={{ transform: `rotate(${imageRotation}deg)` }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2.5 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
              <button
                onClick={() => setImageRotation((prev) => prev - 90)}
                className="p-2.5 hover:bg-white/20 rounded-lg transition-all duration-200 group"
                title="Rotate Left"
              >
                <RotateCw className="w-4 h-4 text-white transform -scale-x-100 group-hover:rotate-[-90deg] transition-transform duration-300" />
              </button>
              <div className="w-px h-6 bg-white/20" />
              <button
                onClick={() => setImageRotation((prev) => prev + 90)}
                className="p-2.5 hover:bg-white/20 rounded-lg transition-all duration-200 group"
                title="Rotate Right"
              >
                <RotateCw className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>
              <div className="w-px h-6 bg-white/20" />
              <button
                onClick={() => window.open(image, "_blank")}
                className="p-2.5 hover:bg-white/20 rounded-lg transition-all duration-200 group"
                title="Open in New Tab"
              >
                <Maximize2 className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
              </button>
              <div className="w-px h-6 bg-white/20" />
              <button
                onClick={() => handleDownloadImage(image)}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg transition-all duration-300 hover:scale-105"
                title="Download"
              >
                <Download className="w-4 h-4 text-white" />
                <span className="text-white font-medium text-sm">Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // View Only Field Component
  const ViewOnlyField = ({
    label,
    value,
    field,
    relatedImage = null,
    icon,
    maskValue = false,
  }) => {
    if (!value || value === "N/A" || (Array.isArray(value) && value.length === 0)) return null;
    const displayValue = maskValue
      ? String(value).replace(/\d(?=\d{4})/g, "*")
      : value;
    return (
      <div className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all duration-300">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow">
                <div className="text-white">{icon}</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {label}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-semibold text-gray-900">
                    {displayValue}
                  </p>
                  <button
                    onClick={() => copyToClipboard(String(value), field)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedField === field ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </button>
                </div>
                {relatedImage && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2.5 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Supporting Documents
                    </p>
                    <div className="flex gap-2.5 flex-wrap">
                      {Array.isArray(relatedImage) ? (
                        relatedImage.map((img, index) => (
                          <ImageThumbnail
                            key={index}
                            src={img}
                            alt={`${label} ${index + 1}`}
                            onClick={() => openImageViewer(img, relatedImage)}
                          />
                        ))
                      ) : (
                        <ImageThumbnail
                          src={relatedImage}
                          alt={label}
                          onClick={() => openImageViewer(relatedImage)}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Image Thumbnail Component
  const ImageThumbnail = ({ src, alt, onClick }) => (
    <div className="relative group cursor-pointer" onClick={onClick}>
      <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 ring-1 ring-gray-200 hover:ring-indigo-400">
        <img src={src} alt={alt} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Eye className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  // Section Header Component
  const SectionHeader = ({ icon: Icon, title, color = "from-indigo-500 to-purple-600" }) => (
    <div className="flex items-center gap-2 mb-3">
      <div className={`p-1.5 bg-gradient-to-br ${color} rounded-lg shadow-sm`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
    </div>
  );

  // Tabs configuration
  const tabs = [
    {
      id: "identity",
      label: "Personal Info",
      icon: User,
      color: "from-indigo-500 to-purple-600",
    },
    {
      id: "work",
      label: "Employment",
      icon: Briefcase,
      color: "from-emerald-500 to-green-600",
    },
    {
      id: "documents",
      label: "Documents & IDs",
      icon: FileText,
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: "finance",
      label: "Bank & Salary",
      icon: Wallet,
      color: "from-amber-500 to-orange-600",
    },
    {
      id: "additional",
      label: "Additional",
      icon: Info,
      color: "from-violet-500 to-purple-600",
    },
  ];

  // Get status badge
  const getStatusBadge = (isActive, employmentStatus) => {
    if (isActive && employmentStatus === "Active") {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          <span className="text-xs font-medium text-green-700">Active</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full">
        <X className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-xs font-medium text-gray-700">Inactive</span>
      </div>
    );
  };

  // Get engagement badge
  const getEngagementBadge = (isEngaged) => {
    if (isEngaged) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 rounded-full">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs font-medium text-blue-700">Assigned</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 rounded-full">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span className="text-xs font-medium text-amber-700">Unassigned</span>
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading staff details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={fetchStaffData}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No Data State
  if (!staff) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Data Found</h3>
          <p className="text-gray-600 text-center mb-6">
            Staff details could not be found.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
            </div>
            <div className="relative px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Profile Photo */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-white/20 rounded-full blur animate-pulse"></div>
                    <div
                      className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/50 cursor-pointer hover:border-white transition-colors"
                      onClick={() => staff.photo && openImageViewer(staff.photo)}
                    >
                      <img
                        src={staff.photo}
                        alt={staff.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Staff Badge */}
                    <div className="absolute -bottom-1 -right-1 p-1 bg-indigo-500 rounded-full border-2 border-white">
                      <UserCog className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      {staff.name}
                      {staff.is_active && (
                        <BadgeCheck className="w-5 h-5 text-green-300" />
                      )}
                    </h2>
                    <div className="flex items-center gap-3 text-white/70 text-xs mt-1">
                      <span className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {staff.employee_id}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 capitalize">
                        <UserCog className="w-3 h-3" />
                        {staff.role}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Joined: {formatDate(staff.date_of_joining)}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Status and Actions */}
                <div className="flex items-center gap-3">
                  {getStatusBadge(staff.is_active, staff.employment_status)}
                  {getEngagementBadge(staff.is_engaged)}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrint}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
                      title="Print Profile"
                    >
                      <Printer className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
                      title="Share Profile"
                    >
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={onClose}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-90 ml-2"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 gap-2 flex-shrink-0 border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-4 py-2 flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 ${activeTab === tab.id
                    ? `bg-white text-gray-800 shadow-md scale-[1.02] border border-gray-200`
                    : "text-gray-500 hover:bg-white/50 hover:text-gray-700"
                    }`}
                >
                  <div
                    className={`p-1.5 rounded-lg bg-gradient-to-br ${activeTab === tab.id ? tab.color : "from-gray-300 to-gray-400"
                      } shadow-sm`}
                  >
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="space-y-3">
              {/* Personal Info Tab */}
              {activeTab === "identity" && (
                <>
                  <SectionHeader icon={User} title="Basic Information" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <ViewOnlyField
                      label="Full Name"
                      value={staff.name}
                      field="name"
                      icon={<User className="w-4 h-4" />}
                    />
                    <ViewOnlyField
                      label="Employee ID"
                      value={staff.employee_id}
                      field="employee_id"
                      icon={<Hash className="w-4 h-4" />}
                    />
                    <ViewOnlyField
                      label="Date of Birth"
                      value={formatDate(staff.dob)}
                      field="dob"
                      icon={<Calendar className="w-4 h-4" />}
                    />
                    <ViewOnlyField
                      label="Gender"
                      value={staff.gender?.charAt(0).toUpperCase() + staff.gender?.slice(1)}
                      field="gender"
                      icon={<User className="w-4 h-4" />}
                    />
                    <ViewOnlyField
                      label="Marital Status"
                      value={staff.marital_status}
                      field="marital_status"
                      icon={<Heart className="w-4 h-4" />}
                    />
                    <ViewOnlyField
                      label="Nationality"
                      value={staff.nationality}
                      field="nationality"
                      icon={<Globe className="w-4 h-4" />}
                    />
                    <ViewOnlyField
                      label="Blood Group"
                      value={staff.blood_group}
                      field="blood_group"
                      icon={<Droplet className="w-4 h-4" />}
                    />
                  </div>

                  <SectionHeader icon={Phone} title="Contact Information" color="from-green-500 to-emerald-600" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <ViewOnlyField
                      label="Primary Phone"
                      value={staff.phone_number}
                      field="phone_number"
                      icon={<Phone className="w-4 h-4" />}
                    />
                    <ViewOnlyField
                      label="Secondary Phone"
                      value={staff.secondary_phone_number}
                      field="secondary_phone_number"
                      icon={<Phone className="w-4 h-4" />}
                    />
                    <ViewOnlyField
                      label="Email Address"
                      value={staff.email}
                      field="email"
                      icon={<Mail className="w-4 h-4" />}
                    />
                  </div>

                  <SectionHeader icon={Home} title="Address Information" color="from-orange-500 to-red-600" />
                  <div className="grid grid-cols-1 gap-3">
                    <ViewOnlyField
                      label="Permanent Address"
                      value={formatAddress(staff.permanent_address)}
                      field="permanent_address"
                      icon={<MapPin className="w-4 h-4" />}
                    />
                    {!staff.same_as_permanent && (
                      <ViewOnlyField
                        label="Current Address"
                        value={formatAddress(staff.current_address)}
                        field="current_address"
                        icon={<MapPin className="w-4 h-4" />}
                      />
                    )}
                    {staff.same_as_permanent && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700 flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Current address is same as permanent address
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Profile Photo Section */}
                  <SectionHeader icon={ImageIcon} title="Profile Photo" color="from-purple-500 to-pink-600" />
                  <div className="p-4 rounded-xl border border-gray-200 bg-white">
                    <div className="flex items-center gap-4">
                      <ImageThumbnail
                        src={staff.photo}
                        alt="Profile Photo"
                        onClick={() => openImageViewer(staff.photo)}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Profile Picture</p>
                        <p className="text-xs text-gray-500 mt-1">Click to view full image</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Employment Tab */}
              {activeTab === "work" && (
                <>
                  <SectionHeader icon={Briefcase} title="Employment Details" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <ViewOnlyField
                      label="Role"
                      value={staff.role?.charAt(0).toUpperCase() + staff.role?.slice(1)}
                      field="role"
                      icon={<Briefcase className="w-4 h-4" />}
                    />
                    <ViewOnlyField
                      label="Department"
                      value={staff.department}
                      field="department"
                      icon={<Building2 className="w-4 h-4" />}
                    />
                    <ViewOnlyField
                      label="Designation"
                      value={staff.designation}
                      field="designation"
                      icon={<Award className="w-4 h-4" />}
                    />
                    <ViewOnlyField
                      label="Employment Type"
                      value={staff.employment_type}
                      field="employment_type"
                      icon={<FileCheck className="w-4 h-4" />}
                    />
                    <ViewOnlyField
                      label="Employment Status"
                      value={staff.employment_status}
                      field="employment_status"
                      icon={<Activity className="w-4 h-4" />}
                    />
                    <ViewOnlyField
                      label="Date of Joining"
                      value={formatDate(staff.date_of_joining)}
                      field="date_of_joining"
                      icon={<Calendar className="w-4 h-4" />}
                    />
                    <ViewOnlyField
                      label="Registration Date"
                      value={formatDate(staff.registration_date)}
                      field="registration_date"
                      icon={<Calendar className="w-4 h-4" />}
                    />
                    <ViewOnlyField
                      label="Total Experience"
                      value={`${staff.total_experience_years || 0} Years`}
                      field="total_experience_years"
                      icon={<Clock className="w-4 h-4" />}
                    />
                  </div>

                  {/* Office/Branch Assignment */}
                  {staff.office && (
                    <>
                      <SectionHeader icon={Building2} title="Office Assignment" color="from-indigo-500 to-purple-600" />
                      <div className="p-4 rounded-xl border border-gray-200 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Office Name</p>
                            <p className="text-sm font-semibold text-gray-800">{staff.office.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Location</p>
                            <p className="text-sm font-semibold text-gray-800">{staff.office.location}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Branch Code</p>
                            <p className="text-sm font-semibold text-gray-800">{staff.office.branch_code}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Reporting Manager */}
                  {staff.reporting_manager && (
                    <>
                      <SectionHeader icon={UserCheck} title="Reporting Manager" color="from-teal-500 to-cyan-600" />
                      <div className="p-4 rounded-xl border border-gray-200 bg-white">
                        <p className="text-sm font-semibold text-gray-800">{staff.reporting_manager}</p>
                      </div>
                    </>
                  )}

                  {/* Skills */}
                  {staff.skills && staff.skills.length > 0 && (
                    <>
                      <SectionHeader icon={Award} title="Skills" color="from-amber-500 to-orange-600" />
                      <div className="p-4 rounded-xl border border-gray-200 bg-white">
                        <div className="flex flex-wrap gap-2">
                          {staff.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Work Experience */}
                  {staff.experience && staff.experience.length > 0 && (
                    <>
                      <SectionHeader icon={History} title="Work Experience" color="from-violet-500 to-purple-600" />
                      <div className="space-y-3">
                        {staff.experience.map((exp, index) => (
                          <div key={index} className="p-4 rounded-xl border border-gray-200 bg-white">
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-800">{exp.title}</h5>
                                <p className="text-sm text-gray-600">{exp.companyName}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">
                                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                </p>
                                {exp.lastDrawnSalary && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Last Salary: ₹{exp.lastDrawnSalary?.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            {exp.responsibilities && (
                              <p className="text-xs text-gray-600 mt-2 border-t pt-2">
                                {exp.responsibilities}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Onboarding Status */}
                  <div className={`p-4 rounded-xl border ${staff.onboarding_completed
                    ? "bg-green-50 border-green-200"
                    : "bg-amber-50 border-amber-200"
                    }`}>
                    <div className="flex items-center gap-3">
                      {staff.onboarding_completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-600" />
                      )}
                      <div>
                        <p className={`text-sm font-semibold ${staff.onboarding_completed ? "text-green-800" : "text-amber-800"
                          }`}>
                          Onboarding {staff.onboarding_completed ? "Completed" : "In Progress"}
                        </p>
                        <p className={`text-xs ${staff.onboarding_completed ? "text-green-700" : "text-amber-700"
                          }`}>
                          Step {staff.step_completed} of 7 completed
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Documents Tab */}
              {activeTab === "documents" && (
                <>
                  <SectionHeader icon={FileText} title="Government IDs" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <ViewOnlyField
                      label="PAN Number"
                      value={staff.govt_ids?.pan_number}
                      field="pan_number"
                      maskValue
                      icon={<CreditCard className="w-4 h-4" />}
                    />
                    <ViewOnlyField
                      label="Aadhaar Number"
                      value={staff.govt_ids?.aadhaar_number}
                      field="aadhaar_number"
                      maskValue
                      icon={<CreditCard className="w-4 h-4" />}
                    />
                    <ViewOnlyField
                      label="Passport Number"
                      value={staff.govt_ids?.passport_number}
                      field="passport_number"
                      icon={<FileText className="w-4 h-4" />}
                    />
                    {staff.govt_ids?.passport_expiry && (
                      <ViewOnlyField
                        label="Passport Expiry"
                        value={formatDate(staff.govt_ids?.passport_expiry)}
                        field="passport_expiry"
                        icon={<Calendar className="w-4 h-4" />}
                      />
                    )}
                    <ViewOnlyField
                      label="PF Number"
                      value={staff.govt_ids?.pf_number}
                      field="pf_number"
                      icon={<FileText className="w-4 h-4" />}
                    />
                    <ViewOnlyField
                      label="ESI Number"
                      value={staff.govt_ids?.esi_number}
                      field="esi_number"
                      icon={<FileText className="w-4 h-4" />}
                    />
                  </div>

                  {/* No Documents Message */}
                  {(!staff.govt_ids?.pan_number &&
                    !staff.govt_ids?.aadhaar_number &&
                    !staff.govt_ids?.passport_number) && (
                      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50">
                        <p className="text-sm text-amber-700 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          No government ID documents have been added yet.
                        </p>
                      </div>
                    )}

                  {/* Education */}
                  <SectionHeader icon={GraduationCap} title="Education" color="from-blue-500 to-indigo-600" />
                  {staff.education && staff.education.length > 0 ? (
                    <div className="space-y-3">
                      {staff.education.map((edu, index) => (
                        <div key={index} className="p-4 rounded-xl border border-gray-200 bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Qualification</p>
                              <p className="text-sm font-semibold text-gray-800">{edu.qualification}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Institution</p>
                              <p className="text-sm font-semibold text-gray-800">{edu.institution}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Board/University</p>
                              <p className="text-sm font-semibold text-gray-800">{edu.boardOrUniversity}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Year of Passing</p>
                              <p className="text-sm font-semibold text-gray-800">{edu.yearOfPassing}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Percentage/CGPA</p>
                              <p className="text-sm font-semibold text-gray-800">{edu.percentageOrCgpa}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        No education details have been added yet.
                      </p>
                    </div>
                  )}

                  {/* Certifications */}
                  <SectionHeader icon={Award} title="Certifications" color="from-amber-500 to-orange-600" />
                  {staff.certifications && staff.certifications.length > 0 ? (
                    <div className="space-y-3">
                      {staff.certifications.map((cert, index) => (
                        <div key={index} className="p-4 rounded-xl border border-gray-200 bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Title</p>
                              <p className="text-sm font-semibold text-gray-800">{cert.title}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Issuer</p>
                              <p className="text-sm font-semibold text-gray-800">{cert.issuer}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Issue Date</p>
                              <p className="text-sm font-semibold text-gray-800">{formatDate(cert.issueDate)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Expiry Date</p>
                              <p className="text-sm font-semibold text-gray-800">{formatDate(cert.expiryDate)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        No certifications have been added yet.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Finance Tab */}
              {activeTab === "finance" && (
                <>
                  <SectionHeader icon={Wallet} title="Salary Information" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {staff.salary ? (
                      <ViewOnlyField
                        label="Monthly Salary"
                        value={`₹${staff.salary?.toLocaleString()}`}
                        field="salary"
                        icon={<Wallet className="w-4 h-4" />}
                      />
                    ) : (
                      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50">
                        <p className="text-sm text-amber-700 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Salary information not available
                        </p>
                      </div>
                    )}
                    <ViewOnlyField
                      label="Tax Status"
                      value={staff.govt_ids?.tax_status}
                      field="tax_status"
                      icon={<FileText className="w-4 h-4" />}
                    />
                  </div>

                  <SectionHeader icon={Landmark} title="Bank Account Details" color="from-green-500 to-emerald-600" />
                  {staff.bank_details && (
                    staff.bank_details.account_number ||
                    staff.bank_details.bank_name ||
                    staff.bank_details.account_holder
                  ) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <ViewOnlyField
                        label="Account Holder Name"
                        value={staff.bank_details.account_holder}
                        field="account_holder"
                        icon={<User className="w-4 h-4" />}
                      />
                      <ViewOnlyField
                        label="Account Number"
                        value={staff.bank_details.account_number}
                        field="account_number"
                        maskValue
                        icon={<CreditCard className="w-4 h-4" />}
                      />
                      <ViewOnlyField
                        label="Bank Name"
                        value={staff.bank_details.bank_name}
                        field="bank_name"
                        icon={<Landmark className="w-4 h-4" />}
                      />
                      <ViewOnlyField
                        label="Branch Name"
                        value={staff.bank_details.branch_name}
                        field="branch_name"
                        icon={<MapPin className="w-4 h-4" />}
                      />
                      <ViewOnlyField
                        label="IFSC Code"
                        value={staff.bank_details.ifsc_code}
                        field="ifsc_code"
                        icon={<Hash className="w-4 h-4" />}
                      />
                      <ViewOnlyField
                        label="UPI ID"
                        value={staff.bank_details.upi_id}
                        field="upi_id"
                        icon={<CreditCard className="w-4 h-4" />}
                      />
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50">
                      <p className="text-sm text-amber-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Bank account details have not been added yet.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Additional Info Tab */}
              {activeTab === "additional" && (
                <>
                  {/* Emergency Contacts */}
                  <SectionHeader icon={PhoneCall} title="Emergency Contacts" color="from-red-500 to-rose-600" />
                  {staff.emergency_contacts && staff.emergency_contacts.length > 0 ? (
                    <div className="space-y-3">
                      {staff.emergency_contacts.map((contact, index) => (
                        <div key={index} className="p-4 rounded-xl border border-gray-200 bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Name</p>
                              <p className="text-sm font-semibold text-gray-800">{contact.name}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Relationship</p>
                              <p className="text-sm font-semibold text-gray-800">{contact.relationship}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Phone</p>
                              <p className="text-sm font-semibold text-gray-800">{contact.phone}</p>
                            </div>
                            {contact.alternatePhone && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Alternate Phone</p>
                                <p className="text-sm font-semibold text-gray-800">{contact.alternatePhone}</p>
                              </div>
                            )}
                            {contact.address && (
                              <div className="md:col-span-2">
                                <p className="text-xs text-gray-500 mb-1">Address</p>
                                <p className="text-sm font-semibold text-gray-800">{contact.address}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        No emergency contacts have been added yet.
                      </p>
                    </div>
                  )}

                  {/* Medical Information */}
                  <SectionHeader icon={Activity} title="Medical Information" color="from-pink-500 to-rose-600" />
                  {staff.medical_conditions ? (
                    <ViewOnlyField
                      label="Medical Conditions"
                      value={staff.medical_conditions}
                      field="medical_conditions"
                      icon={<Activity className="w-4 h-4" />}
                    />
                  ) : (
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        No medical conditions reported
                      </p>
                    </div>
                  )}

                  {/* Background Check */}
                  <SectionHeader icon={Shield} title="Background Verification" color="from-indigo-500 to-purple-600" />
                  <div className={`p-4 rounded-xl border ${staff.background_check_status === "Passed"
                    ? "bg-green-50 border-green-200"
                    : staff.background_check_status === "Failed"
                      ? "bg-red-50 border-red-200"
                      : "bg-amber-50 border-amber-200"
                    }`}>
                    <div className="flex items-center gap-3">
                      {staff.background_check_status === "Passed" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : staff.background_check_status === "Failed" ? (
                        <X className="w-5 h-5 text-red-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-600" />
                      )}
                      <div>
                        <p className={`text-sm font-semibold ${staff.background_check_status === "Passed"
                          ? "text-green-800"
                          : staff.background_check_status === "Failed"
                            ? "text-red-800"
                            : "text-amber-800"
                          }`}>
                          Background Check: {staff.background_check_status || "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* HR Notes */}
                  <SectionHeader icon={FileText} title="HR Notes" color="from-gray-500 to-gray-600" />
                  {staff.hr_notes ? (
                    <div className="p-4 rounded-xl border border-gray-200 bg-white">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{staff.hr_notes}</p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        No HR notes available
                      </p>
                    </div>
                  )}

                  {/* System Information */}
                  <SectionHeader icon={Info} title="System Information" color="from-gray-500 to-gray-600" />
                  <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Created At</p>
                        <p className="text-xs font-medium text-gray-700">{formatDate(staff.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Updated At</p>
                        <p className="text-xs font-medium text-gray-700">{formatDate(staff.updated_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Is Engaged</p>
                        <p className="text-xs font-medium text-gray-700">{staff.is_engaged ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Profile ID</p>
                        <p className="text-xs font-medium text-gray-700 truncate" title={staff.employee_profile_id}>
                          {staff.employee_profile_id?.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 px-5 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Info className="w-3.5 h-3.5" />
                <span>Read-only view. Contact administrator for any changes.</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={fetchStaffData}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium text-sm flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium text-sm flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-sm transform hover:scale-105"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Popup */}
      {selectedImage && (
        <ImagePopup image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </>
  );
};

export default StaffViewModal;