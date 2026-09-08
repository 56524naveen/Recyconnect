import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Camera, Home, Package, DollarSign, Wallet, ShieldAlert, ArrowLeft, CloudOff, Cloud, RefreshCw } from 'lucide-react';
import CollectorHome from './CollectorHome';
import CaptureImage from './CaptureImage';
import LotDetails from './LotDetails';
import RecyclerMatch from './RecyclerMatch';
import Prices from './Prices';
import Safety from './Safety';
import Earnings from './Earnings';

export function CollectorApp() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const hideBottomNav = location.pathname.includes('/camera');

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 max-w-md mx-auto relative shadow-2xl overflow-hidden">
      {/* App Header (except on camera) */}
      {!hideBottomNav && (
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center">
            {location.pathname !== '/collector' && (
              <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-100">
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
            )}
            <h1 className="text-xl font-bold text-gray-800">नमस्ते 👋 Raju</h1>
          </div>
          <div className="flex items-center">
            {isOnline ? (
              <span className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                <Cloud className="w-3 h-3 mr-1" /> Online
              </span>
            ) : (
              <span className="flex items-center text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full font-medium">
                <CloudOff className="w-3 h-3 mr-1" /> Offline
              </span>
            )}
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<CollectorHome />} />
          <Route path="/camera" element={<CaptureImage />} />
          <Route path="/lot/:id" element={<LotDetails />} />
          <Route path="/match/:id" element={<RecyclerMatch />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/safety" element={<Safety />} />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      {!hideBottomNav && (
        <nav className="bg-white border-t border-gray-200 pb-safe">
          <div className="flex justify-around items-center h-16">
            <NavButton to="/collector" icon={<Home />} label="Home" current={location.pathname} />
            <NavButton to="/collector/prices" icon={<DollarSign />} label="Prices" current={location.pathname} />
            <NavButton to="/collector/camera" icon={<Camera className="w-8 h-8 text-white" />} label="" current={location.pathname} isAction />
            <NavButton to="/collector/earnings" icon={<Wallet />} label="Earnings" current={location.pathname} />
            <NavButton to="/collector/safety" icon={<ShieldAlert />} label="Safety" current={location.pathname} />
          </div>
        </nav>
      )}
    </div>
  );
}

function NavButton({ to, icon, label, current, isAction }: { to: string, icon: React.ReactNode, label: string, current: string, isAction?: boolean }) {
  const navigate = useNavigate();
  const isActive = current === to && !isAction;
  
  if (isAction) {
    return (
      <button 
        onClick={() => navigate(to)}
        className="flex flex-col items-center justify-center w-14 h-14 bg-green-600 rounded-full shadow-lg transform -translate-y-4 hover:bg-green-700 active:scale-95 transition-all"
      >
        {icon}
      </button>
    );
  }

  return (
    <button 
      onClick={() => navigate(to)}
      className={`flex flex-col items-center justify-center w-16 h-full ${isActive ? 'text-green-600' : 'text-gray-500 hover:text-gray-900'}`}
    >
      <div className={`mb-1 ${isActive ? 'scale-110' : ''} transition-transform`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
