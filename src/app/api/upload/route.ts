import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dosya adını benzersiz yap
    const uniqueFilename = `${Date.now()}-${file.name}`;
    const path = join(process.cwd(), 'public/uploads', uniqueFilename);

    // Dosyayı kaydet
    await writeFile(path, buffer);

    // URL'i döndür
    return NextResponse.json({
      url: `/uploads/${uniqueFilename}`,
      message: 'Tiedosto ladattu onnistuneesti'
    });
  } catch (error) {
    console.error('Virhe tiedoston lataamisessa:', error);
    return NextResponse.json(
      { error: 'Virhe tiedoston lataamisessa' },
      { status: 500 }
    );
  }
} 