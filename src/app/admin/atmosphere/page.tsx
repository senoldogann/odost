'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface AtmosphereEvent {
  id: string;
  title: string;
  description: string;
  schedule: string;
  type: 'RAVINTOLA' | 'BAARI';
  isActive: boolean;
  order: number;
  imageUrl?: string;
}

// URL'nin geçerli olup olmadığını kontrol eden yardımcı fonksiyon
const isValidImageUrl = (url: string | undefined): url is string => {
  if (!url) return false;
  const trimmedUrl = url.trim();
  return trimmedUrl !== '' && (
    trimmedUrl.startsWith('http://') || 
    trimmedUrl.startsWith('https://') || 
    trimmedUrl.startsWith('/')
  );
};

export default function AtmosphereManagement() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<AtmosphereEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'RAVINTOLA' | 'BAARI'>('RAVINTOLA');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    schedule: '',
    imageUrl: '',
    type: 'RAVINTOLA' as 'RAVINTOLA' | 'BAARI',
    isActive: true,
    order: 0
  });

  const defaultImage = '/images/default-atmosphere.jpg';

  useEffect(() => {
    fetchEvents();
  }, [selectedType]);

  useEffect(() => {
    // Seçilen tip değiştiğinde newEvent'in type'ını güncelle
    setNewEvent(prev => ({ ...prev, type: selectedType }));
  }, [selectedType]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`/api/atmosphere?type=${selectedType}`);
      if (!response.ok) throw new Error(t('admin.atmosphere.fetchError'));
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error(t('admin.atmosphere.fetchErrorLog'), error);
      toast.error(t('admin.atmosphere.fetchErrorToast'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(t('admin.atmosphere.imageUploadError'));
      
      const data = await response.json();
      if (!data.url) throw new Error(t('admin.atmosphere.imageUploadError'));
      
      setNewEvent(prev => ({ ...prev, imageUrl: data.url }));
      toast.success(t('admin.atmosphere.imageUploadSuccess'));
    } catch (error) {
      console.error(t('admin.atmosphere.imageUploadError'), error);
      toast.error(t('admin.atmosphere.imageUploadError'));
    }
  };

  // URL ile resim ekleme fonksiyonu
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setNewEvent(prev => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/atmosphere';
      const method = editingId ? 'PUT' : 'POST';
      const eventData = editingId ? { ...newEvent, id: editingId } : newEvent;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error(t('admin.atmosphere.updateError'));

      toast.success(editingId ? t('admin.atmosphere.updateSuccess') : t('admin.atmosphere.addSuccess'));
      setNewEvent({
        title: '',
        description: '',
        schedule: '',
        imageUrl: '',
        type: selectedType,
        isActive: true,
        order: 0
      });
      setEditingId(null);
      fetchEvents();
    } catch (error) {
      console.error(t('admin.atmosphere.updateErrorLog'), error);
      toast.error(t('admin.atmosphere.updateErrorToast'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.atmosphere.confirmDelete'))) return;

    try {
      const response = await fetch(`/api/atmosphere?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(t('admin.atmosphere.deleteError'));

      toast.success(t('admin.atmosphere.deleteSuccess'));
      fetchEvents();
    } catch (error) {
      console.error(t('admin.atmosphere.deleteErrorLog'), error);
      toast.error(t('admin.atmosphere.deleteErrorToast'));
    }
  };

  const handleEdit = (event: AtmosphereEvent) => {
    setEditingId(event.id);
    setNewEvent({
      title: event.title || '',
      description: event.description || '',
      schedule: event.schedule || '',
      imageUrl: event.imageUrl || '',
      type: event.type,
      isActive: event.isActive,
      order: event.order || 0
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Order alanı için özel işlem
    if (name === 'order') {
      const numValue = parseInt(value) || 0;
      setNewEvent(prev => ({ ...prev, [name]: numValue }));
      return;
    }

    // Diğer alanlar için normal işlem
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  // isActive değişimi için yeni fonksiyon
  const handleIsActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEvent(prev => ({ ...prev, isActive: e.target.checked }));
  };

  if (isLoading) {
    return <div className="p-4">{t('admin.common.loading')}</div>;
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-6">{t('admin.atmosphere.title')}</h1>

      {/* Tyyppi valinta */}
      <div className="mb-6">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as 'RAVINTOLA' | 'BAARI')}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
        >
          <option value="RAVINTOLA" className="bg-black text-white">{t('admin.atmosphere.restaurant')}</option>
          <option value="BAARI" className="bg-black text-white">{t('admin.atmosphere.bar')}</option>
        </select>
      </div>

      {/* Tapahtuman lisäys/muokkaus formu */}
      <form onSubmit={handleSubmit} className="mb-8 border border-white/10 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {editingId ? t('admin.atmosphere.editEvent') : t('admin.atmosphere.addNewEvent')}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white">{t('admin.atmosphere.eventTitle')}</label>
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">{t('admin.atmosphere.description')}</label>
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">{t('admin.atmosphere.schedule')}</label>
            <input
              type="text"
              name="schedule"
              value={newEvent.schedule}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">{t('admin.atmosphere.order')}</label>
            <input
              type="number"
              name="order"
              value={newEvent.order.toString()}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={newEvent.isActive}
              onChange={handleIsActiveChange}
              className="w-4 h-4 rounded border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-white/20"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-white">
              {t('admin.atmosphere.active')}
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">{t('admin.atmosphere.imageUrl')}</label>
            <input
              type="text"
              name="imageUrl"
              value={newEvent.imageUrl}
              onChange={handleImageUrlChange}
              placeholder={t('admin.atmosphere.imageUrlPlaceholder')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">{t('admin.atmosphere.uploadImage')}</label>
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
            />
          </div>

          {isValidImageUrl(newEvent.imageUrl) && (
            <div className="mt-2 relative h-40 w-40">
              <Image
                src={newEvent.imageUrl}
                alt={t('admin.atmosphere.eventImage')}
                fill
                sizes="160px"
                className="object-cover rounded-lg"
              />
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
            >
              {editingId ? t('admin.common.update') : t('admin.common.add')}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setNewEvent({
                    title: '',
                    description: '',
                    schedule: '',
                    imageUrl: '',
                    type: selectedType,
                    isActive: true,
                    order: 0
                  });
                }}
                className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                {t('admin.common.cancel')}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Tapahtumalista */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-black border border-white/10 rounded-lg overflow-hidden">
            {isValidImageUrl(event.imageUrl) && (
              <div className="relative h-48 w-full">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-white">{event.title}</h3>
              <p className="text-gray-300 mb-4">{event.description}</p>
              <p className="text-sm text-gray-400 mb-4">{t('admin.atmosphere.scheduleLabel')}: {event.schedule}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  {t('admin.common.edit')}
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="px-4 py-2 bg-red-500/50 text-white rounded-full hover:bg-red-500/70 transition-colors"
                >
                  {t('admin.common.delete')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 