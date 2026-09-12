import { useEffect, useState } from 'react';
import { MaterialPrice } from '../../types';
import { getMaterials } from '../../lib/db';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export default function Prices() {
  const [prices, setPrices] = useState<MaterialPrice[]>([]);

  useEffect(() => {
    getMaterials()
      .then(setPrices)
      .catch(console.error);
  }, []);

  const dummyData = [
    { pv: 150 }, { pv: 160 }, { pv: 165 }, { pv: 175 }, { pv: 180 }
  ];

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Today's Prices</h2>
        <p className="text-gray-500">Live market rates (Demo Data)</p>
      </div>

      <div className="space-y-4">
        {prices.map(p => (
          <div key={p.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{p.material_category}</h3>
              <p className="text-green-600 font-bold text-xl mt-1">₹{p.buying_price_min} - ₹{p.buying_price_max} <span className="text-sm font-normal text-gray-500">/ {p.unit}</span></p>
            </div>
            
            <div className="w-24 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dummyData}>
                  <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                  <Line type="monotone" dataKey="pv" stroke="#16a34a" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="text-[10px] text-green-600 font-bold text-right flex justify-end items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" /> +5%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
