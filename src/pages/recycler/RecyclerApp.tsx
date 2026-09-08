import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Package, CheckCircle2, TrendingUp, Settings, LogOut, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_BASE, Lot, Transaction } from '../../types';

export function RecyclerApp() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center text-blue-600 font-bold text-xl">
            <span className="text-2xl mr-2">🏭</span> Recycler Portal
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem to="/recycler" icon={<TrendingUp />} label="Dashboard" current={location.pathname} />
          <NavItem to="/recycler/lots" icon={<Package />} label="Incoming Lots" current={location.pathname} />
          <NavItem to="/recycler/transactions" icon={<CheckCircle2 />} label="Transactions" current={location.pathname} />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={() => navigate('/')} className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition">
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white p-4 border-b border-gray-200 flex justify-between items-center md:hidden">
          <h1 className="font-bold text-lg text-blue-600">Recycler Portal</h1>
          <button onClick={() => navigate('/')} className="text-gray-500"><LogOut className="w-5 h-5" /></button>
        </header>
        <div className="p-6">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/lots" element={<IncomingLots />} />
            <Route path="/transactions" element={<Transactions />} />
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
        isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <div className={`mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>{icon}</div>
      {label}
    </button>
  );
}

function DashboardHome() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Pending Lots" value="12" subtitle="Waiting for offers" color="bg-orange-50 text-orange-600" />
        <StatCard title="Material Procured" value="450 kg" subtitle="This month" color="bg-blue-50 text-blue-600" />
        <StatCard title="Value" value="₹45,200" subtitle="Paid out this month" color="bg-green-50 text-green-600" />
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-gray-500 font-medium mb-2">{title}</h3>
      <div className={`text-3xl font-bold mb-1 ${color.split(' ')[1]}`}>{value}</div>
      <p className="text-sm text-gray-400">{subtitle}</p>
    </div>
  );
}

function IncomingLots() {
  const [lots, setLots] = useState<Lot[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/lots`)
      .then(r => r.json())
      .then(setLots);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Incoming Lots</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
              <th className="p-4 font-medium">Lot ID</th>
              <th className="p-4 font-medium">Material</th>
              <th className="p-4 font-medium">Weight</th>
              <th className="p-4 font-medium">Est. Value</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {lots.map(lot => (
              <tr key={lot.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{lot.id}</td>
                <td className="p-4">{lot.material_category}</td>
                <td className="p-4">{lot.weight} kg</td>
                <td className="p-4 text-gray-500">₹{lot.estimated_value_min} - ₹{lot.estimated_value_max}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    lot.status === 'CREATED' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {lot.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Transactions() {
  const [txs, setTxs] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/transactions`)
      .then(r => r.json())
      .then(setTxs);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Transactions</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
              <th className="p-4 font-medium">TX ID</th>
              <th className="p-4 font-medium">Collector ID</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {txs.map(t => (
              <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{t.id}</td>
                <td className="p-4">{t.collector_id}</td>
                <td className="p-4 font-bold text-green-600">₹{t.final_price}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                    {t.payment_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
