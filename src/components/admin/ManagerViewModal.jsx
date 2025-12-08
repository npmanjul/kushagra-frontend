import React, { useState } from "react";
import {
  X,
  User,
  Briefcase,
  Users,
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
} from "lucide-react";

const ManagerViewModal = ({ isOpen, onClose, managerData }) => {
  const [activeTab, setActiveTab] = useState("identity");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageRotation, setImageRotation] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copiedField, setCopiedField] = useState(null);

  // Example manager data fallback
  const manager = managerData || {
    id: "MGR001",
    name: "Sunil Mehra",
    phone: "+91 9876543200",
    email: "sunil.mehra@grainbank.com",
    status: "active",
    avatar: "SM",
    joinDate: "2022-03-10",
    role: "Regional Manager",
    department: "Operations",
    location: "Lucknow",
    district: "Lucknow",
    state: "Uttar Pradesh",
    assignedSupervisors: 12,
    assignedFarmers: 320,
    dob: "1980-01-15",
    gender: "Male",
    address: "45, MG Road, Lucknow",
    pin_code: "226001",
    profile_image: "https://randomuser.me/api/portraits/men/32.jpg",
    verification_status: "approved",
    submitted_date: "2022-03-09",
    verified_date: "2022-03-10",
    verified_by: "Admin User",
  };

  if (!isOpen) return null;

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
      link.download = `manager-profile-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(imageUrl, "_blank");
    }
  };

  // Print profile function
  const handlePrint = () => {
    window.print();
  };

  // Share profile function
  const handleShare = () => {
    // Implement share functionality
    console.log("Share profile");
  };

  // Open image viewer with all images context
  const openImageViewer = (image, images = [image]) => {
    const imageArray = Array.isArray(images) ? images : [images];
    setAllImages(imageArray);
    setCurrentImageIndex(imageArray.indexOf(image) !== -1 ? imageArray.indexOf(image) : 0);
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

  // Image Popup Modal
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
              alt="Manager"
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

  const ViewOnlyField = ({ label, value, field, relatedImage = null, icon, maskValue = false }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    const displayValue = maskValue ? value.replace(/\d(?=\d{4})/g, "*") : value;
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
                  {manager.verification_status === "approved" && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-full">
                      <BadgeCheck className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-700 font-medium">Verified</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-semibold text-gray-900">{displayValue}</p>
                  <button
                    onClick={() => copyToClipboard(value, field)}
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

  const tabs = [
    { id: "identity", label: "Identity & Contact", icon: User, color: "from-blue-500 to-indigo-600" },
    { id: "work", label: "Work Details", icon: Briefcase, color: "from-violet-500 to-purple-600" },
    { id: "summary", label: "Profile Summary", icon: FileText, color: "from-amber-500 to-orange-600" },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Approved" },
      pending: { bg: "bg-amber-100", text: "text-amber-700", icon: Clock, label: "Pending" },
      rejected: { bg: "bg-red-100", text: "text-red-700", icon: X, label: "Rejected" },
      active: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Active" },
      inactive: { bg: "bg-gray-100", text: "text-gray-700", icon: X, label: "Inactive" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1 ${config.bg} rounded-full`}>
        <Icon className="w-3.5 h-3.5" />
        <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
            </div>
            <div className="relative px-5 py-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-white/20 rounded-lg blur animate-pulse"></div>
                    <div className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      Manager Profile
                    </h2>
                    <div className="flex items-center gap-3 text-white/70 text-xs">
                      <span>{manager.name}</span>
                      <span>•</span>
                      <span>ID: {manager.id}</span>
                      <span>•</span>
                      <span>Joined: {new Date(manager.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {/* Status and Actions */}
                <div className="flex items-center gap-3">
                  {getStatusBadge(manager.status)}
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
          <div className="flex bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 gap-2 flex-shrink-0 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-2 flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? `bg-white text-gray-800 shadow-md scale-[1.02] border border-gray-200`
                      : "text-gray-500 hover:bg-white/50 hover:text-gray-700"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg bg-gradient-to-br ${
                      activeTab === tab.id ? tab.color : "from-gray-300 to-gray-400"
                    } shadow-sm`}
                  >
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="space-y-3">
              {/* Identity Tab */}
              {activeTab === "identity" && (
                <>
                  <ViewOnlyField
                    label="Full Name"
                    value={manager.name}
                    field="name"
                    icon={<User className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Phone Number"
                    value={manager.phone}
                    field="phone"
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Email Address"
                    value={manager.email}
                    field="email"
                    icon={<Mail className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Date of Birth"
                    value={manager.dob}
                    field="dob"
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Gender"
                    value={manager.gender}
                    field="gender"
                    icon={<User className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Complete Address"
                    value={`${manager.address}, ${manager.district}, ${manager.state} - ${manager.pin_code}`}
                    field="address"
                    icon={<MapPin className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Profile Photo"
                    value="Profile Picture"
                    field="profile_image"
                    relatedImage={manager.profile_image}
                    icon={<User className="w-4 h-4" />}
                  />
                </>
              )}

              {/* Work Tab */}
              {activeTab === "work" && (
                <>
                  <ViewOnlyField
                    label="Role"
                    value={manager.role}
                    field="role"
                    icon={<Briefcase className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Department"
                    value={manager.department}
                    field="department"
                    icon={<Briefcase className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Location"
                    value={`${manager.location}, ${manager.district}, ${manager.state}`}
                    field="location"
                    icon={<MapPin className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Assigned Supervisors"
                    value={manager.assignedSupervisors}
                    field="assignedSupervisors"
                    icon={<Users className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Assigned Farmers"
                    value={manager.assignedFarmers}
                    field="assignedFarmers"
                    icon={<Users className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Joining Date"
                    value={manager.joinDate}
                    field="joinDate"
                    icon={<Calendar className="w-4 h-4" />}
                  />
                </>
              )}

              {/* Summary Tab */}
              {activeTab === "summary" && (
                <div className="space-y-4">
                  {/* Profile Summary Card */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Info className="w-4 h-4 text-indigo-600" />
                      Profile Overview
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Full Name</p>
                        <p className="text-sm font-semibold text-gray-800">{manager.name}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                        <p className="text-sm font-semibold text-gray-800">{manager.phone}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm font-semibold text-gray-800">{manager.email}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">District</p>
                        <p className="text-sm font-semibold text-gray-800">{manager.district}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Role</p>
                        <p className="text-sm font-semibold text-gray-800">{manager.role}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Supervisors</p>
                        <p className="text-sm font-semibold text-gray-800">{manager.assignedSupervisors}</p>
                      </div>
                    </div>
                  </div>
                  {/* Verification Information */}
                  {manager.verification_status === "approved" && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-green-800 mb-1">Profile Verified</p>
                          <p className="text-xs text-green-700">
                            Verified by {manager.verified_by} on {new Date(manager.verified_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Important Dates */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                    <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      Important Dates
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Joined</p>
                          <p className="text-sm font-medium text-gray-800">
                            {new Date(manager.joinDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Submitted</p>
                          <p className="text-sm font-medium text-gray-800">
                            {new Date(manager.submitted_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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

export default ManagerViewModal;