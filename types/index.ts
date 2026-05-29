export type ContentType = 'khawatir' | 'series' | 'journal' | 'quote';

export interface BookMeta {
  slug: string;
  title: string;
  date: string;
  type: ContentType;
  series?: string;
  chapter?: number;
  excerpt?: string;
}

export interface Book extends BookMeta {
  content: string;
  pages: string[];
}

export interface SeriesGroup {
  name: string;
  books: BookMeta[];
}
