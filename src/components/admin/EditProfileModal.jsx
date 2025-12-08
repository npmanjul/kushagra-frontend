import React, { useState, useEffect } from 'react';
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
  Upload,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Info,
  Edit3,
  Shield,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

const EditProfileModal = ({ isOpen, onClose, farmerData, onSave }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    // Personal Details
    name: '',
    phone: '',
    email: '',
    dob: '',
    gender: '',
    aadhaar_number: '',
    pan_number: '',
    
    // Address Details
    address: '',
    tehsil: '',
    district: '',
    state: '',
    pin_code: '',
    landmark: '',
    
    // Land Details
    land_size: '',
    land_type: '',
    
    // Bank Details
    account_number: '',
    ifsc_code: '',
    account_holder: '',
    bank_name: '',
    branch_name: '',
    
    // Nominee Details
    nominee_name: '',
    nominee_relation: '',
    nominee_phone: '',
    nominee_email: '',
    nominee_dob: '',
    nominee_gender: '',
    nominee_aadhaar: '',
    nominee_pan: '',
    nominee_address: '',
  });

  // Initialize form with farmer data
  useEffect(() => {
    if (farmerData) {
      setFormData({
        name: farmerData.name || '',
        phone: farmerData.phone || '',
        email: farmerData.email || '',
        dob: farmerData.dob || '',
        gender: farmerData.gender || '',
        aadhaar_number: farmerData.aadhaar_number || '',
        pan_number: farmerData.pan_number || '',
        address: farmerData.address || '',
        tehsil: farmerData.tehsil || '',
        district: farmerData.district || '',
        state: farmerData.state || '',
        pin_code: farmerData.pin_code || '',
        landmark: farmerData.landmark || '',
        land_size: farmerData.land_size || '',
        land_type: farmerData.land_type || '',
        account_number: farmerData.account_number || '',
        ifsc_code: farmerData.ifsc_code || '',
        account_holder: farmerData.account_holder || '',
        bank_name: farmerData.bank_name || '',
        branch_name: farmerData.branch_name || '',
        nominee_name: farmerData.nominee_name || '',
        nominee_relation: farmerData.nominee_relation || '',
        nominee_phone: farmerData.nominee_phone || '',
        nominee_email: farmerData.nominee_email || '',
        nominee_dob: farmerData.nominee_dob || '',
        nominee_gender: farmerData.nominee_gender || '',
        nominee_aadhaar: farmerData.nominee_aadhaar || '',
        nominee_pan: farmerData.nominee_pan || '',
        nominee_address: farmerData.nominee_address || '',
      });
    }
  }, [farmerData]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User, color: 'from-blue-500 to-indigo-600' },
    { id: 'address', label: 'Address & Land', icon: MapPin, color: 'from-green-500 to-emerald-600' },
    { id: 'bank', label: 'Bank Details', icon: Building2, color: 'from-purple-500 to-pink-600' },
    { id: 'nominee', label: 'Nominee Info', icon: Users, color: 'from-amber-500 to-orange-600' },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Personal validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (formData.phone && !/^\+?[0-9]{10,12}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.aadhaar_number.trim()) newErrors.aadhaar_number = 'Aadhaar is required';
    
    // Address validation
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pin_code.trim()) newErrors.pin_code = 'PIN code is required';
    
    // Bank validation
    if (!formData.account_number.trim()) newErrors.account_number = 'Account number is required';
    if (!formData.ifsc_code.trim()) newErrors.ifsc_code = 'IFSC code is required';
    if (!formData.bank_name.trim()) newErrors.bank_name = 'Bank name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      // Switch to tab with first error
      const errorFields = Object.keys(errors);
      if (errorFields.length > 0) {
        const personalFields = ['name', 'phone', 'email', 'dob', 'gender', 'aadhaar_number', 'pan_number'];
        const addressFields = ['address', 'tehsil', 'district', 'state', 'pin_code', 'landmark', 'land_size'];
        const bankFields = ['account_number', 'ifsc_code', 'account_holder', 'bank_name', 'branch_name'];
        
        if (personalFields.some(f => errorFields.includes(f))) setActiveTab('personal');
        else if (addressFields.some(f => errorFields.includes(f))) setActiveTab('address');
        else if (bankFields.some(f => errorFields.includes(f))) setActiveTab('bank');
        else setActiveTab('nominee');
      }
      return;
    }
    
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      onSave?.(formData);
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const InputField = ({ 
    label, 
    field, 
    type = 'text', 
    placeholder, 
    icon: Icon, 
    required = false,
    disabled = false,
    options = null,
  }) => {
    const hasError = errors[field] && touched[field];
    const isValid = touched[field] && !errors[field] && formData[field];
    
    return (
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        
        <div className="relative">
          {options ? (
            <select
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              disabled={disabled}
              className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-medium transition-all duration-200 appearance-none cursor-pointer
                ${hasError 
                  ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200 focus:border-red-400' 
                  : isValid
                    ? 'border-green-300 bg-green-50 focus:ring-2 focus:ring-green-200 focus:border-green-400'
                    : 'border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:bg-white'
                }
                ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-gray-300'}
              `}
            >
              <option value="">Select {label}</option>
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-medium transition-all duration-200
                ${hasError 
                  ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200 focus:border-red-400' 
                  : isValid
                    ? 'border-green-300 bg-green-50 focus:ring-2 focus:ring-green-200 focus:border-green-400'
                    : 'border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:bg-white'
                }
                ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-gray-300'}
              `}
            />
          )}
          
          {/* Status icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {hasError && <AlertCircle className="w-4 h-4 text-red-500" />}
            {isValid && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          </div>
        </div>
        
        {hasError && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors[field]}
          </p>
        )}
      </div>
    );
  };

  const SectionCard = ({ title, icon: Icon, children, color = 'indigo' }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className={`px-5 py-3 bg-gradient-to-r from-${color}-50 to-${color}-100/50 border-b border-gray-100`}>
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <div className={`p-1.5 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-lg`}>
            <Icon className="w-3.5 h-3.5 text-white" />
          </div>
          {title}
        </h3>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  const stateOptions = [
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Haryana', label: 'Haryana' },
  ];

  const relationOptions = [
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Son', label: 'Son' },
    { value: 'Daughter', label: 'Daughter' },
    { value: 'Brother', label: 'Brother' },
    { value: 'Sister', label: 'Sister' },
    { value: 'Other', label: 'Other' },
  ];

  const landTypeOptions = [
    { value: 'Agricultural', label: 'Agricultural' },
    { value: 'Irrigated', label: 'Irrigated' },
    { value: 'Non-Irrigated', label: 'Non-Irrigated' },
    { value: 'Mixed', label: 'Mixed' },
  ];

  const getCompletionPercentage = () => {
    const fields = Object.keys(formData);
    const filledFields = fields.filter(f => formData[f] && formData[f].toString().trim());
    return Math.round((filledFields.length / fields.length) * 100);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          </div>
          
          <div className="relative px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar with edit */}
                <div className="relative group">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl border border-white/30 shadow-xl">
                    {formData.name ? formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'NA'}
                  </div>
                  <button className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Edit3 className="w-5 h-5" />
                      Edit Farmer Profile
                    </h2>
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  </div>
                  <p className="text-white/70 text-sm mt-0.5">
                    {farmerData?.id ? `ID: ${farmerData.id}` : 'Update farmer information'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Completion indicator */}
                <div className="hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <div className="text-right">
                    <p className="text-white font-bold text-sm">{getCompletionPercentage()}%</p>
                    <p className="text-white/60 text-xs">Complete</p>
                  </div>
                  <div className="w-12 h-12 relative">
                    <svg className="w-12 h-12 -rotate-90">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                      <circle 
                        cx="24" cy="24" r="20" fill="none" stroke="white" strokeWidth="4"
                        strokeDasharray={`${getCompletionPercentage() * 1.26} 126`}
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

        {/* Tabs */}
        <div className="flex bg-gray-50 px-4 py-2 gap-2 flex-shrink-0 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[140px] px-4 py-2 flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-800 shadow-md scale-[1.02]'
                    : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
                }`}
              >
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${activeTab === tab.id ? tab.color : 'from-gray-300 to-gray-400'}`}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-5">
              <SectionCard title="Basic Information" icon={User} color="blue">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InputField label="Full Name" field="name" icon={User} placeholder="Enter full name" required />
                  <InputField label="Phone Number" field="phone" icon={Phone} placeholder="+91 9876543210" required />
                  <InputField label="Email Address" field="email" icon={Mail} type="email" placeholder="email@example.com" />
                  <InputField label="Date of Birth" field="dob" icon={Calendar} type="date" />
                  <InputField label="Gender" field="gender" icon={User} options={genderOptions} />
                </div>
              </SectionCard>

              <SectionCard title="Identity Documents" icon={Shield} color="indigo">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Aadhaar Number" field="aadhaar_number" icon={Hash} placeholder="1234-5678-9012" required />
                  <InputField label="PAN Number" field="pan_number" icon={CreditCard} placeholder="ABCDE1234F" />
                </div>
                
                {/* Document upload hint */}
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Document Verification</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Identity documents were verified during registration. Contact admin to update document images.
                      </p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {/* Address Tab */}
          {activeTab === 'address' && (
            <div className="space-y-5">
              <SectionCard title="Residential Address" icon={MapPin} color="green">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <InputField label="Address" field="address" icon={MapPin} placeholder="Village, Post Office" required />
                  </div>
                  <InputField label="Landmark" field="landmark" icon={MapPin} placeholder="Near landmark" />
                  <InputField label="Tehsil" field="tehsil" icon={MapPin} placeholder="Enter tehsil" />
                  <InputField label="District" field="district" icon={MapPin} placeholder="Enter district" required />
                  <InputField label="State" field="state" icon={MapPin} options={stateOptions} required />
                  <InputField label="PIN Code" field="pin_code" icon={Hash} placeholder="273402" required />
                </div>
              </SectionCard>

              <SectionCard title="Land Details" icon={Wheat} color="amber">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Land Size (Acres)" field="land_size" icon={Wheat} type="number" placeholder="2.5" />
                  <InputField label="Land Type" field="land_type" icon={Wheat} options={landTypeOptions} />
                </div>
                
                {/* Land documents hint */}
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Khatauni Documents</p>
                      <p className="text-xs text-amber-600 mt-1">
                        Land ownership documents are verified separately. Contact admin to update Khatauni records.
                      </p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {/* Bank Tab */}
          {activeTab === 'bank' && (
            <div className="space-y-5">
              <SectionCard title="Bank Account Details" icon={Building2} color="purple">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InputField label="Account Number" field="account_number" icon={CreditCard} placeholder="Enter account number" required />
                  <InputField label="Confirm Account Number" field="account_number_confirm" icon={CreditCard} placeholder="Re-enter account number" />
                  <InputField label="IFSC Code" field="ifsc_code" icon={Hash} placeholder="SBIN0001234" required />
                  <InputField label="Account Holder Name" field="account_holder" icon={User} placeholder="Name as per bank" />
                  <InputField label="Bank Name" field="bank_name" icon={Building2} placeholder="State Bank of India" required />
                  <InputField label="Branch Name" field="branch_name" icon={Landmark} placeholder="Main Branch" />
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
                      <p className="text-sm font-semibold text-gray-800">Bank Account Verified</p>
                      <p className="text-xs text-gray-500">Last verified on 15 Nov 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-700">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nominee Tab */}
          {activeTab === 'nominee' && (
            <div className="space-y-5">
              <SectionCard title="Nominee Personal Information" icon={Users} color="orange">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InputField label="Nominee Name" field="nominee_name" icon={User} placeholder="Enter nominee name" />
                  <InputField label="Relationship" field="nominee_relation" icon={Users} options={relationOptions} />
                  <InputField label="Phone Number" field="nominee_phone" icon={Phone} placeholder="+91 9876543210" />
                  <InputField label="Email Address" field="nominee_email" icon={Mail} type="email" placeholder="email@example.com" />
                  <InputField label="Date of Birth" field="nominee_dob" icon={Calendar} type="date" />
                  <InputField label="Gender" field="nominee_gender" icon={User} options={genderOptions} />
                </div>
              </SectionCard>

              <SectionCard title="Nominee Identity & Address" icon={Shield} color="red">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Aadhaar Number" field="nominee_aadhaar" icon={Hash} placeholder="1234-5678-9012" />
                  <InputField label="PAN Number" field="nominee_pan" icon={CreditCard} placeholder="ABCDE1234F" />
                  <div className="md:col-span-2">
                    <InputField label="Address" field="nominee_address" icon={MapPin} placeholder="Complete address" />
                  </div>
                </div>
              </SectionCard>

              {/* Nominee info */}
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Nominee Information</p>
                    <p className="text-xs text-orange-600 mt-1">
                      The nominee will be the beneficiary in case of any claims. Ensure all details are accurate and up-to-date.
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
                <span className="text-xs text-gray-500">Required fields marked with *</span>
              </div>
              {Object.keys(errors).length > 0 && (
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">{Object.keys(errors).length} errors found</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="group px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
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