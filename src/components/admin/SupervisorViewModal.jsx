import React, { useState } from "react";
import {
  X,
  User,
  CreditCard,
  Building2,
  Users,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  ShieldCheck,
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
  Wheat,
  IndianRupee,
  Shield,
  Info,
  Copy,
  Share2,
  Printer,
} from "lucide-react";

const SupervisorViewModal = ({ isOpen, onClose, farmerData }) => {
  const [activeTab, setActiveTab] = useState("identity");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageRotation, setImageRotation] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copiedField, setCopiedField] = useState(null);

  // Enhanced farmer data
  const farmer = farmerData || {
    // Basic Info
    id: "F001",
    name: "Ram Kumar",
    phone: "+91 9876543210",
    email: "ram.kumar@email.com",
    avatar: "RK",
    status: "verified",
    joinDate: "2024-01-15",
    
    // Identity Documents
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
    land_documents: [
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800",
    ],

    // Bank details
    account_number: "1234567890",
    ifsc_code: "SBIN0001234",
    account_holder: "Ram Kumar",
    bank_name: "State Bank of India",
    branch_name: "Gorakhpur Branch",
    bank_passbook_img: "https://images.unsplash.com/photo-1554224155-1696413565d3?w=800",

    // Nominee details
    nominee_name: "Sita Devi",
    nominee_dob: "1990-08-20",
    nominee_phone: "9876543211",
    nominee_email: "sita@example.com",
    nominee_aadhaar: "5678-9012-3456",
    nominee_pan: "XYZAB1234K",
    nominee_relation: "Wife",
    nominee_gender: "Female",
    nominee_address: "Village Rampur, Post Belghat",
    nominee_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800",
    nominee_aadhaar_image: "https://images.unsplash.com/photo-1578662996442-48f60103fc27?w=800",
    nominee_pan_image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",

    // Verification Metadata
    submitted_date: "2024-11-20",
    verified_date: "2024-11-21",
    verified_by: "John Supervisor",
    verification_status: "approved",
  };

  if (!isOpen) return null;

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
      land: Wheat,
    };

    for (const [key, Icon] of Object.entries(iconMap)) {
      if (fieldName.toLowerCase().includes(key)) {
        return <Icon className="w-4 h-4" />;
      }
    }
    return <FileText className="w-4 h-4" />;
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
              alt="Document"
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
                <div className="text-white">
                  {icon || getFieldIcon(field)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {label}
                  </label>
                  {farmer.verification_status === "approved" && (
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
    { id: "identity", label: "Identity & Address", icon: User, color: "from-blue-500 to-indigo-600" },
    { id: "bank", label: "Bank Details", icon: Building2, color: "from-emerald-500 to-teal-600" },
    { id: "nominee", label: "Nominee Info", icon: Users, color: "from-purple-500 to-pink-600" },
    { id: "summary", label: "Profile Summary", icon: FileText, color: "from-amber-500 to-orange-600" },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Approved" },
      pending: { bg: "bg-amber-100", text: "text-amber-700", icon: Clock, label: "Pending" },
      rejected: { bg: "bg-red-100", text: "text-red-700", icon: X, label: "Rejected" },
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
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col">
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
                      Farmer Profile
                    </h2>
                    <div className="flex items-center gap-3 text-white/70 text-xs">
                      <span>{farmer.name}</span>
                      <span>•</span>
                      <span>ID: {farmer.id}</span>
                      <span>•</span>
                      <span>Joined: {new Date(farmer.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center gap-3">
                  {getStatusBadge(farmer.verification_status)}
                  
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
                    label="Aadhaar Number"
                    value={farmer?.aadhaar_number}
                    field="aadhaar_number"
                    relatedImage={farmer?.aadhaar_image}
                    icon={<Hash className="w-4 h-4" />}
                    maskValue={true}
                  />
                  <ViewOnlyField
                    label="PAN Number"
                    value={farmer?.pan_number}
                    field="pan_number"
                    relatedImage={farmer?.pan_image}
                    icon={<CreditCard className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Land Size"
                    value={`${farmer?.land_size} Acres`}
                    field="land_size"
                    relatedImage={farmer?.khatauni_images}
                    icon={<Wheat className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Complete Address"
                    value={`${farmer?.address}, ${farmer?.tehsil}, ${farmer?.district}, ${farmer?.state} - ${farmer?.pin_code}`}
                    field="address"
                    icon={<MapPin className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="User Photo"
                    value="Profile Picture"
                    field="user_photo"
                    relatedImage={farmer?.user_image}
                    icon={<User className="w-4 h-4" />}
                  />
                </>
              )}

              {/* Bank Tab */}
              {activeTab === "bank" && (
                <>
                  <ViewOnlyField
                    label="Account Number"
                    value={farmer?.account_number}
                    field="account_number"
                    relatedImage={farmer?.bank_passbook_img}
                    icon={<CreditCard className="w-4 h-4" />}
                    maskValue={true}
                  />
                  <ViewOnlyField
                    label="IFSC Code"
                    value={farmer?.ifsc_code}
                    field="ifsc_code"
                    icon={<Hash className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Account Holder Name"
                    value={farmer?.account_holder}
                    field="account_holder"
                    icon={<User className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Bank Name"
                    value={farmer?.bank_name}
                    field="bank_name"
                    icon={<Building2 className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Branch Name"
                    value={farmer?.branch_name}
                    field="branch_name"
                    icon={<Landmark className="w-4 h-4" />}
                  />
                </>
              )}

              {/* Nominee Tab */}
              {activeTab === "nominee" && (
                <>
                  <ViewOnlyField
                    label="Nominee Name"
                    value={farmer?.nominee_name}
                    field="nominee_name"
                    relatedImage={farmer?.nominee_image}
                    icon={<User className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Date of Birth"
                    value={farmer?.nominee_dob}
                    field="nominee_dob"
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Phone Number"
                    value={farmer?.nominee_phone}
                    field="nominee_phone"
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Email Address"
                    value={farmer?.nominee_email}
                    field="nominee_email"
                    icon={<Mail className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Nominee Aadhaar"
                    value={farmer?.nominee_aadhaar}
                    field="nominee_aadhaar"
                    relatedImage={farmer?.nominee_aadhaar_image}
                    icon={<Hash className="w-4 h-4" />}
                    maskValue={true}
                  />
                  <ViewOnlyField
                    label="Nominee PAN"
                    value={farmer?.nominee_pan}
                    field="nominee_pan"
                    relatedImage={farmer?.nominee_pan_image}
                    icon={<CreditCard className="w-4 h-4" />}
                  />
                  <ViewOnlyField
                    label="Relationship"
                    value={farmer?.nominee_relation}
                    field="nominee_relation"
                    icon={<Users className="w-4 h-4" />}
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
                        <p className="text-sm font-semibold text-gray-800">{farmer.name}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                        <p className="text-sm font-semibold text-gray-800">{farmer.phone}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm font-semibold text-gray-800">{farmer.email}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">District</p>
                        <p className="text-sm font-semibold text-gray-800">{farmer.district}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Land Size</p>
                        <p className="text-sm font-semibold text-gray-800">{farmer.land_size} Acres</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Bank</p>
                        <p className="text-sm font-semibold text-gray-800">{farmer.bank_name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Verification Information */}
                  {farmer.verification_status === "approved" && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-green-800 mb-1">Profile Verified</p>
                          <p className="text-xs text-green-700">
                            Verified by {farmer.verified_by} on {new Date(farmer.verified_date).toLocaleDateString()}
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
                            {new Date(farmer.joinDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Submitted</p>
                          <p className="text-sm font-medium text-gray-800">
                            {new Date(farmer.submitted_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents Summary */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      Documents Uploaded
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        <span className="text-gray-700">Aadhaar Card</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        <span className="text-gray-700">PAN Card</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        <span className="text-gray-700">Bank Passbook</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        <span className="text-gray-700">Land Documents</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        <span className="text-gray-700">Profile Photo</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        <span className="text-gray-700">Nominee Docs</span>
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

export default SupervisorViewModal;