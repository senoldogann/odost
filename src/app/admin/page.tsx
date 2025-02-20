'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface DashboardStats {
  todayReservations: number;
  pendingMessages: number;
  activeGiftCards: number
}

interface RecentActivity {
  id: string;
  time: string;
  event: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'RESOLVED';
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    todayReservations: 0,
    pendingMessages: 0,
    activeGiftCards: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Bugünün rezervasyonlarını getir
      const today = new Date().toISOString().split('T')[0];
      const reservationsRes = await fetch(`/api/reservations?date=${today}`);
      const reservations = await reservationsRes.json();

      // Bekleyen mesajları getir
      const messagesRes = await fetch('/api/messages?status=PENDING');
      const messages = await messagesRes.json();

      // Aktif hediye kartlarını getir
      const giftCardsRes = await fetch('/api/gift-cards');
      const giftCards = await giftCardsRes.json();
      const activeGiftCards = giftCards.filter((card: any) => card.isActive);

      // İstatistikleri güncelle
      setStats({
        todayReservations: reservations.length,
        pendingMessages: messages.length,
        activeGiftCards: activeGiftCards.length
      });

      // Son aktiviteleri oluştur
      const reservationActivities = reservations.map((res: any) => ({
        id: res.id,
        time: new Date(res.createdAt).toLocaleString(),
        event: `Yeni rezervasyon - ${res.user?.name || 'Bilinmiyor'} (${res.guests} kişi)`,
        status: res.status,
        type: 'reservation',
        timestamp: new Date(res.createdAt).getTime()
      }));

      const messageActivities = messages.map((msg: any) => ({
        id: msg.id,
        time: new Date(msg.createdAt).toLocaleString(),
        event: `Yeni mesaj - ${msg.name} - ${msg.subject}`,
        status: msg.status,
        type: 'message',
        timestamp: new Date(msg.createdAt).getTime()
      }));

      const giftCardActivities = giftCards
        .filter((card: any) => {
          const cardDate = new Date(card.createdAt);
          const today = new Date();
          return cardDate.toDateString() === today.toDateString();
        })
        .map((card: any) => ({
          id: card.id,
          time: new Date(card.createdAt).toLocaleString(),
          event: `Yeni hediye kartı - ${card.user.name} - ${card.amount}€`,
          status: card.isActive ? 'CONFIRMED' : 'CANCELLED',
          type: 'giftcard',
          timestamp: new Date(card.createdAt).getTime()
        }));

      // Tüm aktiviteleri birleştir ve sırala
      const allActivities = [...reservationActivities, ...messageActivities, ...giftCardActivities]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10); // Son 10 aktiviteyi göster

      setRecentActivities(allActivities);
      setIsLoading(false);
    } catch (error) {
      console.error(t('admin.common.error'), error);
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-500/20 text-green-300';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-300';
      case 'RESOLVED':
        return 'bg-blue-500/20 text-blue-300';
      default:
        return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return t('admin.common.confirmed');
      case 'CANCELLED':
        return t('admin.common.cancelled');
      case 'RESOLVED':
        return t('admin.common.resolved');
      default:
        return t('admin.common.pending');
    }
  };

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
      {/* Üst navigasyon */}
      <div className="fixed top-20 left-64 right-4 z-40 bg-black/50 backdrop-blur-sm rounded-lg">
        <nav className="flex items-center gap-6 p-4">
          <a
            href="#stats"
            onClick={(e) => handleNavigation(e, 'stats')}
            className="text-sm hover:text-gray-300 transition-colors"
          >
            {t('admin.dashboard.stats')}
          </a>
          <a
            href="#activities"
            onClick={(e) => handleNavigation(e, 'activities')}
            className="text-sm hover:text-gray-300 transition-colors"
          >
            {t('admin.dashboard.activities')}
          </a>
          <a
            href="#actions"
            onClick={(e) => handleNavigation(e, 'actions')}
            className="text-sm hover:text-gray-300 transition-colors"
          >
            {t('admin.dashboard.quickActions')}
          </a>
        </nav>
      </div>

      <h1 className="text-3xl font-bold mb-8 pt-16">{t('admin.dashboard.title')}</h1>

      {/* İstatistik kartları */}
      <div id="stats" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 scroll-mt-32">
        <div className="bg-white/10 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">{t('admin.dashboard.todayReservations')}</h3>
          <p className="text-3xl font-bold">{stats.todayReservations}</p>
        </div>

        <div className="bg-white/10 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">{t('admin.dashboard.pendingMessages')}</h3>
          <p className="text-3xl font-bold">{stats.pendingMessages}</p>
        </div>

        <div className="bg-white/10 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">{t('admin.dashboard.activeGiftCards')}</h3>
          <p className="text-3xl font-bold">{stats.activeGiftCards}</p>
        </div>
      </div>

      {/* Son aktiviteler */}
      <div id="activities" className="mt-8 scroll-mt-32">
        <h2 className="text-2xl font-bold mb-6">{t('admin.dashboard.recentActivities')}</h2>
        <div className="bg-white/10 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-3 text-left">{t('admin.dashboard.time')}</th>
                  <th className="px-6 py-3 text-left">{t('admin.dashboard.event')}</th>
                  <th className="px-6 py-3 text-left">{t('admin.dashboard.status')}</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity) => (
                  <tr key={activity.id} className="border-b border-white/10">
                    <td className="px-6 py-4">{activity.time}</td>
                    <td className="px-6 py-4">{activity.event}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(activity.status)}`}>
                        {getStatusText(activity.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Hızlı eylemler */}
      <div id="actions" className="mt-8 scroll-mt-32">
        <h2 className="text-2xl font-bold mb-6">{t('admin.dashboard.quickActions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/reservations" className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left">
            <h3 className="font-medium mb-1">{t('admin.dashboard.createReservation')}</h3>
            <p className="text-sm text-gray-400">{t('admin.dashboard.createReservationDesc')}</p>
          </Link>

          <Link href="/admin/menu" className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left">
            <h3 className="font-medium mb-1">{t('admin.dashboard.addMenuItem')}</h3>
            <p className="text-sm text-gray-400">{t('admin.dashboard.addMenuItemDesc')}</p>
          </Link>

          <Link href="/admin/gift-cards" className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left">
            <h3 className="font-medium mb-1">{t('admin.dashboard.createGiftCard')}</h3>
            <p className="text-sm text-gray-400">{t('admin.dashboard.createGiftCardDesc')}</p>
          </Link>

          <Link href="/admin/gallery" className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left">
            <h3 className="font-medium mb-1">{t('admin.dashboard.addGalleryImage')}</h3>
            <p className="text-sm text-gray-400">{t('admin.dashboard.addGalleryImageDesc')}</p>
          </Link>
        </div>
      </div>
    </div>
  );
} 