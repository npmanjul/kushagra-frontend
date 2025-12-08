import { formatRupee, getStatusColor } from "@/utils/formatting";
import React from "react";

const page = () => {
 return(
     <div className="space-y-8">
    <div className="flex justify-between items-center flex-wrap gap-4">
      <h2 className="text-3xl font-bold text-gray-900">Credit Management</h2>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-semibold transition-colors">
        New Credit Approval
      </button>
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Credit Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Active Credit:</span>
            <span className="font-bold text-blue-600">
              {formatRupee(27400000)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Interest Rate:</span>
            <span className="font-semibold">1.25% per quarter</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Average Credit Term:</span>
            <span className="font-semibold">18 months</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Recovery Rate:</span>
            <span className="font-semibold text-green-600">97.8%</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          This Month's Interest
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Interest Earned:</span>
            <span className="font-bold text-green-600">
              {formatRupee(85250)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pending Payments:</span>
            <span className="font-semibold text-orange-600">
              {formatRupee(12500)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Next Quarter:</span>
            <span className="font-semibold">September 1st</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Risk Assessment
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Low Risk:</span>
            <span className="font-semibold text-green-600">
              {formatRupee(21960000)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Medium Risk:</span>
            <span className="font-semibold text-yellow-600">
              {formatRupee(4120000)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">High Risk:</span>
            <span className="font-semibold text-red-600">
              {formatRupee(1320000)}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">
          Active Credit Accounts
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Farmer
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Credit Amount
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Grain Collateral
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Interest Due
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Next Payment
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Ram Kumar
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatRupee(900000)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                1500 Qntls Wheat
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatRupee(33750)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                September 15
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    "active"
                  )}`}
                >
                  Low
                </span>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Shyam Singh
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatRupee(480000)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                800 Qntls Rice
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatRupee(18000)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                August 30
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    "medium"
                  )}`}
                >
                  Medium
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
 )
};

export default page;
