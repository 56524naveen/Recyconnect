import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { API_BASE, MaterialPrice } from '../../types';
import { addToSyncQueue } from '../../lib/offline';

export default function LotDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // 'new' or actual id
  
  const [weight, setWeight] = useState<string>('');
  const [prices, setPrices] = useState<MaterialPrice[]>([]);
  const [estimatedValue, setEstimatedValue] = useState<{min: number, max: number} | null>(null);
  
  const category = state?.category || 'PCB';
  const confidence = state?.confidence || 0.94;
  const image = state?.image;

  useEffect(() => {
    fetch(`${API_BASE}/materials`)
      .then(r => r.json())
      .then(data => {
        setPrices(data);
      })
      .catch(e => console.error(e));
  }, []);

  useEffect(() => {
    if (weight && prices.length > 0) {
      const w = parseFloat(weight);
      if (!isNaN(w) && w > 0) {
        const p = prices.find(p => p.material_category === category);
        if (p) {
          setEstimatedValue({
            min: w * p.buying_price_min,
            max: w * p.buying_price_max
          });
        }
      } else {
        setEstimatedValue(null);
      }
    }
  }, [weight, prices, category]);

  const saveLot = async () => {
    if (!weight) return;
    const lotData = {
      collector_id: 'c1',
      material_category: category,
      weight: parseFloat(weight),
      condition: 'Used',
      image_reference: image,
      estimated_value_min: estimatedValue?.min || 0,
      estimated_value_max: estimatedValue?.max || 0,
      status: 'CREATED',
      ai_confidence: confidence
    };

    try {
      if (navigator.onLine) {
        const res = await fetch(`${API_BASE}/lots`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lotData)
        });
        const saved = await res.json();
        navigate(`/collector/match/${saved.id}`);
      } else {
        await addToSyncQueue(`${API_BASE}/lots`, 'POST', lotData);
        alert('Saved offline. Will sync when internet is available.');
        navigate('/collector');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving lot');
    }
  };

  return (
    <div className="p-4 flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Weight<br/><span className="text-gray-500 text-lg font-normal">वजन दर्ज करें</span></h2>
        
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
            {image ? <img src={image} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200"></div>}
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide font-bold">Category</p>
            <h3 className="text-2xl font-bold text-gray-900">{category}</h3>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-8">
          <label className="block text-center text-gray-600 mb-2 font-medium">Approximate Weight (kg)</label>
          <div className="flex items-center justify-center">
            <input 
              type="number" 
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0.0"
              className="text-center text-6xl font-bold bg-transparent border-b-4 border-gray-300 focus:border-green-500 outline-none w-48 text-gray-900 transition-colors"
            />
            <span className="text-3xl text-gray-400 font-bold ml-2">KG</span>
          </div>
        </div>

        {estimatedValue && (
          <div className="bg-green-50 border border-green-100 rounded-3xl p-6 text-center animate-in fade-in slide-in-from-bottom-4">
            <p className="text-green-800 font-medium mb-1">Estimated Value / अनुमानित मूल्य</p>
            <h3 className="text-4xl font-bold text-green-600">
              ₹{estimatedValue.min.toLocaleString()} - ₹{estimatedValue.max.toLocaleString()}
            </h3>
          </div>
        )}
      </div>

      <div className="pt-4">
        <button 
          disabled={!weight || parseFloat(weight) <= 0}
          onClick={saveLot}
          className="w-full py-5 bg-green-600 text-white rounded-2xl font-bold text-xl shadow-[0_8px_30px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
        >
          Find Recyclers →
        </button>
      </div>
    </div>
  );
}
