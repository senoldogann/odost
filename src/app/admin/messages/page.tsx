'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { toast } from 'react-hot-toast';
import  prisma  from '@/lib/prisma';
import { Card, CardContent, Typography, Button, TextField, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useLanguage } from '@/context/LanguageContext';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'RAVINTOLA' | 'BAARI' | 'YLEINEN';
  status: 'PENDING' | 'RESOLVED' | 'ARCHIVED';
  createdAt: string;
}

export default function MessagesPage() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedType, setSelectedType] = useState<'ALL' | 'RAVINTOLA' | 'BAARI' | 'YLEINEN'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'PENDING' | 'RESOLVED' | 'ARCHIVED'>('ALL');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Mesajları getir
  useEffect(() => {
    fetchMessages();
  }, [selectedType, selectedStatus]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `/api/messages?type=${selectedType}&status=${selectedStatus}`
      );
      if (!response.ok) throw new Error('Mesajlar getirilemedi');
      const data = await response.json();
      setMessages(data);
      if (selectedMessage) {
        const updatedSelectedMessage = data.find((m: Message) => m.id === selectedMessage.id);
        setSelectedMessage(updatedSelectedMessage || null);
      }
    } catch (error) {
      toast.error('Mesajlar yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // Mesaj durumunu güncelle
  const handleStatusChange = async (id: string, status: Message['status']) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });

      if (!response.ok) throw new Error('Mesaj durumu güncellenemedi');

      setMessages(
        messages.map(message =>
          message.id === id ? { ...message, status } : message
        )
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
      toast.success('Mesaj durumu güncellendi');
    } catch (error) {
      toast.error('Mesaj durumu güncellenirken bir hata oluştu');
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !reply.trim()) {
      toast.error('Lütfen bir yanıt yazın');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/messages/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: selectedMessage.id,
          reply: reply.trim()
        })
      });

      if (!response.ok) throw new Error('Yanıt gönderilemedi');

      toast.success('Yanıt başarıyla gönderildi');
      setReply('');
      fetchMessages();
    } catch (error) {
      toast.error('Yanıt gönderilirken bir hata oluştu');
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status: Message['status']) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-green-500/20 text-green-300';
      case 'ARCHIVED':
        return 'bg-gray-500/20 text-gray-300';
      default:
        return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fi-FI');
  };

  const handleMessageSelect = (message: Message) => {
    setSelectedMessage(message);
    setReply(''); // Tyhjennä vastauskenttä kun uusi viesti valitaan
  };

  const handleReply = async () => {
    if (!selectedMessage || !reply.trim()) {
      setSnackbar({
        open: true,
        message: 'Valitse viesti ja kirjoita vastaus',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/messages/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: selectedMessage.id,
          reply: reply.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Vastauksen lähetys epäonnistui');
      }

      setSnackbar({
        open: true,
        message: 'Vastaus lähetetty onnistuneesti',
        severity: 'success'
      });
      
      // Päivitä viestilista
      await fetchMessages();
      
      // Tyhjennä vastauskenttä ja nollaa valittu viesti
      setReply('');
      setSelectedMessage(null);
    } catch (error) {
      console.error('Vastausvirhe:', error);
      setSnackbar({
        open: true,
        message: 'Vastauksen lähetys epäonnistui',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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
      <h1 className="text-3xl font-bold mb-8">{t('admin.messages.title')}</h1>

      {/* Filtreler */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">{t('admin.messages.type')}</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="ALL">Tümü</option>
            <option value="RAVINTOLA">{t('admin.messages.restaurant')}</option>
            <option value="BAARI">{t('admin.messages.bar')}</option>
            <option value="YLEINEN">Genel</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t('admin.messages.status')}</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="ALL">Tümü</option>
            <option value="PENDING">{t('admin.common.pending')}</option>
            <option value="RESOLVED">{t('admin.common.resolved')}</option>
            <option value="ARCHIVED">Arşivlenmiş</option>
          </select>
        </div>
      </div>

      {/* Mesajlar listesi ve detay görünümü */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mesajlar listesi */}
        <div className="bg-white/10 rounded-lg overflow-hidden">
          <div className="overflow-y-auto max-h-[600px]">
            {messages
              .filter(message => selectedType === 'ALL' || message.type === selectedType)
              .filter(message => selectedStatus === 'ALL' || message.status === selectedStatus)
              .map((message) => (
                <div
                  key={message.id}
                  onClick={() => handleMessageSelect(message)}
                  className={`p-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-white/5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium">{message.subject}</h3>
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(message.status)}`}>
                      {message.status === 'RESOLVED' && t('admin.common.resolved')}
                      {message.status === 'PENDING' && t('admin.common.pending')}
                      {message.status === 'ARCHIVED' && t('admin.common.archived')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{message.name}</p>
                  <p className="text-sm text-gray-400">{formatDate(message.createdAt)}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Mesaj detayı */}
        {selectedMessage ? (
          <div className="bg-white/10 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">{selectedMessage.subject}</h2>
              <div className="space-y-2 mb-4">
                <p>
                  <span className="text-gray-400">{t('admin.messages.sender')}:</span>{' '}
                  {selectedMessage.name}
                </p>
                <p>
                  <span className="text-gray-400">{t('admin.messages.email')}:</span>{' '}
                  {selectedMessage.email}
                </p>
                <p>
                  <span className="text-gray-400">{t('admin.messages.time')}:</span>{' '}
                  {formatDate(selectedMessage.createdAt)}
                </p>
                <p>
                  <span className="text-gray-400">{t('admin.messages.type')}:</span>{' '}
                  {selectedMessage.type}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              {/* Yanıt formu */}
              {selectedMessage.status === 'PENDING' && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold">{t('admin.messages.reply')}</h3>
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder={t('admin.messages.replyPlaceholder')}
                    className="w-full h-32 p-3 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleReply}
                      disabled={loading || !reply.trim()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? t('admin.messages.sending') : t('admin.messages.sendReply')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 rounded-lg p-6 flex items-center justify-center text-gray-400">
            {t('admin.messages.selectMessage')}
          </div>
        )}
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
} 