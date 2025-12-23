"use client";
import React, { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  MapPin,
  Package,
  Users,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  RefreshCw,
  Warehouse,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowUpDown,
  Download,
  Calendar,
  Mail,
  Phone,
  User,
  Shield,
  UserCog,
} from "lucide-react";
import API_BASE_URL from "@/utils/constants";
import toast from "react-hot-toast";
import WarehouseModal from "../../../components/admin/WarehouseModal";
import WarehouseDetailsModal from "../../../components/admin/WarehouseDetailsModal";

const WarehousePage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [managers, setManagers] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch data
  useEffect(() => {
    fetchWarehouses();
    fetchUsers();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchWarehouses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/warehouse/allwarehouse`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setWarehouses(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch warehouses");
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      toast.error("Failed to fetch warehouses");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const [managersRes, supervisorsRes, staffRes] = await Promise.all([
        fetch(`${API_BASE_URL}/warehouse/allmanager`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        fetch(`${API_BASE_URL}/warehouse/allsupervisor`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        fetch(`${API_BASE_URL}/warehouse/allstaff`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
      ]);

      const [managersData, supervisorsData, staffData] = await Promise.all([
        managersRes.json(),
        supervisorsRes.json(),
        staffRes.json(),
      ]);

      setManagers(managersData.data || []);
      setSupervisors(supervisorsData.data || []);
      setStaff(staffData.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleViewDetails = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsDetailsModalOpen(true);
    setActiveDropdown(null);
  };

  const handleDeleteWarehouse = async (warehouseId) => {
    if (!confirm("Are you sure you want to delete this warehouse?")) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/warehouse/${warehouseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        toast.success("Warehouse deleted successfully");
        fetchWarehouses();
      } else {
        toast.error("Failed to delete warehouse");
      }
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      toast.error("Something went wrong");
    }
    setActiveDropdown(null);
  };

  const getCapacityStatus = (used, total) => {
    const percentage = total > 0 ? (used / total) * 100 : 0;
    if (percentage >= 90)
      return {
        color: "rose",
        bg: "from-rose-500 to-pink-600",
        light: "bg-rose-100",
        text: "text-rose-600",
      };
    if (percentage >= 70)
      return {
        color: "amber",
        bg: "from-amber-500 to-orange-600",
        light: "bg-amber-100",
        text: "text-amber-600",
      };
    if (percentage >= 40)
      return {
        color: "blue",
        bg: "from-blue-500 to-indigo-600",
        light: "bg-blue-100",
        text: "text-blue-600",
      };
    return {
      color: "emerald",
      bg: "from-emerald-500 to-teal-600",
      light: "bg-emerald-100",
      text: "text-emerald-600",
    };
  };

  // Get total team count for a warehouse
  const getTeamCount = (warehouse) => {
    let count = 0;
    if (warehouse.manager) count++;
    if (warehouse.supervisor) count++;
    if (warehouse.staff?.length) count += warehouse.staff.length;
    return count;
  };

  // Get team members array for display
  const getTeamMembers = (warehouse) => {
    const members = [];
    if (warehouse.manager) {
      members.push({
        ...warehouse.manager,
        roleLabel: "Manager",
        roleColor: "from-violet-500 to-purple-600",
      });
    }
    if (warehouse.supervisor) {
      members.push({
        ...warehouse.supervisor,
        roleLabel: "Supervisor",
        roleColor: "from-blue-500 to-indigo-600",
      });
    }
    if (warehouse.staff?.length) {
      warehouse.staff.forEach((s) => {
        members.push({
          ...s,
          roleLabel: "Staff",
          roleColor: "from-emerald-500 to-teal-600",
        });
      });
    }
    return members;
  };

  const filteredWarehouses = warehouses.filter(
    (w) =>
      w.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.manager?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: warehouses.length,
    active: warehouses.length, // All are active based on response
    totalCapacity: warehouses.reduce(
      (sum, w) => sum + (w.capacity_quintal || 0),
      0
    ),
    usedCapacity: warehouses.reduce(
      (sum, w) => sum + (w.used_capacity_quintal || 0),
      0
    ),
    totalStaff: warehouses.reduce(
      (sum, w) => sum + getTeamCount(w),
      0
    ),
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Warehouse Management
                </h1>
                <p className="text-sm text-gray-500">
                  Manage and monitor all warehouses
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Add Warehouse
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Warehouse className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                Total
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.total}</h3>
            <p className="text-sm text-gray-500 mt-1">Total Warehouses</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                Active
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.active}</h3>
            <p className="text-sm text-gray-500 mt-1">Active Warehouses</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                Capacity
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">
              {stats.totalCapacity.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Total Capacity (Q)</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                Team
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">
              {stats.totalStaff}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Total Team Members</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, location, or manager..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchWarehouses}
              className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300"
              title="Refresh"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
            </button>

            <div className="flex bg-white border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Warehouse Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-2xl border border-gray-100 animate-pulse"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded-full mb-3" />
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredWarehouses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Warehouse className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No warehouses found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "Try adjusting your search query"
                : "Get started by creating your first warehouse"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Create Warehouse
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWarehouses.map((warehouse, index) => {
              const used = warehouse.used_capacity_quintal || 0;
              const total = warehouse.capacity_quintal || 0;
              const percentage =
                total > 0 ? Math.round((used / total) * 100) : 0;
              const status = getCapacityStatus(used, total);
              const teamMembers = getTeamMembers(warehouse);

              return (
                <div
                  key={warehouse._id}
                  className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-500 cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleViewDetails(warehouse)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 bg-gradient-to-br ${status.bg} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Warehouse className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                          {warehouse.name}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {warehouse.location}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(
                            activeDropdown === warehouse._id
                              ? null
                              : warehouse._id
                          );
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                      {activeDropdown === warehouse._id && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(warehouse);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4" /> View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(null);
                              // Handle edit
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Edit3 className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteWarehouse(warehouse._id);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Manager Info */}
                  {warehouse.manager && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl mb-4">
                      <img
                        src={warehouse.manager.employee?.employeeImage}
                        alt={warehouse.manager.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-violet-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {warehouse.manager.name}
                        </p>
                        <p className="text-xs text-violet-600 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Manager
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Capacity Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-500">Storage Capacity</span>
                      <span className={`font-semibold ${status.text}`}>
                        {percentage}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${status.bg} rounded-full transition-all duration-1000`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {used.toLocaleString()} / {total.toLocaleString()} quintal
                    </p>
                  </div>

                  {/* Team Avatars */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex -space-x-2">
                      {teamMembers.slice(0, 4).map((member, idx) => (
                        <img
                          key={member._id || idx}
                          src={member.employee?.employeeImage}
                          alt={member.name}
                          title={`${member.name} (${member.roleLabel})`}
                          className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                      {teamMembers.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-600 text-xs font-medium">
                          +{teamMembers.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{teamMembers.length} Members</span>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created {formatDate(warehouse.created_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Warehouse
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredWarehouses.map((warehouse) => {
                  const used = warehouse.used_capacity_quintal || 0;
                  const total = warehouse.capacity_quintal || 0;
                  const percentage =
                    total > 0 ? Math.round((used / total) * 100) : 0;
                  const status = getCapacityStatus(used, total);
                  const teamMembers = getTeamMembers(warehouse);

                  return (
                    <tr
                      key={warehouse._id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleViewDetails(warehouse)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 bg-gradient-to-br ${status.bg} rounded-lg`}
                          >
                            <Warehouse className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 block">
                              {warehouse.name}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {warehouse.location}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {warehouse.manager ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={warehouse.manager.employee?.employeeImage}
                              alt={warehouse.manager.name}
                              className="w-9 h-9 rounded-full object-cover border-2 border-violet-200"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {warehouse.manager.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {warehouse.manager.email}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Not assigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-36">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-500">
                              {used.toLocaleString()}/{total.toLocaleString()}
                            </span>
                            <span className={`font-medium ${status.text}`}>
                              {percentage}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${status.bg} rounded-full`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {teamMembers.slice(0, 3).map((member, idx) => (
                              <img
                                key={member._id || idx}
                                src={member.employee?.employeeImage}
                                alt={member.name}
                                title={`${member.name} (${member.roleLabel})`}
                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                              />
                            ))}
                            {teamMembers.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-600 text-xs font-medium">
                                +{teamMembers.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {teamMembers.length} members
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(warehouse.created_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(warehouse);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle edit
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteWarehouse(warehouse._id);
                            }}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && filteredWarehouses.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Showing {filteredWarehouses.length} of {warehouses.length} warehouses
          </div>
        )}
      </div>

      {/* Modals */}
      <WarehouseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={() => {
          fetchWarehouses();
          setIsCreateModalOpen(false);
        }}
        managers={managers}
        supervisors={supervisors}
        staff={staff}
      />

      <WarehouseDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedWarehouse(null);
        }}
        warehouse={selectedWarehouse}
        onEdit={(warehouse) => {
          console.log("Edit warehouse:", warehouse);
        }}
        onDelete={handleDeleteWarehouse}
      />
    </div>
  );
};

export default WarehousePage;