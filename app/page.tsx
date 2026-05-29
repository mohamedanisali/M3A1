'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { BookMeta, Book, SeriesGroup } from '@/types';

const IntroScreen = dynamic(() => import('@/components/library/IntroScreen'), { ssr: false });
const Library = dynamic(() => import('@/components/library/Library'), { ssr: false });
const BookReader = dynamic(() => import('@/components/reader/BookReader'), { ssr: false });

type AppState = 'intro' | 'library' | 'reading';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('intro');
  const [booksData, setBooksData] = useState<{
    khawatir: BookMeta[];
    series: SeriesGroup[];
    journals: BookMeta[];
    quotes: BookMeta[];
  } | null>(null);
  const [openBook, setOpenBook] = useState<Book | null>(null);

  useEffect(() => {
    const seen = localStorage.getItem('m3a_intro_seen');
    if (seen) setAppState('library');
  }, []);

  useEffect(() => {
    if (appState === 'library' && !booksData) {
      fetch('/api/books')
        .then(r => r.json())
        .then(setBooksData)
        .catch(console.error);
    }
  }, [appState, booksData]);

  const handleEnter = useCallback(() => {
    localStorage.setItem('m3a_intro_seen', '1');
    setAppState('library');
  }, []);

  const handleSelectBook = useCallback(async (slug: string) => {
    const res = await fetch(`/api/book?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) return;
    const book: Book = await res.json();
    setOpenBook(book);
    setAppState('reading');
  }, []);

  const handleCloseBook = useCallback(() => {
    setOpenBook(null);
    setAppState('library');
  }, []);

  return (
    <main className="w-screen h-screen overflow-hidden" style={{ background: '#0A0603' }}>
      <AnimatePresence mode="wait">
        {appState === 'intro' && (
          <IntroScreen key="intro" onEnter={handleEnter} />
        )}

        {appState === 'library' && booksData && (
          <motion.div
            key="library"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Library
              khawatir={booksData.khawatir}
              series={booksData.series}
              journals={booksData.journals}
              quotes={booksData.quotes}
              onSelectBook={handleSelectBook}
            />
          </motion.div>
        )}

        {appState === 'library' && !booksData && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center"
            style={{ background: '#0A0603' }}
          >
            <p className="font-fell" style={{ color: 'rgba(200,134,10,0.4)', letterSpacing: '0.25em', fontSize: '0.7rem' }}>
              جارٍ تحميل المكتبة...
            </p>
          </motion.div>
        )}

        {appState === 'reading' && openBook && (
          <BookReader key="reader" book={openBook} onClose={handleCloseBook} />
        )}
      </AnimatePresence>
    </main>
  );
}
