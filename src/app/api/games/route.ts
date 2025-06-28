import { NextResponse } from 'next/server';
import { getAllGames } from '@/lib/data';

export async function GET() {
  const games = await getAllGames();
  return NextResponse.json(games);
}
