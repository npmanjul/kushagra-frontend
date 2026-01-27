import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Edit3,
  User,
  Briefcase,
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
  Download,
  Upload,
  Trash2,
  Eye,
  RefreshCw,
  History,
  AlertTriangle,
  Info,
  Paperclip,
  Copy,
  Settings,
  Loader2,
  Building2,
  CreditCard,
  GraduationCap,
  Heart,
  Globe,
  Droplet,
  Home,
  Award,
  PhoneCall,
  Activity,
  Wallet,
  FileCheck,
  Clock,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import API_BASE_URL from "@/utils/constants";

// InputField Component
const InputField = ({
  label,
  field,
  type = "text",
  required = false,
  icon: Icon,
  options = null,
  nestedPath = null,
  placeholder = "",
  disabled = false,
  value,
  onChange,
  onBlur,
  hasError,
  errorMessage,
  isValid,
  isChanged,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
        {label}
        {required && <span className="text-red-500">*</span>}
        {isChanged && (
          <span className="ml-auto text-xs text-amber-600 font-normal">
            Modified
          </span>
        )}
      </label>
      <div className="relative">
        {options ? (
          <select
            value={value || ""}
            onChange={(e) => onChange(field, e.target.value, nestedPath)}
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-lg text-sm transition-all ${hasError
                ? "border-red-300 bg-red-50"
                : isChanged
                  ? "border-amber-300 bg-amber-50"
                  : "border-gray-300"
              } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
          >
            <option value="">Select {label}</option>
            {options.map((opt) => (
              <option
                key={typeof opt === "object" ? opt.value : opt}
                value={typeof opt === "object" ? opt.value : opt}
              >
                {typeof opt === "object" ? opt.label : opt}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(field, e.target.value, nestedPath)}
            onBlur={() => onBlur && onBlur(field)}
            disabled={disabled}
            placeholder={placeholder}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg text-sm transition-all resize-none ${hasError
                ? "border-red-300 bg-red-50"
                : isChanged
                  ? "border-amber-300 bg-amber-50"
                  : "border-gray-300"
              } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
          />
        ) : (
          <input
            type={type}
            value={value || ""}
            onChange={(e) =>
              onChange(
                field,
                type === "number" ? Number(e.target.value) : e.target.value,
                nestedPath
              )
            }
            onBlur={() => onBlur && onBlur(field)}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-lg text-sm transition-all ${hasError
                ? "border-red-300 bg-red-50"
                : isChanged
                  ? "border-amber-300 bg-amber-50"
                  : "border-gray-300"
              } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
          />
        )}
        {hasError && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
        )}
        {isValid && !hasError && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
        )}
      </div>
      {hasError && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {errorMessage}
        </p>
      )}
    </div>
  );
};

// SectionHeader Component
const SectionHeader = ({
  icon: Icon,
  title,
  color = "from-indigo-500 to-purple-600",
  collapsible = false,
  isExpanded = false,
  onToggle = null,
}) => (
  <div
    className={`flex items-center justify-between mb-4 ${collapsible ? "cursor-pointer" : ""
      }`}
    onClick={() => collapsible && onToggle && onToggle()}
  >
    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
      <div className={`p-1.5 bg-gradient-to-br ${color} rounded-lg shadow-sm`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      {title}
    </h3>
    {collapsible && (
      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
    )}
  </div>
);

// PhotoUploadComponent - Updated for S3 presigned URL uploads
const PhotoUploadComponent = ({
  currentImage,
  onImageChange,
  onImageRemove,
}) => {
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  // Function to get presigned URL from backend
  const getPresignedUrl = async (file) => {
    const fileExtension = file.name.split('.').pop();
    const fileName = `supervisor_photo_${Date.now()}.${fileExtension}`;

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
          folder: 'employee-photos'
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
      onImageChange(publicUrl);
      setUploadProgress(100);

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 500);

    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
      setPreview(currentImage); // Revert to previous image
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setUploadError(null);
    onImageRemove();
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
        <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
        Profile Photo
      </label>
      <div className="flex items-start gap-4">
        <div className="relative group">
          <div className={`w-24 h-24 rounded-xl overflow-hidden border-2 border-dashed transition-colors ${uploading ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
            }`}>
            {uploading ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-50">
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-1" />
                <span className="text-xs text-indigo-600">{uploadProgress}%</span>
              </div>
            ) : preview ? (
              <>
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.open(preview, "_blank")}
                    className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
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
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-xs">Upload</span>
              </label>
            )}
          </div>
          {/* Upload Progress Bar */}
          {uploading && uploadProgress > 0 && (
            <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500">
            Upload a profile photo. Recommended size: 256x256 pixels.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Supported formats: JPG, PNG (max 5MB)
          </p>
          {uploadError && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {uploadError}
            </p>
          )}
          {preview && !uploading && (
            <label className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
              />
              <RefreshCw className="w-3.5 h-3.5" />
              Change Photo
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

const SupervisorEditModal = ({ isOpen, onClose, onSave, supervisorId }) => {
  // Form States
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [activeTab, setActiveTab] = useState("personal");
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [changedFields, setChangedFields] = useState(new Set());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [editMode, setEditMode] = useState({});
  const [validationStatus, setValidationStatus] = useState({});
  const [expandedSections, setExpandedSections] = useState({});

  // API States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch supervisor data from API
  useEffect(() => {
    if (isOpen && supervisorId) {
      fetchSupervisorData();
    }
  }, [isOpen, supervisorId]);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("personal");
      setErrors({});
      setIsDirty(false);
      setChangedFields(new Set());
      setEditMode({});
      setValidationStatus({});
      setSaveSuccess(false);
    }
  }, [isOpen]);

  const fetchSupervisorData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/employee/getsupervisordetail?supervisorId=${supervisorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const result = await response.json();

      if (result.success) {
        const data = result.data;
        const processedData = {
          _id: data._id,
          name: data.name || "",
          phone_number: data.phone_number || "",
          secondary_phone_number: data.secondary_phone_number || "",
          email: data.email || "",
          gender: data.gender || "",
          dob: data.dob ? data.dob.split("T")[0] : "",
          role: data.role || "",
          is_active: data.is_active ?? true,
          employee_id: data.employee_id || "",
          photo: data.photo || "",
          marital_status: data.marital_status || "",
          nationality: data.nationality || "",
          blood_group: data.blood_group || "",
          permanent_address: data.permanent_address || {
            line1: "",
            line2: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
          },
          current_address: data.current_address || {
            line1: "",
            line2: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
          },
          same_as_permanent: data.same_as_permanent ?? false,
          employment_type: data.employment_type || "",
          date_of_joining: data.date_of_joining
            ? data.date_of_joining.split("T")[0]
            : "",
          employment_status: data.employment_status || "",
          salary: data.salary || 0,
          bank_details: data.bank_details || {
            account_number: "",
            ifsc_code: "",
            account_holder: "",
            bank_name: "",
            branch_name: "",
            upi_id: "",
          },
          govt_ids: data.govt_ids || {
            pan_number: "",
            aadhaar_number: "",
            passport_number: "",
            passport_expiry: "",
            pf_number: "",
            esi_number: "",
            tax_status: "",
          },
          education: data.education || [],
          certifications: data.certifications || [],
          experience: data.experience || [],
          total_experience_years: data.total_experience_years || 0,
          skills: data.skills || [],
          medical_conditions: data.medical_conditions || "",
          emergency_contacts: data.emergency_contacts || [],
          hr_notes: data.hr_notes || "",
          background_check_status: data.background_check_status || "",
          warehouse: data.warehouse?._id || "",
          manager: data.manager?._id || "",
        };
        setFormData(processedData);
        setOriginalData(JSON.parse(JSON.stringify(processedData)));
      } else {
        setError(result.message || "Failed to fetch supervisor details");
      }
    } catch (err) {
      setError("Failed to fetch supervisor details. Please try again.");
      console.error("Error fetching supervisor:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validate required fields
    const requiredFields = ["name", "phone_number", "email"];
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Validate specific fields
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.phone_number && !/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Phone number must be 10 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updatePayload = {
        supervisorId: supervisorId,
        ...formData,
        modifiedFields: Array.from(changedFields),
        modifiedAt: new Date().toISOString(),
      };

      const response = await fetch(
        `${API_BASE_URL}/employee/updatesupervisordetail?supervisorId=${supervisorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatePayload),
        }
      );

      const result = await response.json();

      if (result.success) {
        setSaveSuccess(true);
        setIsDirty(false);
        setChangedFields(new Set());
        setOriginalData(JSON.parse(JSON.stringify(formData)));

        if (onSave) {
          onSave(result.data);
        }

        // Show success message and close after delay
        setTimeout(() => {
          setSaveSuccess(false);
          onClose();
        }, 1500);
      } else {
        setError(result.message || "Failed to update supervisor details");
      }
    } catch (err) {
      setError("Failed to update supervisor details. Please try again.");
      console.error("Error updating supervisor:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  // Helper Functions
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return dateString.split("T")[0];
    } catch {
      return dateString;
    }
  };

  const handleInputChange = (field, value, nestedPath = null) => {
    setFormData((prev) => {
      if (nestedPath) {
        const [parent, child] = nestedPath.split(".");
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });

    const fieldKey = nestedPath || field;
    setChangedFields((prev) => new Set(prev).add(fieldKey));
    setIsDirty(true);

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleArrayChange = (arrayField, index, field, value) => {
    setFormData((prev) => {
      const newArray = [...(prev[arrayField] || [])];
      newArray[index] = {
        ...newArray[index],
        [field]: value,
      };
      return {
        ...prev,
        [arrayField]: newArray,
      };
    });
    setChangedFields((prev) => new Set(prev).add(arrayField));
    setIsDirty(true);
  };

  const addArrayItem = (arrayField, defaultItem) => {
    setFormData((prev) => ({
      ...prev,
      [arrayField]: [...(prev[arrayField] || []), defaultItem],
    }));
    setChangedFields((prev) => new Set(prev).add(arrayField));
    setIsDirty(true);
  };

  const removeArrayItem = (arrayField, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayField]: prev[arrayField].filter((_, i) => i !== index),
    }));
    setChangedFields((prev) => new Set(prev).add(arrayField));
    setIsDirty(true);
  };

  const validateField = (field, value) => {
    switch (field) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? null
          : "Invalid email format";
      case "phone_number":
      case "secondary_phone_number":
        return !value || /^\d{10}$/.test(value)
          ? null
          : "Phone number must be 10 digits";
      case "postalCode":
        return !value || /^\d{6}$/.test(value)
          ? null
          : "Postal code must be 6 digits";
      default:
        return null;
    }
  };

  const handleBlur = (field) => {
    const error = validateField(field, formData[field]);
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
      setValidationStatus((prev) => ({ ...prev, [field]: "error" }));
    } else {
      setValidationStatus((prev) => ({ ...prev, [field]: "success" }));
    }
  };

  const handleDiscard = () => {
    if (isDirty) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const resetChanges = () => {
    setFormData(JSON.parse(JSON.stringify(originalData)));
    setChangedFields(new Set());
    setIsDirty(false);
    setErrors({});
    setValidationStatus({});
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Tabs Configuration
  const tabs = [
    {
      id: "personal",
      label: "Personal Info",
      icon: User,
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: "employment",
      label: "Employment",
      icon: Briefcase,
      color: "from-violet-500 to-purple-600",
    },
    {
      id: "documents",
      label: "Documents",
      icon: FileText,
      color: "from-emerald-500 to-teal-600",
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
      color: "from-pink-500 to-rose-600",
    },
  ];

  // Render helper for InputField
  const renderInputField = (props) => {
    const { field, nestedPath } = props;
    const value = nestedPath
      ? nestedPath.split(".").reduce((obj, key) => obj?.[key], formData)
      : formData[field];
    const hasError = errors[field];
    const isValid = validationStatus[field] === "success";
    const isChanged = changedFields.has(nestedPath || field);

    return (
      <InputField
        {...props}
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        hasError={hasError}
        errorMessage={hasError}
        isValid={isValid}
        isChanged={isChanged}
      />
    );
  };

  // Render helper for SectionHeader
  const renderSectionHeader = (props) => {
    const { sectionKey } = props;
    return (
      <SectionHeader
        {...props}
        isExpanded={sectionKey ? expandedSections[sectionKey] : false}
        onToggle={sectionKey ? () => toggleSection(sectionKey) : null}
      />
    );
  };

  // Address Fields render function
  const renderAddressFields = (prefix) => (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {renderInputField({
          label: "Address Line 1",
          field: "line1",
          nestedPath: `${prefix}.line1`,
          icon: Home,
          placeholder: "Street address",
        })}
        {renderInputField({
          label: "Address Line 2",
          field: "line2",
          nestedPath: `${prefix}.line2`,
          icon: Home,
          placeholder: "Apartment, suite, etc.",
        })}
        {renderInputField({
          label: "City",
          field: "city",
          nestedPath: `${prefix}.city`,
          icon: MapPin,
        })}
        {renderInputField({
          label: "State",
          field: "state",
          nestedPath: `${prefix}.state`,
          icon: MapPin,
        })}
        {renderInputField({
          label: "Country",
          field: "country",
          nestedPath: `${prefix}.country`,
          icon: Globe,
        })}
        {renderInputField({
          label: "Postal Code",
          field: "postalCode",
          nestedPath: `${prefix}.postalCode`,
          icon: Hash,
        })}
      </div>
    </div>
  );

  // Render helper for PhotoUpload
  const renderPhotoUpload = (currentImage) => (
    <PhotoUploadComponent
      currentImage={currentImage}
      onImageChange={(imageData) => handleInputChange("photo", imageData)}
      onImageRemove={() => handleInputChange("photo", "")}
    />
  );

  // Confirmation Dialog Component
  const ConfirmDialog = () => {
    if (!showConfirmDialog) return null;
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Unsaved Changes
                </h3>
                <p className="text-sm text-gray-600">
                  You have unsaved changes. Are you sure you want to discard
                  them?
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-2">
                Modified fields ({changedFields.size}):
              </p>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {Array.from(changedFields).map((field) => (
                  <span
                    key={field}
                    className="px-2 py-1 bg-white text-xs rounded border border-gray-200"
                  >
                    {field.replace(/_/g, " ").replace(/\./g, " → ")}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  onClose();
                }}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">
            Loading supervisor details...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error && !formData._id) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={fetchSupervisorData}
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

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
            </div>
            <div className="relative px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Profile Photo Preview */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-white/20 rounded-full blur animate-pulse"></div>
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/50">
                      <img
                        src={
                          formData.photo ||
                          `https://ui-avatars.com/api/?name=${formData.name}&background=random&size=256`
                        }
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Edit3 className="w-5 h-5" />
                      Edit Supervisor Profile
                    </h2>
                    <div className="flex items-center gap-3 text-white/70 text-xs mt-1">
                      <span>{formData.name}</span>
                      <span>•</span>
                      <span>ID: {formData.employee_id}</span>
                      {isDirty && (
                        <>
                          <span>•</span>
                          <span className="text-yellow-300 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {changedFields.size} field(s) modified
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDiscard}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {saveSuccess && (
            <div className="bg-green-50 border-b border-green-200 px-5 py-3 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Supervisor details updated successfully!
              </span>
            </div>
          )}

          {/* Error Banner */}
          {error && formData._id && (
            <div className="bg-red-50 border-b border-red-200 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  {error}
                </span>
              </div>
              <button
                onClick={() => setError(null)}
                className="p-1 hover:bg-red-100 rounded transition-colors"
              >
                <X className="w-4 h-4 text-red-600" />
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
                  className={`flex-shrink-0 px-4 py-2 flex items-center gap-2 font-medium rounded-lg transition-all duration-300 ${activeTab === tab.id
                      ? `bg-white text-gray-800 shadow-md scale-[1.02] border border-gray-200`
                      : "text-gray-500 hover:bg-white/50 hover:text-gray-700"
                    }`}
                >
                  <div
                    className={`p-1.5 rounded-lg bg-gradient-to-br ${activeTab === tab.id
                        ? tab.color
                        : "from-gray-300 to-gray-400"
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
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Personal Information Tab */}
              {activeTab === "personal" && (
                <>
                  {/* Basic Information */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    {renderSectionHeader({
                      icon: User,
                      title: "Basic Information",
                    })}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderInputField({
                        label: "Full Name",
                        field: "name",
                        required: true,
                        icon: User,
                      })}
                      {renderInputField({
                        label: "Employee ID",
                        field: "employee_id",
                        icon: Hash,
                        disabled: true,
                      })}
                      {renderInputField({
                        label: "Date of Birth",
                        field: "dob",
                        type: "date",
                        icon: Calendar,
                      })}
                      {renderInputField({
                        label: "Gender",
                        field: "gender",
                        options: ["male", "female", "other"],
                        icon: User,
                      })}
                      {renderInputField({
                        label: "Marital Status",
                        field: "marital_status",
                        options: ["Single", "Married", "Divorced", "Widowed"],
                        icon: Heart,
                      })}
                      {renderInputField({
                        label: "Nationality",
                        field: "nationality",
                        icon: Globe,
                      })}
                      {renderInputField({
                        label: "Blood Group",
                        field: "blood_group",
                        options: [
                          "A+",
                          "A-",
                          "B+",
                          "B-",
                          "AB+",
                          "AB-",
                          "O+",
                          "O-",
                        ],
                        icon: Droplet,
                      })}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    {renderSectionHeader({
                      icon: Phone,
                      title: "Contact Information",
                      color: "from-green-500 to-emerald-600",
                    })}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderInputField({
                        label: "Primary Phone",
                        field: "phone_number",
                        required: true,
                        icon: Phone,
                        placeholder: "10 digit phone number",
                      })}
                      {renderInputField({
                        label: "Secondary Phone",
                        field: "secondary_phone_number",
                        icon: Phone,
                        placeholder: "10 digit phone number",
                      })}
                      <div className="md:col-span-2">
                        {renderInputField({
                          label: "Email Address",
                          field: "email",
                          type: "email",
                          required: true,
                          icon: Mail,
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Permanent Address */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    {renderSectionHeader({
                      icon: Home,
                      title: "Permanent Address",
                      color: "from-orange-500 to-red-600",
                    })}
                    {renderAddressFields("permanent_address")}
                  </div>

                  {/* Current Address */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      {renderSectionHeader({
                        icon: MapPin,
                        title: "Current Address",
                        color: "from-teal-500 to-cyan-600",
                      })}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.same_as_permanent}
                          onChange={(e) =>
                            handleInputChange(
                              "same_as_permanent",
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs text-gray-600">
                          Same as permanent address
                        </span>
                      </label>
                    </div>
                    {!formData.same_as_permanent &&
                      renderAddressFields("current_address")}
                    {formData.same_as_permanent && (
                      <p className="text-sm text-gray-500 italic">
                        Current address is same as permanent address
                      </p>
                    )}
                  </div>

                  {/* Profile Photo */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    {renderSectionHeader({
                      icon: ImageIcon,
                      title: "Profile Photo",
                      color: "from-purple-500 to-pink-600",
                    })}
                    {renderPhotoUpload(formData.photo)}
                  </div>
                </>
              )}

              {/* Employment Tab */}
              {activeTab === "employment" && (
                <>
                  {/* Employment Details */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    {renderSectionHeader({
                      icon: Briefcase,
                      title: "Employment Details",
                    })}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderInputField({
                        label: "Role",
                        field: "role",
                        options: ["supervisor", "team_lead"],
                        icon: Briefcase,
                      })}
                      {renderInputField({
                        label: "Employment Type",
                        field: "employment_type",
                        options: [
                          "Full-Time",
                          "Part-Time",
                          "Contract",
                          "Internship",
                        ],
                        icon: FileCheck,
                      })}
                      {renderInputField({
                        label: "Employment Status",
                        field: "employment_status",
                        options: [
                          "Active",
                          "On Leave",
                          "Terminated",
                          "Resigned",
                        ],
                        icon: Activity,
                      })}
                      {renderInputField({
                        label: "Date of Joining",
                        field: "date_of_joining",
                        type: "date",
                        icon: Calendar,
                      })}
                      {renderInputField({
                        label: "Total Experience (Years)",
                        field: "total_experience_years",
                        type: "number",
                        icon: Clock,
                      })}
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-gray-400" />
                          Active Status
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) =>
                              handleInputChange("is_active", e.target.checked)
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Work Experience */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      {renderSectionHeader({
                        icon: History,
                        title: "Work Experience",
                        color: "from-violet-500 to-purple-600",
                      })}
                      <button
                        onClick={() =>
                          addArrayItem("experience", {
                            companyName: "",
                            title: "",
                            startDate: "",
                            endDate: "",
                            responsibilities: "",
                            lastDrawnSalary: 0,
                          })
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Experience
                      </button>
                    </div>
                    <div className="space-y-4">
                      {formData.experience?.map((exp, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-gray-600">
                              Experience #{index + 1}
                            </span>
                            <button
                              onClick={() =>
                                removeArrayItem("experience", index)
                              }
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Company Name
                              </label>
                              <input
                                type="text"
                                value={exp.companyName || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "experience",
                                    index,
                                    "companyName",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Job Title
                              </label>
                              <input
                                type="text"
                                value={exp.title || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "experience",
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Start Date
                              </label>
                              <input
                                type="date"
                                value={formatDate(exp.startDate)}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "experience",
                                    index,
                                    "startDate",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                End Date
                              </label>
                              <input
                                type="date"
                                value={formatDate(exp.endDate)}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "experience",
                                    index,
                                    "endDate",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Last Drawn Salary
                              </label>
                              <input
                                type="number"
                                value={exp.lastDrawnSalary || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "experience",
                                    index,
                                    "lastDrawnSalary",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="md:col-span-2 space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Responsibilities
                              </label>
                              <textarea
                                value={exp.responsibilities || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "experience",
                                    index,
                                    "responsibilities",
                                    e.target.value
                                  )
                                }
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 resize-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!formData.experience ||
                        formData.experience.length === 0) && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No work experience added
                          </p>
                        )}
                    </div>
                  </div>
                </>
              )}

              {/* Documents Tab */}
              {activeTab === "documents" && (
                <>
                  {/* Government IDs */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    {renderSectionHeader({
                      icon: CreditCard,
                      title: "Government IDs",
                    })}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderInputField({
                        label: "PAN Number",
                        field: "pan_number",
                        nestedPath: "govt_ids.pan_number",
                        icon: CreditCard,
                      })}
                      {renderInputField({
                        label: "Aadhaar Number",
                        field: "aadhaar_number",
                        nestedPath: "govt_ids.aadhaar_number",
                        icon: CreditCard,
                      })}
                      {renderInputField({
                        label: "Passport Number",
                        field: "passport_number",
                        nestedPath: "govt_ids.passport_number",
                        icon: FileText,
                      })}
                      {renderInputField({
                        label: "Passport Expiry",
                        field: "passport_expiry",
                        nestedPath: "govt_ids.passport_expiry",
                        type: "date",
                        icon: Calendar,
                      })}
                      {renderInputField({
                        label: "PF Number",
                        field: "pf_number",
                        nestedPath: "govt_ids.pf_number",
                        icon: FileText,
                      })}
                      {renderInputField({
                        label: "ESI Number",
                        field: "esi_number",
                        nestedPath: "govt_ids.esi_number",
                        icon: FileText,
                      })}
                      {renderInputField({
                        label: "Tax Status",
                        field: "tax_status",
                        nestedPath: "govt_ids.tax_status",
                        icon: FileText,
                      })}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      {renderSectionHeader({
                        icon: GraduationCap,
                        title: "Education",
                        color: "from-blue-500 to-indigo-600",
                      })}
                      <button
                        onClick={() =>
                          addArrayItem("education", {
                            qualification: "",
                            institution: "",
                            boardOrUniversity: "",
                            yearOfPassing: "",
                            percentageOrCgpa: "",
                            certificateUrl: "",
                          })
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Education
                      </button>
                    </div>
                    <div className="space-y-4">
                      {formData.education?.map((edu, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-gray-600">
                              Education #{index + 1}
                            </span>
                            <button
                              onClick={() =>
                                removeArrayItem("education", index)
                              }
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Qualification
                              </label>
                              <input
                                type="text"
                                value={edu.qualification || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "education",
                                    index,
                                    "qualification",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Institution
                              </label>
                              <input
                                type="text"
                                value={edu.institution || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "education",
                                    index,
                                    "institution",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Board/University
                              </label>
                              <input
                                type="text"
                                value={edu.boardOrUniversity || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "education",
                                    index,
                                    "boardOrUniversity",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Year of Passing
                              </label>
                              <input
                                type="number"
                                value={edu.yearOfPassing || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "education",
                                    index,
                                    "yearOfPassing",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Percentage/CGPA
                              </label>
                              <input
                                type="text"
                                value={edu.percentageOrCgpa || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "education",
                                    index,
                                    "percentageOrCgpa",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!formData.education ||
                        formData.education.length === 0) && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No education records added
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      {renderSectionHeader({
                        icon: Award,
                        title: "Certifications",
                        color: "from-amber-500 to-orange-600",
                      })}
                      <button
                        onClick={() =>
                          addArrayItem("certifications", {
                            title: "",
                            issuer: "",
                            issueDate: "",
                            expiryDate: "",
                            credentialUrl: "",
                          })
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Certification
                      </button>
                    </div>
                    <div className="space-y-4">
                      {formData.certifications?.map((cert, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-gray-600">
                              Certification #{index + 1}
                            </span>
                            <button
                              onClick={() =>
                                removeArrayItem("certifications", index)
                              }
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Title
                              </label>
                              <input
                                type="text"
                                value={cert.title || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "certifications",
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Issuer
                              </label>
                              <input
                                type="text"
                                value={cert.issuer || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "certifications",
                                    index,
                                    "issuer",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Issue Date
                              </label>
                              <input
                                type="date"
                                value={formatDate(cert.issueDate)}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "certifications",
                                    index,
                                    "issueDate",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Expiry Date
                              </label>
                              <input
                                type="date"
                                value={formatDate(cert.expiryDate)}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "certifications",
                                    index,
                                    "expiryDate",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!formData.certifications ||
                        formData.certifications.length === 0) && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No certifications added
                          </p>
                        )}
                    </div>
                  </div>
                </>
              )}

              {/* Finance Tab */}
              {activeTab === "finance" && (
                <>
                  {/* Salary Information */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    {renderSectionHeader({
                      icon: Wallet,
                      title: "Salary Information",
                    })}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderInputField({
                        label: "Monthly Salary (₹)",
                        field: "salary",
                        type: "number",
                        icon: Wallet,
                      })}
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    {renderSectionHeader({
                      icon: Landmark,
                      title: "Bank Account Details",
                      color: "from-green-500 to-emerald-600",
                    })}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderInputField({
                        label: "Account Holder Name",
                        field: "account_holder",
                        nestedPath: "bank_details.account_holder",
                        icon: User,
                      })}
                      {renderInputField({
                        label: "Account Number",
                        field: "account_number",
                        nestedPath: "bank_details.account_number",
                        icon: CreditCard,
                      })}
                      {renderInputField({
                        label: "Bank Name",
                        field: "bank_name",
                        nestedPath: "bank_details.bank_name",
                        icon: Landmark,
                      })}
                      {renderInputField({
                        label: "Branch Name",
                        field: "branch_name",
                        nestedPath: "bank_details.branch_name",
                        icon: MapPin,
                      })}
                      {renderInputField({
                        label: "IFSC Code",
                        field: "ifsc_code",
                        nestedPath: "bank_details.ifsc_code",
                        icon: Hash,
                      })}
                      {renderInputField({
                        label: "UPI ID",
                        field: "upi_id",
                        nestedPath: "bank_details.upi_id",
                        icon: CreditCard,
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Additional Tab */}
              {activeTab === "additional" && (
                <>
                  {/* Emergency Contacts */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      {renderSectionHeader({
                        icon: PhoneCall,
                        title: "Emergency Contacts",
                        color: "from-red-500 to-rose-600",
                      })}
                      <button
                        onClick={() =>
                          addArrayItem("emergency_contacts", {
                            name: "",
                            relationship: "",
                            phone: "",
                            alternatePhone: "",
                            address: "",
                          })
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Contact
                      </button>
                    </div>
                    <div className="space-y-4">
                      {formData.emergency_contacts?.map((contact, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-gray-600">
                              Contact #{index + 1}
                            </span>
                            <button
                              onClick={() =>
                                removeArrayItem("emergency_contacts", index)
                              }
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Name
                              </label>
                              <input
                                type="text"
                                value={contact.name || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "emergency_contacts",
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Relationship
                              </label>
                              <select
                                value={contact.relationship || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "emergency_contacts",
                                    index,
                                    "relationship",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              >
                                <option value="">Select</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Parent">Parent</option>
                                <option value="Sibling">Sibling</option>
                                <option value="Child">Child</option>
                                <option value="Friend">Friend</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Phone
                              </label>
                              <input
                                type="tel"
                                value={contact.phone || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "emergency_contacts",
                                    index,
                                    "phone",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Alternate Phone
                              </label>
                              <input
                                type="tel"
                                value={contact.alternatePhone || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "emergency_contacts",
                                    index,
                                    "alternatePhone",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="md:col-span-2 space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Address
                              </label>
                              <textarea
                                value={contact.address || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "emergency_contacts",
                                    index,
                                    "address",
                                    e.target.value
                                  )
                                }
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 resize-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!formData.emergency_contacts ||
                        formData.emergency_contacts.length === 0) && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No emergency contacts added
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Medical & HR Information */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    {renderSectionHeader({
                      icon: Activity,
                      title: "Medical & HR Information",
                      color: "from-pink-500 to-rose-600",
                    })}
                    <div className="space-y-4">
                      {renderInputField({
                        label: "Medical Conditions",
                        field: "medical_conditions",
                        type: "textarea",
                        icon: Activity,
                        placeholder:
                          "List any medical conditions or allergies...",
                      })}
                      {renderInputField({
                        label: "Background Check Status",
                        field: "background_check_status",
                        options: ["Pending", "In Progress", "Passed", "Failed"],
                        icon: ShieldCheck,
                      })}
                      {renderInputField({
                        label: "HR Notes",
                        field: "hr_notes",
                        type: "textarea",
                        icon: FileText,
                        placeholder: "Internal HR notes...",
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 px-5 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {isDirty && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-xs font-medium text-amber-800">
                      {changedFields.size} unsaved change
                      {changedFields.size !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                <button
                  onClick={resetChanges}
                  disabled={!isDirty}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${isDirty
                      ? "text-gray-600 hover:bg-gray-100"
                      : "text-gray-400 cursor-not-allowed"
                    }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Changes
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDiscard}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={
                    !isDirty || Object.keys(errors).length > 0 || saving
                  }
                  className={`group px-5 py-2 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-sm flex items-center gap-2 ${!isDirty || Object.keys(errors).length > 0 || saving
                      ? "opacity-50 cursor-not-allowed"
                      : "transform hover:scale-105"
                    }`}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                      {isDirty && (
                        <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                          {changedFields.size}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog />
    </>
  );
};

export default SupervisorEditModal;