"use client";
import React, { useState, useEffect } from "react";
import {
  Apple,
  BarChart3,
  Bean,
  CreditCard,
  Download,
  Leaf,
  Plus,
  ReceiptCentIcon,
  Sun,
  TrendingUp,
  TrendingDown,
  Warehouse,
  WheatIcon,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import useStore from "@/store/useStore";
import API_BASE_URL from "@/utils/constants";
import Loader from "@/components/common/Loader";
import TransactionModal from "@/components/dashboard/TransactionModal";

const unitLabel = "Qtl";

function formatCurrency(val) {
  return "₹" + val.toLocaleString("en-IN");
}

function toDisplayQty(qty) {
  return parseFloat(qty).toFixed(2) + " " + unitLabel;
}

function calculateFutureValue(item, todayPrice) {
  return item.total_quantity * todayPrice * 1.12;
}

const DashboardContent = () => {
  const [profile, setProfile] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [grainInventory, setGrainInventory] = useState([]);
  const [market, setMarket] = useState({});
  const [todayPrice, setTodayPrice] = useState({});
  const [priceLoading, setPriceLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [category_id, setCategoryId] = useState(null);

  const { getprofile } = useStore();

  const fetchDashboardAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/dashboardanalytics`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch dashboard analytics");
      const data = await response.json();

      setTotalValue(data.totalCost);
      setTotalQuantity(data.totalGrainQuantity);
      setTotalCredit(data.availableCredit || 0);
      setGrainInventory(data.totalGrain || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard analytics");
    }
  };

  const fetchTodayMarketPrice = async () => {
    try {
      setPriceLoading(true);
      const response = await fetch(`${API_BASE_URL}/pricehistory/todayprice`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch today's market price");
      const data = await response.json();

      const todayprice = data.todayprice || {};
      setTodayPrice(todayprice);

      const marketRates = {};
      Object.entries(todayprice).forEach(([grainType, pricesObj]) => {
        const { max, avg, min, change } = pricesObj;
        marketRates[grainType] = {
          max,
          avg,
          min,
          change,
          icon:
            grainType === "Wheat"
              ? WheatIcon
              : grainType === "Rice"
              ? ReceiptCentIcon
              : Apple,
        };
      });

      setMarket(marketRates);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load today's market price");
    } finally {
      setPriceLoading(false);
    }
  };

  useEffect(() => {
    const profileDetails = async () => {
      try {
        const res = await getprofile();
        setProfile(res.profile);
      } catch (error) {
        console.error(error);
      }
    };
    profileDetails();
    fetchDashboardAnalytics();
    fetchTodayMarketPrice();
  }, []);

  const exportInventoryCSV = () => {
    toast.success("CSV Exported!");
  };

  if (priceLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 bg-gray-50/50 min-h-screen p-2">
        {/* Welcome Section - Enhanced Gradient */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white p-8 rounded-2xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                Welcome, {profile?.name ? profile.name.split(" ")[0] : "User"}!
                <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
              </h1>
              <p className="text-lg opacity-95 font-medium">
                Safe Grain, Prosperous Farmer
              </p>
            </div>
            <Sun className="h-20 w-20 text-yellow-300 opacity-80 animate-spin-slow hidden md:block" />
          </div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Quick Stats - Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-60"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Total Grain Value
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  {formatCurrency(totalValue)}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs text-emerald-600 font-medium">
                    +12.5% this month
                  </span>
                </div>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl group-hover:scale-110 transition-transform">
                <Warehouse className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-60"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Available Credit
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  {formatCurrency(totalCredit)}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-blue-600 font-medium">
                    Instant approval
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-60"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Total Grain ({unitLabel})
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                  {toDisplayQty(totalQuantity)}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                  <span className="text-xs text-purple-600 font-medium">
                    High quality grain
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-60"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Avg Profit (est.)
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  {grainInventory.length
                    ? (
                        grainInventory.reduce(
                          (acc, g) => acc + g.avgProfitPerQtl,
                          0
                        ) / grainInventory.length
                      ).toFixed(2)
                    : "0"}
                  %
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <span className="text-xs text-orange-600 font-medium">
                    Above market avg
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Inventory & Market - Enhanced Tables */}
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-5 w-full">
          {/* Inventory Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full lg:w-2/3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Warehouse className="h-5 w-5 text-emerald-600" />
                  </div>
                  Current Grain Inventory
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Track and manage your stored grains
                </p>
              </div>
              <button
                onClick={exportInventoryCSV}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-medium"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Quality
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Avg Profit
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {grainInventory.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-emerald-50 rounded-lg">
                            {item.grain_type === "Wheat" ? (
                              <WheatIcon className="h-4 w-4 text-emerald-600" />
                            ) : item.grain_type === "Rice" ? (
                              <ReceiptCentIcon className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <Apple className="h-4 w-4 text-emerald-600" />
                            )}
                          </div>
                          <span className="font-semibold text-gray-900">
                            {item.grain_type}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          Grade {item.quality}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-900">
                        {toDisplayQty(item.total_quantity)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-bold text-emerald-600">
                          {formatCurrency(item.total_value)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          {item.avgProfitPerQtl >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          )}
                          <span
                            className={`font-bold ${
                              item.avgProfitPerQtl >= 0
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {parseFloat(item.avgProfitPerQtl).toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:shadow-md transition-all"
                          onClick={() => {setIsOpen(true),setCategoryId(item.category_id)}}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Market Rates */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full lg:w-1/3">
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

            <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 no-scrollbar">
              {Object.entries(market).map(
                ([type, { max, avg, min, change, icon: Icon }]) => (
                  <div
                    key={type}
                    className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <Icon className="h-5 w-5 text-purple-600" />
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
                            {formatCurrency(max)}
                          </span>
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
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avg</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(avg)}
                          </span>
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
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Min</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(min)}
                          </span>
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
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="group relative overflow-hidden bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 transition-colors duration-300">
              <div className="inline-flex p-3 bg-emerald-100 rounded-xl mb-4 group-hover:bg-white/20 transition-colors">
                <Plus className="h-8 w-8 text-emerald-600 group-hover:text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-white">
                Deposit Grain
              </h3>
              <p className="text-sm text-gray-600 group-hover:text-white/90">
                Add new grain into bank
              </p>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage("credit")}
            className="group relative overflow-hidden bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 transition-colors duration-300">
              <div className="inline-flex p-3 bg-blue-100 rounded-xl mb-4 group-hover:bg-white/20 transition-colors">
                <CreditCard className="h-8 w-8 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-white">
                Get Credit
              </h3>
              <p className="text-sm text-gray-600 group-hover:text-white/90">
                Instant credit up to 60%
              </p>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage("sell")}
            className="group relative overflow-hidden bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 transition-colors duration-300">
              <div className="inline-flex p-3 bg-purple-100 rounded-xl mb-4 group-hover:bg-white/20 transition-colors">
                <TrendingUp className="h-8 w-8 text-purple-600 group-hover:text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-white">
                Sell Grain
              </h3>
              <p className="text-sm text-gray-600 group-hover:text-white/90">
                Get better prices
              </p>
            </div>
          </button>
        </div>
      </div>
      <TransactionModal isOpen={isOpen} setIsOpen={setIsOpen} category_id={category_id}/>
    </>
  );
};

export default DashboardContent;
