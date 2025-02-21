'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from "@/components/ui/button";

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [editItem, setEditItem] = useState<GalleryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    imageUrl: '',
    type: selectedType as 'RAVINTOLA' | 'BAARI'
  });

  // URL doğrulama
  const isValidImageUrl = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null;
  };

  // Galeri öğelerini getir
  useEffect(() => {
    fetchGalleryItems();
  }, [selectedType]);

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch(`/api/gallery?type=${selectedType}`);
      if (!response.ok) throw new Error('Gallerian hakeminen epäonnistui');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      toast.error('Gallerian hakeminen epäonnistui');
    } finally {
      setIsLoading(false);
    }
  };

  // Yeni öğe ekle
  const handleAddItem = async () => {
    if (!newItem.title || !newItem.imageUrl) {
      toast.error('Täytä kaikki pakolliset kentät');
      return;
    }

    if (!isValidImageUrl(newItem.imageUrl)) {
      toast.error('Virheellinen kuvan URL. Sallitut muodot: JPEG, JPG, PNG, WEBP');
      return;
    }

    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });

      if (!response.ok) throw new Error('Gallerian lisääminen epäonnistui');

      const addedItem = await response.json();
      setItems([addedItem, ...items]);
      setShowAddForm(false);
      setNewItem({
        title: '',
        description: '',
        imageUrl: '',
        type: selectedType
      });
      toast.success('Kuva lisätty onnistuneesti');
    } catch (error) {
      toast.error('Gallerian lisääminen epäonnistui');
    }
  };

  // Öğeyi güncelle
  const handleSaveEdit = async () => {
    if (!editItem) return;

    if (!editItem.title || !editItem.imageUrl) {
      toast.error('Täytä kaikki pakolliset kentät');
      return;
    }

    if (!isValidImageUrl(editItem.imageUrl)) {
      toast.error('Virheellinen kuvan URL. Sallitut muodot: JPEG, JPG, PNG, WEBP');
      return;
    }

    try {
      const response = await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editItem)
      });

      if (!response.ok) throw new Error('Gallerian päivittäminen epäonnistui');

      const updatedItem = await response.json();
      setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
      setEditItem(null);
      toast.success('Kuva päivitetty onnistuneesti');
    } catch (error) {
      toast.error('Gallerian päivittäminen epäonnistui');
    }
  };

  // Öğeyi sil
  const handleDeleteItem = async (id: string) => {
    if (!confirm('Haluatko varmasti poistaa tämän kuvan?')) return;

    try {
      const response = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Gallerian poistaminen epäonnistui');

      setItems(items.filter(item => item.id !== id));
      toast.success('Kuva poistettu onnistuneesti');
    } catch (error) {
      toast.error('Gallerian poistaminen epäonnistui');
    }
  };

  if (isLoading) {
    return (
      <div className="text-white text-center py-12">
        Ladataan...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Galleria</h1>
        <div className="flex items-center gap-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as 'RAVINTOLA' | 'BAARI')}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
          >
            <option value="RAVINTOLA">Ravintola</option>
            <option value="BAARI">Baari</option>
          </select>
          <Button onClick={() => setShowAddForm(true)}>Lisää uusi kuva</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="relative h-48">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              {item.description && (
                <p className="text-gray-300 text-sm mb-4">{item.description}</p>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditItem(item)}
                >
                  Muokkaa
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  Poista
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Düzenleme modalı */}
      {editItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-white">Muokkaa kuvaa</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Otsikko</label>
                <input
                  type="text"
                  value={editItem.title}
                  onChange={e => setEditItem({ ...editItem, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Kuvaus</label>
                <textarea
                  value={editItem.description || ''}
                  onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Kuvan URL</label>
                <input
                  type="text"
                  value={editItem.imageUrl}
                  onChange={e => setEditItem({ ...editItem, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-white"
                  placeholder="https://example.com/image.jpg"
                />
                {editItem.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={editItem.imageUrl}
                      alt="Esikatselu"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditItem(null)}>
                Peruuta
              </Button>
              <Button onClick={handleSaveEdit}>
                Tallenna
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Yeni ekleme modalı */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-white">Lisää uusi kuva</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Otsikko</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Kuvaus</label>
                <textarea
                  value={newItem.description}
                  onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Kuvan URL</label>
                <input
                  type="text"
                  value={newItem.imageUrl}
                  onChange={e => setNewItem({ ...newItem, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-white"
                  placeholder="https://example.com/image.jpg"
                />
                {newItem.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={newItem.imageUrl}
                      alt="Esikatselu"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Peruuta
              </Button>
              <Button onClick={handleAddItem}>
                Lisää
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 