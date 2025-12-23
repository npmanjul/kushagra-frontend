// components/common/RequestModal.jsx
"use client";
import React from "react";
import {
  X,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Package,
  Droplets,
  CreditCard,
  FileText,
  AlertCircle,
  Loader2,
  Crown,
  UserCog,
  Users,
  ArrowRight
} from "lucide-react";
import { formatRupee } from "@/utils/formatting";

const RequestModal = ({
  transaction,
  config,
  transactionType,
  onClose,
  onApprove,
  onReject,
  getApprovalStatus,
  getIndividualApprovalStatus,
  userRole = "supervisor",
  canApprove = false,
  isProcessing = false
}) => {
  if (!transaction) return null;

  const approvalStatus = getApprovalStatus(transaction.approval, transaction.transaction_status);
  const Icon = config.icon;

  const grainData = transaction.grain || transaction.grains || [];
  const firstGrain = grainData[0] || {};

  const isPending = transaction.transaction_status === 'pending';
  const isWithdrawal = transactionType === 'withdraw';

  // Get individual approval statuses
  const adminApproval = getIndividualApprovalStatus(transaction.approval?.admin_approval);
  const managerApproval = getIndividualApprovalStatus(transaction.approval?.manager_approval);
  const supervisorApproval = getIndividualApprovalStatus(transaction.approval?.supervisor_approval);

  // Remarks display mapping
  const remarksDisplayMap = {
    personal_use: { label: "Personal Use", icon: "🏠", color: "bg-blue-50 text-blue-700 border-blue-200" },
    sale: { label: "For Sale", icon: "💰", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    other: { label: "Other", icon: "📋", color: "bg-gray-50 text-gray-700 border-gray-200" }
  };

  const getRemarksInfo = () => {
    if (!isWithdrawal || !transaction.remarks) return null;
    return remarksDisplayMap[transaction.remarks] || remarksDisplayMap.other;
  };

  const remarksInfo = getRemarksInfo();

  // Role configuration
  const roleIcons = {
    admin: Crown,
    manager: UserCog,
    supervisor: Users
  };

  const ApprovalTimelineItem = ({ label, approval, roleKey }) => {
    const RoleIcon = roleIcons[roleKey];
    const isCurrentUser = userRole === roleKey;
    
    const getStyles = () => {
      switch (approval.status) {
        case 'approved':
          return {
            bg: 'bg-emerald-100',
            border: 'border-emerald-300',
            text: 'text-emerald-700',
            icon: <CheckCircle className="w-5 h-5 text-emerald-600" />
          };
        case 'rejected':
          return {
            bg: 'bg-red-100',
            border: 'border-red-300',
            text: 'text-red-700',
            icon: <XCircle className="w-5 h-5 text-red-600" />
          };
        default:
          return {
            bg: isCurrentUser && canApprove ? 'bg-amber-100' : 'bg-gray-100',
            border: isCurrentUser && canApprove ? 'border-amber-300' : 'border-gray-300',
            text: isCurrentUser && canApprove ? 'text-amber-700' : 'text-gray-500',
            icon: <Clock className={`w-5 h-5 ${isCurrentUser && canApprove ? 'text-amber-600 animate-pulse' : 'text-gray-400'}`} />
          };
      }
    };

    const styles = getStyles();

    return (
      <div className={`
        flex items-center gap-3 p-4 rounded-xl border-2 ${styles.border} ${styles.bg}
        ${isCurrentUser && canApprove ? 'ring-2 ring-amber-400 ring-offset-2' : ''}
      `}>
        <div className={`p-2 rounded-lg ${styles.bg}`}>
          {styles.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <RoleIcon className={`w-4 h-4 ${styles.text}`} />
            <span className={`font-semibold ${styles.text}`}>{label}</span>
            {isCurrentUser && (
              <span className="px-2 py-0.5 bg-white/50 rounded-full text-xs font-medium">You</span>
            )}
          </div>
          {approval.hasAction && approval.user && (
            <p className="text-sm text-gray-600 mt-1">
              {approval.status === 'approved' ? 'Approved' : 'Rejected'} by {approval.user.name}
            </p>
          )}
          {approval.status === 'pending' && isCurrentUser && canApprove && (
            <p className="text-sm text-amber-600 mt-1 font-medium">
              ⚡ Action required
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className={`sticky top-0 z-10 bg-gradient-to-r ${config.gradient} p-6 rounded-t-2xl`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {config.label} Request Details
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Transaction ID: #{transaction._id?.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <span className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold
              bg-white/20 text-white backdrop-blur-sm
            `}>
              {approvalStatus.icon}
              {approvalStatus.text}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Information */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              User Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow icon={<User />} label="Name" value={transaction.user?.name || 'N/A'} />
              <InfoRow icon={<Phone />} label="Phone" value={transaction.user?.phone_number || 'N/A'} />
              <InfoRow icon={<Mail />} label="Email" value={transaction.user?.email || 'N/A'} />
              <InfoRow 
                icon={<Calendar />} 
                label="Date" 
                value={transaction.transaction_date 
                  ? new Date(transaction.transaction_date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })
                  : 'N/A'
                } 
              />
            </div>
          </div>

          {/* Warehouse Information - Only for deposits */}
          {!isWithdrawal && transaction.warehouse && (
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Warehouse Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow icon={<Building />} label="Name" value={transaction.warehouse.name || 'N/A'} />
                <InfoRow icon={<MapPin />} label="Location" value={transaction.warehouse.location || 'N/A'} />
              </div>
            </div>
          )}

          {/* Grain Information */}
          <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              Grain Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow 
                icon={<Package />} 
                label="Type" 
                value={firstGrain.category?.grain_type || 'N/A'} 
              />
              <InfoRow 
                icon={<FileText />} 
                label="Quality Grade" 
                value={firstGrain.category?.quality || 'N/A'} 
              />
              <InfoRow 
                icon={<Package />} 
                label="Quantity" 
                value={`${firstGrain.quantity_quintal || 0} Quintals`} 
              />
              <InfoRow 
                icon={<Droplets />} 
                label="Moisture Content" 
                value={`${firstGrain.moisture_content || 0}%`} 
              />
              <InfoRow 
                icon={<CreditCard />} 
                label="Price per Quintal" 
                value={formatRupee(firstGrain.price_per_quintal || 0)} 
              />
              <InfoRow 
                icon={<CreditCard />} 
                label="Total Amount" 
                value={formatRupee(transaction.total_amount || 0)} 
                highlight
              />
            </div>
          </div>

          {/* Withdrawal Reason */}
          {isWithdrawal && remarksInfo && (
            <div className={`rounded-xl p-5 border ${remarksInfo.color}`}>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Withdrawal Reason
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{remarksInfo.icon}</span>
                <span className="text-lg font-semibold">{remarksInfo.label}</span>
              </div>
            </div>
          )}

          {/* Remarks */}
          {transaction.remarks && !isWithdrawal && (
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                Remarks
              </h3>
              <p className="text-gray-700">{transaction.remarks}</p>
            </div>
          )}

          {/* Approval Flow */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-gray-600" />
              Approval Workflow
            </h3>
            <div className="space-y-3">
              <ApprovalTimelineItem 
                label="Supervisor Review" 
                approval={supervisorApproval}
                roleKey="supervisor"
              />
              <div className="flex justify-center">
                <ArrowRight className="w-5 h-5 text-gray-300 rotate-90" />
              </div>
              <ApprovalTimelineItem 
                label="Manager Approval" 
                approval={managerApproval}
                roleKey="manager"
              />
              <div className="flex justify-center">
                <ArrowRight className="w-5 h-5 text-gray-300 rotate-90" />
              </div>
              <ApprovalTimelineItem 
                label="Admin Final Approval" 
                approval={adminApproval}
                roleKey="admin"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {canApprove && isPending && (
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 rounded-b-2xl">
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onReject}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg shadow-red-500/25 transition-all disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                Reject
              </button>
              <button
                onClick={onApprove}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                Approve
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Info Row Component
const InfoRow = ({ icon, label, value, highlight = false }) => (
  <div className={`flex items-center gap-3 p-3 rounded-lg ${highlight ? 'bg-white shadow-sm border border-gray-100' : ''}`}>
    <div className="text-gray-400">{React.cloneElement(icon, { className: 'w-4 h-4' })}</div>
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
      <p className={`font-semibold ${highlight ? 'text-lg text-emerald-600' : 'text-gray-900'}`}>{value}</p>
    </div>
  </div>
);

export default RequestModal;