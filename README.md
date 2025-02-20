# ODOST Ravintola & Baari

Modern ve kapsamlı bir restoran ve bar yönetim sistemi. Next.js 14, TypeScript, ve Prisma ile geliştirilmiş tam teşekküllü bir web uygulaması.

## 🌟 Özellikler

### 🏠 Genel Özellikler
- Modern ve duyarlı tasarım
- Karanlık mod desteği
- Çok dilli destek (Fince ve İngilizce)
- SEO optimizasyonu
- Yüksek performans puanları

### 🍽️ Restoran Bölümü
- Dinamik menü yönetimi
- Kategori bazlı yemek listesi
- Özel günlük menüler
- Besin değeri bilgileri
- Alerjen bilgilendirmesi

### 🍸 Bar Bölümü
- Kokteyl ve içecek menüsü
- Happy hour özelliği
- Özel etkinlik takvimi
- Canlı müzik programı
- Bar atmosferi galerisi

### 📱 Müşteri Özellikleri
- Online rezervasyon sistemi
- Masa seçimi
- Hediye kartı satın alma ve yönetimi
- QR kodlu dijital kartlar
- İletişim formu
- Etkinlik takvimine erişim

### 💼 Yönetim Paneli
- Kapsamlı dashboard
- Rezervasyon yönetimi
- Menü düzenleme
- Hediye kartı takibi
- Müşteri veritabanı
- Etkinlik yönetimi
- Galeri yönetimi
- İletişim formu yönetimi
- Sosyal medya entegrasyonu

## 🛠️ Teknoloji Yığını

### Frontend
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Shadcn/ui
- React Icons
- React Hook Form
- Zod Validation

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Nodemailer

### Araçlar & Servisler
- ESLint
- Prettier
- Git
- Docker
- Vercel (Deployment)

## 📊 Veritabanı Şeması

Temel modeller:
- User (Kullanıcılar)
- MenuItem (Menü öğeleri)
- Reservation (Rezervasyonlar)
- GiftCard (Hediye kartları)
- ContactForm (İletişim formları)
- Gallery (Galeri)
- AtmosphereEvent (Etkinlikler)
- HeaderMenu (Navigasyon)
- Footer (Alt bilgi)
- HeroSection (Ana sayfa görselleri)

## 🚀 Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/yourusername/odost.git
cd odost
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Çevre değişkenlerini ayarlayın:
```bash
cp .env.example .env
```

4. Veritabanını oluşturun:
```bash
npx prisma db push
```

5. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## 🔧 Çevre Değişkenleri

```env
# Veritabanı
DATABASE_URL=

# Email
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=

# Site Ayarları
SITE_NAME=
SITE_DESCRIPTION=
SITE_ADDRESS=
SITE_PHONE=
SITE_EMAIL=

# Sosyal Medya API'leri
INSTAGRAM_API_KEY=
FACEBOOK_API_KEY=
```

## 📱 Responsive Tasarım
- Mobil öncelikli tasarım
- Tablet optimizasyonu
- Masaüstü görünümü
- 4K ekran desteği

## 🔒 Güvenlik Özellikleri
- JWT tabanlı kimlik doğrulama
- Role dayalı yetkilendirme
- Rate limiting
- CORS politikaları
- XSS koruması
- CSRF koruması
- SQL injection koruması

## 🌐 API Endpoints

### Genel
- `GET /api/menu` - Menü öğelerini getir
- `GET /api/reservations` - Rezervasyonları getir
- `POST /api/contact` - İletişim formu gönder
- `GET /api/events` - Etkinlikleri getir

### Yönetim
- `POST /api/admin/menu` - Menü öğesi ekle
- `PUT /api/admin/reservations` - Rezervasyon güncelle
- `DELETE /api/admin/gallery` - Galeri öğesi sil
- `POST /api/admin/gift-cards` - Hediye kartı oluştur

## 📈 Performans Optimizasyonları
- Görüntü optimizasyonu
- Kod bölme
- Önbellek stratejileri
- Lazy loading
- Server-side rendering
- Statik sayfa oluşturma

## 🔄 CI/CD
- GitHub Actions ile otomatik derleme
- Otomatik test çalıştırma
- Vercel ile otomatik deployment
- Docker container desteği

## 📋 Yapılacaklar Listesi
- [ ] Çoklu dil desteği geliştirmeleri
- [ ] Ödeme sistemi entegrasyonu
- [ ] Mobil uygulama geliştirmesi
- [ ] Analitik dashboard eklenmesi
- [ ] PWA desteği
- [ ] Push notification sistemi

## 🤝 Katkıda Bulunma
1. Fork'layın
2. Feature branch oluşturun
3. Değişikliklerinizi commit'leyin
4. Branch'inizi push'layın
5. Pull Request oluşturun

## 📄 Lisans
Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Ekip
- Senol Dogan - Baş Geliştirici
- [Diğer ekip üyeleri]

## 📞 İletişim
- Email: senoldogan0233@gmail.com
- Website: [Website linki]
- LinkedIn: [LinkedIn profil linki]
