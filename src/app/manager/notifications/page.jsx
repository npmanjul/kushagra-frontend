import { formatRupee } from "@/utils/formatting";
import React from "react";

const page = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Notification Center
        </h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-semibold transition-colors">
          Mark All as Read
        </button>
      </div>
      <div className="grid gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">
                High Priority - Stock Alert
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Maize C grade stock at critical levels (500 Quintals left)
              </p>
              <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
            </div>
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
              High
            </span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">
                Quality Check Required
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Ram Kumar's new stock (500 Quintals of Wheat) awaiting quality
                inspection
              </p>
              <p className="text-xs text-gray-500 mt-2">5 hours ago</p>
            </div>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
              Medium
            </span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">
                Bonus Payment Ready
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Sunita Sharma's 6th year completed - 7% bonus (
                {formatRupee(62440)}) is ready for payment
              </p>
              <p className="text-xs text-gray-500 mt-2">1 day ago</p>
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
              Info
            </span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">
                Monthly Report Ready
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Monthly report for August 2025 is ready for download
              </p>
              <p className="text-xs text-gray-500 mt-2">2 days ago</p>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
              Normal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
