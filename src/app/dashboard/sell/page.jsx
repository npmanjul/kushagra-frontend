"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Check,
  Sparkles,
  Package,
  Wallet,
  ArrowRight,
  ShoppingCart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "react-hot-toast";
import API_BASE_URL from "@/utils/constants";
import Loader from "@/components/common/Loader";

const unitLabel = "Qtl";

function toDisplayQty(qty) {
  return `${qty} ${unitLabel}`;
}

function formatCurrency(val) {
  const n = Number(val || 0);
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

const getPriceByQuality = (quality, priceData) => {
  if (!priceData) return 0;
  switch (quality) {
    case "A":
      return priceData.max || 0;
    case "B":
      return priceData.avg || 0;
    case "C":
      return priceData.min || 0;
    default:
      return priceData.avg || 0;
  }
};

const CARD_WIDTH = 320; // card + gap approximation for scroll logic

const SellContent = () => {
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [priceLoading, setPriceLoading] = useState(true);
  const [grainInventory, setGrainInventory] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [todayPrice, setTodayPrice] = useState({});
  const [sellForm, setSellForm] = useState({
    itemId: "",
    quantity: "",
    price: "",
    warehouse_id: ""
  });

  // Carousel state
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Fetch grain inventory
  const getAllGrainQuantity = async () => {
    try {
      setInventoryLoading(true);
      const response = await fetch(`${API_BASE_URL}/user/getallgraindeposite`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch grains");
      const data = await response.json();
      setGrainInventory(data.deposits || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load grain inventory");
    } finally {
      setInventoryLoading(false);
    }
  };

  // Fetch today's price
  const fetchTodayMarketPrice = async () => {
    try {
      setPriceLoading(true);
      const response = await fetch(`${API_BASE_URL}/pricehistory/todayprice`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch today's market price");
      const data = await response.json();
      setTodayPrice(data.todayprice || {});
    } catch (error) {
      console.error(error);
      toast.error("Failed to load today's market price");
    } finally {
      setPriceLoading(false);
    }
  };

  // Fetch warehouses
  const fetchWarehouses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/warehouse/allwarehouse`);
      if (!response.ok) throw new Error("Failed to fetch warehouses");
      const data = await response.json();
      setWarehouses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load warehouses");
    }
  };

  useEffect(() => {
    fetchTodayMarketPrice();
    getAllGrainQuantity();
    fetchWarehouses();
  }, []);

  // Initialize selection after data loads
  useEffect(() => {
    if (!inventoryLoading && !priceLoading && grainInventory.length > 0) {
      const first = grainInventory[0];
      const chosen =
        grainInventory.find(i => i.category_id === sellForm.itemId) || first;
      const priceData = todayPrice[chosen?.grain_type];
      setSellForm(f => ({
        ...f,
        itemId: chosen?.category_id || "",
        quantity: "",
        price: getPriceByQuality(chosen?.quality, priceData) || ""
      }));
    }
  }, [
    inventoryLoading,
    priceLoading,
    grainInventory,
    todayPrice,
    sellForm.itemId
  ]);

  // Update price when item or market changes
  useEffect(() => {
    if (!inventoryLoading && !priceLoading && sellForm.itemId) {
      const selectedItem = grainInventory.find(
        i => i.category_id === sellForm.itemId
      );
      if (selectedItem) {
        const priceData = todayPrice[selectedItem.grain_type];
        setSellForm(f => ({
          ...f,
            price: getPriceByQuality(selectedItem.quality, priceData) || ""
          }));
      }
    }
  }, [sellForm.itemId, todayPrice, inventoryLoading, priceLoading, grainInventory]);

  // Scroll position checker
  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
    const idx = Math.round(scrollLeft / CARD_WIDTH);
    setCurrentIndex(idx);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [priceLoading, todayPrice, checkScroll]);

  // Keyboard nav
  useEffect(() => {
    const handler = e => {
      if (e.key === "ArrowLeft") scroll("left");
      if (e.key === "ArrowRight") scroll("right");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  // Autoplay
  useEffect(() => {
    if (!autoPlay) return;
    if (Object.keys(todayPrice).length < 2) return;
    const id = setInterval(() => {
      setAutoPlay(prev => prev); // keep state
      if (canScrollRight) {
        scroll("right");
      } else {
        scrollToIndex(0);
      }
    }, 6000);
    return () => clearInterval(id);
  }, [todayPrice, canScrollRight, autoPlay]);

  // Scroll functions
  const scroll = direction => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const amount = direction === "left" ? -CARD_WIDTH : CARD_WIDTH;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const scrollToIndex = index => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * CARD_WIDTH, behavior: "smooth" });
  };

  // Pause autoplay on user interaction
  const pauseAutoPlay = () => setAutoPlay(false);

  const selected = grainInventory.find(i => i.category_id === sellForm.itemId);
  const maxQty = selected ? Number(selected.total_quantity) : 0;
  const qtyNum = Number(sellForm.quantity || 0);
  const priceNum = Number(sellForm.price || 0);
  const totalAmount = qtyNum && priceNum ? qtyNum * priceNum : 0;

  const isValidQuantity = qtyNum > 0 && qtyNum <= maxQty;
  const isValidPrice = priceNum > 0;
  const isValidWarehouse = !!sellForm.warehouse_id;
  const canSubmit = isValidQuantity && isValidPrice && isValidWarehouse;

  const handleSell = async () => {
    if (!canSubmit) {
      toast.error("Fill all required fields");
      return;
    }
    try {
      const payload = {
        quantity_sold: qtyNum,
        price_per_quintal: priceNum,
        category_id: selected?.category_id,
        warehouse_id: sellForm.warehouse_id
      };
      const response = await fetch(`${API_BASE_URL}/sell/sellgrain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to sell grain");
      toast.success("Grain sold successfully");
      setSellForm({
        itemId: "",
        quantity: "",
        price: "",
        warehouse_id: ""
      });
      fetchTodayMarketPrice();
      getAllGrainQuantity();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to process sale");
    }
  };

  if (inventoryLoading || priceLoading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );

  const priceEntries = Object.entries(todayPrice).filter(([, data]) => data);
  const totalCards = priceEntries.length;

  return (
    <div
      className="w-full max-w-6xl mx-auto  space-y-4 sm:space-y-6 lg:space-y-8"
      onMouseDown={pauseAutoPlay}
      onTouchStart={pauseAutoPlay}
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
            <ShoppingCart className="text-white" size={28} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              Sell Your Grain
            </h1>
            <p className="text-sm sm:text-base text-blue-100">
              List your grain at competitive market prices and maximize your returns
            </p>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8 border-b border-purple-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-xl">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                  Today's Market Prices
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                  Real-time market rates
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-green-200 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-gray-700 font-medium">
                Live
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 relative">
          {totalCards > 1 && (
            <>
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 flex items-center justify-center shadow-lg transition-all ${
                  canScrollLeft
                    ? "border-purple-200 hover:bg-purple-600 hover:border-purple-600 hover:scale-110 group"
                    : "border-gray-200 opacity-0 pointer-events-none"
                }`}
                aria-label="Previous"
              >
                <ChevronLeft
                  size={24}
                  className={`${
                    canScrollLeft
                      ? "text-gray-700 group-hover:text-white"
                      : "text-gray-400"
                  } transition-colors`}
                  strokeWidth={3}
                />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 flex items-center justify-center shadow-lg transition-all ${
                  canScrollRight
                    ? "border-purple-200 hover:bg-purple-600 hover:border-purple-600 hover:scale-110 group"
                    : "border-gray-200 opacity-0 pointer-events-none"
                }`}
                aria-label="Next"
              >
                <ChevronRight
                  size={24}
                  className={`${
                    canScrollRight
                      ? "text-gray-700 group-hover:text-white"
                      : "text-gray-400"
                  } transition-colors`}
                  strokeWidth={3}
                />
              </button>
            </>
          )}

            <div className="relative mx-0 sm:mx-8 lg:mx-12">
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto py-4 snap-x snap-mandatory carousel-scroll scroll-smooth select-none"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {priceEntries.map(([type, data], index) => (
                  <div
                    key={type}
                    className="flex-shrink-0 snap-center w-[280px] sm:w-[300px] lg:w-[320px] bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 sm:p-6 border-2 border-gray-100  hover:border-purple-300 group"
                    style={{ animation: `slideUp 0.5s ease-out ${index * 0.08}s both` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-purple-600 transition-colors">
                          {type}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 font-medium">
                          Per Quintal
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${
                          data.change?.avg >= 0
                            ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                            : "bg-gradient-to-r from-red-400 to-rose-500 text-white"
                        }`}
                      >
                        {data.change?.avg >= 0 ? (
                          <TrendingUp size={14} strokeWidth={2.5} />
                        ) : (
                          <TrendingDown size={14} strokeWidth={2.5} />
                        )}
                        <span>
                          {Math.abs((data.change?.avg || 0).toFixed(2))}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          key: "max",
                          label: "Premium",
                          color: "from-green-500 to-emerald-600",
                          bgColor: "bg-green-50"
                        },
                        {
                          key: "avg",
                          label: "Average",
                          color: "from-blue-500 to-indigo-600",
                          bgColor: "bg-blue-50"
                        },
                        {
                          key: "min",
                          label: "Standard",
                          color: "from-orange-500 to-red-600",
                          bgColor: "bg-orange-50"
                        }
                      ].map(({ key, label, color, bgColor }) => (
                        <div
                          key={key}
                          className={`flex justify-between items-center ${bgColor} p-3 rounded-xl border-2 border-transparent group-hover:border-purple-100 transition-all`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full bg-gradient-to-r ${color} shadow-sm`}
                            ></div>
                            <span className="text-gray-700 text-sm font-semibold">
                              {label}
                            </span>
                          </div>
                          <span className="font-bold text-gray-900 text-base lg:text-lg">
                            {formatCurrency(data[key])}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {totalCards > 1 && (
                <>
                  <div
                    className={`hidden sm:block absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none transition-opacity duration-300 ${
                      canScrollLeft ? "opacity-100" : "opacity-0"
                    }`}
                  ></div>
                  <div
                    className={`hidden sm:block absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none transition-opacity duration-300 ${
                      canScrollRight ? "opacity-100" : "opacity-0"
                    }`}
                  ></div>
                </>
              )}
            </div>

            {totalCards > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {priceEntries.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToIndex(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentIndex
                        ? "w-8 h-2 bg-purple-600"
                        : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Sell Form */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-5 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                List Your Grain
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm lg:text-base mt-1">
                Configure your selling preferences
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {grainInventory.length === 0 ? (
            <div className="text-center py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-dashed border-gray-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                <AlertCircle className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                No Grain Inventory
              </h3>
              <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto mb-6">
                You haven't deposited any grain yet. Please deposit grain first to start selling.
              </p>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2">
                Deposit Grain
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSell();
              }}
              className="space-y-5 sm:space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Package size={14} className="text-purple-600" />
                    Select Inventory
                  </label>
                  <select
                    className="w-full px-3 sm:px-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white hover:border-purple-300 text-xs sm:text-sm font-medium text-gray-700 shadow-sm"
                    value={sellForm.itemId}
                    onChange={e =>
                      setSellForm(f => ({
                        ...f,
                        itemId: e.target.value,
                        quantity: ""
                      }))
                    }
                  >
                    {grainInventory.map(item => (
                      <option key={item.category_id} value={item.category_id}>
                        {item.grain_type} • Grade {item.quality} •{" "}
                        {toDisplayQty(item.total_quantity)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-2">
                    <TrendingUp size={14} className="text-green-600" />
                    Quantity ({unitLabel})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 pr-20 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all bg-white text-xs sm:text-sm font-medium shadow-sm ${
                        sellForm.quantity && !isValidQuantity
                          ? "border-red-400 focus:border-red-500"
                          : "border-gray-200 focus:border-purple-500 hover:border-purple-300"
                      }`}
                      placeholder="Enter quantity"
                      min="0.1"
                      max={maxQty}
                      step="0.1"
                      value={sellForm.quantity}
                      onChange={e => {
                        let v = e.target.value;
                        if (Number(v) > maxQty) v = String(maxQty);
                        setSellForm(f => ({ ...f, quantity: v }));
                      }}
                    />
                    <span className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                      Max: {maxQty}
                    </span>
                  </div>
                  {sellForm.quantity && !isValidQuantity && (
                    <p className="text-xs text-red-600 flex items-center gap-1.5 font-semibold">
                      <AlertCircle size={12} />
                      Enter between 0.1 and {maxQty}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Wallet size={14} className="text-blue-600" />
                    Price per Quintal
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-3 sm:px-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 text-xs sm:text-sm font-bold text-gray-800 cursor-not-allowed shadow-sm"
                      value={formatCurrency(sellForm.price)}
                      disabled
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-bold text-green-700">
                        LIVE
                      </span>
                    </div>
                  </div>
                  {selected && todayPrice[selected.grain_type] && (
                    <p className="text-xs text-gray-600 flex items-center gap-1.5 font-medium">
                      <TrendingUp size={12} className="text-green-600" />
                      Market:{" "}
                      {formatCurrency(todayPrice[selected.grain_type].avg)}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-gray-700">
                  Delivery Warehouse <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 sm:px-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white hover:border-purple-300 text-xs sm:text-sm font-medium text-gray-700 shadow-sm"
                  value={sellForm.warehouse_id}
                  onChange={e =>
                    setSellForm(f => ({ ...f, warehouse_id: e.target.value }))
                  }
                >
                  <option value="">Select Warehouse Location</option>
                  {warehouses.length > 0 ? (
                    warehouses.map(w => (
                      <option key={w._id} value={w._id}>
                        {w.name} — {w.location}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading warehouses...</option>
                  )}
                </select>
              </div>

              {qtyNum > 0 && (
                <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-purple-200 shadow-lg">
                  <h4 className="font-bold text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
                    <Sparkles size={18} className="text-purple-600" />
                    Sale Summary
                  </h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-purple-100 shadow-sm">
                      <p className="text-[10px] sm:text-xs text-gray-600 mb-1 font-bold uppercase tracking-wide">
                        Grain Type
                      </p>
                      <p className="font-bold text-gray-900 text-sm sm:text-base truncate">
                        {selected?.grain_type || "-"}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-green-100 shadow-sm">
                      <p className="text-[10px] sm:text-xs text-gray-600 mb-1 font-bold uppercase tracking-wide">
                        Quantity
                      </p>
                      <p className="font-bold text-green-700 text-sm sm:text-base">
                        {toDisplayQty(qtyNum)}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-blue-100 shadow-sm">
                      <p className="text-[10px] sm:text-xs text-gray-600 mb-1 font-bold uppercase tracking-wide">
                        Total Amount
                      </p>
                      <p className="font-bold text-purple-600 text-base sm:text-lg">
                        {formatCurrency(totalAmount)}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-orange-100 shadow-sm col-span-2 lg:col-span-1">
                      <p className="text-[10px] sm:text-xs text-gray-600 mb-1 font-bold uppercase tracking-wide">
                        Warehouse
                      </p>
                      <p className="font-bold text-orange-700 text-xs sm:text-sm truncate">
                        {warehouses.find(w => w._id === sellForm.warehouse_id)?.name || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 sm:pt-4">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`w-full py-3.5 sm:py-4 px-6 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-lg ${
                    canSubmit
                      ? "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Check size={20} strokeWidth={3} />
                  {canSubmit ? "Confirm Sale" : "Please Fill All Fields"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Inline styles for carousel */}
      <style jsx>{`
        .carousel-scroll::-webkit-scrollbar {
          display: none;
        }
        .carousel-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SellContent;
