'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  type: 'RAVINTOLA' | 'BAARI';
  isActive: boolean;
}

export default function GalleryManagement() {
  const { t } = useLanguage();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'RAVINTOLA' | 'BAARI'>('RAVINTOLA');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newImage, setNewImage] = useState({
    title: '',
    description: '',
    imageUrl: '',
    type: 'RAVINTOLA' as 'RAVINTOLA' | 'BAARI',
    isActive: true
  });

  useEffect(() => {
    fetchImages();
  }, [selectedType]);

  useEffect(() => {
    setNewImage(prev => ({ ...prev, type: selectedType }));
  }, [selectedType]);

  const fetchImages = async () => {
    try {
      const response = await fetch(`/api/gallery?type=${selectedType}`);
      if (!response.ok) throw new Error(t('admin.gallery.fetchError'));
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error(t('admin.gallery.fetchErrorLog'), error);
      toast.error(t('admin.gallery.fetchErrorToast'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(t('admin.gallery.imageUploadError'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('admin.gallery.imageUploadError'));
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(t('admin.gallery.imageUploadError'));
      
      const data = await response.json();
      if (!data.url) throw new Error(t('admin.gallery.imageUploadError'));
      
      setNewImage(prev => ({ ...prev, imageUrl: data.url }));
      toast.success(t('admin.gallery.imageUploadSuccess'));
    } catch (error) {
      console.error(t('admin.gallery.imageUploadError'), error);
      toast.error(t('admin.gallery.imageUploadError'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newImage.imageUrl) {
      toast.error(t('admin.gallery.imageUploadError'));
      return;
    }

    try {
      const url = '/api/gallery';
      const method = editingId ? 'PUT' : 'POST';
      const imageData = editingId ? { ...newImage, id: editingId } : newImage;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageData),
      });

      if (!response.ok) throw new Error(editingId ? t('admin.gallery.updateError') : t('admin.gallery.addError'));

      toast.success(editingId ? t('admin.gallery.updateSuccess') : t('admin.gallery.addSuccess'));
      setNewImage({
        title: '',
        description: '',
        imageUrl: '',
        type: selectedType,
        isActive: true
      });
      setEditingId(null);
      fetchImages();
    } catch (error) {
      console.error(editingId ? t('admin.gallery.updateErrorLog') : t('admin.gallery.addErrorLog'), error);
      toast.error(editingId ? t('admin.gallery.updateErrorToast') : t('admin.gallery.addErrorToast'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.gallery.confirmDelete'))) return;

    try {
      const response = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(t('admin.gallery.deleteError'));

      toast.success(t('admin.gallery.deleteSuccess'));
      fetchImages();
    } catch (error) {
      console.error(t('admin.gallery.deleteErrorLog'), error);
      toast.error(t('admin.gallery.deleteErrorToast'));
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingId(image.id);
    setNewImage({
      title: image.title || '',
      description: image.description || '',
      imageUrl: image.imageUrl || '',
      type: image.type,
      isActive: image.isActive
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewImage(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return <div className="p-4 text-white">{t('admin.common.loading')}</div>;
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

      <form onSubmit={handleSubmit} className="mb-8 border border-white/10 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {editingId ? t('admin.gallery.editImage') : t('admin.gallery.addNewImage')}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white">{t('admin.gallery.imageTitle')}</label>
            <input
              type="text"
              name="title"
              value={newImage.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">{t('admin.gallery.description')}</label>
            <textarea
              name="description"
              value={newImage.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">{t('admin.gallery.uploadImage')}</label>
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
            />
            <p className="mt-1 text-sm text-gray-400">
              {t('admin.gallery.dragAndDrop')}
            </p>
          </div>

          {newImage.imageUrl && (
            <div className="mt-2 relative h-40 w-40">
              <Image
                src={newImage.imageUrl}
                alt={t('admin.gallery.imageTitle')}
                fill
                sizes="160px"
                className="object-cover rounded-lg"
                onError={() => {
                  setNewImage(prev => ({ ...prev, imageUrl: '/images/default-gallery.jpg' }));
                  toast.error(t('admin.gallery.imageUploadError'));
                }}
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
                  setNewImage({
                    title: '',
                    description: '',
                    imageUrl: '',
                    type: selectedType,
                    isActive: true
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-black border border-white/10 rounded-lg overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={image.imageUrl || '/images/default-gallery.jpg'}
                alt={image.title || t('admin.gallery.imageTitle')}
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
              <h3 className="text-xl font-semibold mb-2 text-white">{image.title}</h3>
              {image.description && (
                <p className="text-gray-300 mb-4">{image.description}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(image)}
                  className="px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  {t('admin.common.edit')}
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
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