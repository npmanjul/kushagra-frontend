"use client";
import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Filter, Search, Calendar } from 'lucide-react';
import API_BASE_URL from '@/utils/constants';
import Loader from '@/components/common/Loader';

const TransactionHistory = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/transaction/getalltransactions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch transactions");

      const result = await response.json();
      if (response.ok) {
        setTransactions(result);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    }finally {
      setLoading(false);
    }
  };  

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'deposit':
        return <ArrowDownRight className="w-5 h-5" />;
      case 'sell':
        return <TrendingUp className="w-5 h-5" />;
      case 'credit':
        return <ArrowDownRight className="w-5 h-5" />;
      case 'withdraw':
        return <ArrowUpRight className="w-5 h-5" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  const getTransactionColor = (type) => {
    switch(type) {
      case 'deposit':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'sell':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'credit':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'withdraw':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filter === 'all' || t.transaction_type === filter;
    const matchesSearch = t.remarks.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.transaction_type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: transactions.reduce((sum, t) => sum + t.total_amount, 0),
    deposits: transactions.filter(t => t.transaction_type === 'deposit').length,
    sells: transactions.filter(t => t.transaction_type === 'sell').length,
    credits: transactions.filter(t => t.transaction_type === 'credit').length,
    withdraws: transactions.filter(t => t.transaction_type === 'withdraw').length,
  };

  if(loading){
    return <Loader />;
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Transaction History</h1>
          <p className="text-gray-600">Track all your grain transactions in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-medium">Total Volume</span>
              <Wallet className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{stats.total.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{transactions.length} transactions</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-medium">Grain Added</span>
              <ArrowDownRight className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.deposits}</p>
            <p className="text-xs text-green-600 mt-1">Deposits to warehouse</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-medium">Grain Sold</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.sells}</p>
            <p className="text-xs text-blue-600 mt-1">Sold to warehouse</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-medium">Loans Taken</span>
              <ArrowDownRight className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.credits}</p>
            <p className="text-xs text-emerald-600 mt-1">Credit from amount</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-medium">Grain Removed</span>
              <ArrowUpRight className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.withdraws}</p>
            <p className="text-xs text-red-600 mt-1">Withdrawn from warehouse</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('deposit')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  filter === 'deposit'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Add Grain
              </button>
              <button
                onClick={() => setFilter('sell')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  filter === 'sell'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sold Grain
              </button>
              <button
                onClick={() => setFilter('credit')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  filter === 'credit'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Loans
              </button>
              <button
                onClick={() => setFilter('withdraw')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  filter === 'withdraw'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Remove Grain
              </button>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-xl border ${getTransactionColor(transaction.transaction_type)}`}>
                    {getTransactionIcon(transaction.transaction_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {transaction.transaction_type}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTransactionColor(transaction.transaction_type)}`}>
                        {transaction.transaction_type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{transaction.remarks}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(transaction.transaction_date)}
                      </span>
                      <span>ID: {transaction._id.slice(-8)}</span>
                    </div>
                  </div>
                </div>
                                  <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {transaction.transaction_type === 'credit' 
                      ? `₹${transaction.total_amount.toLocaleString()}`
                      : `₹${transaction.total_amount.toLocaleString()}`
                    }
                  </p>
                  {transaction.transaction_type === 'credit' ? (
                    <p className="text-sm text-gray-600 mt-1">
                      Loan amount
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">
                      {transaction.quantity_quintal} quintals @ ₹{transaction.price_per_quintal}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
            <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;