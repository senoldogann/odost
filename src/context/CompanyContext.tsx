'use client';

import { createContext, useContext } from 'react';

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  yTunnus: string;
  privacyEmail: string;
  privacyPhone: string;
}

const companyInfo: CompanyInfo = {
  name: 'ODOST Ravintola & Baari',
  address: 'Mannerheimintie 123, 00100 Helsinki',
  phone: '+358 50 123 4567',
  email: 'info@odost.fi',
  yTunnus: '3296627-4',
  privacyEmail: 'privacy@odost.fi',
  privacyPhone: '+358 50 123 4567'
};

const CompanyContext = createContext<CompanyInfo>(companyInfo);

export const useCompany = () => useContext(CompanyContext);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  return (
    <CompanyContext.Provider value={companyInfo}>
      {children}
    </CompanyContext.Provider>
  );
}

export default CompanyContext; 