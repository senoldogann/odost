import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase istemcisini oluştur
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Tiedostoa ei löytynyt' },
        { status: 400 }
      );
    }

    // Dosya tipini kontrol et
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Virheellinen tiedostotyyppi. Sallitut tyypit: JPG, PNG, WEBP' },
        { status: 400 }
      );
    }

    // Dosya boyutunu kontrol et (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Tiedosto on liian suuri. Maksimikoko on 5MB' },
        { status: 400 }
      );
    }

    // Dosya adını benzersiz yap ve güvenli hale getir
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    const uniqueFilename = `${timestamp}-${safeName}`;
    
    // Dosyayı Supabase'e yükle
    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(uniqueFilename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase yükleme hatası:', error);
      return NextResponse.json(
        { error: 'Virhe tiedoston lataamisessa: ' + error.message },
        { status: 500 }
      );
    }

    // Dosyanın public URL'ini al
    const { data: { publicUrl } } = supabase.storage
      .from('menu-images')
      .getPublicUrl(data.path);

    return NextResponse.json({
      url: publicUrl,
      message: 'Tiedosto ladattu onnistuneesti'
    });
  } catch (error) {
    console.error('Virhe tiedoston lataamisessa:', error);
    return NextResponse.json(
      { error: 'Virhe tiedoston lataamisessa. Yritä uudelleen.' },
      { status: 500 }
    );
  }
} 