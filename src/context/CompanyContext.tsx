'use client';

import { createContext, useContext } from 'react';

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  yTunnus: string; // Finlandiya vergi numarası
  openingHours: {
    weekdays: string;
    weekend: string;
    holidays: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
  };
}

const companyInfo: CompanyInfo = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || "ODOST Ravintola & Baari",
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "Mannerheimintie 100, 00100 Helsinki",
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "+358 50 123 4567",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "info@odost.fi",
  yTunnus: process.env.NEXT_PUBLIC_COMPANY_Y_TUNNUS || "3296627-4",
  openingHours: {
    weekdays: process.env.NEXT_PUBLIC_COMPANY_HOURS_WEEKDAYS || "11:00 - 22:00",
    weekend: process.env.NEXT_PUBLIC_COMPANY_HOURS_WEEKEND || "12:00 - 23:00",
    holidays: process.env.NEXT_PUBLIC_COMPANY_HOURS_HOLIDAYS || "12:00 - 21:00"
  },
  socialMedia: {
    facebook: process.env.NEXT_PUBLIC_COMPANY_FACEBOOK || "https://facebook.com/odostravintola",
    instagram: process.env.NEXT_PUBLIC_COMPANY_INSTAGRAM || "https://instagram.com/odostravintola"
  }
};

const CompanyContext = createContext<CompanyInfo>(companyInfo);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  return (
    <CompanyContext.Provider value={companyInfo}>
      {children}
    </CompanyContext.Provider>
  );
}

export default CompanyContext; 