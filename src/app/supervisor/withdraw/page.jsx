"use client";
import React, { useEffect, useState } from "react";
import { 
  Search, 
  User, 
  X, 
  Check, 
  Package,
  TrendingDown,
  Truck,
  AlertCircle,
  ChevronRight,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Hash,
  Loader2,
  ArrowDownLeft,
  Calculator,
  ArrowRight,
  Sparkles,
  Info,
  Wheat,
  ChevronDown,
  FileText,
  Shield,
  Activity,
  PackageMinus,
  Scale,
  Clock,
  UserCheck,
  MinusCircle,
  LogOut,
  Zap,
  DollarSign,
  TrendingUp,
  IndianRupee
} from "lucide-react";
import toast from "react-hot-toast";
import API_BASE_URL from "@/utils/constants";

const WithdrawalPage = () => {
  // State declarations
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [userInventory, setUserInventory] = useState([]);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [todayPrice, setTodayPrice] = useState(null);
  const [withdrawQuantity, setWithdrawQuantity] = useState("");
  const [withdrawalReason, setWithdrawalReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [withdrawalNotes, setWithdrawalNotes] = useState("");

  // Predefined withdrawal reasons
  const withdrawalReasons = [
    { id: "personal_use", label: "Personal Use", icon: User, color: "blue" },
    { id: "sale", label: "Direct Sale", icon: TrendingDown, color: "emerald" },
    { id: "transfer", label: "Transfer", icon: Truck, color: "purple" },
    { id: "processing", label: "Processing", icon: Package, color: "orange" },
    { id: "other", label: "Other", icon: FileText, color: "gray" }
  ];

  // Helper functions
  const detectSearchType = (query) => {
    const normalizedQuery = query.trim();
    
    if (normalizedQuery.includes("@")) return "email";
    if (/^[\d\s\-\+]+$/.test(normalizedQuery) && normalizedQuery.replace(/\D/g, "").length >= 7) return "phone_number";
    if (/^SGB\d{10}$/i.test(normalizedQuery)) return "userId";
    return "name";
  };

  const searchUsers = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const detectedType = detectSearchType(query);
    setSearchType(detectedType);

    try {
      const queryParam = `${detectedType}=${encodeURIComponent(query)}`;
      const response = await fetch(
        `${API_BASE_URL}/user/finduserdetails?${queryParam}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to search users");

      const data = await response.json();
      
      if (data.users && Array.isArray(data.users)) {
        setSearchResults(data.users);
        setShowSearchDropdown(true);
      } else if (data.user) {
        setSearchResults([data.user]);
        setShowSearchDropdown(true);
      } else {
        setSearchResults([]);
        setShowSearchDropdown(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setShowSearchDropdown(true);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchUserInventory = async (farmerId) => {
    setIsLoadingInventory(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/getallgraindeposite?farmerId=${farmerId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch inventory");

      const data = await response.json();
      const deposits = Array.isArray(data.deposits) ? data.deposits : [];

      const normalized = deposits
        .map(d => ({
          category_id: d.category_id,
          grain_id: d.grain_id || d.category_id,
          grain_type: d.grain_type || "Unknown",
          quality: d.quality || "Standard",
          quantity: Number(d.total_quantity ?? 0),
          deposited_date: d.deposited_date || null,
          last_transaction: d.last_transaction || null,
        }))
        .filter(d => d.quantity > 0)
        .sort((a,b)=> b.quantity - a.quantity);

      setUserInventory(normalized);
      setCurrentStep(2);
    } catch (error) {
      console.error("Inventory fetch error:", error);
      toast.error("Failed to load user inventory");
      setUserInventory([]);
    } finally {
      setIsLoadingInventory(false);
    }
  };

  const fetchTodayPrice = async (grainId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/pricehistory/pricehistorybygrain?id=${grainId}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch price");
      
      const data = await response.json();
      setTodayPrice(data);
    } catch (error) {
      console.error("Price fetch error:", error);
      toast.error("Failed to load today's price");
      setTodayPrice(null);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchUsers(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    if (selectedInventoryItem) {
      fetchTodayPrice(selectedInventoryItem.grain_id || selectedInventoryItem.category_id);
      setCurrentStep(3);
    }
  }, [selectedInventoryItem]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchQuery("");
    setShowSearchDropdown(false);
    setSearchResults([]);
    fetchUserInventory(user._id || user.id);
  };

  const handleSelectInventory = (item) => {
    setSelectedInventoryItem(item);
    setWithdrawQuantity("");
    setWithdrawalReason("");
    setWithdrawalNotes("");
  };

  const calculateTotalAmount = () => {
    if (!withdrawQuantity || !todayPrice?.price) return 0;
    return (parseFloat(withdrawQuantity) * parseFloat(todayPrice.price)).toFixed(2);
  };

  const processWithdrawal = async () => {
    if (!withdrawQuantity || !withdrawalReason) {
      toast.error("Please fill all required fields");
      return;
    }

    if (parseFloat(withdrawQuantity) > parseFloat(selectedInventoryItem.quantity)) {
      toast.error("Withdrawal quantity cannot exceed available quantity");
      return;
    }

    setIsProcessing(true);
    try {
      const withdrawalData = {
        farmerId: selectedUser._id || selectedUser.id,
        grain_id: selectedInventoryItem.grain_id || selectedInventoryItem.category_id,
        quantity: withdrawQuantity,
        price: todayPrice?.price || 0,
        total_value: calculateTotalAmount(),
        reason: withdrawalReason,
        notes: withdrawalNotes,
        transaction_type: "withdrawal"
      };

      const response = await fetch(`${API_BASE_URL}/transaction/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(withdrawalData),
      });

      if (!response.ok) throw new Error("Failed to process withdrawal");

      toast.success("Withdrawal processed successfully!");
      
      setSelectedUser(null);
      setUserInventory([]);
      setSelectedInventoryItem(null);
      setWithdrawQuantity("");
      setWithdrawalReason("");
      setWithdrawalNotes("");
      setTodayPrice(null);
      setCurrentStep(1);
      setShowConfirmModal(false);
      
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Failed to process withdrawal");
    } finally {
      setIsProcessing(false);
    }
  };

  // Confirmation Modal Component
  const ConfirmWithdrawalModal = () => {
    if (!showConfirmModal) return null;

    const remainingQty = selectedInventoryItem
      ? (parseFloat(selectedInventoryItem.quantity) - parseFloat(withdrawQuantity || 0)).toFixed(2)
      : "0";

    const selectedReason = withdrawalReasons.find(r => r.id === withdrawalReason);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-md" 
          onClick={() => setShowConfirmModal(false)}
        />
        <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-auto animate-modalSlide no-scrollbar">
          {/* Header Gradient */}
          <div className="h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />
          
          <div className="p-6 md:p-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-lg">
                  <PackageMinus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Confirm Withdrawal</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Review withdrawal details before confirming</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content Grid */}
            <div className="space-y-4">
              {/* Farmer Details */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-800">Farmer Details</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InfoItem label="Name" value={selectedUser?.name} />
                  <InfoItem label="ID" value={selectedUser?.userId} />
                  <InfoItem label="Email" value={selectedUser?.email} />
                  <InfoItem label="Phone" value={selectedUser?.phone_number || "-"} />
                </div>
              </div>

              {/* Grain Details */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <Wheat className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-800">Grain Details</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <InfoItem label="Type" value={selectedInventoryItem?.grain_type} />
                  <InfoItem label="Quality" value={selectedInventoryItem?.quality} />
                  <InfoItem label="Current Stock" value={`${selectedInventoryItem?.quantity} Qtl`} />
                  <InfoItem label="Withdrawing" value={`${withdrawQuantity || 0} Qtl`} highlight />
                  <InfoItem label="Remaining" value={`${remainingQty} Qtl`} />
                  <InfoItem label="Rate" value={`₹${todayPrice?.price || 0}/Qtl`} />
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 border border-emerald-200">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-5 w-5 text-emerald-600" />
                  <h4 className="font-semibold text-gray-800">Withdrawal Value</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Quantity × Rate</span>
                    <span className="text-gray-900 font-medium">
                      {withdrawQuantity || 0} × ₹{todayPrice?.price || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t border-emerald-200">
                    <span className="text-lg font-semibold text-gray-800">Total Value</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      ₹{calculateTotalAmount()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Withdrawal Details */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <LogOut className="h-5 w-5 text-orange-600" />
                  <h4 className="font-semibold text-gray-800">Withdrawal Information</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {selectedReason && <selectedReason.icon className="h-5 w-5 text-orange-600" />}
                    <div>
                      <p className="text-xs text-gray-500">Reason</p>
                      <p className="font-semibold text-gray-900">{selectedReason?.label}</p>
                    </div>
                  </div>
                  {withdrawalNotes && (
                    <div className="bg-white/70 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Additional Notes</p>
                      <p className="text-sm text-gray-700">{withdrawalNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Warning */}
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800 font-medium">
                    Important: This action cannot be reversed
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    {withdrawQuantity || 0} quintals (Value: ₹{calculateTotalAmount()}) will be permanently removed from the farmer's inventory.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3.5 px-6 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={processWithdrawal}
                disabled={isProcessing}
                className="flex-1 py-3.5 px-6 rounded-xl font-semibold bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    Confirm Withdrawal
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Helper component for info display
  const InfoItem = ({ label, value, highlight }) => (
    <div className={`${highlight ? 'bg-white/80' : 'bg-white/50'} rounded-xl p-2.5`}>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className={`font-semibold truncate ${highlight ? 'text-orange-600' : 'text-gray-900'}`}>
        {value || "-"}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
        <div className="absolute top-3/4 -right-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-4000" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 lg:p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-lg">
                  <PackageMinus className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </div>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Grain Withdrawal
                </h1>
                <p className="text-gray-600 mt-1">Process grain withdrawals from farmer inventory</p>
              </div>
            </div>
            
            {/* Progress Steps - Desktop */}
            <div className="hidden lg:flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-2">
              {[
                { step: 1, label: "Search Farmer", icon: Search },
                { step: 2, label: "Select Grain", icon: Package },
                { step: 3, label: "Confirm Withdrawal", icon: MinusCircle }
              ].map((item, index) => (
                <div key={item.step} className="flex items-center">
                  <div className={`flex items-center px-4 py-2.5 rounded-xl transition-all duration-500 ${
                    currentStep >= item.step ? 'bg-white shadow-md' : ''
                  }`}>
                    <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 ${
                      currentStep >= item.step 
                        ? 'bg-gradient-to-br from-red-500 to-orange-600 text-white shadow-lg' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {currentStep > item.step ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <item.icon className="h-5 w-5" />
                      )}
                      {currentStep === item.step && (
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl blur opacity-30 animate-pulse" />
                      )}
                    </div>
                    <span className={`ml-3 text-sm font-medium hidden xl:inline transition-all duration-500 ${
                      currentStep >= item.step ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  {index < 2 && (
                    <ChevronRight className={`h-5 w-5 mx-2 transition-all duration-500 ${
                      currentStep > item.step ? 'text-red-500' : 'text-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Progress Steps - Mobile */}
            <div className="flex lg:hidden justify-center gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    currentStep >= step
                      ? 'w-12 bg-gradient-to-r from-red-500 to-orange-600'
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 lg:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Search className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Search Farmer</h2>
            {selectedUser && (
              <span className="ml-auto px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1.5">
                <Check className="h-4 w-4" />
                Farmer Selected
              </span>
            )}
          </div>

          {!selectedUser ? (
            <div className="space-y-4">
              <div className="relative">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base lg:text-lg font-medium placeholder-gray-400"
                      placeholder="Search by name, email, phone, or farmer ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => searchQuery && setShowSearchDropdown(true)}
                    />
                    {isSearching && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Search Type Indicator */}
                {searchQuery && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1.5">
                      {searchType === "email" && <Mail className="h-3.5 w-3.5" />}
                      {searchType === "phone_number" && <Phone className="h-3.5 w-3.5" />}
                      {searchType === "userId" && <Hash className="h-3.5 w-3.5" />}
                      {searchType === "name" && <User className="h-3.5 w-3.5" />}
                      Searching by {searchType.replace("_", " ")}
                    </span>
                    <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                  </div>
                )}

                {/* Search Results Dropdown */}
                {showSearchDropdown && searchResults.length > 0 && (
                  <div className="absolute z-40 w-full mt-3 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto animate-slideDown">
                    {searchResults.map((user, index) => (
                      <div
                        key={user._id || user.id || index}
                        onClick={() => handleSelectUser(user)}
                        className="group px-5 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer flex items-center gap-4 transition-all duration-200 border-b border-gray-100 last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl"
                      >
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-200">
                            {user.name?.charAt(0).toUpperCase() || "F"}
                          </div>
                          {user.isActive && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {user.name || "Unknown Farmer"}
                          </p>
                          <p className="text-sm text-gray-600 truncate">{user.email || "No email"}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-1">
                            {user.phone_number && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span className="truncate">{user.phone_number}</span>
                              </span>
                            )}
                            {user.userId && (
                              <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                                <Hash className="h-3 w-3" />
                                {user.userId}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {showSearchDropdown && searchQuery && searchResults.length === 0 && !isSearching && (
                  <div className="absolute z-40 w-full mt-3 bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 animate-slideDown">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-900 font-semibold">No farmers found</p>
                      <p className="text-sm text-gray-500 mt-1">Try searching with different criteria</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Selected User Display
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {selectedUser.name?.charAt(0).toUpperCase() || "F"}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                      <div className="bg-blue-500 rounded-full p-1">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-xl text-gray-900">{selectedUser.name}</p>
                    <p className="text-gray-600 text-sm lg:text-base">{selectedUser.email}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      {selectedUser.phone_number && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {selectedUser.phone_number}
                        </span>
                      )}
                      {selectedUser.userId && (
                        <span className="text-sm text-blue-600 font-medium flex items-center gap-1">
                          <Hash className="h-4 w-4" />
                          {selectedUser.userId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setUserInventory([]);
                    setSelectedInventoryItem(null);
                    setCurrentStep(1);
                  }}
                  className="p-3 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                >
                  <X className="h-6 w-6 text-gray-500 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Inventory Section */}
        {selectedUser && currentStep >= 2 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 lg:p-8 mb-6 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Available Inventory</h2>
              {selectedInventoryItem && (
                <span className="ml-auto px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  Grain Selected
                </span>
              )}
            </div>

            {isLoadingInventory ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-pulse" />
                  <div className="absolute top-0 left-0 w-20 h-20 border-4 border-purple-500 rounded-full animate-spin border-t-transparent" />
                </div>
                <p className="text-gray-600 mt-4">Loading inventory...</p>
              </div>
            ) : userInventory.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {userInventory.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectInventory(item)}
                    className={`group relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      selectedInventoryItem === item ? 'scale-105' : ''
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br rounded-2xl blur-md transition-all duration-300 ${
                      selectedInventoryItem === item 
                        ? 'from-purple-400 to-pink-400 opacity-40' 
                        : 'from-gray-200 to-gray-300 opacity-0 group-hover:opacity-30'
                    }`} />
                    <div className={`relative p-6 rounded-2xl border-2 backdrop-blur-sm transition-all duration-300 ${
                      selectedInventoryItem === item 
                        ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50' 
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50/50 hover:to-pink-50/50'
                    }`}>
                      {selectedInventoryItem === item && (
                        <div className="absolute top-3 right-3 animate-bounceIn">
                          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full p-1.5 shadow-lg">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`p-3 rounded-xl transition-all duration-300 ${
                          selectedInventoryItem === item
                            ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg'
                            : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-purple-100 group-hover:to-pink-100'
                        }`}>
                          <Wheat className={`h-6 w-6 transition-colors ${
                            selectedInventoryItem === item ? 'text-white' : 'text-gray-600 group-hover:text-purple-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate">{item.grain_type}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                              {item.quality}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Scale className="h-4 w-4" />
                            Available Stock
                          </span>
                          <span className="font-bold text-lg text-gray-900">{item.quantity} Qtl</span>
                        </div>
                        <div className="space-y-2">
                          {item.deposited_date && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                Deposited
                              </span>
                              <span className="text-sm text-gray-700">
                                {new Date(item.deposited_date).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {item.last_transaction && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                Last Activity
                              </span>
                              <span className="text-sm text-gray-700">
                                {new Date(item.last_transaction).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-700 font-semibold text-lg">No inventory found</p>
                <p className="text-sm text-gray-500 mt-2">This farmer has no grain in storage</p>
              </div>
            )}
          </div>
        )}

        {/* Withdrawal Details Section */}
        {selectedInventoryItem && currentStep >= 3 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 lg:p-8 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl shadow-lg">
                <TrendingDown className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Withdrawal Details</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Selected Item Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    Selected Grain
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Grain Type</span>
                      <span className="font-semibold text-gray-900">{selectedInventoryItem.grain_type}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Quality</span>
                      <span className="font-semibold text-gray-900">{selectedInventoryItem.quality}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-blue-200/50 pt-3">
                      <span className="text-gray-600">Available Stock</span>
                      <span className="font-bold text-blue-600 text-lg">{selectedInventoryItem.quantity} Qtl</span>
                    </div>
                  </div>
                </div>

                {/* Price Card */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    Today's Market Price
                  </h3>
                  {todayPrice ? (
                    <div className="text-center py-4">
                      <p className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        ₹{todayPrice.price}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">per quintal</p>
                      {todayPrice.date && (
                        <p className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Updated: {new Date(todayPrice.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Loading price...</p>
                    </div>
                  )}
                </div>

                {/* Stock Status Card */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-amber-600" />
                    Stock Status
                  </h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Current Level</span>
                        <span className="text-sm font-semibold text-gray-900">{selectedInventoryItem.quantity} Qtl</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: '100%' }}
                        />
                      </div>
                      {withdrawQuantity && (
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">After Withdrawal</span>
                            <span className="text-sm font-semibold text-orange-600">
                              {(parseFloat(selectedInventoryItem.quantity) - parseFloat(withdrawQuantity)).toFixed(2)} Qtl
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${((parseFloat(selectedInventoryItem.quantity) - parseFloat(withdrawQuantity)) / parseFloat(selectedInventoryItem.quantity)) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="space-y-4">
                {/* Quantity Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Withdrawal Quantity (Quintal) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max={selectedInventoryItem.quantity}
                      step="0.01"
                      className="w-full px-4 py-3.5 pr-16 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all duration-200 text-lg font-medium"
                      placeholder="Enter quantity to withdraw"
                      value={withdrawQuantity}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= parseFloat(selectedInventoryItem.quantity))) {
                          setWithdrawQuantity(value);
                        }
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-medium">Qtl</span>
                    </div>
                  </div>
                  {withdrawQuantity && (
                    <div className="mt-2 p-3 bg-orange-50 rounded-xl border border-orange-200">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-orange-600 mt-0.5" />
                        <div className="flex-1 text-sm">
                          <p className="text-orange-800 font-medium">
                            Remaining after withdrawal: {(parseFloat(selectedInventoryItem.quantity) - parseFloat(withdrawQuantity)).toFixed(2)} Qtl
                          </p>
                          {parseFloat(withdrawQuantity) > parseFloat(selectedInventoryItem.quantity) * 0.8 && (
                            <p className="text-orange-600 text-xs mt-1">
                              You're withdrawing more than 80% of available stock
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Withdrawal Reason */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Withdrawal Reason <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {withdrawalReasons.map((reason) => {
                      const isSelected = withdrawalReason === reason.id;
                      return (
                        <button
                          key={reason.id}
                          type="button"
                          onClick={() => setWithdrawalReason(reason.id)}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-500/20'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <reason.icon className={`h-5 w-5 ${
                              isSelected ? 'text-orange-600' : 'text-gray-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              isSelected ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {reason.label}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Value Summary Card */}
                {withdrawQuantity && todayPrice && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200 animate-slideUp">
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-indigo-600" />
                      Withdrawal Value
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Quantity</span>
                        <span className="font-medium text-gray-900">{withdrawQuantity} Quintal</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Rate per Quintal</span>
                        <span className="font-medium text-gray-900">₹{todayPrice.price}</span>
                      </div>
                      <div className="border-t border-indigo-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">Total Value</span>
                          <div className="text-right">
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                              ₹{calculateTotalAmount()}
                            </span>
                            <p className="text-xs text-gray-500 mt-0.5">Market value at withdrawal</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all duration-200 resize-none"
                    placeholder="Enter any additional information..."
                    rows={3}
                    value={withdrawalNotes}
                    onChange={(e) => setWithdrawalNotes(e.target.value)}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSelectedInventoryItem(null);
                      setWithdrawQuantity("");
                      setWithdrawalReason("");
                      setWithdrawalNotes("");
                      setCurrentStep(2);
                    }}
                    className="flex-1 py-3.5 px-6 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    disabled={!withdrawQuantity || !withdrawalReason || isProcessing}
                    className="flex-1 relative overflow-hidden group rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 transition-transform group-hover:scale-105" />
                    <div className="relative flex items-center justify-center gap-2 px-6 py-3.5 text-white font-semibold">
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <PackageMinus className="h-5 w-5" />
                          <span>Process Withdrawal</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </div>

                {/* Security Note */}
                <div className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <Shield className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      This withdrawal will be permanently recorded with today's market value of ₹{calculateTotalAmount()}. 
                      The grain will be removed from the farmer's inventory immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmWithdrawalModal />

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounceIn {
          animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        @keyframes modalSlide {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modalSlide {
          animation: modalSlide 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WithdrawalPage;