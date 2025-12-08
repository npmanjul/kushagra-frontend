import { formatRupee, getStatusColor } from "@/utils/formatting";
import React from "react";

const InventoryCard = ({ item }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <h3 className="text-xl font-bold text-gray-900 mb-4">{item.grain}</h3>
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Total Stock:</span>
        <span className="font-semibold text-gray-900">
          {item.totalStock} Quintals
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center p-2 rounded-lg bg-green-50">
          <p className="text-green-700 font-semibold">A: {item.qualityA}</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-yellow-50">
          <p className="text-yellow-700 font-semibold">B: {item.qualityB}</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-red-50">
          <p className="text-red-700 font-semibold">C: {item.qualityC}</p>
        </div>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Avg Price:</span>
        <span className="font-semibold text-gray-900">
          {formatRupee(item.avgPrice)}/Quintal
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Last Updated:</span>
        <span className="text-sm text-gray-500">{item.lastUpdated}</span>
      </div>
    </div>
  </div>
);

  const inventory = [
    {
      grain: "Wheat",
      totalStock: 15000,
      qualityA: 8000,
      qualityB: 5000,
      qualityC: 2000,
      avgPrice: 2275,
      lastUpdated: "2025-08-30",
    },
    {
      grain: "Rice",
      totalStock: 12000,
      qualityA: 6000,
      qualityB: 4000,
      qualityC: 2000,
      avgPrice: 2890,
      lastUpdated: "2025-08-30",
    },
    {
      grain: "Maize",
      totalStock: 8000,
      qualityA: 4000,
      qualityB: 3000,
      qualityC: 1000,
      avgPrice: 1850,
      lastUpdated: "2025-08-30",
    },
  ];

const page = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Inventory Management
        </h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-semibold transition-colors">
          Update Stock
        </button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.map((item, index) => (
          <InventoryCard key={index} item={item} />
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            Detailed Inventory
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Grain
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total Stock
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  A Grade
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  B Grade
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  C Grade
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Price/Quintal
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.grain}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.totalStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {item.qualityA}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                    {item.qualityB}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {item.qualityC}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatRupee(item.avgPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        item.totalStock > 10000
                          ? "active"
                          : item.totalStock > 5000
                          ? "medium"
                          : "low"
                      )}`}
                    >
                      {item.totalStock > 10000
                        ? "High"
                        : item.totalStock > 5000
                        ? "Medium"
                        : "Low"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default page;
