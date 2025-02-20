'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PDFDownloadLink } from '@react-pdf/renderer';
import GiftCardPDF from '@/components/GiftCardPDF';
import { useLanguage } from '@/context/LanguageContext';

interface GiftCard {
  id: string;
  code: string;
  amount: number;
  balance: number;
  isActive: boolean;
  qrCodeData: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function GiftCardsPage() {
  const { t } = useLanguage();
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({
    amount: 50,
    userName: '',
    userEmail: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Hediye kartlarını getir
  useEffect(() => {
    fetchGiftCards();
  }, []);

  const fetchGiftCards = async () => {
    try {
      const response = await fetch('/api/gift-cards');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('admin.giftCards.fetchError'));
      }
      const data = await response.json();
      setGiftCards(data);
    } catch (error) {
      console.error(t('admin.giftCards.fetchErrorLog'), error);
      toast.error(t('admin.giftCards.fetchErrorToast'));
    } finally {
      setIsLoading(false);
    }
  };

  // Form sıfırlama fonksiyonu
  const resetForm = () => {
    setNewCard({
      amount: 50,
      userName: '',
      userEmail: ''
    });
  };

  // Modal kapatma fonksiyonu
  const handleCloseModal = () => {
    setShowAddForm(false);
    resetForm();
  };

  // Yeni hediye kartı ekle
  const handleAddCard = async () => {
    if (!newCard.userName || !newCard.userEmail || newCard.amount <= 0) {
      toast.error(t('admin.giftCards.fillAllFields'));
      return;
    }

    try {
      const response = await fetch('/api/gift-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard)
      });

      if (!response.ok) throw new Error(t('admin.giftCards.addError'));

      const addedCard = await response.json();
      setGiftCards([...giftCards, addedCard]);
      handleCloseModal();
      toast.success(t('admin.giftCards.addSuccess'));
    } catch (error) {
      toast.error(t('admin.giftCards.addErrorToast'));
    }
  };

  // Hediye kartı durumunu güncelle
  const handleToggleActive = async (id: string) => {
    try {
      const card = giftCards.find(card => card.id === id);
      if (!card) return;

      const response = await fetch('/api/gift-cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...card, isActive: !card.isActive })
      });

      if (!response.ok) throw new Error(t('admin.giftCards.updateError'));

      setGiftCards(
        giftCards.map(card =>
          card.id === id ? { ...card, isActive: !card.isActive } : card
        )
      );
      toast.success(t('admin.giftCards.updateSuccess'));
    } catch (error) {
      toast.error(t('admin.giftCards.updateErrorToast'));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fi-FI');
  };

  const handleDownloadPDF = async (giftCard: GiftCard) => {
    try {
      const response = await fetch(`/api/gift-cards/pdf?id=${giftCard.id}`);
      if (!response.ok) throw new Error(t('admin.giftCards.pdfError'));
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lahjakortti-${giftCard.code}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(t('admin.giftCards.pdfErrorLog'), error);
      toast.error(t('admin.giftCards.pdfErrorToast'));
    }
  };

  if (isLoading) {
    return (
      <div className="text-white text-center py-12">
        {t('admin.common.loading')}
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('admin.giftCards.title')}</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
        >
          {t('admin.giftCards.newGiftCard')}
        </button>
      </div>

      {/* Hediye kartları listesi */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full text-white whitespace-nowrap">
          <thead>
            <tr className="bg-gray-900/50">
              <th className="px-3 py-3 text-left">{t('admin.giftCards.code')}</th>
              <th className="px-3 py-3 text-left">{t('admin.giftCards.issuedTo')}</th>
              <th className="px-3 py-3 text-left w-24">{t('admin.giftCards.amount')} (€)</th>
              <th className="px-3 py-3 text-left w-24">{t('admin.giftCards.balance')} (€)</th>
              <th className="px-3 py-3 text-left w-32">{t('admin.giftCards.createdAt')}</th>
              <th className="px-3 py-3 text-left w-24">{t('admin.giftCards.status')}</th>
              <th className="px-3 py-3 text-left w-32">{t('admin.giftCards.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {giftCards.map((card, index) => (
              <tr key={card.id} className={`border-t border-white/10 hover:bg-white/5 ${
                index % 2 === 0 ? '' : 'bg-white/5'
              }`}>
                <td className="px-3 py-2 font-mono">{card.code}</td>
                <td className="px-3 py-2">{card.user.name}</td>
                <td className="px-3 py-2">{card.amount.toFixed(2)}</td>
                <td className="px-3 py-2">{card.balance.toFixed(2)}</td>
                <td className="px-3 py-2">{formatDate(card.createdAt)}</td>
                <td className="px-3 py-2">
                  <span className={`px-3 py-1.5 rounded text-sm ${
                    card.isActive
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {card.isActive ? t('admin.giftCards.active') : t('admin.giftCards.inactive')}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownloadPDF(card)}
                      className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded text-sm hover:bg-blue-500/30"
                    >
                      {t('admin.giftCards.downloadPDF')}
                    </button>
                    <button
                      onClick={() => handleToggleActive(card.id)}
                      className={`px-3 py-1.5 rounded text-sm ${
                        card.isActive 
                          ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                          : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                      }`}
                    >
                      {card.isActive ? t('admin.giftCards.deactivate') : t('admin.giftCards.activate')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Yeni hediye kartı oluşturma formu */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">{t('admin.giftCards.newGiftCard')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('admin.giftCards.customerName')}
                </label>
                <input
                  type="text"
                  value={newCard.userName || ''}
                  onChange={(e) =>
                    setNewCard({ ...newCard, userName: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('admin.giftCards.customerEmail')}
                </label>
                <input
                  type="email"
                  value={newCard.userEmail || ''}
                  onChange={(e) =>
                    setNewCard({ ...newCard, userEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('admin.giftCards.amount')} (€)
                </label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={newCard.amount || 50}
                  onChange={(e) =>
                    setNewCard({ ...newCard, amount: parseInt(e.target.value) || 50 })
                  }
                  className="w-full px-3 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleAddCard}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('admin.giftCards.create')}
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                {t('admin.common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 