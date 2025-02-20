'use client';

import { useSearchParams } from 'next/navigation';

export default function MaintenancePage() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const message = searchParams.get('message');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="p-8 max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold mb-6 text-center">
          {type === 'RAVINTOLA' ? 'Ravintola' : 'Baari'} - Huoltotila
        </h1>
        
        <div className="space-y-6">
          <p className="text-lg text-white/80 text-center leading-relaxed">
            {message || 'Sivusto on tilapäisesti pois käytöstä huoltotöiden vuoksi. Pahoittelemme häiriötä.'}
          </p>

          <div className="flex justify-center">
            <a
              href="/"
              className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors duration-200"
            >
              Palaa etusivulle
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 