'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderMenuItem {
  id: string;
  title: string;
  path: string;
  order: number;
  parentId?: string | null;
  isActive: boolean;
  type: 'RAVINTOLA' | 'BAARI';
  siteTitle?: string;
  siteLogo?: string;
}

interface NewHeaderMenuItem {
  title: string;
  path: string;
  order: number;
  parentId?: string | null;
  type: 'RAVINTOLA' | 'BAARI';
  isActive: boolean;
  siteTitle?: string;
  siteLogo?: string;
}

export default function HeaderMenuManagement() {
  const { t } = useLanguage();
  const [menuItems, setMenuItems] = useState<HeaderMenuItem[]>([]);
  const [selectedType, setSelectedType] = useState<'RAVINTOLA' | 'BAARI'>('RAVINTOLA');
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<HeaderMenuItem | null>(null);
  const [newItem, setNewItem] = useState<NewHeaderMenuItem>({
    title: '',
    path: '',
    order: 0,
    type: selectedType,
    isActive: true,
    siteTitle: '',
    siteLogo: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuItems();
    setNewItem(prev => ({ ...prev, type: selectedType }));
  }, [selectedType]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`/api/header-menu?type=${selectedType}`);
      if (!response.ok) throw new Error(t('admin.header.fetchError'));
      const data = await response.json();
      const filteredData = data.filter((item: HeaderMenuItem) => item.type === selectedType);
      setMenuItems(filteredData);
    } catch (error) {
      console.error(t('admin.header.fetchErrorLog'), error);
      toast.error(t('admin.header.fetchErrorToast'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      const itemToAdd = {
        ...newItem,
        type: selectedType,
        order: parseInt(newItem.order.toString()) || 0
      };

      const response = await fetch('/api/header-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToAdd)
      });

      if (!response.ok) throw new Error(t('admin.header.addError'));

      toast.success(t('admin.header.addSuccess'));
      setNewItem({
        title: '',
        path: '',
        order: 0,
        type: selectedType,
        isActive: true,
        siteTitle: '',
        siteLogo: ''
      });
      fetchMenuItems();
    } catch (error) {
      console.error(t('admin.header.addErrorLog'), error);
      toast.error(t('admin.header.addErrorToast'));
    }
  };

  const handleUpdateItem = async () => {
    if (!editingId) return;

    try {
      const response = await fetch('/api/header-menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newItem, id: editingId }),
      });

      if (!response.ok) throw new Error(t('admin.header.updateError'));

      toast.success(t('admin.header.updateSuccess'));
      fetchMenuItems();
      setEditingId(null);
      setNewItem({
        title: '',
        path: '',
        order: 0,
        type: 'RAVINTOLA',
        isActive: true,
        siteTitle: '',
        siteLogo: ''
      });
    } catch (error) {
      console.error(t('admin.header.updateErrorLog'), error);
      toast.error(t('admin.header.updateErrorToast'));
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm(t('admin.header.deleteConfirm'))) return;

    try {
      const response = await fetch(`/api/header-menu?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error(t('admin.header.deleteError'));

      toast.success(t('admin.header.deleteSuccess'));
      fetchMenuItems();
    } catch (error) {
      console.error(t('admin.header.deleteErrorLog'), error);
      toast.error(t('admin.header.deleteErrorToast'));
    }
  };

  if (isLoading) {
    return <div className="text-white text-center py-12">{t('admin.common.loading')}</div>;
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-8">{t('admin.header.title')}</h1>

      {/* Tür seçimi */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">{t('admin.header.type')}</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as 'RAVINTOLA' | 'BAARI')}
          className="px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="RAVINTOLA">{t('admin.siteSettings.restaurant')}</option>
          <option value="BAARI">{t('admin.siteSettings.bar')}</option>
        </select>
      </div>

      {/* Yeni öğe ekleme formu */}
      <div className="bg-white/5 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('admin.header.addNewItem')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('admin.header.itemTitle')}</label>
            <input
              type="text"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('admin.header.path')}</label>
            <input
              type="text"
              value={newItem.path}
              onChange={(e) => setNewItem({ ...newItem, path: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('admin.header.siteTitle')}</label>
            <input
              type="text"
              value={newItem.siteTitle}
              onChange={(e) => setNewItem({ ...newItem, siteTitle: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder={t('admin.header.siteTitlePlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('admin.header.siteLogo')}</label>
            <input
              type="text"
              value={newItem.siteLogo}
              onChange={(e) => setNewItem({ ...newItem, siteLogo: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder={t('admin.header.siteLogoPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('admin.header.order')}</label>
            <input
              type="number"
              value={newItem.order}
              onChange={(e) => setNewItem({ ...newItem, order: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>
        <button
          onClick={editingId ? handleUpdateItem : handleAddItem}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {editingId ? t('admin.common.update') : t('admin.common.add')}
        </button>
      </div>

      {/* Mevcut öğeler listesi */}
      <div className="bg-white/5 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">{t('admin.header.currentItems')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2">{t('admin.header.itemTitle')}</th>
                <th className="text-left py-2">{t('admin.header.path')}</th>
                <th className="text-left py-2">{t('admin.header.siteTitle')}</th>
                <th className="text-left py-2">{t('admin.header.order')}</th>
                <th className="text-left py-2">{t('admin.header.status')}</th>
                <th className="text-left py-2">{t('admin.header.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id} className="border-b border-white/10">
                  <td className="py-2">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={newItem.title}
                        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                        className="w-full px-2 py-1 bg-white/10 rounded"
                      />
                    ) : (
                      item.title
                    )}
                  </td>
                  <td className="py-2">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={newItem.path}
                        onChange={(e) => setNewItem({ ...newItem, path: e.target.value })}
                        className="w-full px-2 py-1 bg-white/10 rounded"
                      />
                    ) : (
                      item.path
                    )}
                  </td>
                  <td className="py-2">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={newItem.siteTitle}
                        onChange={(e) => setNewItem({ ...newItem, siteTitle: e.target.value })}
                        className="w-full px-2 py-1 bg-white/10 rounded"
                      />
                    ) : (
                      item.siteTitle || '-'
                    )}
                  </td>
                  <td className="py-2">
                    {editingId === item.id ? (
                      <input
                        type="number"
                        value={newItem.order}
                        onChange={(e) => setNewItem({ ...newItem, order: parseInt(e.target.value) })}
                        className="w-full px-2 py-1 bg-white/10 rounded"
                      />
                    ) : (
                      item.order
                    )}
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => {
                        const updatedItem = { ...item, isActive: !item.isActive };
                        setEditingId(item.id);
                        setNewItem({ ...newItem, isActive: updatedItem.isActive });
                      }}
                      className={`px-2 py-1 rounded ${
                        item.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {item.isActive ? t('admin.common.active') : t('admin.common.inactive')}
                    </button>
                  </td>
                  <td className="py-2">
                    {editingId === item.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateItem}
                          className="px-2 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30"
                        >
                          {t('admin.common.save')}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded hover:bg-gray-500/30"
                        >
                          {t('admin.common.cancel')}
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            setNewItem({
                              title: item.title,
                              path: item.path,
                              order: item.order,
                              type: item.type,
                              isActive: item.isActive,
                              siteTitle: item.siteTitle || '',
                              siteLogo: item.siteLogo || ''
                            });
                          }}
                          className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30"
                        >
                          {t('admin.common.edit')}
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="px-2 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30"
                        >
                          {t('admin.common.delete')}
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
    </div>
  );
} 