import { NextResponse } from 'next/server';
import { dbResetAllData } from '@/lib/sqlite';

export async function POST() {
  try {
    await dbResetAllData();
    return NextResponse.json({
      success: true,
      message: 'Database SQLite berhasil dikosongkan secara total!',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
