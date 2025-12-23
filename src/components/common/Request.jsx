"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  TrendingUp,
  TrendingDown,
  Package,
  AlertCircle,
  ChevronDown,
  Calendar,
  User,
  Building,
  Droplets,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  Activity,
  RefreshCw,
  Ban,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Sparkles,
  Mail,
  Loader2,
  UserCog,
  ClipboardList,
  Shield,
  Users,
  Crown,
  Banknote,
  ShoppingCart,
  Percent,
  IndianRupee,
  FileText,
  Hash,
  Timer,
  BadgeCheck,
  CircleDollarSign,
} from "lucide-react";
import { formatRupee } from "@/utils/formatting";
import API_BASE_URL from "@/utils/constants";
import RequestModal from "@/components/common/RequestModal";
import toast from "react-hot-toast";

const TransactionTypes = ["deposit", "sell", "withdraw", "loan"];
const StatusFilters = ["all", "pending", "completed", "rejected"];
const ITEMS_PER_PAGE = 5;

// Role configurations
const roleConfig = {
  admin: {
    label: "Admin",
    icon: Crown,
    color: "purple",
    gradient: "from-purple-500 to-pink-600",
    lightGradient: "from-purple-50 to-pink-50",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    description: "Final approval authority",
    panelTitle: "Admin Panel",
    approvalLevel: "Final Approval",
  },
  manager: {
    label: "Manager",
    icon: UserCog,
    color: "blue",
    gradient: "from-blue-500 to-indigo-600",
    lightGradient: "from-blue-50 to-indigo-50",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    description: "Secondary approval after supervisor",
    panelTitle: "Manager Panel",
    approvalLevel: "Secondary Approval",
  },
  supervisor: {
    label: "Supervisor",
    icon: Users,
    color: "emerald",
    gradient: "from-emerald-500 to-green-600",
    lightGradient: "from-emerald-50 to-green-50",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    description: "Initial approval review",
    panelTitle: "Supervisor Panel",
    approvalLevel: "Initial Approval",
  },
};

const Request = ({ userRole = "supervisor" }) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState("deposit");
  const [statusFilter, setStatusFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingCounts, setPendingCounts] = useState({
    deposit: 0,
    withdraw: 0,
    sell: 0,
    loan: 0,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total_items: 0,
    total_pages: 0,
  });

  const [counts, setCounts] = useState({
    all: { count: 0, total_value: 0 },
    pending: { count: 0, total_value: 0 },
    completed: { count: 0, total_value: 0 },
    rejected: { count: 0, total_value: 0 },
  });

  // Get current role configuration
  const currentRoleConfig = roleConfig[userRole] || roleConfig.supervisor;
  const RoleIcon = currentRoleConfig.icon;

  // Transaction type configurations
  const transactionConfig = {
    deposit: {
      icon: ArrowDownRight,
      color: "blue",
      gradient: "from-blue-500 to-indigo-600",
      lightGradient: "from-blue-50 to-indigo-50",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
      label: "Deposit",
      description: "Grain deposit transactions",
      accentColor: "blue",
    },
    sell: {
      icon: ShoppingCart,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-600",
      lightGradient: "from-emerald-50 to-teal-50",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200",
      iconBg: "bg-emerald-100",
      label: "Sell",
      description: "Grain sales transactions",
      accentColor: "emerald",
    },
    withdraw: {
      icon: Wallet,
      color: "amber",
      gradient: "from-amber-500 to-orange-600",
      lightGradient: "from-amber-50 to-orange-50",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      borderColor: "border-amber-200",
      iconBg: "bg-amber-100",
      label: "Withdraw",
      description: "Grain withdrawal transactions",
      accentColor: "amber",
    },
    loan: {
      icon: Banknote,
      color: "violet",
      gradient: "from-violet-500 to-purple-600",
      lightGradient: "from-violet-50 to-purple-50",
      bgColor: "bg-violet-50",
      textColor: "text-violet-700",
      borderColor: "border-violet-200",
      iconBg: "bg-violet-100",
      label: "Loan",
      description: "Loan against grain transactions",
      accentColor: "violet",
    },
  };

  // Status filter configurations
  const statusConfig = {
    all: {
      label: "All",
      icon: Package,
      color: "gray",
      bgActive: "bg-gradient-to-r from-slate-700 to-slate-900",
      bgHover: "hover:bg-slate-50",
      textColor: "text-slate-600",
      activeRing: "ring-slate-400",
    },
    pending: {
      label: "Pending",
      icon: Clock,
      color: "amber",
      bgActive: "bg-gradient-to-r from-amber-500 to-orange-500",
      bgHover: "hover:bg-amber-50",
      textColor: "text-amber-600",
      activeRing: "ring-amber-400",
    },
    completed: {
      label: "Completed",
      icon: CheckCircle,
      color: "green",
      bgActive: "bg-gradient-to-r from-emerald-500 to-green-600",
      bgHover: "hover:bg-emerald-50",
      textColor: "text-emerald-600",
      activeRing: "ring-emerald-400",
    },
    rejected: {
      label: "Rejected",
      icon: Ban,
      color: "red",
      bgActive: "bg-gradient-to-r from-red-500 to-rose-600",
      bgHover: "hover:bg-red-50",
      textColor: "text-red-600",
      activeRing: "ring-red-400",
    },
  };

  // Remarks display mapping for withdrawals
  const remarksDisplayMap = {
    personal_use: {
      label: "Personal Use",
      icon: "🏠",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    sale: {
      label: "For Sale",
      icon: "💰",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    other: {
      label: "Other",
      icon: "📋",
      color: "bg-gray-50 text-gray-700 border-gray-200",
    },
  };

  // Helper function to get individual approval status
  const getIndividualApprovalStatus = (approval) => {
    if (!approval) {
      return { status: "pending", text: "Pending", hasAction: false };
    }

    const hasUser = approval.user && approval.user.name;
    const hasDate = approval.date;

    if (approval.status === true && hasUser) {
      return {
        status: "approved",
        text: "Approved",
        hasAction: true,
        user: approval.user,
      };
    } else if (approval.status === false && (hasUser || hasDate)) {
      return {
        status: "rejected",
        text: "Rejected",
        hasAction: true,
        user: approval.user,
      };
    } else {
      return { status: "pending", text: "Pending", hasAction: false };
    }
  };

  // Get overall approval status for display - Role-based
  const getApprovalStatus = (approval, transactionStatus) => {
    if (transactionStatus === "completed") {
      return {
        text: "Completed",
        color:
          "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200",
        dotColor: "bg-green-500",
        icon: <CheckCircle className="w-4 h-4" />,
      };
    }

    if (transactionStatus === "rejected") {
      return {
        text: "Rejected",
        color:
          "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200",
        dotColor: "bg-red-500",
        icon: <XCircle className="w-4 h-4" />,
      };
    }

    if (transactionStatus === "pending") {
      const adminApproval = getIndividualApprovalStatus(
        approval?.admin_approval
      );
      const managerApproval = getIndividualApprovalStatus(
        approval?.manager_approval
      );
      const supervisorApproval = getIndividualApprovalStatus(
        approval?.supervisor_approval
      );

      // Role-specific status messages
      if (userRole === "admin") {
        if (adminApproval.status === "rejected") {
          return {
            text: "You Rejected",
            color:
              "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200",
            dotColor: "bg-red-500",
            icon: <XCircle className="w-4 h-4" />,
          };
        }
        if (adminApproval.status === "approved") {
          return {
            text: "Fully Approved",
            color:
              "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200",
            dotColor: "bg-green-500",
            icon: <CheckCircle className="w-4 h-4" />,
          };
        }
        if (managerApproval.status === "rejected") {
          return {
            text: "Manager Rejected",
            color:
              "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200",
            dotColor: "bg-red-500",
            icon: <XCircle className="w-4 h-4" />,
          };
        }
        if (managerApproval.status === "approved") {
          return {
            text: "Awaiting Your Approval",
            color:
              "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200",
            dotColor: "bg-amber-500",
            icon: <AlertCircle className="w-4 h-4" />,
          };
        }
        if (supervisorApproval.status === "rejected") {
          return {
            text: "Supervisor Rejected",
            color:
              "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200",
            dotColor: "bg-red-500",
            icon: <XCircle className="w-4 h-4" />,
          };
        }
        if (supervisorApproval.status === "approved") {
          return {
            text: "Awaiting Manager",
            color:
              "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200",
            dotColor: "bg-blue-500",
            icon: <Clock className="w-4 h-4" />,
          };
        }
        return {
          text: "Awaiting Supervisor",
          color:
            "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200",
          dotColor: "bg-slate-500",
          icon: <Clock className="w-4 h-4" />,
        };
      } else if (userRole === "manager") {
        if (managerApproval.status === "rejected") {
          return {
            text: "You Rejected",
            color:
              "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200",
            dotColor: "bg-red-500",
            icon: <XCircle className="w-4 h-4" />,
          };
        }
        if (managerApproval.status === "approved") {
          if (adminApproval.status === "rejected") {
            return {
              text: "Admin Rejected",
              color:
                "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200",
              dotColor: "bg-red-500",
              icon: <XCircle className="w-4 h-4" />,
            };
          }
          if (adminApproval.status === "approved") {
            return {
              text: "Fully Approved",
              color:
                "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200",
              dotColor: "bg-green-500",
              icon: <CheckCircle className="w-4 h-4" />,
            };
          }
          return {
            text: "Awaiting Admin",
            color:
              "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200",
            dotColor: "bg-blue-500",
            icon: <Clock className="w-4 h-4" />,
          };
        }
        if (supervisorApproval.status === "rejected") {
          return {
            text: "Supervisor Rejected",
            color:
              "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200",
            dotColor: "bg-red-500",
            icon: <XCircle className="w-4 h-4" />,
          };
        }
        if (supervisorApproval.status === "approved") {
          return {
            text: "Awaiting Your Approval",
            color:
              "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200",
            dotColor: "bg-amber-500",
            icon: <AlertCircle className="w-4 h-4" />,
          };
        }
        return {
          text: "Awaiting Supervisor",
          color:
            "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200",
          dotColor: "bg-slate-500",
          icon: <Clock className="w-4 h-4" />,
        };
      } else {
        // Supervisor Role
        if (supervisorApproval.status === "rejected") {
          return {
            text: "You Rejected",
            color:
              "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200",
            dotColor: "bg-red-500",
            icon: <XCircle className="w-4 h-4" />,
          };
        }
        if (supervisorApproval.status === "approved") {
          if (managerApproval.status === "rejected") {
            return {
              text: "Manager Rejected",
              color:
                "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200",
              dotColor: "bg-red-500",
              icon: <XCircle className="w-4 h-4" />,
            };
          }
          if (managerApproval.status === "approved") {
            if (adminApproval.status === "rejected") {
              return {
                text: "Admin Rejected",
                color:
                  "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200",
                dotColor: "bg-red-500",
                icon: <XCircle className="w-4 h-4" />,
              };
            }
            if (adminApproval.status === "approved") {
              return {
                text: "Fully Approved",
                color:
                  "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200",
                dotColor: "bg-green-500",
                icon: <CheckCircle className="w-4 h-4" />,
              };
            }
            return {
              text: "Awaiting Admin",
              color:
                "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200",
              dotColor: "bg-purple-500",
              icon: <Clock className="w-4 h-4" />,
            };
          }
          return {
            text: "Awaiting Manager",
            color:
              "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200",
            dotColor: "bg-blue-500",
            icon: <Clock className="w-4 h-4" />,
          };
        }
        return {
          text: "Awaiting Your Approval",
          color:
            "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200",
          dotColor: "bg-amber-500",
          icon: <AlertCircle className="w-4 h-4" />,
        };
      }
    }

    return {
      text: "Unknown",
      color:
        "bg-gradient-to-r from-gray-100 to-gray-100 text-gray-800 border-gray-200",
      dotColor: "bg-gray-500",
      icon: <AlertCircle className="w-4 h-4" />,
    };
  };

  // Get API endpoints based on transaction type
  const getApiEndpoints = () => {
    return {
      deposit: {
        fetch: `${API_BASE_URL}/approval/pending-deposite-approval`,
        action: `${API_BASE_URL}/approval/action-deposite-approval`,
      },
      withdraw: {
        fetch: `${API_BASE_URL}/approval/pending-withdraw-approval`,
        action: `${API_BASE_URL}/approval/action-withdraw-approval`,
      },
      sell: {
        fetch: `${API_BASE_URL}/approval/pending-sell-approval`,
        action: `${API_BASE_URL}/approval/action-sell-approval`,
      },
      loan: {
        fetch: `${API_BASE_URL}/approval/pending-loan-approval`,
        action: `${API_BASE_URL}/approval/action-loan-approval`,
      },
    };
  };

  // Fetch pending counts for all transaction types
  const fetchPendingCounts = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/approval/all-pending-approvals`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPendingCounts(
          data.pending_counts || {
            deposit: 0,
            withdraw: 0,
            sell: 0,
            loan: 0,
          }
        );
      }
    } catch (error) {
      console.error("Error fetching pending counts:", error);
    }
  }, []);

  // Fetch transactions from API
  const fetchTransactions = useCallback(
    async (type, status = "all", page = 1) => {
      try {
        setLoading(true);
        const endpoints = getApiEndpoints();
        const endpoint = endpoints[type];

        if (!endpoint) {
          setTransactions([]);
          setPagination({
            page: 1,
            limit: ITEMS_PER_PAGE,
            total_items: 0,
            total_pages: 0,
          });
          setCounts({
            all: { count: 0 },
            pending: { count: 0 },
            completed: { count: 0 },
            rejected: { count: 0 },
          });
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${endpoint.fetch}?status=${status}&page=${page}&limit=${ITEMS_PER_PAGE}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch ${type} transactions`);
        }

        const data = await response.json();

        setTransactions(data.data || []);
        setPagination(
          data.pagination || {
            page: 1,
            limit: ITEMS_PER_PAGE,
            total_items: 0,
            total_pages: 0,
          }
        );
        setCounts(
          data.counts || {
            all: { count: 0, total_value: 0 },
            pending: { count: 0, total_value: 0 },
            completed: { count: 0, total_value: 0 },
            rejected: { count: 0, total_value: 0 },
          }
        );
      } catch (error) {
        console.error(`Error fetching ${type} transactions:`, error);
        toast.error(`Failed to fetch ${type} transactions`);
        setTransactions([]);
        setPagination({
          page: 1,
          limit: ITEMS_PER_PAGE,
          total_items: 0,
          total_pages: 0,
        });
        setCounts({
          all: { count: 0 },
          pending: { count: 0 },
          completed: { count: 0 },
          rejected: { count: 0 },
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // Initial fetch for pending counts
  useEffect(() => {
    fetchPendingCounts();
  }, [fetchPendingCounts]);

  // Effect for fetching transactions based on active tab
  useEffect(() => {
    fetchTransactions(activeTab, statusFilter, currentPage);
  }, [statusFilter, currentPage, activeTab, fetchTransactions]);

  // Handle status filter change - Reset pagination
  const handleStatusFilterChange = (newStatus) => {
    if (newStatus !== statusFilter) {
      setCurrentPage(1);
      setStatusFilter(newStatus);
    }
  };

  // Handle tab change - Reset pagination and status filter
  const handleTabChange = (newTab) => {
    if (newTab !== activeTab) {
      setCurrentPage(1);
      setStatusFilter("all");
      setActiveTab(newTab);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchTransactions(activeTab, statusFilter, currentPage),
      fetchPendingCounts(),
    ]);
  };

  // Filter transactions by search
  const getFilteredTransactions = () => {
    if (!searchValue) return transactions;

    const searchLower = searchValue.toLowerCase();

    return transactions.filter((t) => {
      // Common search fields
      const commonMatch =
        t.user?.name?.toLowerCase().includes(searchLower) ||
        t._id?.toLowerCase().includes(searchLower) ||
        t.warehouse?.name?.toLowerCase().includes(searchLower) ||
        t.warehouse?.location?.toLowerCase().includes(searchLower) ||
        t.user?.phone_number?.includes(searchValue) ||
        t.user?.email?.toLowerCase().includes(searchLower) ||
        t.remarks?.toLowerCase().includes(searchLower);

      // Grain search for deposit/withdraw
      const grainMatch = t.grain?.[0]?.category?.grain_type
        ?.toLowerCase()
        .includes(searchLower);

      // Loan specific search
      const loanMatch =
        activeTab === "loan" &&
        (t.loan_id?.toLowerCase().includes(searchLower) ||
          t.interest_rate?.toString().includes(searchValue));

      // Sell specific search
      const sellMatch =
        activeTab === "sell" &&
        (t.buyer_name?.toLowerCase().includes(searchLower) ||
          t.sale_price?.toString().includes(searchValue));

      return commonMatch || grainMatch || loanMatch || sellMatch;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Pagination handlers
  const goToPage = (page) => {
    const newPage = Math.max(1, Math.min(page, pagination.total_pages));
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(pagination.total_pages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Check if user can approve based on role and approval status
  const canUserApprove = (transaction) => {
    if (transaction.transaction_status !== "pending") return false;

    const adminApproval = getIndividualApprovalStatus(
      transaction.approval?.admin_approval
    );
    const managerApproval = getIndividualApprovalStatus(
      transaction.approval?.manager_approval
    );
    const supervisorApproval = getIndividualApprovalStatus(
      transaction.approval?.supervisor_approval
    );

    switch (userRole) {
      case "admin":
        return (
          managerApproval.status === "approved" &&
          adminApproval.status === "pending"
        );
      case "manager":
        return (
          supervisorApproval.status === "approved" &&
          managerApproval.status === "pending"
        );
      case "supervisor":
        return supervisorApproval.status === "pending";
      default:
        return false;
    }
  };

  // Calculate awaiting approval count for current role
  const getAwaitingApprovalCount = () => {
    return transactions.filter((t) => canUserApprove(t)).length;
  };

  // Get total pending across all types
  const getTotalPending = () => {
    return Object.values(pendingCounts).reduce((sum, count) => sum + count, 0);
  };

  // Approval handler
  const handleApproval = async (id, action) => {
    try {
      setProcessingId(id);

      const endpoints = getApiEndpoints();
      const endpoint = endpoints[activeTab];

      if (!endpoint) {
        toast.error("Approval not supported for this transaction type");
        setProcessingId(null);
        return;
      }

      const response = await fetch(endpoint.action, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          action,
          transactionId: id,
        }),
      });

      const responseData = await response.json().catch(() => ({}));

      if (response.ok) {
        const actionText = action === "approve" ? "approved" : "rejected";
        const transactionLabel =
          activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
        toast.success(
          responseData.message ||
            `${transactionLabel} transaction ${actionText} successfully`
        );

        await Promise.all([
          fetchTransactions(activeTab, statusFilter, currentPage),
          fetchPendingCounts(),
        ]);
        setSelectedRequest(null);
      } else {
        if (response.status === 400) {
          toast.error(
            responseData.message ||
              "Invalid request. Please check the transaction."
          );
        } else if (response.status === 401) {
          toast.error("Session expired. Please login again.");
        } else if (response.status === 403) {
          toast.error(
            responseData.message ||
              "You do not have permission to perform this action."
          );
        } else if (response.status === 404) {
          toast.error(responseData.message || "Transaction not found.");
        } else {
          toast.error(
            responseData.message || `Failed to ${action} transaction`
          );
        }
      }
    } catch (error) {
      console.error(`Error processing ${activeTab} transaction:`, error);
      toast.error(
        `Error ${
          action === "approve" ? "approving" : "rejecting"
        } ${activeTab} transaction. Please try again.`
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Loading state
  if (loading && transactions.length === 0 && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
            <div
              className={`absolute inset-0 border-4 ${currentRoleConfig.borderColor} rounded-full`}
            ></div>
            <div
              className={`absolute inset-0 border-4 border-${currentRoleConfig.color}-500 rounded-full border-t-transparent animate-spin`}
            ></div>
            <div className="absolute inset-3 sm:inset-4 border-4 border-indigo-200 rounded-full"></div>
            <div
              className="absolute inset-3 sm:inset-4 border-4 border-indigo-500 rounded-full border-b-transparent animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
            <RoleIcon
              className={`absolute inset-0 m-auto w-8 h-8 ${currentRoleConfig.textColor} animate-pulse`}
            />
          </div>
          <p className="mt-6 sm:mt-8 text-gray-700 font-semibold text-base sm:text-lg">
            Loading {currentRoleConfig.label.toLowerCase()} dashboard...
          </p>
          <p className="mt-2 text-gray-400 text-xs sm:text-sm">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100/80 overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-r ${currentRoleConfig.lightGradient} opacity-30`}
          ></div>
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -mr-32 sm:-mr-48 -mt-32 sm:-mt-48"></div>
          <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-tr from-indigo-100/30 to-transparent rounded-full -ml-24 sm:-ml-32 -mb-24 sm:-mb-32"></div>

          <div className="relative p-4 sm:p-6 md:p-8">
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Title Section */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r ${currentRoleConfig.gradient} text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg`}
                  >
                    <RoleIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    {currentRoleConfig.panelTitle}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 ${currentRoleConfig.bgColor} ${currentRoleConfig.textColor} rounded-full text-xs font-semibold border ${currentRoleConfig.borderColor}`}
                  >
                    <ClipboardList className="w-3 h-3" />
                    {currentRoleConfig.approvalLevel}
                  </span>
                  {getTotalPending() > 0 && (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1 border border-amber-200 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                      {getTotalPending()} Total Pending
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                  Request Management
                </h1>
                <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-xl">
                  {currentRoleConfig.description}. Review and process{" "}
                  {activeTab} transactions.
                </p>
              </div>

              {/* Search Section */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab} transactions...`}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-gray-50/80 backdrop-blur border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all duration-300 placeholder:text-gray-400 text-sm sm:text-base"
                  />
                  {searchValue && (
                    <button
                      onClick={() => setSearchValue("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className={`
            p-3 sm:p-3.5 bg-white border border-gray-200 rounded-xl sm:rounded-2xl 
            hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 
            shadow-sm hover:shadow-md self-end sm:self-auto
            ${refreshing ? "cursor-not-allowed opacity-60" : ""}
          `}
                >
                  <RefreshCw
                    className={`w-5 h-5 text-gray-600 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Type Tabs with Pending Counts */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100/80 p-1.5 sm:p-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            {TransactionTypes.map((type) => {
              const config = transactionConfig[type];
              const Icon = config.icon;
              const isActive = activeTab === type;
              const pendingCount = pendingCounts[type] || 0;
              const tabCount = isActive ? counts.all.count : pendingCount;

              return (
                <button
                  key={type}
                  onClick={() => handleTabChange(type)}
                  className={`
            relative p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl transition-all duration-500 group overflow-hidden
            ${
              isActive
                ? `bg-gradient-to-r ${config.gradient} text-white shadow-xl shadow-${config.color}-500/25 scale-[1.02]`
                : "bg-gray-50/80 hover:bg-gray-100 text-gray-700 hover:scale-[1.01]"
            }
          `}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                  )}
                  <div className="relative flex items-center gap-2 sm:gap-3">
                    <div
                      className={`
              p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300
              ${
                isActive
                  ? "bg-white/20 backdrop-blur-sm shadow-inner"
                  : `${config.bgColor} group-hover:scale-110`
              }
            `}
                    >
                      <Icon
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          isActive ? "text-white" : config.textColor
                        }`}
                      />
                    </div>
                    <div className="text-left min-w-0">
                      <p
                        className={`font-bold text-sm sm:text-base md:text-lg truncate ${
                          isActive ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {config.label}
                      </p>
                      <p
                        className={`text-xs sm:text-sm truncate ${
                          isActive ? "text-white/80" : "text-gray-500"
                        }`}
                      >
                        {isActive
                          ? `${tabCount} total`
                          : `${pendingCount} pending`}
                      </p>
                    </div>
                  </div>
                  {pendingCount > 0 && (
                    <div
                      className={`
              absolute top-1 right-1 min-w-[22px] sm:min-w-[28px] h-5 sm:h-7 px-1.5 sm:px-2 
              bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full 
              flex items-center justify-center text-xs font-bold shadow-lg
              ${isActive ? "" : "animate-pulse"}
            `}
                    >
                      {pendingCount}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
          <StatCard
            title="Total"
            value={counts.all.count}
            subValue={
              counts.all.total_value
                ? formatRupee(counts.all.total_value)
                : null
            }
            icon={<Package className="w-4 h-4 sm:w-5 sm:h-5" />}
            gradient="from-blue-500 to-indigo-600"
            lightGradient="from-blue-50 to-indigo-50"
          />
          <StatCard
            title="Your Action"
            value={getAwaitingApprovalCount()}
            icon={<AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
            gradient="from-amber-500 to-orange-500"
            lightGradient="from-amber-50 to-orange-50"
            highlight={getAwaitingApprovalCount() > 0}
          />
          <StatCard
            title="Pending"
            value={counts.pending.count}
            subValue={
              counts.pending.total_value
                ? formatRupee(counts.pending.total_value)
                : null
            }
            icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
            gradient="from-yellow-500 to-amber-500"
            lightGradient="from-yellow-50 to-amber-50"
          />
          <StatCard
            title="Completed"
            value={counts.completed.count}
            subValue={
              counts.completed.total_value
                ? formatRupee(counts.completed.total_value)
                : null
            }
            icon={<CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
            gradient="from-emerald-500 to-green-600"
            lightGradient="from-emerald-50 to-green-50"
          />
          <StatCard
            title="Rejected"
            value={counts.rejected.count}
            subValue={
              counts.rejected.total_value
                ? formatRupee(counts.rejected.total_value)
                : null
            }
            icon={<XCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
            gradient="from-red-500 to-rose-600"
            lightGradient="from-red-50 to-rose-50"
          />
          <StatCard
            title="Total Value"
            value={formatRupee(counts.all.total_value || 0)}
            icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
            gradient="from-purple-500 to-pink-600"
            lightGradient="from-purple-50 to-pink-50"
            isAmount
          />
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100/80 overflow-hidden">
          {/* Status Filter Tabs */}
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-slate-50/80 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto">
                {StatusFilters.map((status) => {
                  const config = statusConfig[status];
                  const Icon = config.icon;
                  const isActive = statusFilter === status;

                  const count = counts[status]?.count || 0;

                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusFilterChange(status)}
                      className={`
                flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl 
                font-medium text-xs sm:text-sm transition-all duration-300
                ${
                  isActive
                    ? `${config.bgActive} text-white shadow-lg ring-2 ${config.activeRing} ring-offset-1`
                    : `${config.textColor} ${config.bgHover} bg-white border border-gray-200 hover:shadow-md`
                }
              `}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">{config.label}</span>
                      <span
                        className={`
                ml-0.5 sm:ml-1 px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-bold min-w-[20px] sm:min-w-[26px] text-center
                ${
                  isActive
                    ? "bg-white/25 text-white"
                    : "bg-gray-100 text-gray-700"
                }
              `}
                      >
                        {loading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          count
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Indicator */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${transactionConfig[activeTab].bgColor} ${transactionConfig[activeTab].borderColor} border`}
              >
                {React.createElement(transactionConfig[activeTab].icon, {
                  className: `w-4 h-4 ${transactionConfig[activeTab].textColor}`,
                })}
                <span
                  className={`text-xs sm:text-sm font-semibold ${transactionConfig[activeTab].textColor}`}
                >
                  {transactionConfig[activeTab].label} Transactions
                </span>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="p-3 sm:p-4 md:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12 sm:py-16">
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-200 border-t-blue-500"></div>
                  </div>
                  <span className="text-gray-500 font-medium text-sm sm:text-base">
                    Loading {activeTab} transactions...
                  </span>
                </div>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {filteredTransactions.map((transaction, index) => (
                  <TransactionCard
                    key={transaction._id}
                    transaction={transaction}
                    config={transactionConfig[activeTab]}
                    transactionType={activeTab}
                    userRole={userRole}
                    roleConfig={currentRoleConfig}
                    onApprove={() => handleApproval(transaction._id, "approve")}
                    onReject={() => handleApproval(transaction._id, "reject")}
                    onView={() => setSelectedRequest(transaction)}
                    getApprovalStatus={getApprovalStatus}
                    getIndividualApprovalStatus={getIndividualApprovalStatus}
                    canUserApprove={canUserApprove}
                    remarksDisplayMap={remarksDisplayMap}
                    index={index}
                    isProcessing={processingId === transaction._id}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                searchValue={searchValue}
                statusFilter={statusFilter}
                activeTab={activeTab}
                config={transactionConfig[activeTab]}
                onClearSearch={() => setSearchValue("")}
              />
            )}
          </div>

          {/* Pagination Component */}
          {pagination.total_items > 0 && !searchValue && (
            <div className="border-t border-gray-100 px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-50/80 to-slate-50/80">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                {/* Left: Showing info */}
                <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                  Showing{" "}
                  <span className="font-bold text-gray-900">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  -{" "}
                  <span className="font-bold text-gray-900">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total_items
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-gray-900">
                    {pagination.total_items}
                  </span>
                </div>

                {/* Right: Pagination controls */}
                <div className="flex items-center gap-1 order-1 sm:order-2">
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className={`
              p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all duration-300
              ${
                currentPage === 1
                  ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                  : "border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-md active:scale-95"
              }
            `}
                    title="First Page"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`
              p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all duration-300
              ${
                currentPage === 1
                  ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                  : "border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-md active:scale-95"
              }
            `}
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2">
                    {(() => {
                      const pages = [];
                      const maxVisiblePages =
                        typeof window !== "undefined" && window.innerWidth < 640
                          ? 3
                          : 5;
                      const totalPages = pagination.total_pages;
                      let startPage = Math.max(
                        1,
                        currentPage - Math.floor(maxVisiblePages / 2)
                      );
                      let endPage = Math.min(
                        totalPages,
                        startPage + maxVisiblePages - 1
                      );

                      if (endPage - startPage + 1 < maxVisiblePages) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                      }

                      if (startPage > 1) {
                        pages.push(
                          <button
                            key={1}
                            onClick={() => goToPage(1)}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:bg-white hover:shadow-md transition-all"
                          >
                            1
                          </button>
                        );
                        if (startPage > 2) {
                          pages.push(
                            <span
                              key="dots-start"
                              className="px-1 sm:px-2 text-gray-400 text-xs sm:text-sm"
                            >
                              •••
                            </span>
                          );
                        }
                      }

                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => goToPage(i)}
                            className={`
                      px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300
                      ${
                        currentPage === i
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105"
                          : "text-gray-600 hover:bg-white hover:shadow-md active:scale-95"
                      }
                    `}
                          >
                            {i}
                          </button>
                        );
                      }

                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(
                            <span
                              key="dots-end"
                              className="px-1 sm:px-2 text-gray-400 text-xs sm:text-sm"
                            >
                              •••
                            </span>
                          );
                        }
                        pages.push(
                          <button
                            key={totalPages}
                            onClick={() => goToPage(totalPages)}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:bg-white hover:shadow-md transition-all"
                          >
                            {totalPages}
                          </button>
                        );
                      }

                      return pages;
                    })()}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === pagination.total_pages}
                    className={`
              p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all duration-300
              ${
                currentPage === pagination.total_pages
                  ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                  : "border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-md active:scale-95"
              }
            `}
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === pagination.total_pages}
                    className={`
              p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all duration-300
              ${
                currentPage === pagination.total_pages
                  ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                  : "border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-md active:scale-95"
              }
            `}
                    title="Last Page"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedRequest && (
        <RequestModal
          transaction={selectedRequest}
          config={transactionConfig[activeTab]}
          transactionType={activeTab}
          onClose={() => setSelectedRequest(null)}
          onApprove={() => handleApproval(selectedRequest._id, "approve")}
          onReject={() => handleApproval(selectedRequest._id, "reject")}
          getApprovalStatus={getApprovalStatus}
          getIndividualApprovalStatus={getIndividualApprovalStatus}
          userRole={userRole}
          canApprove={canUserApprove(selectedRequest)}
        />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({
  title,
  value,
  subValue,
  icon,
  gradient,
  lightGradient,
  isAmount = false,
  highlight = false,
}) => (
  <div
    className={`relative bg-gradient-to-br ${lightGradient} rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-gray-100/80 overflow-hidden group hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-0.5 ${
      highlight ? "ring-2 ring-amber-400 ring-offset-2" : ""
    }`}
  >
    <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-white/60 to-transparent rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10 group-hover:scale-150 transition-transform duration-500"></div>
    <div className="relative">
      <div className="flex items-start justify-between mb-1.5 sm:mb-2">
        <div
          className={`p-1.5 sm:p-2 md:p-2.5 bg-gradient-to-br ${gradient} rounded-lg sm:rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        {highlight && (
          <span className="flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-amber-500"></span>
          </span>
        )}
      </div>
      <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1">
        {title}
      </p>
      <p
        className={`${
          isAmount
            ? "text-sm sm:text-lg md:text-xl"
            : "text-xl sm:text-2xl md:text-3xl"
        } font-bold text-gray-900 truncate`}
      >
        {value}
      </p>
      {subValue && (
        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 truncate">
          {subValue}
        </p>
      )}
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({
  searchValue,
  statusFilter,
  activeTab,
  config,
  onClearSearch,
}) => {
  const Icon = config.icon;
  const getEmptyMessage = () => {
    if (searchValue) {
      return {
        title: "No results found",
        subtitle: `No ${activeTab} transactions match "${searchValue}"`,
      };
    }
    switch (statusFilter) {
      case "pending":
        return {
          title: "No pending transactions",
          subtitle: `All ${activeTab} transactions have been processed. Great job!`,
        };
      case "completed":
        return {
          title: "No completed transactions",
          subtitle: `Completed ${activeTab} transactions will appear here`,
        };
      case "rejected":
        return {
          title: "No rejected transactions",
          subtitle: `No ${activeTab} transactions have been rejected yet`,
        };
      default:
        return {
          title: "No transactions found",
          subtitle: `New ${activeTab} requests will appear here`,
        };
    }
  };

  const message = getEmptyMessage();

  return (
    <div className="text-center py-12 sm:py-16 md:py-24">
      <div
        className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 ${config.bgColor} rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-lg`}
      >
        <Icon
          className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${config.textColor}`}
        />
      </div>
      <p className="text-gray-900 text-lg sm:text-xl md:text-2xl font-bold mb-1.5 sm:mb-2">
        {message.title}
      </p>
      <p className="text-gray-500 max-w-md mx-auto text-xs sm:text-sm md:text-base px-4">
        {message.subtitle}
      </p>
      {searchValue && (
        <button
          onClick={onClearSearch}
          className="mt-4 sm:mt-6 px-5 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all text-sm sm:text-base active:scale-95"
        >
          Clear Search
        </button>
      )}
    </div>
  );
};

// Transaction Card Component - Universal for all types
const TransactionCard = ({
  transaction,
  config,
  transactionType,
  userRole,
  roleConfig: currentRoleConfig,
  onApprove,
  onReject,
  onView,
  getApprovalStatus,
  getIndividualApprovalStatus,
  canUserApprove,
  remarksDisplayMap,
  index,
  isProcessing = false,
}) => {
  const approvalStatus = getApprovalStatus(
    transaction.approval,
    transaction.transaction_status
  );
  const Icon = config.icon;

  const grainData = transaction.grain || transaction.grains || [];
  const firstGrain = grainData[0] || {};

  const isPending = transaction.transaction_status === "pending";
  const isRejected = transaction.transaction_status === "rejected";
  const isCompleted = transaction.transaction_status === "completed";

  // Transaction type checks
  const isWithdrawal = transactionType === "withdraw";
  const isLoan = transactionType === "loan";
  const isSell = transactionType === "sell";
  const isDeposit = transactionType === "deposit";

  // Get individual approval statuses
  const adminApproval = getIndividualApprovalStatus(
    transaction.approval?.admin_approval
  );
  const managerApproval = getIndividualApprovalStatus(
    transaction.approval?.manager_approval
  );
  const supervisorApproval = getIndividualApprovalStatus(
    transaction.approval?.supervisor_approval
  );

  // Check if current user can approve
  const canApprove = canUserApprove(transaction);

  // Check if current user already approved
  const userHasApproved = () => {
    switch (userRole) {
      case "admin":
        return adminApproval.status === "approved";
      case "manager":
        return managerApproval.status === "approved";
      case "supervisor":
        return supervisorApproval.status === "approved";
      default:
        return false;
    }
  };

  const hasApproved = userHasApproved() && isPending;

  // Get waiting message for after user approves
  const getWaitingMessage = () => {
    switch (userRole) {
      case "admin":
        return "Fully Approved";
      case "manager":
        return "Awaiting Admin Final Approval";
      case "supervisor":
        return "Awaiting Manager Approval";
      default:
        return "Processing";
    }
  };

  // Get remarks display info for withdrawals
  const getRemarksInfo = () => {
    if (!isWithdrawal || !transaction.remarks) return null;
    return remarksDisplayMap[transaction.remarks] || remarksDisplayMap.other;
  };

  const remarksInfo = getRemarksInfo();

  // Get transaction type label
  const getTransactionLabel = () => {
    switch (transactionType) {
      case "deposit":
        return "Deposit";
      case "withdraw":
        return "Withdrawal";
      case "sell":
        return "Sale";
      case "loan":
        return "Loan";
      default:
        return transactionType;
    }
  };

  // Get action required message
  const getActionRequiredMessage = () => {
    const label = getTransactionLabel();
    switch (userRole) {
      case "admin":
        return `${label} Request - Manager Approved, Awaiting Your Final Decision`;
      case "manager":
        return `${label} Request - Supervisor Approved, Awaiting Your Decision`;
      case "supervisor":
        return `New ${label} Request - Awaiting Your Initial Review`;
      default:
        return "Action Required";
    }
  };

  // Get total amount based on transaction type
  const getTotalAmount = () => {
    if (isLoan) {
      return transaction.loan_amount || transaction.total_amount || 0;
    }
    if (isSell) {
      return transaction.sale_amount || transaction.total_amount || 0;
    }
    return transaction.total_amount || 0;
  };

  // Render transaction-specific info badges
  const renderInfoBadges = () => {
    const badges = [];

    // Common badges for deposit/withdraw
    if (isDeposit || isWithdrawal) {
      if (transaction.warehouse?.name) {
        badges.push(
          <InfoBadge
            key="warehouse"
            icon={<Building className="w-3 h-3 sm:w-4 sm:h-4" />}
            label={transaction.warehouse?.name || "N/A"}
            color="blue"
          />
        );
      }
      if (transaction.warehouse?.location) {
        badges.push(
          <InfoBadge
            key="location"
            icon={<MapPin className="w-3 h-3 sm:w-4 sm:h-4" />}
            label={transaction.warehouse?.location || "N/A"}
            color="purple"
          />
        );
      }
    }

    // Grain quantity (for deposit, withdraw, sell)
    if (!isLoan && firstGrain.quantity_quintal) {
      badges.push(
        <InfoBadge
          key="quantity"
          icon={<Package className="w-3 h-3 sm:w-4 sm:h-4" />}
          label={`${firstGrain.quantity_quintal || 0} Qtl`}
          color="green"
        />
      );
    }

    // Moisture content (for deposit, withdraw)
    if ((isDeposit || isWithdrawal) && firstGrain.moisture_content) {
      badges.push(
        <InfoBadge
          key="moisture"
          icon={<Droplets className="w-3 h-3 sm:w-4 sm:h-4" />}
          label={`${firstGrain.moisture_content || 0}%`}
          color="cyan"
        />
      );
    }

    // Loan specific badges
    if (isLoan) {
      if (transaction.interest_rate) {
        badges.push(
          <InfoBadge
            key="interest"
            icon={<Percent className="w-3 h-3 sm:w-4 sm:h-4" />}
            label={`${transaction.interest_rate}% Interest`}
            color="violet"
          />
        );
      }
      if (transaction.loan_duration || transaction.duration_months) {
        badges.push(
          <InfoBadge
            key="duration"
            icon={<Timer className="w-3 h-3 sm:w-4 sm:h-4" />}
            label={`${
              transaction.loan_duration || transaction.duration_months
            } Months`}
            color="orange"
          />
        );
      }
      if (transaction.collateral_value) {
        badges.push(
          <InfoBadge
            key="collateral"
            icon={<Shield className="w-3 h-3 sm:w-4 sm:h-4" />}
            label={formatRupee(transaction.collateral_value)}
            color="green"
          />
        );
      }
    }

    // Sell specific badges
    if (isSell) {
      if (transaction.buyer_name) {
        badges.push(
          <InfoBadge
            key="buyer"
            icon={<User className="w-3 h-3 sm:w-4 sm:h-4" />}
            label={transaction.buyer_name}
            color="blue"
          />
        );
      }
      if (transaction.sale_price || firstGrain.price_per_quintal) {
        badges.push(
          <InfoBadge
            key="price"
            icon={<IndianRupee className="w-3 h-3 sm:w-4 sm:h-4" />}
            label={`${formatRupee(
              transaction.sale_price || firstGrain.price_per_quintal
            )}/Qtl`}
            color="emerald"
          />
        );
      }
    }

    // Date badge (for all)
    badges.push(
      <InfoBadge
        key="date"
        icon={<Calendar className="w-3 h-3 sm:w-4 sm:h-4" />}
        label={
          transaction.transaction_date || transaction.created_at
            ? new Date(
                transaction.transaction_date || transaction.created_at
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              })
            : "N/A"
        }
        color="orange"
      />
    );

    return badges;
  };

  // Render transaction-specific details section
  const renderTransactionDetails = () => {
    if (isLoan) {
      return (
        <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
          {/* Loan ID Badge */}
          {transaction.loan_id && (
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border border-violet-200">
              <Hash className="w-3.5 h-3.5" />
              Loan: {transaction.loan_id}
            </span>
          )}
          {/* Loan Amount Badge */}
          <span
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border-2 ${
              isRejected
                ? "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200"
                : isCompleted
                ? "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200"
                : canApprove
                ? "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200"
                : hasApproved
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200"
                : `bg-gradient-to-r ${config.lightGradient} ${config.textColor} ${config.borderColor}`
            }`}
          >
            💰 Loan Amount: {formatRupee(transaction.loan_amount || 0)}
          </span>
          {/* EMI Info if available */}
          {transaction.emi_amount && (
            <span className="text-xs sm:text-sm text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
              EMI: {formatRupee(transaction.emi_amount)}/month
            </span>
          )}
        </div>
      );
    }

    if (isSell) {
      return (
        <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
          {/* Grain Category */}
          {firstGrain.category && (
            <span
              className={`
      px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border-2
      ${
        isRejected
          ? "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200"
          : isCompleted
          ? "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200"
          : canApprove
          ? "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200"
          : hasApproved
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200"
          : `bg-gradient-to-r ${config.lightGradient} ${config.textColor} ${config.borderColor}`
      }
    `}
            >
              🌾 {firstGrain.category.grain_type} - Grade{" "}
              {firstGrain.category.quality}
            </span>
          )}
          {/* Sale Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border border-emerald-200">
            <ShoppingCart className="w-3.5 h-3.5" />
            For Sale
          </span>
          {/* Price per quintal */}
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            @{" "}
            {formatRupee(
              transaction.sale_price || firstGrain.price_per_quintal || 0
            )}
            /qtl
          </span>
        </div>
      );
    }

    // Default for deposit/withdraw
    return (
      <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
        {/* Grain Category Badge */}
        {firstGrain.category && (
          <span
            className={`
    px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border-2
    ${
      isRejected
        ? "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200"
        : isCompleted
        ? "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200"
        : canApprove
        ? "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200"
        : hasApproved
        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200"
        : `bg-gradient-to-r ${config.lightGradient} ${config.textColor} ${config.borderColor}`
    }
  `}
          >
            🌾 {firstGrain.category.grain_type} - Grade{" "}
            {firstGrain.category.quality}
          </span>
        )}

        {/* Transaction Type Badge */}
        <span
          className={`
  inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border
  ${
    isDeposit
      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200"
      : "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200"
  }
`}
        >
          {isDeposit ? (
            <>
              <ArrowDownRight className="w-3.5 h-3.5" />
              Deposit
            </>
          ) : (
            <>
              <Wallet className="w-3.5 h-3.5" />
              Withdraw
            </>
          )}
        </span>

        {/* Remarks Badge for Withdrawals */}
        {isWithdrawal && remarksInfo && (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium border ${remarksInfo.color}`}
          >
            <span>{remarksInfo.icon}</span>
            {remarksInfo.label}
          </span>
        )}

        {/* Price per quintal if available */}
        {firstGrain.price_per_quintal && (
          <span className="text-xs sm:text-sm text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
            @ {formatRupee(firstGrain.price_per_quintal)}/qtl
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className={`relative bg-white rounded-xl sm:rounded-2xl border-2 overflow-hidden transition-all duration-500 group ${
        canApprove
          ? "border-amber-300 shadow-lg shadow-amber-100/50 ring-2 ring-amber-200/50 hover:shadow-xl hover:shadow-amber-200/50"
          : hasApproved
          ? "border-blue-200 shadow-md shadow-blue-100/30 hover:shadow-lg"
          : isRejected
          ? "border-red-200 shadow-md shadow-red-100/30 hover:shadow-lg"
          : isCompleted
          ? "border-emerald-200 shadow-md shadow-emerald-100/30 hover:shadow-lg"
          : "border-gray-200 shadow-md hover:shadow-lg hover:border-gray-300"
      } hover:-translate-y-0.5`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Action Required Banner - Only for items user can approve */}
      {canApprove && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white px-3 sm:px-4 py-2 sm:py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="p-1 sm:p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="font-bold text-xs sm:text-sm md:text-base">
                  Action Required
                </span>
              </div>
              <span className="hidden sm:inline-block w-px h-4 bg-white/30"></span>
              <span className="hidden sm:inline text-white/90 text-xs sm:text-sm font-medium">
                {getActionRequiredMessage()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold">PENDING</span>
            </div>
          </div>
        </div>
      )}

      {/* User Already Approved Banner */}
      {hasApproved && (
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 text-white px-3 sm:px-4 py-2 sm:py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1 sm:p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="font-bold text-xs sm:text-sm md:text-base">
                You Approved
              </span>
              <span className="hidden sm:inline-block w-px h-4 bg-white/30"></span>
              <span className="hidden sm:inline text-white/90 text-xs sm:text-sm font-medium">
                {getWaitingMessage()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Clock className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-semibold">WAITING</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Card Content */}
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 sm:gap-5">
          {/* Left Section - Main Info */}
          <div className="flex-1 min-w-0">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              {/* Transaction Type Icon */}
              <div
                className={`
            p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110
            bg-gradient-to-br ${config.gradient}
          `}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
                    {transaction.user?.name || "Unknown User"}
                  </h3>
                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold border ${approvalStatus.color}`}
                  >
                    {approvalStatus.icon}
                    {approvalStatus.text}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-1.5 text-xs sm:text-sm text-gray-500">
                  {transaction.user?.phone_number && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {transaction.user.phone_number}
                    </span>
                  )}
                  {transaction.user?.email && (
                    <span className="hidden sm:inline-flex items-center gap-1">
                      <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="truncate max-w-[150px]">
                        {transaction.user.email}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Transaction Type Specific Details */}
            {renderTransactionDetails()}

            {/* Info Badges Row */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {renderInfoBadges()}
            </div>
          </div>

          {/* Right Section - Amount & Actions */}
          <div className="flex flex-col items-end gap-3 sm:gap-4">
            {/* Total Amount */}
            <div className="text-right">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5 sm:mb-1">
                {isLoan ? "Loan Amount" : isSell ? "Sale Value" : "Total Value"}
              </p>
              <p
                className={`
            text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r 
            ${
              isRejected
                ? "from-red-600 to-rose-600"
                : isCompleted
                ? "from-emerald-600 to-green-600"
                : canApprove
                ? "from-amber-600 to-orange-600"
                : `${config.gradient
                    .replace("from-", "from-")
                    .replace("to-", "to-")}`
            } 
            bg-clip-text text-transparent
          `}
              >
                {formatRupee(getTotalAmount())}
              </p>
              {/* Transaction ID */}
              <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1 font-mono">
                ID: {transaction._id?.slice(-8).toUpperCase() || "N/A"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* View Details Button */}
              <button
                onClick={onView}
                className="
              inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5
              bg-gradient-to-r from-gray-50 to-slate-100 text-gray-700
              rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm
              border border-gray-200 hover:border-gray-300
              shadow-sm hover:shadow-md transition-all duration-300
              hover:-translate-y-0.5 active:scale-95
            "
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">View</span>
              </button>

              {/* Approval/Reject Buttons - Only show when user can approve */}
              {canApprove && (
                <>
                  <button
                    onClick={onReject}
                    disabled={isProcessing}
                    className="
                  inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5
                  bg-gradient-to-r from-red-500 to-rose-600 text-white
                  rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm
                  shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30
                  transition-all duration-300 hover:-translate-y-0.5 active:scale-95
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                "
                  >
                    {isProcessing ? (
                      <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                    <span className="hidden xs:inline">Reject</span>
                  </button>
                  <button
                    onClick={onApprove}
                    disabled={isProcessing}
                    className="
                  inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5
                  bg-gradient-to-r from-emerald-500 to-green-600 text-white
                  rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm
                  shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30
                  transition-all duration-300 hover:-translate-y-0.5 active:scale-95
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                "
                  >
                    {isProcessing ? (
                      <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                    <span className="hidden xs:inline">Approve</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Approval Pipeline - Visual Progress */}
        {isPending && (
          <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <p className="text-xs sm:text-sm font-semibold text-gray-700">
                Approval Pipeline
              </p>
              <span className="text-[10px] sm:text-xs text-gray-500">
                {supervisorApproval.status === "approved" &&
                managerApproval.status === "approved" &&
                adminApproval.status === "approved"
                  ? "3/3 Complete"
                  : supervisorApproval.status === "approved" &&
                    managerApproval.status === "approved"
                  ? "2/3 Complete"
                  : supervisorApproval.status === "approved"
                  ? "1/3 Complete"
                  : "0/3 Complete"}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* Supervisor Stage */}
              <ApprovalStage
                label="Supervisor"
                status={supervisorApproval.status}
                user={supervisorApproval.user}
                isCurrentRole={userRole === "supervisor"}
                config={roleConfig.supervisor}
              />

              {/* Connector */}
              <div
                className={`
            flex-1 h-1 rounded-full transition-all duration-500
            ${
              supervisorApproval.status === "approved"
                ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                : supervisorApproval.status === "rejected"
                ? "bg-gradient-to-r from-red-400 to-red-500"
                : "bg-gray-200"
            }
          `}
              ></div>

              {/* Manager Stage */}
              <ApprovalStage
                label="Manager"
                status={managerApproval.status}
                user={managerApproval.user}
                isCurrentRole={userRole === "manager"}
                config={roleConfig.manager}
              />

              {/* Connector */}
              <div
                className={`
            flex-1 h-1 rounded-full transition-all duration-500
            ${
              managerApproval.status === "approved"
                ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                : managerApproval.status === "rejected"
                ? "bg-gradient-to-r from-red-400 to-red-500"
                : "bg-gray-200"
            }
          `}
              ></div>

              {/* Admin Stage */}
              <ApprovalStage
                label="Admin"
                status={adminApproval.status}
                user={adminApproval.user}
                isCurrentRole={userRole === "admin"}
                config={roleConfig.admin}
              />
            </div>
          </div>
        )}

        {/* Rejection/Completion Info */}
        {(isRejected || isCompleted) && transaction.processed_at && (
          <div
            className={`
        mt-4 sm:mt-5 pt-4 sm:pt-5 border-t 
        ${isRejected ? "border-red-100" : "border-emerald-100"}
      `}
          >
            <div
              className={`
          flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl
          ${
            isRejected
              ? "bg-gradient-to-r from-red-50 to-rose-50 border border-red-200"
              : "bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200"
          }
        `}
            >
              {isRejected ? (
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p
                  className={`text-xs sm:text-sm font-semibold ${
                    isRejected ? "text-red-700" : "text-emerald-700"
                  }`}
                >
                  {isRejected
                    ? "Transaction Rejected"
                    : "Transaction Completed"}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                  Processed on{" "}
                  {new Date(transaction.processed_at).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Info Badge Component
const InfoBadge = ({ icon, label, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold border ${
        colorClasses[color] || colorClasses.gray
      }`}
    >
      {icon}
      <span className="truncate max-w-[80px] sm:max-w-[120px]">{label}</span>
    </span>
  );
};

// Approval Stage Component for Pipeline
const ApprovalStage = ({ label, status, user, isCurrentRole, config }) => {
  const getStageStyles = () => {
    if (status === "approved") {
      return {
        bg: "bg-gradient-to-br from-emerald-500 to-green-600",
        ring: "ring-2 ring-emerald-200 ring-offset-1",
        icon: <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />,
      };
    }
    if (status === "rejected") {
      return {
        bg: "bg-gradient-to-br from-red-500 to-rose-600",
        ring: "ring-2 ring-red-200 ring-offset-1",
        icon: <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />,
      };
    }
    if (isCurrentRole) {
      return {
        bg: "bg-gradient-to-br from-amber-400 to-orange-500",
        ring: "ring-2 ring-amber-200 ring-offset-1 animate-pulse",
        icon: <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />,
      };
    }
    return {
      bg: "bg-gray-200",
      ring: "",
      icon: <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />,
    };
  };

  const styles = getStageStyles();

  return (
    <div className="flex flex-col items-center">
      <div
        className={`p-1.5 sm:p-2 rounded-full ${styles.bg} ${styles.ring} transition-all duration-300`}
      >
        {styles.icon}
      </div>
      <span
        className={`mt-1 text-[9px] sm:text-[10px] font-semibold ${
          status === "approved"
            ? "text-emerald-600"
            : status === "rejected"
            ? "text-red-600"
            : isCurrentRole
            ? "text-amber-600"
            : "text-gray-400"
        }`}
      >
        {label}
      </span>
      {user?.name && (
        <span className="text-[8px] sm:text-[9px] text-gray-400 truncate max-w-[50px] sm:max-w-[70px]">
          {user.name.split(" ")[0]}
        </span>
      )}
    </div>
  );
};

export default Request;