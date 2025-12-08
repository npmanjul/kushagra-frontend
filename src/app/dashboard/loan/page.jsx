"use client";
import React, { useState } from "react";
import {
  CreditCard,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield,
  Calendar,
  ArrowRight,
  Info,
} from "lucide-react";
import { toast } from "react-hot-toast";
import LoanConformation from "@/components/dashboard/LoanConformation";
import API_BASE_URL from "@/utils/constants";

// Dummy data and functions
const totalValue = 500000;
function formatCurrency(val) {
  return "₹" + Number(val).toLocaleString();
}
function calculateCredit() {
  return Math.round(totalValue * 0.6);
}
function addNotification(msg, type) {
  toast(msg, { icon: type === "success" ? "✅" : "⚠️" });
}

const CreditContent = () => {
  const [creditAmount, setCreditAmount] = useState("");
  const [creditTenureMonths, setCreditTenureMonths] = useState("");

  const amount = Number(creditAmount) || 0;
  const months = Number(creditTenureMonths) || 0;

  const quarters = Math.ceil(months / 3);
  const interestRatePerQuarter = 0.0125;
  const creditInterest = Math.round(amount * interestRatePerQuarter * quarters);
  const creditTotalPayable = amount + creditInterest;
  const creditEMIMonthly =
    months > 0 ? Math.round(creditTotalPayable / months) : 0;

  const creditPercentage = (amount / calculateCredit()) * 100;
  const [showModal, setShowModal] = useState(false);
  const [calculation, setCalculation] = useState({});

  const fetchCalculation = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/loan/loancalculation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        loan_amount: amount,
      }),
    });

    if (!response.ok) throw new Error("Failed to fetch loan calculation");

    const result = await response.json();
    setShowModal(true);
    setCalculation(result);
  } catch (error) {
    console.error("Error fetching loan calculation:", error);
    toast.error("Failed to load loan calculation");
  }
};

  const handleConfirm = () => {
   
    
    setShowModal(false);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center">
                <CreditCard className="mr-3 h-8 w-8" />
                Credit Facility
              </h2>
              <p className="text-blue-100">
                Get instant credit against your stored grain
              </p>
            </div>
            <Shield className="h-12 w-12 text-blue-200" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Available Loan Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white/90">
                  Available Credit
                </h3>
                <TrendingUp className="h-5 w-5 text-green-300" />
              </div>
              <p className="text-4xl font-bold mb-2">
                {formatCurrency(calculateCredit())}
              </p>
              <div className="flex items-center gap-2">
                <div className="bg-green-400/20 rounded-full px-3 py-1">
                  <span className="text-xs font-medium text-green-300">
                    60% LTV
                  </span>
                </div>
                <span className="text-sm text-white/70">of grain value</span>
              </div>
            </div>

            {/* Active Loan Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white/90">Active Loans</h3>
                <Clock className="h-5 w-5 text-yellow-300" />
              </div>
              <p className="text-4xl font-bold mb-2">{formatCurrency(0)}</p>
              <div className="flex items-center gap-2">
                <div className="bg-blue-400/20 rounded-full px-3 py-1">
                  <span className="text-xs font-medium text-blue-300">
                    No dues
                  </span>
                </div>
                <span className="text-sm text-white/70">All clear</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Credit Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Credit Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                  ₹
                </span>
                <input
                  type="number"
                  className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white text-lg font-medium"
                  placeholder="Enter amount"
                  max={calculateCredit()}
                  value={creditAmount}
                  onChange={(e) => {
                    const v = Math.max(
                      0,
                      Math.min(Number(e.target.value || 0), calculateCredit())
                    );
                    setCreditAmount(e.target.value === "" ? "" : v);
                  }}
                />
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>0</span>
                  <span className="font-semibold">
                    {formatCurrency(calculateCredit())}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${creditPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Tenure Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Repayment Tenure (Months)
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                <input
                  type="number"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white text-lg font-medium"
                  placeholder="Enter tenure in months"
                  value={creditTenureMonths}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCreditTenureMonths(
                      value === "" ? "" : Math.max(0, Number(value))
                    );
                  }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  months
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Info className="h-4 w-4 text-gray-400" />
                <p className="text-xs text-gray-500">
                  Enter your preferred repayment period
                </p>
              </div>
            </div>

            {/* Interest Info */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Interest Rate
                  </h3>
                  <p className="text-3xl font-bold text-indigo-600">1.25%</p>
                  <p className="text-sm text-gray-600 mt-1">per quarter</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Processing Fee</p>
                  <p className="text-2xl font-bold text-green-600">₹0</p>
                  <p className="text-xs text-gray-500 mt-1">
                    No hidden charges
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              onClick={()=> fetchCalculation()}
              type="button"
            >
              Apply for Credit
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      <LoanConformation
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        loanData={calculation} // Pass actual loan data
        tenure={12} // Pass selected tenure
      />
    </>
  );
};

export default CreditContent;
