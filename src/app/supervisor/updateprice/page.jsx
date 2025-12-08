
"use client";
import React, { useEffect, useState } from "react";
import { Plus, Wheat, DollarSign } from "lucide-react";
import toast from "react-hot-toast";
import API_BASE_URL from "@/utils/constants";
import Grainpricegraph from "@/components/admin/Grainpricegraph";

const GrainPriceManager = () => {
  const [grains, setGrains] = useState([]);
  const [selectedGrainName, setSelectedGrainName] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPriceData, setMaxPriceData] = useState([]);
  const [avgPriceData, setAvgPriceData] = useState([]);
  const [minPriceData, setMinPriceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGraphGrainName, setSelectedGraphGrainName] = useState("");
  const [date, setDate] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch all grain categories
  const fetchAllGrains = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/grain/allgraincategories`);
      if (!response.ok) throw new Error("Failed to fetch grains");
      const data = await response.json();

      // Only store unique grain_type strings using Set
      const uniqueGrainTypes = Array.from(
        new Set(data.map((item) => item.grain_type))
      );

      setGrains(uniqueGrainTypes);
    } catch (error) {
      console.error("Error fetching grains:", error);
      toast.error("Failed to load grain categories");
    }
  };

  // Add or update price
  const handleAddPrice = async () => {
    if (loading) return; // Prevent multiple clicks

    if (!selectedGrainName || !maxPrice || !avgPrice || !minPrice) {
      toast.error("Please fill all price fields and select a grain");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/pricehistory/addtodayprice`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grain_name: selectedGrainName,
            maxprice: parseFloat(maxPrice),
            avgprice: parseFloat(avgPrice),
            minprice: parseFloat(minPrice),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Grain price updated successfully");
        setSelectedGrainName("");
        setMaxPrice("");
        setAvgPrice("");
        setMinPrice("");
        fetchAllGrains();

        if (selectedGraphGrainName === selectedGrainName) {
          fetchPriceHistory(selectedGrainName);
        }
      } else {
        toast.error(data.message || "Failed to update price");
      }
    } catch (error) {
      console.error("Error updating price:", error);
      toast.error("Something went wrong while updating price");
    } finally {
      setLoading(false);
    }
  };

  // Fetch price history for a grain
  const fetchPriceHistory = async (grainName) => {
    if (!grainName) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/pricehistory/allpricehistory/${grainName}`
      );
      if (!response.ok) throw new Error("Failed to fetch price history");
      const data = await response.json();

      // Update state using the separate arrays from API
      setCategories(data.grain_type || ""); // grain name
      setDate(data.dates || []); // dates array
      setMaxPriceData(data.maxPrices || []); // maxPrices array
      setAvgPriceData(data.avgPrices || []); // avgPrices array
      setMinPriceData(data.minPrices || []); // minPrices array
    } catch (error) {
      console.error("Error fetching price history:", error);
      toast.error("Failed to load price history");
    }
  };
  useEffect(() => {
    if (selectedGraphGrainName) {
      fetchPriceHistory(selectedGraphGrainName);
    }
  }, [selectedGraphGrainName]);

  useEffect(() => {
    fetchAllGrains();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-amber-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-amber-600" />
            Add Today's Grain Price
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Grain Type Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grain Type
              </label>
              <select
                value={selectedGrainName}
                onChange={(e) => setSelectedGrainName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 hover:bg-white"
              >
                <option value="">Select a grain type...</option>
                {grains.map((grainType) => (
                  <option key={grainType} value={grainType}>
                    {grainType}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price (₹/Qtl)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Enter maximum price"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Avg Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avg Price (₹/Qtl)
              </label>
              <input
                type="number"
                value={avgPrice}
                onChange={(e) => setAvgPrice(e.target.value)}
                placeholder="Enter average price"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price (₹/Qtl)
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Enter minimum price"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 hover:bg-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleAddPrice}
            disabled={loading}
            className={`w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-md flex items-center justify-center gap-2 ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:from-amber-600 hover:to-orange-700 hover:shadow-lg"
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Updating...</span>
              </div>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Update Price
              </>
            )}
          </button>
        </div>

        {/* Grain List */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Current Grain Prices
          </h2>

          {grains.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Wheat className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No grains available yet</p>
            </div>
          ) : (
            <div>
              {/* Dropdown for selecting graph grain */}
              <div className="mb-8 flex flex-col md:flex-row md:items-end md:gap-4">
                <div className="w-full md:w-72">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Grain for Price Trend
                  </label>
                  <select
                    value={selectedGraphGrainName}
                    onChange={(e) => setSelectedGraphGrainName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 hover:bg-white"
                  >
                    <option value="">Select a grain...</option>
                    {grains.map((grainType) => (
                      <option key={grainType} value={grainType}>
                        {grainType}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Graph */}
              {date.length > 0 ? (
                <Grainpricegraph
                  date={date}
                  maxprice={maxPriceData}
                  avgprice={avgPriceData}
                  minprice={minPriceData}
                  categories={categories}
                />
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-lg">No data available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrainPriceManager;
