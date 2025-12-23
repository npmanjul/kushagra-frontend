import React, { useState, useEffect, useCallback } from "react";
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
  MessageSquare,
  AlertTriangle,
  Undo2,
  Loader2,
  RefreshCw,
  Info,
  FileX,
} from "lucide-react";
import API_BASE_URL from "@/utils/constants";
import toast from "react-hot-toast";

const FarmerApproval = ({ isOpen, onClose, farmerId, onVerificationComplete }) => {
  const [verificationStatus, setVerificationStatus] = useState({});
  const [activeTab, setActiveTab] = useState("identity");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageRotation, setImageRotation] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rejectionModal, setRejectionModal] = useState({ isOpen: false, field: null, label: "" });
  const [rejectionReason, setRejectionReason] = useState("");
  // API states
  const [farmerData, setFarmerData] = useState(null);
  const [overallStatus, setOverallStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch farmer verification data
  const fetchVerificationData = useCallback(async () => {
    if (!farmerId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/user/checkfarmerverification?farmerId=${farmerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch verification data: ${response.statusText}`);
      }

      const data = await response.json();
      setFarmerData(data.data);
      setOverallStatus(data.data.overallStatus || "pending");

      // Initialize local verification status for pending fields only
      const initialStatus = {};
      Object.keys(data.data).forEach((key) => {
        if (key !== "overallStatus" && data.data[key]?.status === "pending") {
          // Only track pending fields that have values (submitted by farmer)
          const fieldData = data.data[key];
          if (hasFieldValue(fieldData)) {
            // Don't set initial status - leave it undefined until user takes action
          }
        }
      });
      setVerificationStatus(initialStatus);

    } catch (err) {
      setError(err.message);
      console.error("Error fetching verification data:", err);
    } finally {
      setLoading(false);
    }
  }, [farmerId]);

  // Check if a field has a value
  const hasFieldValue = (fieldData) => {
    if (!fieldData) return false;
    const value = fieldData.value;
    if (value === null || value === undefined) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if (typeof value === 'object' && !value.$numberDecimal && Object.keys(value).length === 0) return false;
    return true;
  };

  // Submit verification updates
  const submitVerification = async () => {
    const changedFields = {};
    
    Object.keys(verificationStatus).forEach((key) => {
      const current = verificationStatus[key];
      if (current && current.status) {
        changedFields[key] = {
          status: current.status === "accepted" ? "approved" : current.status,
          reason: current.reason || null,
        };
      }
    });

    if (Object.keys(changedFields).length === 0) {
      toast.error("No changes to submit");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formattedData = {
        verifications: changedFields
      };

      const response = await fetch(`${API_BASE_URL}/user/updatefarmerverification?farmerId=${farmerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formattedData),
      });

      console.log("Verification Response:", response);

      if (!response.ok) {
        throw new Error(`Failed to update verification: ${response.statusText}`);
      }

      const result = await response.json();

      if (onVerificationComplete) {
        onVerificationComplete(result);
      }

      toast.success("Verification updated successfully");
      onClose();

    } catch (err) {
      setError(err.message);
      toast.error("Failed to update verification");
      console.error("Error updating verification:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen && farmerId) {
      fetchVerificationData();
    }
  }, [isOpen, farmerId, fetchVerificationData]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setVerificationStatus({});
      setActiveTab("identity");
      setSelectedImage(null);
      setError(null);
      setFarmerData(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Get raw value from field
  const getRawValue = (field) => {
    if (!farmerData || !farmerData[field]) return null;
    const data = farmerData[field];

    // Handle special case for land_size with $numberDecimal
    if (data.value?.$numberDecimal) {
      return data.value.$numberDecimal;
    }

    return data.value;
  };

  // Get API status for a field
  const getApiStatus = (field) => {
    if (!farmerData || !farmerData[field]) return null;
    return farmerData[field].status;
  };

  // Get API reason for a field
  const getApiReason = (field) => {
    if (!farmerData || !farmerData[field]) return null;
    return farmerData[field].reason;
  };

  // Get verifiedBy info for a field
  const getVerifiedBy = (field) => {
    if (!farmerData || !farmerData[field]?.verifiedBy) return null;
    return farmerData[field].verifiedBy;
  };

  const getKhatauniImages = () => {
    if (!farmerData) return [];
    const khatauni = farmerData.khatauni_images;
    if (!khatauni?.value || !Array.isArray(khatauni.value)) return [];
    return khatauni.value.map((item) => item.image_url);
  };

  // Get the effective status (local changes override API status for pending fields)
  const getEffectiveStatus = (field) => {
    // If there's a local change, use it
    if (verificationStatus[field]) {
      return {
        status: verificationStatus[field].status,
        reason: verificationStatus[field].reason,
        isLocal: true,
      };
    }
    
    // Otherwise use API status
    const apiStatus = getApiStatus(field);
    const apiReason = getApiReason(field);
    
    if (apiStatus) {
      return {
        status: apiStatus === "approved" ? "accepted" : apiStatus,
        reason: apiReason,
        isLocal: false,
      };
    }
    
    return null;
  };

  // Check if field can be modified (only pending fields with values)
  const canModifyField = (field) => {
    const apiStatus = getApiStatus(field);
    const value = getRawValue(field);
    
    // Can only modify pending fields that have values
    if (apiStatus !== "pending") return false;
    
    // Check if field has a value
    if (field === "khatauni_images") {
      return getKhatauniImages().length > 0;
    }
    
    return value !== null && value !== undefined;
  };

  // Check if field has been modified locally
  const isFieldModified = (field) => {
    return !!verificationStatus[field];
  };

  const handleVerification = (field, status) => {
    if (!canModifyField(field)) return;
    
    if (status === "rejected") {
      setRejectionModal({ isOpen: true, field, label: field.replace(/_/g, " ") });
    } else {
      setVerificationStatus((prev) => ({
        ...prev,
        [field]: { status: "accepted", reason: "" },
      }));
    }
  };

  const handleRejectWithReason = () => {
    if (rejectionReason.trim()) {
      setVerificationStatus((prev) => ({
        ...prev,
        [rejectionModal.field]: { status: "rejected", reason: rejectionReason },
      }));
      setRejectionModal({ isOpen: false, field: null, label: "" });
      setRejectionReason("");
    }
  };

  const handleResetVerification = (field) => {
    setVerificationStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[field];
      return newStatus;
    });
  };

  const getStatusColor = (field) => {
    const effectiveStatus = getEffectiveStatus(field);
    const status = effectiveStatus?.status;
    
    if (status === "accepted" || status === "approved")
      return "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-md";
    if (status === "rejected")
      return "bg-gradient-to-br from-red-50 to-rose-50 border-red-300 shadow-md";
    return "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md";
  };

  const getStatusBadge = (field) => {
    const effectiveStatus = getEffectiveStatus(field);
    const status = effectiveStatus?.status;
    const isModified = isFieldModified(field);
    const value = getRawValue(field);
    const apiStatus = getApiStatus(field);
    
    // No value submitted
    if (value === null && apiStatus === "pending") {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full">
          <FileX className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-semibold text-gray-500">Not Submitted</span>
        </div>
      );
    }
    
    if (status === "accepted" || status === "approved")
      return (
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-semibold text-white">
              {isModified ? "Approved (New)" : "Approved"}
            </span>
          </div>
        </div>
      );
    if (status === "rejected")
      return (
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-full">
            <XCircle className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-semibold text-white">
              {isModified ? "Rejected (New)" : "Rejected"}
            </span>
          </div>
        </div>
      );
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 rounded-full">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span className="text-xs font-semibold text-amber-600">Pending Review</span>
      </div>
    );
  };

  // Get verifier info
  const getVerifierInfo = (field) => {
    const verifiedBy = getVerifiedBy(field);
    if (!verifiedBy) return null;

    const { manager, supervisor, admin } = verifiedBy;
    
    if (admin?.status && admin?.user_id) {
      return {
        name: admin.user_id.name,
        role: admin.user_id.role,
        date: admin.date,
      };
    }
    if (supervisor?.status && supervisor?.user_id) {
      return {
        name: supervisor.user_id.name,
        role: supervisor.user_id.role,
        date: supervisor.date,
      };
    }
    if (manager?.status && manager?.user_id) {
      return {
        name: manager.user_id.name,
        role: manager.user_id.role,
        date: manager.date,
      };
    }
    return null;
  };

  const getFieldIcon = (fieldName) => {
    const iconMap = {
      aadhaar: Hash,
      pan: CreditCard,
      account: CreditCard,
      ifsc: Landmark,
      phone: Phone,
      email: Mail,
      dob: Calendar,
      address: MapPin,
      name: User,
      bank: Building2,
      branch: Landmark,
      relation: Users,
      gender: User,
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
    const newIndex =
      direction === "next"
        ? (currentImageIndex + 1) % allImages.length
        : (currentImageIndex - 1 + allImages.length) % allImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
    setImageRotation(0);
  };

  // Define all fields in the specified order
  const fieldDefinitions = {
    identity: [
      { field: "aadhaar_image", label: "Aadhaar Image", type: "image", icon: <ImageIcon className="w-4 h-4" /> },
      { field: "aadhaar_number", label: "Aadhaar Number", type: "text", icon: <Hash className="w-4 h-4" /> },
      { field: "pan_number", label: "PAN Number", type: "text", icon: <CreditCard className="w-4 h-4" /> },
      { field: "pan_image", label: "PAN Image", type: "image", icon: <ImageIcon className="w-4 h-4" /> },
      { field: "khatauni_images", label: "Khatauni Documents", type: "multi-image", icon: <FileText className="w-4 h-4" /> },
    ],
    address: [
      { field: "address", label: "Address", type: "text", icon: <MapPin className="w-4 h-4" /> },
      { field: "tehsil", label: "Tehsil", type: "text", icon: <MapPin className="w-4 h-4" /> },
      { field: "district", label: "District", type: "text", icon: <MapPin className="w-4 h-4" /> },
      { field: "state", label: "State", type: "text", icon: <MapPin className="w-4 h-4" /> },
      { field: "landmark", label: "Landmark", type: "text", icon: <MapPin className="w-4 h-4" /> },
      { field: "pin_code", label: "PIN Code", type: "text", icon: <Hash className="w-4 h-4" /> },
    ],
    land: [
      { field: "land_size", label: "Land Size", type: "text", suffix: " Acres", icon: <FileText className="w-4 h-4" />, relatedImageField: "khatauni_images" },
    ],
    bank: [
      { field: "bank_passbook_img", label: "Bank Passbook Image", type: "image", icon: <ImageIcon className="w-4 h-4" /> },
      { field: "account_number", label: "Account Number", type: "text", icon: <CreditCard className="w-4 h-4" /> },
      { field: "ifsc_code", label: "IFSC Code", type: "text", icon: <Hash className="w-4 h-4" /> },
      { field: "account_holder", label: "Account Holder Name", type: "text", icon: <User className="w-4 h-4" /> },
      { field: "bank_name", label: "Bank Name", type: "text", icon: <Building2 className="w-4 h-4" /> },
      { field: "branch_name", label: "Branch Name", type: "text", icon: <Landmark className="w-4 h-4" /> },
    ],
    nominee: [
      { field: "nominee_image", label: "Nominee Image", type: "image", icon: <ImageIcon className="w-4 h-4" /> },
      { field: "nominee_aadhaar_image", label: "Nominee Aadhaar Image", type: "image", icon: <ImageIcon className="w-4 h-4" /> },
      { field: "nominee_pan_image", label: "Nominee PAN Image", type: "image", icon: <ImageIcon className="w-4 h-4" /> },
      { field: "nominee_name", label: "Nominee Name", type: "text", icon: <User className="w-4 h-4" /> },
      { field: "nominee_dob", label: "Date of Birth", type: "text", icon: <Calendar className="w-4 h-4" /> },
      { field: "nominee_phone", label: "Phone Number", type: "text", icon: <Phone className="w-4 h-4" /> },
      { field: "nominee_email", label: "Email Address", type: "text", icon: <Mail className="w-4 h-4" /> },
      { field: "nominee_aadhaar", label: "Nominee Aadhaar", type: "text", icon: <Hash className="w-4 h-4" /> },
      { field: "nominee_pan", label: "Nominee PAN", type: "text", icon: <CreditCard className="w-4 h-4" /> },
      { field: "nominee_relation", label: "Relationship", type: "text", icon: <Users className="w-4 h-4" /> },
      { field: "nominee_gender", label: "Gender", type: "text", icon: <User className="w-4 h-4" /> },
      { field: "nominee_address", label: "Nominee Address", type: "text", icon: <MapPin className="w-4 h-4" /> },
    ],
  };

  // Calculate statistics
  const getStats = () => {
    let total = 0;
    let approved = 0;
    let rejected = 0;
    let pending = 0;
    let notSubmitted = 0;

    Object.values(fieldDefinitions).flat().forEach((fieldDef) => {
      const value = getRawValue(fieldDef.field);
      const apiStatus = getApiStatus(fieldDef.field);
      const effectiveStatus = getEffectiveStatus(fieldDef.field);
      
      // Check for multi-image fields
      if (fieldDef.type === "multi-image") {
        const images = getKhatauniImages();
        if (images.length === 0 && apiStatus === "pending") {
          notSubmitted++;
          return;
        }
      } else if (value === null && apiStatus === "pending") {
        notSubmitted++;
        return;
      }
      
      total++;
      const status = effectiveStatus?.status;
      
      if (status === "accepted" || status === "approved") approved++;
      else if (status === "rejected") rejected++;
      else pending++;
    });

    return { total, approved, rejected, pending, notSubmitted };
  };

  const getProgress = () => {
    const stats = getStats();
    if (stats.total === 0) return 0;
    return Math.round(((stats.approved + stats.rejected) / stats.total) * 100);
  };

  // Get image for a field
  const getFieldImage = (fieldDef) => {
    if (fieldDef.type === "image") {
      return getRawValue(fieldDef.field);
    }
    if (fieldDef.type === "multi-image") {
      return getKhatauniImages();
    }
    if (fieldDef.relatedImageField) {
      if (fieldDef.relatedImageField === "khatauni_images") {
        return getKhatauniImages();
      }
      return getRawValue(fieldDef.relatedImageField);
    }
    return null;
  };

  // Get display value for a field
  const getFieldValue = (fieldDef) => {
    if (fieldDef.type === "image" || fieldDef.type === "multi-image") {
      return null;
    }
    const value = getRawValue(fieldDef.field);
    if (value && fieldDef.suffix) {
      return `${value}${fieldDef.suffix}`;
    }
    return value;
  };

  // Check if there are any pending changes to submit
  const hasChangesToSubmit = () => {
    return Object.keys(verificationStatus).length > 0;
  };

  // Overall status badge
  const getOverallStatusBadge = () => {
    switch (overallStatus) {
      case "approved":
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 backdrop-blur-sm rounded-lg border border-green-400/30">
            <CheckCircle2 className="w-4 h-4 text-green-300" />
            <span className="text-white font-semibold text-sm">Fully Approved</span>
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 backdrop-blur-sm rounded-lg border border-red-400/30">
            <XCircle className="w-4 h-4 text-red-300" />
            <span className="text-white font-semibold text-sm">Has Rejections</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 backdrop-blur-sm rounded-lg border border-amber-400/30">
            <Clock className="w-4 h-4 text-amber-300" />
            <span className="text-white font-semibold text-sm">Pending Review</span>
          </div>
        );
    }
  };

  // Rejection Reason Modal
  const RejectionModal = () => {
    if (!rejectionModal.isOpen) return null;

    const quickReasons = [
      "Document is blurry or unclear",
      "Information mismatch",
      "Document expired",
      "Invalid document format",
      "Missing required information",
      "Suspected fraudulent document",
    ];

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70]">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Rejection Reason</h3>
                <p className="text-white/80 text-sm capitalize">
                  {rejectionModal.label}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 text-sm mb-4">
              Please provide a reason for rejecting this field. This will help the farmer understand what needs to be corrected.
            </p>

            {/* Quick Reasons */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Quick Select
              </label>
              <div className="flex flex-wrap gap-2">
                {quickReasons.map((reason, index) => (
                  <button
                    key={index}
                    onClick={() => setRejectionReason(reason)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${
                      rejectionReason === reason
                        ? "bg-red-100 border-red-300 text-red-700"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Reason */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Rejection Reason
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter detailed reason for rejection..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all duration-200"
                  rows={3}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                {rejectionReason.length}/500 characters
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setRejectionModal({ isOpen: false, field: null, label: "" });
                setRejectionReason("");
              }}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectWithReason}
              disabled={!rejectionReason.trim()}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
                rejectionReason.trim()
                  ? "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-lg hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <XCircle className="w-4 h-4" />
              Confirm Rejection
            </button>
          </div>
        </div>
      </div>
    );
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
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2.5 bg-white/10 backdrop-blur-xl rounded-xl">
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

  const VerificationField = ({ label, value, field, relatedImage = null, icon, fieldType }) => {
    const effectiveStatus = getEffectiveStatus(field);
    const status = effectiveStatus?.status;
    const reason = effectiveStatus?.reason;
    const canModify = canModifyField(field);
    const isModified = isFieldModified(field);
    const verifierInfo = getVerifierInfo(field);
    const apiStatus = getApiStatus(field);
    const rawValue = getRawValue(field);
    
    // Handle not submitted fields
    const isNotSubmitted = rawValue === null && apiStatus === "pending";
    if (fieldType === "multi-image" && getKhatauniImages().length === 0 && apiStatus === "pending") {
      // Field not submitted for multi-image
      return (
        <div className="p-4 rounded-xl border bg-gray-50 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg shadow bg-gray-400">
              <div className="text-white">{icon || getFieldIcon(field)}</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {label}
                </label>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full">
                  <FileX className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-500">Not Submitted</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 italic">Awaiting farmer submission</p>
            </div>
          </div>
        </div>
      );
    }

    if (isNotSubmitted && fieldType !== "multi-image") {
      return (
        <div className="p-4 rounded-xl border bg-gray-50 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg shadow bg-gray-400">
              <div className="text-white">{icon || getFieldIcon(field)}</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {label}
                </label>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full">
                  <FileX className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-500">Not Submitted</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 italic">Awaiting farmer submission</p>
            </div>
          </div>
        </div>
      );
    }

    // For image fields with no value
    if (!value && !relatedImage && (fieldType === "image" || fieldType === "multi-image")) {
      return null;
    }

    return (
      <div
        className={`p-4 rounded-xl border transition-all duration-300 ${getStatusColor(field)} ${isModified ? 'ring-2 ring-indigo-400 ring-offset-2' : ''}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg shadow ${
                status === "accepted" || status === "approved" 
                  ? "bg-gradient-to-br from-green-500 to-emerald-600" 
                  : status === "rejected" 
                    ? "bg-gradient-to-br from-red-500 to-rose-600"
                    : "bg-gradient-to-br from-indigo-500 to-purple-600"
              }`}>
                <div className="text-white">{icon || getFieldIcon(field)}</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {label}
                  </label>
                  {getStatusBadge(field)}
                  {isModified && (
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                      Modified
                    </span>
                  )}
                </div>
                {value && <p className="text-base font-semibold text-gray-900">{value}</p>}

                {/* Verifier Info for already verified fields */}
                {verifierInfo && !canModify && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <Info className="w-3.5 h-3.5" />
                    <span>
                      Verified by <span className="font-medium text-gray-700">{verifierInfo.name}</span>
                      <span className="text-gray-400"> ({verifierInfo.role})</span>
                      {verifierInfo.date && (
                        <span className="text-gray-400"> on {new Date(verifierInfo.date).toLocaleDateString()}</span>
                      )}
                    </span>
                  </div>
                )}

                {/* Rejection Reason Display */}
                {status === "rejected" && reason && (
                  <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">
                          Rejection Reason
                        </p>
                        <p className="text-sm text-red-600">{reason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {relatedImage && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2.5 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      {fieldType === "image" ? "Document" : "Supporting Documents"}
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

          {/* Action Buttons - Only show for pending fields that can be modified */}
          <div className="flex flex-col items-center gap-2">
            {canModify ? (
              <>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Verify
                </span>
                <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-lg">
                  <button
                    onClick={() => handleVerification(field, "accepted")}
                    className={`relative p-2 rounded-lg font-medium transition-all duration-300 ${
                      status === "accepted"
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg scale-105"
                        : "bg-white text-green-600 hover:bg-green-50 border border-green-300"
                    }`}
                    title="Approve"
                  >
                    <Check className="w-4 h-4" />
                    {status === "accepted" && isModified && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping" />
                    )}
                  </button>
                  <button
                    onClick={() => handleVerification(field, "rejected")}
                    className={`relative p-2 rounded-lg font-medium transition-all duration-300 ${
                      status === "rejected"
                        ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg scale-105"
                        : "bg-white text-red-600 hover:bg-red-50 border border-red-300"
                    }`}
                    title="Reject"
                  >
                    <X className="w-4 h-4" />
                    {status === "rejected" && isModified && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-400 rounded-full animate-ping" />
                    )}
                  </button>
                  {isModified && (
                    <button
                      onClick={() => handleResetVerification(field)}
                      className="p-2 rounded-lg font-medium transition-all duration-300 bg-white text-gray-500 hover:bg-gray-100 border border-gray-300"
                      title="Reset"
                    >
                      <Undo2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </>
            ) : apiStatus !== "pending" ? (
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Verified
                </span>
                <div className={`p-2 rounded-lg ${
                  status === "accepted" || status === "approved"
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}>
                  {status === "accepted" || status === "approved" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: "identity", label: "Identity", icon: User, color: "from-blue-500 to-indigo-600" },
    { id: "address", label: "Address", icon: MapPin, color: "from-orange-500 to-amber-600" },
    { id: "land", label: "Land Details", icon: FileText, color: "from-green-500 to-emerald-600" },
    { id: "bank", label: "Bank Details", icon: Building2, color: "from-cyan-500 to-teal-600" },
    { id: "nominee", label: "Nominee Info", icon: Users, color: "from-purple-500 to-pink-600" },
  ];

  // Render fields for current tab
  const renderTabContent = () => {
    const fields = fieldDefinitions[activeTab] || [];

    if (!farmerData) {
      return (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    return (
      <>
        {fields.map((fieldDef) => {
          const value = getFieldValue(fieldDef);
          const image = getFieldImage(fieldDef);

          return (
            <VerificationField
              key={fieldDef.field}
              label={fieldDef.label}
              value={value}
              field={fieldDef.field}
              relatedImage={image}
              icon={fieldDef.icon}
              fieldType={fieldDef.type}
            />
          );
        })}
      </>
    );
  };

  const stats = getStats();

  // Loading State
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading verification data...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error && !farmerData) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Error Loading Data</h3>
            <p className="text-gray-600">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={fetchVerificationData}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </div>
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
                    <p className="text-white/70 text-xs">Review and verify all farmer documents</p>
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="flex items-center gap-3">
                  {/* Overall Status Badge */}
                  {getOverallStatusBadge()}

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
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-300" />
                    <span className="text-white font-bold text-sm">{stats.approved}</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-red-500/20 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-red-400/30">
                    <XCircle className="w-3.5 h-3.5 text-red-300" />
                    <span className="text-white font-bold text-sm">{stats.rejected}</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-amber-500/20 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-amber-400/30">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span className="text-white font-bold text-sm">{stats.pending}</span>
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

          {/* Error Banner */}
          {error && (
            <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 flex-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 gap-2 flex-shrink-0 border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-4 py-2 flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 ${
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
                  <span className="text-sm whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="space-y-3">
              {renderTabContent()}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 px-5 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-600">Approved ({stats.approved})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-600">Rejected ({stats.rejected})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-amber-400 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-600">Pending ({stats.pending})</span>
                </div>
                {stats.notSubmitted > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-600">Not Submitted ({stats.notSubmitted})</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={submitting}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium text-sm hover:shadow-md disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitVerification}
                  disabled={submitting || !hasChangesToSubmit()}
                  className="group px-5 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-sm transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <BadgeCheck className="w-4 h-4" />
                      Submit Verification ({Object.keys(verificationStatus).length})
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      <RejectionModal />

      {/* Image Popup */}
      {selectedImage && <ImagePopup image={selectedImage} onClose={() => setSelectedImage(null)} />}
    </>
  );
};

export default FarmerApproval;