"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  Calendar,
  Package,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Download,
  TrendingUp,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import API_BASE_URL from '@/utils/constants';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [warehouse, setWarehouse] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 20,
    totalRecords: 0,
    totalPages: 1
  });
  const [transactionCounts, setTransactionCounts] = useState({
    sell: 0,
    deposit: 0,
    withdraw: 0,
    loan: 0
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 20;

  const categories = [
    { key: '', label: 'All', icon: Filter, color: 'bg-gradient-to-r from-slate-600 to-slate-700', lightColor: 'bg-slate-50', textColor: 'text-slate-600', accent: 'border-slate-400' },
    { key: 'deposit', label: 'Deposit', icon: ArrowDownCircle, color: 'bg-gradient-to-r from-emerald-500 to-teal-500', lightColor: 'bg-emerald-50', textColor: 'text-emerald-600', accent: 'border-emerald-400' },
    { key: 'withdraw', label: 'Withdraw', icon: ArrowUpCircle, color: 'bg-gradient-to-r from-orange-400 to-amber-500', lightColor: 'bg-orange-50', textColor: 'text-orange-600', accent: 'border-orange-400' },
    { key: 'sell', label: 'Sell', icon: DollarSign, color: 'bg-gradient-to-r from-sky-500 to-blue-500', lightColor: 'bg-sky-50', textColor: 'text-sky-600', accent: 'border-sky-400' },
    { key: 'loan', label: 'Loan', icon: Wallet, color: 'bg-gradient-to-r from-violet-500 to-purple-500', lightColor: 'bg-violet-50', textColor: 'text-violet-600', accent: 'border-violet-400' },
  ];

  useEffect(() => {
    fetchTransactions();
  }, [activeCategory, currentPage]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/transaction/getalltransactions`,
        {
          params: {
            transaction_type: activeCategory,
            limit: limit,
            page: currentPage,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      // Update state with new response structure
      setTransactions(response.data.data || []);
      setPagination(response.data.pagination || {
        currentPage: 1,
        limit: 20,
        totalRecords: 0,
        totalPages: 1
      });
      setTransactionCounts(response.data.transactionCounts || {
        sell: 0,
        deposit: 0,
        withdraw: 0,
        loan: 0
      });
      setWarehouse(response.data.warehouse);
    } catch (err) {
      setError('Failed to fetch transactions. Please try again.');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: CheckCircle,
        gradient: 'bg-gradient-to-r from-green-500 to-emerald-500'
      },
      pending: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: Clock,
        gradient: 'bg-gradient-to-r from-yellow-500 to-amber-500'
      },
      rejected: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: XCircle,
        gradient: 'bg-gradient-to-r from-red-500 to-rose-500'
      },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm ${config.color}`}>
        <Icon size={14} />
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const getTransactionTypeIcon = (type) => {
    const icons = {
      deposit: { icon: ArrowDownCircle, color: 'text-green-600 bg-green-100' },
      withdraw: { icon: ArrowUpCircle, color: 'text-orange-600 bg-orange-100' },
      sell: { icon: DollarSign, color: 'text-blue-600 bg-blue-100' },
      loan: { icon: Wallet, color: 'text-purple-600 bg-purple-100' },
    };
    const config = icons[type] || icons.deposit;
    const Icon = config.icon;
    
    return (
      <div className={`p-3 rounded-2xl ${config.color} shadow-sm`}>
        <Icon size={24} strokeWidth={2} />
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getTotalTransactions = () => {
    return transactionCounts.sell + transactionCounts.deposit + 
           transactionCounts.withdraw + transactionCounts.loan;
  };

  const ApprovalStatusComponent = ({ approval }) => {
    if (!approval) return null;

    const approvals = [
      { label: 'Supervisor', data: approval.supervisor_approval, shortLabel: 'SUP' },
      { label: 'Manager', data: approval.manager_approval, shortLabel: 'MGR' },
      { label: 'Admin', data: approval.admin_approval, shortLabel: 'ADM' },
    ];

    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {approvals.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
              item.data?.status
                ? 'bg-green-100 text-green-700 border border-green-200'
                : item.data?.date
                ? 'bg-red-100 text-red-700 border border-red-200'
                : 'bg-gray-100 text-gray-500 border border-gray-200'
            }`}
            title={item.label}
          >
            {item.data?.status ? (
              <CheckCircle size={12} />
            ) : item.data?.date ? (
              <XCircle size={12} />
            ) : (
              <Clock size={12} />
            )}
            <span className="hidden sm:inline">{item.label}</span>
            <span className="sm:hidden">{item.shortLabel}</span>
          </div>
        ))}
      </div>
    );
  };

  const TransactionModal = ({ transaction, onClose }) => {
    if (!transaction) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div 
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Transaction Details</h3>
              <p className="text-sm text-gray-500 mt-0.5">ID: {transaction._id?.slice(-8).toUpperCase()}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <XCircle size={24} className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Transaction Type & Status */}
            <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center gap-4">
                {getTransactionTypeIcon(transaction.transaction_type)}
                <div>
                  <p className="text-sm text-gray-500">Transaction Type</p>
                  <p className="text-lg font-bold text-gray-800 capitalize">
                    {transaction.transaction_type}
                  </p>
                </div>
              </div>
              {getStatusBadge(transaction.transaction_status)}
            </div>

            {/* User Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
              <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                <User size={16} />
                Farmer Details
              </h4>
              <div className="flex items-center gap-4">
                <img
                  src={transaction.user_id?.farmerProfile?.user_image || '/placeholder-user.png'}
                  alt={transaction.user_id?.name}
                  className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(transaction.user_id?.name || 'User');
                  }}
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-lg">{transaction.user_id?.name}</p>
                  <p className="text-sm text-gray-500">{transaction.user_id?.email}</p>
                  <p className="text-sm text-gray-500">{transaction.user_id?.phone_number}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                    {transaction.user_id?.farmerProfile?.farmerId}
                  </span>
                </div>
              </div>
            </div>

            {/* Warehouse Info */}
            {transaction.warehouse_id && (
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <MapPin className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Warehouse</p>
                  <p className="font-bold text-gray-800">
                    {transaction.warehouse_id.name}
                  </p>
                  <p className="text-sm text-gray-600">{transaction.warehouse_id.location}</p>
                </div>
              </div>
            )}

            {/* Grain Details */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Package size={18} />
                Grain Details
              </h4>
              <div className="space-y-3">
                {transaction.grain?.map((item, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-100 rounded-2xl p-4 hover:border-blue-200 transition-all bg-white shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-gray-800 text-lg">
                        {item.category_id?.grain_type}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">
                        Grade {item.category_id?.quality}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-gray-500 text-xs">Quantity</p>
                        <p className="font-bold text-gray-800">{item.quantity_quintal?.toFixed(2)} qtl</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-gray-500 text-xs">Price/Quintal</p>
                        <p className="font-bold text-gray-800">{formatCurrency(item.price_per_quintal)}</p>
                      </div>
                      {item.moisture_content > 0 && (
                        <div className="bg-yellow-50 rounded-xl p-3">
                          <p className="text-gray-500 text-xs">Moisture</p>
                          <p className="font-bold text-yellow-700">{item.moisture_content}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Amount</p>
                  <p className="text-4xl font-bold mt-1">{formatCurrency(transaction.total_amount)}</p>
                </div>
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <TrendingUp size={32} />
                </div>
              </div>
            </div>

            {/* Approval Status */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle size={18} />
                Approval Workflow
              </h4>
              <div className="space-y-3">
                {[
                  { label: 'Supervisor', data: transaction.approval_status?.supervisor_approval },
                  { label: 'Manager', data: transaction.approval_status?.manager_approval },
                  { label: 'Admin', data: transaction.approval_status?.admin_approval },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      item.data?.status
                        ? 'bg-green-50 border-green-200'
                        : item.data?.date
                        ? 'bg-red-50 border-red-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl ${
                        item.data?.status
                          ? 'bg-green-100'
                          : item.data?.date
                          ? 'bg-red-100'
                          : 'bg-gray-200'
                      }`}>
                        {item.data?.status ? (
                          <CheckCircle className="text-green-600" size={24} />
                        ) : item.data?.date ? (
                          <XCircle className="text-red-600" size={24} />
                        ) : (
                          <Clock className="text-gray-400" size={24} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{item.label}</p>
                        {item.data?.user_id ? (
                          <p className="text-sm text-gray-500">{item.data.user_id.name}</p>
                        ) : (
                          <p className="text-sm text-gray-400">Pending approval</p>
                        )}
                      </div>
                    </div>
                    {item.data?.date && (
                      <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-lg shadow-sm">
                        {formatDate(item.data.date)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Remarks */}
            {transaction.remarks && (
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <p className="text-sm text-amber-700 font-medium mb-1">Remarks</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {transaction.remarks.replace(/_/g, ' ')}
                </p>
              </div>
            )}

            {/* Transaction Date */}
            <div className="flex items-center gap-3 text-gray-500 bg-gray-50 rounded-xl p-3">
              <Calendar size={18} />
              <span className="text-sm">
                <span className="font-medium">Transaction Date:</span> {formatDate(transaction.transaction_date)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Pagination Component
  const PaginationControls = () => {
    if (pagination.totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(pagination.totalPages, start + maxVisible - 1);
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    };

    return (
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-gray-600 text-sm">
          Showing <span className="font-bold text-gray-800">{((currentPage - 1) * pagination.limit) + 1}</span> to{' '}
          <span className="font-bold text-gray-800">{Math.min(currentPage * pagination.limit, pagination.totalRecords)}</span> of{' '}
          <span className="font-bold text-gray-800">{pagination.totalRecords}</span> transactions
        </p>
        
        <div className="flex items-center gap-1.5">
          {/* First Page */}
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="First Page"
          >
            <ChevronsLeft size={18} />
          </button>

          {/* Previous Page */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Page Numbers */}
          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                  currentPage === pageNum
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200'
                    : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          {/* Mobile Page Indicator */}
          <div className="sm:hidden px-3 py-2 bg-gray-100 rounded-xl">
            <span className="font-semibold text-gray-800">{currentPage}</span>
            <span className="text-gray-500"> / {pagination.totalPages}</span>
          </div>

          {/* Next Page */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
            disabled={currentPage === pagination.totalPages}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={18} />
          </button>

          {/* Last Page */}
          <button
            onClick={() => setCurrentPage(pagination.totalPages)}
            disabled={currentPage === pagination.totalPages}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Last Page"
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Transactions
          </h1>
          <p className="text-gray-600">
            Manage and track all your grain transactions
          </p>
          </div>
          <p className="text-gray-100 font-bold bg-blue-600 px-6 py-1 rounded-full">
            {warehouse}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {categories.slice(1).map((cat) => {
            const count = transactionCounts[cat.key] || 0;
            return (
              <div
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setCurrentPage(1);
                }}
                className={`relative overflow-hidden bg-white rounded-2xl p-5 shadow-sm border-2 transition-all cursor-pointer group hover:shadow-xl ${
                  activeCategory === cat.key ? 'border-blue-400 shadow-lg shadow-blue-100' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className={`absolute top-0 right-0 w-20 h-20 ${cat.lightColor} rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className={`relative z-10 w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <cat.icon size={24} className="text-white" />
                </div>
                <p className="text-gray-500 text-sm font-medium relative z-10">{cat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1 relative z-10">
                  {count}
                </p>
                {activeCategory === cat.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                )}
              </div>
            );
          })}
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-2">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                  activeCategory === cat.key
                    ? `${cat.color} text-white shadow-lg`
                    : `${cat.textColor} hover:bg-gray-100`
                }`}
              >
                <cat.icon size={18} />
                {cat.label}
                {cat.key === '' ? (
                  <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-lg text-xs">
                    {getTotalTransactions()}
                  </span>
                ) : (
                  <span className={`ml-1 px-2 py-0.5 rounded-lg text-xs ${
                    activeCategory === cat.key ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {transactionCounts[cat.key] || 0}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Refresh Button & Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <p className="text-gray-600">
              Showing <span className="font-bold text-gray-800">{transactions.length}</span> of{' '}
              <span className="font-bold text-gray-800">{pagination.totalRecords}</span> transactions
            </p>
            {activeCategory && (
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                categories.find(c => c.key === activeCategory)?.lightColor
              } ${categories.find(c => c.key === activeCategory)?.textColor}`}>
                {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} only
              </span>
            )}
          </div>
          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium shadow-sm"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-500 font-medium">Loading transactions...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-700 font-semibold text-lg mb-2">Oops! Something went wrong</p>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchTransactions}
              className="px-6 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold shadow-lg shadow-red-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Transaction Cards */}
        {!loading && !error && (
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-700 text-xl font-semibold mb-2">No transactions found</p>
                <p className="text-gray-500">
                  {activeCategory 
                    ? `No ${activeCategory} transactions available. Try a different filter.`
                    : 'No transactions available yet. Check back later.'
                  }
                </p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group"
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setIsModalOpen(true);
                  }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Transaction Type Icon & User Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {getTransactionTypeIcon(transaction.transaction_type)}
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={transaction.user_id?.farmerProfile?.user_image || '/placeholder-user.png'}
                          alt={transaction.user_id?.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-gray-100 shadow-sm flex-shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(transaction.user_id?.name || 'User');
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-gray-800 truncate">
                            {transaction.user_id?.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {transaction.user_id?.farmerProfile?.farmerId}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Grain Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {transaction.grain?.map((item, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-100"
                          >
                            <Package size={14} className="mr-1.5" />
                            {item.category_id?.grain_type} 
                            <span className="ml-1 text-blue-500">({item.quantity_quintal?.toFixed(2)} qtl)</span>
                          </span>
                        ))}
                      </div>
                      <ApprovalStatusComponent approval={transaction.approval_status} />
                    </div>

                    {/* Amount & Status */}
                    <div className="flex items-center justify-between lg:justify-end gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                      <div className="text-left lg:text-right">
                        <p className="text-2xl font-bold text-gray-800">
                          {formatCurrency(transaction.total_amount)}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 lg:justify-end">
                          <Calendar size={14} />
                          {formatDate(transaction.transaction_date)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(transaction.transaction_status)}
                        <button className="opacity-0 group-hover:opacity-100 transition-all p-2 bg-gray-100 rounded-xl hover:bg-blue-100 hover:text-blue-600">
                          <Eye size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Warehouse & Remarks */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4">
                    {transaction.warehouse_id && (
                      <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <MapPin size={14} className="text-purple-500" />
                        <span className="text-sm">
                          {transaction.warehouse_id.name}, {transaction.warehouse_id.location}
                        </span>
                      </div>
                    )}
                    {transaction.remarks && (
                      <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg">
                        <span className="text-sm text-amber-700 font-medium capitalize">
                          {transaction.remarks.replace(/_/g, ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && <PaginationControls />}

        {/* Transaction Detail Modal */}
        {isModalOpen && (
          <TransactionModal
            transaction={selectedTransaction}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTransaction(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionsList;