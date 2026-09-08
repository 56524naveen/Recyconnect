import { useNavigate } from 'react-router-dom';
import { Camera, Package, DollarSign, Search, ShieldAlert, Volume2 } from 'lucide-react';

export default function CollectorHome() {
  const navigate = useNavigate();
  
  const playAudio = (text: string) => {
    // Basic text-to-speech fallback
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.lang = 'hi-IN';
    window.speechSynthesis.speak(msg);
  };

  return (
    <div className="p-4 space-y-6">
      
      {/* Big Action Button */}
      <button 
        onClick={() => navigate('/collector/camera')}
        className="w-full bg-green-600 rounded-3xl p-8 flex flex-col items-center justify-center text-white shadow-xl hover:bg-green-700 transition active:scale-95 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        <Camera className="w-20 h-20 mb-4" />
        <h2 className="text-3xl font-bold">ई-वेस्ट बेचें</h2>
        <p className="opacity-90 mt-2 text-lg">Sell E-Waste</p>
      </button>

      {/* Grid of secondary actions */}
      <div className="grid grid-cols-2 gap-4">
        <HomeCard 
          icon={<DollarSign className="w-8 h-8 text-blue-500" />} 
          title="आज के भाव" 
          subtitle="Prices"
          onClick={() => navigate('/collector/prices')}
          onSpeak={() => playAudio("आज के भाव जानने के लिए यहाँ दबाएँ")}
        />
        <HomeCard 
          icon={<Search className="w-8 h-8 text-purple-500" />} 
          title="Recycler खोजें" 
          subtitle="Find Buyer"
          onClick={() => navigate('/collector/prices')} // redirect to match/prices for now
          onSpeak={() => playAudio("रिसाइकिलर खोजने के लिए यहाँ दबाएँ")}
        />
        <HomeCard 
          icon={<Package className="w-8 h-8 text-orange-500" />} 
          title="मेरे Lots" 
          subtitle="My Lots"
          onClick={() => navigate('/collector/prices')} // placeholder
          onSpeak={() => playAudio("अपने सामान देखने के लिए यहाँ दबाएँ")}
        />
        <HomeCard 
          icon={<ShieldAlert className="w-8 h-8 text-red-500" />} 
          title="सुरक्षा" 
          subtitle="Safety"
          onClick={() => navigate('/collector/safety')}
          onSpeak={() => playAudio("सुरक्षा जानकारी के लिए यहाँ दबाएँ")}
        />
      </div>
      
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-800">Recent: 15kg PCB</h3>
          <p className="text-sm text-gray-500">Paid: ₹2,700 • Yesterday</p>
        </div>
        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
          ✓
        </div>
      </div>
    </div>
  );
}

function HomeCard({ icon, title, subtitle, onClick, onSpeak }: { icon: any, title: string, subtitle: string, onClick: () => void, onSpeak: (e: any) => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:bg-gray-50 active:scale-95 transition relative"
    >
      <div className="mb-3 bg-gray-50 p-4 rounded-full">
        {icon}
      </div>
      <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      
      <div 
        onClick={(e) => {
          e.stopPropagation();
          onSpeak(e);
        }}
        className="absolute top-2 right-2 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50"
      >
        <Volume2 className="w-4 h-4" />
      </div>
    </button>
  );
}
