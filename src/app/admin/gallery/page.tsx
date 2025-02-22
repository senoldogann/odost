'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  type: 'RAVINTOLA' | 'BAARI';
  isActive: boolean;
}

export default function GalleryManagement() {
  const { t } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedType, setSelectedType] = useState<'RAVINTOLA' | 'BAARI'>('RAVINTOLA');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    imageUrl: '',
    type: selectedType as 'RAVINTOLA' | 'BAARI',
    isActive: true
  });

  // URL doğrulama
  const isValidImageUrl = (url: string) => {
    const trimmedUrl = url.trim();
    return trimmedUrl !== '' && (
      trimmedUrl.startsWith('http://') || 
      trimmedUrl.startsWith('https://') || 
      trimmedUrl.startsWith('/')
    );
  };

  useEffect(() => {
    fetchGalleryItems();
  }, [selectedType]);

  useEffect(() => {
    setNewItem(prev => ({ ...prev, type: selectedType }));
  }, [selectedType]);

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch(`/api/gallery?type=${selectedType}`);
      if (!response.ok) throw new Error(t('admin.gallery.fetchError'));
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error(t('admin.gallery.fetchErrorToast'), error);
      toast.error(t('admin.gallery.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.title || !newItem.imageUrl) {
      toast.error(t('admin.common.error'));
      return;
    }

    if (!isValidImageUrl(newItem.imageUrl)) {
      toast.error(t('admin.gallery.invalidImageUrl'));
      return;
    }

    try {
      const response = await fetch('/api/gallery', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...newItem, id: editingId } : newItem),
      });

      if (!response.ok) {
        throw new Error(editingId ? t('admin.gallery.updateError') : t('admin.gallery.addError'));
      }

      toast.success(editingId ? t('admin.gallery.updateSuccess') : t('admin.gallery.addSuccess'));
      setNewItem({
        title: '',
        description: '',
        imageUrl: '',
        type: selectedType,
        isActive: true
      });
      setEditingId(null);
      fetchGalleryItems();
    } catch (error) {
      console.error(error);
      toast.error(editingId ? t('admin.gallery.updateError') : t('admin.gallery.addError'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.gallery.confirmDelete'))) return;

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(t('admin.gallery.deleteError'));

      toast.success(t('admin.gallery.deleteSuccess'));
      fetchGalleryItems();
    } catch (error) {
      console.error(error);
      toast.error(t('admin.gallery.deleteError'));
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setNewItem({
      title: item.title || '',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      type: item.type,
      isActive: item.isActive
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return <div className="p-4 text-white">{t('admin.gallery.loading')}</div>;
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-6">{t('admin.gallery.title')}</h1>

      <div className="mb-6">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as 'RAVINTOLA' | 'BAARI')}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
        >
          <option value="RAVINTOLA" className="bg-black text-white">{t('admin.gallery.restaurant')}</option>
          <option value="BAARI" className="bg-black text-white">{t('admin.gallery.bar')}</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 bg-white/5 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? t('admin.gallery.editImage') : t('admin.gallery.addNewImage')}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('admin.gallery.imageTitle')}</label>
            <input
              type="text"
              name="title"
              value={newItem.title}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('admin.gallery.description')}</label>
            <textarea
              name="description"
              value={newItem.description}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('admin.gallery.imageUrl')}</label>
            <input
              type="text"
              name="imageUrl"
              value={newItem.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={newItem.isActive}
              onChange={(e) => setNewItem(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm">{t('admin.gallery.active')}</label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingId ? t('admin.common.save') : t('admin.common.add')}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setNewItem({
                    title: '',
                    description: '',
                    imageUrl: '',
                    type: selectedType,
                    isActive: true
                  });
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {t('admin.common.cancel')}
              </button>
            )}
          </div>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-4">{t('admin.gallery.currentImages')}</h2>

      {items.length === 0 ? (
        <p className="text-gray-400">{t('admin.gallery.noImages')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-black border border-white/10 rounded-lg overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={item.imageUrl || '/images/default-gallery.jpg'}
                  alt={item.title || t('admin.gallery.imagePreview')}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/default-gallery.jpg';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                {item.description && (
                  <p className="text-gray-300 mb-4">{item.description}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                  >
                    {t('admin.gallery.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 bg-red-500/50 text-white rounded-full hover:bg-red-500/70 transition-colors"
                  >
                    {t('admin.gallery.delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 