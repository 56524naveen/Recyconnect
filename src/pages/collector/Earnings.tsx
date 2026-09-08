import { useEffect, useState } from 'react';
import { API_BASE, Transaction } from '../../types';
import { Wallet, CheckCircle2 } from 'lucide-react';

export default function Earnings() {
  const [txs, setTxs] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/transactions?collector_id=c1`)
      .then(r => r.json())
      .then(setTxs)
      .catch(console.error);
  }, []);

  const total = txs.filter(t => t.payment_status === 'PAID').reduce((sum, t) => sum + t.final_price, 0);

  return (
    <div className="p-4">
      <div className="bg-green-600 rounded-3xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
        <div className="flex items-center mb-2">
          <Wallet className="w-5 h-5 mr-2 opacity-80" />
          <h3 className="font-medium opacity-90">Total Earnings</h3>
        </div>
        <h2 className="text-5xl font-bold mb-1">₹{total.toLocaleString()}</h2>
        <p className="text-green-100 text-sm">मेरी कमाई</p>
      </div>

      <h3 className="font-bold text-gray-900 mb-4 text-lg">Recent Transactions</h3>
      
      <div className="space-y-4">
        {txs.map(t => (
          <div key={t.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-900">{t.id}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(t.created_at).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-green-600">+₹{t.final_price}</p>
              <p className="text-xs text-gray-500 flex items-center justify-end mt-1">
                <CheckCircle2 className="w-3 h-3 text-green-500 mr-1" /> {t.payment_status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
