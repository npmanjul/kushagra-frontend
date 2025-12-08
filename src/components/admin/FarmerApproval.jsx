import React, { useState } from "react";
import {
  X,
  Check,
  XCircle,
  User,
  CreditCard,
  Building2,
  Users,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Hash,
  Landmark,
  ZoomIn,
  ChevronRight,
  Download,
  ChevronLeft,
  Maximize2,
  RotateCw,
  Eye,
  Sparkles,
  BadgeCheck,
  Clock,
  ArrowRight,
} from "lucide-react";

const FarmerApproval = ({ isOpen, onClose, onSubmit }) => {
  const [verificationStatus, setVerificationStatus] = useState({});
  const [activeTab, setActiveTab] = useState("identity");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageRotation, setImageRotation] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const farmerData = {
    // Basic identity
    aadhaar_number: "1234-5678-9012",
    pan_number: "ABCDE1234F",
    aadhaar_image: "https://images.unsplash.com/photo-1578662996442-48f60103fc27?w=800",
    pan_image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    khatauni_images: [
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800",
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
    ],
    user_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",

    // Address
    address: "Village Rampur, Post Belghat",
    tehsil: "Gola",
    district: "Gorakhpur",
    state: "Uttar Pradesh",
    landmark: "Near Shiv Mandir",
    pin_code: "273402",

    // Land details
    land_size: "2.5",

    // Bank details
    account_number: "1234567890",
    ifsc_code: "SBIN0001234",
    account_holder: "John Doe",
    bank_name: "State Bank of India",
    branch_name: "Gorakhpur Branch",
    bank_passbook_img: "https://images.unsplash.com/photo-1554224155-1696413565d3?w=800",

    // Nominee details
    nominee_name: "Rahul Kumar",
    nominee_dob: "1998-05-12",
    nominee_phone: "9876543210",
    nominee_email: "rahul@example.com",
    nominee_aadhaar: "5678-9012-3456",
    nominee_pan: "XYZAB1234K",
    nominee_relation: "Brother",
    nominee_gender: "Male",
    nominee_address: "Village Rampur, Post Belghat",
    nominee_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800",
    nominee_aadhaar_image: "https://images.unsplash.com/photo-1578662996442-48f60103fc27?w=800",
    nominee_pan_image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
  };

  if (!isOpen) return null;

  const handleVerification = (field, status) => {
    setVerificationStatus((prev) => ({
      ...prev,
      [field]: status,
    }));
  };

  const handleSubmitVerification = () => {
    onSubmit(verificationStatus);
    onClose();
  };

  const getStatusColor = (field) => {
    if (verificationStatus[field] === "accepted")
      return "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-md hover:shadow-lg";
    if (verificationStatus[field] === "rejected")
      return "bg-gradient-to-br from-red-50 to-rose-50 border-red-300 shadow-md hover:shadow-lg";
    return "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md";
  };

  const getStatusIcon = (field) => {
    if (verificationStatus[field] === "accepted")
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          <span className="text-xs font-semibold text-white">Verified</span>
        </div>
      );
    if (verificationStatus[field] === "rejected")
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-full">
          <XCircle className="w-3.5 h-3.5 text-white" />
          <span className="text-xs font-semibold text-white">Rejected</span>
        </div>
      );
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full">
        <Clock className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-xs font-semibold text-gray-500">Pending</span>
      </div>
    );
  };

  const getFieldIcon = (fieldName) => {
    const iconMap = {
      aadhaar_number: Hash,
      pan_number: CreditCard,
      account_number: CreditCard,
      ifsc_code: Landmark,
      phone: Phone,
      email: Mail,
      dob: Calendar,
      address: MapPin,
    };

    for (const [key, Icon] of Object.entries(iconMap)) {
      if (fieldName.toLowerCase().includes(key)) {
        return <Icon className="w-4 h-4" />;
      }
    }
    return <FileText className="w-4 h-4" />;
  };

  // Download image function
  const handleDownloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `document-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(imageUrl, "_blank");
    }
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
    const newIndex = direction === "next" 
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
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 group z-10"
        >
          <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Image counter */}
        {allImages.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
            <span className="text-white text-sm font-medium">
              {currentImageIndex + 1} / {allImages.length}
            </span>
          </div>
        )}

        {/* Navigation arrows */}
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

        {/* Main image container */}
        <div
          className="relative max-w-[85vw] max-h-[85vh] p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <img
              src={image}
              alt="Document"
              className="max-w-full max-h-[75vh] object-contain transition-transform duration-500"
              style={{ transform: `rotate(${imageRotation}deg)` }}
            />
            
            {/* Gradient overlay at bottom for controls */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
          </div>

          {/* Control bar */}
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

        {/* Thumbnail strip */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2.5 bg-white/10 backdrop-blur-xl rounded-xl" style={{ marginTop: '80px', transform: 'translateX(-50%) translateY(100px)' }}>
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                  setSelectedImage(img);
                  setImageRotation(0);
                }}
                className={`w-14 h-14 rounded-lg overflow-hidden transition-all duration-300 ${
                  index === currentImageIndex
                    ? "ring-2 ring-white scale-110 shadow-lg"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const VerificationField = ({ label, value, field, relatedImage = null, icon }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;

    return (
      <div
        className={`p-4 rounded-xl border transition-all duration-300 ${getStatusColor(
          field
        )}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow">
                <div className="text-white">
                  {icon || getFieldIcon(field)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {label}
                  </label>
                  {getStatusIcon(field)}
                </div>
                <p className="text-base font-semibold text-gray-900">{value}</p>

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

          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Verify
            </span>
            <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-lg">
              <button
                onClick={() => handleVerification(field, "accepted")}
                className={`relative p-2 rounded-lg font-medium transition-all duration-300 ${
                  verificationStatus[field] === "accepted"
                    ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg scale-105"
                    : "bg-white text-green-600 hover:bg-green-50 border border-green-300"
                }`}
              >
                <Check className="w-4 h-4" />
                {verificationStatus[field] === "accepted" && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping" />
                )}
              </button>
              <button
                onClick={() => handleVerification(field, "rejected")}
                className={`relative p-2 rounded-lg font-medium transition-all duration-300 ${
                  verificationStatus[field] === "rejected"
                    ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg scale-105"
                    : "bg-white text-red-600 hover:bg-red-50 border border-red-300"
                }`}
              >
                <X className="w-4 h-4" />
                {verificationStatus[field] === "rejected" && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-400 rounded-full animate-ping" />
                )}
              </button>
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
    { id: "identity", label: "Identity & Address", icon: User, color: "from-blue-500 to-indigo-600" },
    { id: "bank", label: "Bank Details", icon: Building2, color: "from-emerald-500 to-teal-600" },
    { id: "nominee", label: "Nominee Info", icon: Users, color: "from-purple-500 to-pink-600" },
  ];

  const getProgress = () => {
    const totalFields = 15;
    const verifiedFields = Object.keys(verificationStatus).length;
    return Math.round((verifiedFields / totalFields) * 100);
  };

  const getAcceptedCount = () => {
    return Object.values(verificationStatus).filter(v => v === "accepted").length;
  };

  const getRejectedCount = () => {
    return Object.values(verificationStatus).filter(v => v === "rejected").length;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="relative overflow-hidden flex-shrink-0">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
            </div>
            
            <div className="relative px-5 py-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-white/20 rounded-lg blur animate-pulse"></div>
                    <div className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      Farmer Verification
                      <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                    </h2>
                    <p className="text-white/70 text-xs">
                      Review and verify all farmer documents
                    </p>
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
                    <span className="text-white/70 text-xs">Progress:</span>
                    <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-500 rounded-full"
                        style={{ width: `${getProgress()}%` }}
                      />
                    </div>
                    <span className="text-white font-bold text-sm">{getProgress()}%</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-green-500/20 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-green-400/30">
                    <Check className="w-3.5 h-3.5 text-green-300" />
                    <span className="text-white font-bold text-sm">{getAcceptedCount()}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-red-500/20 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-red-400/30">
                    <X className="w-3.5 h-3.5 text-red-300" />
                    <span className="text-white font-bold text-sm">{getRejectedCount()}</span>
                  </div>

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
                  <VerificationField
                    label="Aadhaar Number"
                    value={farmerData?.aadhaar_number}
                    field="aadhaar_number"
                    relatedImage={farmerData?.aadhaar_image}
                    icon={<Hash className="w-4 h-4" />}
                  />
                  <VerificationField
                    label="PAN Number"
                    value={farmerData?.pan_number}
                    field="pan_number"
                    relatedImage={farmerData?.pan_image}
                    icon={<CreditCard className="w-4 h-4" />}
                  />
                  <VerificationField
                    label="Land Size"
                    value={`${farmerData?.land_size} Acres`}
                    field="land_size"
                    relatedImage={farmerData?.khatauni_images}
                    icon={<MapPin className="w-4 h-4" />}
                  />
                  <VerificationField
                    label="Complete Address"
                    value={`${farmerData?.address}, ${farmerData?.tehsil}, ${farmerData?.district}, ${farmerData?.state} - ${farmerData?.pin_code}`}
                    field="address"
                    icon={<MapPin className="w-4 h-4" />}
                  />
                </>
              )}

              {/* Bank Tab */}
              {activeTab === "bank" && (
                <>
                  <VerificationField
                    label="Account Number"
                    value={farmerData?.account_number}
                    field="account_number"
                    relatedImage={farmerData?.bank_passbook_img}
                    icon={<CreditCard className="w-4 h-4" />}
                  />
                  <VerificationField
                    label="IFSC Code"
                    value={farmerData?.ifsc_code}
                    field="ifsc_code"
                    icon={<Hash className="w-4 h-4" />}
                  />
                  <VerificationField
                    label="Account Holder Name"
                    value={farmerData?.account_holder}
                    field="account_holder"
                    icon={<User className="w-4 h-4" />}
                  />
                  <VerificationField
                    label="Bank Name"
                    value={farmerData?.bank_name}
                    field="bank_name"
                    icon={<Building2 className="w-4 h-4" />}
                  />
                  <VerificationField
                    label="Branch Name"
                    value={farmerData?.branch_name}
                    field="branch_name"
                    icon={<Landmark className="w-4 h-4" />}
                  />
                </>
              )}

              {/* Nominee Tab */}
              {activeTab === "nominee" && (
                <>
                  <VerificationField
                    label="Nominee Name"
                    value={farmerData?.nominee_name}
                    field="nominee_name"
                    relatedImage={farmerData?.nominee_image}
                    icon={<User className="w-4 h-4" />}
                  />
                  <VerificationField
                    label="Date of Birth"
                    value={farmerData?.nominee_dob}
                    field="nominee_dob"
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <VerificationField
                    label="Phone Number"
                    value={farmerData?.nominee_phone}
                    field="nominee_phone"
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <VerificationField
                    label="Email Address"
                    value={farmerData?.nominee_email}
                    field="nominee_email"
                    icon={<Mail className="w-4 h-4" />}
                  />
                  <VerificationField
                    label="Nominee Aadhaar"
                    value={farmerData?.nominee_aadhaar}
                    field="nominee_aadhaar"
                    relatedImage={farmerData?.nominee_aadhaar_image}
                    icon={<Hash className="w-4 h-4" />}
                  />
                  <VerificationField
                    label="Nominee PAN"
                    value={farmerData?.nominee_pan}
                    field="nominee_pan"
                    relatedImage={farmerData?.nominee_pan_image}
                    icon={<CreditCard className="w-4 h-4" />}
                  />
                  <VerificationField
                    label="Relationship"
                    value={farmerData?.nominee_relation}
                    field="nominee_relation"
                    icon={<Users className="w-4 h-4" />}
                  />
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 px-5 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-600">Accepted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-600">Rejected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-600">Pending</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium text-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitVerification}
                  className="group px-5 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-sm transform hover:scale-105 flex items-center gap-2"
                >
                  <BadgeCheck className="w-4 h-4" />
                  Submit Verification
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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

export default FarmerApproval;