import { Routes, Route, useNavigate } from 'react-router-dom';
import { CollectorApp } from './pages/collector/CollectorApp';
import { RecyclerApp } from './pages/recycler/RecyclerApp';
import { AdminApp } from './pages/admin/AdminApp';

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">♻️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">RecyConnect</h1>
          <p className="text-gray-600">From Scrap to Formal Recycling</p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/collector')}
            className="w-full flex items-center p-4 border-2 border-green-500 rounded-xl hover:bg-green-50 transition text-left"
          >
            <span className="text-3xl mr-4">🧑‍🔧</span>
            <div>
              <h2 className="font-bold text-lg text-gray-900">Collector / कबाड़ी</h2>
              <p className="text-sm text-gray-500">Sell E-Waste • ई-वेस्ट बेचें</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/recycler')}
            className="w-full flex items-center p-4 border-2 border-blue-500 rounded-xl hover:bg-blue-50 transition text-left"
          >
            <span className="text-3xl mr-4">🏭</span>
            <div>
              <h2 className="font-bold text-lg text-gray-900">Recycler</h2>
              <p className="text-sm text-gray-500">Buy & Process Materials</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/admin')}
            className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-left mt-8"
          >
            <span className="text-2xl mr-4">📊</span>
            <div>
              <h2 className="font-bold text-gray-900">Admin Dashboard</h2>
              <p className="text-xs text-gray-500">Monitor Platform Analytics</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/collector/*" element={<CollectorApp />} />
      <Route path="/recycler/*" element={<RecyclerApp />} />
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  );
}
