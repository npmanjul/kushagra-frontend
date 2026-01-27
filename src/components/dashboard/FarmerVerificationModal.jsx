import React, { useState, useRef, useEffect } from "react";
import {
  X,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  AlertTriangle,
  User,
  MapPin,
  Landmark,
  Wallet,
  Users,
  ChevronDown,
  Eye,
  RefreshCw,
  FileText,
  Camera,
  Loader2,
  AlertCircle,
  Sparkles,
  Shield,
  Edit3,
  Check,
  Zap,
  ArrowRight,
  ExternalLink,
  LogOut,
} from "lucide-react";
import API_BASE_URL from "@/utils/constants";

const fieldConfig = {
  aadhaar_image: {
    label: "Aadhaar Image",
    type: "file",
    group: "personal",
    icon: FileText,
  },
  aadhaar_number: {
    label: "Aadhaar Number",
    type: "text",
    group: "personal",
    icon: FileText,
  },
  pan_image: {
    label: "PAN Image",
    type: "file",
    group: "personal",
    icon: FileText,
  },
  pan_number: {
    label: "PAN Number",
    type: "text",
    group: "personal",
    icon: FileText,
  },
  khatauni_images: {
    label: "Khatauni Images",
    type: "file",
    group: "personal",
    icon: FileText,
    multiple: true, // Add this for multiple file support
  },
  address: { label: "Address", type: "text", group: "address", icon: MapPin },
  tehsil: { label: "Tehsil", type: "text", group: "address", icon: MapPin },
  district: { label: "District", type: "text", group: "address", icon: MapPin },
  state: { label: "State", type: "text", group: "address", icon: MapPin },
  landmark: { label: "Landmark", type: "text", group: "address", icon: MapPin },
  pin_code: { label: "PIN Code", type: "text", group: "address", icon: MapPin },
  land_size: {
    label: "Land Size (Acres)",
    type: "text",
    group: "land",
    icon: Landmark,
  },
  bank_passbook_img: {
    label: "Bank Passbook Image",
    type: "file",
    group: "bank",
    icon: Wallet,
  },
  account_number: {
    label: "Account Number",
    type: "text",
    group: "bank",
    icon: Wallet,
  },
  ifsc_code: { label: "IFSC Code", type: "text", group: "bank", icon: Wallet },
  account_holder: {
    label: "Account Holder",
    type: "text",
    group: "bank",
    icon: Wallet,
  },
  bank_name: { label: "Bank Name", type: "text", group: "bank", icon: Wallet },
  branch_name: {
    label: "Branch Name",
    type: "text",
    group: "bank",
    icon: Wallet,
  },
  nominee_image: {
    label: "Nominee Photo",
    type: "file",
    group: "nominee",
    icon: Camera,
  },
  nominee_aadhaar_image: {
    label: "Nominee Aadhaar Image",
    type: "file",
    group: "nominee",
    icon: FileText,
  },
  nominee_pan_image: {
    label: "Nominee PAN Image",
    type: "file",
    group: "nominee",
    icon: FileText,
  },
  nominee_name: {
    label: "Nominee Name",
    type: "text",
    group: "nominee",
    icon: User,
  },
  nominee_dob: {
    label: "Nominee DOB",
    type: "date",
    group: "nominee",
    icon: User,
  },
  nominee_phone: {
    label: "Nominee Phone",
    type: "text",
    group: "nominee",
    icon: User,
  },
  nominee_email: {
    label: "Nominee Email",
    type: "email",
    group: "nominee",
    icon: User,
  },
  nominee_aadhaar: {
    label: "Nominee Aadhaar",
    type: "text",
    group: "nominee",
    icon: FileText,
  },
  nominee_pan: {
    label: "Nominee PAN",
    type: "text",
    group: "nominee",
    icon: FileText,
  },
  nominee_relation: {
    label: "Relation",
    type: "select",
    group: "nominee",
    icon: Users,
  },
  nominee_gender: {
    label: "Gender",
    type: "select",
    group: "nominee",
    icon: User,
  },
  nominee_address: {
    label: "Nominee Address",
    type: "text",
    group: "nominee",
    icon: MapPin,
  },
};

const groupConfig = {
  personal: {
    label: "Personal Documents",
    icon: User,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  address: {
    label: "Address Details",
    icon: MapPin,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  land: {
    label: "Land Information",
    icon: Landmark,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  bank: {
    label: "Bank Details",
    icon: Wallet,
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  nominee: {
    label: "Nominee Details",
    icon: Users,
    gradient: "from-pink-500 via-rose-500 to-red-500",
    bg: "bg-pink-50",
    border: "border-pink-200",
  },
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    approved: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      icon: CheckCircle,
      dot: "bg-emerald-500",
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: XCircle,
      dot: "bg-red-500",
    },
    pending: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: Clock,
      dot: "bg-amber-500",
    },
  };
  const style = styles[status] || styles.pending;
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${style.bg} ${style.text} shadow-sm`}
    >
      <span
        className={`w-2 h-2 rounded-full ${style.dot} ${status === "rejected" ? "animate-pulse" : ""
          }`}
      />
      <Icon className="w-3.5 h-3.5" />
      <span className="capitalize">{status}</span>
    </span>
  );
};

// Image Preview Component
const ImagePreview = ({ url, label }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!url || imageError)
    return (
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300 transition-all hover:border-gray-400">
        <Camera className="w-6 h-6 text-gray-400" />
      </div>
    );

  return (
    <>
      <div
        className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
        onClick={() => setShowPreview(true)}
      >
        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-lg ring-2 ring-gray-100 group-hover:ring-blue-300 transition-all duration-300">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            </div>
          )}
          <img
            src={url}
            alt={label}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${isLoading ? "opacity-0" : "opacity-100"
              }`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setImageError(true);
              setIsLoading(false);
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl flex items-end justify-center pb-2">
          <Eye className="w-4 h-4 text-white" />
        </div>
      </div>

      {showPreview && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-w-6xl max-h-[90vh] animate-zoomIn">
            <img
              src={url}
              alt={label}
              className="max-w-full max-h-[85vh] object-contain rounded-3xl shadow-2xl"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPreview(false);
              }}
              className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-xl hover:bg-gray-100 transition-all hover:scale-110"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// File Upload Field Component - FIXED
const FileUploadField = ({
  field,
  value,
  onChange,
  disabled,
  multiple = false,
}) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [previews, setPreviews] = useState([]); // For multiple files
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]); // For multiple files

  // Inside FileUploadField
  const handleFile = (file) => {
    if (file) {
      // ... validation logic ...
      setSelectedFile(file);
      onChange(field, file); // This sends the raw File object to formData state

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(
      (f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024
    );

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      onChange(field, validFiles); // This sends an Array of Files to formData state

      const newPreviews = [];
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          if (newPreviews.length === validFiles.length)
            setPreviews(newPreviews);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    setPreviews([]);
    setSelectedFile(null);
    setSelectedFiles([]);

    // Pass null so handleChange updates state to null (signaling deletion/reset)
    onChange(field, null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (multiple) {
        handleMultipleFiles(e.dataTransfer.files);
      } else {
        handleFile(e.dataTransfer.files[0]);
      }
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (multiple) {
        handleMultipleFiles(e.target.files);
      } else {
        handleFile(e.target.files[0]);
      }
    }
  };

  return (
    <div className="space-y-4">
      {typeof value === "string" && value.startsWith("http") && !preview && (
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-200">
          <ImagePreview url={value} label={fieldConfig[field]?.label} />
          <div>
            <span className="text-sm font-semibold text-gray-700">
              Current Image
            </span>
            <p className="text-xs text-gray-500 mt-0.5">
              Upload a new one to replace
            </p>
          </div>
        </div>
      )}

      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${dragActive
          ? "border-blue-500 bg-blue-50 scale-[1.02] shadow-lg shadow-blue-100"
          : disabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50"
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={disabled ? undefined : handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />

        {preview || previews.length > 0 ? (
          <div className="flex flex-col items-center gap-4">
            {multiple && previews.length > 0 ? (
              <div className="flex flex-wrap gap-2 justify-center">
                {previews.map((p, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={p}
                      alt={`Preview ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded-xl shadow-lg ring-2 ring-green-100"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-2xl shadow-xl ring-4 ring-green-100"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounceIn">
                  <Check className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
            <div className="text-center">
              <span className="text-sm font-bold text-green-600">
                {multiple && selectedFiles.length > 0
                  ? `${selectedFiles.length} file(s) ready to upload`
                  : "File ready to upload"}
              </span>
              {selectedFile && !multiple && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)}{" "}
                  KB)
                </p>
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="block mx-auto mt-2 text-xs text-red-500 hover:text-red-700 font-semibold hover:underline transition-colors"
              >
                Remove file{multiple && selectedFiles.length > 1 ? "s" : ""}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div
              className={`p-4 rounded-2xl ${disabled
                ? "bg-gray-100"
                : "bg-gradient-to-br from-blue-100 to-indigo-100"
                } transition-all`}
            >
              <Upload
                className={`w-8 h-8 ${disabled ? "text-gray-400" : "text-blue-600"
                  }`}
              />
            </div>
            <div>
              <p
                className={`text-base font-semibold ${disabled ? "text-gray-400" : "text-gray-700"
                  }`}
              >
                {disabled
                  ? "Upload disabled"
                  : `Drop your file${multiple ? "s" : ""
                  } here or click to browse`}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports: PNG, JPG, JPEG (max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Text Field Component
const TextField = ({ field, value, onChange, disabled, type = "text" }) => {
  const config = fieldConfig[field];
  const baseClass = `w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 outline-none text-sm font-medium ${disabled
    ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
    : "bg-white border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 hover:border-gray-300 hover:shadow-sm"
    }`;

  if (config?.type === "select" && field === "nominee_relation") {
    return (
      <select
        value={value || ""}
        onChange={(e) => onChange(field, e.target.value)}
        disabled={disabled}
        className={baseClass}
      >
        <option value="">Select Relation</option>
        {[
          "father",
          "mother",
          "spouse",
          "son",
          "daughter",
          "brother",
          "sister",
          "other",
        ].map((r) => (
          <option key={r} value={r} className="capitalize">
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </option>
        ))}
      </select>
    );
  }

  if (config?.type === "select" && field === "nominee_gender") {
    return (
      <select
        value={value || ""}
        onChange={(e) => onChange(field, e.target.value)}
        disabled={disabled}
        className={baseClass}
      >
        <option value="">Select Gender</option>
        {["male", "female", "other"].map((g) => (
          <option key={g} value={g}>
            {g.charAt(0).toUpperCase() + g.slice(1)}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(field, e.target.value)}
      disabled={disabled}
      className={baseClass}
      placeholder={disabled ? "" : `Enter ${config?.label || field}`}
    />
  );
};

// Field Card Component
const FieldCard = ({ fieldData, formData, onChange }) => {
  const { field, status, reason, data } = fieldData;
  const config = fieldConfig[field];
  const isEditable = status === "rejected";
  const isFileField = config?.type === "file";

  const getDisplayValue = () => {
    if (typeof data === "object" && data !== null) {
      if (data.$numberDecimal) return data.$numberDecimal;
      if (Array.isArray(data))
        return data.map((item) => item.image_url || item).join(", ");
      return JSON.stringify(data);
    }
    return data;
  };

  const displayValue = getDisplayValue();
  const currentValue =
    formData[field] !== undefined ? formData[field] : displayValue;
  const Icon = config?.icon || FileText;

  const cardStyles = {
    rejected:
      "border-red-200 bg-gradient-to-br from-red-50 via-white to-rose-50 shadow-lg shadow-red-100/50 ring-1 ring-red-100",
    approved:
      "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50 ring-1 ring-emerald-100",
    pending: "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md",
  };

  return (
    <div
      className={`group relative p-6 rounded-3xl border-2 transition-all duration-500 ${cardStyles[status] || cardStyles.pending
        }`}
    >
      {/* Glow effect for rejected */}
      {status === "rejected" && (
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-400/20 to-rose-400/20 blur-xl -z-10 animate-pulse" />
      )}

      {/* Status Line */}
      <div
        className={`absolute top-0 left-6 right-6 h-1 rounded-full ${status === "rejected"
          ? "bg-gradient-to-r from-red-400 via-rose-400 to-pink-400"
          : status === "approved"
            ? "bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400"
            : "bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400"
          }`}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-5 pt-2">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-2xl transition-all duration-300 ${status === "rejected"
              ? "bg-red-100 text-red-600 shadow-lg shadow-red-100"
              : status === "approved"
                ? "bg-emerald-100 text-emerald-600"
                : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
              }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              {config?.label || field}
            </h4>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">
              {field.replace(/_/g, " ")}
            </p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Rejection Reason */}
      {status === "rejected" && reason && (
        <div className="mb-5 p-4 bg-gradient-to-r from-red-100/80 to-rose-100/80 rounded-2xl flex items-start gap-3 border border-red-200/50 backdrop-blur-sm">
          <div className="p-2 bg-red-200 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-red-800 mb-0.5">
              Rejection Reason
            </p>
            <p className="text-sm text-red-700">{reason}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {!isFileField && !isEditable && (
          <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-100">
            <p className="text-gray-700 font-medium">{displayValue || "—"}</p>
          </div>
        )}

        {isFileField && !isEditable && (
          <div className="space-y-3">
            {typeof data === "string" && data.startsWith("http") && (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-100">
                <ImagePreview url={data} label={config?.label} />
                <span className="text-sm text-gray-600 font-medium">
                  Document uploaded
                </span>
              </div>
            )}
            {Array.isArray(data) && data.length > 0 && (
              <div className="flex flex-wrap gap-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-100">
                {data.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <ImagePreview
                      url={item.image_url || item}
                      label={`${config?.label} ${idx + 1}`}
                    />
                    {item.khatauni_id && (
                      <span className="text-xs text-gray-500 font-medium">
                        ID: {item.khatauni_id}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isEditable && (
          <div className="pt-4 border-t-2 border-red-200/50">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-red-100 rounded-lg">
                <Edit3 className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-sm font-bold text-red-600">
                Update Required
              </span>
            </div>
            {isFileField ? (
              <FileUploadField
                field={field}
                value={currentValue}
                onChange={onChange}
                disabled={false}
                multiple={config?.multiple || false}
              />
            ) : (
              <TextField
                field={field}
                value={
                  formData[field] !== undefined ? formData[field] : displayValue
                }
                onChange={onChange}
                disabled={false}
                type={
                  config?.type === "date"
                    ? "date"
                    : config?.type === "email"
                      ? "email"
                      : "text"
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Group Section Component
const GroupSection = ({
  group,
  fields,
  formData,
  onChange,
  expandedGroups,
  toggleGroup,
}) => {
  const config = groupConfig[group];
  const Icon = config?.icon || FileText;
  const isExpanded = expandedGroups[group];

  const counts = {
    rejected: fields.filter((f) => f.status === "rejected").length,
    pending: fields.filter((f) => f.status === "pending").length,
    approved: fields.filter((f) => f.status === "approved").length,
  };

  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border ${config?.border || "border-gray-200"
        } overflow-hidden hover:shadow-lg transition-all duration-500`}
    >
      {/* Group Header */}
      <button
        onClick={() => toggleGroup(group)}
        className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50/50 transition-all duration-300"
      >
        <div className="flex items-center gap-5">
          <div
            className={`p-4 rounded-2xl bg-gradient-to-br ${config?.gradient || "from-gray-500 to-gray-600"
              } shadow-xl`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-800 text-lg">
              {config?.label || group}
            </h3>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {counts.rejected > 0 && (
                <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  {counts.rejected} rejected
                </span>
              )}
              {counts.pending > 0 && (
                <span className="text-xs font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                  {counts.pending} pending
                </span>
              )}
              {counts.approved > 0 && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                  {counts.approved} approved
                </span>
              )}
            </div>
          </div>
        </div>
        <div
          className={`p-3 rounded-2xl transition-all duration-500 ${isExpanded ? "bg-blue-100 rotate-180" : "bg-gray-100"
            }`}
        >
          <ChevronDown
            className={`w-5 h-5 transition-colors ${isExpanded ? "text-blue-600" : "text-gray-500"
              }`}
          />
        </div>
      </button>

      {/* Group Content */}
      <div
        className={`transition-all duration-700 ease-in-out ${isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
      >
        <div className={`p-8 pt-4 ${config?.bg || "bg-gray-50"}/30`}>
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {fields.map((fieldData) => (
              <FieldCard
                key={fieldData.field}
                fieldData={fieldData}
                formData={formData}
                onChange={onChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Modal Component
const FarmerVerificationModal = ({ isOpen, onClose }) => {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({
    personal: true,
    address: true,
    land: true,
    bank: true,
    nominee: true,
  });

  useEffect(() => {
    if (isOpen) {
      fetchData();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/getfarmerunverifiedfields`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch verification data");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // REPLACE YOUR EXISTING handleChange WITH THIS
  const handleChange = (field, value) => {
    setFormData((prev) => {
      // We strictly define what we want to keep.
      // We keep the field even if it is null or empty string "" 
      // so that the backend knows we are changing/clearing it.
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // S3 Upload Helper Functions
  const getPresignedUrls = async (files, folder) => {
    const filesData = files.map((file, index) => {
      const fileExtension = file.name.split('.').pop();
      const fileName = `farmer_${folder}_${Date.now()}_${index}.${fileExtension}`;
      return {
        fileName,
        fileType: file.type,
        folder: folder
      };
    });

    const response = await fetch(`${API_BASE_URL}/aws/getpresigneduploadurls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ files: filesData }),
    });

    if (!response.ok) {
      throw new Error("Failed to get presigned URLs");
    }

    const result = await response.json();
    // The backend response structure is { success: true, message: "...", data: [...] }
    if (!result.success || !result.data || result.data.length === 0) {
      throw new Error("Failed to get presigned URLs");
    }

    return result.data; // Return the array of objects { uploadUrl, publicUrl, key }
  };

  const uploadToS3 = async (file, urlData) => {
    // urlData contains { uploadUrl, publicUrl, key }
    const response = await fetch(urlData.uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type, // This must match exactly what was signed
      },
      body: file,
    });

    if (!response.ok) {
      console.error("S3 Upload Failed:", response.statusText);
      throw new Error(`Failed to upload file to S3: ${response.statusText}`);
    }

    // Return the public URL provided by the backend
    return urlData.publicUrl;
  };

  // Upload a single file to S3
  const uploadSingleFileToS3 = async (file, fieldName) => {
    // getPresignedUrls returns array of objects
    const urls = await getPresignedUrls([file], fieldName);
    // urls[0] is the object for the first file
    const publicUrl = await uploadToS3(file, urls[0]);
    return publicUrl;
  };

  // Upload multiple files to S3
  const uploadMultipleFilesToS3 = async (files, fieldName) => {
    const urls = await getPresignedUrls(files, fieldName);
    const publicUrls = await Promise.all(
      files.map((file, index) => uploadToS3(file, urls[index]))
    );
    return publicUrls;
  };

  // UPDATED handleSubmit WITH S3 PRESIGNED URL UPLOADS
  const handleSubmit = async () => {
    setError(null);

    // 1. Get all keys that have actually been touched
    const entries = Object.entries(formData);

    // 2. Validation: Ensure there is data to send
    if (entries.length === 0) {
      setError("No changes detected. Please update a field.");
      return;
    }

    setSubmitting(true);

    try {
      // Create a new object to hold the processed data (with S3 URLs instead of files)
      const processedData = {};

      // Process each field
      for (const [key, value] of entries) {
        // Skip undefined
        if (value === undefined) continue;

        // CASE 1: Handle Multiple Files (Array of Files)
        if (Array.isArray(value)) {
          const fileItems = value.filter((item) => item instanceof File);
          if (fileItems.length > 0) {
            // Upload all files to S3 and get public URLs
            console.log(`Uploading ${fileItems.length} files for ${key} to S3...`);
            const publicUrls = await uploadMultipleFilesToS3(fileItems, key);
            // For khatauni_images, send as array of URLs
            processedData[key] = publicUrls;
            console.log(`Uploaded ${key}:`, publicUrls);
          }
        }
        // CASE 2: Handle Single File
        else if (value instanceof File) {
          // Upload file to S3 and get public URL
          console.log(`Uploading file for ${key} to S3...`);
          const publicUrl = await uploadSingleFileToS3(value, key);
          processedData[key] = publicUrl;
          console.log(`Uploaded ${key}:`, publicUrl);
        }
        // CASE 3: Handle Dates (Convert to ISO string if it's a Date object)
        else if (value instanceof Date) {
          processedData[key] = value.toISOString();
        }
        // CASE 4: Handle Text/Numbers/Null
        else {
          // Convert null to empty string or keep as is
          const stringValue = value === null ? "" : String(value);
          processedData[key] = stringValue;
        }
      }

      // --- DEBUGGING: Check Console to see exactly what is being sent ---
      console.log("Submitting processed data:", processedData);

      // Send JSON data (with S3 URLs) to backend
      const response = await fetch(
        `${API_BASE_URL}/user/updateprofileverification`,
        {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(processedData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update fields");
      }

      setSuccess(true);
      setFormData({}); // Clear dirty state
    } catch (err) {
      console.error("Submission Error:", err);
      setError(err.message || "Failed to submit updates");
    } finally {
      setSubmitting(false);
    }
  };

  const groupedFields =
    data?.fields?.reduce((acc, field) => {
      const group = fieldConfig[field.field]?.group || "other";
      if (!acc[group]) acc[group] = [];
      acc[group].push(field);
      return acc;
    }, {}) || {};

  const rejectedCount =
    data?.fields?.filter((f) => f.status === "rejected").length || 0;
  const pendingCount =
    data?.fields?.filter((f) => f.status === "pending").length || 0;
  const approvedCount =
    data?.fields?.filter((f) => f.status === "approved").length || 0;

  // Count how many files are in formData
  const getFormDataSummary = () => {
    let fileCount = 0;
    let textCount = 0;

    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        fileCount++;
      } else if (Array.isArray(value)) {
        fileCount += value.filter((v) => v instanceof File).length;
      } else {
        textCount++;
      }
    });

    return { fileCount, textCount, total: fileCount + textCount };
  };

  if (!isOpen) return null;

  const summary = getFormDataSummary();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal */}
      <div className="relative w-full max-w-7xl h-[92vh] mx-4 flex flex-col bg-gradient-to-br from-slate-50 via-white to-gray-50 rounded-[2rem] shadow-2xl overflow-hidden animate-modalSlideUp">
        {/* Header */}
        <div className="relative z-10 px-8 py-7 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  Verification Center
                </h2>
                <p className="text-white/70 text-sm font-medium mt-1">
                  Review and update your verification documents
                </p>
              </div>
            </div>

            {/* Stats */}
            {!loading && data && !success && (
              <div className="hidden md:flex items-center gap-3">
                {rejectedCount > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-400/30 rounded-full backdrop-blur-sm">
                    <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-white">
                      {rejectedCount} Action Needed
                    </span>
                  </div>
                )}
                {pendingCount > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-400/30 rounded-full backdrop-blur-sm">
                    <span className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
                    <span className="text-sm font-bold text-white">
                      {pendingCount} Pending
                    </span>
                  </div>
                )}
                {approvedCount > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full backdrop-blur-sm">
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                    <span className="text-sm font-bold text-white">
                      {approvedCount} Approved
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Close Button */}
            {!success && (
              <button
                onClick={onClose}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-200" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
                </div>
              </div>
              <p className="text-gray-600 mt-6 font-semibold text-lg">
                Loading your data...
              </p>
              <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
            </div>
          )}

          {error && !loading && !success && (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-bounceIn">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Oops! Something went wrong
              </h3>
              <p className="text-gray-500 text-center max-w-md mb-6">{error}</p>
              <button
                onClick={fetchData}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-indigo-200 transition-all flex items-center gap-2 hover:scale-105"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
            </div>
          )}

          {success && (
            <div className="flex flex-col items-center justify-center h-full py-20">
              {/* Success Animation */}
              <div className="relative mb-4">
                <div className="w-22 h-22 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center animate-bounceIn">
                  <CheckCircle className="w-12 h-12 text-emerald-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Success Message */}
              <h3 className="text-4xl font-black text-gray-800 mb-2 text-center">
                Submitted Successfully!
              </h3>
              <p className="text-gray-500 text-lg text-center max-w-md mb-2">
                Your documents have been submitted for verification.
              </p>

              {/* Waiting for Verification Box */}
              <div className="mt-3 p-6 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-200 rounded-3xl max-w-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-amber-100 rounded-2xl">
                    <Clock className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-800 text-lg">
                      Waiting for Verification
                    </h4>
                    <p className="text-amber-600 text-sm">
                      Your documents are being reviewed
                    </p>
                  </div>
                </div>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Our team will review your updated documents and verify them
                  within 24-48 hours. You will be notified once the verification
                  is complete.
                </p>
                <div className="mt-4 flex items-center gap-2 text-amber-600">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    Verification in progress
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <div className="mt-5 flex flex-col items-center gap-4">
                <p className="text-gray-400 text-sm">
                  You can safely logout now
                </p>
                <button
                  onClick={handleLogout}
                  className="px-10 py-4 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-red-200 transition-all flex items-center gap-3 hover:scale-105 active:scale-100"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {!loading && !error && !success && data && (
            <div className="p-8 space-y-6">
              {rejectedCount > 0 && (
                <div className="p-6 bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-2 border-red-200 rounded-3xl flex items-start gap-5 shadow-lg shadow-red-100/30">
                  <div className="p-4 bg-red-100 rounded-2xl">
                    <AlertTriangle className="w-7 h-7 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-red-800 text-xl">
                      Action Required
                    </h4>
                    <p className="text-red-600 mt-1">
                      {rejectedCount} document
                      {rejectedCount > 1 ? "s need" : " needs"} to be updated.
                      Please review the rejected fields below.
                    </p>
                  </div>
                </div>
              )}

              {Object.entries(groupedFields).map(([group, fields]) => (
                <GroupSection
                  key={group}
                  group={group}
                  fields={fields}
                  formData={formData}
                  onChange={handleChange}
                  expandedGroups={expandedGroups}
                  toggleGroup={toggleGroup}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && !success && data && rejectedCount > 0 && (
          <div className="relative z-10 px-8 py-5 bg-white/80 backdrop-blur-md border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4 text-gray-600">
              <div
                className={`w-3 h-3 rounded-full ${Object.keys(formData).length > 0
                  ? "bg-indigo-500 animate-pulse"
                  : "bg-gray-300"
                  }`}
              />
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 text-lg">
                  {Object.keys(formData).length} field(s) modified
                </span>
                {summary.fileCount > 0 && (
                  <span className="text-xs text-gray-500">
                    {summary.fileCount} file(s), {summary.textCount} text
                    field(s)
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(formData).length === 0}
                className={`px-10 py-3 font-black rounded-2xl transition-all duration-300 flex items-center gap-3 ${submitting || Object.keys(formData).length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-2xl hover:shadow-purple-300 hover:scale-105 active:scale-100"
                  }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Submit Updates</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes bounceIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -30px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(30px, 10px) scale(1.05);
          }
        }
        .animate-modalSlideUp {
          animation: modalSlideUp 0.4s ease-out forwards;
        }
        .animate-zoomIn {
          animation: zoomIn 0.3s ease-out forwards;
        }
        .animate-bounceIn {
          animation: bounceIn 0.5s ease-out forwards;
        }
        .animate-blob {
          animation: blob 8s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export { FarmerVerificationModal };
