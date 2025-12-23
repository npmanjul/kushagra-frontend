"use client";
import React, { useEffect, useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  TrendingUp, 
  Search, 
  CreditCard,
  Sparkles,
  Clock,
  MapPin,
  Hash,
  Layers,
  RefreshCw,
  X,
  CheckCircle2,
  Circle,
  AlertCircle,
  User,
  Wheat,
  Droplets,
  Scale,
  ChevronLeft,
  ChevronRight,
  FileText,
  Shield,
  UserCheck,
  Crown,
  Phone,
  Mail,
  Building2,
  Calendar,
  IndianRupee,
  BadgeCheck,
  XCircle,
  Timer,
  Eye,
  Banknote,
  Package
} from 'lucide-react';
import API_BASE_URL from '@/utils/constants';
import Loader from '@/components/common/Loader';
import toast from 'react-hot-toast';

// Transaction Detail Modal Component
const TransactionModal = ({ transaction, isOpen, onClose }) => {
  if (!isOpen || !transaction) return null;

  const grainDetails = transaction.grain?.[0];
  const approval = transaction.approval_status;
  
  const getApprovalSteps = () => [
    {
      name: 'Supervisor',
      role: 'supervisor',
      icon: UserCheck,
      status: approval?.supervisor_approval?.status || false,
      user: approval?.supervisor_approval?.user_id?.name,
      date: approval?.supervisor_approval?.date,
      color: 'blue'
    },
    {
      name: 'Manager',
      role: 'manager',
      icon: Shield,
      status: approval?.manager_approval?.status || false,
      user: approval?.manager_approval?.user_id?.name,
      date: approval?.manager_approval?.date,
      color: 'purple'
    },
    {
      name: 'Admin',
      role: 'admin',
      icon: Crown,
      status: approval?.admin_approval?.status || false,
      user: approval?.admin_approval?.user_id?.name,
      date: approval?.admin_approval?.date,
      color: 'amber'
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeStyles = (type) => {
    const styles = {
      deposit: { bg: 'from-emerald-500 to-green-600', light: 'bg-emerald-50', text: 'text-emerald-600', icon: ArrowDownRight },
      sell: { bg: 'from-blue-500 to-indigo-600', light: 'bg-blue-50', text: 'text-blue-600', icon: TrendingUp },
      loan: { bg: 'from-violet-500 to-purple-600', light: 'bg-violet-50', text: 'text-violet-600', icon: CreditCard },
      withdraw: { bg: 'from-rose-500 to-red-600', light: 'bg-rose-50', text: 'text-rose-600', icon: ArrowUpRight }
    };
    return styles[type] || styles.deposit;
  };

  const typeStyles = getTypeStyles(transaction.transaction_type);
  const TypeIcon = typeStyles.icon;

  const getStatusConfig = (status) => {
    const configs = {
      completed: { icon: CheckCircle2, bg: 'bg-emerald-500', text: 'text-emerald-600', lightBg: 'bg-emerald-50' },
      pending: { icon: Timer, bg: 'bg-amber-500', text: 'text-amber-600', lightBg: 'bg-amber-50' },
      rejected: { icon: XCircle, bg: 'bg-rose-500', text: 'text-rose-600', lightBg: 'bg-rose-50' }
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(transaction.transaction_status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className={`relative bg-gradient-to-r ${typeStyles.bg} p-6 text-white overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
          
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <TypeIcon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold capitalize">
                  {transaction.transaction_type === 'deposit' ? 'Grain Deposit' :
                   transaction.transaction_type === 'sell' ? 'Grain Sale' :
                   transaction.transaction_type === 'loan' ? 'Loan Credit' : 'Grain Withdrawal'}
                </h2>
                <p className="text-white/80 mt-1 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  {transaction._id}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mt-4 flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.lightBg} ${statusConfig.text}`}>
              <StatusIcon className="w-4 h-4" />
              {transaction.transaction_status?.toUpperCase()}
            </span>
            <span className="text-white/80 text-sm flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(transaction.transaction_date)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Amount Card */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm font-medium">Total Amount</span>
                  <Banknote className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-4xl font-bold">₹{transaction.total_amount?.toLocaleString('en-IN')}</p>
                {grainDetails && (
                  <p className="text-gray-400 text-sm mt-2">
                    {grainDetails.quantity_quintal} {grainDetails.category_id?.unit || 'quintal'} × ₹{grainDetails.price_per_quintal?.toLocaleString('en-IN')}
                  </p>
                )}
              </div>

              {/* Grain Details */}
              {grainDetails && (
                <div className="bg-gray-50 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Wheat className="w-4 h-4" />
                    Grain Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Grain Type</p>
                      <p className="text-lg font-bold text-gray-900">{grainDetails.category_id?.grain_type || 'N/A'}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Quality Grade</p>
                      <p className="text-lg font-bold text-gray-900">Grade {grainDetails.category_id?.quality || 'N/A'}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Quantity</p>
                      <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                        <Scale className="w-4 h-4 text-amber-500" />
                        {grainDetails.quantity_quintal} {grainDetails.category_id?.unit || 'quintal'}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Moisture Content</p>
                      <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                        <Droplets className="w-4 h-4 text-cyan-500" />
                        {grainDetails.moisture_content || 0}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Warehouse Info */}
              {transaction.warehouse_id && (
                <div className="bg-indigo-50 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Warehouse Details
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                      <MapPin className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{transaction.warehouse_id.name}</p>
                      <p className="text-gray-600 text-sm">{transaction.warehouse_id.location}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Remarks */}
              {transaction.remarks && (
                <div className="bg-amber-50 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-amber-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Remarks
                  </h3>
                  <p className="text-gray-700">{transaction.remarks}</p>
                </div>
              )}
            </div>

            {/* Right Column - Approval Status */}
            <div>
              <div className="bg-gray-50 rounded-2xl p-5 h-full">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Approval Workflow
                </h3>
                
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                  
                  <div className="space-y-6">
                    {getApprovalSteps().map((step, idx) => {
                      const StepIcon = step.icon;
                      return (
                        <div key={idx} className="relative flex items-start gap-4">
                          {/* Icon */}
                          <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                            step.status 
                              ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white' 
                              : 'bg-white border-2 border-dashed border-gray-300 text-gray-400'
                          }`}>
                            {step.status ? (
                              <CheckCircle2 className="w-6 h-6" />
                            ) : (
                              <StepIcon className="w-5 h-5" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 pt-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`font-semibold ${step.status ? 'text-gray-900' : 'text-gray-400'}`}>
                                {step.name} Approval
                              </h4>
                              {step.status && (
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                                  Approved
                                </span>
                              )}
                            </div>
                            
                            {step.status ? (
                              <div className="bg-white rounded-xl p-3 border border-gray-100">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <User className="w-3 h-3 text-white" />
                                  </div>
                                  <span className="font-medium text-gray-900">{step.user}</span>
                                </div>
                                <p className="text-xs text-gray-500 flex items-center gap-1 ml-8">
                                  <Clock className="w-3 h-3" />
                                  {formatDate(step.date)}
                                </p>
                              </div>
                            ) : (
                              <div className="bg-white rounded-xl p-3 border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4" />
                                  Awaiting approval
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Approval Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Approval Progress</span>
                    <span className="text-sm font-bold text-gray-900">
                      {getApprovalSteps().filter(s => s.status).length} / 3
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-500"
                      style={{ width: `${(getApprovalSteps().filter(s => s.status).length / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Farmer Info */}
          {transaction.user_id && (
            <div className="mt-6 bg-gradient-to-r from-gray-50 to-indigo-50/50 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                <User className="w-4 h-4" />
                Farmer Information
              </h3>
              <div className="flex items-center gap-4">
                {transaction.user_id.farmerProfile?.user_image && (
                  <img 
                    src={transaction.user_id.farmerProfile.user_image} 
                    alt={transaction.user_id.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-lg"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900 text-lg">{transaction.user_id.name}</h4>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium capitalize">
                      {transaction.user_id.role}
                    </span>
                  </div>
                  {transaction.user_id.farmerProfile?.farmerId && (
                    <p className="text-sm text-indigo-600 font-mono mb-2">
                      ID: {transaction.user_id.farmerProfile.farmerId}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {transaction.user_id.phone_number}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {transaction.user_id.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Last updated: {formatDate(approval?.updatedAt)}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const TransactionHistory = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 1
  });
  const [transactionCounts, setTransactionCounts] = useState({
    sell: 0,
    deposit: 0,
    withdraw: 0,
    loan: 0
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [pagination.currentPage]);

  const fetchTransactions = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setLoading(true);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/transaction/getallusertransactions?page=${pagination.currentPage}&limit=${pagination.limit}`, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch transactions");

      const result = await response.json();
      if (result.success) {
        setTransactions(result.data);
        setTransactionCounts(result.transactionCounts);
        setPagination(result.pagination);
        setUserInfo(result.user);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTransaction(null), 300);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit': return <ArrowDownRight className="w-5 h-5" />;
      case 'sell': return <TrendingUp className="w-5 h-5" />;
      case 'loan': return <CreditCard className="w-5 h-5" />;
      case 'withdraw': return <ArrowUpRight className="w-5 h-5" />;
      default: return <Wallet className="w-5 h-5" />;
    }
  };

  const getTransactionStyles = (type) => {
    const styles = {
      deposit: { bg: 'bg-gradient-to-br from-emerald-500 to-green-600', light: 'bg-emerald-50', text: 'text-emerald-600', glow: 'shadow-emerald-500/25' },
      sell: { bg: 'bg-gradient-to-br from-blue-500 to-indigo-600', light: 'bg-blue-50', text: 'text-blue-600', glow: 'shadow-blue-500/25' },
      loan: { bg: 'bg-gradient-to-br from-violet-500 to-purple-600', light: 'bg-violet-50', text: 'text-violet-600', glow: 'shadow-violet-500/25' },
      withdraw: { bg: 'bg-gradient-to-br from-rose-500 to-red-600', light: 'bg-rose-50', text: 'text-rose-600', glow: 'shadow-rose-500/25' }
    };
    return styles[type] || styles.deposit;
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'completed': return { bg: 'bg-gradient-to-r from-emerald-500 to-green-500', icon: CheckCircle2 };
      case 'pending': return { bg: 'bg-gradient-to-r from-amber-400 to-orange-500', icon: Timer };
      case 'rejected': return { bg: 'bg-gradient-to-r from-rose-500 to-red-500', icon: XCircle };
      default: return { bg: 'bg-gradient-to-r from-gray-400 to-slate-500', icon: Circle };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGrainDetails = (transaction) => {
    if (transaction.grain && transaction.grain.length > 0) {
      const grain = transaction.grain[0];
      return {
        quantity: grain.quantity_quintal,
        price: grain.price_per_quintal,
        type: grain.category_id?.grain_type || 'N/A',
        quality: grain.category_id?.quality || 'N/A',
        unit: grain.category_id?.unit || 'quintal',
        moisture: grain.moisture_content
      };
    }
    return null;
  };

  const getApprovalCount = (approval) => {
    if (!approval) return 0;
    let count = 0;
    if (approval.supervisor_approval?.status) count++;
    if (approval.manager_approval?.status) count++;
    if (approval.admin_approval?.status) count++;
    return count;
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filter === 'all' || t.transaction_type === filter;
    const grainDetails = getGrainDetails(t);
    const matchesSearch = 
      t.remarks?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.transaction_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.warehouse_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.warehouse_id?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grainDetails?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t._id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0),
    deposits: transactionCounts.deposit || 0,
    sells: transactionCounts.sell || 0,
    loans: transactionCounts.loan || 0,
    withdraws: transactionCounts.withdraw || 0,
  };

  const filterButtons = [
    { key: 'all', label: 'All', icon: Layers, gradient: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-500/40' },
    { key: 'deposit', label: 'Deposits', icon: ArrowDownRight, gradient: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-500/40' },
    { key: 'sell', label: 'Sales', icon: TrendingUp, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/40' },
    { key: 'loan', label: 'Loans', icon: CreditCard, gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/40' },
    { key: 'withdraw', label: 'Withdrawals', icon: ArrowUpRight, gradient: 'from-rose-500 to-red-600', shadow: 'shadow-rose-500/40' },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        {/* Decorative Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-gradient-to-br from-rose-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto p-4 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30">
                    <Wallet className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                      Transactions
                    </h1>
                    {userInfo && (
                      <p className="text-gray-500 text-sm mt-1">
                        Welcome, <span className="font-semibold text-indigo-600">{userInfo.name}</span> • {userInfo.role}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => fetchTransactions(true)}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 group"
              >
                <RefreshCw className={`w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-colors ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {/* Total Volume */}
            <div className="col-span-2 sm:col-span-1 group relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-5 shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-indigo-100 font-medium text-sm">Total Volume</span>
                  <Sparkles className="w-5 h-5 text-white/80" />
                </div>
                <p className="text-2xl font-bold text-white">₹{stats.total.toLocaleString('en-IN')}</p>
                <p className="text-indigo-200 text-xs mt-1">{pagination.totalRecords} transactions</p>
              </div>
            </div>

            {/* Other Stats */}
            {[
              { label: 'Deposits', value: stats.deposits, icon: ArrowDownRight, color: 'emerald', desc: 'Grain added' },
              { label: 'Sales', value: stats.sells, icon: TrendingUp, color: 'blue', desc: 'Grain sold' },
              { label: 'Loans', value: stats.loans, icon: CreditCard, color: 'violet', desc: 'Credit taken' },
              { label: 'Withdrawals', value: stats.withdraws, icon: ArrowUpRight, color: 'rose', desc: 'Grain removed' }
            ].map((stat, idx) => (
              <div key={idx} className={`group relative overflow-hidden bg-white rounded-2xl p-5 shadow-lg border border-${stat.color}-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500`}>
                <div className={`absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/20 rounded-full group-hover:scale-150 transition-transform duration-500`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500 font-medium text-xs">{stat.label}</span>
                    <div className={`p-2 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl shadow-lg`}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-${stat.color}-600 text-xs font-medium`}>{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-gray-100 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {filterButtons.map((btn) => {
                  const isActive = filter === btn.key;
                  const Icon = btn.icon;
                  return (
                    <button
                      key={btn.key}
                      onClick={() => setFilter(btn.key)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        isActive 
                          ? `bg-gradient-to-r ${btn.gradient} text-white shadow-lg ${btn.shadow}` 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline text-sm">{btn.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => {
              const grainDetails = getGrainDetails(transaction);
              const styles = getTransactionStyles(transaction.transaction_type);
              const statusStyle = getStatusStyles(transaction.transaction_status);
              const StatusIcon = statusStyle.icon;
              const approvalCount = getApprovalCount(transaction.approval_status);

              return (
                <div
                  key={transaction._id}
                  onClick={() => openModal(transaction)}
                  className="group bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 ${styles.bg} rounded-xl shadow-lg ${styles.glow} group-hover:scale-110 transition-transform duration-300`}>
                        <div className="text-white">
                          {getTransactionIcon(transaction.transaction_type)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold text-gray-900 capitalize">
                            {transaction.transaction_type === 'deposit' ? 'Grain Deposit' :
                             transaction.transaction_type === 'sell' ? 'Grain Sale' :
                             transaction.transaction_type === 'loan' ? 'Loan Credit' : 'Grain Withdrawal'}
                          </h3>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1 ${statusStyle.bg}`}>
                            <StatusIcon className="w-3 h-3" />
                            {transaction.transaction_status}
                          </span>
                        </div>

                        {grainDetails && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${styles.light} ${styles.text} rounded-lg text-xs font-medium`}>
                              <Wheat className="w-3 h-3" />
                              {grainDetails.type}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium">
                              <Scale className="w-3 h-3" />
                              {grainDetails.quantity} {grainDetails.unit}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                              Grade {grainDetails.quality}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                          {transaction.warehouse_id && (
                            <span className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg">
                              <MapPin className="w-3 h-3" />
                              {transaction.warehouse_id.name}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(transaction.transaction_date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-4">
                      {/* Approval Progress */}
                      <div className="hidden md:flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                i < approvalCount 
                                  ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30' 
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              {i < approvalCount ? '✓' : i + 1}
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">{approvalCount}/3 approved</span>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{transaction.total_amount?.toLocaleString('en-IN') || 0}
                        </p>
                        {grainDetails && (
                          <p className="text-xs text-gray-500">
                            ₹{grainDetails.price?.toLocaleString('en-IN')}/{grainDetails.unit}
                          </p>
                        )}
                      </div>

                      {/* View Button */}
                      <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-indigo-100 transition-colors">
                        <Eye className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredTransactions.length === 0 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 shadow-xl border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mb-6">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No transactions found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
              {(searchTerm || filter !== 'all') && (
                <button
                  onClick={() => { setSearchTerm(''); setFilter('all'); }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, currentPage: Math.max(1, p.currentPage - 1) }))}
                disabled={pagination.currentPage === 1}
                className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setPagination(p => ({ ...p, currentPage: page }))}
                  className={`w-10 h-10 rounded-xl font-medium transition-all ${
                    pagination.currentPage === page
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setPagination(p => ({ ...p, currentPage: Math.min(p.totalPages, p.currentPage + 1) }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Results Count */}
          {filteredTransactions.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Showing <span className="font-semibold text-gray-700">{filteredTransactions.length}</span> of{' '}
                <span className="font-semibold text-gray-700">{pagination.totalRecords}</span> transactions
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <TransactionModal 
        transaction={selectedTransaction} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
};

export default TransactionHistory;