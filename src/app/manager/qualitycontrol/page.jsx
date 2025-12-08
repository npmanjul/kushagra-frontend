import React from "react";

const page = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Quality Control</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-semibold transition-colors">
          Start New Inspection
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-green-700 mb-4">
            A Grade (Excellent)
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Moisture: ≤12%</p>
            <p>Foreign Matter: ≤1%</p>
            <p>Broken Grains: ≤2%</p>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-4">
            18,000 Quintals
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <h3 className="text-xl font-bold text-yellow-700 mb-4">
            B Grade (Good)
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Moisture: 12-14%</p>
            <p>Foreign Matter: 1-3%</p>
            <p>Broken Grains: 2-5%</p>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mt-4">
            12,000 Quintals
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <h3 className="text-xl font-bold text-red-700 mb-4">
            C Grade (Fair)
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Moisture: 14-16%</p>
            <p>Foreign Matter: 3-5%</p>
            <p>Broken Grains: 5-8%</p>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-4">5,000 Quintals</p>
        </div>
      </div>
    </div>
  );
};

export default page;
