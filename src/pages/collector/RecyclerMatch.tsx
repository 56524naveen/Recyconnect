import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lot, Recycler } from '../../types';
import { getLot, getMatchingRecyclers, createOffer } from '../../lib/db';
import { CheckCircle2, MapPin, Truck, ChevronRight } from 'lucide-react';

export default function RecyclerMatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lot, setLot] = useState<Lot | null>(null);
  const [recyclers, setRecyclers] = useState<Recycler[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getLot(id)
      .then(data => {
        if (data) {
          setLot(data);
          return getMatchingRecyclers(data.material_category);
        }
        return [];
      })
      .then(data => {
        setRecyclers(data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [id]);

  const requestOffer = async (recyclerId: string) => {
    if (!id) return;
    try {
      await createOffer({
        lot_id: id,
        recycler_id: recyclerId,
        quoted_price: lot?.estimated_value_max || 0, // Mock for demo
        pickup_available: true,
        status: 'PENDING'
      });
      // In real life this notifies the recycler. For MVP demo, auto-accept or redirect to a wait page
      alert('Offer requested! For demo purposes, we will assume they accepted.');
      navigate(`/collector`);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-center">Finding best matches...</div>;

  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Found Recyclers</h2>
        <p className="text-gray-500">For {lot?.weight}kg {lot?.material_category}</p>
      </div>

      <div className="space-y-4">
        {recyclers.map((r, idx) => (
          <div key={r.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
            {idx === 0 && (
              <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Best Match
              </div>
            )}
            
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900 flex items-center">
                  {r.name}
                  {r.authorization_status === 'VERIFIED' && (
                    <CheckCircle2 className="w-4 h-4 text-blue-500 ml-1 inline" />
                  )}
                </h3>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPin className="w-3 h-3 mr-1" /> {r.facility_location} • {r.service_area}km
                </p>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Authorized
              </span>
              {r.pickup_available && (
                <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md font-medium flex items-center">
                  <Truck className="w-3 h-3 mr-1" /> Pickup Available
                </span>
              )}
            </div>

            <button 
              onClick={() => requestOffer(r.id)}
              className="w-full flex items-center justify-center py-3 bg-gray-900 text-white rounded-xl font-medium active:scale-95 transition"
            >
              Get Offer <ChevronRight className="w-4 h-4 ml-1 opacity-70" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
