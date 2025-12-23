"use client";
import React, { useEffect, useState } from "react";
import {
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  Package,
  ArrowUp,
  ArrowDown,
  CreditCard,
  Clock,
  Hash,
  Sparkles,
  MapPin,
  User,
  Phone,
  Mail,
  Building2,
  CheckCircle2,
  Circle,
  Shield,
  UserCheck,
  Crown,
  Wheat,
  Scale,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Percent,
  Banknote,
  BadgeCheck,
  Timer,
} from "lucide-react";
import { toast } from "react-hot-toast";
import API_BASE_URL from "@/utils/constants";
import Loader from "../common/Loader";

const TransactionModal = ({ isOpen, setIsOpen, category_id }) => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [expandedTransaction, setExpandedTransaction] = useState(null);

  const fetchTransaction = async () => {
    setLoader(true);
    if (!category_id) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/categorytransactiondetails/${category_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch transactions");

      const result = await response.json();
      if (result.success) {
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (isOpen && category_id) {
      fetchTransaction();
    }
  }, [category_id, isOpen]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const getTransactionIcon = (type) => {
    switch (type) {
      case "deposit":
        return <ArrowDown className="w-4 h-4" />;
      case "sell":
        return <ArrowUp className="w-4 h-4" />;
      case "withdraw":
        return <ArrowUp className="w-4 h-4" />;
      case "loan":
        return <CreditCard className="w-4 h-4" />;
      default:
        return <ArrowDown className="w-4 h-4" />;
    }
  };

  const getTransactionConfig = (type) => {
    switch (type) {
      case "deposit":
        return {
          color: "from-emerald-500 to-green-600",
          light: "bg-gradient-to-br from-emerald-50 to-green-50",
          text: "text-emerald-600",
          border: "border-emerald-200",
          badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
          hover: "hover:border-emerald-300 hover:shadow-emerald-100",
          label: "Grain Deposit",
        };
      case "sell":
        return {
          color: "from-blue-500 to-indigo-600",
          light: "bg-gradient-to-br from-blue-50 to-indigo-50",
          text: "text-blue-600",
          border: "border-blue-200",
          badge: "bg-blue-100 text-blue-700 border-blue-200",
          hover: "hover:border-blue-300 hover:shadow-blue-100",
          label: "Grain Sale",
        };
      case "withdraw":
        return {
          color: "from-rose-500 to-red-600",
          light: "bg-gradient-to-br from-rose-50 to-red-50",
          text: "text-rose-600",
          border: "border-rose-200",
          badge: "bg-rose-100 text-rose-700 border-rose-200",
          hover: "hover:border-rose-300 hover:shadow-rose-100",
          label: "Grain Withdrawal",
        };
      case "loan":
        return {
          color: "from-violet-500 to-purple-600",
          light: "bg-gradient-to-br from-violet-50 to-purple-50",
          text: "text-violet-600",
          border: "border-violet-200",
          badge: "bg-violet-100 text-violet-700 border-violet-200",
          hover: "hover:border-violet-300 hover:shadow-violet-100",
          label: "Loan Credit",
        };
      default:
        return {
          color: "from-gray-500 to-slate-600",
          light: "bg-gray-50",
          text: "text-gray-600",
          border: "border-gray-200",
          badge: "bg-gray-100 text-gray-700 border-gray-200",
          hover: "hover:border-gray-300",
          label: "Transaction",
        };
    }
  };

  const getApprovalCount = (approval) => {
    if (!approval) return 0;
    let count = 0;
    if (approval.supervisor_approval?.status) count++;
    if (approval.manager_approval?.status) count++;
    if (approval.admin_approval?.status) count++;
    return count;
  };

  const calculateSummary = () => {
    if (!data?.transactions) return {};
    return data.transactions.reduce(
      (acc, t) => {
        const amount = t.grain?.total_amount || 0;
        const quantity = t.grain?.quantity_quintal || 0;
        const profit = (t.price_analysis?.profit_per_quintal || 0) * quantity;

        if (t.transaction_type === "deposit") {
          acc.totalDeposit += amount;
          acc.depositQty += quantity;
        }
        if (t.transaction_type === "sell") {
          acc.totalSell += amount;
          acc.sellQty += quantity;
        }
        if (t.transaction_type === "loan") {
          acc.totalLoan += amount;
        }
        if (t.transaction_type === "withdraw") {
          acc.totalWithdraw += amount;
          acc.withdrawQty += quantity;
        }
        acc.totalProfit += profit;
        acc.totalCurrentValue += t.price_analysis?.total_current_value || 0;
        return acc;
      },
      {
        totalDeposit: 0,
        totalSell: 0,
        totalLoan: 0,
        totalWithdraw: 0,
        totalProfit: 0,
        totalCurrentValue: 0,
        depositQty: 0,
        sellQty: 0,
        withdrawQty: 0,
      }
    );
  };

  const summary = calculateSummary();

  const filteredTransactions =
    data?.transactions?.filter((t) =>
      selectedTab === "all" ? true : t.transaction_type === selectedTab
    ) || [];

  const tabs = [
    { key: "all", label: "All", icon: Package },
    { key: "deposit", label: "Deposits", icon: ArrowDown },
    { key: "sell", label: "Sales", icon: ArrowUp },
    { key: "withdraw", label: "Withdrawals", icon: ArrowUp },
    { key: "loan", label: "Loans", icon: CreditCard },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-0 md:p-4 z-50">
      <div className="bg-white w-full h-full md:h-auto md:max-w-5xl md:max-h-[90vh] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-4 md:px-8 py-5 md:py-6 text-white overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />

          <div className="relative flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Wheat className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">
                    {data?.category?.grain_type || "Loading..."}
                  </h2>
                  {data?.category?.quality && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Grade {data.category.quality}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 ml-14">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-indigo-200" />
                  <span className="text-indigo-100 text-sm">Today's Rate:</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(data?.category?.today_price_per_quintal)}
                    <span className="text-sm font-normal text-indigo-200">
                      /Qtl
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 md:px-8 py-4 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-emerald-600 font-medium">
                Total Deposits
              </p>
              <ArrowDown className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-lg font-bold text-emerald-900">
              {formatCurrency(summary.totalDeposit)}
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              {summary.depositQty} Quintals
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-blue-600 font-medium">Total Sales</p>
              <ArrowUp className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-lg font-bold text-blue-900">
              {formatCurrency(summary.totalSell)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {summary.sellQty} Quintals
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-amber-600 font-medium">
                Current Value
              </p>
              <Banknote className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-lg font-bold text-amber-900">
              {formatCurrency(summary.totalCurrentValue)}
            </p>
            <p className="text-xs text-amber-600 mt-1">Market valuation</p>
          </div>

          <div
            className={`bg-gradient-to-br ${
              summary.totalProfit >= 0
                ? "from-emerald-50 to-teal-50 border-emerald-100"
                : "from-rose-50 to-red-50 border-rose-100"
            } border rounded-xl p-3`}
          >
            <div className="flex items-center justify-between mb-2">
              <p
                className={`text-xs font-medium ${
                  summary.totalProfit >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                Net Profit/Loss
              </p>
              {summary.totalProfit >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-500" />
              )}
            </div>
            <p
              className={`text-lg font-bold ${
                summary.totalProfit >= 0 ? "text-emerald-900" : "text-rose-900"
              }`}
            >
              {summary.totalProfit >= 0 ? "+" : ""}
              {formatCurrency(summary.totalProfit)}
            </p>
            <p
              className={`text-xs mt-1 ${
                summary.totalProfit >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              From price changes
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 md:px-8 py-3 bg-white border-b border-gray-100">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedTab === tab.key;
              const count =
                tab.key === "all"
                  ? data?.transactions?.length || 0
                  : data?.transactions?.filter(
                      (t) => t.transaction_type === tab.key
                    ).length || 0;

              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-xs ${
                      isActive ? "bg-white/20" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Transactions List */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 bg-gray-50/50">
          {loader ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="space-y-4">
              {filteredTransactions.map((transaction, index) => {
                const config = getTransactionConfig(transaction.transaction_type);
                const isExpanded = expandedTransaction === transaction.transaction_id;
                const approvalCount = getApprovalCount(transaction.approval_status);
                const priceAnalysis = transaction.price_analysis;
                const hasProfit = priceAnalysis?.profit_per_quintal > 0;
                const hasLoss = priceAnalysis?.profit_per_quintal < 0;

                return (
                  <div
                    key={transaction.transaction_id}
                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${config.hover} ${
                      isExpanded ? "ring-2 ring-indigo-500/50" : ""
                    }`}
                  >
                    {/* Main Row */}
                    <div
                      className="p-4 md:p-5 cursor-pointer"
                      onClick={() =>
                        setExpandedTransaction(
                          isExpanded ? null : transaction.transaction_id
                        )
                      }
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Left Section */}
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-br ${config.color} text-white shadow-lg`}
                          >
                            {getTransactionIcon(transaction.transaction_type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="font-bold text-gray-900">
                                {config.label}
                              </h4>
                              <span
                                className={`px-2 py-0.5 text-xs font-medium rounded-full border ${config.badge}`}
                              >
                                {transaction.symbol === "+"
                                  ? "CREDIT"
                                  : "DEBIT"}
                              </span>
                            </div>

                            {/* Grain Info */}
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 ${config.light} ${config.text} rounded-lg text-xs font-medium`}
                              >
                                <Wheat className="w-3 h-3" />
                                {transaction.grain?.grain_type}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium">
                                <Scale className="w-3 h-3" />
                                {transaction.grain?.quantity_quintal}{" "}
                                {transaction.grain?.unit}
                              </span>
                              <span className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                                Grade {transaction.grain?.quality}
                              </span>
                            </div>

                            {/* Meta Info */}
                            <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(transaction.transaction_date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(transaction.transaction_date)}
                              </span>
                              {transaction.warehouse && (
                                <span className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
                                  <MapPin className="w-3 h-3" />
                                  {transaction.warehouse.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-4">
                          {/* Approval Status */}
                          <div className="hidden md:flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1">
                              {[0, 1, 2].map((i) => (
                                <div
                                  key={i}
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all ${
                                    i < approvalCount
                                      ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                                      : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  {i < approvalCount ? "✓" : ""}
                                </div>
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">
                              {approvalCount}/3
                            </span>
                          </div>

                          {/* Profit/Loss Indicator */}
                          {priceAnalysis && priceAnalysis.profit_percent !== 0 && (
                            <div
                              className={`hidden sm:flex flex-col items-end px-2 py-1 rounded-lg ${
                                hasProfit
                                  ? "bg-emerald-50"
                                  : hasLoss
                                  ? "bg-rose-50"
                                  : ""
                              }`}
                            >
                              <span
                                className={`text-xs font-medium flex items-center gap-1 ${
                                  hasProfit
                                    ? "text-emerald-600"
                                    : hasLoss
                                    ? "text-rose-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {hasProfit ? (
                                  <TrendingUp className="w-3 h-3" />
                                ) : hasLoss ? (
                                  <TrendingDown className="w-3 h-3" />
                                ) : null}
                                {priceAnalysis.profit_percent > 0 ? "+" : ""}
                                {priceAnalysis.profit_percent?.toFixed(1)}%
                              </span>
                            </div>
                          )}

                          {/* Amount */}
                          <div className="text-right">
                            <p
                              className={`text-xl font-bold ${
                                transaction.symbol === "+"
                                  ? "text-emerald-600"
                                  : "text-gray-900"
                              }`}
                            >
                              {transaction.symbol}
                              {formatCurrency(transaction.grain?.total_amount)}
                            </p>
                            <p className="text-xs text-gray-500">
                              @{formatCurrency(transaction.grain?.price_per_quintal)}
                              /Qtl
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-indigo-50/30 p-4 md:p-5 animate-in slide-in-from-top-2 duration-300">
                        <div className="grid md:grid-cols-3 gap-4">
                          {/* User Info */}
                          <div className="bg-white rounded-xl p-4 border border-gray-100">
                            <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                              <User className="w-4 h-4 text-indigo-600" />
                              Farmer Details
                            </h5>
                            <div className="flex items-center gap-3">
                              {transaction.user?.user_image && (
                                <img
                                  src={transaction.user.user_image}
                                  alt={transaction.user.name}
                                  className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">
                                  {transaction.user?.name}
                                </p>
                                <p className="text-xs text-indigo-600 font-mono">
                                  {transaction.user?.farmerId}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                  <Phone className="w-3 h-3" />
                                  {transaction.user?.phone_number}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Price Analysis */}
                          <div className="bg-white rounded-xl p-4 border border-gray-100">
                            <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-indigo-600" />
                              Price Analysis
                            </h5>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  Deposit Price
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {formatCurrency(priceAnalysis?.deposit_price)}
                                  /Qtl
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  Today's Price
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {formatCurrency(priceAnalysis?.today_price)}/Qtl
                                </span>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <span className="text-xs text-gray-500">
                                  Profit/Qtl
                                </span>
                                <span
                                  className={`font-bold ${
                                    hasProfit
                                      ? "text-emerald-600"
                                      : hasLoss
                                      ? "text-rose-600"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {priceAnalysis?.profit_per_quintal > 0
                                    ? "+"
                                    : ""}
                                  {formatCurrency(
                                    priceAnalysis?.profit_per_quintal
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Approval Status */}
                          <div className="bg-white rounded-xl p-4 border border-gray-100">
                            <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                              <Shield className="w-4 h-4 text-indigo-600" />
                              Approval Status
                            </h5>
                            <div className="space-y-2">
                              {[
                                {
                                  label: "Supervisor",
                                  data: transaction.approval_status?.supervisor_approval,
                                  icon: UserCheck,
                                },
                                {
                                  label: "Manager",
                                  data: transaction.approval_status?.manager_approval,
                                  icon: Shield,
                                },
                                {
                                  label: "Admin",
                                  data: transaction.approval_status?.admin_approval,
                                  icon: Crown,
                                },
                              ].map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                          item.data?.status
                                            ? "bg-emerald-100 text-emerald-600"
                                            : "bg-gray-100 text-gray-400"
                                        }`}
                                      >
                                        {item.data?.status ? (
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                        ) : (
                                          <Timer className="w-3.5 h-3.5" />
                                        )}
                                      </div>
                                      <span className="text-sm text-gray-700">
                                        {item.label}
                                      </span>
                                    </div>
                                    {item.data?.status ? (
                                      <span className="text-xs text-emerald-600 font-medium">
                                        {item.data?.user_id?.name || "Approved"}
                                      </span>
                                    ) : (
                                      <span className="text-xs text-gray-400">
                                        Pending
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Warehouse & Transaction ID */}
                        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
                          {transaction.warehouse && (
                            <div className="flex items-center gap-2 text-sm">
                              <Building2 className="w-4 h-4 text-indigo-600" />
                              <span className="text-gray-600">
                                {transaction.warehouse.name},{" "}
                                {transaction.warehouse.location}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                            <Hash className="w-3 h-3" />
                            {transaction.transaction_id}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium text-lg">
                No transactions found
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {selectedTab !== "all"
                  ? "Try selecting a different filter"
                  : "No transactions for this grain category yet"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 md:px-8 py-4 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredTransactions.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold">
                  {data?.pagination?.totalRecords || 0}
                </span>{" "}
                transactions
              </p>
              {data?.pagination?.totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium">
                    {data?.pagination?.currentPage}
                  </span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;