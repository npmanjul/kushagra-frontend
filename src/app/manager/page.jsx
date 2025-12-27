"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Download,
  Users,
  Clock,
  Package,
  DollarSign,
  CheckCircle,
  CreditCard,
  BarChart3,
  Plus,
  Minus,
  Warehouse,
  FileText,
  TrendingUp,
  TrendingDown,
  User,
  UserCircle,
  RefreshCw,
  ArrowRight,
  Activity,
  AlertTriangle,
  ChevronRight,
  Loader2,
  UserCheck,
  Shield,
  Briefcase,
  Wheat,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MapPin,
  XCircle,
  AlertOctagon,
  ShoppingCart,
  Banknote,
  PiggyBank,
} from "lucide-react";
import API_BASE_URL from "@/utils/constants";

export default function Dashboard() {
  const router = useRouter();

  // ===== State Management =====
  const [overviewData, setOverviewData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [marketRates, setMarketRates] = useState({});
  const [marketLoading, setMarketLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeQuickTab, setActiveQuickTab] = useState("all");

  // ===== Fetch Overview Data =====
  useEffect(() => {
    fetchOverviewData();
    fetchRecentTransactions();
    fetchMarketRates();
  }, []);

  const fetchOverviewData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/warehouse/inventory`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch warehouse inventory");
      }
      
      const result = await response.json();
      
      // Handle manager/supervisor response format (single warehouse)
      if (result.warehouseId && result.categories) {
        setOverviewData(result);
      } else if (result.message) {
        setError(result.message);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTransactions = async () => {
    setTransactionsLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/transaction/getalltransactions`,
        {
          params: {
            limit: 6,
            page: 1,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setRecentTransactions(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const fetchMarketRates = async () => {
    setMarketLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/pricehistory/todayprice`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch market prices");
      const data = await response.json();
      setMarketRates(data.todayprice || {});
    } catch (error) {
      console.error("Error fetching market rates:", error);
    } finally {
      setMarketLoading(false);
    }
  };

  // ===== Calculate Totals from Categories =====
  const calculateTotals = () => {
    if (!overviewData?.categories) {
      return {
        deposit: {
          completed: { qty: 0, amount: 0 },
          pending: { qty: 0, amount: 0 },
          rejected: { qty: 0, amount: 0 },
          failed: { qty: 0, amount: 0 },
        },
        sell: {
          completed: { qty: 0, amount: 0 },
          pending: { qty: 0, amount: 0 },
        },
        withdraw: { completed: 0, pending: 0 },
        loan: { completed: 0, pending: 0 },
      };
    }

    return overviewData.categories.reduce(
      (acc, cat) => {
        // Deposit totals
        acc.deposit.completed.qty += cat.deposit?.completed?.qty || 0;
        acc.deposit.completed.amount += cat.deposit?.completed?.amount || 0;
        acc.deposit.pending.qty += cat.deposit?.pending?.qty || 0;
        acc.deposit.pending.amount += cat.deposit?.pending?.amount || 0;
        acc.deposit.rejected.qty += cat.deposit?.rejected?.qty || 0;
        acc.deposit.rejected.amount += cat.deposit?.rejected?.amount || 0;
        acc.deposit.failed.qty += cat.deposit?.failed?.qty || 0;
        acc.deposit.failed.amount += cat.deposit?.failed?.amount || 0;

        // Sell totals
        acc.sell.completed.qty += cat.sell?.completed?.qty || 0;
        acc.sell.completed.amount += cat.sell?.completed?.amount || 0;
        acc.sell.pending.qty += cat.sell?.pending?.qty || 0;
        acc.sell.pending.amount += cat.sell?.pending?.amount || 0;

        // Withdraw totals
        acc.withdraw.completed += cat.withdraw?.completed || 0;
        acc.withdraw.pending += cat.withdraw?.pending || 0;

        // Loan totals
        acc.loan.completed += cat.loan?.completed || 0;
        acc.loan.pending += cat.loan?.pending || 0;

        return acc;
      },
      {
        deposit: {
          completed: { qty: 0, amount: 0 },
          pending: { qty: 0, amount: 0 },
          rejected: { qty: 0, amount: 0 },
          failed: { qty: 0, amount: 0 },
        },
        sell: {
          completed: { qty: 0, amount: 0 },
          pending: { qty: 0, amount: 0 },
        },
        withdraw: { completed: 0, pending: 0 },
        loan: { completed: 0, pending: 0 },
      }
    );
  };

  const totals = calculateTotals();

  // ===== Quick Navigation Tabs =====
  const quickTabs = [
    { id: "all", label: "Overview" },
    { id: "operations", label: "Operations" },
    { id: "inventory", label: "Inventory" },
  ];

  const quickActions = {
    all: [
      {
        title: "Deposit Grain",
        description: "Add new grain stock",
        icon: Plus,
        href: "/manager/deposit",
        bg: "bg-gradient-to-br from-green-500 to-green-600",
        shadow: "shadow-green-200",
      },
      {
        title: "Withdraw Grain",
        description: "Process withdrawals",
        icon: Minus,
        href: "/manager/withdraw",
        bg: "bg-gradient-to-br from-orange-500 to-orange-600",
        shadow: "shadow-orange-200",
      },
      {
        title: "View Requests",
        description: `${totals.deposit.pending.qty + totals.sell.pending.qty} pending`,
        icon: Clock,
        href: "/manager/requests",
        bg: "bg-gradient-to-br from-blue-500 to-blue-600",
        shadow: "shadow-blue-200",
      },
      {
        title: "Transactions",
        description: "View all transactions",
        icon: FileText,
        href: "/manager/transactions",
        bg: "bg-gradient-to-br from-purple-500 to-purple-600",
        shadow: "shadow-purple-200",
      },
    ],
    operations: [
      {
        title: "Deposit Grain",
        description: "Add new grain stock",
        icon: Plus,
        href: "/manager/deposit",
        bg: "bg-gradient-to-br from-green-500 to-green-600",
        shadow: "shadow-green-200",
      },
      {
        title: "Withdraw Grain",
        description: "Process withdrawals",
        icon: Minus,
        href: "/manager/withdraw",
        bg: "bg-gradient-to-br from-orange-500 to-orange-600",
        shadow: "shadow-orange-200",
      },
      {
        title: "Pending Requests",
        description: `${totals.deposit.pending.qty} waiting`,
        icon: Clock,
        href: "/manager/requests",
        bg: "bg-gradient-to-br from-amber-500 to-amber-600",
        shadow: "shadow-amber-200",
      },
      {
        title: "Update Prices",
        description: "Set grain prices",
        icon: TrendingUp,
        href: "/manager/updateprice",
        bg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
        shadow: "shadow-indigo-200",
      },
    ],
    inventory: [
      {
        title: "Warehouses",
        description: "Manage storage",
        icon: Warehouse,
        href: "/manager/warehouses",
        bg: "bg-gradient-to-br from-slate-600 to-slate-700",
        shadow: "shadow-slate-200",
      },
      {
        title: "Update Prices",
        description: "Set grain prices",
        icon: TrendingUp,
        href: "/manager/updateprice",
        bg: "bg-gradient-to-br from-cyan-500 to-cyan-600",
        shadow: "shadow-cyan-200",
      },
      {
        title: "Transactions",
        description: "View history",
        icon: FileText,
        href: "/manager/transactions",
        bg: "bg-gradient-to-br from-rose-500 to-rose-600",
        shadow: "shadow-rose-200",
      },
    ],
  };

  // ===== Utility Functions =====
  const formatRupee = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // ===== Overview Stats Card Component =====
  const OverviewStatCard = ({ title, qty, amount, icon: Icon, gradient, iconBg }) => {
    return (
      <div className={`relative overflow-hidden rounded-2xl ${gradient} p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-20 w-20 rounded-full bg-white/10 blur-xl"></div>
        
        <div className="relative z-10">
          <div className={`inline-flex p-3 rounded-xl ${iconBg} mb-4`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm font-medium text-white/80 uppercase tracking-wide">{title}</h3>
          <div className="mt-3 space-y-1">
            <p className="text-3xl font-bold">{qty} <span className="text-lg font-normal text-white/80">Qt</span></p>
            <p className="text-lg font-semibold text-white/90">{formatRupee(amount)}</p>
          </div>
        </div>
      </div>
    );
  };

  // ===== Mini Stat Card =====
  const MiniStatCard = ({ title, value, icon: Icon, color }) => {
    const colorStyles = {
      green: "bg-green-50 text-green-600 border-green-100",
      amber: "bg-amber-50 text-amber-600 border-amber-100",
      red: "bg-red-50 text-red-600 border-red-100",
      gray: "bg-gray-50 text-gray-600 border-gray-100",
      blue: "bg-blue-50 text-blue-600 border-blue-100",
      purple: "bg-purple-50 text-purple-600 border-purple-100",
    };

    return (
      <div className={`flex items-center gap-3 p-4 rounded-xl border ${colorStyles[color]} transition-all hover:shadow-md`}>
        <div className={`p-2.5 rounded-lg ${color === 'green' ? 'bg-green-100' : color === 'amber' ? 'bg-amber-100' : color === 'red' ? 'bg-red-100' : color === 'blue' ? 'bg-blue-100' : color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    );
  };

  // ===== Loading Skeleton =====
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
          <div>
            <div className="w-48 h-6 bg-gray-200 rounded mb-2"></div>
            <div className="w-32 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-2xl h-40 animate-pulse"></div>
        ))}
      </div>
    </div>
  );

  // ===== Main Render =====
  return (
    <div className="space-y-8 pb-8">
      {/* ===== Header Section ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, manager 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here's what's happening with your warehouse today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              fetchOverviewData();
              fetchRecentTransactions();
              fetchMarketRates();
            }}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 
              rounded-xl text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* ===== Error Alert ===== */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchOverviewData}
            className="ml-auto text-red-600 hover:text-red-800 font-medium text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* ===== Warehouse Info & Overview Stats ===== */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Warehouse Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <Warehouse className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{overviewData?.warehouseName || "Warehouse"}</h2>
                  <div className="flex items-center gap-2 mt-1 text-slate-300">
                    <MapPin className="w-4 h-4" />
                    <span>{overviewData?.warehouseLocation || "Location"}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                  <p className="text-xs text-slate-400">Categories</p>
                  <p className="text-xl font-bold">{overviewData?.categories?.length || 0}</p>
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                  <p className="text-xs text-slate-400">Total Stock</p>
                  <p className="text-xl font-bold">{totals.deposit.completed.qty} Qt</p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Deposit Overview ===== */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Deposit Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <OverviewStatCard
                title="Completed"
                qty={totals.deposit.completed.qty}
                amount={totals.deposit.completed.amount}
                icon={CheckCircle}
                gradient="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700"
                iconBg="bg-white/20"
              />
              <OverviewStatCard
                title="Pending"
                qty={totals.deposit.pending.qty}
                amount={totals.deposit.pending.amount}
                icon={Clock}
                gradient="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600"
                iconBg="bg-white/20"
              />
              <OverviewStatCard
                title="Rejected"
                qty={totals.deposit.rejected.qty}
                amount={totals.deposit.rejected.amount}
                icon={XCircle}
                gradient="bg-gradient-to-br from-red-500 via-red-600 to-rose-700"
                iconBg="bg-white/20"
              />
              <OverviewStatCard
                title="Failed"
                qty={totals.deposit.failed.qty}
                amount={totals.deposit.failed.amount}
                icon={AlertOctagon}
                gradient="bg-gradient-to-br from-slate-500 via-slate-600 to-gray-700"
                iconBg="bg-white/20"
              />
            </div>
          </div>

          {/* ===== Sell & Other Operations ===== */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Sell Overview */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Sell Overview</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Completed</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{totals.sell.completed.qty} Qt</p>
                  <p className="text-sm font-medium text-blue-600 mt-1">{formatRupee(totals.sell.completed.amount)}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">Pending</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{totals.sell.pending.qty} Qt</p>
                  <p className="text-sm font-medium text-amber-600 mt-1">{formatRupee(totals.sell.pending.amount)}</p>
                </div>
              </div>
            </div>

            {/* Withdraw & Loan Overview */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Withdraw & Loan</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-100 rounded-lg">
                      <Minus className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Withdrawals</p>
                      <p className="text-xs text-gray-400">Stock removals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{totals.withdraw.completed} <span className="text-sm font-normal text-green-600">completed</span></p>
                    <p className="text-sm text-amber-600">{totals.withdraw.pending} pending</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-violet-100 rounded-lg">
                      <Banknote className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Loans</p>
                      <p className="text-xs text-gray-400">Financial assistance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{totals.loan.completed} <span className="text-sm font-normal text-green-600">completed</span></p>
                    <p className="text-sm text-amber-600">{totals.loan.pending} pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Category Breakdown ===== */}
          {overviewData?.categories && overviewData.categories.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Wheat className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Category Breakdown</h3>
                </div>
                <span className="text-sm text-gray-500">{overviewData.categories.length} categories</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Grain</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Quality</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-green-600 uppercase tracking-wide">Completed</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-amber-600 uppercase tracking-wide">Pending</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-red-600 uppercase tracking-wide">Rejected</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-blue-600 uppercase tracking-wide">Sold</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {overviewData.categories.map((cat, index) => (
                      <tr key={cat.category_id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 rounded-lg">
                              <Wheat className="w-4 h-4 text-amber-600" />
                            </div>
                            <span className="font-medium text-gray-900">{cat.grain_type}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                            ${cat.quality === 'A' ? 'bg-green-100 text-green-700' : 
                              cat.quality === 'B' ? 'bg-blue-100 text-blue-700' : 
                              'bg-amber-100 text-amber-700'}`}>
                            Grade {cat.quality}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <p className="font-semibold text-gray-900">{cat.deposit?.completed?.qty || 0} Qt</p>
                          <p className="text-xs text-green-600">{formatRupee(cat.deposit?.completed?.amount || 0)}</p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <p className="font-semibold text-gray-900">{cat.deposit?.pending?.qty || 0} Qt</p>
                          <p className="text-xs text-amber-600">{formatRupee(cat.deposit?.pending?.amount || 0)}</p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <p className="font-semibold text-gray-900">{cat.deposit?.rejected?.qty || 0} Qt</p>
                          <p className="text-xs text-red-600">{formatRupee(cat.deposit?.rejected?.amount || 0)}</p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <p className="font-semibold text-gray-900">{cat.sell?.completed?.qty || 0} Qt</p>
                          <p className="text-xs text-blue-600">{formatRupee(cat.sell?.completed?.amount || 0)}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ===== Quick Actions with Tabs ===== */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <div className="flex bg-gray-100 rounded-xl p-1">
            {quickTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveQuickTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    activeQuickTab === tab.id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {quickActions[activeQuickTab]?.map((action) => (
            <button
              key={action.title}
              onClick={() => router.push(action.href)}
              className={`${action.bg} ${action.shadow} p-5 rounded-xl text-white text-left
                hover:scale-105 hover:shadow-xl transition-all duration-300 group`}
            >
              <action.icon className="w-8 h-8 mb-3 opacity-90" />
              <p className="font-semibold text-sm">{action.title}</p>
              <p className="text-xs opacity-80 mt-1">{action.description}</p>
              <ArrowRight
                className="w-4 h-4 mt-3 opacity-0 group-hover:opacity-100 
                transform translate-x-0 group-hover:translate-x-1 transition-all"
              />
            </button>
          ))}
        </div>
      </div>

      {/* ===== Main Content Grid ===== */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Recent Transactions
            </h3>
            <button
              onClick={() => router.push("/manager/transactions")}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            {transactionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent transactions found
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b">
                    <th className="pb-3 font-medium">Transaction</th>
                    <th className="pb-3 font-medium">Grain</th>
                    <th className="pb-3 font-medium">Quantity</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentTransactions.map((txn) => (
                    <tr
                      key={txn._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              txn.transaction_type === "deposit"
                                ? "bg-green-100 text-green-600"
                                : txn.transaction_type === "withdraw"
                                ? "bg-orange-100 text-orange-600"
                                : txn.transaction_type === "sell"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-purple-100 text-purple-600"
                            }`}
                          >
                            {txn.transaction_type === "deposit" ? (
                              <Plus className="w-4 h-4" />
                            ) : txn.transaction_type === "withdraw" ? (
                              <Minus className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {txn.user_id?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {txn.transaction_type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600">
                        {txn.grain?.[0]?.category_id?.grain_type || "-"}
                      </td>
                      <td className="py-4 text-gray-600">
                        {txn.grain?.[0]?.quantity_quintal || 0} Qt
                      </td>
                      <td className="py-4 font-medium text-gray-900">
                        {formatRupee(txn.total_amount || 0)}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize
                          ${
                            txn.transaction_status === "completed"
                              ? "bg-green-100 text-green-700"
                              : txn.transaction_status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {txn.transaction_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Today's Market Rates */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              Today's Market Rates
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Live market price updates
            </p>
          </div>

          {marketLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : Object.keys(marketRates).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No market data available
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
              {marketRates && Object.entries(marketRates).map(
                ([type, priceData]) => {
                  const { max, avg, min, change } = priceData || {};
                  return (
                  <div
                    key={type}
                    className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <Wheat className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{type}</p>
                        <p className="text-xs text-gray-500">Per Quintal</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Max</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {formatRupee(max || 0)}
                          </span>
                          {change && typeof change.max === 'number' && (
                            <span
                              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                                change.max >= 0
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {change.max >= 0 ? (
                                <>
                                  <TrendingUp className="h-3 w-3" />+
                                  {change.max.toFixed(2)}%
                                </>
                              ) : (
                                <>
                                  <TrendingDown className="h-3 w-3" />
                                  {change.max.toFixed(2)}%
                                </>
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avg</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {formatRupee(avg || 0)}
                          </span>
                          {change && typeof change.avg === 'number' && (
                            <span
                              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                                change.avg >= 0
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {change.avg >= 0 ? (
                                <>
                                  <TrendingUp className="h-3 w-3" />+
                                  {change.avg.toFixed(2)}%
                                </>
                              ) : (
                                <>
                                  <TrendingDown className="h-3 w-3" />
                                  {change.avg.toFixed(2)}%
                                </>
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Min</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {formatRupee(min || 0)}
                          </span>
                          {change && typeof change.min === 'number' && (
                            <span
                              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                                change.min >= 0
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {change.min >= 0 ? (
                                <>
                                  <TrendingUp className="h-3 w-3" />+
                                  {change.min.toFixed(2)}%
                                </>
                              ) : (
                                <>
                                  <TrendingDown className="h-3 w-3" />
                                  {change.min.toFixed(2)}%
                                </>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                }
              )}
            </div>
          )}

          <button
            onClick={() => router.push("/manager/updateprice")}
            className="w-full mt-4 py-3 bg-gray-900 text-white rounded-xl font-medium
              hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            Update Prices
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}