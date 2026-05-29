import { NextRequest, NextResponse } from 'next/server';
import { getBookBySlug } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 });
  }

  const book = getBookBySlug(slug);
  if (!book) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  return NextResponse.json(book);
}
