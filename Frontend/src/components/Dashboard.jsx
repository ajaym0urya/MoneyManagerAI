import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PlusCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const COLORS = ['#1E3A8A', '#0D9488', '#10B981', '#EF4444', '#F59E0B', '#6366F1'];

export default function Dashboard({ financials, onAddRecord }) {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState('expense');
  const [formData, setFormData] = useState({ category: '', amount: '', date: '' });

  const expenses = financials?.expenses || [];
  const incomes = financials?.incomes || [];

  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddRecord(type, {
        ...formData,
        amount: parseFloat(formData.amount),
        source: type === 'income' ? formData.category : undefined
    });
    setShowForm(false);
    setFormData({ category: '', amount: '', date: '' });
  };

  const expenseChartData = expenses.reduce((acc, curr) => {
      const existing = acc.find(item => item.name === curr.category);
      if (existing) {
          existing.value += curr.amount;
      } else {
          acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-fintech flex flex-col justify-center">
              <p className="text-slate-500 text-sm font-medium">Total Balance</p>
              <h2 className="text-3xl font-bold mt-1 text-slate-800">${balance.toFixed(2)}</h2>
          </div>
          <div className="card-fintech flex items-center justify-between">
            <div>
               <p className="text-slate-500 text-sm font-medium">Total Income</p>
               <h2 className="text-2xl font-bold mt-1 text-fintech-green">${totalIncome.toFixed(2)}</h2>
            </div>
            <ArrowUpRight className="text-fintech-green w-10 h-10 alpha-20" />
          </div>
          <div className="card-fintech flex items-center justify-between">
            <div>
               <p className="text-slate-500 text-sm font-medium">Total Expenses</p>
               <h2 className="text-2xl font-bold mt-1 text-fintech-red">${totalExpense.toFixed(2)}</h2>
            </div>
             <ArrowDownRight className="text-fintech-red w-10 h-10" />
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-fintech lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg">Expense Breakdown</h3>
                <button 
                  onClick={() => setShowForm(!showForm)}
                  className="text-fintech-blue flex items-center text-sm font-medium hover:underline">
                    <PlusCircle className="w-4 h-4 mr-1" /> Add Record
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-wrap gap-4 items-end">
                     <div>
                        <label className="block text-xs text-slate-500 mb-1">Type</label>
                        <select className="input-base text-sm py-1.5" value={type} onChange={e => setType(e.target.value)}>
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">{type === 'expense' ? 'Category' : 'Source'}</label>
                        <input required type="text" className="input-base text-sm py-1.5" placeholder="e.g. Groceries" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">Amount ($)</label>
                        <input required type="number" step="0.01" className="input-base text-sm py-1.5 w-24" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">Date</label>
                        <input required type="date" className="input-base text-sm py-1.5" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                    </div>
                    <button type="submit" className="btn-primary text-sm py-1.5">Save</button>
                </form>
            )}

            {expenseChartData.length > 0 ? (
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={expenseChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {expenseChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `$${value}`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-64 flex items-center justify-center text-slate-400">
                    No expense data yet.
                </div>
            )}
        </div>

        <div className="card-fintech">
             <h3 className="font-semibold text-lg mb-4">Recent Transactions</h3>
             <div className="space-y-4">
                 {[...expenses, ...incomes]
                    .sort((a,b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 5)
                    .map((item, i) => (
                     <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                         <div>
                             <p className="font-medium text-sm">{item.category || item.source}</p>
                             <p className="text-xs text-slate-500">{item.date}</p>
                         </div>
                         <span className={`font-semibold ${item.source ? 'text-fintech-green' : 'text-slate-700'}`}>
                             {item.source ? '+' : '-'}${item.amount.toFixed(2)}
                         </span>
                     </div>
                 ))}
             </div>
        </div>
      </div>
    </div>
  );
}
