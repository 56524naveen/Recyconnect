import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Users, Activity, LogOut, Download, AlertTriangle } from 'lucide-react';

export function AdminApp() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center font-bold text-xl text-white">
            <span className="text-2xl mr-2">📊</span> RecyConnect Admin
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem to="/admin" icon={<Activity />} label="Analytics" current={location.pathname} />
          <NavItem to="/admin/users" icon={<Users />} label="Users & Recyclers" current={location.pathname} />
          <NavItem to="/admin/anomalies" icon={<AlertTriangle />} label="Anomalies" current={location.pathname} />
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => navigate('/')} className="flex items-center w-full px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition">
            <LogOut className="w-5 h-5 mr-3" /> Exit
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Routes>
            <Route path="/" element={<AdminAnalytics />} />
            <Route path="/users" element={<div className="p-4">Users Module...</div>} />
            <Route path="/anomalies" element={<div className="p-4">Anomaly Detection Module...</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label, current }: any) {
  const navigate = useNavigate();
  const isActive = current === to;
  return (
    <button
      onClick={() => navigate(to)}
      className={`flex items-center w-full px-4 py-3 rounded-xl transition ${
        isActive ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:bg-slate-800'
      }`}
    >
      <div className={`mr-3 ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>{icon}</div>
      {label}
    </button>
  );
}

function AdminAnalytics() {
  const exportDataset = () => {
    alert('Dataset exported as CSV (Mock)');
  };

  const resetDemo = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' });
      alert('Demo data reset successfully.');
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Platform Analytics</h2>
        <div className="flex gap-2">
          <button onClick={resetDemo} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition">
            Reset Demo Data
          </button>
          <button onClick={exportDataset} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center">
            <Download className="w-4 h-4 mr-2" /> Export Dataset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Lots" value="102" />
        <StatCard title="Material Recycled" value="2,450 kg" />
        <StatCard title="Value Handled" value="₹4,25,000" />
        <StatCard title="Avg Earnings/Collector" value="₹12,400" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Unit Economics (Demo Model)</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <span className="text-gray-600">Traditional Route Earnings (Average)</span>
            <span className="font-bold text-gray-900">₹2,250</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <span className="text-gray-600">Platform Route Earnings (Average)</span>
            <span className="font-bold text-green-600">₹2,700</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Incremental Collector Income</span>
            <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">+ ₹450 (20% increase)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-gray-500 font-medium mb-1 text-sm">{title}</h3>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
    </div>
  );
}
