import { formatRupee } from '@/utils/formatting'
import React from 'react'

const page = () => {
  return (
      <div className="space-y-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Financial Management
            </h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-semibold transition-colors">
              Download Financial Report
            </button>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <h3 className="font-bold text-gray-900 mb-2">Today's Income</h3>
              <p className="text-2xl font-bold text-green-600">
                {formatRupee(345670)}
              </p>
              <p className="text-sm text-gray-600">+12% from previous day</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <h3 className="font-bold text-gray-900 mb-2">Monthly Income</h3>
              <p className="text-2xl font-bold text-blue-600">
                {formatRupee(7845230)}
              </p>
              <p className="text-sm text-gray-600">85% of target</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
              <h3 className="font-bold text-gray-900 mb-2">
                Outstanding Payments
              </h3>
              <p className="text-2xl font-bold text-orange-600">
                {formatRupee(1234560)}
              </p>
              <p className="text-sm text-gray-600">23 farmers</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <h3 className="font-bold text-gray-900 mb-2">
                Total Asset Value
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {formatRupee(125000000)}
              </p>
              <p className="text-sm text-gray-600">45,678 Quintals</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Revenue Source Breakdown
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-gray-600">Storage Fees</span>
                    <span className="font-semibold">35%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "35%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-gray-600">Processing Margin</span>
                    <span className="font-semibold">40%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "40%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-gray-600">Credit Interest</span>
                    <span className="font-semibold">15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: "15%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-gray-600">Other Services</span>
                    <span className="font-semibold">10%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: "10%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-3">
                  Upcoming Payments
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Farmer Bonus</span>
                    <span className="font-semibold">{formatRupee(456780)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Staff Salary</span>
                    <span className="font-semibold">{formatRupee(234000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Maintenance</span>
                    <span className="font-semibold">{formatRupee(89500)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Electricity Bill</span>
                    <span className="font-semibold">{formatRupee(45670)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-sm">Total</span>
                    <span className="text-sm">{formatRupee(825950)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default page