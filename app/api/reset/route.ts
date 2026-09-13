import { NextResponse } from 'next/server';
import { dbResetAllData } from '@/lib/db';

export async function POST() {
  try {
    await dbResetAllData();
    return NextResponse.json({
      success: true,
      message: 'Database Supabase berhasil dikosongkan secara total!',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
