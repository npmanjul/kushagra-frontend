"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit3,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  UserCog,
  Shield,
  Building2,
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  Activity,
  Star,
  Award,
  Target,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Grid3x3,
  List,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  RefreshCw,
  AlertCircle,
  Warehouse,
  Hash,
  UserCheck,
  UserX,
  HardHat,
  Wrench,
  Package,
  ClipboardList,
} from "lucide-react";
import StaffViewModal from "@/components/admin/StaffViewModal";
import StaffEditModal from "@/components/admin/StaffEditModal";
import API_BASE_URL from "@/utils/constants";

const Page = () => {
  // State Management
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [viewType, setViewType] = useState("table");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch staff from API
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/warehouse/allstaff`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();

      if (result.success) {
        setStaff(result.data || []);
      } else {
        setError(result.message || "Failed to fetch staff");
      }
    } catch (err) {
      setError("Failed to fetch staff. Please try again.");
      console.error("Error fetching staff:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsViewModalOpen(true);
  };

  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedData) => {
    // Update the local state with the updated data
    setStaff((prev) =>
      prev.map((s) =>
        s._id === updatedData._id ? { ...s, ...updatedData } : s
      )
    );
    setIsEditModalOpen(false);
  };

  const handleToggleStatus = async (staffId, currentStatus) => {
    try {
      // API call to toggle status would go here
      setStaff((prev) =>
        prev.map((s) =>
          s._id === staffId ? { ...s, is_active: !currentStatus } : s
        )
      );
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  // Filter staff
  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.employee_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone?.includes(searchQuery) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.warehouse_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.warehouse_location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.designation?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && s.is_active) ||
      (statusFilter === "inactive" && !s.is_active) ||
      (statusFilter === "on_duty" && s.is_on_duty) ||
      (statusFilter === "off_duty" && !s.is_on_duty);

    const matchesRole =
      roleFilter === "all" ||
      s.designation?.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique designations for filter
  const designations = [...new Set(staff.map((s) => s.designation).filter(Boolean))];

  // Calculate stats
  const stats = [
    {
      label: "Total Staff",
      value: staff.length,
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      change: `${staff.length}`,
      trend: "neutral",
    },
    {
      label: "Active",
      value: staff.filter((s) => s.is_active).length,
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      change: `${Math.round((staff.filter((s) => s.is_active).length / staff.length) * 100) || 0}%`,
      trend: "up",
    },
    {
      label: "On Duty",
      value: staff.filter((s) => s.is_on_duty).length,
      icon: HardHat,
      color: "from-orange-500 to-amber-600",
      bgColor: "bg-orange-50",
      change: `${staff.filter((s) => s.is_on_duty).length}`,
      trend: "up",
    },
    {
      label: "Available",
      value: staff.filter((s) => !s.is_on_duty && s.is_active).length,
      icon: UserCheck,
      color: "from-teal-500 to-cyan-600",
      bgColor: "bg-teal-50",
      change: `${staff.filter((s) => !s.is_on_duty && s.is_active).length}`,
      trend: "neutral",
    },
  ];

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get status badge
  const getStatusBadge = (isActive, isOnDuty) => {
    if (!isActive) {
      return {
        label: "Inactive",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
        dotColor: "bg-gray-400",
      };
    }
    if (isOnDuty) {
      return {
        label: "On Duty",
        bgColor: "bg-orange-100",
        textColor: "text-orange-700",
        dotColor: "bg-orange-500",
      };
    }
    return {
      label: "Available",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      dotColor: "bg-green-500",
    };
  };

  // Get designation badge color
  const getDesignationColor = (designation) => {
    const colors = {
      "picker": "bg-blue-100 text-blue-700",
      "packer": "bg-purple-100 text-purple-700",
      "loader": "bg-amber-100 text-amber-700",
      "forklift_operator": "bg-red-100 text-red-700",
      "inventory_clerk": "bg-cyan-100 text-cyan-700",
      "quality_checker": "bg-green-100 text-green-700",
      "default": "bg-gray-100 text-gray-700",
    };
    return colors[designation?.toLowerCase()] || colors.default;
  };

  // Staff Card Component
  const StaffCard = ({ staffMember }) => {
    const status = getStatusBadge(staffMember.is_active, staffMember.is_on_duty);
    const designationColor = getDesignationColor(staffMember.designation);

    return (
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:border-cyan-200 transition-all duration-300 group">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                <img
                  src={staffMember.photo}
                  alt={staffMember.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${staffMember.name}&background=random&size=256`;
                  }}
                />
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  staffMember.is_active ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                {staffMember.name}
                {staffMember.is_active && staffMember.is_on_duty && (
                  <HardHat className="w-4 h-4 text-orange-500" />
                )}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                {staffMember.employee_id}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bgColor} ${status.textColor}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${status.dotColor} animate-pulse`}
            />
            {status.label}
          </span>
        </div>

        {/* Designation Badge */}
        {staffMember.designation && (
          <div className="mb-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${designationColor}`}>
              <Wrench className="w-3 h-3" />
              {staffMember.designation.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
        )}

        {/* Warehouse Info */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-cyan-600" />
            <span className="text-sm font-medium text-gray-800">
              {staffMember.warehouse_name || "Not Assigned"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <MapPin className="w-3 h-3" />
            {staffMember.warehouse_location || "N/A"}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="p-1.5 bg-gray-100 rounded-lg">
              <Phone className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <span className="truncate">{staffMember.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="p-1.5 bg-gray-100 rounded-lg">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <span className="truncate text-xs">{staffMember.email}</span>
          </div>
        </div>

        {/* Supervisor Info */}
        {staffMember.supervisor_name && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 pb-3 border-b border-gray-100">
            <UserCog className="w-3.5 h-3.5" />
            <span>Reports to: <span className="font-medium text-gray-700">{staffMember.supervisor_name}</span></span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => handleView(staffMember)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm font-medium group-hover:shadow-sm"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={() => handleEdit(staffMember)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-200 transition-all duration-200 text-sm font-medium"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-cyan-200 rounded-full animate-spin border-t-cyan-600 mx-auto" />
            <Users className="w-6 h-6 text-cyan-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading staff...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error && staff.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Staff
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchStaff}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="p-2 sm:p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg shadow-cyan-200">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Staff Management
              </h1>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-pulse" />
            </div>
            <p className="text-gray-500 text-xs sm:text-sm ml-0 sm:ml-14">
              Manage and monitor all warehouse staff members
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden p-2 bg-white border border-gray-200 rounded-lg"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={fetchStaff}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-gray-600 text-xs sm:text-sm font-medium shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-gray-600 text-xs sm:text-sm font-medium shadow-sm flex-1 sm:flex-initial">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button className="flex items-center justify-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-cyan-200 transition-all duration-300 text-xs sm:text-sm font-semibold flex-1 sm:flex-initial">
              <Plus className="w-4 h-4" />
              <span>Add Staff</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="sm:hidden bg-white rounded-xl shadow-lg border border-gray-100 p-4 space-y-3 animate-in slide-in-from-top duration-200">
            <button
              onClick={() => {
                setShowFilters(!showFilters);
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700"
            >
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">View Type</span>
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewType("table")}
                  className={`p-1.5 rounded ${
                    viewType === "table" ? "bg-white shadow-sm" : ""
                  }`}
                >
                  <List className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setViewType("grid")}
                  className={`p-1.5 rounded ${
                    viewType === "grid" ? "bg-white shadow-sm" : ""
                  }`}
                >
                  <Grid3x3 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg sm:rounded-2xl p-3 sm:p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-br from-gray-50 to-transparent rounded-full -translate-y-8 sm:-translate-y-16 translate-x-8 sm:translate-x-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div
                    className={`p-2 sm:p-3 bg-gradient-to-br ${stat.color} rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs ${
                      stat.trend === "up"
                        ? "text-green-600"
                        : stat.trend === "down"
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {stat.trend === "up" && <ArrowUpRight className="w-3 h-3" />}
                    {stat.trend === "down" && <ArrowDownRight className="w-3 h-3" />}
                    <span className="font-medium">{stat.change}</span>
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID, phone, email, warehouse, designation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm"
              />
            </div>

            {/* Filter Buttons - Desktop */}
            <div className="hidden sm:flex items-center gap-2">
              {["all", "active", "inactive", "on_duty", "off_duty"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg capitalize transition-all duration-200 ${
                      statusFilter === status
                        ? "bg-cyan-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {status.replace(/_/g, " ")}
                  </button>
                )
              )}
            </div>

            {/* Role Filter - Desktop */}
            {designations.length > 0 && (
              <div className="hidden lg:block">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  {designations.map((d) => (
                    <option key={d} value={d}>
                      {d.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm font-medium"
            >
              <Filter className="w-4 h-4" />
              Filters
              {(statusFilter !== "all" || roleFilter !== "all") && (
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
              )}
            </button>

            {/* View Type Toggle - Desktop */}
            <div className="hidden lg:flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewType("table")}
                className={`p-1.5 rounded transition-all ${
                  viewType === "table"
                    ? "bg-white shadow-sm text-cyan-600"
                    : "text-gray-600"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewType("grid")}
                className={`p-1.5 rounded transition-all ${
                  viewType === "grid"
                    ? "bg-white shadow-sm text-cyan-600"
                    : "text-gray-600"
                }`}
                title="Grid View"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="sm:hidden mt-3 pt-3 border-t border-gray-100 animate-in slide-in-from-top duration-200 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-medium">
                  Filter by status:
                </span>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["all", "active", "inactive", "on_duty", "off_duty"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all duration-200 ${
                        statusFilter === status
                          ? "bg-cyan-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {status.replace(/_/g, " ")}
                    </button>
                  )
                )}
              </div>
              {designations.length > 0 && (
                <>
                  <div className="text-xs text-gray-500 font-medium mt-2">
                    Filter by role:
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setRoleFilter("all")}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                        roleFilter === "all"
                          ? "bg-cyan-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      All Roles
                    </button>
                    {designations.map((d) => (
                      <button
                        key={d}
                        onClick={() => setRoleFilter(d)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                          roleFilter === d
                            ? "bg-cyan-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {d.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {paginatedStaff.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {filteredStaff.length}
            </span>{" "}
            staff members
          </p>
          {(statusFilter !== "all" || roleFilter !== "all") && (
            <button
              onClick={() => {
                setStatusFilter("all");
                setRoleFilter("all");
              }}
              className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
            >
              Clear filters
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Desktop Table View */}
        {viewType === "table" && (
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Staff Member
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Designation
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Warehouse
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedStaff.map((staffMember) => {
                    const status = getStatusBadge(
                      staffMember.is_active,
                      staffMember.is_on_duty
                    );
                    const designationColor = getDesignationColor(staffMember.designation);
                    return (
                      <tr
                        key={staffMember._id}
                        className="hover:bg-gradient-to-r hover:from-cyan-50/30 hover:to-white transition-all duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-11 h-11 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-200">
                                <img
                                  src={staffMember.photo}
                                  alt={staffMember.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${staffMember.name}&background=random&size=256`;
                                  }}
                                />
                              </div>
                              <div
                                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                  staffMember.is_active
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                                }`}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                                {staffMember.name}
                                {staffMember.is_active && staffMember.is_on_duty && (
                                  <HardHat className="w-4 h-4 text-orange-500" />
                                )}
                              </p>
                              <p className="text-xs text-gray-500 font-mono">
                                {staffMember.employee_id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {staffMember.designation ? (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${designationColor}`}>
                              <Wrench className="w-3 h-3" />
                              {staffMember.designation.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Not Assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-cyan-50 rounded-lg">
                              <Building2 className="w-4 h-4 text-cyan-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {staffMember.warehouse_name || "Not Assigned"}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="w-3 h-3" />
                                {staffMember.warehouse_location || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              {staffMember.phone}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Mail className="w-3 h-3 text-gray-400" />
                              {staffMember.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bgColor} ${status.textColor}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${status.dotColor} animate-pulse`}
                              />
                              {status.label}
                            </span>
                            {staffMember.supervisor_name && (
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <UserCog className="w-3 h-3" />
                                {staffMember.supervisor_name}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(staffMember)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-xs font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                            <button
                              onClick={() => handleEdit(staffMember)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-md hover:shadow-cyan-200 transition-all duration-200 text-xs font-semibold"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Page{" "}
                  <span className="font-semibold text-gray-700">{currentPage}</span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-700">{totalPages}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? "bg-cyan-600 text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Grid View */}
        {viewType === "grid" && (
          <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedStaff.map((staffMember) => (
              <StaffCard key={staffMember._id} staffMember={staffMember} />
            ))}
          </div>
        )}

        {/* Mobile View - Always Cards */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paginatedStaff.map((staffMember) => (
            <StaffCard key={staffMember._id} staffMember={staffMember} />
          ))}
        </div>

        {/* Empty State */}
        {filteredStaff.length === 0 && !loading && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No staff members found
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {searchQuery || statusFilter !== "all" || roleFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No staff members have been added yet"}
            </p>
            {(searchQuery || statusFilter !== "all" || roleFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setRoleFilter("all");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Mobile Pagination */}
        {filteredStaff.length > 0 && totalPages > 1 && (
          <div className="lg:hidden bg-white rounded-xl p-3 border border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Page <span className="font-semibold text-gray-700">{currentPage}</span>{" "}
                of <span className="font-semibold text-gray-700">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 bg-cyan-600 text-white text-sm font-medium rounded-lg">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      <StaffViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        staffId={selectedStaff?._id}
      />

      {/* Edit Modal */}
      <StaffEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        staffId={selectedStaff?._id}
        onSave={handleSave}
      />
    </>
  );
};

export default Page;