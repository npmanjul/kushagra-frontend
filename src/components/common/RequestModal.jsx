// components/common/RequestModal.jsx
"use client";
import React, { useState } from "react";
import {
  X,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Building,
  MapPin,
  Package,
  Droplets,
  Phone,
  User,
  CreditCard,
  FileText,
  Hash,
  IndianRupee,
  Scale,
  Wheat,
  Mail,
  ArrowRight,
  Sparkles,
  Shield,
  TrendingUp,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  Ban
} from "lucide-react";
import { formatRupee } from "@/utils/formatting";

const RequestModal = ({ 
  transaction, 
  config, 
  onClose, 
  onApprove, 
  onReject, 
  getApprovalStatus,
  getIndividualApprovalStatus 
}) => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('details');

  if (!transaction) return null;

  // Helper function to get individual approval status if not passed as prop
  const getIndividualStatus = (approval) => {
    if (getIndividualApprovalStatus) {
      return getIndividualApprovalStatus(approval);
    }
    
    // Fallback logic
    if (!approval) {
      return { status: 'pending', text: 'Pending', hasAction: false };
    }

    const hasUser = approval.user && approval.user.name;
    const hasDate = approval.date;

    if (approval.status === true && hasUser) {
      return { status: 'approved', text: 'Approved', hasAction: true, user: approval.user, date: approval.date };
    } else if (approval.status === false && (hasUser || hasDate)) {
      return { status: 'rejected', text: 'Rejected', hasAction: true, user: approval.user, date: approval.date };
    } else {
      return { status: 'pending', text: 'Pending', hasAction: false };
    }
  };

  const approvalStatus = getApprovalStatus(transaction.approval, transaction.transaction_status);
  const Icon = config?.icon;
  
  const grainData = transaction.grain || transaction.grains || [];
  const firstGrain = grainData[0] || {};

  const isPending = transaction.transaction_status === 'pending';
  const isRejected = transaction.transaction_status === 'rejected';
  const isCompleted = transaction.transaction_status === 'completed';

  // Get individual approval statuses
  const supervisorApproval = getIndividualStatus(transaction.approval?.supervisor_approval);
  const managerApproval = getIndividualStatus(transaction.approval?.manager_approval);
  const adminApproval = getIndividualStatus(transaction.approval?.admin_approval);

  // Check if admin can approve (manager has approved and admin hasn't taken action)
  const canAdminApprove = isPending && 
    managerApproval.status === 'approved' && 
    adminApproval.status === 'pending';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusGradient = () => {
    if (isRejected) return 'from-red-500 via-rose-500 to-pink-500';
    if (isCompleted) return 'from-emerald-500 via-green-500 to-teal-500';
    return 'from-amber-500 via-orange-500 to-yellow-500';
  };

  const getStatusBg = () => {
    if (isRejected) return 'from-red-50 to-rose-50';
    if (isCompleted) return 'from-emerald-50 to-green-50';
    return 'from-amber-50 to-orange-50';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Animated Backdrop */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-gray-900/70 to-black/80 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden border border-white/20 transform transition-all duration-300 scale-100">
          
          {/* Gradient Border Effect */}
          <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-r ${getStatusGradient()} opacity-20 blur-xl -z-10`} />
          
          {/* Header */}
          <div className={`relative bg-gradient-to-r ${getStatusBg()} p-6 border-b border-gray-100/50`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16" />
            </div>

            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Animated Icon Container */}
                <div className={`
                  relative p-4 rounded-2xl bg-white shadow-lg
                  ${isPending ? 'animate-pulse' : ''}
                `}>
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getStatusGradient()} opacity-20`} />
                  {Icon && <Icon className={`
                    w-7 h-7 relative z-10
                    ${isRejected ? 'text-red-600' : isCompleted ? 'text-emerald-600' : 'text-amber-600'}
                  `} />}
                  {isPending && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
                    </span>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {config?.label || 'Transaction'} Details
                    </h2>
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">ID:</span>
                    <code className="text-sm font-mono text-gray-700 bg-white/50 px-2 py-0.5 rounded-lg">
                      {transaction._id?.slice(-12).toUpperCase()}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(transaction._id)}
                      className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2.5 bg-white/80 hover:bg-white rounded-xl transition-all hover:scale-105 shadow-sm"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Status Badge */}
            <div className="relative mt-5 flex items-center gap-3">
              <div className={`
                inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold
                bg-white shadow-md border
                ${isRejected ? 'border-red-200 text-red-700' : isCompleted ? 'border-green-200 text-green-700' : 'border-amber-200 text-amber-700'}
              `}>
                <span className={`w-2.5 h-2.5 rounded-full ${approvalStatus.dotColor} ${isPending ? 'animate-pulse' : ''}`}></span>
                {approvalStatus.text}
              </div>
              
              <div className="text-sm text-gray-500 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(transaction.transaction_date)}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50/50 px-6">
            {[
              { id: 'details', label: 'Details', icon: FileText },
              { id: 'grain', label: 'Grain Info', icon: Wheat },
              { id: 'approval', label: 'Approval', icon: Shield }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative
                  ${activeSection === tab.id 
                    ? 'text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeSection === tab.id && (
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${getStatusGradient()}`} />
                )}
              </button>
            ))}
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(92vh-320px)] p-6">
            {activeSection === 'details' && (
              <div className="space-y-5 animate-fadeIn">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <QuickStatCard
                    icon={<IndianRupee className="w-5 h-5" />}
                    label="Total Amount"
                    value={formatRupee(transaction.total_amount || 0)}
                    gradient={getStatusGradient()}
                  />
                  <QuickStatCard
                    icon={<Package className="w-5 h-5" />}
                    label="Quantity"
                    value={`${firstGrain.quantity_quintal || 0} Q`}
                    gradient="from-blue-500 to-indigo-500"
                  />
                  <QuickStatCard
                    icon={<TrendingUp className="w-5 h-5" />}
                    label="Rate"
                    value={`${formatRupee(firstGrain.price_per_quintal || 0)}/Q`}
                    gradient="from-purple-500 to-pink-500"
                  />
                </div>

                {/* User Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="px-5 py-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      User Information
                    </h3>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {transaction.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {transaction.user?.name || 'N/A'}
                          </h4>
                          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">
                            {transaction.user?.role || 'N/A'}
                          </span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <InfoChip 
                            icon={<Phone className="w-3.5 h-3.5" />} 
                            value={transaction.user?.phone_number || 'N/A'} 
                          />
                          <InfoChip 
                            icon={<Mail className="w-3.5 h-3.5" />} 
                            value={transaction.user?.email || 'N/A'} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warehouse Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="px-5 py-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-100 rounded-lg">
                        <Building className="w-4 h-4 text-emerald-600" />
                      </div>
                      Warehouse Details
                    </h3>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                        <Building className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {transaction.warehouse?.name || 'N/A'}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{transaction.warehouse?.location || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                {transaction.remarks && (
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200/50">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-100 rounded-xl">
                        <FileText className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">Remarks</p>
                        <p className="mt-1 text-gray-700">{transaction.remarks}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'grain' && (
              <div className="space-y-5 animate-fadeIn">
                {grainData.length > 0 ? (
                  grainData.map((grain, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-2xl border border-amber-200/50 overflow-hidden"
                    >
                      {/* Grain Header */}
                      <div className="px-5 py-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-200/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white rounded-xl shadow-sm">
                              <Wheat className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                {grain.category?.grain_type || 'Unknown Grain'}
                              </h3>
                              <p className="text-sm text-gray-500">Grain #{index + 1}</p>
                            </div>
                          </div>
                          <div className={`
                            px-4 py-2 rounded-xl font-bold text-lg
                            ${grain.category?.quality === 'A' 
                              ? 'bg-green-100 text-green-700' 
                              : grain.category?.quality === 'B'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                            }
                          `}>
                            Grade {grain.category?.quality || 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Grain Details Grid */}
                      <div className="p-5">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <GrainDetailCard
                            icon={<Package className="w-5 h-5" />}
                            label="Quantity"
                            value={`${grain.quantity_quintal || 0}`}
                            unit="Quintals"
                            color="blue"
                          />
                          <GrainDetailCard
                            icon={<IndianRupee className="w-5 h-5" />}
                            label="Price/Quintal"
                            value={formatRupee(grain.price_per_quintal || 0)}
                            color="green"
                          />
                          <GrainDetailCard
                            icon={<Droplets className="w-5 h-5" />}
                            label="Moisture"
                            value={`${grain.moisture_content || 0}`}
                            unit="%"
                            color="cyan"
                          />
                          <GrainDetailCard
                            icon={<TrendingUp className="w-5 h-5" />}
                            label="Subtotal"
                            value={formatRupee((grain.quantity_quintal || 0) * (grain.price_per_quintal || 0))}
                            color="purple"
                            highlight
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                      <Wheat className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No grain details available</p>
                  </div>
                )}

                {/* Total Summary */}
                {grainData.length > 0 && (
                  <div className={`
                    p-5 rounded-2xl bg-gradient-to-r ${getStatusGradient()} 
                    shadow-lg transform hover:scale-[1.02] transition-transform
                  `}>
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                          <IndianRupee className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-white/80 text-sm">Total Transaction Value</p>
                          <p className="text-3xl font-bold">{formatRupee(transaction.total_amount || 0)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white/80 text-sm">Total Quantity</p>
                        <p className="text-2xl font-bold">{firstGrain.quantity_quintal || 0} Q</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'approval' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Approval Timeline */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    Approval Workflow
                  </h3>
                  
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
                    
                    {/* Supervisor Step */}
                    <TimelineStep
                      title="Supervisor Approval"
                      approvalData={supervisorApproval}
                      rawApproval={transaction.approval?.supervisor_approval}
                      formatDate={formatDate}
                      isFirst
                    />
                    
                    {/* Manager Step */}
                    <TimelineStep
                      title="Manager Approval"
                      approvalData={managerApproval}
                      rawApproval={transaction.approval?.manager_approval}
                      formatDate={formatDate}
                    />
                    
                    {/* Admin Step */}
                    <TimelineStep
                      title="Admin Approval"
                      approvalData={adminApproval}
                      rawApproval={transaction.approval?.admin_approval}
                      formatDate={formatDate}
                      isLast
                      isPending={canAdminApprove}
                    />
                  </div>
                </div>

                {/* Current Status Card */}
                <div className={`
                  p-5 rounded-2xl border-2
                  ${isCompleted 
                    ? 'bg-green-50 border-green-200' 
                    : isRejected 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-amber-50 border-amber-200'
                  }
                `}>
                  <div className="flex items-center gap-4">
                    <div className={`
                      p-3 rounded-xl
                      ${isCompleted ? 'bg-green-100' : isRejected ? 'bg-red-100' : 'bg-amber-100'}
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : isRejected ? (
                        <XCircle className="w-6 h-6 text-red-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <h4 className={`
                        font-semibold text-lg
                        ${isCompleted ? 'text-green-800' : isRejected ? 'text-red-800' : 'text-amber-800'}
                      `}>
                        {isCompleted ? 'Transaction Completed' : isRejected ? 'Transaction Rejected' : 'Awaiting Approval'}
                      </h4>
                      <p className={`
                        text-sm
                        ${isCompleted ? 'text-green-600' : isRejected ? 'text-red-600' : 'text-amber-600'}
                      `}>
                        {isCompleted 
                          ? 'This transaction has been fully approved and processed.'
                          : isRejected 
                          ? 'This transaction was rejected and will not be processed.'
                          : canAdminApprove
                          ? 'This transaction is waiting for admin approval.'
                          : 'This transaction is waiting for manager approval.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Approval Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <ApprovalSummaryCard
                    title="Supervisor"
                    approvalData={supervisorApproval}
                    rawApproval={transaction.approval?.supervisor_approval}
                    formatDate={formatDate}
                  />
                  <ApprovalSummaryCard
                    title="Manager"
                    approvalData={managerApproval}
                    rawApproval={transaction.approval?.manager_approval}
                    formatDate={formatDate}
                  />
                  <ApprovalSummaryCard
                    title="Admin"
                    approvalData={adminApproval}
                    rawApproval={transaction.approval?.admin_approval}
                    formatDate={formatDate}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-100 p-5 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
              >
                Close
              </button>
              
              {canAdminApprove && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={onReject}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-rose-600 transition-all flex items-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                  <button
                    onClick={onApprove}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-green-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {isCompleted && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-xl text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Completed</span>
                </div>
              )}

              {isRejected && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-xl text-red-700">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Rejected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// Quick Stat Card Component
const QuickStatCard = ({ icon, label, value, gradient }) => (
  <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} opacity-10 rounded-full -mr-10 -mt-10`} />
    <div className="relative">
      <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${gradient} text-white mb-2`}>
        {icon}
      </div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

// Info Chip Component
const InfoChip = ({ icon, value }) => (
  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-600">
    <span className="text-gray-400">{icon}</span>
    <span className="truncate">{value}</span>
  </div>
);

// Grain Detail Card Component
const GrainDetailCard = ({ icon, label, value, unit, color, highlight = false }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-indigo-500 bg-blue-50 text-blue-600',
    green: 'from-green-500 to-emerald-500 bg-green-50 text-green-600',
    cyan: 'from-cyan-500 to-teal-500 bg-cyan-50 text-cyan-600',
    purple: 'from-purple-500 to-pink-500 bg-purple-50 text-purple-600'
  };

  return (
    <div className={`
      p-4 rounded-xl bg-white border shadow-sm
      ${highlight ? 'border-purple-200 ring-2 ring-purple-100' : 'border-gray-200'}
    `}>
      <div className={`inline-flex p-2 rounded-lg ${colorClasses[color].split(' ').slice(2).join(' ')} mb-2`}>
        {icon}
      </div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <span className={`text-lg font-bold ${highlight ? 'text-purple-700' : 'text-gray-900'}`}>
          {value}
        </span>
        {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </div>
    </div>
  );
};

// Updated Timeline Step Component
const TimelineStep = ({ title, approvalData, rawApproval, formatDate, isFirst, isLast, isPending }) => {
  const getStepStyles = () => {
    switch (approvalData.status) {
      case 'approved':
        return {
          bg: 'bg-gradient-to-br from-green-400 to-emerald-500',
          shadow: 'shadow-lg shadow-green-500/30',
          text: 'text-white',
          icon: <CheckCircle className="w-8 h-8" />
        };
      case 'rejected':
        return {
          bg: 'bg-gradient-to-br from-red-400 to-rose-500',
          shadow: 'shadow-lg shadow-red-500/30',
          text: 'text-white',
          icon: <XCircle className="w-8 h-8" />
        };
      default:
        if (isPending) {
          return {
            bg: 'bg-gradient-to-br from-amber-400 to-orange-500',
            shadow: 'shadow-lg shadow-amber-500/30 animate-pulse',
            text: 'text-white',
            icon: <Clock className="w-8 h-8" />
          };
        }
        return {
          bg: 'bg-gray-100',
          shadow: '',
          text: 'text-gray-400',
          icon: <Clock className="w-8 h-8" />
        };
    }
  };

  const styles = getStepStyles();

  const getStatusBadge = () => {
    switch (approvalData.status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        if (isPending) {
          return (
            <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
              <Clock className="w-3 h-3" />
              Awaiting Action
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
            <AlertCircle className="w-3 h-3" />
            No Action Yet
          </span>
        );
    }
  };

  return (
    <div className={`relative flex gap-4 ${!isLast ? 'pb-8' : ''}`}>
      {/* Step Circle */}
      <div className={`
        relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center
        ${styles.bg} ${styles.shadow} ${styles.text}
        ${approvalData.status === 'pending' && !isPending ? 'border-2 border-gray-200' : ''}
      `}>
        {styles.icon}
      </div>
      
      {/* Content */}
      <div className="flex-1 pt-2">
        <h4 className={`font-semibold ${approvalData.hasAction ? 'text-gray-900' : 'text-gray-500'}`}>
          {title}
        </h4>
        
        {approvalData.hasAction && approvalData.user?.name && (
          <div className="mt-2 flex items-center gap-2">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium
              ${approvalData.status === 'approved' 
                ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                : 'bg-gradient-to-br from-red-500 to-rose-600'
              }
            `}>
              {approvalData.user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{approvalData.user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{approvalData.user.role}</p>
            </div>
          </div>
        )}
        
        {/* Show date if available */}
        {rawApproval?.date && (
          <p className="text-xs text-gray-400 mt-1">
            {formatDate(rawApproval.date)}
          </p>
        )}
        
        {getStatusBadge()}
      </div>
    </div>
  );
};

// Approval Summary Card Component
const ApprovalSummaryCard = ({ title, approvalData, rawApproval, formatDate }) => {
  const getCardStyles = () => {
    switch (approvalData.status) {
      case 'approved':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
          border: 'border-green-200',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          icon: <CheckCircle className="w-5 h-5" />
        };
      case 'rejected':
        return {
          bg: 'bg-gradient-to-br from-red-50 to-rose-50',
          border: 'border-red-200',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          icon: <XCircle className="w-5 h-5" />
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          border: 'border-gray-200',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-400',
          titleColor: 'text-gray-600',
          icon: <Clock className="w-5 h-5" />
        };
    }
  };

  const styles = getCardStyles();

  return (
    <div className={`p-4 rounded-xl border ${styles.bg} ${styles.border}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg ${styles.iconBg} ${styles.iconColor}`}>
          {styles.icon}
        </div>
        <h4 className={`font-semibold ${styles.titleColor}`}>{title}</h4>
      </div>
      
      {approvalData.hasAction ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-700 font-medium">
            {approvalData.user?.name || 'Unknown'}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {approvalData.user?.role || 'N/A'}
          </p>
          {rawApproval?.date && (
            <p className="text-xs text-gray-400">
              {formatDate(rawApproval.date)}
            </p>
          )}
          <span className={`
            inline-block px-2 py-1 rounded-full text-xs font-medium
            ${approvalData.status === 'approved' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
            }
          `}>
            {approvalData.status === 'approved' ? 'Approved' : 'Rejected'}
          </span>
        </div>
      ) : (
        <div className="text-center py-2">
          <p className="text-sm text-gray-400">No action taken</p>
          <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
            Pending
          </span>
        </div>
      )}
    </div>
  );
};

export default RequestModal;