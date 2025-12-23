"use client";
import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  X,
  Wheat,
  Loader2,
  Search,
  Sparkles,
  CheckCircle,
  Trash2,
  Edit3,
  Leaf,
  Grid3X3,
  LayoutList,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Boxes
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_BASE_URL from '@/utils/constants';

const GrainCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [formData, setFormData] = useState({ grain_type: '' });
  const [editData, setEditData] = useState({ oldGrainType: '', newGrainType: '' });
  const [deleteTarget, setDeleteTarget] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  // Quality colors and styles
  const qualityConfig = {
    A: {
      color: 'from-emerald-500 to-green-600',
      bg: 'bg-gradient-to-br from-emerald-50 to-green-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      badge: 'bg-emerald-500 text-white',
      label: 'Premium',
      ring: 'ring-emerald-500'
    },
    B: {
      color: 'from-blue-500 to-indigo-600',
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      badge: 'bg-blue-500 text-white',
      label: 'Standard',
      ring: 'ring-blue-500'
    },
    C: {
      color: 'from-amber-500 to-orange-600',
      bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      badge: 'bg-amber-500 text-white',
      label: 'Economy',
      ring: 'ring-amber-500'
    }
  };

  // Grain icons based on type
  const getGrainIcon = (grainType) => {
    const type = grainType.toLowerCase();
    if (type.includes('wheat')) return '🌾';
    if (type.includes('rice')) return '🍚';
    if (type.includes('moong') || type.includes('bean')) return '🫘';
    if (type.includes('corn') || type.includes('maize')) return '🌽';
    if (type.includes('barley')) return '🌿';
    if (type.includes('pulse') || type.includes('pluse') || type.includes('dal')) return '🥣';
    if (type.includes('soybean')) return '🫛';
    if (type.includes('oat')) return '🥣';
    return '🌱';
  };

  // Get gradient based on grain type
  const getGrainGradient = (grainType) => {
    const type = grainType.toLowerCase();
    if (type.includes('wheat')) return 'from-amber-400 to-yellow-500';
    if (type.includes('rice')) return 'from-slate-300 to-gray-400';
    if (type.includes('moong') || type.includes('bean')) return 'from-green-400 to-emerald-500';
    if (type.includes('corn') || type.includes('maize')) return 'from-yellow-400 to-orange-500';
    if (type.includes('pulse') || type.includes('pluse')) return 'from-orange-400 to-red-500';
    return 'from-emerald-400 to-teal-500';
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/grain/allgraincategories`);
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create new category with all three quality grades
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.grain_type.trim()) {
      toast.error('Please enter grain type');
      return;
    }

    // Check if grain type already exists
    const existingGrain = categories.find(
      c => c.grain_type.toLowerCase() === formData.grain_type.toLowerCase()
    );
    
    if (existingGrain) {
      toast.error('This grain type already exists!');
      return;
    }

    try {
      setSubmitting(true);
    
      const res = await axios.post(
        `${API_BASE_URL}/grain/creategraincategories`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      toast.success(
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getGrainIcon(formData.grain_type)}</span>
          <div>
            <p className="font-semibold">{formData.grain_type} created!</p>
            <p className="text-sm opacity-80">All 3 quality grades added</p>
          </div>
        </div>
      );
      
      setIsModalOpen(false);
      setFormData({ grain_type: '' });
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  // Edit category (update grain type for all qualities)
  const handleEdit = async (e) => {
    e.preventDefault();
    
    if (!editData.newGrainType.trim()) {
      toast.error('Please enter grain type');
      return;
    }

    try {
      setSubmitting(true);
      
      const categoriesToUpdate = categories.filter(
        c => c.grain_type === editData.oldGrainType
      );
      
      const promises = categoriesToUpdate.map(c => 
        axios.put(`${API_BASE_URL}/grain/updategraincategory/${c._id}`, {
          grain_type: editData.newGrainType.trim()
        })
      );
      
      await Promise.all(promises);
      
      toast.success('Category updated successfully!');
      setIsEditModalOpen(false);
      setEditData({ oldGrainType: '', newGrainType: '' });
      fetchCategories();
    } catch (error) {
      toast.error('Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete entire category (all quality grades)
  const handleDelete = async () => {
    try {
      setSubmitting(true);
      
      const categoriesToDelete = categories.filter(
        c => c.grain_type === deleteTarget
      );
      
      const promises = categoriesToDelete.map(c => 
        axios.delete(`${API_BASE_URL}/grain/deletegraincategory/${c._id}`)
      );
      
      await Promise.all(promises);
      
      toast.success(`${deleteTarget} deleted successfully!`);
      setIsDeleteModalOpen(false);
      setDeleteTarget('');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    } finally {
      setSubmitting(false);
    }
  };

  // Open edit modal
  const openEditModal = (grainType) => {
    setEditData({ oldGrainType: grainType, newGrainType: grainType });
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (grainType) => {
    setDeleteTarget(grainType);
    setIsDeleteModalOpen(true);
  };

  // Filter categories
  const filteredCategories = categories.filter((cat) => 
    cat.grain_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group categories by grain type
  const groupedCategories = filteredCategories.reduce((acc, cat) => {
    if (!acc[cat.grain_type]) {
      acc[cat.grain_type] = [];
    }
    acc[cat.grain_type].push(cat);
    return acc;
  }, {});

  // Get unique grain types
  const uniqueGrainTypes = [...new Set(categories.map(c => c.grain_type))];
  const grainTypeEntries = Object.entries(groupedCategories);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Title */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl blur-lg opacity-40"></div>
                  <div className="relative p-3.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg">
                    <Wheat className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Grain Categories
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Manage your grain inventory categories
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Search */}
                <div className="relative group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 
                                   group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search grains..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 pr-4 py-2.5 w-64 bg-gray-50/80 border border-gray-200/80 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                             focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                  />
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-gray-100/80 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-white shadow-sm text-emerald-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-white shadow-sm text-emerald-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <LayoutList className="w-5 h-5" />
                  </button>
                </div>

                {/* Add Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 
                           to-green-600 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25
                           hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 
                           active:translate-y-0 transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Category</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Categories */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100/80 
                        shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Entries</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{categories.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl 
                            group-hover:scale-110 transition-transform duration-300">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>3 grades per type</span>
            </div>
          </div>

          {/* Grain Types */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100/80 
                        shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Grain Types</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{uniqueGrainTypes.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl
                            group-hover:scale-110 transition-transform duration-300">
                <Leaf className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
              <Boxes className="w-3.5 h-3.5 text-blue-500" />
              <span>Unique categories</span>
            </div>
          </div>

          {/* Premium Count */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100/80 
                        shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Premium (A)</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">
                  {categories.filter(c => c.quality === 'A').length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-50 rounded-xl
                            group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Top quality</span>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100/80 
                        shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">System Status</p>
                <p className="text-lg font-semibold text-green-600 mt-2 flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  All Active
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-xl
                            group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
              <Loader2 className="relative w-12 h-12 text-emerald-500 animate-spin" />
            </div>
            <p className="mt-4 text-gray-500 font-medium">Loading categories...</p>
          </div>
        ) : grainTypeEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-sm 
                        rounded-3xl border border-gray-100/80">
            <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full mb-4">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">No categories found</h3>
            <p className="text-gray-500 mt-2 text-center max-w-md">
              {searchTerm 
                ? `No results for "${searchTerm}". Try a different search term.` 
                : 'Start by adding your first grain category. All quality grades will be created automatically.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 
                         to-green-600 text-white font-medium rounded-xl hover:shadow-lg 
                         hover:shadow-emerald-500/25 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Add First Category
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {grainTypeEntries.map(([grainType, items]) => (
              <div
                key={grainType}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/80 
                         overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-200/50 
                         transition-all duration-300 hover:-translate-y-1"
              >
                {/* Card Header with Gradient */}
                <div className={`p-5 bg-gradient-to-r ${getGrainGradient(grainType)} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute -right-4 -top-4 text-8xl opacity-20 transform rotate-12">
                    {getGrainIcon(grainType)}
                  </div>
                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl drop-shadow-lg">{getGrainIcon(grainType)}</div>
                        <div>
                          <h3 className="text-lg font-bold text-white drop-shadow-sm">
                            {grainType}
                          </h3>
                          <p className="text-sm text-white/80 mt-0.5">
                            {items.length} grades
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality Badges */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    {items
                      .sort((a, b) => a.quality.localeCompare(b.quality))
                      .map((item) => {
                        const config = qualityConfig[item.quality];
                        return (
                          <div
                            key={item._id}
                            className={`flex-1 text-center py-2 px-3 rounded-xl ${config.bg} ${config.border} border`}
                          >
                            <span className={`text-sm font-bold ${config.text}`}>
                              {item.quality}
                            </span>
                          </div>
                        );
                      })}
                  </div>

                  {/* Quality Labels */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      Premium
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Standard
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      Economy
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => openEditModal(grainType)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 
                               bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl 
                               transition-colors duration-200 group/btn"
                    >
                      <Edit3 className="w-4 h-4 group-hover/btn:text-blue-600 transition-colors" />
                      <span className="text-sm font-medium">Edit</span>
                    </button>
                    <button
                      onClick={() => openDeleteModal(grainType)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 
                               bg-red-50 hover:bg-red-100 text-red-600 rounded-xl 
                               transition-colors duration-200 group/btn"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Grain Type</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Grade A</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Grade B</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Grade C</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {grainTypeEntries.map(([grainType, items]) => (
                    <tr 
                      key={grainType}
                      className="hover:bg-emerald-50/30 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{getGrainIcon(grainType)}</span>
                          <div>
                            <p className="font-semibold text-gray-900">{grainType}</p>
                            <p className="text-sm text-gray-500">{items.length} grades</p>
                          </div>
                        </div>
                      </td>
                      {['A', 'B', 'C'].map(quality => {
                        const item = items.find(i => i.quality === quality);
                        const config = qualityConfig[quality];
                        return (
                          <td key={quality} className="px-6 py-4 text-center">
                            {item ? (
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 
                                              rounded-lg ${config.badge} text-sm font-medium`}>
                                <CheckCircle className="w-3.5 h-3.5" />
                                {config.label}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(grainType)}
                            className="p-2 hover:bg-blue-100 text-gray-500 hover:text-blue-600 
                                     rounded-lg transition-colors"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(grainType)}
                            className="p-2 hover:bg-red-100 text-gray-500 hover:text-red-600 
                                     rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Results Count */}
        {!loading && grainTypeEntries.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{grainTypeEntries.length}</span> grain types 
              with <span className="font-semibold text-gray-900">{filteredCategories.length}</span> total entries
            </p>
          </div>
        )}
      </div>

      {/* Create Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !submitting && setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md 
                        animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg shadow-emerald-500/25">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">New Category</h2>
                  <p className="text-sm text-gray-500">All 3 quality grades will be created</p>
                </div>
              </div>
              <button
                onClick={() => !submitting && setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                disabled={submitting}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Grain Type Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Grain Type Name
                </label>
                <div className="relative">
                  <Wheat className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.grain_type}
                    onChange={(e) => setFormData({ ...formData, grain_type: e.target.value })}
                    placeholder="e.g., Basmati Rice, Wheat, Moong Dal..."
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                             focus:bg-white transition-all duration-200"
                    autoFocus
                  />
                </div>
              </div>

              {/* Auto-create Info */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Auto Quality Grades</p>
                    <p className="text-sm text-blue-600 mt-1">
                      Three quality grades (A, B, C) will be automatically created for this grain type.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quality Preview */}
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(qualityConfig).map(([grade, config]) => (
                  <div
                    key={grade}
                    className={`p-4 rounded-xl border-2 ${config.bg} ${config.border} text-center`}
                  >
                    <div className={`text-2xl font-bold bg-gradient-to-r ${config.color} 
                                   bg-clip-text text-transparent`}>
                      {grade}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{config.label}</div>
                    <CheckCircle className={`w-4 h-4 mx-auto mt-2 ${config.text}`} />
                  </div>
                ))}
              </div>

              {/* Preview */}
              {formData.grain_type && (
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                  <p className="text-xs font-medium text-emerald-600 mb-2">Preview</p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getGrainIcon(formData.grain_type)}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{formData.grain_type}</p>
                      <p className="text-sm text-gray-500">Grade A, B, C variants</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl
                           hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.grain_type.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 
                           text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25
                           hover:shadow-xl hover:shadow-emerald-500/30 disabled:opacity-50 
                           disabled:cursor-not-allowed transition-all duration-200
                           flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create Category
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !submitting && setIsEditModalOpen(false)}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md 
                        animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Edit Category</h2>
                  <p className="text-sm text-gray-500">Update grain type name</p>
                </div>
              </div>
              <button
                onClick={() => !submitting && setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                disabled={submitting}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleEdit} className="p-6 space-y-6">
              {/* Current Value */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-2">Current Name</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getGrainIcon(editData.oldGrainType)}</span>
                  <p className="font-semibold text-gray-900">{editData.oldGrainType}</p>
                </div>
              </div>

              {/* New Value Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Grain Type Name
                </label>
                <div className="relative">
                  <Wheat className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={editData.newGrainType}
                    onChange={(e) => setEditData({ ...editData, newGrainType: e.target.value })}
                    placeholder="Enter new name..."
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                             focus:bg-white transition-all duration-200"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This will update the name for all quality grades (A, B, C)
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl
                           hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !editData.newGrainType.trim() || editData.newGrainType === editData.oldGrainType}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 
                           text-white font-medium rounded-xl shadow-lg shadow-blue-500/25
                           hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed 
                           transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Update Category
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !submitting && setIsDeleteModalOpen(false)}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md 
                        animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="p-6 text-center">
              {/* Warning Icon */}
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Category?</h2>
              <p className="text-gray-500 mb-6">
                This will permanently delete <span className="font-semibold text-gray-900">"{deleteTarget}"</span> and 
                all its quality grades (A, B, C). This action cannot be undone.
              </p>

              {/* Category Preview */}
              <div className="p-4 bg-red-50 rounded-xl border border-red-100 mb-6">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl">{getGrainIcon(deleteTarget)}</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{deleteTarget}</p>
                    <p className="text-sm text-red-600">3 grades will be deleted</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl
                           hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 
                           text-white font-medium rounded-xl shadow-lg shadow-red-500/25
                           hover:shadow-xl disabled:opacity-50 transition-all duration-200
                           flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrainCategories;