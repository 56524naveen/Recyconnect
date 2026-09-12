import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { CollectorApp } from './pages/collector/CollectorApp';
import { RecyclerApp } from './pages/recycler/RecyclerApp';
import { AdminApp } from './pages/admin/AdminApp';
import { seedFirestore } from './lib/db';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './pages/auth/AuthPage';
import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';

function Landing() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const { t, language } = useLanguage();

  const handleLogout = () => {
    signOut(auth);
  };

  if (!currentUser) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4 relative">
      <LanguageSelector />
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">♻️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('welcome')}, {userProfile?.name || currentUser.email}</h1>
          <p className="text-gray-600">{t('select_portal')}</p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/collector')}
            className="w-full flex items-center p-4 border-2 border-green-500 rounded-xl hover:bg-green-50 transition text-left"
          >
            <span className="text-3xl mr-4">🧑‍🔧</span>
            <div>
              <h2 className="font-bold text-lg text-gray-900">{t('collector')}</h2>
              <p className="text-sm text-gray-500">{t('sell_ewaste')}</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/recycler')}
            className="w-full flex items-center p-4 border-2 border-blue-500 rounded-xl hover:bg-blue-50 transition text-left"
          >
            <span className="text-3xl mr-4">🏭</span>
            <div>
              <h2 className="font-bold text-lg text-gray-900">{t('recycler')}</h2>
              <p className="text-sm text-gray-500">{t('buy_process')}</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/admin')}
            className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-left mt-8"
          >
            <span className="text-2xl mr-4">📊</span>
            <div>
              <h2 className="font-bold text-gray-900">{t('admin_dashboard')}</h2>
              <p className="text-xs text-gray-500">{t('monitor_platform')}</p>
            </div>
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full mt-4 text-gray-500 hover:text-red-500 transition py-2 font-medium"
          >
            {t('sign_out')}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/auth" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<Landing />} />
          <Route path="/collector/*" element={<ProtectedRoute><CollectorApp /></ProtectedRoute>} />
          <Route path="/recycler/*" element={<ProtectedRoute><RecyclerApp /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute><AdminApp /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </LanguageProvider>
  );
}
