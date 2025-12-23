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
      const response = await fetch(`${API_BASE_URL}/overview/admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setOverviewData(result.data);
      } else {
        setError(result.message || "Failed to fetch data");
      }
    } catch (err) {
      setError("Network error. Please try again.");
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

  // ===== Static Data =====
  const stats = {
    totalInventory: 45678,
    monthlyRevenue: 1250000,
    pendingRequests: 23,
    completedToday: 15,
  };

  // ===== Quick Navigation Tabs =====
  const quickTabs = [
    { id: "all", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "operations", label: "Operations" },
    { id: "inventory", label: "Inventory" },
  ];

  const quickActions = {
    all: [
      {
        title: "Deposit Grain",
        description: "Add new grain stock",
        icon: Plus,
        href: "/admin/deposit",
        bg: "bg-gradient-to-br from-green-500 to-green-600",
        shadow: "shadow-green-200",
      },
      {
        title: "Withdraw Grain",
        description: "Process withdrawals",
        icon: Minus,
        href: "/admin/withdraw",
        bg: "bg-gradient-to-br from-orange-500 to-orange-600",
        shadow: "shadow-orange-200",
      },
      {
        title: "View Requests",
        description: `${stats.pendingRequests} pending`,
        icon: Clock,
        href: "/admin/requests",
        bg: "bg-gradient-to-br from-blue-500 to-blue-600",
        shadow: "shadow-blue-200",
      },
      {
        title: "Transactions",
        description: "View all transactions",
        icon: FileText,
        href: "/admin/transactions",
        bg: "bg-gradient-to-br from-purple-500 to-purple-600",
        shadow: "shadow-purple-200",
      },
    ],
    users: [
      {
        title: "Manage Farmers",
        description: `${overviewData?.farmers || 0} registered`,
        icon: Users,
        href: "/admin/farmers",
        bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
        shadow: "shadow-emerald-200",
      },
      {
        title: "Manage Managers",
        description: `${overviewData?.managers || 0} active`,
        icon: UserCircle,
        href: "/admin/managers",
        bg: "bg-gradient-to-br from-blue-500 to-blue-600",
        shadow: "shadow-blue-200",
      },
      {
        title: "Manage Supervisors",
        description: `${overviewData?.supervisors || 0} active`,
        icon: Shield,
        href: "/admin/supervisors",
        bg: "bg-gradient-to-br from-violet-500 to-violet-600",
        shadow: "shadow-violet-200",
      },
      {
        title: "Manage Staff",
        description: `${overviewData?.staff || 0} active`,
        icon: Briefcase,
        href: "/admin/staff",
        bg: "bg-gradient-to-br from-pink-500 to-pink-600",
        shadow: "shadow-pink-200",
      },
      {
        title: "New Employee",
        description: "Onboard employee",
        icon: UserCheck,
        href: "/admin/employee",
        bg: "bg-gradient-to-br from-teal-500 to-teal-600",
        shadow: "shadow-teal-200",
      },
    ],
    operations: [
      {
        title: "Deposit Grain",
        description: "Add new grain stock",
        icon: Plus,
        href: "/admin/deposit",
        bg: "bg-gradient-to-br from-green-500 to-green-600",
        shadow: "shadow-green-200",
      },
      {
        title: "Withdraw Grain",
        description: "Process withdrawals",
        icon: Minus,
        href: "/admin/withdraw",
        bg: "bg-gradient-to-br from-orange-500 to-orange-600",
        shadow: "shadow-orange-200",
      },
      {
        title: "Pending Requests",
        description: `${stats.pendingRequests} waiting`,
        icon: Clock,
        href: "/admin/requests",
        bg: "bg-gradient-to-br from-amber-500 to-amber-600",
        shadow: "shadow-amber-200",
      },
      {
        title: "Update Prices",
        description: "Set grain prices",
        icon: TrendingUp,
        href: "/admin/updateprice",
        bg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
        shadow: "shadow-indigo-200",
      },
    ],
    inventory: [
      {
        title: "Warehouses",
        description: "Manage storage",
        icon: Warehouse,
        href: "/admin/warehouses",
        bg: "bg-gradient-to-br from-slate-600 to-slate-700",
        shadow: "shadow-slate-200",
      },
      {
        title: "Update Prices",
        description: "Set grain prices",
        icon: TrendingUp,
        href: "/admin/updateprice",
        bg: "bg-gradient-to-br from-cyan-500 to-cyan-600",
        shadow: "shadow-cyan-200",
      },
      {
        title: "Transactions",
        description: "View history",
        icon: FileText,
        href: "/admin/transactions",
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

  const getTotalUsers = () => {
    if (!overviewData) return 0;
    return (
      overviewData.farmers +
      overviewData.managers +
      overviewData.supervisors +
      overviewData.staff
    );
  };

  // ===== User Stats Card Component =====
  const UserStatCard = ({
    title,
    value,
    icon: Icon,
    color,
    href,
    subtitle,
  }) => {
    const colorStyles = {
      emerald: {
        bg: "bg-emerald-50",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        border: "border-emerald-100",
        hover: "hover:border-emerald-300 hover:shadow-emerald-100",
      },
      blue: {
        bg: "bg-blue-50",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        border: "border-blue-100",
        hover: "hover:border-blue-300 hover:shadow-blue-100",
      },
      violet: {
        bg: "bg-violet-50",
        iconBg: "bg-violet-100",
        iconColor: "text-violet-600",
        border: "border-violet-100",
        hover: "hover:border-violet-300 hover:shadow-violet-100",
      },
      amber: {
        bg: "bg-amber-50",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        border: "border-amber-100",
        hover: "hover:border-amber-300 hover:shadow-amber-100",
      },
    };

    const styles = colorStyles[color] || colorStyles.emerald;

    return (
      <div
        onClick={() => router.push(href)}
        className={`bg-white rounded-2xl border-2 ${styles.border} ${styles.hover} 
          p-6 cursor-pointer transition-all duration-300 hover:shadow-lg group`}
      >
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-xl ${styles.iconBg}`}>
            <Icon className={`w-6 h-6 ${styles.iconColor}`} />
          </div>
          <ChevronRight
            className="w-5 h-5 text-gray-400 group-hover:text-gray-600 
            group-hover:translate-x-1 transition-all"
          />
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm font-medium text-gray-600 mt-1">{title}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
      </div>
    );
  };

  // ===== System Stats Card =====
  const SystemStatCard = ({ title, value, icon: Icon, trend, trendUp }) => {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gray-100 rounded-xl">
              <Icon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                {title}
              </p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
            </div>
          </div>
          {trend && (
            <div
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium
              ${
                trendUp
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {trendUp ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span>{trend}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ===== Loading Skeleton =====
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
          <div className="mt-4">
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // ===== Main Render =====
  return (
    <div className="space-y-8 pb-8">
      {/* ===== Header Section ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, Admin 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here's what's happening with your warehouse today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchOverviewData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 
              rounded-xl text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          {/* <button
            className="flex items-center space-x-2 px-4 py-2.5 bg-gray-900 
              rounded-xl text-white hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Report</span>
          </button> */}
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

      {/* ===== User Statistics Section ===== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            User Overview
          </h2>
          <span className="text-sm text-gray-500">
            Total:{" "}
            <span className="font-semibold text-gray-900">
              {getTotalUsers()}
            </span>{" "}
            users
          </span>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <UserStatCard
              title="Farmers"
              value={overviewData?.farmers || 0}
              icon={Wheat}
              color="emerald"
              href="/admin/farmers"
              subtitle="Registered farmers"
            />
            <UserStatCard
              title="Managers"
              value={overviewData?.managers || 0}
              icon={UserCircle}
              color="blue"
              href="/admin/managers"
              subtitle="Warehouse managers"
            />
            <UserStatCard
              title="Supervisors"
              value={overviewData?.supervisors || 0}
              icon={Shield}
              color="violet"
              href="/admin/supervisors"
              subtitle="Field supervisors"
            />
            <UserStatCard
              title="Staff"
              value={overviewData?.staff || 0}
              icon={Briefcase}
              color="amber"
              href="/admin/staff"
              subtitle="Support staff"
            />
          </div>
        )}
      </div>

      {/* ===== System Statistics ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SystemStatCard
          title="Total Inventory"
          value={`${stats.totalInventory.toLocaleString()} Qt`}
          icon={Package}
          trend="8%"
          trendUp={true}
        />
        <SystemStatCard
          title="Monthly Revenue"
          value={formatRupee(stats.monthlyRevenue)}
          icon={DollarSign}
          trend="15%"
          trendUp={true}
        />
        <SystemStatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={Clock}
          trend="5%"
          trendUp={false}
        />
        <SystemStatCard
          title="Completed Today"
          value={stats.completedToday}
          icon={CheckCircle}
          trend="12%"
          trendUp={true}
        />
      </div>

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
              onClick={() => router.push("/admin/transactions")}
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
              {Object.entries(marketRates).map(
                ([type, { max, avg, min, change }]) => (
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
                            {formatRupee(max)}
                          </span>
                          <span
                            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                              change?.max >= 0
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {change?.max >= 0 ? (
                              <>
                                <TrendingUp className="h-3 w-3" />+
                                {change?.max?.toFixed(2)}%
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-3 w-3" />
                                {change?.max?.toFixed(2)}%
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avg</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {formatRupee(avg)}
                          </span>
                          <span
                            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                              change?.avg >= 0
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {change?.avg >= 0 ? (
                              <>
                                <TrendingUp className="h-3 w-3" />+
                                {change?.avg?.toFixed(2)}%
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-3 w-3" />
                                {change?.avg?.toFixed(2)}%
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Min</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {formatRupee(min)}
                          </span>
                          <span
                            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                              change?.min >= 0
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {change?.min >= 0 ? (
                              <>
                                <TrendingUp className="h-3 w-3" />+
                                {change?.min?.toFixed(2)}%
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-3 w-3" />
                                {change?.min?.toFixed(2)}%
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          <button
            onClick={() => router.push("/admin/updateprice")}
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
