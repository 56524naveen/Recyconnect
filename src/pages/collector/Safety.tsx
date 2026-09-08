import { Volume2, AlertTriangle, ShieldCheck, BatteryWarning } from 'lucide-react';

export default function Safety() {
  const speak = (text: string) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'hi-IN';
    window.speechSynthesis.speak(msg);
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Safety Guide</h2>
        <p className="text-gray-500">सुरक्षा जानकारी</p>
      </div>

      <div className="space-y-4">
        <SafetyCard 
          icon={<AlertTriangle className="w-10 h-10 text-red-500" />}
          title="तार मत जलाएं"
          subtitle="Do not burn cables"
          audioText="तार जलाने से जहरीला धुआं निकल सकता है।"
          onSpeak={speak}
        />
        <SafetyCard 
          icon={<BatteryWarning className="w-10 h-10 text-orange-500" />}
          title="बैटरी से सावधान"
          subtitle="Battery safety"
          audioText="पुरानी बैटरी को तोड़ें नहीं, इससे तेज़ाब निकल सकता है।"
          onSpeak={speak}
        />
        <SafetyCard 
          icon={<ShieldCheck className="w-10 h-10 text-blue-500" />}
          title="दस्ताने पहनें"
          subtitle="Wear gloves"
          audioText="ई-वेस्ट उठाते समय हमेशा दस्ताने पहनें।"
          onSpeak={speak}
        />
      </div>
    </div>
  );
}

function SafetyCard({ icon, title, subtitle, audioText, onSpeak }: any) {
  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div className="flex items-center">
        <div className="bg-gray-50 p-3 rounded-2xl mr-4">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <button 
        onClick={() => onSpeak(audioText)}
        className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 active:scale-95 transition"
      >
        <Volume2 className="w-6 h-6" />
      </button>
    </div>
  );
}
