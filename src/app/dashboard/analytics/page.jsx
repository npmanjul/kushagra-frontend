"use client";
import React from "react";
import { PieChart } from "lucide-react";

// Dummy data and functions
const market = {
  Wheat: { price: 2547 },
  Rice: { price: 2842 },
  Maize: { price: 1678 },
};
const grainInventory = [
  { id: 1, type: "Wheat", quantityQtl: 500, spRate: 2000 },
  { id: 2, type: "Rice", quantityQtl: 300, spRate: 1800 },
  { id: 3, type: "Maize", quantityQtl: 200, spRate: 1600 },
];
const salesHistory = [
  {
    id: 1,
    type: "Wheat",
    quantityQtl: 100,
    amount: 230000,
    date: "2024-02-20",
    status: "Paid",
  },
  {
    id: 2,
    type: "Rice",
    quantityQtl: 50,
    amount: 142100,
    date: "2024-03-15",
    status: "Paid",
  },
];
const totalQuantityQtl = grainInventory.reduce(
  (sum, item) => sum + item.quantityQtl,
  0
);

function formatCurrency(val) {
  return "₹" + Number(val).toLocaleString();
}
function calculateFutureValue(item) {
  // Example: 12% annual growth for 1 year
  return Math.round(item.quantityQtl * item.spRate * 1.12);
}
function storageCost(quantityQtl, months) {
  const dailyPerQtl = 0.2; // ₹0.20 per qtl per day
  const days = months * 30;
  return Math.round((quantityQtl || 0) * dailyPerQtl * days);
}

const AnalyticsContent = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <PieChart className="mr-2 text-purple-600" />
        Analytics & Reports
      </h2>

      {/* Price Trends (Last 6 months) */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Price Trends (Last 6 months)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-green-600">Wheat</h4>
            <div className="text-2xl font-bold">
              {formatCurrency(market.Wheat.price)}
            </div>
            <div className="text-sm text-green-600">+12% (6 months)</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-blue-600">Rice</h4>
            <div className="text-2xl font-bold">
              {formatCurrency(market.Rice.price)}
            </div>
            <div className="text-sm text-blue-600">+8% (6 months)</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-500 h-2 rounded-full w-2/3"></div>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-purple-600">Maize</h4>
            <div className="text-2xl font-bold">
              {formatCurrency(market.Maize.price)}
            </div>
            <div className="text-sm text-red-600">-2% (6 months)</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-purple-500 h-2 rounded-full w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Profit Analysis */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Profit Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">
              Estimated Value (after 1–5 years):
            </h4>
            {grainInventory.map((item) => (
              <div key={item.id} className="flex justify-between py-1">
                <span>{item.type}:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(calculateFutureValue(item))}
                </span>
              </div>
            ))}
          </div>
          <div>
            <h4 className="font-medium mb-2">Bonus Structure:</h4>
            <ul className="text-sm space-y-1">
              <li>1 year: 10% bonus</li>
              <li>5 years: 15% bonus</li>
              <li>Beyond 5y: subject to market terms</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    {/* Monthly Report */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Monthly Report</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">This Month's Activity</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>New Deposits:</span>
              <span className="font-bold">2</span>
            </div>
            <div className="flex justify-between">
              <span>Sales:</span>
              <span className="font-bold">{salesHistory.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Income:</span>
              <span className="font-bold text-green-600">
                {formatCurrency(salesHistory.reduce((s, x) => s + x.amount, 0))}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Storage Costs</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Approx Monthly Fee:</span>
              <span className="font-bold">
                {formatCurrency(storageCost(totalQuantityQtl, 1))}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Paid (est.):</span>
              <span className="font-bold">
                {formatCurrency(storageCost(totalQuantityQtl, 6))}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Net Profit (sample):</span>
              <span className="font-bold text-green-600">
                {formatCurrency(
                  salesHistory.reduce((s, x) => s + x.amount, 0) -
                    storageCost(totalQuantityQtl, 6)
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AnalyticsContent;
