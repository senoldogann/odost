'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fi } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

interface Reservation {
  id: string;
  user: {
    name: string;
    email: string;
  };
  date: string;
  time: string;
  guests: number;
  type: 'RAVINTOLA' | 'BAARI';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  notes?: string;
}

export default function ReservationsPage() {
  const { t } = useLanguage();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedType, setSelectedType] = useState<'RAVINTOLA' | 'BAARI'>('RAVINTOLA');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<{ note: string; customerName: string } | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'CANCELLED'>('ALL');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);

  // Rezervasyonları getir
  useEffect(() => {
    fetchReservations();
  }, [selectedType]);

  const fetchReservations = async () => {
    try {
      const response = await fetch(
        `/api/reservations?type=${selectedType}`
      );
      if (!response.ok) throw new Error(t('admin.common.error'));
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      toast.error(t('admin.common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Durum değiştirme modalını kapatma
  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    setSelectedReservation(null);
  };

  // Durum değiştirme işlemi
  const handleStatusChange = async (id: string, newStatus: Reservation['status']) => {
    try {
      const response = await fetch('/api/reservations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (!response.ok) throw new Error(t('admin.common.error'));

      setReservations(
        reservations.map(reservation =>
          reservation.id === id ? { ...reservation, status: newStatus } : reservation
        )
      );
      handleCloseStatusModal();
      toast.success(t('admin.common.success'));
    } catch (error) {
      toast.error(t('admin.common.error'));
    }
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-500/20 text-green-300';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd.MM.yyyy');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>;
  }

  const filteredReservations = selectedStatus === 'ALL' 
    ? reservations.filter(res => res.status !== 'CANCELLED')
    : reservations.filter(res => res.status === 'CANCELLED');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">{t('admin.reservations.title')}</h1>
        
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setSelectedStatus('ALL')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedStatus === 'ALL'
                ? 'bg-white text-black'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {t('admin.reservations.active')}
          </button>
          <button
            onClick={() => setSelectedStatus('CANCELLED')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedStatus === 'CANCELLED'
                ? 'bg-white text-black'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {t('admin.reservations.cancelled')}
          </button>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-x-auto">
        <div className="min-w-[1200px]">
          <table className="w-full text-white">
            <thead>
              <tr className="bg-gray-900/50">
                <th className="px-3 py-3 text-left">{t('admin.reservations.customerName')}</th>
                <th className="px-3 py-3 text-left">{t('admin.reservations.email')}</th>
                <th className="px-3 py-3 text-left w-24">{t('admin.reservations.date')}</th>
                <th className="px-3 py-3 text-left w-20">{t('admin.reservations.time')}</th>
                <th className="px-3 py-3 text-left w-20">{t('admin.reservations.guests')}</th>
                <th className="px-3 py-3 text-left w-24">{t('admin.reservations.type')}</th>
                <th className="px-3 py-3 text-left w-28">{t('admin.reservations.status')}</th>
                <th className="px-3 py-3 text-left w-24">{t('admin.reservations.notes')}</th>
                <th className="px-3 py-3 text-left w-32">{t('admin.common.edit')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((reservation, index) => (
                <tr key={reservation.id} className={`border-t border-white/10 hover:bg-white/5 ${
                  index % 2 === 0 ? '' : 'bg-white/5'
                }`}>
                  <td className="px-3 py-2">{reservation.user.name}</td>
                  <td className="px-3 py-2">{reservation.user.email}</td>
                  <td className="px-3 py-2">{formatDate(reservation.date)}</td>
                  <td className="px-3 py-2">{reservation.time}</td>
                  <td className="px-3 py-2">{reservation.guests}</td>
                  <td className="px-3 py-2">{reservation.type}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(reservation.status)}`}>
                      {t(`admin.reservations.${reservation.status.toLowerCase()}`)}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {reservation.notes && (
                      <button
                        onClick={() => setSelectedNote({
                          note: reservation.notes || '',
                          customerName: reservation.user.name
                        })}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        {t('admin.reservations.showNotes')}
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {reservation.status !== 'CANCELLED' && (
                      <div className="flex gap-2">
                        {reservation.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'CONFIRMED')}
                            className="px-3 py-1.5 bg-green-500/20 text-green-300 rounded text-xs hover:bg-green-500/30"
                          >
                            {t('admin.reservations.confirm')}
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusChange(reservation.id, 'CANCELLED')}
                          className="px-3 py-1.5 bg-red-500/20 text-red-300 rounded text-xs hover:bg-red-500/30"
                        >
                          {t('admin.reservations.cancel')}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Not görüntüleme modalı */}
      {selectedNote && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedNote(null)}
        >
          <div 
            className="bg-gray-800 p-6 rounded-lg max-w-lg w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-1 text-white">{t('admin.reservations.customerNotes')}</h3>
                <p className="text-gray-400">{selectedNote.customerName}</p>
              </div>
              <button 
                onClick={() => setSelectedNote(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-white whitespace-pre-wrap">{selectedNote.note}</p>
          </div>
        </div>
      )}
    </div>
  );
} 