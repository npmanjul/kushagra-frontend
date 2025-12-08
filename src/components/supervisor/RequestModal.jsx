import React from 'react';
import {
  X,
  User,
  Building,
  Package,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Droplets,
  Scale,
  IndianRupee,
  AlertCircle
} from "lucide-react";
import { formatRupee } from "@/utils/formatting";

const RequestModal = ({ 
  transaction, 
  config, 
  onClose, 
  onApprove, 
  onReject, 
  getApprovalStatus 
}) => {
  if (!transaction) return null;

  const approvalStatus = getApprovalStatus(transaction.approval);
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp">
        {/* Modal Header */}
        <div className={`bg-gradient-to-r ${config.gradient} p-8 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Transaction Details</h2>
                  <p className="text-white/80 mt-1">{config.label} Transaction</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-200 hover:scale-110"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {/* Transaction ID */}
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <span className="text-white/80 text-sm">Transaction ID:</span>
              <span className="font-mono font-semibold">
                #{transaction._id?.slice(-12).toUpperCase() || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-325px)]">
          <div className="p-8 space-y-6">
            {/* Status Banner */}
            <StatusBanner approvalStatus={approvalStatus} />

            {/* Quick Stats */}
            <QuickStats transaction={transaction} />

            {/* Information Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* User Information Card */}
              <UserInfoCard user={transaction.user} />
              
              {/* Warehouse Information Card */}
              <WarehouseInfoCard warehouse={transaction.warehouse} />
            </div>

            {/* Grain Details Section */}
            <GrainDetailsSection grains={transaction.grains} />

            {/* Financial Summary */}
            <FinancialSummary 
              transaction={transaction} 
              config={config}
            />

            {/* Approval Timeline */}
            <ApprovalTimeline approval={transaction.approval} />

            {/* Additional Information */}
            <AdditionalInfo transaction={transaction} />
          </div>
        </div>

        {/* Action Footer */}
        {approvalStatus.text === 'Awaiting Supervisor' && (
          <ActionFooter onApprove={onApprove} onReject={onReject} />
        )}
      </div>
    </div>
  );
};

// Sub-components for the modal

const StatusBanner = ({ approvalStatus }) => (
  <div className="relative bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl p-6 border border-gray-200">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
    <div className="relative flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${
          approvalStatus.text === 'Fully Approved' ? 'bg-green-100' :
          approvalStatus.text === 'Awaiting Supervisor' ? 'bg-yellow-100' :
          'bg-gray-100'
        }`}>
          {approvalStatus.icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wider">Current Status</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${approvalStatus.dotColor} animate-pulse`}></span>
            <p className="font-semibold text-lg text-gray-900">{approvalStatus.text}</p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">Last Updated</p>
        <p className="font-medium text-gray-900">
          {new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>
      </div>
    </div>
  </div>
);

const QuickStats = ({ transaction }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {[
      {
        icon: <Package className="w-5 h-5" />,
        label: "Total Quantity",
        value: `${transaction.grains?.[0]?.quantity_quintal || 0} Qtl`,
        color: "blue"
      },
      {
        icon: <Droplets className="w-5 h-5" />,
        label: "Moisture Content",
        value: `${transaction.grains?.[0]?.moisture_content || 0}%`,
        color: "cyan"
      },
      {
        icon: <IndianRupee className="w-5 h-5" />,
        label: "Price/Quintal",
        value: formatRupee(transaction.grains?.[0]?.price_per_quintal || 0),
        color: "green"
      },
      {
        icon: <Calendar className="w-5 h-5" />,
        label: "Transaction Date",
        value: transaction.transaction_date 
          ? new Date(transaction.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : 'N/A',
        color: "purple"
      }
    ].map((stat, index) => (
      <div key={index} className={`bg-${stat.color}-50 border border-${stat.color}-200 rounded-2xl p-4`}>
        <div className={`inline-flex p-2 bg-${stat.color}-100 rounded-xl text-${stat.color}-600 mb-3`}>
          {stat.icon}
        </div>
        <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
        <p className="font-semibold text-gray-900 mt-1">{stat.value}</p>
      </div>
    ))}
  </div>
);

const UserInfoCard = ({ user }) => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
    <div className="flex items-center gap-3 mb-5">
      <div className="p-3 bg-blue-100 rounded-xl">
        <User className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">User Information</h3>
    </div>
    <div className="space-y-4">
      {[
        { label: "Full Name", value: user?.name || 'N/A' },
        { label: "Email Address", value: user?.email || 'N/A' },
        { label: "Phone Number", value: user?.phone_number || 'N/A' },
        { label: "User Type", value: user?.role || 'Customer' }
      ].map((item, index) => (
        <div key={index} className="flex justify-between items-start">
          <span className="text-sm text-gray-500">{item.label}</span>
          <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const WarehouseInfoCard = ({ warehouse }) => (
  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
    <div className="flex items-center gap-3 mb-5">
      <div className="p-3 bg-purple-100 rounded-xl">
        <Building className="w-6 h-6 text-purple-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Warehouse Information</h3>
    </div>
    <div className="space-y-4">
      {[
        { label: "Warehouse Name", value: warehouse?.name || 'N/A' },
        { label: "Location", value: warehouse?.location || 'N/A' },
        { label: "Capacity", value: warehouse?.capacity ? `${warehouse.capacity} Qtl` : 'N/A' },
        { label: "Manager", value: warehouse?.manager || 'N/A' }
      ].map((item, index) => (
        <div key={index} className="flex justify-between items-start">
          <span className="text-sm text-gray-500">{item.label}</span>
          <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const GrainDetailsSection = ({ grains }) => (
  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
    <div className="flex items-center gap-3 mb-5">
      <div className="p-3 bg-green-100 rounded-xl">
        <Package className="w-6 h-6 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Grain Details</h3>
    </div>
    {grains?.map((grain, index) => (
      <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-green-100">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <DetailItem 
            label="Grain Type" 
            value={grain.category?.grain_type || 'N/A'}
            icon={<Package className="w-4 h-4" />}
          />
          <DetailItem 
            label="Quantity" 
            value={`${grain.quantity_quintal || 0} Quintals`}
            icon={<Scale className="w-4 h-4" />}
          />
          <DetailItem 
            label="Price/Quintal" 
            value={formatRupee(grain.price_per_quintal || 0)}
            icon={<IndianRupee className="w-4 h-4" />}
          />
          <DetailItem 
            label="Moisture Content" 
            value={`${grain.moisture_content || 0}%`}
            icon={<Droplets className="w-4 h-4" />}
          />
          <DetailItem 
            label="Quality Grade" 
            value={grain.quality_grade || 'Standard'}
            icon={<AlertCircle className="w-4 h-4" />}
          />
          <DetailItem 
            label="Total Value" 
            value={formatRupee((grain.quantity_quintal || 0) * (grain.price_per_quintal || 0))}
            icon={<TrendingUp className="w-4 h-4" />}
          />
        </div>
      </div>
    ))}
  </div>
);

const DetailItem = ({ label, value, icon }) => (
  <div className="flex items-start gap-2">
    <div className="text-gray-400 mt-0.5">{icon}</div>
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

const FinancialSummary = ({ transaction, config }) => (
  <div className={`bg-gradient-to-r ${config.gradient} rounded-2xl p-8 text-white relative overflow-hidden`}>
    <div className="absolute inset-0 bg-black/10"></div>
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
    <div className="relative">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm uppercase tracking-wider mb-2">Total Transaction Amount</p>
          <p className="text-5xl font-bold">
            {formatRupee(transaction.total_amount || 0)}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div>
              <p className="text-white/60 text-sm">Payment Method</p>
              <p className="font-medium">{transaction.payment_method || 'Bank Transfer'}</p>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div>
              <p className="text-white/60 text-sm">Payment Status</p>
              <p className="font-medium">{transaction.payment_status || 'Pending'}</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white/20 backdrop-blur-sm rounded-3xl">
          <TrendingUp className="w-12 h-12 text-white" />
        </div>
      </div>
    </div>
  </div>
);

const ApprovalTimeline = ({ approval }) => (
  <div className="bg-gray-50 rounded-2xl p-6">
    <div className="flex items-center gap-3 mb-5">
      <div className="p-3 bg-gray-100 rounded-xl">
        <Activity className="w-6 h-6 text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Approval Timeline</h3>
    </div>
    <div className="space-y-4">
      <TimelineItem
        title="Manager Approval"
        status={approval?.manager_approval?.status}
        date={approval?.manager_approval?.date}
        approvedBy={approval?.manager_approval?.approved_by}
        isLast={false}
      />
      <TimelineItem
        title="Supervisor Approval"
        status={approval?.supervisor_approval?.status}
        date={approval?.supervisor_approval?.date}
        approvedBy={approval?.supervisor_approval?.approved_by}
        isLast={true}
      />
    </div>
  </div>
);

const TimelineItem = ({ title, status, date, approvedBy, isLast }) => (
  <div className="flex items-start gap-4">
    <div className="relative">
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center transition-all
        ${status 
          ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg' 
          : 'bg-gray-200 text-gray-400'
        }
      `}>
        {status ? (
          <CheckCircle className="w-6 h-6" />
        ) : (
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
        )}
      </div>
      {!isLast && (
        <div className={`
          absolute top-12 left-6 w-0.5 h-12 transition-all
          ${status ? 'bg-gradient-to-b from-green-400 to-green-200' : 'bg-gray-300'}
        `}></div>
      )}
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900 text-lg">{title}</p>
          {status && approvedBy && (
            <p className="text-sm text-gray-500 mt-1">Approved by: {approvedBy}</p>
          )}
        </div>
        <span className={`
          px-3 py-1 rounded-full text-xs font-medium
          ${status 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-600'
          }
        `}>
          {status ? 'Completed' : 'Pending'}
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {date ? new Date(date).toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : 'Awaiting approval'}
      </p>
    </div>
  </div>
);

const AdditionalInfo = ({ transaction }) => (
  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
    <div className="flex items-center gap-3 mb-5">
      <div className="p-3 bg-amber-100 rounded-xl">
        <AlertCircle className="w-6 h-6 text-amber-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[
        { label: "Transaction Type", value: transaction.type || 'N/A' },
        { label: "Reference Number", value: transaction.reference_number || 'N/A' },
        { label: "Notes", value: transaction.notes || 'No additional notes' },
        { label: "Created At", value: transaction.created_at 
          ? new Date(transaction.created_at).toLocaleString() 
          : 'N/A' 
        }
      ].map((item, index) => (
        <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
          <p className="text-sm font-medium text-gray-900">{item.value}</p>
        </div>
      ))}
    </div>
  </div>
);

const ActionFooter = ({ onApprove, onReject }) => (
  <div className="border-t border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-white">
    <div className="flex gap-4">
      <button
        onClick={onReject}
        className="flex-1 group relative bg-white border-2 border-red-200 hover:border-red-300 text-red-600 px-6 py-4 rounded-2xl font-semibold transition-all transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-3 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <XCircle className="w-5 h-5" />
        <span>Reject Transaction</span>
      </button>
      <button
        onClick={onApprove}
        className="flex-1 group relative bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
      >
        <CheckCircle className="w-5 h-5" />
        <span>Approve Transaction</span>
      </button>
    </div>
    <p className="text-center text-sm text-gray-500 mt-4">
      Please review all details carefully before making a decision
    </p>
  </div>
);

export default RequestModal;