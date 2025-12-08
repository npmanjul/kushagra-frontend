import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Edit3,
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
  Upload,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  History,
  AlertTriangle,
  Info,
  Camera,
  Paperclip,
  Lock,
  Unlock,
  IndianRupee,
  Percent,
  Calculator,
  UserCheck,
  Settings,
  ChevronDown,
  PlusCircle,
  MinusCircle,
  Copy,
  ExternalLink,
} from "lucide-react";

const SupervisorEditModal = ({ isOpen, onClose, onSave, farmerData }) => {
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("personal");
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [changedFields, setChangedFields] = useState(new Set());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [editMode, setEditMode] = useState({});
  const [uploadedImages, setUploadedImages] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const [validationStatus, setValidationStatus] = useState({});
  const [editHistory, setEditHistory] = useState([]);

  // Initialize form data
  useEffect(() => {
    if (farmerData) {
      setFormData({
        // Personal Information
        name: farmerData.name || "",
        phone: farmerData.phone || "",
        email: farmerData.email || "",
        dob: farmerData.dob || "",
        gender: farmerData.gender || "Male",
        aadhaar_number: farmerData.aadhaar_number || "",
        pan_number: farmerData.pan_number || "",
        
        // Address Information
        address: farmerData.address || "",
        tehsil: farmerData.tehsil || "",
        district: farmerData.district || "",
        state: farmerData.state || "",
        pin_code: farmerData.pin_code || "",
        landmark: farmerData.landmark || "",
        
        // Land Details
        land_size: farmerData.land_size || "",
        land_type: farmerData.land_type || "Agricultural",
        crop_types: farmerData.crop_types || [],
        
        // Bank Details
        account_number: farmerData.account_number || "",
        ifsc_code: farmerData.ifsc_code || "",
        account_holder: farmerData.account_holder || "",
        bank_name: farmerData.bank_name || "",
        branch_name: farmerData.branch_name || "",
        
        // Nominee Details
        nominee_name: farmerData.nominee_name || "",
        nominee_dob: farmerData.nominee_dob || "",
        nominee_phone: farmerData.nominee_phone || "",
        nominee_email: farmerData.nominee_email || "",
        nominee_aadhaar: farmerData.nominee_aadhaar || "",
        nominee_pan: farmerData.nominee_pan || "",
        nominee_relation: farmerData.nominee_relation || "",
        nominee_gender: farmerData.nominee_gender || "Male",
        nominee_address: farmerData.nominee_address || "",
        
        // Credit & Limits
        credit_limit: farmerData.credit_limit || 0,
        interest_rate: farmerData.interest_rate || 8,
        loan_eligibility: farmerData.loan_eligibility || true,
        risk_category: farmerData.risk_category || "Low",
        
        // Documents
        aadhaar_image: farmerData.aadhaar_image || null,
        pan_image: farmerData.pan_image || null,
        bank_passbook_img: farmerData.bank_passbook_img || null,
        khatauni_images: farmerData.khatauni_images || [],
        user_image: farmerData.user_image || null,
        nominee_aadhaar_image: farmerData.nominee_aadhaar_image || null,
        nominee_pan_image: farmerData.nominee_pan_image || null,
      });
      
      // Sample edit history
      setEditHistory([
        { field: "credit_limit", oldValue: "1500000", newValue: "1800000", editedBy: "Admin", editedAt: "2024-11-15", reason: "Good payment history" },
        { field: "interest_rate", oldValue: "9", newValue: "8", editedBy: "Supervisor1", editedAt: "2024-10-20", reason: "Loyalty discount" },
      ]);
    }
  }, [farmerData]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Track changed fields
    if (farmerData && farmerData[field] !== value) {
      setChangedFields(prev => new Set(prev).add(field));
      setIsDirty(true);
    } else {
      setChangedFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(field);
        return newSet;
      });
      setIsDirty(changedFields.size > 1);
    }
    
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'email':
      case 'nominee_email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Invalid email format";
      case 'phone':
      case 'nominee_phone':
        return /^[6-9]\d{9}$/.test(value) ? null : "Invalid phone number";
      case 'aadhaar_number':
      case 'nominee_aadhaar':
        return /^\d{4}-\d{4}-\d{4}$/.test(value) ? null : "Invalid Aadhaar format (XXXX-XXXX-XXXX)";
      case 'pan_number':
      case 'nominee_pan':
        return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value) ? null : "Invalid PAN format";
      case 'ifsc_code':
        return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value) ? null : "Invalid IFSC code";
      case 'pin_code':
        return /^\d{6}$/.test(value) ? null : "PIN code must be 6 digits";
      case 'account_number':
        return value.length >= 9 && value.length <= 18 ? null : "Account number must be 9-18 digits";
      default:
        return null;
    }
  };

  const handleBlur = (field) => {
    const error = validateField(field, formData[field]);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
      setValidationStatus(prev => ({ ...prev, [field]: 'error' }));
    } else {
      setValidationStatus(prev => ({ ...prev, [field]: 'success' }));
    }
  };

  const handleImageUpload = (field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => ({ ...prev, [field]: reader.result }));
        handleInputChange(field, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Validate all required fields
    const requiredFields = ['name', 'phone', 'aadhaar_number', 'address', 'account_number'];
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      } else {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Prepare save data with metadata
    const saveData = {
      ...formData,
      modifiedFields: Array.from(changedFields),
      modifiedBy: 'supervisor_id',
      modifiedAt: new Date().toISOString(),
      modificationReason: document.getElementById('modification-reason')?.value || '',
    };
    
    onSave(saveData);
    onClose();
  };

  const handleDiscard = () => {
    if (isDirty) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User, color: "from-blue-500 to-indigo-600" },
    { id: "address", label: "Address & Land", icon: MapPin, color: "from-green-500 to-emerald-600" },
    { id: "bank", label: "Bank Details", icon: Building2, color: "from-purple-500 to-pink-600" },
    { id: "nominee", label: "Nominee", icon: Users, color: "from-amber-500 to-orange-600" },
    { id: "credit", label: "Credit Settings", icon: Calculator, color: "from-red-500 to-rose-600" },
    { id: "documents", label: "Documents", icon: FileText, color: "from-indigo-500 to-blue-600" },
  ];

  // Confirmation Dialog
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
                <h3 className="text-lg font-semibold text-gray-900">Unsaved Changes</h3>
                <p className="text-sm text-gray-600">You have unsaved changes. Are you sure you want to discard them?</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-2">Modified fields:</p>
              <div className="flex flex-wrap gap-1">
                {Array.from(changedFields).map(field => (
                  <span key={field} className="px-2 py-1 bg-white text-xs rounded border border-gray-200">
                    {field.replace(/_/g, ' ')}
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

  // Input Field Component
  const InputField = ({ label, field, type = "text", required = false, icon: Icon, editable = true, options = null }) => {
    const isEditing = editMode[field];
    const hasError = errors[field];
    const isValid = validationStatus[field] === 'success';
    
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-700 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
            {label}
            {required && <span className="text-red-500">*</span>}
          </span>
          {editable && !isEditing && (
            <button
              onClick={() => setEditMode(prev => ({ ...prev, [field]: true }))}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Edit3 className="w-3 h-3 text-gray-400" />
            </button>
          )}
        </label>
        
        <div className="relative">
          {options ? (
            <select
              value={formData[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
              disabled={!isEditing && editable}
              className={`w-full px-3 py-2 border rounded-lg text-sm transition-all ${
                hasError ? 'border-red-300 bg-red-50' : 
                isValid ? 'border-green-300 bg-green-50' : 
                'border-gray-300'
              } ${(!isEditing && editable) ? 'bg-gray-50 cursor-not-allowed' : ''} 
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
            >
              <option value="">Select {label}</option>
              {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={formData[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
              disabled={!isEditing && editable}
              className={`w-full px-3 py-2 border rounded-lg text-sm transition-all ${
                hasError ? 'border-red-300 bg-red-50' : 
                isValid ? 'border-green-300 bg-green-50' : 
                'border-gray-300'
              } ${(!isEditing && editable) ? 'bg-gray-50 cursor-not-allowed' : ''} 
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
            />
          )}
          
          {/* Status Icons */}
          {hasError && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
          )}
          {isValid && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </div>
          )}
          
          {/* Copy button for certain fields */}
          {['aadhaar_number', 'pan_number', 'account_number', 'ifsc_code'].includes(field) && formData[field] && (
            <button
              onClick={() => copyToClipboard(formData[field])}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
              title="Copy"
            >
              <Copy className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>
        
        {hasError && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {hasError}
          </p>
        )}
        
        {changedFields.has(field) && (
          <p className="text-xs text-amber-600 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Modified from: {farmerData[field]}
          </p>
        )}
      </div>
    );
  };

  // Document Upload Component
  const DocumentUpload = ({ label, field, currentImage }) => {
    const [preview, setPreview] = useState(currentImage);
    
    return (
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
          <Paperclip className="w-3.5 h-3.5 text-gray-400" />
          {label}
        </label>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors">
          {preview ? (
            <div className="relative group">
              <img src={preview} alt={label} className="w-full h-32 object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <button
                  onClick={() => window.open(preview, '_blank')}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Eye className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => {
                    setPreview(null);
                    handleInputChange(field, null);
                  }}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleImageUpload(field, file);
                    const reader = new FileReader();
                    reader.onloadend = () => setPreview(reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <div className="flex flex-col items-center py-4 text-gray-400 hover:text-indigo-500 transition-colors">
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-xs">Click to upload {label}</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
              </div>
            </label>
          )}
        </div>
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
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIvMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
            </div>
            
            <div className="relative px-5 py-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-white/20 rounded-lg blur animate-pulse"></div>
                    <div className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      Edit Farmer Profile
                      <UserCheck className="w-4 h-4 text-yellow-300" />
                    </h2>
                    <div className="flex items-center gap-3 text-white/70 text-xs">
                      <span>Farmer: {formData.name}</span>
                      <span>•</span>
                      <span>ID: {farmerData?.id}</span>
                      {isDirty && (
                        <>
                          <span>•</span>
                          <span className="text-yellow-300 font-medium">
                            {changedFields.size} field(s) modified
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.open(`/farmer/${farmerData?.id}/history`, '_blank')}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 group"
                    title="View Edit History"
                  >
                    <History className="w-4 h-4 text-white group-hover:rotate-[-360deg] transition-transform duration-700" />
                  </button>
                  
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

          {/* Tabs */}
          <div className="flex bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 gap-2 flex-shrink-0 border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-3 py-1.5 flex items-center gap-2 font-medium rounded-lg transition-all duration-300 text-sm ${
                    activeTab === tab.id
                      ? `bg-white text-gray-800 shadow-md scale-[1.02] border border-gray-200`
                      : "text-gray-500 hover:bg-white/50 hover:text-gray-700"
                  }`}
                >
                  <div
                    className={`p-1 rounded-md bg-gradient-to-br ${
                      activeTab === tab.id ? tab.color : "from-gray-300 to-gray-400"
                    } shadow-sm`}
                  >
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="max-w-4xl mx-auto">
              {/* Personal Information Tab */}
              {activeTab === "personal" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-600" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="Full Name" field="name" required icon={User} />
                      <InputField label="Phone Number" field="phone" type="tel" required icon={Phone} />
                      <InputField label="Email Address" field="email" type="email" icon={Mail} />
                      <InputField label="Date of Birth" field="dob" type="date" icon={Calendar} />
                      <InputField 
                        label="Gender" 
                        field="gender" 
                        options={["Male", "Female", "Other"]}
                        icon={User}
                      />
                      <InputField label="Aadhaar Number" field="aadhaar_number" required icon={Hash} />
                      <InputField label="PAN Number" field="pan_number" icon={CreditCard} />
                    </div>
                  </div>
                </div>
              )}

              {/* Address & Land Tab */}
              {activeTab === "address" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-600" />
                      Address Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <InputField label="Complete Address" field="address" required icon={MapPin} />
                      </div>
                      <InputField label="Landmark" field="landmark" icon={MapPin} />
                      <InputField label="Tehsil" field="tehsil" icon={MapPin} />
                      <InputField label="District" field="district" icon={MapPin} />
                      <InputField label="State" field="state" icon={MapPin} />
                      <InputField label="PIN Code" field="pin_code" icon={Hash} />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-600" />
                      Land Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="Land Size (Acres)" field="land_size" type="number" icon={MapPin} />
                      <InputField 
                        label="Land Type" 
                        field="land_type" 
                        options={["Agricultural", "Non-Agricultural", "Mixed"]}
                        icon={MapPin}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Details Tab */}
              {activeTab === "bank" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      Bank Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="Account Number" field="account_number" required icon={CreditCard} />
                      <InputField label="IFSC Code" field="ifsc_code" required icon={Hash} />
                      <InputField label="Account Holder Name" field="account_holder" icon={User} />
                      <InputField label="Bank Name" field="bank_name" icon={Building2} />
                      <InputField label="Branch Name" field="branch_name" icon={Landmark} />
                    </div>
                  </div>
                </div>
              )}

              {/* Nominee Tab */}
              {activeTab === "nominee" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-600" />
                      Nominee Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="Nominee Name" field="nominee_name" icon={User} />
                      <InputField 
                        label="Relationship" 
                        field="nominee_relation" 
                        options={["Spouse", "Son", "Daughter", "Father", "Mother", "Brother", "Sister", "Other"]}
                        icon={Users}
                      />
                      <InputField label="Date of Birth" field="nominee_dob" type="date" icon={Calendar} />
                      <InputField 
                        label="Gender" 
                        field="nominee_gender" 
                        options={["Male", "Female", "Other"]}
                        icon={User}
                      />
                      <InputField label="Phone Number" field="nominee_phone" type="tel" icon={Phone} />
                      <InputField label="Email Address" field="nominee_email" type="email" icon={Mail} />
                      <InputField label="Aadhaar Number" field="nominee_aadhaar" icon={Hash} />
                      <InputField label="PAN Number" field="nominee_pan" icon={CreditCard} />
                      <div className="md:col-span-2">
                        <InputField label="Address" field="nominee_address" icon={MapPin} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Credit Settings Tab - Supervisor Special */}
              {activeTab === "credit" && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                    <div className="flex items-center gap-2 text-amber-800">
                      <AlertTriangle className="w-4 h-4" />
                      <p className="text-sm font-medium">
                        Supervisor Access: Changes to credit settings require additional approval
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-indigo-600" />
                      Credit & Loan Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
                          <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
                          Credit Limit
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={formData.credit_limit || 0}
                            onChange={(e) => handleInputChange('credit_limit', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <button className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors">
                            <Calculator className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
                          <Percent className="w-3.5 h-3.5 text-gray-400" />
                          Interest Rate (% p.a.)
                        </label>
                        <input
                          type="number"
                          value={formData.interest_rate || 8}
                          onChange={(e) => handleInputChange('interest_rate', e.target.value)}
                          step="0.1"
                          min="0"
                          max="20"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <InputField 
                        label="Risk Category" 
                        field="risk_category" 
                        options={["Low", "Medium", "High"]}
                        icon={AlertTriangle}
                      />
                      
                      <div>
                        <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                          Loan Eligibility
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="loan_eligibility"
                              checked={formData.loan_eligibility === true}
                              onChange={() => handleInputChange('loan_eligibility', true)}
                              className="text-indigo-600"
                            />
                            <span className="text-sm">Eligible</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="loan_eligibility"
                              checked={formData.loan_eligibility === false}
                              onChange={() => handleInputChange('loan_eligibility', false)}
                              className="text-indigo-600"
                            />
                            <span className="text-sm">Not Eligible</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Modification Reason */}
                    <div className="mt-4">
                      <label className="text-xs font-medium text-gray-700 block mb-1.5">
                        Reason for Credit Changes (Required)
                      </label>
                      <textarea
                        id="modification-reason"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="2"
                        placeholder="Enter reason for credit limit or settings changes..."
                      />
                    </div>
                  </div>

                  {/* Edit History */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <History className="w-4 h-4 text-indigo-600" />
                      Recent Credit Modifications
                    </h3>
                    <div className="space-y-3">
                      {editHistory.map((history, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-1.5 bg-indigo-100 rounded">
                            <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-medium text-gray-900">
                                {history.field.replace(/_/g, ' ').toUpperCase()}
                              </p>
                              <span className="text-xs text-gray-500">
                                {new Date(history.editedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              <span className="font-medium">{history.oldValue}</span>
                              <span className="mx-2">→</span>
                              <span className="font-medium text-indigo-600">{history.newValue}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              By: {history.editedBy} • Reason: {history.reason}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === "documents" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      Identity Documents
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <DocumentUpload 
                        label="Aadhaar Card" 
                        field="aadhaar_image" 
                        currentImage={formData.aadhaar_image}
                      />
                      <DocumentUpload 
                        label="PAN Card" 
                        field="pan_image" 
                        currentImage={formData.pan_image}
                      />
                      <DocumentUpload 
                        label="Profile Photo" 
                        field="user_image" 
                        currentImage={formData.user_image}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      Bank Documents
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <DocumentUpload 
                        label="Bank Passbook" 
                        field="bank_passbook_img" 
                        currentImage={formData.bank_passbook_img}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-600" />
                      Nominee Documents
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <DocumentUpload 
                        label="Nominee Aadhaar" 
                        field="nominee_aadhaar_image" 
                        currentImage={formData.nominee_aadhaar_image}
                      />
                      <DocumentUpload 
                        label="Nominee PAN" 
                        field="nominee_pan_image" 
                        currentImage={formData.nominee_pan_image}
                      />
                    </div>
                  </div>
                </div>
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
                      {changedFields.size} unsaved change{changedFields.size !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => {
                    setFormData({ ...farmerData });
                    setChangedFields(new Set());
                    setIsDirty(false);
                    setErrors({});
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={!isDirty}
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
                  disabled={!isDirty || Object.keys(errors).length > 0}
                  className={`group px-5 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-sm flex items-center gap-2 ${
                    (!isDirty || Object.keys(errors).length > 0) ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                  {isDirty && (
                    <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      {changedFields.size}
                    </span>
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