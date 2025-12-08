"use client";
import React, { useState, useRef, useEffect } from "react";
import { X, Warehouse, MapPin, Package, User, UserCheck, Users, Check, ChevronDown, Building2, Sparkles } from "lucide-react";
import API_BASE_URL from "@/utils/constants";
import toast from "react-hot-toast";

const WarehouseModal = ({ isOpen, onClose, onSubmit, managers, supervisors, staff }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity_quintal: "",
    manager_id: "",
    supervisor_id: "",
    staff_ids: [],
  });

  const [errors, setErrors] = useState({});
  const [staffDropdownOpen, setStaffDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setStaffDropdownOpen(false);
      }
    };

    if (staffDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [staffDropdownOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleStaffChange = (staffId) => {
    setFormData((prev) => ({
      ...prev,
      staff_ids: prev.staff_ids.includes(staffId)
        ? prev.staff_ids.filter(id => id !== staffId)
        : [...prev.staff_ids, staffId]
    }));
    if (errors.staff_ids) {
      setErrors((prev) => ({ ...prev, staff_ids: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Warehouse name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.capacity_quintal || formData.capacity_quintal <= 0) {
      newErrors.capacity_quintal = "Valid capacity is required";
    }
    if (!formData.manager_id) newErrors.manager_id = "Manager selection is required";
    if (!formData.supervisor_id) newErrors.supervisor_id = "Supervisor selection is required";
    if (formData.staff_ids.length === 0) newErrors.staff_ids = "At least one staff member is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const requestBody = {
        name: formData.name,
        location: formData.location,
        capacity_quintal: parseFloat(formData.capacity_quintal),
        manager_id: formData.manager_id,
        supervisor_id: formData.supervisor_id,
        staff_ids: formData.staff_ids,
      };

      const response = await fetch(`${API_BASE_URL}/warehouse/createwarehouse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Warehouse created successfully");
        onSubmit?.(data);

        // Reset form after successful creation
        setFormData({
          name: "",
          location: "",
          capacity_quintal: "",
          manager_id: "",
          supervisor_id: "",
          staff_ids: [],
        });
        setErrors({});
        onClose?.();
      } else {
        toast.error(data.message || "Failed to create warehouse");
      }
    } catch (error) {
      console.error("Error creating warehouse:", error);
      toast.error("Something went wrong while creating warehouse");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden transform transition-all animate-slideUp">
        {/* Enhanced Header with Gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Create New Warehouse</h2>
                <p className="text-blue-100 text-sm mt-1">Fill in the details to add a new warehouse</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Form with Enhanced Styling */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Warehouse Name */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Warehouse Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                  <Warehouse className="w-4 h-4 text-white" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter warehouse name"
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                    errors.name ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                    errors.location ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                />
              </div>
              {errors.location && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.location}
                </p>
              )}
            </div>

            {/* Capacity */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Capacity (Quintal) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <input
                  type="number"
                  name="capacity_quintal"
                  value={formData.capacity_quintal}
                  onChange={handleChange}
                  placeholder="Enter capacity"
                  step="0.01"
                  min="0"
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                    errors.capacity_quintal ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                />
              </div>
              {errors.capacity_quintal && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.capacity_quintal}
                </p>
              )}
            </div>

            {/* Manager Selection */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Manager <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
                <select
                  name="manager_id"
                  value={formData.manager_id}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-10 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none bg-white cursor-pointer ${
                    errors.manager_id ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <option value="">Select a manager</option>
                  {managers?.map((manager) => (
                    <option key={manager._id} value={manager._id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.manager_id && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.manager_id}
                </p>
              )}
            </div>

            {/* Supervisor Selection */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Supervisor <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1.5 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
                  <UserCheck className="w-4 h-4 text-white" />
                </div>
                <select
                  name="supervisor_id"
                  value={formData.supervisor_id}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-10 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none bg-white cursor-pointer ${
                    errors.supervisor_id ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <option value="">Select a supervisor</option>
                  {supervisors?.map((supervisor) => (
                    <option key={supervisor._id} value={supervisor._id}>
                      {supervisor.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.supervisor_id && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.supervisor_id}
                </p>
              )}
            </div>
          </div>

          {/* Enhanced Staff Selection */}
          <div className="group" ref={dropdownRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                  <Users className="w-4 h-4 text-white" />
                </div>
                Staff Members <span className="text-red-500">*</span>
              </div>
            </label>
            <div className="relative">
              <div
                onClick={() => setStaffDropdownOpen(!staffDropdownOpen)}
                className={`w-full px-4 py-3.5 border-2 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-200 ${
                  errors.staff_ids ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                } ${staffDropdownOpen ? "ring-4 ring-blue-500/20 border-blue-500" : ""}`}
              >
                <div className="flex-1">
                  {formData.staff_ids.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.staff_ids.length <= 3 ? (
                        formData.staff_ids.map(id => {
                          const member = staff?.find(s => s._id === id);
                          return member ? (
                            <span
                              key={id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm rounded-full font-medium"
                            >
                              {member.name}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStaffChange(id);
                                }}
                                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          ) : null;
                        })
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm rounded-full font-medium">
                            {formData.staff_ids.length} members selected
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData(prev => ({ ...prev, staff_ids: [] }));
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">Click to select staff members</span>
                  )}
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${staffDropdownOpen ? "rotate-180" : ""}`} />
              </div>

              {/* Enhanced Dropdown */}
              {staffDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-64 overflow-hidden">
                  {staff && staff.length > 0 ? (
                    <div>
                      {/* Action Bar */}
                      <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {formData.staff_ids.length} of {staff.length} selected
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData(prev => ({
                                ...prev,
                                staff_ids: staff.map(s => s._id)
                              }));
                              if (errors.staff_ids) {
                                setErrors(prev => ({ ...prev, staff_ids: "" }));
                              }
                            }}
                            className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            Select All
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData(prev => ({
                                ...prev,
                                staff_ids: []
                              }));
                            }}
                            className="px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                      
                      {/* Staff List */}
                      <div className="overflow-y-auto max-h-48 p-2">
                        {staff.map((member) => (
                          <div
                            key={member._id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStaffChange(member._id);
                            }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 mb-1 ${
                              formData.staff_ids.includes(member._id)
                                ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${
                              formData.staff_ids.includes(member._id)
                                ? "bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-500"
                                : "border-gray-300 hover:border-gray-400"
                            }`}>
                              {formData.staff_ids.includes(member._id) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className={`text-sm font-medium ${
                              formData.staff_ids.includes(member._id) ? "text-blue-700" : "text-gray-700"
                            }`}>
                              {member.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No staff members available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.staff_ids && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.staff_ids}
              </p>
            )}
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Create Warehouse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WarehouseModal;