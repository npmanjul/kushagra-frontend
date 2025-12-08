"use client";
import React, { useState } from "react";
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
} from "lucide-react";
import SupervisorViewModal from "@/components/admin/SupervisorViewModal";
import SupervisorEditModal from "@/components/admin/SupervisorEditModal";

const supervisors = [
  {
    id: "SUP001",
    name: "Rajesh Sharma",
    phone: "+91 9876543210",
    email: "rajesh.sharma@grainbank.com",
    status: "active",
    avatar: "RS",
    joinDate: "2023-06-15",
    role: "Senior Supervisor",
    department: "Operations",
    location: "Gorakhpur",
    district: "Gorakhpur",
    state: "Uttar Pradesh",
    assignedFarmers: 45,
    totalTransactions: 234,
    totalGrainHandled: 12500,
    performanceScore: 94,
    rating: 4.8,
    dob: "1985-03-20",
    gender: "Male",
    aadhaar_number: "1234-5678-9012",
    pan_number: "ABCDE1234F",
    address: "123, Main Road, Gorakhpur",
    pin_code: "273001",
    account_number: "1234567890123",
    ifsc_code: "SBIN0001234",
    bank_name: "State Bank of India",
    branch_name: "Gorakhpur Main",
    emergency_contact: "+91 9876543211",
    emergency_name: "Sunita Sharma",
  },
  {
    id: "SUP002",
    name: "Amit Kumar",
    phone: "+91 9876543211",
    email: "amit.kumar@grainbank.com",
    status: "active",
    avatar: "AK",
    joinDate: "2023-08-20",
    role: "Supervisor",
    department: "Field Operations",
    location: "Deoria",
    district: "Deoria",
    state: "Uttar Pradesh",
    assignedFarmers: 38,
    totalTransactions: 189,
    totalGrainHandled: 9800,
    performanceScore: 88,
    rating: 4.5,
    dob: "1990-07-15",
    gender: "Male",
    aadhaar_number: "2345-6789-0123",
    pan_number: "BCDEF2345G",
    address: "45, Station Road, Deoria",
    pin_code: "274001",
  },
  {
    id: "SUP003",
    name: "Priya Singh",
    phone: "+91 9876543212",
    email: "priya.singh@grainbank.com",
    status: "inactive",
    avatar: "PS",
    joinDate: "2024-01-10",
    role: "Junior Supervisor",
    department: "Quality Control",
    location: "Kushinagar",
    district: "Kushinagar",
    state: "Uttar Pradesh",
    assignedFarmers: 22,
    totalTransactions: 87,
    totalGrainHandled: 4500,
    performanceScore: 76,
    rating: 4.2,
    dob: "1992-11-25",
    gender: "Female",
    aadhaar_number: "3456-7890-1234",
  },
  {
    id: "SUP004",
    name: "Vikram Yadav",
    phone: "+91 9876543213",
    email: "vikram.yadav@grainbank.com",
    status: "pending",
    avatar: "VY",
    joinDate: "2024-11-01",
    role: "Supervisor",
    department: "Logistics",
    location: "Basti",
    district: "Basti",
    state: "Uttar Pradesh",
    assignedFarmers: 0,
    totalTransactions: 0,
    totalGrainHandled: 0,
    performanceScore: 0,
    rating: 0,
    dob: "1988-04-12",
    gender: "Male",
    aadhaar_number: "4567-8901-2345",
  },
  {
    id: "SUP005",
    name: "Anita Verma",
    phone: "+91 9876543214",
    email: "anita.verma@grainbank.com",
    status: "active",
    avatar: "AV",
    joinDate: "2023-04-05",
    role: "Senior Supervisor",
    department: "Operations",
    location: "Azamgarh",
    district: "Azamgarh",
    state: "Uttar Pradesh",
    assignedFarmers: 52,
    totalTransactions: 312,
    totalGrainHandled: 15800,
    performanceScore: 97,
    rating: 4.9,
    dob: "1986-09-08",
    gender: "Female",
    aadhaar_number: "5678-9012-3456",
    pan_number: "EFGHI5678J",
  },
];



const Page = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewType, setViewType] = useState("table"); // 'table' or 'grid'
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleView = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setIsViewModalOpen(true);
  };

  const handleEdit = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedData) => {
    console.log("Supervisor updated:", updatedData);
    setIsEditModalOpen(false);
  };

  const filteredSupervisors = supervisors.filter((sup) => {
    const matchesSearch =
      sup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.phone.includes(searchQuery) ||
      sup.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || sup.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: "Total Supervisors",
      value: supervisors.length,
      icon: UserCog,
      color: "from-blue-500 to-indigo-600",
      change: "+2",
      trend: "up",
    },
    {
      label: "Active",
      value: supervisors.filter((s) => s.status === "active").length,
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-600",
      change: "92%",
      trend: "up",
    },
    {
      label: "Farmers Managed",
      value: supervisors.reduce((a, b) => a + b.assignedFarmers, 0),
      icon: Users,
      color: "from-purple-500 to-pink-600",
      change: "+15",
      trend: "up",
    },
    {
      label: "Avg. Performance",
      value: `${Math.round(
        supervisors.filter((s) => s.performanceScore > 0).reduce((a, b) => a + b.performanceScore, 0) /
          supervisors.filter((s) => s.performanceScore > 0).length
      )}%`,
      icon: TrendingUp,
      color: "from-amber-500 to-orange-600",
      change: "+3%",
      trend: "up",
    },
  ];

  // Mobile Card Component
  const SupervisorCard = ({ supervisor }) => {

    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-violet-200 transition-all duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br  flex items-center justify-center text-white font-semibold shadow-md`}
            >
              {supervisor.avatar}
            </div>
            <div>
              <p className="font-semibold text-gray-900 flex items-center gap-2">
                {supervisor.name}
                {supervisor.performanceScore >= 90 && (
                  <Award className="w-4 h-4 text-amber-500" />
                )}
              </p>
              <p className="text-xs text-gray-500">{supervisor.id}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold  border `}
          >
            <span className={`w-1.5 h-1.5 rounded-full  animate-pulse`}></span>
            
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Location</p>
            <p className="text-sm text-gray-900 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              {supervisor.location}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Farmers</p>
            <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
              <Users className="w-3 h-3 text-violet-500" />
              {supervisor.assignedFarmers}
            </p>
          </div>
 
        </div>

        {/* Contact */}
        <div className="border-t border-gray-100 pt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Phone className="w-3 h-3 text-gray-400" />
            {supervisor.phone}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Mail className="w-3 h-3 text-gray-400" />
            <span className="truncate">{supervisor.email}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleView(supervisor)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={() => handleEdit(supervisor)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg hover:shadow-md transition-all duration-200 text-sm font-medium"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="p-2 sm:p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg sm:rounded-xl shadow-lg shadow-violet-200">
                <UserCog className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Supervisor Management
              </h1>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-pulse" />
            </div>
            <p className="text-gray-500 text-xs sm:text-sm ml-0 sm:ml-14">
              Manage and monitor all supervisors and their performance
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden p-2 bg-white border border-gray-200 rounded-lg"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            
            <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-gray-600 text-xs sm:text-sm font-medium shadow-sm flex-1 sm:flex-initial">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-violet-200 transition-all duration-300 text-xs sm:text-sm font-semibold flex-1 sm:flex-initial">
              <Plus className="w-4 h-4" />
              <span>Add Supervisor</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="sm:hidden bg-white rounded-xl shadow-lg border border-gray-100 p-4 space-y-3">
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
                  className={`p-1.5 rounded ${viewType === "table" ? "bg-white shadow-sm" : ""}`}
                >
                  <List className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setViewType("grid")}
                  className={`p-1.5 rounded ${viewType === "grid" ? "bg-white shadow-sm" : ""}`}
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
                  <div className={`flex items-center gap-1 text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
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
                placeholder="Search supervisors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm font-medium flex-1"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            

              {/* View Type Toggle - Desktop */}
              <div className="hidden lg:flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewType("table")}
                  className={`p-1.5 rounded transition-all ${
                    viewType === "table" ? "bg-white shadow-sm text-violet-600" : "text-gray-600"
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewType("grid")}
                  className={`p-1.5 rounded transition-all ${
                    viewType === "grid" ? "bg-white shadow-sm text-violet-600" : "text-gray-600"
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="sm:hidden mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Filter by status:</span>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {["all", "active", "inactive", "pending"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setShowFilters(false);
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all duration-200 ${
                      statusFilter === status
                        ? "bg-violet-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
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
                      Supervisor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Role & Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Assigned
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSupervisors.map((supervisor) => {
                    return (
                      <tr
                        key={supervisor.id}
                        className="hover:bg-gradient-to-r hover:from-violet-50/30 hover:to-white transition-all duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-11 h-11 rounded-xl bg-gradient-to-br from-gray-500 to-slate-600 flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all duration-200`}
                            >
                              {supervisor.avatar}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                                {supervisor.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {supervisor.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-gradient-to-r  text-white`}
                            >
                              <Briefcase className="w-3 h-3" />
                              {supervisor.role}
                            </span>
                            <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              {supervisor.location}, {supervisor.district}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              {supervisor.phone}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Mail className="w-3 h-3 text-gray-400" />
                              {supervisor.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-violet-50 rounded-lg">
                              <Users className="w-3.5 h-3.5 text-violet-600" />
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900 text-sm">
                                {supervisor.assignedFarmers}
                              </span>
                              <span className="text-xs text-gray-500 ml-1">
                                farmers
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(supervisor)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-xs font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                            <button
                              onClick={() => handleEdit(supervisor)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg hover:shadow-md hover:shadow-violet-200 transition-all duration-200 text-xs font-semibold"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-gray-400" />
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
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  1-{filteredSupervisors.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {filteredSupervisors.length}
                </span>{" "}
                supervisors
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled
                  className="px-3 py-1.5 text-sm font-medium text-gray-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button className="px-3 py-1.5 text-sm font-medium bg-violet-600 text-white rounded-lg shadow-sm">
                  1
                </button>
                <button
                  disabled
                  className="px-3 py-1.5 text-sm font-medium text-gray-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grid View - Desktop & Mobile */}
        {(viewType === "grid" || window.innerWidth < 1024) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredSupervisors.map((supervisor) => (
              <SupervisorCard key={supervisor.id} supervisor={supervisor} />
            ))}
          </div>
        )}

        {/* Mobile List View - Always visible on mobile */}
        <div className="lg:hidden space-y-3">
          {viewType === "table" && filteredSupervisors.map((supervisor) => (
            <SupervisorCard key={supervisor.id} supervisor={supervisor} />
          ))}
        </div>

        {/* Empty State */}
        {filteredSupervisors.length === 0 && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-16 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCog className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              No supervisors found
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Mobile Pagination */}
        {filteredSupervisors.length > 0 && (
          <div className="lg:hidden bg-white rounded-xl p-3 border border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Page <span className="font-semibold text-gray-700">1</span> of{" "}
                <span className="font-semibold text-gray-700">1</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled
                  className="p-2 text-gray-400 rounded-lg disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled
                  className="p-2 text-gray-400 rounded-lg disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      <SupervisorViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        supervisorData={selectedSupervisor}
      />

      {/* Edit Modal */}
      <SupervisorEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        supervisorData={selectedSupervisor}
        onSave={handleSave}
      />
    </>
  );
};

export default Page;