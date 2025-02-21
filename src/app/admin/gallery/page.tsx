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
      if (!response.ok) throw new Error('Gallerian hakeminen epäonnistui');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Gallerian hakuvirhe:', error);
      toast.error('Gallerian hakeminen epäonnistui');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem.imageUrl) {
      toast.error('Kuvan URL vaaditaan');
      return;
    }

    try {
      const url = '/api/gallery';
      const method = editingId ? 'PUT' : 'POST';
      const itemData = editingId ? { ...newItem, id: editingId } : newItem;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) throw new Error(editingId ? 'Päivitys epäonnistui' : 'Lisäys epäonnistui');

      toast.success(editingId ? 'Kuva päivitetty onnistuneesti' : 'Kuva lisätty onnistuneesti');
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
      console.error('Virhe:', error);
      toast.error(editingId ? 'Päivitys epäonnistui' : 'Lisäys epäonnistui');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Haluatko varmasti poistaa tämän kuvan?')) return;

    try {
      const response = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Poisto epäonnistui');

      toast.success('Kuva poistettu onnistuneesti');
      fetchGalleryItems();
    } catch (error) {
      console.error('Poistovirhe:', error);
      toast.error('Poisto epäonnistui');
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
    return <div className="p-4 text-white">Ladataan...</div>;
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-6">Galleria</h1>

      <div className="mb-6">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as 'RAVINTOLA' | 'BAARI')}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
        >
          <option value="RAVINTOLA" className="bg-black text-white">Ravintola</option>
          <option value="BAARI" className="bg-black text-white">Baari</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 border border-white/10 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {editingId ? 'Muokkaa kuvaa' : 'Lisää uusi kuva'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Otsikko</label>
            <input
              type="text"
              name="title"
              value={newItem.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">Kuvaus</label>
            <textarea
              name="description"
              value={newItem.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">Kuvan URL</label>
            <input
              type="text"
              name="imageUrl"
              value={newItem.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
            />
            <p className="mt-1 text-sm text-gray-400">
              Syötä kuvan URL-osoite (tuetut muodot: JPEG, JPG, PNG, WEBP)
            </p>
          </div>

          {newItem.imageUrl && (
            <div className="mt-2 relative h-40 w-40">
              <Image
                src={newItem.imageUrl}
                alt="Esikatselu"
                fill
                sizes="160px"
                className="object-cover rounded-lg"
                onError={() => {
                  setNewItem(prev => ({ ...prev, imageUrl: '' }));
                  toast.error('Virheellinen kuvan URL');
                }}
              />
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
            >
              {editingId ? 'Päivitä' : 'Lisää'}
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
                className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                Peruuta
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-black border border-white/10 rounded-lg overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={item.imageUrl || '/images/default-gallery.jpg'}
                alt={item.title || 'Galleriakuva'}
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
                  Muokkaa
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-4 py-2 bg-red-500/50 text-white rounded-full hover:bg-red-500/70 transition-colors"
                >
                  Poista
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 