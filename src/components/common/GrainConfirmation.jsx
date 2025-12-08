"use client";
import React from "react";
import {
  X,
  Package,
  Scale,
  Award,
  Warehouse,
  Info,
  TrendingUp,
  Droplets,
  ArrowLeftRight,
} from "lucide-react";

const GrainConfirmation = ({
  isOpen,
  onClose,
  confirmationData,
  onConfirm,
}) => {
  if (!isOpen || !confirmationData) return null;

  const quantity = confirmationData.quantity || 0;
  const price = confirmationData.currentPrice || 0;
  const totalValue = price * quantity;
  const moistureContent = confirmationData.moisture_content || 0;
  const transactionType = confirmationData.transaction_type || "Invalid";

  const netAmountInStorage = totalValue;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  // Get transaction type badge color
  const getTransactionTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "deposit":
        return "from-green-400 to-emerald-500";
      case "withdrawal":
        return "from-orange-400 to-red-500";
      case "transfer":
        return "from-blue-400 to-indigo-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300 no-scrollbar">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 sm:px-6 py-4 sm:py-5 relative sticky top-0 z-10">
          <button
            onClick={onClose}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3 pr-8">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <Package size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Confirm Storage
              </h2>
              <p className="text-emerald-50 text-xs sm:text-sm mt-1">
                Review your grain storage details
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4">
          {/* Profile */}
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 border-2 border-blue-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-bold">
                {confirmationData.farmer_image ? (
                  <img
                    src={confirmationData.farmer_image}
                    alt={confirmationData.farmer_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {confirmationData.farmer_name?.charAt(0).toUpperCase() ||
                      "U"}
                  </div>
                )}
              </div>
              <div className="flex justify-between w-full">
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-semibold text-gray-700">
                    {confirmationData.farmer_name || "Unknown Farmer"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {confirmationData.farmer_email || "No email"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {confirmationData.farmer_phone_number || "No phone number"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-bold">
                    {confirmationData.farmer_userId || "No userId"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Type Badge */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-gray-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowLeftRight size={18} className="text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Transaction Type
                </span>
              </div>
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r ${getTransactionTypeColor(
                    transactionType
                  )} shadow-md`}
                >
                  <ArrowLeftRight size={14} />
                  {transactionType}
                </span>
              </div>
            </div>
          </div>

          {/* Market Price */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-purple-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Current Market Price
                </span>
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl font-bold text-purple-700">
                  ₹{price.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-gray-500">per quintal</p>
              </div>
            </div>
          </div>

          {/* Grain Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailCard
              icon={<Package size={16} className="text-emerald-600" />}
              label="Grain Category"
              value={confirmationData.grainCategory || "-"}
            />
            <DetailCard
              icon={<Scale size={16} className="text-emerald-600" />}
              label="Quantity"
              value={`${quantity} Quintals`}
            />
            <DetailCard
              icon={<Award size={16} className="text-emerald-600" />}
              label="Quality Grade"
              value={confirmationData.grainQuality || "-"}
            />
            <DetailCard
              icon={<Warehouse size={16} className="text-emerald-600" />}
              label="Warehouse"
              value={confirmationData.warehouse || "-"}
            />
          </div>

          {/* Moisture Content */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets size={18} className="text-cyan-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Moisture Content
                </span>
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl font-bold text-cyan-700">
                  {moistureContent}%
                </p>
                <p className="text-xs text-gray-500">
                  {moistureContent <= 12 ? (
                    <span className="text-green-600 font-semibold">✓ Optimal</span>
                  ) : moistureContent <= 14 ? (
                    <span className="text-yellow-600 font-semibold">⚠ Acceptable</span>
                  ) : (
                    <span className="text-red-600 font-semibold">✗ High</span>
                  )}
                </p>
              </div>
            </div>
            {moistureContent > 14 && (
              <div className="mt-2 pt-2 border-t border-cyan-200">
                <p className="text-xs text-orange-600 font-medium flex items-center gap-1">
                  <Info size={12} />
                  High moisture may affect storage quality
                </p>
              </div>
            )}
          </div>

          {/* Total Grain Value */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-3">
            <p className="text-xs text-gray-600 mb-1">Total Grain Value</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              ₹{totalValue.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {quantity} × ₹{price.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-3 space-y-1.5">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="text-gray-700">
                  <span className="font-semibold">Min. period:</span> 6 months
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Storage fee:</span>{" "}
                  ₹0.20/quintal/day
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">
                    Quality check is mandatory
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Net Summary */}
          <div className="bg-gradient-to-r from-slate-100 to-gray-100 rounded-xl p-4 border-2 border-gray-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-600">Net Amount</p>
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  ₹{netAmountInStorage.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 flex gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all hover:border-gray-400 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Confirm Storage
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Detail Card
const DetailCard = ({ icon, label, value }) => (
  <div className="group">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <label className="text-xs sm:text-sm font-semibold text-gray-700">
        {label}
      </label>
    </div>
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl px-3 py-2.5 transition-all group-hover:border-emerald-300">
      <p className="text-sm sm:text-base text-gray-900 font-medium break-words truncate">
        {value}
      </p>
    </div>
  </div>
);

export default GrainConfirmation;
