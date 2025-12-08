import React from 'react';
import { 
  X, 
  CheckCircle, 
  Wheat, 
  TrendingUp, 
  FileText,
  Shield,
  Calendar,
  CreditCard,
  ArrowRight,
  Info
} from 'lucide-react';

const LoanConformation = ({ isOpen, onClose, onConfirm, loanData, tenure = 12 }) => {
  if (!isOpen) return null;

  // Sample data structure (use actual loanData in production)
  const data = loanData 

  const formatCurrency = (val) => "₹" + Number(val).toLocaleString();
  
  // Calculate loan details
  const quarters = Math.ceil(tenure / 3);
  const interestRatePerQuarter = 0.0125;
  const totalInterest = Math.round(data.totalLoanAmount * interestRatePerQuarter * quarters);
  const totalPayable = data.totalLoanAmount + totalInterest;
  const monthlyEMI = tenure > 0 ? Math.round(totalPayable / tenure) : 0;
  const ltvRatio = ((data.totalLoanAmount / data.totalGrainValue) * 100).toFixed(1);

  // Get grain icon based on type
  const getGrainIcon = (type) => {
    const icons = {
      'Wheat': '🌾',
      'Rice': '🌾',
      'Bajra': '🌾',
      'Corn': '🌽',
      'Barley': '🌾'
    };
    return icons[type] || '🌾';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <FileText className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">Loan Confirmation</h2>
          </div>
          <p className="text-blue-100">Review your loan details before confirmation</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Loan Summary Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Loan Amount</span>
                <CreditCard className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totalLoanAmount)}</p>
              <p className="text-xs text-gray-600 mt-1">Principal amount</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Monthly EMI</span>
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyEMI)}</p>
              <p className="text-xs text-gray-600 mt-1">For {tenure} months</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Total Payable</span>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPayable)}</p>
              <p className="text-xs text-gray-600 mt-1">Incl. {formatCurrency(totalInterest)} interest</p>
            </div>
          </div>

          {/* Security Details */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">Secured Against Grain</h3>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-700">
                    Total Grain Value: <span className="font-semibold">{formatCurrency(data.totalGrainValue)}</span>
                  </p>
                  <div className="bg-amber-100 px-3 py-1 rounded-full">
                    <span className="text-xs font-semibold text-amber-800">LTV: {ltvRatio}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grain Distribution */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Wheat className="h-5 w-5 text-gray-600" />
              Grain-wise Loan Distribution
            </h3>
            <div className="space-y-3">
              {data.distribution.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getGrainIcon(item.grain_type)}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{item.grain_type}</p>
                        <p className="text-xs text-gray-500">Grade {item.quality}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">{formatCurrency(item.loan_allocated)}</p>
                      <p className="text-xs text-gray-500">{item.loan_allocated_quantity} Qtl</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-600">Current Price</span>
                    <span className="text-sm font-medium text-gray-700">
                      {formatCurrency(item.todayPricePerQtl)}/Qtl
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-800 space-y-1">
                <p>• Interest Rate: 1.25% per quarter</p>
                <p>• Processing Fee: ₹0</p>
                <p>• Prepayment allowed without penalty</p>
                <p>• Loan secured against stored grain</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              Confirm Loan
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoanConformation;