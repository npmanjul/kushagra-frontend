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
  Loader2
} from "lucide-react";
import { formatRupee } from "@/utils/formatting";
import API_BASE_URL from "@/utils/constants";
import RequestModal from "@/components/common/RequestModal";
import toast from "react-hot-toast";

const TransactionTypes = ["deposit", "sell", "withdraw", "loan"];
const StatusFilters = ["all", "pending", "completed", "rejected"];
const ITEMS_PER_PAGE = 5;

const Request = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState("deposit");
  const [statusFilter, setStatusFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total_items: 0,
    total_pages: 0
  });
  
  const [counts, setCounts] = useState({
    all: { count: 0, total_value: 0 },
    pending: { count: 0, total_value: 0 },
    completed: { count: 0, total_value: 0 },
    rejected: { count: 0, total_value: 0 }
  });

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
      description: "Grain deposit transactions"
    },
    sell: {
      icon: ArrowUpRight,
      color: "emerald",
      gradient: "from-emerald-500 to-green-600",
      lightGradient: "from-emerald-50 to-green-50",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200",
      iconBg: "bg-emerald-100",
      label: "Sell",
      description: "Grain sales transactions"
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
      description: "Grain withdrawal transactions"
    },
    loan: {
      icon: CreditCard,
      color: "purple",
      gradient: "from-purple-500 to-pink-600",
      lightGradient: "from-purple-50 to-pink-50",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-100",
      label: "Loan",
      description: "Loan against grain transactions"
    }
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
      activeRing: "ring-slate-400"
    },
    pending: {
      label: "Pending",
      icon: Clock,
      color: "amber",
      bgActive: "bg-gradient-to-r from-amber-500 to-orange-500",
      bgHover: "hover:bg-amber-50",
      textColor: "text-amber-600",
      activeRing: "ring-amber-400"
    },
    completed: {
      label: "Completed",
      icon: CheckCircle,
      color: "green",
      bgActive: "bg-gradient-to-r from-emerald-500 to-green-600",
      bgHover: "hover:bg-emerald-50",
      textColor: "text-emerald-600",
      activeRing: "ring-emerald-400"
    },
    rejected: {
      label: "Rejected",
      icon: Ban,
      color: "red",
      bgActive: "bg-gradient-to-r from-red-500 to-rose-600",
      bgHover: "hover:bg-red-50",
      textColor: "text-red-600",
      activeRing: "ring-red-400"
    }
  };

  // Helper function to get individual approval status
  const getIndividualApprovalStatus = (approval) => {
    if (!approval) {
      return { status: 'pending', text: 'Pending', hasAction: false };
    }

    const hasUser = approval.user && approval.user.name;
    const hasDate = approval.date;

    if (approval.status === true && hasUser) {
      return { status: 'approved', text: 'Approved', hasAction: true, user: approval.user };
    } else if (approval.status === false && (hasUser || hasDate)) {
      return { status: 'rejected', text: 'Rejected', hasAction: true, user: approval.user };
    } else {
      return { status: 'pending', text: 'Pending', hasAction: false };
    }
  };

  // Get overall approval status for display - MANAGER VIEW
  const getApprovalStatus = (approval, transactionStatus) => {
    if (transactionStatus === 'completed') {
      return { 
        text: 'Completed', 
        color: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200', 
        dotColor: 'bg-green-500',
        icon: <CheckCircle className="w-4 h-4" /> 
      };
    }
    
    if (transactionStatus === 'rejected') {
      return { 
        text: 'Rejected', 
        color: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200', 
        dotColor: 'bg-red-500',
        icon: <XCircle className="w-4 h-4" /> 
      };
    }

    if (transactionStatus === 'pending') {
      const adminApproval = getIndividualApprovalStatus(approval?.admin_approval);
      const managerApproval = getIndividualApprovalStatus(approval?.manager_approval);
      const supervisorApproval = getIndividualApprovalStatus(approval?.supervisor_approval);

      if (managerApproval.status === 'rejected') {
        return { 
          text: 'You Rejected', 
          color: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200', 
          dotColor: 'bg-red-500',
          icon: <XCircle className="w-4 h-4" /> 
        };
      }

      if (managerApproval.status === 'approved') {
        return { 
          text: 'Awaiting Admin', 
          color: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200', 
          dotColor: 'bg-blue-500',
          icon: <Clock className="w-4 h-4" /> 
        };
      }

      if (supervisorApproval.status === 'rejected') {
        return { 
          text: 'Supervisor Rejected', 
          color: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200', 
          dotColor: 'bg-red-500',
          icon: <XCircle className="w-4 h-4" /> 
        };
      }

      if (supervisorApproval.status === 'approved') {
        return { 
          text: 'Awaiting Your Approval', 
          color: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200', 
          dotColor: 'bg-amber-500',
          icon: <AlertCircle className="w-4 h-4" /> 
        };
      }
      
      return { 
        text: 'Awaiting Supervisor', 
        color: 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200', 
        dotColor: 'bg-slate-500',
        icon: <Clock className="w-4 h-4" /> 
      };
    }

    return { 
      text: 'Unknown', 
      color: 'bg-gradient-to-r from-gray-100 to-gray-100 text-gray-800 border-gray-200', 
      dotColor: 'bg-gray-500',
      icon: <AlertCircle className="w-4 h-4" /> 
    };
  };

  // Fetch transactions from API
  const fetchTransactions = useCallback(async (status = 'all', page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/approval/pending-approval?status=${status}&page=${page}&limit=${ITEMS_PER_PAGE}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      
      setTransactions(data.data || []);
      setPagination(data.pagination || {
        page: 1,
        limit: ITEMS_PER_PAGE,
        total_items: 0,
        total_pages: 0
      });
      setCounts(data.counts || {
        all: { count: 0, total_value: 0 },
        pending: { count: 0, total_value: 0 },
        completed: { count: 0, total_value: 0 },
        rejected: { count: 0, total_value: 0 }
      });
      
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Effect for fetching transactions
  useEffect(() => {
    if (activeTab === 'deposit') {
      fetchTransactions(statusFilter, currentPage);
    }
  }, [statusFilter, currentPage, activeTab, fetchTransactions]);

  // Handle status filter change - Reset pagination
  const handleStatusFilterChange = (newStatus) => {
    if (newStatus !== statusFilter) {
      setCurrentPage(1); // Reset to page 1
      setStatusFilter(newStatus);
    }
  };

  // Handle tab change - Reset pagination and status filter
  const handleTabChange = (newTab) => {
    if (newTab !== activeTab) {
      setCurrentPage(1); // Reset to page 1
      setStatusFilter("all"); // Reset status filter
      setActiveTab(newTab);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions(statusFilter, currentPage);
  };

  // Filter transactions by search
  const getFilteredTransactions = () => {
    if (!searchValue) return transactions;
    
    return transactions.filter(t =>
      t.user?.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      t._id?.toLowerCase().includes(searchValue.toLowerCase()) ||
      t.warehouse?.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      t.warehouse?.location?.toLowerCase().includes(searchValue.toLowerCase()) ||
      t.grain?.[0]?.category?.grain_type?.toLowerCase().includes(searchValue.toLowerCase()) ||
      t.user?.phone_number?.includes(searchValue) ||
      t.user?.email?.toLowerCase().includes(searchValue.toLowerCase())
    );
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

  // Calculate awaiting manager approval count
  const getAwaitingManagerApproval = () => {
    return transactions.filter(t => {
      if (t.transaction_status !== 'pending') return false;
      const supervisorApproval = getIndividualApprovalStatus(t.approval?.supervisor_approval);
      const managerApproval = getIndividualApprovalStatus(t.approval?.manager_approval);
      return supervisorApproval.status === 'approved' && managerApproval.status === 'pending';
    }).length;
  };

  // MANAGER APPROVAL HANDLER
  const handleApproval = async (id, action) => {
    try {
      const response = await fetch(`${API_BASE_URL}/approval/action-deposite-approval`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ action, transactionId: id })
      });

      if (response.ok) {
        const actionText = action === 'approve' ? 'approved' : 'rejected';
        toast.success(`Transaction ${actionText} successfully`);
        await fetchTransactions(statusFilter, currentPage);
        setSelectedRequest(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || `Failed to ${action} transaction`);
      }
    } catch (error) {
      console.error(`Error processing transaction:`, error);
      toast.error(`Error ${action === 'approve' ? 'approving' : 'rejecting'} transaction`);
    }
  };

  // Loading state
  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-3 sm:inset-4 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute inset-3 sm:inset-4 border-4 border-indigo-500 rounded-full border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-6 sm:mt-8 text-gray-700 font-semibold text-base sm:text-lg">Loading transactions...</p>
          <p className="mt-2 text-gray-400 text-xs sm:text-sm">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto  space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100/80 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -mr-32 sm:-mr-48 -mt-32 sm:-mt-48"></div>
          <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-tr from-indigo-100/30 to-transparent rounded-full -ml-24 sm:-ml-32 -mb-24 sm:-mb-32"></div>
          
          <div className="relative p-4 sm:p-6 md:p-8">
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Title Section */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg shadow-blue-500/25">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    Manager Dashboard
                  </span>
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Active
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                  Request Management
                </h1>
                <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-xl">
                  Review and approve transactions after supervisor approval
                </p>
              </div>
              
              {/* Search Section */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, ID, warehouse..."
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
                    ${refreshing ? 'cursor-not-allowed' : ''}
                  `}
                >
                  <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Type Tabs */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100/80 p-1.5 sm:p-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            {TransactionTypes.map(type => {
              const config = transactionConfig[type];
              const Icon = config.icon;
              const isActive = activeTab === type;
              
              const tabCount = type === 'deposit' ? counts.all.count : 0;
              const pendingCount = type === 'deposit' ? counts.pending.count : 0;
              
              return (
                <button
                  key={type}
                  onClick={() => handleTabChange(type)}
                  className={`
                    relative p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl transition-all duration-500 group overflow-hidden
                    ${isActive 
                      ? `bg-gradient-to-r ${config.gradient} text-white shadow-xl shadow-${config.color}-500/25 scale-[1.02]` 
                      : 'bg-gray-50/80 hover:bg-gray-100 text-gray-700 hover:scale-[1.01]'
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                  )}
                  <div className="relative flex items-center gap-2 sm:gap-3">
                    <div className={`
                      p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300
                      ${isActive 
                        ? 'bg-white/20 backdrop-blur-sm shadow-inner' 
                        : `${config.bgColor} group-hover:scale-110`
                      }
                    `}>
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-white' : config.textColor}`} />
                    </div>
                    <div className="text-left min-w-0">
                      <p className={`font-bold text-sm sm:text-base md:text-lg truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>
                        {config.label}
                      </p>
                      <p className={`text-xs sm:text-sm truncate ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                        {type === 'deposit' ? `${tabCount} total` : 'Coming soon'}
                      </p>
                    </div>
                  </div>
                  {pendingCount > 0 && type === 'deposit' && (
                    <div className="absolute -top-1 -right-1 min-w-[22px] sm:min-w-[28px] h-5 sm:h-7 px-1.5 sm:px-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">
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
            subValue={formatRupee(counts.all.total_value)}
            icon={<Package className="w-4 h-4 sm:w-5 sm:h-5" />}
            gradient="from-blue-500 to-indigo-600"
            lightGradient="from-blue-50 to-indigo-50"
          />
          <StatCard
            title="Needs Action"
            value={getAwaitingManagerApproval()}
            icon={<AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
            gradient="from-amber-500 to-orange-500"
            lightGradient="from-amber-50 to-orange-50"
            highlight={getAwaitingManagerApproval() > 0}
          />
          <StatCard
            title="Pending"
            value={counts.pending.count}
            subValue={formatRupee(counts.pending.total_value)}
            icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
            gradient="from-yellow-500 to-amber-500"
            lightGradient="from-yellow-50 to-amber-50"
          />
          <StatCard
            title="Completed"
            value={counts.completed.count}
            subValue={formatRupee(counts.completed.total_value)}
            icon={<CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
            gradient="from-emerald-500 to-green-600"
            lightGradient="from-emerald-50 to-green-50"
          />
          <StatCard
            title="Rejected"
            value={counts.rejected.count}
            subValue={formatRupee(counts.rejected.total_value)}
            icon={<XCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
            gradient="from-red-500 to-rose-600"
            lightGradient="from-red-50 to-rose-50"
          />
          <StatCard
            title="Total Value"
            value={formatRupee(counts.all.total_value)}
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
                {StatusFilters.map(status => {
                  const config = statusConfig[status];
                  const Icon = config.icon;
                  const isActive = statusFilter === status;
                  const isDisabled = activeTab !== "deposit";
                  
                  const count = counts[status]?.count || 0;

                  return (
                    <button
                      key={status}
                      onClick={() => !isDisabled && handleStatusFilterChange(status)}
                      disabled={isDisabled}
                      className={`
                        flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl 
                        font-medium text-xs sm:text-sm transition-all duration-300
                        ${isActive 
                          ? `${config.bgActive} text-white shadow-lg ring-2 ${config.activeRing} ring-offset-1` 
                          : `${config.textColor} ${config.bgHover} bg-white border border-gray-200 hover:shadow-md`
                        }
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">{config.label}</span>
                      <span className={`
                        ml-0.5 sm:ml-1 px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-bold min-w-[20px] sm:min-w-[26px] text-center
                        ${isActive 
                          ? 'bg-white/25 text-white' 
                          : 'bg-gray-100 text-gray-700'
                        }
                      `}>
                        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : count}
                      </span>
                    </button>
                  );
                })}
              </div>
              
              {activeTab !== "deposit" && (
                <span className="text-xs sm:text-sm text-gray-500 italic bg-gray-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                  🔒 Filter for Deposit only
                </span>
              )}
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
                  <span className="text-gray-500 font-medium text-sm sm:text-base">Loading transactions...</span>
                </div>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {filteredTransactions.map((transaction, index) => (
                  <TransactionCard
                    key={transaction._id}
                    transaction={transaction}
                    config={transactionConfig[activeTab]}
                    onApprove={() => handleApproval(transaction._id, 'approve')}
                    onReject={() => handleApproval(transaction._id, 'reject')}
                    onView={() => setSelectedRequest(transaction)}
                    getApprovalStatus={getApprovalStatus}
                    getIndividualApprovalStatus={getIndividualApprovalStatus}
                    index={index}
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
                    {((pagination.page - 1) * pagination.limit) + 1}
                  </span>{" "}
                  -{" "}
                  <span className="font-bold text-gray-900">
                    {Math.min(pagination.page * pagination.limit, pagination.total_items)}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-gray-900">{pagination.total_items}</span>
                </div>

                {/* Right: Pagination controls */}
                <div className="flex items-center gap-1 order-1 sm:order-2">
                  {/* First Page */}
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className={`
                      p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all duration-300
                      ${currentPage === 1
                        ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                        : 'border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-md active:scale-95'
                      }
                    `}
                    title="First Page"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`
                      p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all duration-300
                      ${currentPage === 1
                        ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                        : 'border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-md active:scale-95'
                      }
                    `}
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2">
                    {(() => {
                      const pages = [];
                      const maxVisiblePages = window?.innerWidth < 640 ? 3 : 5;
                      const totalPages = pagination.total_pages;
                      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                      if (endPage - startPage + 1 < maxVisiblePages) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                      }

                      // First page indicator
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
                            <span key="dots-start" className="px-1 sm:px-2 text-gray-400 text-xs sm:text-sm">
                              •••
                            </span>
                          );
                        }
                      }

                      // Visible pages
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => goToPage(i)}
                            className={`
                              px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300
                              ${currentPage === i
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                                : 'text-gray-600 hover:bg-white hover:shadow-md active:scale-95'
                              }
                            `}
                          >
                            {i}
                          </button>
                        );
                      }

                      // Last page indicator
                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(
                            <span key="dots-end" className="px-1 sm:px-2 text-gray-400 text-xs sm:text-sm">
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

                  {/* Next Page */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === pagination.total_pages}
                    className={`
                      p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all duration-300
                      ${currentPage === pagination.total_pages
                        ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                        : 'border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-md active:scale-95'
                      }
                    `}
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === pagination.total_pages}
                    className={`
                      p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all duration-300
                      ${currentPage === pagination.total_pages
                        ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                        : 'border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-md active:scale-95'
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
          onClose={() => setSelectedRequest(null)}
          onApprove={() => handleApproval(selectedRequest._id, 'approve')}
          onReject={() => handleApproval(selectedRequest._id, 'reject')}
          getApprovalStatus={getApprovalStatus}
          getIndividualApprovalStatus={getIndividualApprovalStatus}
          userRole="manager"
        />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, subValue, icon, gradient, lightGradient, isAmount = false, highlight = false }) => (
  <div className={`
    relative bg-gradient-to-br ${lightGradient} rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 
    border border-gray-100/80 overflow-hidden group hover:shadow-lg hover:shadow-gray-200/50 
    transition-all duration-300 hover:-translate-y-0.5
    ${highlight ? 'ring-2 ring-amber-400 ring-offset-2' : ''}
  `}>
    <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-white/60 to-transparent rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10 group-hover:scale-150 transition-transform duration-500"></div>
    <div className="relative">
      <div className="flex items-start justify-between mb-1.5 sm:mb-2">
        <div className={`p-1.5 sm:p-2 md:p-2.5 bg-gradient-to-br ${gradient} rounded-lg sm:rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        {highlight && (
          <span className="flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-amber-500"></span>
          </span>
        )}
      </div>
      <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1">{title}</p>
      <p className={`${isAmount ? 'text-sm sm:text-lg md:text-xl' : 'text-xl sm:text-2xl md:text-3xl'} font-bold text-gray-900 truncate`}>
        {value}
      </p>
      {subValue && (
        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 truncate">{subValue}</p>
      )}
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ searchValue, statusFilter, activeTab, config, onClearSearch }) => {
  const Icon = config.icon;
  
  const getEmptyMessage = () => {
    if (searchValue) {
      return {
        title: `No results found`,
        subtitle: `No transactions match "${searchValue}"`
      };
    }
    switch (statusFilter) {
      case 'pending':
        return {
          title: 'No pending transactions',
          subtitle: 'All transactions have been processed. Great job!'
        };
      case 'completed':
        return {
          title: 'No completed transactions',
          subtitle: 'Completed transactions will appear here'
        };
      case 'rejected':
        return {
          title: 'No rejected transactions',
          subtitle: 'No transactions have been rejected yet'
        };
      default:
        return {
          title: 'No transactions found',
          subtitle: 'Transactions will appear here when available'
        };
    }
  };

  const message = getEmptyMessage();
  
  return (
    <div className="text-center py-12 sm:py-16 md:py-24">
      <div className={`
        inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 
        ${config.bgColor} rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-lg
      `}>
        <Icon className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${config.textColor}`} />
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

// Transaction Card Component
const TransactionCard = ({ transaction, config, onApprove, onReject, onView, getApprovalStatus, getIndividualApprovalStatus, index }) => {
  const approvalStatus = getApprovalStatus(transaction.approval, transaction.transaction_status);
  const Icon = config.icon;
  
  const grainData = transaction.grain || transaction.grains || [];
  const firstGrain = grainData[0] || {};

  const isPending = transaction.transaction_status === 'pending';
  const isRejected = transaction.transaction_status === 'rejected';
  const isCompleted = transaction.transaction_status === 'completed';

  const adminApproval = getIndividualApprovalStatus(transaction.approval?.admin_approval);
  const managerApproval = getIndividualApprovalStatus(transaction.approval?.manager_approval);
  const supervisorApproval = getIndividualApprovalStatus(transaction.approval?.supervisor_approval);

  const canManagerApprove = isPending && 
    supervisorApproval.status === 'approved' && 
    managerApproval.status === 'pending';

  return (
    <div 
      className={`
        group bg-white rounded-xl sm:rounded-2xl border-2 transition-all duration-500 overflow-hidden
        ${canManagerApprove 
          ? 'border-amber-300 hover:border-amber-400 bg-gradient-to-br from-amber-50/50 to-yellow-50/30 shadow-lg shadow-amber-100/50' 
          : isRejected 
          ? 'border-red-200 hover:border-red-300 bg-gradient-to-br from-red-50/30 to-rose-50/20' 
          : isCompleted 
          ? 'border-emerald-200 hover:border-emerald-300 bg-gradient-to-br from-emerald-50/30 to-green-50/20'
          : isPending
          ? 'border-gray-200 hover:border-gray-300 bg-gradient-to-br from-gray-50/30 to-slate-50/20'
          : 'border-gray-200 hover:border-gray-300'
        }
        hover:shadow-xl hover:-translate-y-0.5
      `}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Action Required Banner */}
      {canManagerApprove && (
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 px-3 sm:px-4 py-2 sm:py-2.5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-pulse"></div>
          <div className="relative flex items-center gap-2 text-amber-900">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-bold">⚡ Action Required - Awaiting Your Approval</span>
          </div>
        </div>
      )}
      
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col gap-4">
          {/* Top Section: Icon + Main Info */}
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Icon */}
            <div className={`
              p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border-2 shrink-0
              ${canManagerApprove
                ? 'bg-gradient-to-br from-amber-100 to-yellow-100 border-amber-200'
                : isRejected 
                ? 'bg-gradient-to-br from-red-100 to-rose-100 border-red-200' 
                : isCompleted
                ? 'bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-200'
                : `bg-gradient-to-br ${config.lightGradient} ${config.borderColor}`
              }
            `}>
              <Icon className={`
                w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7
                ${canManagerApprove
                  ? 'text-amber-700'
                  : isRejected 
                  ? 'text-red-700' 
                  : isCompleted 
                  ? 'text-emerald-700'
                  : config.textColor
                }
              `} />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2 sm:mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 truncate">
                    {transaction.user?.name || 'Unknown User'}
                  </h3>
                  <span className="px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-600 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold capitalize">
                    {transaction.user?.role || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className={`
                    inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold border
                    ${approvalStatus.color}
                  `}>
                    <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${approvalStatus.dotColor} ${isPending ? 'animate-pulse' : ''}`}></span>
                    <span className="hidden xs:inline">{approvalStatus.text}</span>
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-400 font-mono bg-gray-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                    #{transaction._id?.slice(-6).toUpperCase() || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 text-xs sm:text-sm text-gray-500">
                {transaction.user?.phone_number && (
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
                    <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="text-[10px] sm:text-xs">{transaction.user.phone_number}</span>
                  </div>
                )}
                {transaction.user?.email && (
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
                    <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="text-[10px] sm:text-xs truncate max-w-[100px] sm:max-w-[150px]">{transaction.user.email}</span>
                  </div>
                )}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 sm:gap-2 md:gap-3 mb-3 sm:mb-4">
                <InfoBadge
                  icon={<Building className="w-3 h-3 sm:w-4 sm:h-4" />}
                  label={transaction.warehouse?.name || 'N/A'}
                  color="blue"
                />
                <InfoBadge
                  icon={<MapPin className="w-3 h-3 sm:w-4 sm:h-4" />}
                  label={transaction.warehouse?.location || 'N/A'}
                  color="purple"
                />
                <InfoBadge
                  icon={<Package className="w-3 h-3 sm:w-4 sm:h-4" />}
                  label={`${firstGrain.quantity_quintal || 0} Qtl`}
                  color="green"
                />
                <InfoBadge
                  icon={<Droplets className="w-3 h-3 sm:w-4 sm:h-4" />}
                  label={`${firstGrain.moisture_content || 0}%`}
                  color="cyan"
                />
                <InfoBadge
                  icon={<Calendar className="w-3 h-3 sm:w-4 sm:h-4" />}
                  label={transaction.transaction_date 
                    ? new Date(transaction.transaction_date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short'
                      }) 
                    : 'N/A'}
                  color="orange"
                />
              </div>

              {/* Grain Category */}
              {firstGrain.category && (
                <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                  <span className={`
                    px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border-2
                    ${isRejected 
                      ? 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200' 
                      : isCompleted
                      ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200'
                      : `bg-gradient-to-r ${config.lightGradient} ${config.textColor} ${config.borderColor}`
                    }
                  `}>
                    🌾 {firstGrain.category.grain_type} - Grade {firstGrain.category.quality}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">
                    @ {formatRupee(firstGrain.price_per_quintal || 0)}/qtl
                  </span>
                </div>
              )}

              {/* Approval Flow - Mobile Optimized */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <ApprovalBadge
                  label="Supervisor"
                  approvalData={supervisorApproval}
                />
                <span className="text-gray-300 text-xs">→</span>
                <ApprovalBadge
                  label="Manager"
                  approvalData={managerApproval}
                  isCurrentUser={true}
                />
                <span className="text-gray-300 text-xs">→</span>
                <ApprovalBadge
                  label="Admin"
                  approvalData={adminApproval}
                />
              </div>

              {/* Remarks */}
              {transaction.remarks && (
                <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg sm:rounded-xl mb-3 sm:mb-4 border border-gray-100">
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                    <span className="font-semibold text-gray-700">📝</span> {transaction.remarks}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section: Amount + Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100">
            {/* Total Amount */}
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wider">Total Amount</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {formatRupee(transaction.total_amount || 0)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {canManagerApprove && (
                <>
                  <button
                    onClick={onApprove}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/25 font-semibold text-xs sm:text-sm"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={onReject}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-red-500/25 font-semibold text-xs sm:text-sm"
                  >
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Reject</span>
                  </button>
                </>
              )}
              <button
                onClick={onView}
                className={`
                  ${canManagerApprove ? '' : 'flex-1 sm:flex-none'} 
                  flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 
                  bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl 
                  transition-all duration-300 hover:scale-105 active:scale-95 font-semibold text-xs sm:text-sm
                `}
              >
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>View</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Approval Badge Component
const ApprovalBadge = ({ label, approvalData, isCurrentUser = false }) => {
  const getStatusStyles = () => {
    switch (approvalData.status) {
      case 'approved':
        return {
          bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
          icon: <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        };
      case 'rejected':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-rose-50',
          border: 'border-red-200',
          text: 'text-red-700',
          icon: <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        };
      default:
        return {
          bg: isCurrentUser ? 'bg-gradient-to-r from-amber-50 to-yellow-50' : 'bg-gray-50',
          border: isCurrentUser ? 'border-amber-300' : 'border-gray-200',
          text: isCurrentUser ? 'text-amber-700' : 'text-gray-500',
          icon: <Clock className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isCurrentUser ? 'animate-pulse' : ''}`} />
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div className={`
      flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold
      ${styles.bg} ${styles.text} border ${styles.border}
      ${isCurrentUser && approvalData.status === 'pending' ? 'ring-1 sm:ring-2 ring-amber-300 ring-offset-1' : ''}
      transition-all duration-300
    `}>
      {styles.icon}
      <span className="hidden xs:inline">{label}</span>
      <span className="xs:hidden">{label.slice(0, 3)}</span>
    </div>
  );
};

// Info Badge Component
const InfoBadge = ({ icon, label, color = "gray" }) => {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    gray: "bg-gray-50 text-gray-700 border-gray-100"
  };

  return (
    <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl border ${colorStyles[color]} transition-all hover:scale-105`}>
      <span className="opacity-70 shrink-0">{icon}</span>
      <span className="text-[10px] sm:text-xs md:text-sm font-medium truncate">{label}</span>
    </div>
  );
};

export default Request;