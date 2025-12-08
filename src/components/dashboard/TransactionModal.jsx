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
} from "lucide-react";
import { toast } from "react-hot-toast";
import API_BASE_URL from "@/utils/constants";
import Loader from "../common/Loader";

const TransactionModal = ({ isOpen, setIsOpen, category_id }) => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(false);

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
      if (response.ok) {
        setData(result);
        setLoader(false);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [category_id]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString("en-US", {
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
      case "credit":
        return <CreditCard className="w-4 h-4" />;
      default:
        return <ArrowDown className="w-4 h-4" />;
    }
  };

  const getTransactionConfig = (type) => {
    switch (type) {
      case "deposit":
        return {
          color:
            "text-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
          badge: "bg-blue-100 text-blue-700 border-blue-200",
          hover: "hover:border-blue-300 hover:shadow-blue-100",
        };
      case "sell":
        return {
          color:
            "text-orange-600 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200",
          badge: "bg-orange-100 text-orange-700 border-orange-200",
          hover: "hover:border-orange-300 hover:shadow-orange-100",
        };
      case "credit":
        return {
          color:
            "text-purple-600 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200",
          badge: "bg-purple-100 text-purple-700 border-purple-200",
          hover: "hover:border-purple-300 hover:shadow-purple-100",
        };
      default:
        return {
          color: "text-gray-600 bg-gray-50 border-gray-200",
          badge: "bg-gray-100 text-gray-700 border-gray-200",
          hover: "hover:border-gray-300",
        };
    }
  };

  const calculateSummary = () => {
    if (!data?.transactions) return {};
    return data.transactions.reduce(
      (acc, t) => {
        if (t.type === "deposit") acc.totalDeposit += t.totalAmount;
        if (t.type === "sell") acc.totalSell += t.totalAmount;
        if (t.type === "credit") acc.totalCredit += t.totalAmount;
        acc.totalProfit += t.profitPerQtl * t.quantity;
        return acc;
      },
      { totalDeposit: 0, totalSell: 0, totalCredit: 0, totalProfit: 0 }
    );
  };

  const summary = calculateSummary();
  const filteredTransactions =
    data?.transactions?.filter((t) =>
      selectedTab === "all" ? true : t.type === selectedTab
    ) || [];

  if (!isOpen) return null;

  if (loader) {
    return <Loader />;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/20 via-gray-900/30 to-gray-900/20 backdrop-blur-sm flex items-center justify-center p-0 md:p-4 z-50">
      <div className="bg-white w-full h-full md:h-auto md:max-w-5xl md:max-h-[90vh] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 border-b border-gray-100 px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-sm">
                  <Package className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                  {data?.grain_type || "Grain Type"}
                </h2>
                {data?.quality && (
                  <span className="px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 text-xs font-semibold rounded-full border border-amber-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Grade {data.quality}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 ml-12">
                Current Market Rate:{" "}
                <span className="font-semibold text-gray-900 text-base">
                  {formatCurrency(data?.todayPricePerQtl)}/Qtl
                </span>
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-red-50 rounded-xl transition-all group"
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-4 md:px-8 py-4 md:py-6 bg-gradient-to-b from-gray-50/50 to-white">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 md:p-4">
            <p className="text-xs text-blue-600 font-medium mb-1">
              Total Deposits
            </p>
            <p className="text-lg md:text-xl font-bold text-blue-900">
              {formatCurrency(summary.totalDeposit)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-3 md:p-4">
            <p className="text-xs text-orange-600 font-medium mb-1">
              Total Sales
            </p>
            <p className="text-lg md:text-xl font-bold text-orange-900">
              {formatCurrency(summary.totalSell)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 md:p-4">
            <p className="text-xs text-purple-600 font-medium mb-1">
              Total Credits
            </p>
            <p className="text-lg md:text-xl font-bold text-purple-900">
              {formatCurrency(summary.totalCredit)}
            </p>
          </div>
          <div
            className={`bg-gradient-to-br ${
              summary.totalProfit >= 0
                ? "from-emerald-50 to-green-50 border-emerald-100"
                : "from-red-50 to-rose-50 border-red-100"
            } border rounded-xl p-3 md:p-4`}
          >
            <p
              className={`text-xs font-medium mb-1 ${
                summary.totalProfit >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              Net Profit/Loss
            </p>
            <p
              className={`text-lg md:text-xl font-bold ${
                summary.totalProfit >= 0 ? "text-emerald-900" : "text-red-900"
              }`}
            >
              {summary.totalProfit >= 0 ? "+" : ""}
              {formatCurrency(summary.totalProfit)}
            </p>
          </div>
        </div>

        {/* Transactions */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6 bg-gradient-to-b from-gray-50/30 to-white no-scrollbar">
          {filteredTransactions.length > 0 ? (
            <div className="space-y-4">
              {filteredTransactions.map((transaction, index) => {
                const config = getTransactionConfig(transaction.type);
                return (
                  <div
                    key={index}
                    className={`bg-white  rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all ${config.hover}`}
                  >
                    {/* Transaction Info */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2.5 rounded-xl border ${config.color}`}
                        >
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 capitalize text-base">
                              {transaction.type}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded-full border ${config.badge}`}
                            >
                              {transaction.type.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(transaction.transactionDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(transaction.transactionDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              {1001 + index}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl md:text-2xl font-bold text-gray-900">
                          {formatCurrency(transaction.totalAmount)}
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-gray-100">
                      <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-2.5">
                        <p className="text-xs text-gray-500 mb-1">Quantity</p>
                        <p className="font-semibold text-gray-900">
                          {transaction.quantity} Qtl
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-2.5">
                        <p className="text-xs text-gray-500 mb-1">
                          {transaction.type === "sell"
                            ? "Sell Price"
                            : "Buy Price"}
                        </p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(transaction.depositPrice)}/Qtl
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-2.5">
                        <p className="text-xs text-gray-500 mb-1">
                          Market Price
                        </p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(transaction.todayPrice)}/Qtl
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No transactions found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try selecting a different filter
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 md:px-8 py-4 bg-gradient-to-r from-gray-50 via-white to-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredTransactions.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold">
                {data?.transactions?.length || 0}
              </span>{" "}
              transactions
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm font-medium rounded-xl hover:from-gray-900 hover:to-black transition-all shadow-md hover:shadow-lg"
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
