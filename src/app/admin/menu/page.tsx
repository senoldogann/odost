'use client';

import { useState, useEffect } from 'react';
import type { MenuItem } from '@/types/menu';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

import { Button } from "@/components/ui/button";

import { useLanguage } from '@/context/LanguageContext';

// Örnek menü öğeleri

export default function MenuManagement() {
  const { t } = useLanguage();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedType, setSelectedType] = useState<'RAVINTOLA' | 'BAARI'>('RAVINTOLA');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    type: selectedType as 'RAVINTOLA' | 'BAARI'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Menü öğelerini getir
  useEffect(() => {
    fetchMenuItems();
  }, [selectedType]);

  useEffect(() => {
    setNewItem(prev => ({ ...prev, type: selectedType }));
  }, [selectedType]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`/api/menu?type=${selectedType}`);
      if (!response.ok) throw new Error(t('admin.menu.fetchError'));
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      toast.error(t('admin.menu.fetchErrorToast'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Kuvan lataaminen epäonnistui');

        const data = await response.json();
        if (editItem) {
          setEditItem({ ...editItem, image: data.url });
        }
        toast.success('Kuva ladattu onnistuneesti');
      } catch (error) {
        toast.error('Kuvan lataaminen epäonnistui');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  // Yeni ürün ekleme
  const handleAddItem = async () => {
    if (!newItem.name || !newItem.description || !newItem.price || !newItem.category) {
      toast.error('Täytä kaikki pakolliset kentät');
      return;
    }

    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });

      if (!response.ok) throw new Error('Menükohdetta ei voitu lisätä');

      const addedItem = await response.json();
      setMenuItems([...menuItems, addedItem]);
      setShowAddForm(false);
      setNewItem({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        type: selectedType
      });
      toast.success('Menükohde lisätty onnistuneesti');
    } catch (error) {
      toast.error('Virhe lisättäessä menükohdetta');
    }
  };

  // Menü öğesi durumunu güncelle
  const handleToggleActive = async (id: string) => {
    try {
      const item = menuItems.find(item => item.id === id);
      if (!item) return;

      const response = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !item.isActive })
      });

      if (!response.ok) throw new Error(t('admin.menu.updateError'));

      setMenuItems(
        menuItems.map(item =>
          item.id === id ? { ...item, isActive: !item.isActive } : item
        )
      );
      toast.success(t('admin.menu.updateSuccess'));
    } catch (error) {
      toast.error(t('admin.menu.updateError'));
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const item = menuItems.find(item => item.id === id);
      if (!item) return;

      const response = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !item.isFeatured })
      });

      if (!response.ok) throw new Error(t('admin.menu.updateError'));

      setMenuItems(
        menuItems.map(item =>
          item.id === id ? { ...item, isFeatured: !item.isFeatured } : item
        )
      );
      toast.success(t('admin.menu.updateSuccess'));
    } catch (error) {
      toast.error(t('admin.menu.updateError'));
    }
  };

  // Menü öğesini sil
  const handleDeleteItem = async (id: string) => {
    if (!confirm(t('admin.menu.confirmDelete'))) return;

    try {
      const response = await fetch(`/api/menu?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error(t('admin.menu.deleteError'));

      setMenuItems(menuItems.filter(item => item.id !== id));
      toast.success(t('admin.menu.deleteSuccess'));
    } catch (error) {
      toast.error(t('admin.menu.deleteError'));
    }
  };

  const handleSaveEdit = async () => {
    if (!editItem) return;

    try {
      const response = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editItem)
      });

      if (!response.ok) throw new Error(t('admin.menu.updateError'));

      setMenuItems(menuItems.map(item =>
        item.id === editItem.id ? editItem : item
      ));
      setEditItem(null);
      toast.success(t('admin.menu.updateSuccess'));
    } catch (error) {
      toast.error(t('admin.menu.updateError'));
    }
  };

  const filteredItems = menuItems.filter(item => item.type === selectedType);

  if (isLoading) {
    return (
      <div className="text-white text-center py-12">
        {t('admin.menu.loading')}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">{t('admin.menu.title')}</h1>
        <div className="flex items-center gap-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as 'RAVINTOLA' | 'BAARI')}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
          >
            <option value="RAVINTOLA">{t('admin.menu.restaurant')}</option>
            <option value="BAARI">{t('admin.menu.bar')}</option>
          </select>
          <Button onClick={() => setShowAddForm(true)}>{t('admin.menu.addNewItem')}</Button>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="bg-gray-900/50">
                <th className="px-2 py-2 text-left">{t('admin.menu.image')}</th>
                <th className="px-2 py-2 text-left">{t('admin.menu.name')}</th>
                <th className="px-2 py-2 text-left hidden md:table-cell">{t('admin.menu.description')}</th>
                <th className="px-2 py-2 text-left hidden sm:table-cell">{t('admin.menu.category')}</th>
                <th className="px-2 py-2 text-right">{t('admin.menu.price')}</th>
                <th className="px-2 py-2 text-center">
                  <span className="hidden sm:inline">{t('admin.menu.active')}</span>
                  <span className="sm:hidden">Akt.</span>
                </th>
                <th className="px-2 py-2 text-center">
                  <span className="hidden sm:inline">{t('admin.menu.featured')}</span>
                  <span className="sm:hidden">Kor.</span>
                </th>
                <th className="px-2 py-2">{t('admin.menu.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {menuItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-700/30">
                  <td className="px-2 py-2">
                    <div className="relative h-12 w-12">
                      <Image
                        src={item.image || '/placeholder.png'}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                        unoptimized
                      />
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="max-w-[150px] truncate">{item.name}</div>
                  </td>
                  <td className="px-2 py-2 hidden md:table-cell">
                    <div className="max-w-[200px] truncate">{item.description}</div>
                  </td>
                  <td className="px-2 py-2 hidden sm:table-cell">
                    <div className="max-w-[100px] truncate">{item.category}</div>
                  </td>
                  <td className="px-2 py-2 text-right">{item.price}</td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => handleToggleActive(item.id)}
                      className={`px-2 py-1 rounded text-sm ${
                        item.isActive
                          ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                          : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                      }`}
                    >
                      {item.isActive ? t('admin.menu.active') : t('admin.common.inactive')}
                    </button>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => handleToggleFeatured(item.id)}
                      className={`px-2 py-1 rounded text-sm ${
                        item.isFeatured
                          ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'
                          : 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
                      }`}
                    >
                      {item.isFeatured ? t('admin.menu.featured') : t('admin.menu.featured')}
                    </button>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditItem(item)}
                        className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                      >
                        <span className="hidden sm:inline">{t('admin.menu.edit')}</span>
                        <span className="sm:hidden">✎</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <span className="hidden sm:inline">{t('admin.menu.delete')}</span>
                        <span className="sm:hidden">✕</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Muokkaus-modaali */}
      {editItem && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full my-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6 sticky top-0 bg-gray-900 pt-2 z-10">
              <h3 className="text-xl font-semibold text-white">{t('admin.menu.editItem')}</h3>
              <button onClick={() => setEditItem(null)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">{t('admin.menu.name')}</label>
                <input
                  type="text"
                  value={editItem.name}
                  onChange={e => setEditItem({ ...editItem, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white">{t('admin.menu.description')}</label>
                <textarea
                  value={editItem.description}
                  onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white">{t('admin.menu.price')} (€)</label>
                <input
                  type="number"
                  value={editItem.price}
                  onChange={e => setEditItem({ ...editItem, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-white"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white">{t('admin.menu.category')}</label>
                <input
                  type="text"
                  value={editItem.category}
                  onChange={e => setEditItem({ ...editItem, category: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white">Tyyppi</label>
                <select
                  value={editItem.type}
                  onChange={e => setEditItem({ ...editItem, type: e.target.value as 'RAVINTOLA' | 'BAARI' })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-white"
                >
                  <option value="RAVINTOLA">Ravintola</option>
                  <option value="BAARI">Baari</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white">Kuvan URL</label>
                <input
                  type="text"
                  value={editItem.image || ''}
                  onChange={e => setEditItem({ ...editItem, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-white"
                />
                {editItem.image && (
                  <div className="mt-2">
                    <img
                      src={editItem.image}
                      alt="Esikatselu"
                      className="w-full max-w-[200px] h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6 sticky bottom-0 bg-gray-900 pt-4 pb-2">
              <button
                onClick={() => setEditItem(null)}
                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 text-white"
              >
                {t('admin.menu.cancel')}
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-white"
                disabled={uploadingImage}
              >
                {t('admin.menu.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Uuden tuotteen lisäämislomake */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md my-8">
            <h2 className="text-2xl font-bold mb-6 sticky top-0 bg-gray-900 py-2 text-white">Lisää uusi tuote</h2>
            <div className="space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Nimi</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Kuvaus</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Hinta (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Kategoria</label>
                <input
                  type="text"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Kuvan URL</label>
                <input
                  type="text"
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                />
                {newItem.image && (
                  <div className="mt-2">
                    <img
                      src={newItem.image}
                      alt="Esikatselu"
                      className="w-full max-w-[200px] h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Tyyppi</label>
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'RAVINTOLA' | 'BAARI' })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                >
                  <option value="RAVINTOLA">Ravintola</option>
                  <option value="BAARI">Baari</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Lisää
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white"
              >
                Peruuta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 