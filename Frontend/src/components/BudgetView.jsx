import { useState, useEffect } from 'react';
import { getBudgetAdvice } from '../services/api';
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function BudgetView({ userId }) {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     loadAdvice();
  }, [userId]);

  const loadAdvice = async () => {
      setLoading(true);
      try {
          const data = await getBudgetAdvice(userId);
          setAdvice(data);
      } catch (e) {
          console.error(e);
      }
      setLoading(false);
  };

  if (loading || !advice) {
      return (
          <div className="card-fintech flex flex-col items-center justify-center h-64 animate-pulse">
              <Sparkles className="w-8 h-8 text-fintech-blue mb-4 animate-bounce" />
              <p className="text-slate-500">AI is analyzing your finances...</p>
          </div>
      );
  }

  const budgetData = Object.entries(advice.recommended_budget || {}).map(([name, value]) => ({ name, value }));
  const COLORS = ['#1E3A8A', '#0D9488', '#10B981', '#F59E0B', '#6366F1'];

  return (
    <div className="space-y-6">
      <div className="card-fintech">
          <div className="flex items-center text-fintech-blue mb-4">
              <Sparkles className="w-6 h-6 mr-2" />
              <h2 className="text-2xl font-bold">AI Budget Plan</h2>
          </div>
          <p className="text-slate-600">Based on your recent spending and income, Gemini AI recommends the following distribution.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-fintech">
              <h3 className="font-semibold mb-4 border-b border-slate-100 pb-2">Recommended Allocation</h3>
               <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={budgetData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {budgetData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {budgetData.map((item, i) => (
                        <div key={i} className="flex items-center text-xs text-slate-600">
                            <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                            {item.name}: {item.value}%
                        </div>
                    ))}
                </div>
          </div>

          <div className="space-y-6">
              <div className="card-fintech">
                  <h3 className="font-semibold mb-4 flex items-center text-fintech-blue">
                      <TrendingUp className="w-5 h-5 mr-2" /> Financial Insights
                  </h3>
                  <ul className="space-y-3">
                      {(advice.insights || []).map((insight, i) => (
                          <li key={i} className="flex items-start text-sm text-slate-700">
                              <span className="text-fintech-blue mr-2">•</span> {insight}
                          </li>
                      ))}
                  </ul>
              </div>

              <div className="card-fintech bg-green-50 border-green-100">
                  <h3 className="font-semibold mb-4 flex items-center text-fintech-green">
                      <AlertCircle className="w-5 h-5 mr-2" /> Savings Tips
                  </h3>
                  <ul className="space-y-3">
                      {(advice.savings_tips || []).map((tip, i) => (
                          <li key={i} className="flex items-start text-sm text-slate-700">
                              <span className="text-fintech-green mr-2">✔</span> {tip}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      </div>
    </div>
  );
}
