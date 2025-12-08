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
  Users,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Grid3x3,
  List,
} from "lucide-react";
import ManagerViewModal from "@/components/admin/ManagerViewModal";
import ManagerEditModal from "@/components/admin/ManagerEditModal";

// Example manager data
const managers = [
  {
    id: "MGR001",
    name: "Sunil Mehra",
    phone: "+91 9876543200",
    email: "sunil.mehra@grainbank.com",
    status: "active",
    avatar: "SM",
    joinDate: "2022-03-10",
    role: "Regional Manager",
    department: "Operations",
    location: "Lucknow",
    district: "Lucknow",
    state: "Uttar Pradesh",
    assignedSupervisors: 12,
    assignedFarmers: 320,
    dob: "1980-01-15",
    gender: "Male",
    address: "45, MG Road, Lucknow",
    pin_code: "226001",
  },
  {
    id: "MGR002",
    name: "Meena Gupta",
    phone: "+91 9876543201",
    email: "meena.gupta@grainbank.com",
    status: "active",
    avatar: "MG",
    joinDate: "2021-07-22",
    role: "Area Manager",
    department: "Quality",
    location: "Varanasi",
    district: "Varanasi",
    state: "Uttar Pradesh",
    assignedSupervisors: 8,
    assignedFarmers: 210,
    dob: "1985-05-18",
    gender: "Female",
    address: "12, Cantonment, Varanasi",
    pin_code: "221002",
  },
  {
    id: "MGR003",
    name: "Ravi Kumar",
    phone: "+91 9876543202",
    email: "ravi.kumar@grainbank.com",
    status: "inactive",
    avatar: "RK",
    joinDate: "2023-01-05",
    role: "Manager",
    department: "Logistics",
    location: "Prayagraj",
    district: "Prayagraj",
    state: "Uttar Pradesh",
    assignedSupervisors: 5,
    assignedFarmers: 110,
    dob: "1988-09-09",
    gender: "Male",
    address: "78, Civil Lines, Prayagraj",
    pin_code: "211001",
  },
];

const Page = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewType, setViewType] = useState("table");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleView = (manager) => {
    setSelectedManager(manager);
    setIsViewModalOpen(true);
  };

  const handleEdit = (manager) => {
    setSelectedManager(manager);
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedData) => {
    // Save logic here
    setIsEditModalOpen(false);
  };

  const filteredManagers = managers.filter((mgr) => {
    const matchesSearch =
      mgr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mgr.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mgr.phone.includes(searchQuery) ||
      mgr.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || mgr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Card for mobile/grid view
  const ManagerCard = ({ manager }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-violet-200 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
            {manager.avatar}
          </div>
          <div>
            <p className="font-semibold text-gray-900 flex items-center gap-2">
              {manager.name}
            </p>
            <p className="text-xs text-gray-500">{manager.id}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Location</p>
          <p className="text-sm text-gray-900 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gray-400" />
            {manager.location}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Supervisors</p>
          <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
            <Users className="w-3 h-3 text-violet-500" />
            {manager.assignedSupervisors}
          </p>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-3 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Phone className="w-3 h-3 text-gray-400" />
          {manager.phone}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Mail className="w-3 h-3 text-gray-400" />
          <span className="truncate">{manager.email}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => handleView(manager)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={() => handleEdit(manager)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg hover:shadow-md transition-all duration-200 text-sm font-medium"
        >
          <Edit3 className="w-4 h-4" />
          Edit
        </button>
      </div>
    </div>
  );

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
                Manager Management
              </h1>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-pulse" />
            </div>
            <p className="text-gray-500 text-xs sm:text-sm ml-0 sm:ml-14">
              Manage and monitor all managers and their teams
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
              <span>Add Manager</span>
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

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search managers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm font-medium flex-1"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
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
                {["all", "active", "inactive"].map((status) => (
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

        {/* Table View */}
        {viewType === "table" && (
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Manager
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Role & Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Supervisors
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredManagers.map((manager) => (
                    <tr
                      key={manager.id}
                      className="hover:bg-gradient-to-r hover:from-violet-50/30 hover:to-white transition-all duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all duration-200">
                            {manager.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                              {manager.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {manager.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-gradient-to-r from-violet-500 to-purple-600 text-white">
                            <Briefcase className="w-3 h-3" />
                            {manager.role}
                          </span>
                          <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            {manager.location}, {manager.district}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
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
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-violet-50 rounded-lg">
                            <Users className="w-3.5 h-3.5 text-violet-600" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 text-sm">
                              {manager.assignedSupervisors}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              supervisors
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(manager)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-xs font-semibold"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(manager)}
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
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  1-{filteredManagers.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {filteredManagers.length}
                </span>{" "}
                managers
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

        {/* Grid View */}
        {(viewType === "grid" || typeof window !== "undefined" && window.innerWidth < 1024) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredManagers.map((manager) => (
              <ManagerCard key={manager.id} manager={manager} />
            ))}
          </div>
        )}

        {/* Mobile List View */}
        <div className="lg:hidden space-y-3">
          {viewType === "table" && filteredManagers.map((manager) => (
            <ManagerCard key={manager.id} manager={manager} />
          ))}
        </div>

        {/* Empty State */}
        {filteredManagers.length === 0 && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-16 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCog className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              No managers found
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Mobile Pagination */}
        {filteredManagers.length > 0 && (
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
      <ManagerViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        managerData={selectedManager}
      />

      {/* Edit Modal */}
      <ManagerEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        managerData={selectedManager}
        onSave={handleSave}
      />
    </>
  );
};

export default Page;