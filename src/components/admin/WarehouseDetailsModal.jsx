"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  Warehouse,
  MapPin,
  Package,
  User,
  UserCheck,
  Users,
  Building2,
  Calendar,
  BarChart3,
  TrendingUp,
  ChevronRight,
  Box,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  ExternalLink,
  Shield,
  Activity,
  Briefcase,
  Hash,
  BadgeCheck,
  UserCircle,
  CalendarDays,
  Wheat,
  Loader2,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  XCircle,
  DollarSign,
} from "lucide-react";
import API_BASE_URL from "@/utils/constants";

const WarehouseDetailsModal = ({
  isOpen,
  onClose,
  warehouse,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [imageErrors, setImageErrors] = useState({});
  const [inventoryData, setInventoryData] = useState(null);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [inventoryError, setInventoryError] = useState(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview");
      setImageErrors({});
      fetchInventoryData();
    }
  }, [isOpen]);

  // Fetch inventory data from API
  const fetchInventoryData = async () => {
    if (!warehouse?._id) return;
    
    setIsLoadingInventory(true);
    setInventoryError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/warehouse/inventory`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch inventory");

      const data = await response.json();
      
      if (data.success && data.warehouses) {
        // Find the matching warehouse by ID
        const matchedWarehouse = data.warehouses.find(
          w => w.warehouseId === warehouse._id
        );
        
        if (matchedWarehouse) {
          setInventoryData(matchedWarehouse);
        } else {
          setInventoryError("No inventory data found for this warehouse");
        }
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventoryError(error.message || "Failed to load inventory data");
    } finally {
      setIsLoadingInventory(false);
    }
  };

  if (!isOpen || !warehouse) return null;

  // Calculate actual used capacity from inventory data
  const calculateActualUsedCapacity = () => {
    if (!inventoryData?.categories) return warehouse.used_capacity_quintal || 0;
    
    return inventoryData.categories.reduce((total, category) => {
      const deposited = category.deposit?.completed?.qty || 0;
      const withdrawn = category.withdraw?.completed || 0;
      const sold = category.sell?.completed?.qty || 0;
      const available = deposited - withdrawn - sold;
      return total + Math.max(0, available);
    }, 0);
  };

  // Handle API response structure
  const totalCapacity = warehouse.capacity_quintal || 0;
  const usedCapacity = inventoryData ? calculateActualUsedCapacity() : (warehouse.used_capacity_quintal || 0);
  const availableCapacity = Math.max(0, totalCapacity - usedCapacity);
  const capacityPercentage =
    totalCapacity > 0 ? Math.round((usedCapacity / totalCapacity) * 100) : 0;

  // Get capacity status with static Tailwind classes
  const getCapacityStatus = () => {
    if (capacityPercentage >= 90) {
      return {
        label: "Critical",
        icon: AlertTriangle,
        bgColor: "bg-rose-500",
        bgColorLight: "bg-rose-50",
        textColor: "text-rose-600",
        borderColor: "border-rose-200",
        badgeBg: "bg-rose-500/10",
        badgeText: "text-rose-400",
        badgeBorder: "border-rose-500/20",
        gradientFrom: "from-rose-500",
        gradientTo: "to-red-600",
      };
    }
    if (capacityPercentage >= 70) {
      return {
        label: "High",
        icon: TrendingUp,
        bgColor: "bg-amber-500",
        bgColorLight: "bg-amber-50",
        textColor: "text-amber-600",
        borderColor: "border-amber-200",
        badgeBg: "bg-amber-500/10",
        badgeText: "text-amber-400",
        badgeBorder: "border-amber-500/20",
        gradientFrom: "from-amber-500",
        gradientTo: "to-orange-600",
      };
    }
    if (capacityPercentage >= 40) {
      return {
        label: "Normal",
        icon: BarChart3,
        bgColor: "bg-blue-500",
        bgColorLight: "bg-blue-50",
        textColor: "text-blue-600",
        borderColor: "border-blue-200",
        badgeBg: "bg-blue-500/10",
        badgeText: "text-blue-400",
        badgeBorder: "border-blue-500/20",
        gradientFrom: "from-blue-500",
        gradientTo: "to-indigo-600",
      };
    }
    return {
      label: "Low",
      icon: CheckCircle2,
      bgColor: "bg-emerald-500",
      bgColorLight: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      badgeBg: "bg-emerald-500/10",
      badgeText: "text-emerald-400",
      badgeBorder: "border-emerald-500/20",
      gradientFrom: "from-emerald-500",
      gradientTo: "to-teal-600",
    };
  };

  const status = getCapacityStatus();
  const StatusIcon = status.icon;

  const tabs = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "team", label: "Team", icon: Users, count: (warehouse.staff?.length || 0) + 2 },
    { id: "inventory", label: "Inventory", icon: Package },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Stat Card Component
  const StatCard = ({ icon: Icon, value, label, gradient, shadowColor }) => (
    <div className="group relative p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg ${shadowColor} group-hover:scale-110 transition-transform duration-500`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 group-hover:translate-x-1 transition-all duration-300" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">
          {typeof value === "number" ? value.toLocaleString() : value}
        </h3>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );

  // Enhanced Team Member Card with Employee Details
  const TeamMemberCard = ({ member, role, gradientBg, accentGradient, borderColor, roleTextColor }) => {
    const employee = member?.employee;
    const hasImage = employee?.employeeImage && !imageErrors[member._id];

    return (
      <div
        className={`p-6 bg-gradient-to-br ${gradientBg} rounded-2xl border ${borderColor} hover:shadow-xl transition-all duration-300`}
      >
        <div className="flex items-start gap-4">
          {/* Avatar/Image */}
          <div className="relative shrink-0">
            {hasImage ? (
              <img
                src={employee.employeeImage}
                alt={member.name}
                onError={() => handleImageError(member._id)}
                className={`w-16 h-16 rounded-2xl object-cover shadow-lg ring-2 ring-white`}
              />
            ) : (
              <div
                className={`w-16 h-16 bg-gradient-to-br ${accentGradient} rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white`}
              >
                {role === "Manager" ? (
                  <User className="w-8 h-8 text-white" />
                ) : (
                  <UserCheck className="w-8 h-8 text-white" />
                )}
              </div>
            )}
            {/* Status Badge */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold uppercase tracking-wider ${roleTextColor}`}>
                {role}
              </span>
              {employee?.employmentStatus === "Active" && (
                <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                  Active
                </span>
              )}
            </div>
            <h4 className="text-lg font-bold text-gray-900 truncate">
              {member.name}
            </h4>
            
            {/* Contact Info */}
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600 flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                {member.email}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                {member.phone_number}
              </p>
            </div>

            {/* Employee Details */}
            {employee && (
              <div className="mt-3 pt-3 border-t border-gray-200/50 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500 truncate">
                    {employee.employeeId}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {employee.employmentType}
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Joined {formatDate(employee.dateOfJoining)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 shrink-0">
            <button 
              className="p-2.5 bg-white/80 hover:bg-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group/btn"
              title={`Email ${member.name}`}
            >
              <Mail className="w-4 h-4 text-gray-500 group-hover/btn:text-blue-600 transition-colors" />
            </button>
            <button 
              className="p-2.5 bg-white/80 hover:bg-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group/btn"
              title={`Call ${member.name}`}
            >
              <Phone className="w-4 h-4 text-gray-500 group-hover/btn:text-emerald-600 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Staff Member Card Component
  const StaffMemberCard = ({ member, index }) => {
    const employee = member?.employee;
    const hasImage = employee?.employeeImage && !imageErrors[member._id];

    return (
      <div
        className="group p-4 bg-white rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300"
        style={{
          animation: `fadeIn 0.3s ease-out ${index * 0.05}s backwards`,
        }}
      >
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            {hasImage ? (
              <img
                src={employee.employeeImage}
                alt={member.name}
                onError={() => handleImageError(member._id)}
                className="w-14 h-14 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md group-hover:scale-105 transition-transform duration-300">
                {member.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            {employee?.employmentStatus === "Active" && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-semibold text-gray-900 truncate">
                {member.name}
              </h4>
              <span className="px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-700 rounded-full capitalize shrink-0">
                {member.role}
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {member.email}
            </p>
            {employee && (
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  {employee.employeeId}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {employee.employmentType}
                </span>
              </div>
            )}
          </div>

          {/* Contact Buttons */}
          <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              className="p-2 bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors"
              title={`Email ${member.name}`}
            >
              <Mail className="w-4 h-4 text-gray-500 hover:text-blue-600" />
            </button>
            <button
              className="p-2 bg-gray-100 hover:bg-emerald-100 rounded-lg transition-colors"
              title={`Call ${member.name}`}
            >
              <Phone className="w-4 h-4 text-gray-500 hover:text-emerald-600" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease-out" }}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
        style={{ animation: "modalSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

        {/* Header */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative px-8 py-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-5 min-w-0 flex-1">
                {/* Icon */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl blur-lg opacity-60" />
                  <div className="relative p-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-xl">
                    <Warehouse className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Title & Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 className="text-2xl font-bold truncate">
                      {warehouse.name}
                    </h2>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300 text-sm flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{warehouse.location}</span>
                    </span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      <Calendar className="w-4 h-4" />
                      {formatDate(warehouse.created_at)}
                    </span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      <Users className="w-4 h-4" />
                      {(warehouse.staff?.length || 0) + 2} Team Members
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onClose}
                  className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 border border-white/10 hover:border-white/20 hover:scale-105"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Capacity Bar */}
            <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${status.badgeBg}`}>
                    <StatusIcon className={`w-4 h-4 ${status.badgeText}`} />
                  </div>
                  <span className="text-sm font-medium text-slate-300">
                    Storage Capacity {inventoryData ? '(Live Data)' : ''}
                  </span>
                </div>
                <span
                  className={`text-sm font-bold ${status.badgeText} px-2 py-0.5 rounded-md ${status.badgeBg}`}
                >
                  {status.label}
                </span>
              </div>

              <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${status.gradientFrom} ${status.gradientTo} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.max(capacityPercentage, 2)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-0.5">Used</p>
                  <p className="font-bold text-white">
                    {usedCapacity.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400">Qtl</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-0.5">Capacity</p>
                  <p className="font-bold text-white text-lg">
                    {capacityPercentage}%
                  </p>
                  <p className="text-xs text-emerald-400">{availableCapacity.toLocaleString()} available</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-0.5">Total</p>
                  <p className="font-bold text-white">
                    {totalCapacity.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400">Qtl</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="relative px-8 flex gap-1">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-5 py-3 rounded-t-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-white text-slate-900 shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span
                      className={`ml-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
                        activeTab === tab.id
                          ? "bg-violet-100 text-violet-700"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-340px)] bg-gradient-to-b from-gray-50 to-white custom-scrollbar">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div
              className="space-y-6"
              style={{ animation: "fadeIn 0.3s ease-out" }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  icon={Package}
                  value={totalCapacity}
                  label="Total Capacity (Quintal)"
                  gradient="from-blue-500 to-indigo-600"
                  shadowColor="shadow-blue-500/25"
                />
                <StatCard
                  icon={Box}
                  value={usedCapacity}
                  label={`Used Space (${capacityPercentage}%)`}
                  gradient="from-emerald-500 to-teal-600"
                  shadowColor="shadow-emerald-500/25"
                />
                <StatCard
                  icon={Layers}
                  value={availableCapacity}
                  label={`Available Space (${100 - capacityPercentage}%)`}
                  gradient="from-purple-500 to-pink-600"
                  shadowColor="shadow-purple-500/25"
                />
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Warehouse Details */}
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    Warehouse Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Warehouse ID</span>
                      <span className="text-sm font-mono font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        {warehouse._id?.slice(-8) || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Location</span>
                      <span className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {warehouse.location}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Manager</span>
                      <span className="text-sm font-medium text-gray-900">
                        {warehouse.manager?.name || "Not assigned"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Supervisor</span>
                      <span className="text-sm font-medium text-gray-900">
                        {warehouse.supervisor?.name || "Not assigned"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-gray-500">Staff Count</span>
                      <span className="text-sm font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded-full">
                        {warehouse.staff?.length || 0} members
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    Activity Timeline
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Warehouse Created
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDateTime(warehouse.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Manager Assigned
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {warehouse.manager?.name || "Pending"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Team Setup Complete
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {(warehouse.staff?.length || 0) + 2} team members assigned
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Status
                        </p>
                        <p className="text-xs text-emerald-600 mt-0.5 font-medium">
                          All systems operational
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Team Preview */}
              <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    Team Overview
                  </h3>
                  <button
                    onClick={() => setActiveTab("team")}
                    className="text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Manager Preview */}
                  {warehouse.manager && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-xl border border-orange-100">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-rose-600 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-orange-600 font-medium">Manager</p>
                        <p className="text-sm font-semibold text-gray-900">{warehouse.manager.name}</p>
                      </div>
                    </div>
                  )}
                  {/* Supervisor Preview */}
                  {warehouse.supervisor && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-cyan-50 rounded-xl border border-cyan-100">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-cyan-600 font-medium">Supervisor</p>
                        <p className="text-sm font-semibold text-gray-900">{warehouse.supervisor.name}</p>
                      </div>
                    </div>
                  )}
                  {/* Staff Count */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-violet-50 rounded-xl border border-violet-100">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-violet-600 font-medium">Staff</p>
                      <p className="text-sm font-semibold text-gray-900">{warehouse.staff?.length || 0} Members</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === "team" && (
            <div
              className="space-y-6"
              style={{ animation: "fadeIn 0.3s ease-out" }}
            >
              {/* Manager & Supervisor */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {warehouse.manager && (
                  <TeamMemberCard
                    member={warehouse.manager}
                    role="Manager"
                    gradientBg="from-orange-50 to-rose-50"
                    accentGradient="from-orange-500 to-rose-600"
                    borderColor="border-orange-100"
                    roleTextColor="text-orange-600"
                  />
                )}
                {warehouse.supervisor && (
                  <TeamMemberCard
                    member={warehouse.supervisor}
                    role="Supervisor"
                    gradientBg="from-cyan-50 to-blue-50"
                    accentGradient="from-cyan-500 to-blue-600"
                    borderColor="border-cyan-100"
                    roleTextColor="text-cyan-600"
                  />
                )}
              </div>

              {/* Staff Members */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    Staff Members
                  </h3>
                  <span className="px-3 py-1 text-sm font-medium text-violet-600 bg-violet-50 rounded-full">
                    {warehouse.staff?.length || 0} members
                  </span>
                </div>

                {warehouse.staff && warehouse.staff.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {warehouse.staff.map((member, index) => (
                      <StaffMemberCard
                        key={member._id || index}
                        member={member}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      No staff members assigned
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add staff members to this warehouse
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === "inventory" && (
            <div
              className="space-y-6"
              style={{ animation: "fadeIn 0.3s ease-out" }}
            >
              {isLoadingInventory ? (
                <div className="text-center py-16">
                  <Loader2 className="w-12 h-12 text-violet-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading inventory data...</p>
                </div>
              ) : inventoryError ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-12 h-12 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Inventory</h3>
                  <p className="text-gray-500 mb-4">{inventoryError}</p>
                  <button
                    onClick={fetchInventoryData}
                    className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-all"
                  >
                    Retry
                  </button>
                </div>
              ) : inventoryData && inventoryData.categories && inventoryData.categories.length > 0 ? (
                <>
                  {/* Inventory Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center justify-between mb-2">
                        <Package className="w-8 h-8 text-emerald-600" />
                        <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                      </div>
                      <p className="text-2xl font-bold text-emerald-900">
                        {inventoryData.categories.reduce((sum, cat) => sum + (cat.deposit?.completed?.qty || 0), 0)}
                      </p>
                      <p className="text-sm text-emerald-700 mt-1">Total Deposits (Qtl)</p>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <TrendingDown className="w-8 h-8 text-blue-600" />
                        <ArrowDownRight className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-2xl font-bold text-blue-900">
                        {inventoryData.categories.reduce((sum, cat) => sum + (cat.withdraw?.completed || 0), 0)}
                      </p>
                      <p className="text-sm text-blue-700 mt-1">Total Withdrawals (Qtl)</p>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-100">
                      <div className="flex items-center justify-between mb-2">
                        <Activity className="w-8 h-8 text-purple-600" />
                        <CheckCircle2 className="w-5 h-5 text-purple-500" />
                      </div>
                      <p className="text-2xl font-bold text-purple-900">
                        {inventoryData.categories.reduce((sum, cat) => sum + (cat.sell?.completed?.qty || 0), 0)}
                      </p>
                      <p className="text-sm text-purple-700 mt-1">Total Sales (Qtl)</p>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
                      <div className="flex items-center justify-between mb-2">
                        <DollarSign className="w-8 h-8 text-amber-600" />
                        <TrendingUp className="w-5 h-5 text-amber-500" />
                      </div>
                      <p className="text-2xl font-bold text-amber-900">
                        ₹{inventoryData.categories.reduce((sum, cat) => sum + (cat.deposit?.completed?.amount || 0), 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-amber-700 mt-1">Total Value</p>
                    </div>
                  </div>

                  {/* Grain Categories - Grouped by Type */}
                  <div className="space-y-6">
                    {(() => {
                      // Group categories by grain type
                      const groupedByGrainType = inventoryData.categories.reduce((acc, category) => {
                        const grainType = category.grain_type;
                        if (!acc[grainType]) {
                          acc[grainType] = [];
                        }
                        acc[grainType].push(category);
                        return acc;
                      }, {});

                      // Sort qualities: A, B, C
                      const sortQualities = (categories) => {
                        return categories.sort((a, b) => {
                          const qualityOrder = { 'A': 1, 'B': 2, 'C': 3 };
                          return (qualityOrder[a.quality] || 999) - (qualityOrder[b.quality] || 999);
                        });
                      };

                      // Define color schemes for different grain types
                      const grainTypeColors = {
                        'Wheat': {
                          bg: 'from-amber-50 to-orange-50',
                          border: 'border-amber-200',
                          text: 'text-amber-600',
                          gradient: 'from-amber-500 to-orange-600'
                        },
                        'Rice': {
                          bg: 'from-emerald-50 to-green-50',
                          border: 'border-emerald-200',
                          text: 'text-emerald-600',
                          gradient: 'from-emerald-500 to-green-600'
                        },
                        'Corn': {
                          bg: 'from-yellow-50 to-amber-50',
                          border: 'border-yellow-200',
                          text: 'text-yellow-600',
                          gradient: 'from-yellow-500 to-amber-600'
                        },
                        'default': {
                          bg: 'from-violet-50 to-purple-50',
                          border: 'border-violet-200',
                          text: 'text-violet-600',
                          gradient: 'from-violet-500 to-purple-600'
                        }
                      };

                      return Object.entries(groupedByGrainType).map(([grainType, categories]) => {
                        const colors = grainTypeColors[grainType] || grainTypeColors['default'];
                        const sortedCategories = sortQualities(categories);
                        
                        // Calculate totals for this grain type
                        const totalDeposits = categories.reduce((sum, cat) => sum + (cat.deposit?.completed?.qty || 0), 0);
                        const totalWithdrawals = categories.reduce((sum, cat) => sum + (cat.withdraw?.completed || 0), 0);
                        const totalSales = categories.reduce((sum, cat) => sum + (cat.sell?.completed?.qty || 0), 0);
                        const totalAvailable = totalDeposits - totalWithdrawals - totalSales;

                        return (
                          <div key={grainType} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Grain Type Header */}
                            <div className={`p-5 bg-gradient-to-r ${colors.bg} border-b ${colors.border}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                                    <Wheat className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <h3 className={`text-xl font-bold ${colors.text}`}>{grainType}</h3>
                                    <p className="text-sm text-gray-600">{categories.length} quality variant{categories.length > 1 ? 's' : ''}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={`text-3xl font-bold ${colors.text}`}>{totalAvailable}</p>
                                  <p className="text-xs text-gray-500">Total Available Qtl</p>
                                </div>
                              </div>
                              
                              {/* Quick Stats */}
                              <div className="grid grid-cols-3 gap-3 mt-4">
                                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
                                  <p className="text-sm text-gray-600 mb-1">Deposits</p>
                                  <p className="text-lg font-bold text-gray-900">{totalDeposits}</p>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
                                  <p className="text-sm text-gray-600 mb-1">Withdrawals</p>
                                  <p className="text-lg font-bold text-gray-900">{totalWithdrawals}</p>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
                                  <p className="text-sm text-gray-600 mb-1">Sales</p>
                                  <p className="text-lg font-bold text-gray-900">{totalSales}</p>
                                </div>
                              </div>
                            </div>

                            {/* Quality Variants */}
                            <div className="p-6">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {sortedCategories.map((category, index) => {
                                  const availableQty = (category.deposit?.completed?.qty || 0) - 
                                                     (category.withdraw?.completed || 0) - 
                                                     (category.sell?.completed?.qty || 0);
                                  
                                  return (
                                    <div
                                      key={category.category_id || index}
                                      className="group p-5 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300"
                                    >
                                      {/* Header */}
                                      <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">{category.quality}</span>
                                          </div>
                                          <div>
                                            <h4 className="font-bold text-gray-900">Quality {category.quality}</h4>
                                            <span className="text-xs text-gray-500">
                                              {category.grain_type}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-2xl font-bold text-violet-600">{availableQty}</p>
                                          <p className="text-xs text-gray-500">Available Qtl</p>
                                        </div>
                                      </div>

                                      {/* Stats Grid */}
                                      <div className="grid grid-cols-2 gap-3">
                                        {/* Deposits */}
                                        <div className="bg-white rounded-xl p-3 border border-gray-100">
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-500">Deposits</span>
                                            <Package className="w-3.5 h-3.5 text-emerald-500" />
                                          </div>
                                          <p className="text-lg font-bold text-gray-900">{category.deposit?.completed?.qty || 0}</p>
                                          <p className="text-xs text-gray-500">₹{(category.deposit?.completed?.amount || 0).toLocaleString()}</p>
                                        </div>

                                        {/* Withdrawals */}
                                        <div className="bg-white rounded-xl p-3 border border-gray-100">
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-500">Withdrawals</span>
                                            <TrendingDown className="w-3.5 h-3.5 text-blue-500" />
                                          </div>
                                          <p className="text-lg font-bold text-gray-900">{category.withdraw?.completed || 0}</p>
                                          <p className="text-xs text-gray-500">
                                            {category.withdraw?.pending || 0} pending
                                          </p>
                                        </div>

                                        {/* Sales */}
                                        <div className="bg-white rounded-xl p-3 border border-gray-100">
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-500">Sales</span>
                                            <Activity className="w-3.5 h-3.5 text-purple-500" />
                                          </div>
                                          <p className="text-lg font-bold text-gray-900">{category.sell?.completed?.qty || 0}</p>
                                          <p className="text-xs text-gray-500">₹{(category.sell?.completed?.amount || 0).toLocaleString()}</p>
                                        </div>

                                        {/* Loans */}
                                        <div className="bg-white rounded-xl p-3 border border-gray-100">
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-500">Loans</span>
                                            <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                                          </div>
                                          <p className="text-lg font-bold text-gray-900">{category.loan?.completed || 0}</p>
                                          <p className="text-xs text-gray-500">
                                            {category.loan?.pending || 0} pending
                                          </p>
                                        </div>
                                      </div>

                                      {/* Rejected Status */}
                                      {category.deposit?.rejected?.qty > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                          <div className="flex items-center gap-2 text-xs text-red-600">
                                            <XCircle className="w-3.5 h-3.5" />
                                            <span>
                                              {category.deposit?.rejected?.qty} deposits rejected (₹{category.deposit?.rejected?.amount?.toLocaleString()})
                                            </span>
                                          </div>
                                        </div>
                                      )}

                                      {/* Pending Status */}
                                      {(category.deposit?.pending?.qty > 0 || category.sell?.pending?.qty > 0 || category.withdraw?.pending > 0) && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                          <div className="flex items-center gap-2 text-xs text-amber-600">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>
                                              {category.deposit?.pending?.qty || 0} deposits, {category.sell?.pending?.qty || 0} sales, {category.withdraw?.pending || 0} withdrawals pending
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Inventory Data
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                    No grain inventory found for this warehouse. Start by adding grain deposits.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        </div>

      <style jsx>{`
        @keyframes modalSlide {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #c7d2fe, #a5b4fc);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #a5b4fc, #818cf8);
          background-clip: padding-box;
        }
      `}</style>
    </div>
  );
};

export default WarehouseDetailsModal;