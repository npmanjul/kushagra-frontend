"use client";
import FarmerApproval from "@/components/admin/FarmerApproval";
import ProfileViewModal from "@/components/admin/ProfileViewModal";
import EditProfileModal from "@/components/admin/EditProfileModal";
import { formatRupee } from "@/utils/formatting";
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
  Wheat,
  CreditCard,
  Phone,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import React, { useState } from "react";

const farmers = [
  {
    id: "F001",
    name: "Ram Kumar",
    phone: "+91 9876543210",
    email: "ram.kumar@email.com",
    totalGrain: 1500,
    creditUsed: 900000,
    joinDate: "2024-01-15",
    status: "active",
    avatar: "RK",
    dob: "1985-06-15",
    gender: "Male",
    aadhaar_number: "1234-5678-9012",
    pan_number: "ABCDE1234F",
    address: "Village Rampur, Post Belghat",
    tehsil: "Gola",
    district: "Gorakhpur",
    state: "Uttar Pradesh",
    pin_code: "273402",
    land_size: "2.5",
    land_type: "Agricultural",
    account_number: "1234567890123",
    ifsc_code: "SBIN0001234",
    account_holder: "Ram Kumar",
    bank_name: "State Bank of India",
    branch_name: "Gorakhpur Main Branch",
    nominee_name: "Sita Devi",
    nominee_relation: "Spouse",
    nominee_phone: "+91 9876543211",
    nominee_aadhaar: "5678-9012-3456",
  },
  {
    id: "F002",
    name: "Shyam Singh",
    phone: "+91 9876543211",
    email: "shyam.singh@email.com",
    totalGrain: 800,
    creditUsed: 480000,
    joinDate: "2024-03-20",
    status: "pending",
    avatar: "SS",
    dob: "1990-03-20",
    gender: "Male",
    aadhaar_number: "2345-6789-0123",
    pan_number: "BCDEF2345G",
    address: "Village Kaptanganj",
    tehsil: "Kaptanganj",
    district: "Kushinagar",
    state: "Uttar Pradesh",
    pin_code: "274149",
    land_size: "1.5",
  },
  {
    id: "F003",
    name: "Mohan Lal",
    phone: "+91 9876543212",
    email: "mohan.lal@email.com",
    totalGrain: 2200,
    creditUsed: 1320000,
    joinDate: "2024-02-10",
    status: "rejected",
    avatar: "ML",
    dob: "1982-11-05",
    gender: "Male",
    aadhaar_number: "3456-7890-1234",
    address: "Village Padrauna",
    district: "Kushinagar",
    state: "Uttar Pradesh",
    pin_code: "274304",
  },
  {
    id: "F004",
    name: "Suresh Yadav",
    phone: "+91 9876543213",
    email: "suresh.yadav@email.com",
    totalGrain: 950,
    creditUsed: 570000,
    joinDate: "2024-04-05",
    status: "active",
    avatar: "SY",
    dob: "1988-07-22",
    gender: "Male",
    aadhaar_number: "4567-8901-2345",
    pan_number: "DEFGH4567I",
    address: "Village Deoria",
    tehsil: "Deoria Sadar",
    district: "Deoria",
    state: "Uttar Pradesh",
    pin_code: "274001",
    land_size: "3.0",
    land_type: "Irrigated",
    account_number: "9876543210987",
    ifsc_code: "PUNB0123400",
    account_holder: "Suresh Yadav",
    bank_name: "Punjab National Bank",
    branch_name: "Deoria Branch",
    nominee_name: "Kamla Devi",
    nominee_relation: "Spouse",
    nominee_phone: "+91 9876543214",
  },
];

const getStatusConfig = (status) => {
  switch (status) {
    case "active":
      return {
        bg: "bg-gradient-to-r from-green-50 to-emerald-50",
        text: "text-green-700",
        border: "border-green-200",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        label: "Active",
        dot: "bg-green-500",
      };
    case "pending":
      return {
        bg: "bg-gradient-to-r from-amber-50 to-yellow-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: <Clock className="w-3.5 h-3.5" />,
        label: "Pending",
        dot: "bg-amber-500",
      };
    case "rejected":
      return {
        bg: "bg-gradient-to-r from-red-50 to-rose-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: <XCircle className="w-3.5 h-3.5" />,
        label: "Rejected",
        dot: "bg-red-500",
      };
    default:
      return {
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
        icon: null,
        label: status,
        dot: "bg-gray-500",
      };
  }
};

const Page = () => {
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (verificationData) => {
    console.log("Verification submitted:", verificationData);
    setIsApprovalModalOpen(false);
  };

  const handleVerify = (farmer) => {
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
    // Here you would typically make an API call to update the farmer data
    setIsEditModalOpen(false);
  };

  const stats = [
    {
      label: "Total Farmers",
      value: farmers.length,
      icon: Users,
      color: "from-blue-500 to-indigo-600",
    },
    {
      label: "Active",
      value: farmers.filter((f) => f.status === "active").length,
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "Pending",
      value: farmers.filter((f) => f.status === "pending").length,
      icon: Clock,
      color: "from-amber-500 to-orange-600",
    },
    {
      label: "Total Grain",
      value: `${(farmers.reduce((a, b) => a + b.totalGrain, 0) / 1000).toFixed(
        1
      )}K`,
      icon: Wheat,
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Farmer Management
              </h1>
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            </div>
            <p className="text-gray-500 text-sm ml-14">
              Manage and verify all registered farmers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-gray-600 text-sm font-medium shadow-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 text-sm font-semibold">
              <Plus className="w-4 h-4" />
              Add Farmer
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200 text-gray-600 text-sm font-medium">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Status:</span>
              <div className="flex gap-1">
                {["all", "active", "pending", "rejected"].map((status) => (
                  <button
                    key={status}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg capitalize hover:bg-gray-100 transition-colors text-gray-600"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Farmer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total Grain
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Credit Used
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
                {farmers.map((farmer) => {
                  const statusConfig = getStatusConfig(farmer.status);
                  return (
                    <tr
                      key={farmer.id}
                      className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:scale-105 transition-transform duration-200">
                            {farmer.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {farmer.name}
                            </p>
                            <p className="text-xs text-gray-500">{farmer.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {farmer.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-amber-50 rounded-lg">
                            <Wheat className="w-3.5 h-3.5 text-amber-600" />
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">
                            {farmer.totalGrain.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">Qtl</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-green-50 rounded-lg">
                            <CreditCard className="w-3.5 h-3.5 text-green-600" />
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">
                            {formatRupee(farmer.creditUsed)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} animate-pulse`}
                          ></span>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Pending: Only Verify button */}
                          {farmer.status === "pending" && (
                            <button
                              onClick={() => handleVerify(farmer)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow-md hover:shadow-amber-200 transition-all duration-200 text-xs font-semibold"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Verify
                            </button>
                          )}

                          {/* Rejected: Only View button */}
                          {farmer.status === "rejected" && (
                            <button
                              onClick={() => handleView(farmer)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-xs font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                          )}

                          {/* Active: View and Edit buttons */}
                          {farmer.status === "active" && (
                            <>
                              <button
                                onClick={() => handleView(farmer)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-xs font-semibold"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View
                              </button>
                              <button
                                onClick={() => handleEdit(farmer)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:shadow-md hover:shadow-indigo-200 transition-all duration-200 text-xs font-semibold"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                Edit
                              </button>
                            </>
                          )}

                          {/* More options */}
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
                1-{farmers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {farmers.length}
              </span>{" "}
              farmers
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
                Previous
              </button>
              <button className="px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-lg">
                1
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Farmer Approval Modal - for Verify action */}
      <FarmerApproval
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onSubmit={handleSubmit}
        farmerData={selectedFarmer}
      />

      {/* Profile View Modal - for View action */}
      <ProfileViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        farmerData={selectedFarmer}
      />

      {/* Edit Profile Modal - for Edit action */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        farmerData={selectedFarmer}
        onSave={handleSave}
      />
    </>
  );
};

export default Page;
