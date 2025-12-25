import React, { useState, useEffect } from "react";
import {
  X,
  Filter,
  Calendar,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  RefreshCw,
  Warehouse,
  DollarSign,
  Eye,
  FileDown,
  SlidersHorizontal,
  Package,
  TrendingUp,
  TrendingDown,
  Clock,
  XCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Banknote,
  Wheat,
  User,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Droplets,
  Scale,
} from "lucide-react";
import API_BASE_URL from "@/utils/constants";
import handlePrint from "@/utils/printPDF";

const TransactionFilterModal = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState({
    transaction_type: "",
    page: 1,
    limit: 10,
    start_date: "",
    end_date: "",
    status: "",
    search: "",
    min_amount: "",
    max_amount: "",
    grain_type: "",
    warehouse_id: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
  });
  const [transactionCounts, setTransactionCounts] = useState({
    sell: 0,
    deposit: 0,
    withdraw: 0,
    loan: 0,
  });
  const [showFilters, setShowFilters] = useState(true);

  // Dropdown options based on API
  const transactionTypes = [
    { value: "", label: "All Types" },
    { value: "deposit", label: "Deposit" },
    { value: "withdraw", label: "Withdraw" },
    { value: "sell", label: "Sell" },
    { value: "loan", label: "Loan" },
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "rejected", label: "Rejected" },
    { value: "failed", label: "Failed" },
  ];

  const grainTypes = [
    { value: "", label: "All Grains" },
    { value: "Wheat", label: "Wheat" },
    { value: "Rice", label: "Rice" },
    { value: "Corn", label: "Corn" },
    { value: "Barley", label: "Barley" },
    { value: "Soybean", label: "Soybean" },
    { value: "Oats", label: "Oats" },
  ];

  const limitOptions = [10, 20, 50, 100];

  // Build query string
  const buildQueryString = (customFilters = filters) => {
    const params = new URLSearchParams();
    Object.entries(customFilters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params.append(key, value);
      }
    });
    return params.toString();
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const queryString = buildQueryString();
      const response = await fetch(
        `${API_BASE_URL}/transaction/getalltransactions?${queryString}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const result = await response.json();

      if (result.success) {
        setTransactions(result.data || []);
        setPagination(
          result.pagination || {
            currentPage: 1,
            limit: 10,
            totalRecords: 0,
            totalPages: 0,
          }
        );
        setTransactionCounts(
          result.transactionCounts || {
            sell: 0,
            deposit: 0,
            withdraw: 0,
            loan: 0,
          }
        );
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Download all transactions
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const downloadFilters = { ...filters, limit: 10000, page: 1 };
      const queryString = buildQueryString(downloadFilters);

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/transaction/getalltransactions?${queryString}`
      );
      const result = await response.json();

      if (result.success) {
        downloadAsCSV(result.data || []);
      }
    } catch (error) {
      console.error("Error downloading transactions:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Download as CSV
  const downloadAsCSV = (data) => {
    if (!data.length) return;

    const headers = [
      "Transaction ID",
      "Type",
      "Status",
      "Farmer Name",
      "Farmer ID",
      "Phone",
      "Warehouse",
      "Location",
      "Grain Type",
      "Quality",
      "Quantity (Quintal)",
      "Price/Quintal",
      "Moisture %",
      "Total Amount",
      "Remarks",
      "Date",
    ];

    const rows = data.map((txn) => {
      const grain = txn.grain?.[0] || {};
      return [
        txn._id,
        txn.transaction_type,
        txn.transaction_status,
        txn.user_id?.name || "N/A",
        txn.user_id?.farmerProfile?.farmerId || "N/A",
        txn.user_id?.phone_number || "N/A",
        txn.warehouse_id?.name || "N/A",
        txn.warehouse_id?.location || "N/A",
        grain.category_id?.grain_type || "N/A",
        grain.category_id?.quality || "N/A",
        grain.quantity_quintal || 0,
        grain.price_per_quintal || 0,
        grain.moisture_content || 0,
        txn.total_amount || 0,
        txn.remarks || "",
        new Date(txn.transaction_date).toLocaleDateString(),
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      transaction_type: "",
      page: 1,
      limit: 10,
      start_date: "",
      end_date: "",
      status: "",
      search: "",
      min_amount: "",
      max_amount: "",
      grain_type: "",
      warehouse_id: "",
    });
  };

  // Handle input change
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  // Pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  // Count active filters
  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => value !== "" && !["page", "limit"].includes(key)
  ).length;

  // Get status badge style
  const getStatusStyle = (status) => {
    const styles = {
      completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      processing: "bg-blue-100 text-blue-700 border-blue-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return (
      styles[status?.toLowerCase()] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      completed: <CheckCircle className="h-3.5 w-3.5" />,
      pending: <Clock className="h-3.5 w-3.5" />,
      processing: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
      cancelled: <XCircle className="h-3.5 w-3.5" />,
    };
    return icons[status?.toLowerCase()] || null;
  };

  // Get transaction type config
  const getTypeConfig = (type) => {
    const config = {
      deposit: {
        icon: <ArrowDownToLine className="h-4 w-4" />,
        color: "text-green-600",
        bgColor: "bg-green-100",
        label: "Deposit",
      },
      withdraw: {
        icon: <ArrowUpFromLine className="h-4 w-4" />,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        label: "Withdraw",
      },
      sell: {
        icon: <TrendingUp className="h-4 w-4" />,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        label: "Sell",
      },
      loan: {
        icon: <Banknote className="h-4 w-4" />,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        label: "Loan",
      },
    };
    return (
      config[type?.toLowerCase()] || {
        icon: <Package className="h-4 w-4" />,
        color: "text-gray-600",
        bgColor: "bg-gray-100",
        label: type || "Unknown",
      }
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  useEffect(() => {
    if (isOpen) {
      fetchTransactions();
    }
  }, [isOpen, filters.page, filters.limit]);

  // Apply filters on search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (isOpen) {
        fetchTransactions();
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [filters.search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-2 md:inset-4 lg:inset-6 flex items-center justify-center">
        <div className="relative w-full h-full max-w-[1600px] mx-auto flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Transaction Explorer
                  </h2>
                  <p className="text-sm text-white/70">
                    Filter, view and export transactions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Transaction Count Stats */}
                <div className="hidden lg:flex items-center gap-2 mr-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg">
                    <ArrowDownToLine className="h-4 w-4 text-green-300" />
                    <span className="text-white text-sm font-medium">
                      {transactionCounts.deposit}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg">
                    <ArrowUpFromLine className="h-4 w-4 text-orange-300" />
                    <span className="text-white text-sm font-medium">
                      {transactionCounts.withdraw}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-blue-300" />
                    <span className="text-white text-sm font-medium">
                      {transactionCounts.sell}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg">
                    <Banknote className="h-4 w-4 text-purple-300" />
                    <span className="text-white text-sm font-medium">
                      {transactionCounts.loan}
                    </span>
                  </div>
                </div>

                {/* Toggle Filters */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    showFilters
                      ? "bg-white text-purple-600"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        showFilters
                          ? "bg-purple-100 text-purple-600"
                          : "bg-white/30 text-white"
                      }`}
                    >
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Download Button */}
                <button
                  onClick={() => handlePrint({data:transactions,service:"transactions"})}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                >
                  <span className="hidden sm:inline">Download PDF</span>
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-xl text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="flex-shrink-0 bg-gray-50 border-b px-6 py-4">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by farmer name, phone, email, or transaction ID..."
                    value={filters.search}
                    onChange={(e) => handleChange("search", e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none text-sm"
                  />
                </div>

                {/* Filter Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {/* Transaction Type */}
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500">
                      Type
                    </label>
                    <select
                      value={filters.transaction_type}
                      onChange={(e) =>
                        handleChange("transaction_type", e.target.value)
                      }
                      className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none text-sm pr-10"
                    >
                      {transactionTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Status */}
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none text-sm pr-10"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Grain Type */}
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500">
                      Grain
                    </label>
                    <select
                      value={filters.grain_type}
                      onChange={(e) =>
                        handleChange("grain_type", e.target.value)
                      }
                      className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none text-sm pr-10"
                    >
                      {grainTypes.map((grain) => (
                        <option key={grain.value} value={grain.value}>
                          {grain.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Start Date */}
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500">
                      From
                    </label>
                    <input
                      type="date"
                      value={filters.start_date}
                      onChange={(e) =>
                        handleChange("start_date", e.target.value)
                      }
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none text-sm"
                    />
                  </div>

                  {/* End Date */}
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500">
                      To
                    </label>
                    <input
                      type="date"
                      value={filters.end_date}
                      onChange={(e) => handleChange("end_date", e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none text-sm"
                    />
                  </div>

                  {/* Amount Range */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min ₹"
                      value={filters.min_amount}
                      onChange={(e) =>
                        handleChange("min_amount", e.target.value)
                      }
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none text-sm"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="Max ₹"
                      value={filters.max_amount}
                      onChange={(e) =>
                        handleChange("max_amount", e.target.value)
                      }
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Quick Filters & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Quick Filters */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500">Quick:</span>
                    <button
                      onClick={() => {
                        const today = new Date().toISOString().split("T")[0];
                        setFilters((prev) => ({
                          ...prev,
                          start_date: today,
                          end_date: today,
                          page: 1,
                        }));
                      }}
                      className="px-3 py-1.5 text-xs bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-600 hover:text-purple-600 rounded-lg transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => {
                        const today = new Date();
                        const weekAgo = new Date(
                          today.getTime() - 7 * 24 * 60 * 60 * 1000
                        );
                        setFilters((prev) => ({
                          ...prev,
                          start_date: weekAgo.toISOString().split("T")[0],
                          end_date: today.toISOString().split("T")[0],
                          page: 1,
                        }));
                      }}
                      className="px-3 py-1.5 text-xs bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-600 hover:text-purple-600 rounded-lg transition-colors"
                    >
                      Last 7 Days
                    </button>
                    <button
                      onClick={() => {
                        const today = new Date();
                        const monthAgo = new Date(
                          today.getTime() - 30 * 24 * 60 * 60 * 1000
                        );
                        setFilters((prev) => ({
                          ...prev,
                          start_date: monthAgo.toISOString().split("T")[0],
                          end_date: today.toISOString().split("T")[0],
                          page: 1,
                        }));
                      }}
                      className="px-3 py-1.5 text-xs bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-600 hover:text-purple-600 rounded-lg transition-colors"
                    >
                      Last 30 Days
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <button
                      onClick={() =>
                        handleChange("transaction_type", "deposit")
                      }
                      className="px-3 py-1.5 text-xs bg-green-50 border border-green-200 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                    >
                      Deposits
                    </button>
                    <button
                      onClick={() => handleChange("transaction_type", "sell")}
                      className="px-3 py-1.5 text-xs bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                    >
                      Sales
                    </button>
                    <button
                      onClick={() => handleChange("status", "completed")}
                      className="px-3 py-1.5 text-xs bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors"
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => handleChange("status", "pending")}
                      className="px-3 py-1.5 text-xs bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-600 rounded-lg transition-colors"
                    >
                      Pending
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors text-sm"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reset
                    </button>
                    <button
                      onClick={fetchTransactions}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors text-sm font-medium shadow-lg shadow-purple-200"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Filter className="h-4 w-4" />
                      )}
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex-shrink-0 px-6 py-3 bg-white border-b flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {transactions.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {pagination.totalRecords?.toLocaleString()}
                </span>{" "}
                transactions
              </span>
              {activeFiltersCount > 0 && (
                <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}{" "}
                  active
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Per page:</span>
              <select
                value={filters.limit}
                onChange={(e) =>
                  handleChange("limit", parseInt(e.target.value))
                }
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:border-purple-500 outline-none"
              >
                {limitOptions.map((limit) => (
                  <option key={limit} value={limit}>
                    {limit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full py-20">
                <Loader2 className="h-10 w-10 text-purple-600 animate-spin mb-4" />
                <p className="text-gray-500">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-20">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <Package className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">
                  No transactions found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Farmer
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Grain Details
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Warehouse
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Approval
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((txn, index) => {
                    const typeConfig = getTypeConfig(txn.transaction_type);
                    const grain = txn.grain?.[0] || {};

                    return (
                      <tr
                        key={txn._id || index}
                        className="hover:bg-purple-50/50 transition-colors"
                      >
                        {/* Farmer Info */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {txn.user_id?.farmerProfile?.user_image ? (
                                <img
                                  src={txn.user_id.farmerProfile.user_image}
                                  alt={txn.user_id.name}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                                  {txn.user_id?.name?.charAt(0) || "U"}
                                </div>
                              )}
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {txn.user_id?.name || "Unknown"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {txn.user_id?.farmerProfile?.farmerId ||
                                  txn.user_id?.phone_number}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Transaction Type */}
                        <td className="px-4 py-3">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${typeConfig.bgColor}`}
                          >
                            <span className={typeConfig.color}>
                              {typeConfig.icon}
                            </span>
                            <span
                              className={`text-sm font-medium capitalize ${typeConfig.color}`}
                            >
                              {typeConfig.label}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(
                              txn.transaction_status
                            )}`}
                          >
                            {getStatusIcon(txn.transaction_status)}
                            <span className="capitalize">
                              {txn.transaction_status || "Unknown"}
                            </span>
                          </span>
                        </td>

                        {/* Grain Details */}
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Wheat className="h-4 w-4 text-amber-500" />
                              <span className="text-sm font-medium text-gray-800">
                                {grain.category_id?.grain_type || "N/A"}
                              </span>
                              <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                                Grade {grain.category_id?.quality || "-"}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Scale className="h-3 w-3" />
                                {grain.quantity_quintal || 0}{" "}
                                {grain.category_id?.unit || "quintal"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Droplets className="h-3 w-3" />
                                {grain.moisture_content || 0}% moisture
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Warehouse */}
                        <td className="px-4 py-3">
                          {txn.warehouse_id ? (
                            <div className="flex items-start gap-2">
                              <Warehouse className="h-4 w-4 text-blue-500 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  {txn.warehouse_id.name}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {txn.warehouse_id.location}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3 text-right">
                          <div>
                            <span
                              className={`font-bold text-sm ${
                                txn.transaction_type === "sell" ||
                                txn.transaction_type === "withdraw"
                                  ? "text-green-600"
                                  : "text-gray-900"
                              }`}
                            >
                              {formatCurrency(txn.total_amount)}
                            </span>
                            <p className="text-xs text-gray-500">
                              @ ₹{grain.price_per_quintal || 0}/
                              {grain.category_id?.unit || "q"}
                            </p>
                          </div>
                        </td>

                        {/* Approval Status */}
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            {txn.approval_status?.admin_approval?.status && (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                <ShieldCheck className="h-3 w-3" />
                                Admin ✓
                              </span>
                            )}
                            {txn.approval_status?.manager_approval?.status && (
                              <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                                <CheckCircle className="h-3 w-3" />
                                Manager ✓
                              </span>
                            )}
                            {txn.approval_status?.supervisor_approval
                              ?.status && (
                              <span className="inline-flex items-center gap-1 text-xs text-purple-600">
                                <CheckCircle className="h-3 w-3" />
                                Supervisor ✓
                              </span>
                            )}
                            {!txn.approval_status?.admin_approval?.status &&
                              !txn.approval_status?.manager_approval?.status &&
                              !txn.approval_status?.supervisor_approval
                                ?.status && (
                                <span className="text-xs text-gray-400">
                                  Pending
                                </span>
                              )}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm text-gray-700">
                              {txn.transaction_date
                                ? new Date(
                                    txn.transaction_date
                                  ).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {txn.transaction_date
                                ? new Date(
                                    txn.transaction_date
                                  ).toLocaleTimeString("en-IN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : ""}
                            </p>
                          </div>
                        </td>

                        {/* Remarks */}
                        <td className="px-4 py-3">
                          {txn.remarks ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-700 capitalize">
                                {txn.remarks.replace(/_/g, ' ')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">No remarks</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Footer */}
          {transactions.length > 0 && (
            <div className="flex-shrink-0 px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page{" "}
                <span className="font-medium">{pagination.currentPage}</span> of{" "}
                <span className="font-medium">{pagination.totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (
                        pagination.currentPage >=
                        pagination.totalPages - 2
                      ) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                            pagination.currentPage === pageNum
                              ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                              : "text-gray-600 hover:bg-white border border-transparent hover:border-gray-200"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionFilterModal;
