import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, MessageSquareCode, Wallet } from 'lucide-react';
import Dashboard from './components/Dashboard';
import BudgetView from './components/BudgetView';
import ChatView from './components/ChatView';
import { getFinancials, addExpense, addIncome } from './services/api';

const USER_ID = "demo_user_123";

function AppShell() {
  const [financials, setFinancials] = useState({ expenses: [], incomes: [] });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getFinancials(USER_ID);
      setFinancials(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleAddRecord = async (type, data) => {
      try {
          if (type === 'expense') {
              await addExpense(USER_ID, data);
          } else {
              await addIncome(USER_ID, data);
          }
          await loadData();
      } catch (e) {
          console.error("Failed to add record", e);
      }
  };

  const navItems = [
    { name: 'Overview', path: '/', icon: <LayoutDashboard className="w-5 h-5 mr-3" /> },
    { name: 'AI Budgeting', path: '/budget', icon: <Target className="w-5 h-5 mr-3" /> },
    { name: 'Coach Chat', path: '/chat', icon: <MessageSquareCode className="w-5 h-5 mr-3" /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-fintech-bg font-sans text-slate-800">
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
            <div className="p-6 flex items-center border-b border-slate-100">
                <div className="bg-fintech-blue p-2 rounded-lg mr-3">
                    <Wallet className="w-6 h-6 text-white" />
                </div>
                <h1 className="font-bold text-lg tracking-tight text-fintech-blue">Budget<span className="text-slate-800">Coach</span></h1>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link 
                           key={item.name} 
                           to={item.path} 
                           className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-blue-50 text-fintech-blue font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    )
                })}
            </nav>
            <div className="p-4 border-t border-slate-100">
                <div className="flex bg-slate-50 p-3 rounded-lg border border-slate-100 items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-300 mr-3"></div>
                    <div>
                        <p className="text-sm font-semibold">Demo User</p>
                        <p className="text-xs text-slate-500">Free Plan</p>
                    </div>
                </div>
            </div>
        </aside>

        <main className="flex-1 overflow-y-auto w-full relative">
             <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 sticky top-0 z-20 flex md:hidden items-center justify-center">
                 <Wallet className="w-5 h-5 text-fintech-blue mr-2" />
                 <h1 className="font-bold">BudgetCoach</h1>
             </header>

             <div className="p-4 md:p-8 max-w-6xl mx-auto">
                {loading ? (
                    <div className="w-full flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-fintech-blue border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Routes>
                            <Route path="/" element={<Dashboard financials={financials} onAddRecord={handleAddRecord} />} />
                            <Route path="/budget" element={<BudgetView userId={USER_ID} />} />
                            <Route path="/chat" element={<ChatView userId={USER_ID} financials={financials} />} />
                        </Routes>
                    </div>
                )}
             </div>
             
             <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-3 pb-safe z-30 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
                 {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link 
                           key={item.name} 
                           to={item.path} 
                           className={`flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-fintech-blue' : 'text-slate-500'}`}
                        >
                            {item.icon}
                            <span className="text-[10px] mt-1 font-medium">{item.name}</span>
                        </Link>
                    )
                })}
             </nav>
        </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
