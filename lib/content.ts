import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Book, BookMeta, ContentType, SeriesGroup } from '@/types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

function splitIntoPages(content: string, charsPerPage: number = 1200): string[] {
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim());
  const pages: string[] = [];
  let currentPage = '';

  for (const paragraph of paragraphs) {
    if (currentPage.length + paragraph.length > charsPerPage && currentPage.length > 0) {
      pages.push(currentPage.trim());
      currentPage = paragraph;
    } else {
      currentPage += (currentPage ? '\n\n' : '') + paragraph;
    }
  }

  if (currentPage.trim()) {
    pages.push(currentPage.trim());
  }

  return pages.length > 0 ? pages : [content];
}

function readMarkdownFile(filePath: string, slug: string): Book | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title || 'بلا عنوان',
      date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      type: (data.type as ContentType) || 'khawatir',
      series: data.series,
      chapter: data.chapter,
      content: content.trim(),
      pages: splitIntoPages(content.trim()),
      excerpt: content.trim().slice(0, 160),
    };
  } catch {
    return null;
  }
}

export function getAllBooks(): BookMeta[] {
  const books: BookMeta[] = [];

  function scanDir(dir: string, slugPrefix: string = '') {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const slug = slugPrefix ? `${slugPrefix}/${entry.name.replace('.md', '')}` : entry.name.replace('.md', '');

      if (entry.isDirectory()) {
        scanDir(fullPath, slug);
      } else if (entry.name.endsWith('.md')) {
        const book = readMarkdownFile(fullPath, slug);
        if (book) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { content, pages, ...meta } = book;
          books.push(meta);
        }
      }
    }
  }

  scanDir(CONTENT_DIR);

  return books.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBookBySlug(slug: string): Book | null {
  const decodedSlug = decodeURIComponent(slug);
  const filePath = path.join(CONTENT_DIR, `${decodedSlug}.md`);
  return readMarkdownFile(filePath, decodedSlug);
}

export function getBooksByType(type: ContentType): BookMeta[] {
  return getAllBooks().filter(b => b.type === type);
}

export function getSeriesGroups(): SeriesGroup[] {
  const seriesBooks = getAllBooks().filter(b => b.type === 'series' && b.series);
  const grouped: Record<string, BookMeta[]> = {};

  for (const book of seriesBooks) {
    const key = book.series!;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(book);
  }

  return Object.entries(grouped).map(([name, books]) => ({
    name,
    books: books.sort((a, b) => (a.chapter || 0) - (b.chapter || 0)),
  }));
}
