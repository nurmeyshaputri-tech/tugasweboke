import { NextResponse } from 'next/server';
import {
  dbGetPhotoboxCandidates,
  dbSavePhotoboxCandidate,
  dbDeletePhotoboxCandidate,
} from '@/lib/db';

export async function GET() {
  try {
    const candidates = await dbGetPhotoboxCandidates();
    return NextResponse.json({ success: true, candidates });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name, location, price, description, notes } = body;

    if (!name || !location || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Nama, Lokasi, dan Harga wajib diisi.' },
        { status: 400 }
      );
    }

    const saved = await dbSavePhotoboxCandidate({
      id,
      name,
      location,
      price: Number(price),
      description,
      notes,
    });

    return NextResponse.json({
      success: true,
      message: 'Kandidat Photo Box berhasil disimpan ke Supabase!',
      candidate: saved,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    await dbDeletePhotoboxCandidate(id);
    return NextResponse.json({ success: true, message: 'Kandidat berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
