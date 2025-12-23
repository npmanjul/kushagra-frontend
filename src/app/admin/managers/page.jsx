"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit3,
  Users,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Grid3X3,
  List,
  Warehouse,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Building2,
  BadgeCheck,
  Clock,
  Zap,
  TrendingUp,
  Activity,
  Shield,
  Star,
  LayoutGrid,
  TableProperties,
} from "lucide-react";
import axios from "axios";
import API_BASE_URL from "@/utils/constants";
import ManagerViewModal from "@/components/admin/ManagerViewModal";
import ManagerEditModal from "@/components/admin/ManagerEditModal";


const Page = () => {
  // State management
  const [managers, setManagers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [engagementFilter, setEngagementFilter] = useState("all");
  const [viewType, setViewType] = useState("table");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 10;

  // Fetch managers from API
  const fetchManagers = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/warehouse/allmanager`);
      
      if (response.data.success) {
        setManagers(response.data.data || []);
      } else {
        setError(response.data.message || "Failed to fetch managers");
      }
    } catch (err) {
      console.error("Error fetching managers:", err);
      setError(err.response?.data?.message || "Failed to connect to server");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  const handleView = (manager) => {
    setSelectedManager(manager);
    setIsViewModalOpen(true);
  };

  const handleEdit = (manager) => {
    setSelectedManager(manager);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedData) => {
    // Save logic here
    await fetchManagers(true);
    setIsEditModalOpen(false);
  };

  // Filter managers
  const filteredManagers = managers.filter((mgr) => {
    const matchesSearch =
      mgr.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mgr.employee_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mgr.phone?.includes(searchQuery) ||
      mgr.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mgr.warehouse_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mgr.warehouse_location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || 
      (statusFilter === "active" && mgr.is_active) ||
      (statusFilter === "inactive" && !mgr.is_active);
    
    const matchesEngagement =
      engagementFilter === "all" ||
      (engagementFilter === "engaged" && mgr.is_engaged) ||
      (engagementFilter === "available" && !mgr.is_engaged);
    
    return matchesSearch && matchesStatus && matchesEngagement;
  });

  // Pagination
  const totalPages = Math.ceil(filteredManagers.length / itemsPerPage);
  const paginatedManagers = filteredManagers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    total: managers.length,
    active: managers.filter(m => m.is_active).length,
    engaged: managers.filter(m => m.is_engaged).length,
    available: managers.filter(m => !m.is_engaged && m.is_active).length,
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Stats Card Component
  const StatsCard = ({ icon: Icon, label, value, color, gradient }) => (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-4 sm:p-5 shadow-lg border border-white/20`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-6 -translate-x-6"></div>
      <div className="relative">
        <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-sm mb-3`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-white/80 text-xs sm:text-sm font-medium">{label}</p>
      </div>
    </div>
  );

  // Manager Card Component
  const ManagerCard = ({ manager }) => (
    <div className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:border-violet-200 transition-all duration-500 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {manager.photo ? (
              <img
                src={manager.photo}
                alt={manager.name}
                className="w-14 h-14 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
                {getInitials(manager.name)}
              </div>
            )}
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              manager.is_active ? 'bg-emerald-500' : 'bg-gray-400'
            }`}></div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">
              {manager.name}
            </p>
            <p className="text-xs text-gray-500 font-medium">{manager.employee_id}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            manager.is_active
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {manager.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            {manager.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Warehouse Info */}
      {manager.is_engaged && manager.warehouse_name ? (
        <div className="mb-4 p-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
          <div className="flex items-center gap-2 mb-1">
            <Warehouse className="w-4 h-4 text-violet-600" />
            <span className="text-xs font-semibold text-violet-700">Assigned Warehouse</span>
          </div>
          <p className="text-sm font-medium text-gray-900">{manager.warehouse_name}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />
            {manager.warehouse_location}
          </p>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">Available for Assignment</span>
          </div>
        </div>
      )}

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="p-1.5 bg-gray-100 rounded-lg">
            <Phone className="w-3 h-3 text-gray-500" />
          </div>
          <span>{manager.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="p-1.5 bg-gray-100 rounded-lg">
            <Mail className="w-3 h-3 text-gray-500" />
          </div>
          <span className="truncate">{manager.email}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => handleView(manager)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm font-medium group-hover:bg-gray-200"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={() => handleEdit(manager)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-200 transition-all duration-300 text-sm font-medium"
        >
          <Edit3 className="w-4 h-4" />
          Edit
        </button>
      </div>
    </div>
  );

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-violet-100 rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading managers...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Managers</h3>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => fetchManagers()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
        {/* Decorative Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-6">
            <div className="w-full lg:w-auto">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="p-3 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-2xl shadow-lg shadow-violet-200">
                    <UserCog className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-violet-800 to-purple-900 bg-clip-text text-transparent">
                    Manager Hub
                  </h1>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Manage warehouse managers and their assignments
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto">
              <button
                onClick={() => fetchManagers(true)}
                disabled={isRefreshing}
                className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-gray-600 text-sm font-medium shadow-sm">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-200 transition-all duration-300 text-sm font-semibold flex-1 lg:flex-initial">
                <Plus className="w-4 h-4" />
                <span>Add Manager</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatsCard
              icon={Users}
              label="Total Managers"
              value={stats.total}
              gradient="from-violet-500 to-purple-600"
            />
            <StatsCard
              icon={Activity}
              label="Active"
              value={stats.active}
              gradient="from-emerald-500 to-teal-600"
            />
            <StatsCard
              icon={Building2}
              label="Assigned"
              value={stats.engaged}
              gradient="from-blue-500 to-indigo-600"
            />
            <StatsCard
              icon={Clock}
              label="Available"
              value={stats.available}
              gradient="from-amber-500 to-orange-600"
            />
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/80 p-4 sm:p-5">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, ID, email, warehouse..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Status Filter */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {["all", "active", "inactive"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg capitalize transition-all duration-200 ${
                        statusFilter === status
                          ? "bg-white text-violet-700 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {/* Engagement Filter */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {["all", "engaged", "available"].map((engagement) => (
                    <button
                      key={engagement}
                      onClick={() => setEngagementFilter(engagement)}
                      className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg capitalize transition-all duration-200 ${
                        engagementFilter === engagement
                          ? "bg-white text-violet-700 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {engagement}
                    </button>
                  ))}
                </div>

                {/* View Toggle */}
                <div className="hidden lg:flex bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewType("table")}
                    className={`p-2 rounded-lg transition-all ${
                      viewType === "table"
                        ? "bg-white text-violet-600 shadow-sm"
                        : "text-gray-600"
                    }`}
                    title="Table View"
                  >
                    <TableProperties className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewType("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewType === "grid"
                        ? "bg-white text-violet-600 shadow-sm"
                        : "text-gray-600"
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(statusFilter !== "all" || engagementFilter !== "all" || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-100 text-violet-700 rounded-lg text-xs font-medium">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="hover:bg-violet-200 rounded p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-100 text-violet-700 rounded-lg text-xs font-medium capitalize">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter("all")} className="hover:bg-violet-200 rounded p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {engagementFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-100 text-violet-700 rounded-lg text-xs font-medium capitalize">
                    {engagementFilter}
                    <button onClick={() => setEngagementFilter("all")} className="hover:bg-violet-200 rounded p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setEngagementFilter("all");
                  }}
                  className="text-xs text-violet-600 hover:text-violet-800 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Table View */}
          {viewType === "table" && (
            <div className="hidden lg:block bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100/80 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Manager
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Warehouse Assignment
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedManagers.map((manager) => (
                      <tr
                        key={manager._id}
                        className="hover:bg-gradient-to-r hover:from-violet-50/50 hover:to-white transition-all duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              {manager.photo ? (
                                <img
                                  src={manager.photo}
                                  alt={manager.name}
                                  className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-all"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm group-hover:shadow-md transition-all">
                                  {getInitials(manager.name)}
                                </div>
                              )}
                              <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                manager.is_active ? 'bg-emerald-500' : 'bg-gray-400'
                              }`}></div>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">
                                {manager.name}
                              </p>
                              <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                <BadgeCheck className="w-3 h-3 text-violet-500" />
                                {manager.employee_id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              {manager.phone}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Mail className="w-3 h-3 text-gray-400" />
                              {manager.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${
                              manager.is_active
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {manager.is_active ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5" />
                              )}
                              {manager.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${
                              manager.is_engaged
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {manager.is_engaged ? (
                                <Building2 className="w-3.5 h-3.5" />
                              ) : (
                                <Clock className="w-3.5 h-3.5" />
                              )}
                              {manager.is_engaged ? 'Engaged' : 'Available'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {manager.is_engaged && manager.warehouse_name ? (
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl">
                                <Warehouse className="w-5 h-5 text-violet-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  {manager.warehouse_name}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {manager.warehouse_location}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-amber-600">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-medium">Not Assigned</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(manager)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-xs font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                            <button
                              onClick={() => handleEdit(manager)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:shadow-md hover:shadow-violet-200 transition-all duration-200 text-xs font-semibold"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination */}
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50/50 to-white border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-700">
                    {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, filteredManagers.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-700">
                    {filteredManagers.length}
                  </span>{" "}
                  managers
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
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
                          className={`w-8 h-8 text-sm font-medium rounded-lg transition-all ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid View */}
          {viewType === "grid" && (
            <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedManagers.map((manager) => (
                <ManagerCard key={manager._id} manager={manager} />
              ))}
            </div>
          )}

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {paginatedManagers.map((manager) => (
              <ManagerCard key={manager._id} manager={manager} />
            ))}
          </div>

          {/* Empty State */}
          {filteredManagers.length === 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 sm:p-16 text-center border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <UserCog className="w-10 h-10 text-violet-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No managers found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                We couldn't find any managers matching your search criteria. Try adjusting your filters or add a new manager.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setEngagementFilter("all");
                  }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Clear Filters
                </button>
                <button className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-semibold flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Manager
                </button>
              </div>
            </div>
          )}

          {/* Mobile Pagination */}
          {filteredManagers.length > 0 && (
            <div className="lg:hidden bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Page <span className="font-semibold text-gray-700">{currentPage}</span> of{" "}
                  <span className="font-semibold text-gray-700">{totalPages || 1}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid Pagination */}
          {viewType === "grid" && filteredManagers.length > 0 && (
            <div className="hidden lg:flex items-center justify-center gap-2 py-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="flex items-center gap-1 mx-4">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 text-sm font-medium rounded-xl transition-all ${
                      currentPage === i + 1
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      <ManagerViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        managerId={selectedManager?._id}
      />

      {/* Edit Modal */}
      <ManagerEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        managerId={selectedManager?._id}
        onSave={handleSave}
      />
    </>
  );
};

export default Page;