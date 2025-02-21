'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';

interface ContactFormProps {
  type: 'RAVINTOLA' | 'BAARI' | 'YLEINEN';
}

export default function ContactForm({ type }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: type
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
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken: recaptchaValue
        }),
      });

      if (!response.ok) {
        throw new Error('Viesti lähetys epäonnistui');
      }

      toast.success('Viesti lähetetty onnistuneesti!');
      
      // Formu sıfırla
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: type
      });
      setRecaptchaValue(null);
    } catch (error) {
      console.error('Viesti lähetys virhe:', error);
      toast.error('Viestin lähetys epäonnistui. Yritä uudelleen.');
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

  return (
    <div className="max-w-2xl mx-auto">
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
              onChange={handleChange}
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
              onChange={handleChange}
              className="w-full px-4 py-2 bg-theme border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium menu-text">
            Aihe koskee
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-theme border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
          >
            <option value="RAVINTOLA">Ravintola</option>
            <option value="BAARI">Baari</option>
            <option value="YLEINEN">Yleinen palaute</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="block text-sm font-medium menu-text">
            Aihe
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-theme border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium menu-text">
            Viesti
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-theme border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
          />
        </div>

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
            {isSubmitting ? 'Lähetetään...' : 'Lähetä viesti'}
          </button>
        </div>
      </form>
    </div>
  );
} 