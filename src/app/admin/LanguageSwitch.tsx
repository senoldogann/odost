'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setLanguage('fi')}
        className={`px-2 py-1 rounded ${
          language === 'fi'
            ? 'bg-gray-700 text-white'
            : 'text-gray-200 hover:bg-gray-700'
        }`}
      >
        FI
      </button>
      <button
        onClick={() => setLanguage('tr')}
        className={`px-2 py-1 rounded ${
          language === 'tr'
            ? 'bg-gray-700 text-white'
            : 'text-gray-200 hover:bg-gray-700'
        }`}
      >
        TR
      </button>
    </div>
  );
} 