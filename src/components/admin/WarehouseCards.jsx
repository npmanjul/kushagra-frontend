import React, { useState, useEffect } from "react";
import { 
  Warehouse, 
  MapPin, 
  Package, 
  User, 
  UserCheck, 
  Users, 
  Building2, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Shield, 
  Activity,
  Calendar,
  ChevronRight
} from "lucide-react";
import API_BASE_URL from "@/utils/constants";
import Loader from "../common/Loader";

const WarehouseCard = ({ warehouse, index }) => {
  const gradients = [
    "from-blue-500 to-indigo-500",
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-cyan-500 to-blue-500",
    "from-indigo-500 to-purple-500",
  ];

  const gradient = gradients[index % gradients.length];

  // Calculate usage percentage (mock data - you can replace with actual data)
  const usagePercentage = Math.floor(Math.random() * 100);
  const getUsageColor = (percentage) => {
    if (percentage < 50) return "from-green-400 to-emerald-400";
    if (percentage < 80) return "from-yellow-400 to-orange-400";
    return "from-red-400 to-pink-400";
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Format capacity with commas
  const formatCapacity = (capacity) => {
    return capacity?.toLocaleString() || '0';
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-[1.02] hover:border-blue-200">
      {/* Decorative gradient line at top */}
      <div className={`h-1 bg-gradient-to-r ${gradient}`}></div>
      
      {/* Header with warehouse name */}
      <div className="relative p-6 pb-4">
        <div className="absolute top-6 right-6">
          <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg transform group-hover:rotate-3 transition-transform duration-300`}>
            <Building2 className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="pr-16">
          <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
            {warehouse.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Created {formatDate(warehouse.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Capacity indicator */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-600">Storage Utilization</span>
          <span className="text-xs font-bold text-gray-700">{usagePercentage}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${getUsageColor(usagePercentage)} transition-all duration-500 rounded-full`}
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formatCapacity(warehouse.capacity_quintal)} Quintal capacity
        </p>
      </div>

      {/* Main content */}
      <div className="px-6 pb-4 space-y-4">
        {/* Location */}
        <div className="flex items-start gap-3 group/item">
          <div className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg group-hover/item:from-green-100 group-hover/item:to-emerald-100 transition-colors">
            <MapPin className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</p>
            <p className="text-sm font-medium text-gray-800">{warehouse.location}</p>
          </div>
        </div>

        {/* Manager */}
        <div className="flex items-start gap-3 group/item">
          <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg group-hover/item:from-blue-100 group-hover/item:to-indigo-100 transition-colors">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Manager</p>
            <p className="text-sm font-medium text-gray-800 truncate">
              {warehouse.manager_name || "Not Assigned"}
            </p>
          </div>
        </div>

        {/* Supervisor */}
        <div className="flex items-start gap-3 group/item">
          <div className="p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg group-hover/item:from-purple-100 group-hover/item:to-pink-100 transition-colors">
            <UserCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Supervisor</p>
            <p className="text-sm font-medium text-gray-800 truncate">
              {warehouse.supervisor_name || "Not Assigned"}
            </p>
          </div>
        </div>

        {/* Staff Count */}
        <div className="flex items-start gap-3 group/item">
          <div className="p-2 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg group-hover/item:from-orange-100 group-hover/item:to-red-100 transition-colors">
            <Users className="w-4 h-4 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Staff Members</p>
            <p className="text-sm font-medium text-gray-800">
              <span className="text-lg font-bold text-gray-900">{warehouse.staff_ids?.length || 0}</span> members
            </p>
          </div>
        </div>
      </div>

      {/* Status badges */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
            <Activity className="w-3 h-3" />
            Active
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
            <Shield className="w-3 h-3" />
            Secured
          </span>
          {warehouse.staff_ids?.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
              <Users className="w-3 h-3" />
              Fully Staffed
            </span>
          )}
        </div>
      </div>

      {/* Action footer */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 font-mono truncate pr-2">
            ID: {warehouse._id}
          </div>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 group/btn">
            Details
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, change, gradient }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <span className={`text-sm font-semibold flex items-center gap-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 ${change < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

const WarehouseCards = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/warehouse/allwarehouse`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if(response.ok){
        setWarehouses(data);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching warehouses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from actual data
  const calculateStats = () => {
    const totalCapacity = warehouses.reduce((sum, w) => sum + (w.capacity_quintal || 0), 0);
    const totalStaff = warehouses.reduce((sum, w) => sum + (w.staff_ids?.length || 0), 0);
    const averageCapacity = warehouses.length > 0 ? Math.floor(totalCapacity / warehouses.length) : 0;
    
    return {
      totalWarehouses: warehouses.length,
      totalCapacity: totalCapacity.toLocaleString(),
      totalStaff,
      averageCapacity: averageCapacity.toLocaleString()
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="p-6 bg-red-50 rounded-full inline-flex mb-4">
            <Warehouse className="w-12 h-12 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Error Loading Warehouses</h3>
          <p className="text-gray-500">{error}</p>
          <button 
            onClick={fetchWarehouses}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Warehouse className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                Warehouse Management
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and monitor all warehouse operations
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              icon={Building2}
              title="Total Warehouses"
              value={stats.totalWarehouses}
              change={12}
              gradient="from-blue-500 to-indigo-500"
            />
            <StatsCard
              icon={Package}
              title="Total Capacity"
              value={`${stats.totalCapacity} Q`}
              change={8}
              gradient="from-purple-500 to-pink-500"
            />
            <StatsCard
              icon={Users}
              title="Total Staff"
              value={stats.totalStaff}
              change={-3}
              gradient="from-green-500 to-emerald-500"
            />
            <StatsCard
              icon={Clock}
              title="Avg. Capacity"
              value={`${stats.averageCapacity} Q`}
              gradient="from-orange-500 to-red-500"
            />
          </div>
        </div>

        {/* Warehouse Grid */}
        {warehouses.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100">
            <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full inline-flex mb-6">
              <Warehouse className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Warehouses Found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first warehouse</p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center gap-2 mx-auto">
              <Sparkles className="w-5 h-5" />
              Create First Warehouse
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {warehouses.map((warehouse, index) => (
              <WarehouseCard key={warehouse._id} warehouse={warehouse} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseCards;