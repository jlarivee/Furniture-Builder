import { DollarSign, TrendingDown, TrendingUp, Info } from 'lucide-react';
import { MaterialsList } from '../types';

interface CostEstimatorProps {
  materialsList: MaterialsList;
  budget?: number;
}

export default function CostEstimator({ materialsList, budget }: CostEstimatorProps) {
  const parsePrice = (priceString: string): number => {
    const match = priceString.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  const totalCost = parsePrice(materialsList.totalEstimatedCost);
  const isOverBudget = budget && totalCost > budget;
  const budgetDiff = budget ? Math.abs(totalCost - budget) : 0;

  const categoryTotals = {
    lumber: materialsList.lumber?.reduce((sum, item) => sum + parsePrice(item.estimatedCost), 0) || 0,
    hardware: materialsList.hardware?.reduce((sum, item) => sum + parsePrice(item.estimatedCost), 0) || 0,
    finishing: materialsList.finishing?.reduce((sum, item) => sum + parsePrice(item.estimatedCost), 0) || 0
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <DollarSign className="text-green-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">Cost Breakdown</h3>
      </div>

      {/* Total Cost */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Total Estimated Cost</p>
            <p className="text-3xl font-bold text-gray-900">${totalCost.toFixed(2)}</p>
          </div>
          {budget && (
            <div className={`px-4 py-2 rounded-lg ${
              isOverBudget ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {isOverBudget ? (
                <div className="flex items-center space-x-2">
                  <TrendingUp size={20} />
                  <span className="font-semibold">${budgetDiff.toFixed(2)} over budget</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <TrendingDown size={20} />
                  <span className="font-semibold">${budgetDiff.toFixed(2)} under budget</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-900">Cost by Category</h4>

        {Object.entries(categoryTotals).map(([category, amount]) => {
          const percentage = (amount / totalCost) * 100;
          return (
            <div key={category}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700 capitalize">{category}</span>
                <span className="font-semibold text-gray-900">${amount.toFixed(2)} ({percentage.toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    category === 'lumber' ? 'bg-amber-500' :
                    category === 'hardware' ? 'bg-blue-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Cost Optimization Tips */}
      {isOverBudget && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">Cost Reduction Tips</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Consider using a more affordable wood species</li>
                <li>• Reduce dimensions slightly to use less material</li>
                <li>• Simplify joinery (e.g., pocket holes instead of mortise & tenon)</li>
                <li>• Shop sales at local lumber yards</li>
                <li>• Use reclaimed or salvaged wood when possible</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
