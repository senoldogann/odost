'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

interface HeroSection {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  type: 'RAVINTOLA' | 'BAARI';
  isActive: boolean;
  buttonText?: string;
  buttonUrl?: string;
}

interface NewHeroSection {
  title: string;
  subtitle?: string;
  imageUrl: string;
  type: 'RAVINTOLA' | 'BAARI';
  isActive: boolean;
  buttonText?: string;
  buttonUrl?: string;
}

interface FormProps {
  onSubmit: (data: NewHeroSection) => void;
  type: 'RAVINTOLA' | 'BAARI';
  initialData?: HeroSection;
}

function HeroSectionForm({ onSubmit, type, initialData }: FormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<NewHeroSection>({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    imageUrl: initialData?.imageUrl || '',
    type: type,
    isActive: initialData?.isActive ?? true,
    buttonText: initialData?.buttonText || '',
    buttonUrl: initialData?.buttonUrl || ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        subtitle: initialData.subtitle || '',
        imageUrl: initialData.imageUrl,
        type: initialData.type,
        isActive: initialData.isActive,
        buttonText: initialData.buttonText || '',
        buttonUrl: initialData.buttonUrl || ''
      });
    } else {
      setFormData(prev => ({
        ...prev,
        type: type
      }));
    }
  }, [initialData, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleReset = () => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        subtitle: initialData.subtitle || '',
        imageUrl: initialData.imageUrl,
        type: initialData.type,
        isActive: initialData.isActive,
        buttonText: initialData.buttonText || '',
        buttonUrl: initialData.buttonUrl || ''
      });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        imageUrl: '',
        type: type,
        isActive: true,
        buttonText: '',
        buttonUrl: ''
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('admin.hero.sectionTitle')}</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white/5 border border-white/10"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('admin.hero.subtitle')}</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white/5 border border-white/10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('admin.hero.imageUrl')}</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white/5 border border-white/10"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('admin.hero.buttonText')}</label>
          <input
            type="text"
            name="buttonText"
            value={formData.buttonText}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white/5 border border-white/10"
            placeholder={t('admin.hero.buttonTextPlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('admin.hero.buttonUrl')}</label>
          <input
            type="text"
            name="buttonUrl"
            value={formData.buttonUrl}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white/5 border border-white/10"
            placeholder={t('admin.hero.buttonUrlPlaceholder')}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="rounded border-white/10 bg-white/5"
          />
          <label className="text-sm font-medium">{t('admin.hero.active')}</label>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {initialData ? t('admin.hero.update') : t('admin.hero.add')}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          {t('admin.hero.reset')}
        </button>
      </div>
    </form>
  );
}

export default function HeroManagement() {
  const { t } = useLanguage();
  const [heroSections, setHeroSections] = useState<{
    RAVINTOLA: HeroSection[];
    BAARI: HeroSection[];
  }>({
    RAVINTOLA: [],
    BAARI: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'RAVINTOLA' | 'BAARI'>('RAVINTOLA');
  const [editingHero, setEditingHero] = useState<HeroSection | null>(null);

  useEffect(() => {
    fetchHeroSections();
  }, []);

  const fetchHeroSections = async () => {
    try {
      const [restaurantResponse, barResponse] = await Promise.all([
        fetch('/api/hero?type=RAVINTOLA'),
        fetch('/api/hero?type=BAARI')
      ]);

      const restaurantData = await restaurantResponse.json();
      const barData = await barResponse.json();

      setHeroSections({
        RAVINTOLA: Array.isArray(restaurantData) ? restaurantData : [],
        BAARI: Array.isArray(barData) ? barData : []
      });
    } catch (error) {
      console.error(t('admin.hero.fetchErrorLog'), error);
      toast.error(t('admin.hero.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: NewHeroSection) => {
    try {
      const response = await fetch('/api/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error(t('admin.hero.addError'));

      toast.success(t('admin.hero.addSuccess'));
      fetchHeroSections();
    } catch (error) {
      console.error(t('admin.hero.addErrorLog'), error);
      toast.error(t('admin.hero.addErrorToast'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.hero.deleteConfirm'))) return;

    try {
      const response = await fetch(`/api/hero?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error(t('admin.hero.deleteError'));

      toast.success(t('admin.hero.deleteSuccess'));
      fetchHeroSections();
      setEditingHero(null);
    } catch (error) {
      console.error(t('admin.hero.deleteErrorLog'), error);
      toast.error(t('admin.hero.deleteErrorToast'));
    }
  };

  const handleEdit = async (data: NewHeroSection & { id: string }) => {
    try {
      const response = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error(t('admin.hero.updateError'));

      toast.success(t('admin.hero.updateSuccess'));
      fetchHeroSections();
      setEditingHero(null);
    } catch (error) {
      console.error(t('admin.hero.updateErrorLog'), error);
      toast.error(t('admin.hero.updateErrorToast'));
    }
  };

  if (isLoading) {
    return <div className="text-white text-center py-12">{t('admin.common.loading')}</div>;
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-8">{t('admin.hero.title')}</h1>

      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setSelectedType('RAVINTOLA')}
            className={`px-4 py-2 rounded-lg ${
              selectedType === 'RAVINTOLA'
                ? 'bg-blue-500'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {t('admin.siteSettings.restaurant')}
          </button>
          <button
            onClick={() => setSelectedType('BAARI')}
            className={`px-4 py-2 rounded-lg ${
              selectedType === 'BAARI'
                ? 'bg-blue-500'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {t('admin.siteSettings.bar')}
          </button>
        </div>

        {editingHero ? (
          <div className="bg-white/5 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t('admin.hero.editSection')}</h2>
              <button
                onClick={() => setEditingHero(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t('admin.common.cancel')}
              </button>
            </div>
            <HeroSectionForm
              onSubmit={(data) => handleEdit({ ...data, id: editingHero.id })}
              type={selectedType}
              initialData={editingHero}
            />
          </div>
        ) : (
          <div className="bg-white/5 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              {t('admin.hero.addNewSection')}
            </h2>
            <HeroSectionForm onSubmit={handleSubmit} type={selectedType} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {heroSections[selectedType].map((hero) => (
          <div key={hero.id} className="bg-white/5 p-6 rounded-lg">
            <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
              <Image
                src={hero.imageUrl}
                alt={hero.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">{hero.title}</h3>
            {hero.subtitle && (
              <p className="text-gray-400 mb-4">{hero.subtitle}</p>
            )}
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-sm ${
                hero.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
              }`}>
                {hero.isActive ? t('admin.common.active') : t('admin.common.inactive')}
              </span>
              <div className="flex gap-4">
                <button
                  onClick={() => setEditingHero(hero)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {t('admin.common.edit')}
                </button>
                <button
                  onClick={() => handleDelete(hero.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
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