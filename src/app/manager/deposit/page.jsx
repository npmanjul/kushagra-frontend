"use client";
import React, { useEffect, useState } from "react";
import { Plus, AlertCircle, Search, User, X, Check, Droplets, ArrowDownCircle } from "lucide-react";
import toast from "react-hot-toast";
import API_BASE_URL from "@/utils/constants";
import GrainConfirmation from "@/components/common/GrainConfirmation";
import Loader from "@/components/common/Loader";

const DepositContent = () => {
  const [form, setForm] = useState({
    quantity: "",
    category_id: "",
    warehouse_id: "",
    moisture_content: "",
    transaction_type: "deposit",
    farmerId: "",
  });

  const [grainTypes, setGrainTypes] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDepositData, setSelectedDepositData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // User search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [grainPrices, setGrainPrices] = useState(null);

  // Detect search type based on input
  const detectSearchType = (query) => {
    const normalizedQuery = query.trim();

    // Check if it's an email
    if (normalizedQuery.includes("@")) {
      return "email";
    }

    // Check if it's a phone number
    if (
      /^[\d\s\-\+]+$/.test(normalizedQuery) &&
      normalizedQuery.replace(/\D/g, "").length >= 7
    ) {
      return "phone_number";
    }

    // Check if it's a userId
    if (/^SGB\d{10}$/i.test(normalizedQuery)) {
      return "userId";
    }

    // Default to name search
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

      const data = await response.json();

      if (data.users && Array.isArray(data.users)) {
        setSearchResults(data.users);
        setShowSearchDropdown(true);
      } else if (data.user) {
        // Fallback for single user response
        setSearchResults([data.user]);
        setShowSearchDropdown(true);
      } else {
        setSearchResults([]);
        setShowSearchDropdown(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error searching users", error.message);
      setSearchResults([]);
      setShowSearchDropdown(true);
    } finally {
      setIsSearching(false);
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

  // Handle user selection
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setForm({ ...form, farmerId: user._id || user.id });
    setSearchQuery("");
    setShowSearchDropdown(false);
    setSearchResults([]);
    toast.success(`Selected farmer: ${user.name}`);
  };

  // Clear selected user
  const handleClearUser = () => {
    setSelectedUser(null);
    setForm({ ...form, farmerId: "" });
    setSearchQuery("");
  };

  // Fetch all grain categories
  const fetchGrainTypes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/grain/allgraincategories`);
      if (!response.ok) throw new Error("Failed to fetch grain types");
      const data = await response.json();

      if (response.ok) {
        setGrainTypes(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load grain categories");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all warehouses
  const fetchWarehouses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/warehouse/allwarehouse`);
      if (!response.ok) throw new Error("Failed to fetch warehouses");
      const data = await response.json();

      if (response.ok) {
        setWarehouses(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load warehouses");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGrainPrices = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/pricehistory/pricehistorybygrain?id=${form.category_id}`
      );
      if (!response.ok) throw new Error("Failed to fetch today's market price");
      const data = await response.json();

      if (response.ok) {
        setGrainPrices(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load today's market price");
    }
  };

  useEffect(() => {
    fetchGrainTypes();
    fetchWarehouses();
  }, []);

  useEffect(() => {
    if (form.category_id) {
      fetchGrainPrices();
    }
  }, [form.category_id]);

  // Submit deposit to backend
  const handleSubmit = async () => {
    if (!form.farmerId) {
      toast.error("Please select a farmer");
      return;
    }

    if (!form.category_id || !form.warehouse_id || !form.quantity || !form.moisture_content) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate moisture content
    const moistureValue = parseFloat(form.moisture_content);
    if (isNaN(moistureValue) || moistureValue < 0 || moistureValue > 100) {
      toast.error("Moisture content must be between 0 and 100%");
      return;
    }

    try {
      const depositData = {
        farmerId: form.farmerId,
        warehouse_id: form.warehouse_id,
        category_id: form.category_id,
        quantity: form.quantity,
        current_price: grainPrices?.price,
        moisture_content: form.moisture_content,
        transaction_type: form.transaction_type,
      };

      const response = await fetch(`${API_BASE_URL}/deposite/graindeposite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(depositData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Deposit submitted successfully");
        setForm({
          quantity: "",
          category_id: "",
          warehouse_id: "",
          farmerId: "",
          moisture_content: "",
          transaction_type: "deposit",
        });
        setSelectedUser(null);
        setModalOpen(false);
      } else {
        toast.error(data.message || "Failed to submit deposit");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while submitting deposit");
    }
  };

  // Handle modal open
  const handleOpenModal = () => {
    if (!form.farmerId) {
      toast.error("Please select a farmer");
      return;
    }

    if (!form.category_id || !form.warehouse_id || !form.quantity || !form.moisture_content) {
      toast.error("Please fill all required fields");
      return;
    }

    const selectedGrain = grainTypes.find((g) => g._id === form.category_id);
    const selectedWarehouse = warehouses.find(
      (w) => w._id === form.warehouse_id
    );

    const confirmationData = {
      farmer_name: selectedUser.name,
      farmer_email: selectedUser.email,
      farmer_phone_number: selectedUser.phone_number,
      farmer_image: selectedUser.user_image,
      grainCategory: selectedGrain?.grain_type || "N/A",
      grain_id: selectedGrain?._id || "N/A",
      grainQuality: selectedGrain?.quality || "N/A",
      quantity: form.quantity,
      warehouse: selectedWarehouse
        ? `${selectedWarehouse.name} — ${selectedWarehouse.location}`
        : "N/A",
      currentPrice: grainPrices?.price,
      farmer_userId: selectedUser.farmerId,
      moisture_content: form.moisture_content,
      transaction_type: form.transaction_type,
    };

    setSelectedDepositData(confirmationData);
    setModalOpen(true);
  };

  // Get search type indicator
  const getSearchTypeLabel = () => {
    switch (searchType) {
      case "email":
        return "Searching by Email";
      case "phone_number":
        return "Searching by Phone";
      case "userId":
        return "Searching by User ID";
      default:
        return "Searching by Name";
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {modalOpen && selectedDepositData && (
        <GrainConfirmation
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          confirmationData={selectedDepositData}
          onConfirm={handleSubmit}
        />
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
            New Grain Deposit
          </h2>

          <div className="space-y-6">
            {/* Farmer Selection */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Farmer <span className="text-red-500">*</span>
              </label>

              {!selectedUser ? (
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                      placeholder="Search by name, email, phone number, or user ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => searchQuery && setShowSearchDropdown(true)}
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                  </div>

                  {searchQuery && (
                    <div className="mt-1">
                      <span className="text-xs text-blue-600 font-medium">
                        {getSearchTypeLabel()}
                      </span>
                    </div>
                  )}

                  {showSearchDropdown && searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-y-auto">
                      {searchResults.map((user, index) => (
                        <div
                          key={user._id || user.id || index}
                          onClick={() => handleSelectUser(user)}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex-shrink-0">
                            {user.user_image ? (
                              <img
                                src={user.user_image}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {user.name || "Unknown User"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email || "No email"}
                            </p>
                            {user.phone_number && (
                              <p className="text-xs text-gray-400">
                                {user.phone_number}
                              </p>
                            )}
                            {user.farmerId && (
                              <p className="text-xs text-blue-600 font-medium">
                                ID: {user.farmerId}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              Select
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showSearchDropdown &&
                    searchQuery &&
                    searchResults.length === 0 &&
                    !isSearching && (
                      <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
                        <div className="text-center">
                          <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">No farmers found</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Try searching with different criteria
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="bg-white rounded-lg border-2 border-green-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {selectedUser.user_image ? (
                          <img
                            src={selectedUser.user_image}
                            alt={selectedUser.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {selectedUser.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 flex items-center">
                          {selectedUser.name || "Unknown User"}
                          <Check className="ml-2 h-5 w-5 text-green-500" />
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedUser.email || "No email"}
                        </p>
                        {selectedUser.phone_number && (
                          <p className="text-xs text-gray-400">
                            {selectedUser.phone_number}
                          </p>
                        )}
                        {selectedUser.userId && (
                          <p className="text-xs text-blue-600 font-medium">
                            ID: {selectedUser.userId}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleClearUser}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      title="Remove farmer"
                    >
                      <X className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-3 text-xs text-gray-600">
                <p className="font-medium mb-1">Search Tips:</p>
                <ul className="space-y-0.5">
                  <li>• Enter full or partial name to search by name</li>
                  <li>• Include @ to search by email address</li>
                  <li>• Enter numbers to search by phone</li>
                  <li>• Enter User ID (e.g., SGB2025000002) for exact match</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Grain Category <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  value={form.category_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category_id: e.target.value }))
                  }
                  disabled={!selectedUser}
                >
                  <option value="">Select Grain Type</option>
                  {grainTypes.length > 0 ? (
                    grainTypes.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.grain_type} - {g.quality}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading...</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity (Quintal) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Enter quantity"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, quantity: e.target.value }))
                  }
                  disabled={!selectedUser}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Price (₹/Quintal)
                </label>
                <div className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 flex items-center">
                  <span className="text-lg font-semibold text-gray-700">
                    ₹ {grainPrices?.price || "0.00"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Warehouse <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  value={form.warehouse_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, warehouse_id: e.target.value }))
                  }
                  disabled={!selectedUser}
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.length > 0 ? (
                    warehouses.map((w) => (
                      <option key={w._id} value={w._id}>
                        {w.name} — {w.location}
                        {w.capacity && ` (Capacity: ${w.capacity} quintals)`}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading...</option>
                  )}
                </select>
              </div>

              {/* Moisture Content Field */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Moisture Content (%) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Droplets className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="Enter moisture percentage (e.g., 12.5)"
                    value={form.moisture_content}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                        setForm((f) => ({ ...f, moisture_content: value }));
                      }
                    }}
                    disabled={!selectedUser}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-medium">%</span>
                  </div>
                </div>
                {form.moisture_content && (
                  <div className={`mt-2 flex items-center space-x-2 ${
                    parseFloat(form.moisture_content) <= 14 
                      ? "text-green-600" 
                      : parseFloat(form.moisture_content) <= 18 
                      ? "text-yellow-600" 
                      : "text-red-600"
                  }`}>
                    <div className={`h-2 w-2 rounded-full ${
                      parseFloat(form.moisture_content) <= 14 
                        ? "bg-green-500" 
                        : parseFloat(form.moisture_content) <= 18 
                        ? "bg-yellow-500" 
                        : "bg-red-500"
                    }`}></div>
                    <span className="text-sm font-medium">
                      {parseFloat(form.moisture_content) <= 14 
                        ? "Optimal moisture level" 
                        : parseFloat(form.moisture_content) <= 18 
                        ? "Acceptable moisture level" 
                        : "High moisture - may require drying"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Deposit Terms & Conditions */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-5">
              <div className="flex items-start">
                <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    Deposit Terms & Conditions
                  </h4>
                  <ul className="text-sm text-yellow-800 space-y-1.5">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Minimum storage period: 6 months</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Storage fee: ₹0.20 per quintal per day</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Quality check is mandatory before deposit</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Insurance coverage available upon request</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={handleOpenModal}
              type="button"
              disabled={
                !selectedUser ||
                !form.category_id ||
                !form.warehouse_id ||
                !form.quantity ||
                !form.moisture_content
              }
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3.5 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <ArrowDownCircle className="h-5 w-5" />
              <span>Review & Submit Deposit</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DepositContent;