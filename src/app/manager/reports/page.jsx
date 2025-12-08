import { formatRupee } from "@/utils/formatting";
import { BarChart3, Download } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Reports & Analytics
        </h2>
        <div className="flex space-x-2">
          <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>This Month</option>
            <option>Last Month</option>
            <option>Quarterly</option>
            <option>Annually</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full flex items-center transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Storage Report
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Storage (Quintals):</span>
              <span className="font-semibold">45,678</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Storage Fees Earned:</span>
              <span className="font-semibold">{formatRupee(91356)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Storage Period:</span>
              <span className="font-semibold">8.5 Months</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Credit Report
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Credit:</span>
              <span className="font-semibold">{formatRupee(2740000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Interest Income:</span>
              <span className="font-semibold">{formatRupee(34250)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Default Rate:</span>
              <span className="font-semibold text-green-600">0.5%</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Processing Report
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Processing Volume:</span>
              <span className="font-semibold">2,340 Quintals</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Farmer Share (1-5%):</span>
              <span className="font-semibold">{formatRupee(117000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Company Margin:</span>
              <span className="font-semibold">{formatRupee(2340000)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Monthly Performance
        </h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
