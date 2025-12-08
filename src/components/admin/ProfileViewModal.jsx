import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Building2,
  Landmark,
  Hash,
  Wheat,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Users,
  Shield,
  Sparkles,
  Eye,
  Download,
  ChevronRight,
  IndianRupee,
  Banknote,
  PiggyBank,
  Receipt,
  History,
  BadgeCheck,
  Wallet,
} from 'lucide-react';

const ProfileViewModal = ({ isOpen, onClose, farmerData }) => {
  const [activeTab, setActiveTab] = useState('profile');

  // Sample farmer data (replace with actual prop data)
  const farmer = farmerData || {
    id: 'F001',
    name: 'Ram Kumar',
    phone: '+91 9876543210',
    email: 'ram.kumar@email.com',
    avatar: 'RK',
    status: 'active',
    joinDate: '2024-01-15',
    
    // Profile Details
    aadhaar_number: '1234-5678-9012',
    pan_number: 'ABCDE1234F',
    dob: '1985-06-15',
    gender: 'Male',
    
    // Address
    address: 'Village Rampur, Post Belghat',
    tehsil: 'Gola',
    district: 'Gorakhpur',
    state: 'Uttar Pradesh',
    pin_code: '273402',
    
    // Land Details
    land_size: '2.5',
    
    // Bank Details
    account_number: '1234567890123',
    ifsc_code: 'SBIN0001234',
    account_holder: 'Ram Kumar',
    bank_name: 'State Bank of India',
    branch_name: 'Gorakhpur Main Branch',
    
    // Nominee Details
    nominee_name: 'Sita Devi',
    nominee_relation: 'Wife',
    nominee_phone: '+91 9876543211',
    nominee_aadhaar: '5678-9012-3456',
    
    // Stats
    totalGrain: 1500,
    totalValue: 2250000,
    creditLimit: 1800000,
    creditUsed: 900000,
    creditAvailable: 900000,
  };

  // Sample Transactions
  const transactions = [
    { id: 'TXN001', type: 'deposit', description: 'Wheat Deposit', quantity: 200, value: 300000, date: '2024-11-20', status: 'completed' },
    { id: 'TXN002', type: 'withdrawal', description: 'Loan Disbursement', quantity: null, value: 150000, date: '2024-11-18', status: 'completed' },
    { id: 'TXN003', type: 'deposit', description: 'Rice Deposit', quantity: 150, value: 225000, date: '2024-11-15', status: 'completed' },
    { id: 'TXN004', type: 'withdrawal', description: 'Credit Withdrawal', quantity: null, value: 50000, date: '2024-11-10', status: 'completed' },
    { id: 'TXN005', type: 'deposit', description: 'Paddy Deposit', quantity: 300, value: 450000, date: '2024-11-05', status: 'pending' },
    { id: 'TXN006', type: 'withdrawal', description: 'Emergency Loan', quantity: null, value: 100000, date: '2024-10-28', status: 'completed' },
  ];

  // Sample Loans
  const loans = [
    { id: 'LOAN001', amount: 500000, disbursed: '2024-01-20', dueDate: '2024-07-20', status: 'active', paid: 200000, remaining: 300000, interestRate: 8 },
    { id: 'LOAN002', amount: 300000, disbursed: '2024-06-15', dueDate: '2024-12-15', status: 'active', paid: 100000, remaining: 200000, interestRate: 8 },
    { id: 'LOAN003', amount: 200000, disbursed: '2023-08-10', dueDate: '2024-02-10', status: 'completed', paid: 200000, remaining: 0, interestRate: 7.5 },
    { id: 'LOAN004', amount: 150000, disbursed: '2023-03-05', dueDate: '2023-09-05', status: 'completed', paid: 150000, remaining: 0, interestRate: 7.5 },
  ];

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'loans', label: 'Loans', icon: Banknote },
  ];

  const getStatusBadge = (status) => {
    const configs = {
      active: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle2, dot: 'bg-green-500' },
      completed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle2, dot: 'bg-green-500' },
      pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock, dot: 'bg-amber-500' },
      overdue: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: AlertCircle, dot: 'bg-red-500' },
    };
    const config = configs[status] || configs.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`}></span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const InfoCard = ({ icon: Icon, label, value, color = 'indigo' }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <div className={`p-2 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-lg shadow-sm`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-sm font-semibold text-gray-900 truncate">{value || 'N/A'}</p>
      </div>
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, subValue, color, trend }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 bg-gradient-to-br ${color} rounded-xl shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
      {subValue && <p className="text-xs text-gray-400 mt-0.5">{subValue}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          </div>
          
          <div className="relative px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl border border-white/30 shadow-xl">
                    {farmer.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{farmer.name}</h2>
                    <BadgeCheck className="w-5 h-5 text-yellow-300" />
                  </div>
                  <p className="text-white/70 text-sm">ID: {farmer.id}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-white/80 text-xs">
                      <Phone className="w-3 h-3" />
                      {farmer.phone}
                    </span>
                    <span className="flex items-center gap-1 text-white/80 text-xs">
                      <Calendar className="w-3 h-3" />
                      Member since {new Date(farmer.joinDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <Wheat className="w-4 h-4 text-yellow-300" />
                  <div>
                    <p className="text-white font-bold text-sm">{farmer.totalGrain.toLocaleString()} Qtl</p>
                    <p className="text-white/60 text-xs">Total Grain</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-50 px-4 py-2 gap-2 flex-shrink-0 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-800 shadow-md'
                    : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <InfoCard icon={User} label="Full Name" value={farmer.name} />
                  <InfoCard icon={Phone} label="Phone Number" value={farmer.phone} />
                  <InfoCard icon={Mail} label="Email Address" value={farmer.email} />
                  <InfoCard icon={Calendar} label="Date of Birth" value={farmer.dob} />
                  <InfoCard icon={Hash} label="Aadhaar Number" value={farmer.aadhaar_number} />
                  <InfoCard icon={CreditCard} label="PAN Number" value={farmer.pan_number} />
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  Address & Land Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <InfoCard icon={MapPin} label="Address" value={farmer.address} />
                  <InfoCard icon={MapPin} label="Tehsil" value={farmer.tehsil} />
                  <InfoCard icon={MapPin} label="District" value={farmer.district} />
                  <InfoCard icon={MapPin} label="State" value={farmer.state} />
                  <InfoCard icon={Hash} label="PIN Code" value={farmer.pin_code} />
                  <InfoCard icon={Wheat} label="Land Size" value={`${farmer.land_size} Acres`} />
                </div>
              </div>

              {/* Nominee Information */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  Nominee Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <InfoCard icon={User} label="Nominee Name" value={farmer.nominee_name} />
                  <InfoCard icon={Users} label="Relationship" value={farmer.nominee_relation} />
                  <InfoCard icon={Phone} label="Nominee Phone" value={farmer.nominee_phone} />
                  <InfoCard icon={Hash} label="Nominee Aadhaar" value={farmer.nominee_aadhaar} />
                </div>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              {/* Account Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                  icon={Wheat} 
                  label="Total Grain Deposited" 
                  value={`${farmer.totalGrain.toLocaleString()} Qtl`}
                  color="from-amber-500 to-orange-600"
                  trend={12}
                />
                <StatCard 
                  icon={IndianRupee} 
                  label="Total Value" 
                  value={formatCurrency(farmer.totalValue)}
                  color="from-green-500 to-emerald-600"
                  trend={8}
                />
                <StatCard 
                  icon={CreditCard} 
                  label="Credit Used" 
                  value={formatCurrency(farmer.creditUsed)}
                  subValue={`of ${formatCurrency(farmer.creditLimit)} limit`}
                  color="from-blue-500 to-indigo-600"
                />
                <StatCard 
                  icon={PiggyBank} 
                  label="Available Credit" 
                  value={formatCurrency(farmer.creditAvailable)}
                  color="from-purple-500 to-pink-600"
                />
              </div>

              {/* Credit Usage Progress */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  Credit Utilization
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Used: {formatCurrency(farmer.creditUsed)}</span>
                    <span className="text-gray-600">Limit: {formatCurrency(farmer.creditLimit)}</span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${(farmer.creditUsed / farmer.creditLimit) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {Math.round((farmer.creditUsed / farmer.creditLimit) * 100)}% of credit limit utilized
                  </p>
                </div>
              </div>

              {/* Bank Details */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  Bank Account Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <InfoCard icon={CreditCard} label="Account Number" value={farmer.account_number} />
                  <InfoCard icon={Hash} label="IFSC Code" value={farmer.ifsc_code} />
                  <InfoCard icon={User} label="Account Holder" value={farmer.account_holder} />
                  <InfoCard icon={Building2} label="Bank Name" value={farmer.bank_name} />
                  <InfoCard icon={Landmark} label="Branch Name" value={farmer.branch_name} />
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              {/* Transaction Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDownLeft className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">Total Deposits</span>
                  </div>
                  <p className="text-xl font-bold text-green-700">
                    {formatCurrency(transactions.filter(t => t.type === 'deposit').reduce((a, b) => a + b.value, 0))}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-medium text-red-700">Total Withdrawals</span>
                  </div>
                  <p className="text-xl font-bold text-red-700">
                    {formatCurrency(transactions.filter(t => t.type === 'withdrawal').reduce((a, b) => a + b.value, 0))}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Receipt className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">Total Transactions</span>
                  </div>
                  <p className="text-xl font-bold text-blue-700">{transactions.length}</p>
                </div>
              </div>

              {/* Transaction List */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-600" />
                    Recent Transactions
                  </h3>
                  <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {transactions.map((txn) => (
                    <div key={txn.id} className="px-5 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${txn.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {txn.type === 'deposit' ? (
                            <ArrowDownLeft className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{txn.description}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500">{txn.id}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs text-gray-500">
                              {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            {txn.quantity && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-gray-500">{txn.quantity} Qtl</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className={`text-sm font-bold ${txn.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                          {txn.type === 'deposit' ? '+' : '-'}{formatCurrency(txn.value)}
                        </p>
                        {getStatusBadge(txn.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loans Tab */}
          {activeTab === 'loans' && (
            <div className="space-y-4">
              {/* Loan Summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Total Borrowed</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(loans.reduce((a, b) => a + b.amount, 0))}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Total Repaid</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(loans.reduce((a, b) => a + b.paid, 0))}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Outstanding</p>
                  <p className="text-xl font-bold text-amber-600">
                    {formatCurrency(loans.reduce((a, b) => a + b.remaining, 0))}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Active Loans</p>
                  <p className="text-xl font-bold text-indigo-600">
                    {loans.filter(l => l.status === 'active').length}
                  </p>
                </div>
              </div>

              {/* Loan List */}
              <div className="space-y-3">
                {loans.map((loan) => (
                  <div key={loan.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${loan.status === 'active' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-green-500 to-emerald-600'}`}>
                          <Banknote className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Loan {loan.id}</p>
                          <p className="text-xs text-gray-500">Interest Rate: {loan.interestRate}% p.a.</p>
                        </div>
                      </div>
                      {getStatusBadge(loan.status)}
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Loan Amount</p>
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(loan.amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Disbursed</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(loan.disbursed).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Due Date</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(loan.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Outstanding</p>
                        <p className={`text-sm font-semibold ${loan.remaining > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                          {formatCurrency(loan.remaining)}
                        </p>
                      </div>
                    </div>

                    {/* Repayment Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Repayment Progress</span>
                        <span className="font-medium text-gray-700">{Math.round((loan.paid / loan.amount) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${loan.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                          style={{ width: `${(loan.paid / loan.amount) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Paid: {formatCurrency(loan.paid)}</span>
                        <span>Total: {formatCurrency(loan.amount)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 text-sm font-medium">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewModal;