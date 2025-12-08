"use client";
import React from 'react';
import { Calculator } from 'lucide-react';

const StorageCalculator = ({ qty = 100, months = 12, setCalc }) => {
  const storageCost = (quantityQtl, months) => {
    const dailyPerQtl = 0.2;
    const days = months * 30;
    return Math.round((quantityQtl || 0) * dailyPerQtl * days);
  };

  const estCost = storageCost(Number(qty), Number(months));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <Calculator className="mr-2 text-blue-600" />
        Storage Calculator
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Qtl)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded bg-white"
            placeholder="100"
            value={qty}
            onChange={(e) => setCalc((c) => ({ ...c, qtyDisplay: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Storage Period (months)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded bg-white"
            placeholder="12"
            value={months}
            onChange={(e) => setCalc((c) => ({ ...c, months: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
          <div className="p-2 bg-gray-100 rounded font-bold">₹{estCost.toLocaleString()}</div>
        </div>

        <div className="flex items-end">
          <div className="text-sm text-gray-500">Tip: Longer storage earns bonus on price after 1 year.</div>
        </div>
      </div>
    </div>
  );
};

export default StorageCalculator;
