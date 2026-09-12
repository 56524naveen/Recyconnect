import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../locales/translations';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="absolute top-4 right-4 flex items-center bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm z-50">
      <Globe className="w-4 h-4 text-gray-500 mr-2" />
      <select 
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer appearance-none pr-4"
        style={{ backgroundImage: 'none' }} // simple appearance
      >
        <option value="en">English</option>
        <option value="hi">हिंदी (Hindi)</option>
        <option value="mr">मराठी (Marathi)</option>
        <option value="ur">اردو (Urdu)</option>
        <option value="ta">தமிழ் (Tamil)</option>
      </select>
    </div>
  );
}
