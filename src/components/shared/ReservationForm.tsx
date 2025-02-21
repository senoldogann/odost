'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { fi } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';

export default function ReservationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    type: 'RAVINTOLA', // Varsayılan olarak restoran seçili
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recaptchaValue) {
      toast.error('Vahvista olevasi ihminen reCAPTCHA:n avulla.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Direkt rezervasyon oluştur
      const reservationResponse = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString(),
          guests: parseInt(formData.guests),
          recaptchaToken: recaptchaValue
        }),
      });

      if (!reservationResponse.ok) {
        const errorData = await reservationResponse.json();
        console.error('Reservation error details:', errorData);
        throw new Error(errorData.error || 'Varauksen luominen epäonnistui');
      }

      const reservationData = await reservationResponse.json();
      console.log('Reservation created:', reservationData);

      toast.success('Varaus onnistui! Saat vahvistuksen sähköpostiisi.');
      
      // Formu sıfırla
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        type: 'RAVINTOLA',
        notes: ''
      });
      setRecaptchaValue(null);

      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }

    } catch (error) {
      console.error('Varausvirhe:', error);
      toast.error(error instanceof Error ? error.message : 'Varaus epäonnistui. Yritä uudelleen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRecaptchaChange = (value: string | null) => {
    setRecaptchaValue(value);
  };

  // Müsait saatler
  const availableTimes = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00'
  ];

  // Minimum tarih (bugün)
  const minDate = format(new Date(), 'yyyy-MM-dd');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium menu-text">
            Nimi
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 bg-theme border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium menu-text">
            Sähköposti
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 bg-theme border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium menu-text">
            Puhelin
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 bg-theme border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium menu-text">
            Tyyppi
          </label>
          <select
            id="type"
            name="type"
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'RAVINTOLA' | 'BAARI' })}
            className="w-full px-4 py-2 bg-theme border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
          >
            <option value="RAVINTOLA">Ravintola</option>
            <option value="BAARI">Baari</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="guests" className="block text-sm font-medium menu-text">
            Henkilömäärä
          </label>
          <select
            id="guests"
            name="guests"
            required
            value={formData.guests}
            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
            className="w-full px-4 py-2 bg-theme border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} henkilöä
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="block text-sm font-medium menu-text">
            Päivämäärä
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            min={format(new Date(), 'yyyy-MM-dd')}
            className="w-full px-4 py-2 bg-theme border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="time" className="block text-sm font-medium menu-text">
            Aika
          </label>
          <select
            id="time"
            name="time"
            required
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-4 py-2 bg-theme border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
          >
            <option value="">Valitse aika</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium menu-text">
          Lisätiedot
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-2 bg-theme border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
        />
      </div>

      {/* reCAPTCHA */}
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-white dark:bg-black rounded-lg">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
            onChange={handleRecaptchaChange}
            theme="light"
            className="dark:[&>div]:!bg-black dark:[&>div]:border-0 dark:[&>div>div>iframe]:border-0 dark:[&>div>div>iframe]:!bg-black dark:[&>div>div]:!bg-black"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !recaptchaValue}
          className="w-full md:w-auto px-8 py-3 bg-white dark:bg-black text-black dark:text-white font-semibold rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Lähetetään...' : 'Tee varaus'}
        </button>
      </div>
    </form>
  );
} 