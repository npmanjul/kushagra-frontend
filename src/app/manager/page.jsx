// Dashboard.jsx
import React from "react";
import {
  Download,
  Users,
  Clock,
  Package,
  DollarSign,
  CheckCircle,
  CreditCard,
  BarChart3,
} from "lucide-react";

export default function Dashboard() {
  const stats = {
    totalUsers: 1247,
    pendingRequests: 23,
    totalInventory: 45678,
    monthlyRevenue: 1250000,
  };

  // --- Utility Functions ---
  const formatRupee = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumSignificantDigits: 10,
    }).format(amount);
  };


  const recentTransactions = [
    {
      id: "TXN001",
      farmerName: "Ajay Patel",
      type: "Sale",
      grain: "Wheat",
      quantity: 800,
      amount: 1820000,
      date: "2025-08-30",
      status: "completed",
    },
    {
      id: "TXN002",
      farmerName: "Sunita Sharma",
      type: "Storage",
      grain: "Rice",
      quantity: 600,
      date: "2025-08-29",
      status: "completed",
    },
  ];
  
  // ===== StatCard Subcomponent =====
  const StatCard = ({ title, value, icon: Icon, change, color }) => {
    const changeColor =
      color === "green"
        ? "text-green-600"
        : color === "orange"
        ? "text-orange-600"
        : color === "purple"
        ? "text-purple-600"
        : "text-gray-600";

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">
        <div className="p-4 bg-gray-100 rounded-full">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className={`text-sm font-semibold ${changeColor}`}>
            {change > 0 ? `+${change}%` : `${change}%`} from last period
          </p>
        </div>
      </div>
    );
  };

  // ===== QuickActions Subcomponent =====
  const QuickActions = () => {
    const actions = [
      {
        title: "Add New Stock",
        icon: Package,
        bg: "bg-indigo-50",
        hover: "hover:bg-indigo-100",
        text: "text-indigo-700",
      },
      {
        title: "Quality Check",
        icon: CheckCircle,
        bg: "bg-green-50",
        hover: "hover:bg-green-100",
        text: "text-green-700",
      },
      {
        title: "Credit Approval",
        icon: CreditCard,
        bg: "bg-purple-50",
        hover: "hover:bg-purple-100",
        text: "text-purple-700",
      },
      {
        title: "Monthly Report",
        icon: BarChart3,
        bg: "bg-orange-50",
        hover: "hover:bg-orange-100",
        text: "text-orange-700",
      },
    ];

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action) => (
            <button
              key={action.title}
              className={`${action.bg} ${action.hover} ${action.text} p-6 rounded-xl text-center transition-colors shadow-sm`}
            >
              <action.icon className="w-7 h-7 mx-auto mb-2" />
              <p className="text-sm font-semibold">{action.title}</p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ===== RecentActivity Subcomponent =====
  const RecentActivity = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentTransactions.slice(0, 3).map((txn) => (
            <div
              key={txn.id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{txn.farmerName}</p>
                <p className="text-sm text-gray-600">
                  {txn.type} - {txn.grain} ({txn.quantity} Quintals)
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">
                  {formatRupee(txn.amount)}
                </p>
                <p className="text-xs text-gray-500">{txn.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ===== StockAlerts Subcomponent =====
  const StockAlerts = () => {
    const alerts = [
      {
        name: "Wheat - A Grade",
        message: "Stock is running low (2000 Quintals left)",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        dot: "bg-yellow-500",
      },
      {
        name: "Maize - C Grade",
        message: "Critically low stock (500 Quintals)",
        bg: "bg-red-50",
        border: "border-red-200",
        dot: "bg-red-500 animate-pulse",
      },
    ];

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Stock Alerts</h3>
        <div className="space-y-4">
          {alerts.map((alert, i) => (
            <div
              key={i}
              className={`flex items-center p-4 ${alert.bg} rounded-lg border ${alert.border}`}
            >
              <div className={`w-2 h-2 ${alert.dot} rounded-full mr-3`}></div>
              <div>
                <p className="font-medium text-gray-900">{alert.name}</p>
                <p className="text-sm text-gray-600">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ===== Dashboard Page =====
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        {/* <DownloadInvoice/> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Registered Farmers"
          value={stats.totalUsers.toLocaleString("en-US")}
          icon={Users}
          change={12}
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={Clock}
          change={-5}
          color="orange"
        />
        <StatCard
          title="Total Inventory (Quintals)"
          value={stats.totalInventory.toLocaleString("en-US")}
          icon={Package}
          change={8}
          color="green"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatRupee(stats.monthlyRevenue)}
          icon={DollarSign}
          change={15}
          color="purple"
        />
      </div>

      <QuickActions />

      <div className="grid lg:grid-cols-2 gap-6">
        <RecentActivity />
        <StockAlerts />
      </div>
    </div>
  );
}
