"use client";
import FarmerApproval from "@/components/admin/FarmerApproval";
import ProfileViewModal from "@/components/admin/ProfileViewModal";
import EditProfileModal from "@/components/admin/EditProfileModal";
import API_BASE_URL from "@/utils/constants";
import {
  Search,
  Plus,
  Users,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit3,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Sparkles,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  UserCheck,
  UserX,
  UserCog,
  ImageOff,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const getStatusConfig = (status) => {
  switch (status) {
    case "approved":
      return {
        bg: "bg-gradient-to-r from-emerald-50 to-green-50",
        text: "text-emerald-700",
        border: "border-emerald-200/60",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        label: "Approved",
        dot: "bg-emerald-500",
        glow: "shadow-emerald-100",
      };
    case "pending":
      return {
        bg: "bg-gradient-to-r from-amber-50 to-yellow-50",
        text: "text-amber-700",
        border: "border-amber-200/60",
        icon: <Clock className="w-3.5 h-3.5" />,
        label: "Pending",
        dot: "bg-amber-500",
        glow: "shadow-amber-100",
      };
    case "rejected":
      return {
        bg: "bg-gradient-to-r from-red-50 to-rose-50",
        text: "text-red-700",
        border: "border-red-200/60",
        icon: <XCircle className="w-3.5 h-3.5" />,
        label: "Rejected",
        dot: "bg-red-500",
        glow: "shadow-red-100",
      };
    default:
      return {
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
        icon: null,
        label: status,
        dot: "bg-gray-500",
        glow: "",
      };
  }
};

const getInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const FarmerAvatar = ({ farmer, size = "md" }) => {
  const [imageError, setImageError] = useState(false);
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-14 h-14 text-base",
  };

  if (farmer.user_image && !imageError) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl overflow-hidden ring-2 ring-white shadow-lg relative`}
      >
        <Image
          src={farmer.user_image}
          alt={farmer.name}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white`}
    >
      {getInitials(farmer.name)}
    </div>
  );
};

const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-100 rounded" />
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 w-28 bg-gray-200 rounded" />
        </td>
        <td className="px-6 py-4">
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
        </td>
        <td className="px-6 py-4">
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </td>
        <td className="px-6 py-4">
          <div className="flex gap-2 justify-end">
            <div className="h-8 w-16 bg-gray-200 rounded-lg" />
            <div className="h-8 w-16 bg-gray-200 rounded-lg" />
          </div>
        </td>
      </tr>
    ))}
  </>
);

const EmptyState = ({ onRefresh }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mb-4">
      <Users className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      No Farmers Found
    </h3>
    <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
      There are no farmers matching your criteria. Try adjusting your filters or
      add a new farmer.
    </p>
    <div className="flex gap-3">
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        Refresh
      </button>
      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all">
        <Plus className="w-4 h-4" />
        Add Farmer
      </button>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center mb-4">
      <AlertCircle className="w-10 h-10 text-red-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Something went wrong
    </h3>
    <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
      {error || "Failed to load farmers. Please try again."}
    </p>
    <button
      onClick={onRetry}
      className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all"
    >
      <RefreshCw className="w-4 h-4" />
      Try Again
    </button>
  </div>
);

const Page = () => {
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [farmers, setFarmers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFarmers = useCallback(
    async (page = 1, search = "", status = "all") => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
        });

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/user/getallfarmers?${params}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setFarmers(data.farmers);
          setPagination(data.pagination);
        } else {
          throw new Error(data.message || "Failed to fetch farmers");
        }
      } catch (err) {
        console.error("Error fetching farmers:", err);
        setError(err.message || "Failed to fetch farmers");
        setFarmers([]);
        setPagination({
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          limit: 10,
          hasNextPage: false,
          hasPrevPage: false,
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchFarmers(pagination.currentPage, searchQuery, statusFilter);
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchFarmers(1, e.target.value, statusFilter);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    fetchFarmers(1, searchQuery, status);
  };

  const handlePageChange = (newPage) => {
    fetchFarmers(newPage, searchQuery, statusFilter);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFarmers(pagination.currentPage, searchQuery, statusFilter);
  };

  const handleSubmit = (verificationData) => {
    console.log("Verification submitted:", verificationData);
    setIsApprovalModalOpen(false);
    handleRefresh();
  };

  const handleVerify = (farmer) => {
    console.log("Verification requested:", farmer);
    setSelectedFarmer(farmer);
    setIsApprovalModalOpen(true);
  };

  const handleView = (farmer) => {
    setSelectedFarmer(farmer);
    setIsViewModalOpen(true);
  };

  const handleEdit = (farmer) => {
    setSelectedFarmer(farmer);
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedData) => {
    console.log("Farmer profile updated:", updatedData);
    setIsEditModalOpen(false);
    handleRefresh();
  };

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.phone_number?.includes(searchQuery) ||
      farmer.farmerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer._id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || farmer.overallStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: "Total Farmers",
      value: pagination.totalCount,
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Approved",
      value: farmers.filter((f) => f.overallStatus === "approved").length,
      icon: UserCheck,
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Pending",
      value: farmers.filter((f) => f.overallStatus === "pending").length,
      icon: Clock,
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Rejected",
      value: farmers.filter((f) => f.overallStatus === "rejected").length,
      icon: UserX,
      color: "from-red-500 to-rose-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  const statusTabs = [
    { key: "all", label: "All", count: pagination.totalCount },
    {
      key: "approved",
      label: "Approved",
      count: farmers.filter((f) => f.overallStatus === "approved").length,
    },
    {
      key: "pending",
      label: "Pending",
      count: farmers.filter((f) => f.overallStatus === "pending").length,
    },
    {
      key: "rejected",
      label: "Rejected",
      count: farmers.filter((f) => f.overallStatus === "rejected").length,
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-indigo-200/50">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 bg-clip-text text-transparent">
                    Farmer Management
                  </h1>
                  <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                </div>
                <p className="text-gray-500 text-sm mt-0.5">
                  Manage and verify all registered farmers
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-gray-600 text-sm font-medium shadow-sm disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-gray-600 text-sm font-medium shadow-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-200/50 hover:-translate-y-0.5 transition-all duration-300 text-sm font-semibold">
              <Plus className="w-4 h-4" />
              Add Farmer
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-100/80 hover:shadow-lg hover:border-gray-200/80 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-3.5 bg-gradient-to-br ${stat.color} rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${
                    stat.color.includes("emerald")
                      ? "bg-emerald-500"
                      : stat.color.includes("amber")
                      ? "bg-amber-500"
                      : stat.color.includes("red")
                      ? "bg-red-500"
                      : "bg-blue-500"
                  } animate-pulse`}
                />
                <span className="text-xs text-gray-500">Live data</span>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/80 p-4 md:p-5">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or phone..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all duration-200 text-sm"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 text-gray-600 text-sm font-medium">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center bg-gray-100/80 rounded-xl p-1">
              {statusTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleStatusFilter(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all duration-200 ${
                    statusFilter === tab.key
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-md ${
                      statusFilter === tab.key
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50/80 to-gray-100/50 border-b border-gray-200/80">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Farmer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/80">
                {loading ? (
                  <TableSkeleton />
                ) : error ? (
                  <tr>
                    <td colSpan={5}>
                      <ErrorState error={error} onRetry={handleRefresh} />
                    </td>
                  </tr>
                ) : filteredFarmers.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState onRefresh={handleRefresh} />
                    </td>
                  </tr>
                ) : (
                  filteredFarmers.map((farmer, index) => {
                    const statusConfig = getStatusConfig(farmer.overallStatus);
                    return (
                      <tr
                        key={farmer._id}
                        className="hover:bg-gradient-to-r hover:from-indigo-50/30 hover:via-purple-50/20 hover:to-pink-50/30 transition-all duration-300 group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <FarmerAvatar farmer={farmer} size="md" />
                              <div
                                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${statusConfig.dot}`}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {farmer.name}
                              </p>
                              <p className="text-xs text-gray-500 font-mono mt-0.5">
                                {farmer.farmerId ||
                                  `ID: ${farmer._id.slice(-8).toUpperCase()}`}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-indigo-100 transition-colors">
                              <Phone className="w-4 h-4 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                +91{" "}
                                {farmer.phone_number.replace(
                                  /(\d{5})(\d{5})/,
                                  "$1 $2"
                                )}
                              </p>
                              <p className="text-xs text-gray-500">Mobile</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} shadow-sm ${statusConfig.glow}`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`}
                            />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                              farmer.is_active !== false
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                farmer.is_active !== false
                                  ? "bg-emerald-500"
                                  : "bg-gray-400"
                              }`}
                            />
                            {farmer.is_active !== false ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {/* Pending: Only Verify button */}
                            {farmer.overallStatus === "pending" && (
                              <button
                                onClick={() => handleVerify(farmer)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg hover:shadow-amber-200/50 hover:-translate-y-0.5 transition-all duration-200 text-xs font-semibold"
                              >
                                <ShieldCheck className="w-4 h-4" />
                                Verify
                              </button>
                            )}

                            {/* Rejected: View and Recheck buttons */}
                            {farmer.overallStatus === "rejected" && (
                              <>
                                <button
                                  onClick={() => handleView(farmer)}
                                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-xs font-semibold"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                              </>
                            )}

                            {/* Approved: View and Edit buttons */}
                            {farmer.overallStatus === "approved" && (
                              <>
                                <button
                                  onClick={() => handleView(farmer)}
                                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-xs font-semibold"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                                <button
                                  onClick={() => handleEdit(farmer)}
                                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-200/50 hover:-translate-y-0.5 transition-all duration-200 text-xs font-semibold"
                                >
                                  <Edit3 className="w-4 h-4" />
                                  Edit
                                </button>
                              </>
                            )}

                            {/* More options dropdown */}
                            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          {!loading && filteredFarmers.length > 0 && (
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50/50 to-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {(pagination.currentPage - 1) * pagination.limit + 1} -{" "}
                  {Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.totalCount
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {pagination.totalCount}
                </span>{" "}
                farmers
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 text-sm font-medium rounded-xl transition-all duration-200 ${
                        pagination.currentPage === page
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200/50"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Farmer Approval Modal - for Verify action */}
      {selectedFarmer && (
        <FarmerApproval
          isOpen={isApprovalModalOpen}
          onClose={() => setIsApprovalModalOpen(false)}
          onVerificationComplete={handleSubmit}
          farmerId={selectedFarmer?._id}
        />
      )}

      {/* Profile View Modal - for View action */}
      <ProfileViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        farmerId={selectedFarmer?._id}
      />

      {/* Edit Profile Modal - for Edit action */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        farmerId={selectedFarmer?._id}
        onSave={handleSave}
      />
    </>
  );
};

export default Page;
