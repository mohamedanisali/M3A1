import { NextResponse } from 'next/server';
import { getAllBooks, getSeriesGroups } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function GET() {
  const allBooks = getAllBooks();
  const seriesGroups = getSeriesGroups();

  const khawatir = allBooks.filter(b => b.type === 'khawatir');
  const journals = allBooks.filter(b => b.type === 'journal');
  const quotes = allBooks.filter(b => b.type === 'quote');

  return NextResponse.json({ khawatir, series: seriesGroups, journals, quotes });
}
