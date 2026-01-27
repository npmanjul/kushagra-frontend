import React, { useState, useEffect, useCallback } from "react";
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
  Users,
  Save,
  Sparkles,
  ChevronRight,
  Camera,
  CheckCircle2,
  AlertCircle,
  Info,
  Edit3,
  Shield,
  FileText,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  BadgeCheck,
  AlertTriangle,
  Zap,
  Power,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import axios from "axios";
import API_BASE_URL from "@/utils/constants";

const InputField = ({
  label,
  field,
  type = "text",
  placeholder,
  icon: Icon,
  required = false,
  disabled = false,
  options = null,
  showToggle = false,
  value,
  onChange,
  error,
  touched,
  isChanged,
  originalValue,
}) => {
  const hasError = error && touched;
  const isValid = touched && !error && value;

  const [showValue, setShowValue] = useState(!showToggle);

  return (
    <div className="space-y-1.5 group">
      <label className="flex items-center justify-between text-xs font-semibold text-gray-600 uppercase tracking-wide">
        <span className="flex items-center gap-1.5">
          {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
        {isChanged && (
          <span className="flex items-center gap-1 text-amber-600 normal-case text-[10px] font-medium bg-amber-50 px-2 py-0.5 rounded-full">
            <Zap className="w-3 h-3" />
            Modified
          </span>
        )}
      </label>

      <div className="relative">
        {options ? (
          <select
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            disabled={disabled}
            className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-medium transition-all duration-200 appearance-none cursor-pointer pr-10
              ${hasError
                ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200 focus:border-red-400"
                : isChanged
                  ? "border-amber-300 bg-amber-50 focus:ring-2 focus:ring-amber-200 focus:border-amber-400"
                  : isValid
                    ? "border-green-300 bg-green-50 focus:ring-2 focus:ring-green-200 focus:border-green-400"
                    : "border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:bg-white"
              }
              ${disabled
                ? "opacity-60 cursor-not-allowed"
                : "hover:border-gray-300"
              }
            `}
          >
            <option value="">Select {label}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={showToggle ? (showValue ? "text" : "password") : type}
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-medium transition-all duration-200 pr-10
              ${hasError
                ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200 focus:border-red-400"
                : isChanged
                  ? "border-amber-300 bg-amber-50 focus:ring-2 focus:ring-amber-200 focus:border-amber-400"
                  : isValid
                    ? "border-green-300 bg-green-50 focus:ring-2 focus:ring-green-200 focus:border-green-400"
                    : "border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:bg-white"
              }
              ${disabled
                ? "opacity-60 cursor-not-allowed"
                : "hover:border-gray-300"
              }
            `}
          />
        )}

        {/* Status icon or toggle */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {showToggle && (
            <button
              type="button"
              onClick={() => setShowValue(!showValue)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {showValue ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          )}
          {hasError && <AlertCircle className="w-4 h-4 text-red-500" />}
          {isChanged && !hasError && <Zap className="w-4 h-4 text-amber-500" />}
          {isValid && !isChanged && (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          )}
        </div>
      </div>

      {hasError && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}

      {isChanged && originalValue && (
        <p className="text-xs text-amber-600 flex items-center gap-1">
          <Info className="w-3 h-3" />
          Original: {originalValue}
        </p>
      )}
    </div>
  );
};

// Move SectionCard OUTSIDE the main component
const SectionCard = ({
  title,
  icon: Icon,
  children,
  color = "indigo",
  badge = null,
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
    <div
      className={`px-5 py-3 bg-gradient-to-r from-${color}-50 to-${color}-100/50 border-b border-gray-100`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <div
            className={`p-1.5 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-lg shadow-sm`}
          >
            <Icon className="w-3.5 h-3.5 text-white" />
          </div>
          {title}
        </h3>
        {badge && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${badge.className}`}
          >
            {badge.text}
          </span>
        )}
      </div>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// Move ImagePreview OUTSIDE the main component
const ImagePreview = ({ src, label, icon: Icon }) => {
  if (!src) return null;

  return (
    <div className="relative group">
      <div className="aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
        <img
          src={src}
          alt={label}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
        >
          <Eye className="w-5 h-5 text-gray-700" />
        </a>
      </div>
      <p className="mt-2 text-xs font-medium text-gray-600 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-gray-400" />
        {label}
      </p>
    </div>
  );
};

// ImageUploadField Component - For S3 presigned URL uploads
const ImageUploadField = ({
  label,
  field,
  icon: Icon,
  value,
  onChange,
  folder = "farmer-documents",
  isChanged = false,
  aspectRatio = "aspect-video"
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [preview, setPreview] = useState(value);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  // Function to get presigned URL from backend
  const getPresignedUrl = async (file) => {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${field}_${Date.now()}.${fileExtension}`;

    const response = await fetch(`${API_BASE_URL}/aws/getpresigneduploadurls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        files: [{
          fileName: fileName,
          fileType: file.type,
          folder: folder
        }]
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get presigned URL');
    }

    const result = await response.json();
    if (!result.success || !result.urls || result.urls.length === 0) {
      throw new Error('Failed to get presigned URL');
    }

    return result.urls[0];
  };

  // Function to upload file to S3 using presigned URL
  const uploadToS3 = async (file, presignedUrl) => {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file to S3');
    }

    // Return the public URL (presigned URL without query params)
    return presignedUrl.split('?')[0];
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Show local preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      setUploadProgress(20);

      // Get presigned URL
      const { uploadUrl, publicUrl } = await getPresignedUrl(file);
      setUploadProgress(40);

      // Upload to S3
      await uploadToS3(file, uploadUrl);
      setUploadProgress(80);

      // Update the preview with S3 URL and notify parent
      setPreview(publicUrl);
      onChange(field, publicUrl);
      setUploadProgress(100);

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 500);

    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
      setPreview(value); // Revert to previous image
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setUploadError(null);
    onChange(field, "");
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center justify-between text-xs font-semibold text-gray-600 uppercase tracking-wide">
        <span className="flex items-center gap-1.5">
          {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
          {label}
        </span>
        {isChanged && (
          <span className="flex items-center gap-1 text-amber-600 normal-case text-[10px] font-medium bg-amber-50 px-2 py-0.5 rounded-full">
            <Zap className="w-3 h-3" />
            Modified
          </span>
        )}
      </label>

      <div className="relative group">
        <div className={`${aspectRatio} rounded-xl overflow-hidden border-2 border-dashed transition-all ${uploading
          ? 'border-indigo-400 bg-indigo-50'
          : preview
            ? 'border-gray-200 bg-gray-50'
            : 'border-gray-300 hover:border-indigo-400 bg-gray-50'
          }`}>
          {uploading ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-50">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
              <span className="text-sm font-medium text-indigo-600">{uploadProgress}%</span>
              <span className="text-xs text-indigo-500 mt-1">Uploading...</span>
            </div>
          ) : preview ? (
            <>
              <img
                src={preview}
                alt={label}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <a
                  href={preview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <Eye className="w-5 h-5 text-gray-700" />
                </a>
                <label className="p-2.5 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                  />
                  <RefreshCw className="w-5 h-5 text-gray-700" />
                </label>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-2.5 bg-red-500 rounded-lg shadow-lg hover:bg-red-600 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </>
          ) : (
            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-indigo-500 transition-colors">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
              />
              <Camera className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">Click to upload</span>
              <span className="text-xs text-gray-400 mt-1">JPG, PNG (max 5MB)</span>
            </label>
          )}
        </div>

        {/* Upload Progress Bar */}
        {uploading && uploadProgress > 0 && (
          <div className="absolute -bottom-1 left-2 right-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {uploadError && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {uploadError}
        </p>
      )}
    </div>
  );
};

// Options defined outside component
const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const stateOptions = [
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "Bihar", label: "Bihar" },
  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Punjab", label: "Punjab" },
  { value: "Haryana", label: "Haryana" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Karnataka", label: "Karnataka" },
];

const relationOptions = [
  { value: "spouse", label: "Spouse" },
  { value: "father", label: "Father" },
  { value: "mother", label: "Mother" },
  { value: "son", label: "Son" },
  { value: "daughter", label: "Daughter" },
  { value: "brother", label: "Brother" },
  { value: "sister", label: "Sister" },
  { value: "other", label: "Other" },
];

const EditProfileModal = ({ isOpen, onClose, farmerId, onSave }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [fetchError, setFetchError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [changedFields, setChangedFields] = useState({});
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [farmerInfo, setFarmerInfo] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    // Account Status
    is_active: true,

    // Personal Details
    name: "",
    phone_number: "",
    email: "",
    dob: "",
    gender: "",
    aadhaar_number: "",
    pan_number: "",
    user_image: "",
    aadhaar_image: "",
    pan_image: "",

    // Address Details
    address: "",
    tehsil: "",
    district: "",
    state: "",
    pin_code: "",
    landmark: "",

    // Land Details
    land_size: "",

    // Bank Details
    account_number: "",
    ifsc_code: "",
    account_holder: "",
    bank_name: "",
    branch_name: "",
    bank_passbook_img: "",

    // Nominee Details
    nominee_name: "",
    nominee_relation: "",
    nominee_phone: "",
    nominee_email: "",
    nominee_dob: "",
    nominee_gender: "",
    nominee_aadhaar: "",
    nominee_pan: "",
    nominee_address: "",
    nominee_image: "",
    nominee_aadhaar_image: "",
    nominee_pan_image: "",
  });

  // Fetch farmer data
  const fetchFarmerDetails = useCallback(async () => {
    if (!farmerId) return;

    setIsLoading(true);
    setFetchError(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/getfarmerdetails?farmerId=${farmerId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        setFarmerInfo(data);

        // Handle land_size which comes as $numberDecimal
        const landSize = data.land_size?.$numberDecimal || data.land_size || "";

        const mappedData = {
          is_active: data.is_active ?? true,
          name: data.name || "",
          phone_number: data.phone_number || "",
          email: data.email || "",
          dob: data.dob || "",
          gender: data.gender || "",
          aadhaar_number: data.aadhaar_number || "",
          pan_number: data.pan_number || "",
          user_image: data.user_image || "",
          aadhaar_image: data.aadhaar_image || "",
          pan_image: data.pan_image || "",
          address: data.address || "",
          tehsil: data.tehsil || "",
          district: data.district || "",
          state: data.state || "",
          pin_code: data.pin_code || "",
          landmark: data.landmark || "",
          land_size: landSize,
          account_number: data.account_number || "",
          ifsc_code: data.ifsc_code || "",
          account_holder: data.account_holder || "",
          bank_name: data.bank_name || "",
          branch_name: data.branch_name || "",
          bank_passbook_img: data.bank_passbook_img || "",
          nominee_name: data.nominee_name || "",
          nominee_relation: data.nominee_relation || "",
          nominee_phone: data.nominee_phone || "",
          nominee_email: data.nominee_email || "",
          nominee_dob: data.nominee_dob || "",
          nominee_gender: data.nominee_gender || "",
          nominee_aadhaar: data.nominee_aadhaar || "",
          nominee_pan: data.nominee_pan || "",
          nominee_address: data.nominee_address || "",
          nominee_image: data.nominee_image || "",
          nominee_aadhaar_image: data.nominee_aadhaar_image || "",
          nominee_pan_image: data.nominee_pan_image || "",
        };

        setFormData(mappedData);
        setOriginalData(mappedData);
        setChangedFields({});
      } else {
        setFetchError(
          response.data.message || "Failed to fetch farmer details"
        );
      }
    } catch (error) {
      console.error("Error fetching farmer details:", error);
      setFetchError(
        error.response?.data?.message || "Failed to connect to server"
      );
    } finally {
      setIsLoading(false);
    }
  }, [farmerId]);

  useEffect(() => {
    if (isOpen && farmerId) {
      fetchFarmerDetails();
    }
  }, [isOpen, farmerId, fetchFarmerDetails]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("personal");
      setErrors({});
      setTouched({});
      setSaveSuccess(false);
      setChangedFields({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const tabs = [
    {
      id: "personal",
      label: "Personal Info",
      icon: User,
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: "address",
      label: "Address & Land",
      icon: MapPin,
      color: "from-green-500 to-emerald-600",
    },
    {
      id: "bank",
      label: "Bank Details",
      icon: Building2,
      color: "from-purple-500 to-pink-600",
    },
    {
      id: "nominee",
      label: "Nominee Info",
      icon: Users,
      color: "from-amber-500 to-orange-600",
    },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Track changed fields
    if (value !== originalData[field]) {
      setChangedFields((prev) => ({ ...prev, [field]: value }));
    } else {
      setChangedFields((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }

    // Clear success message
    if (saveSuccess) {
      setSaveSuccess(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Only validate changed fields that are required
    const changedFieldKeys = Object.keys(changedFields);

    // Personal validation
    if (changedFieldKeys.includes("name") && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (changedFieldKeys.includes("phone_number")) {
      if (!formData.phone_number.trim()) {
        newErrors.phone_number = "Phone is required";
      } else if (
        !/^[0-9]{10,12}$/.test(formData.phone_number.replace(/\s/g, ""))
      ) {
        newErrors.phone_number = "Invalid phone number";
      }
    }
    if (changedFieldKeys.includes("email") && formData.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email address";
      }
    }
    if (
      changedFieldKeys.includes("aadhaar_number") &&
      !formData.aadhaar_number.trim()
    ) {
      newErrors.aadhaar_number = "Aadhaar is required";
    }

    // Address validation
    if (changedFieldKeys.includes("address") && !formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (changedFieldKeys.includes("district") && !formData.district.trim()) {
      newErrors.district = "District is required";
    }
    if (changedFieldKeys.includes("state") && !formData.state.trim()) {
      newErrors.state = "State is required";
    }
    if (changedFieldKeys.includes("pin_code") && !formData.pin_code.trim()) {
      newErrors.pin_code = "PIN code is required";
    }

    // Bank validation
    if (
      changedFieldKeys.includes("account_number") &&
      !formData.account_number.trim()
    ) {
      newErrors.account_number = "Account number is required";
    }
    if (changedFieldKeys.includes("ifsc_code") && !formData.ifsc_code.trim()) {
      newErrors.ifsc_code = "IFSC code is required";
    }
    if (changedFieldKeys.includes("bank_name") && !formData.bank_name.trim()) {
      newErrors.bank_name = "Bank name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    // Check if there are any changes
    if (Object.keys(changedFields).length === 0) {
      setErrors({ general: "No changes to save" });
      return;
    }

    if (!validateForm()) {
      // Switch to tab with first error
      const errorFields = Object.keys(errors);
      if (errorFields.length > 0) {
        const personalFields = [
          "name",
          "phone_number",
          "email",
          "dob",
          "gender",
          "aadhaar_number",
          "pan_number",
        ];
        const addressFields = [
          "address",
          "tehsil",
          "district",
          "state",
          "pin_code",
          "landmark",
          "land_size",
        ];
        const bankFields = [
          "account_number",
          "ifsc_code",
          "account_holder",
          "bank_name",
          "branch_name",
        ];

        if (personalFields.some((f) => errorFields.includes(f)))
          setActiveTab("personal");
        else if (addressFields.some((f) => errorFields.includes(f)))
          setActiveTab("address");
        else if (bankFields.some((f) => errorFields.includes(f)))
          setActiveTab("bank");
        else setActiveTab("nominee");
      }
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      // Prepare payload with only changed fields and farmerId
      const payload = {
        farmerId,
        ...changedFields,
      };

      console.log("Updating with payload:", payload);

      const response = await axios.put(
        `${API_BASE_URL}/user/updatefarmerdetails?farmerId=${farmerId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setSaveSuccess(true);
        // Update original data to current form data
        setOriginalData({ ...formData });
        setChangedFields({});

        // Notify parent component
        onSave?.(formData);

        // Auto close after success
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrors({
          general: response.data.message || "Failed to update farmer details",
        });
      }
    } catch (error) {
      console.error("Save failed:", error);
      setErrors({
        general:
          error.response?.data?.message ||
          "Failed to save changes. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to render InputField with common props
  const renderInputField = (props) => (
    <InputField
      {...props}
      value={formData[props.field]}
      onChange={handleChange}
      error={errors[props.field]}
      touched={touched[props.field]}
      isChanged={changedFields[props.field] !== undefined}
      originalValue={originalData[props.field]}
    />
  );

  const getCompletionPercentage = () => {
    const fields = Object.keys(formData);
    const filledFields = fields.filter(
      (f) => formData[f] && formData[f].toString().trim()
    );
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const getChangedFieldsCount = () => Object.keys(changedFields).length;

  // Loading State
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Loading Farmer Details
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Please wait while we fetch the data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (fetchError) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center gap-4">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Failed to Load Data
            </h3>
            <p className="text-sm text-gray-500 mt-1">{fetchError}</p>
          </div>
          <div className="flex gap-3 mt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={fetchFarmerDetails}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          </div>

          <div className="relative px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar display - reflects current form data */}
                <div className="relative group">
                  {formData.user_image ? (
                    <img
                      src={formData.user_image}
                      alt={formData.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-xl"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl border border-white/30 shadow-xl">
                      {formData.name
                        ? formData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()
                        : "NA"}
                    </div>
                  )}
                  {changedFields.user_image !== undefined && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Edit3 className="w-5 h-5" />
                      Edit Farmer Profile
                    </h2>
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-white/70 text-sm">
                      ID: {farmerInfo?.farmerId || farmerId}
                    </p>
                    {farmerInfo?.overallStatus && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${farmerInfo.overallStatus === "approved"
                          ? "bg-green-400/20 text-green-100"
                          : farmerInfo.overallStatus === "pending"
                            ? "bg-yellow-400/20 text-yellow-100"
                            : "bg-red-400/20 text-red-100"
                          }`}
                      >
                        {farmerInfo.overallStatus.charAt(0).toUpperCase() +
                          farmerInfo.overallStatus.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Changes indicator */}
                {getChangedFieldsCount() > 0 && (
                  <div className="hidden sm:flex items-center gap-2 bg-amber-400/20 backdrop-blur-sm rounded-xl px-3 py-2 border border-amber-300/30">
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span className="text-amber-100 text-sm font-medium">
                      {getChangedFieldsCount()} change
                      {getChangedFieldsCount() > 1 ? "s" : ""}
                    </span>
                  </div>
                )}

                {/* Completion indicator */}
                <div className="hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <div className="text-right">
                    <p className="text-white font-bold text-sm">
                      {getCompletionPercentage()}%
                    </p>
                    <p className="text-white/60 text-xs">Complete</p>
                  </div>
                  <div className="w-12 h-12 relative">
                    <svg className="w-12 h-12 -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeDasharray={`${getCompletionPercentage() * 1.26
                          } 126`}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <CheckCircle2 className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
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

        {/* Success Banner */}
        {saveSuccess && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 px-6 py-3 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
            <div className="p-1.5 bg-green-100 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">
                Changes saved successfully!
              </p>
              <p className="text-xs text-green-600">Closing in a moment...</p>
            </div>
          </div>
        )}

        {/* General Error Banner */}
        {errors.general && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-200 px-6 py-3 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
            <div className="p-1.5 bg-red-100 rounded-full">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">
                {errors.general}
              </p>
            </div>
            <button
              onClick={() => setErrors((prev) => ({ ...prev, general: null }))}
              className="p-1 hover:bg-red-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-gray-50 px-4 py-2 gap-2 flex-shrink-0 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const tabFields = {
              personal: [
                "name",
                "phone_number",
                "email",
                "dob",
                "gender",
                "aadhaar_number",
                "pan_number",
              ],
              address: [
                "address",
                "tehsil",
                "district",
                "state",
                "pin_code",
                "landmark",
                "land_size",
              ],
              bank: [
                "account_number",
                "ifsc_code",
                "account_holder",
                "bank_name",
                "branch_name",
              ],
              nominee: [
                "nominee_name",
                "nominee_relation",
                "nominee_phone",
                "nominee_email",
                "nominee_dob",
                "nominee_gender",
                "nominee_aadhaar",
                "nominee_pan",
                "nominee_address",
              ],
            };
            const changedCount =
              tabFields[tab.id]?.filter((f) => changedFields[f] !== undefined)
                .length || 0;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[140px] px-4 py-2 flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-300 relative ${activeTab === tab.id
                  ? "bg-white text-gray-800 shadow-md scale-[1.02]"
                  : "text-gray-500 hover:bg-white/50 hover:text-gray-700"
                  }`}
              >
                <div
                  className={`p-1.5 rounded-lg bg-gradient-to-br ${activeTab === tab.id
                    ? tab.color
                    : "from-gray-300 to-gray-400"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm whitespace-nowrap">{tab.label}</span>
                {changedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {changedCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          {/* Personal Info Tab */}
          {activeTab === "personal" && (
            <div className="space-y-5">
              <SectionCard
                title="Basic Information"
                icon={User}
                color="blue"
              >
                {/* Account Status Toggle */}
                <div className="mb-5 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl shadow-sm ${formData.is_active ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-rose-600'}`}>
                        <Power className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Account Status</p>
                        <p className="text-xs text-gray-500">
                          {formData.is_active ? 'Farmer can access the system' : 'Farmer access is disabled'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange('is_active', !formData.is_active)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${formData.is_active
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                    >
                      {formData.is_active ? (
                        <>
                          <ToggleRight className="w-5 h-5" />
                          Active
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5" />
                          Inactive
                        </>
                      )}
                    </button>
                  </div>
                  {changedFields.is_active !== undefined && (
                    <div className="mt-3 flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg text-xs font-medium">
                      <Zap className="w-3.5 h-3.5" />
                      Status will change from {originalData.is_active ? 'Active' : 'Inactive'} to {formData.is_active ? 'Active' : 'Inactive'}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {renderInputField({
                    label: "Full Name",
                    field: "name",
                    icon: User,
                    placeholder: "Enter full name",
                    required: true,
                  })}
                  {renderInputField({
                    label: "Phone Number",
                    field: "phone_number",
                    icon: Phone,
                    placeholder: "9876543210",
                    required: true,
                  })}
                  {renderInputField({
                    label: "Email Address",
                    field: "email",
                    icon: Mail,
                    type: "email",
                    placeholder: "email@example.com",
                  })}
                  {renderInputField({
                    label: "Date of Birth",
                    field: "dob",
                    icon: Calendar,
                    type: "date",
                  })}
                  {renderInputField({
                    label: "Gender",
                    field: "gender",
                    icon: User,
                    options: genderOptions,
                  })}
                </div>
              </SectionCard>

              <SectionCard
                title="Identity Documents"
                icon={Shield}
                color="indigo"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInputField({
                    label: "Aadhaar Number",
                    field: "aadhaar_number",
                    icon: Hash,
                    placeholder: "123456789012",
                    required: true,
                  })}
                  {renderInputField({
                    label: "PAN Number",
                    field: "pan_number",
                    icon: CreditCard,
                    placeholder: "ABCDE1234F",
                  })}
                </div>

                {/* Document Images - Now with Upload Capability */}
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    Document Images
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ImageUploadField
                      label="Profile Photo"
                      field="user_image"
                      icon={User}
                      value={formData.user_image}
                      onChange={handleChange}
                      folder="farmer-photos"
                      isChanged={changedFields.user_image !== undefined}
                    />
                    <ImageUploadField
                      label="Aadhaar Card"
                      field="aadhaar_image"
                      icon={CreditCard}
                      value={formData.aadhaar_image}
                      onChange={handleChange}
                      folder="farmer-documents"
                      isChanged={changedFields.aadhaar_image !== undefined}
                    />
                    <ImageUploadField
                      label="PAN Card"
                      field="pan_image"
                      icon={FileText}
                      value={formData.pan_image}
                      onChange={handleChange}
                      folder="farmer-documents"
                      isChanged={changedFields.pan_image !== undefined}
                    />
                  </div>
                </div>

                {/* Document upload info */}
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Document Upload
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Click on any document to upload or replace. Images are securely stored and will require re-verification after changes.
                      </p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {/* Address Tab */}
          {activeTab === "address" && (
            <div className="space-y-5">
              <SectionCard
                title="Residential Address"
                icon={MapPin}
                color="green"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    {renderInputField({
                      label: "Address",
                      field: "address",
                      icon: MapPin,
                      placeholder: "Village, Post Office",
                      required: true,
                    })}
                  </div>
                  {renderInputField({
                    label: "Landmark",
                    field: "landmark",
                    icon: MapPin,
                    placeholder: "Near landmark",
                  })}
                  {renderInputField({
                    label: "Tehsil",
                    field: "tehsil",
                    icon: MapPin,
                    placeholder: "Enter tehsil",
                  })}
                  {renderInputField({
                    label: "District",
                    field: "district",
                    icon: MapPin,
                    placeholder: "Enter district",
                    required: true,
                  })}
                  {renderInputField({
                    label: "State",
                    field: "state",
                    icon: MapPin,
                    options: stateOptions,
                    required: true,
                  })}
                  {renderInputField({
                    label: "PIN Code",
                    field: "pin_code",
                    icon: Hash,
                    placeholder: "273402",
                    required: true,
                  })}
                </div>
              </SectionCard>

              <SectionCard title="Land Details" icon={Wheat} color="amber">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInputField({
                    label: "Land Size (Acres)",
                    field: "land_size",
                    icon: Wheat,
                    type: "number",
                    placeholder: "2.5",
                  })}
                </div>

                {/* Khatauni Images */}
                {farmerInfo?.khatauni_images?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                      Khatauni Documents
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {farmerInfo.khatauni_images.map((img, index) => (
                        <ImagePreview
                          key={img.khatauni_id}
                          src={img.image_url}
                          label={`Khatauni ${index + 1}`}
                          icon={FileText}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Land documents hint */}
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        Khatauni Documents
                      </p>
                      <p className="text-xs text-amber-600 mt-1">
                        Land ownership documents are verified separately.
                        Contact admin to update Khatauni records.
                      </p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {/* Bank Tab */}
          {activeTab === "bank" && (
            <div className="space-y-5">
              <SectionCard
                title="Bank Account Details"
                icon={Building2}
                color="purple"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {renderInputField({
                    label: "Account Number",
                    field: "account_number",
                    icon: CreditCard,
                    placeholder: "Enter account number",
                    required: true,
                    showToggle: true,
                  })}
                  {renderInputField({
                    label: "IFSC Code",
                    field: "ifsc_code",
                    icon: Hash,
                    placeholder: "SBIN0001234",
                    required: true,
                  })}
                  {renderInputField({
                    label: "Account Holder Name",
                    field: "account_holder",
                    icon: User,
                    placeholder: "Name as per bank",
                  })}
                  {renderInputField({
                    label: "Bank Name",
                    field: "bank_name",
                    icon: Building2,
                    placeholder: "State Bank of India",
                    required: true,
                  })}
                  {renderInputField({
                    label: "Branch Name",
                    field: "branch_name",
                    icon: Landmark,
                    placeholder: "Main Branch",
                  })}
                </div>

                {/* Bank Passbook Image - Now with Upload Capability */}
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    Bank Documents
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ImageUploadField
                      label="Bank Passbook"
                      field="bank_passbook_img"
                      icon={FileText}
                      value={formData.bank_passbook_img}
                      onChange={handleChange}
                      folder="farmer-bank-docs"
                      isChanged={changedFields.bank_passbook_img !== undefined}
                    />
                  </div>
                </div>
              </SectionCard>

              {/* Bank verification status */}
              <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Bank Account Status
                      </p>
                      <p className="text-xs text-gray-500">
                        Registered on{" "}
                        {new Date(
                          farmerInfo?.registration_date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
                    <BadgeCheck className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-700">
                      Linked
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nominee Tab */}
          {activeTab === "nominee" && (
            <div className="space-y-5">
              <SectionCard
                title="Nominee Personal Information"
                icon={Users}
                color="orange"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {renderInputField({
                    label: "Nominee Name",
                    field: "nominee_name",
                    icon: User,
                    placeholder: "Enter nominee name",
                  })}
                  {renderInputField({
                    label: "Relationship",
                    field: "nominee_relation",
                    icon: Users,
                    options: relationOptions,
                  })}
                  {renderInputField({
                    label: "Phone Number",
                    field: "nominee_phone",
                    icon: Phone,
                    placeholder: "9876543210",
                  })}
                  {renderInputField({
                    label: "Email Address",
                    field: "nominee_email",
                    icon: Mail,
                    type: "email",
                    placeholder: "email@example.com",
                  })}
                  {renderInputField({
                    label: "Date of Birth",
                    field: "nominee_dob",
                    icon: Calendar,
                    type: "date",
                  })}
                  {renderInputField({
                    label: "Gender",
                    field: "nominee_gender",
                    icon: User,
                    options: genderOptions,
                  })}
                </div>
              </SectionCard>

              <SectionCard
                title="Nominee Identity & Address"
                icon={Shield}
                color="red"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInputField({
                    label: "Aadhaar Number",
                    field: "nominee_aadhaar",
                    icon: Hash,
                    placeholder: "123456789012",
                  })}
                  {renderInputField({
                    label: "PAN Number",
                    field: "nominee_pan",
                    icon: CreditCard,
                    placeholder: "ABCDE1234F",
                  })}
                  <div className="md:col-span-2">
                    {renderInputField({
                      label: "Address",
                      field: "nominee_address",
                      icon: MapPin,
                      placeholder: "Complete address",
                    })}
                  </div>
                </div>

                {/* Nominee Document Images - Now with Upload Capability */}
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    Nominee Documents
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ImageUploadField
                      label="Nominee Photo"
                      field="nominee_image"
                      icon={User}
                      value={formData.nominee_image}
                      onChange={handleChange}
                      folder="nominee-photos"
                      isChanged={changedFields.nominee_image !== undefined}
                    />
                    <ImageUploadField
                      label="Nominee Aadhaar"
                      field="nominee_aadhaar_image"
                      icon={CreditCard}
                      value={formData.nominee_aadhaar_image}
                      onChange={handleChange}
                      folder="nominee-documents"
                      isChanged={changedFields.nominee_aadhaar_image !== undefined}
                    />
                    <ImageUploadField
                      label="Nominee PAN"
                      field="nominee_pan_image"
                      icon={FileText}
                      value={formData.nominee_pan_image}
                      onChange={handleChange}
                      folder="nominee-documents"
                      isChanged={changedFields.nominee_pan_image !== undefined}
                    />
                  </div>
                </div>
              </SectionCard>

              {/* Nominee info */}
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">
                      Nominee Information
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      The nominee will be the beneficiary in case of any claims.
                      Ensure all details are accurate and up-to-date.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">
                  Required fields marked with *
                </span>
              </div>

              {getChangedFieldsCount() > 0 && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-medium">
                    {getChangedFieldsCount()} unsaved change
                    {getChangedFieldsCount() > 1 ? "s" : ""}
                  </span>
                </div>
              )}

              {Object.keys(errors).filter((k) => k !== "general").length >
                0 && (
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">
                      {Object.keys(errors).filter((k) => k !== "general").length}{" "}
                      error
                      {Object.keys(errors).filter((k) => k !== "general").length >
                        1
                        ? "s"
                        : ""}{" "}
                      found
                    </span>
                  </div>
                )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setFormData({ ...originalData });
                  setChangedFields({});
                  setTouched({});
                  setErrors({});
                }}
                disabled={isSaving || getChangedFieldsCount() === 0}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={onClose}
                disabled={isSaving}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || getChangedFieldsCount() === 0}
                className="group px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                    {getChangedFieldsCount() > 0 && (
                      <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                        {getChangedFieldsCount()}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
