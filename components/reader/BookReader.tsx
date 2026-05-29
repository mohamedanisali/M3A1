'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Book } from '@/types';

interface BookReaderProps {
  book: Book;
  onClose: () => void;
}

function PageContent({ text, pageNum, totalPages }: { text: string; pageNum: number; totalPages: number }) {
  return (
    <div
      className="h-full flex flex-col"
      style={{
        padding: 'clamp(2rem, 5vw, 3.5rem) clamp(2rem, 6vw, 4rem)',
        background: 'var(--paper-cream)',
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")
        `,
      }}
    >
      {/* Top margin line */}
      <div
        style={{
          borderTop: '1px solid rgba(180,150,100,0.25)',
          paddingTop: '1rem',
          marginBottom: '0.5rem',
        }}
      />

      {/* Reading content */}
      <div className="flex-1 overflow-hidden relative">
        <p
          className="reading-text"
          style={{ direction: 'rtl', textAlign: 'justify' }}
        >
          {text}
        </p>
      </div>

      {/* Bottom: page number */}
      <div
        className="flex justify-center items-center pt-4"
        style={{ borderTop: '1px solid rgba(180,150,100,0.2)' }}
      >
        <span
          className="font-fell"
          style={{
            fontSize: '0.65rem',
            color: 'rgba(100,70,40,0.4)',
            letterSpacing: '0.15em',
          }}
        >
          {pageNum} / {totalPages}
        </span>
      </div>
    </div>
  );
}

export default function BookReader({ book, onClose }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<'left' | 'right'>('left');
  const dragStartX = useRef<number | null>(null);

  const flipX = useMotionValue(0);
  const flipRotate = useTransform(flipX, [-300, 0, 300], [180, 0, -180]);

  const totalPages = book.pages.length;

  const goToPage = useCallback((dir: 'next' | 'prev') => {
    if (isFlipping) return;
    if (dir === 'next' && currentPage >= totalPages - 1) return;
    if (dir === 'prev' && currentPage <= 0) return;

    setIsFlipping(true);
    setFlipDir(dir === 'next' ? 'left' : 'right');

    setTimeout(() => {
      setCurrentPage(p => dir === 'next' ? p + 1 : p - 1);
      setIsFlipping(false);
    }, 420);
  }, [isFlipping, currentPage, totalPages]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToPage('next');
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToPage('prev');
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goToPage, onClose]);

  // Touch/drag
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = dragStartX.current - e.clientX;
    if (Math.abs(delta) > 50) {
      goToPage(delta > 0 ? 'next' : 'prev');
    }
    dragStartX.current = null;
  };

  const pageVariants = {
    initial: (dir: 'left' | 'right') => ({
      rotateY: dir === 'left' ? 90 : -90,
      opacity: 0,
      transformOrigin: dir === 'left' ? 'left center' : 'right center',
    }),
    animate: {
      rotateY: 0,
      opacity: 1,
      transformOrigin: 'center',
    },
    exit: (dir: 'left' | 'right') => ({
      rotateY: dir === 'left' ? -90 : 90,
      opacity: 0,
      transformOrigin: dir === 'left' ? 'right center' : 'left center',
    }),
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #1A0E06 0%, #0A0603 100%)',
      }}
    >
      {/* Warm glow behind book */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70%',
          height: '70%',
          background: 'radial-gradient(ellipse, rgba(200,134,10,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Close button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        whileHover={{ opacity: 1 }}
        onClick={onClose}
        className="absolute top-6 left-8 font-fell z-50"
        style={{
          fontSize: '0.65rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(200,134,10,0.8)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        ← العودة للمكتبة
      </motion.button>

      {/* Book title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-5 right-0 left-0 flex justify-center pointer-events-none"
      >
        <h2
          className="font-arabic"
          style={{
            fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
            color: 'rgba(245,237,216,0.35)',
            direction: 'rtl',
          }}
        >
          {book.title}
        </h2>
      </motion.div>

      {/* The Book */}
      <div
        className="relative"
        style={{
          width: 'min(520px, 90vw)',
          height: 'min(680px, 82vh)',
          perspective: '1400px',
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {/* Book shadow */}
        <div
          className="absolute -bottom-6 left-1/2 pointer-events-none"
          style={{
            transform: 'translateX(-50%)',
            width: '80%',
            height: '20px',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />

        {/* Book cover frame */}
        <div
          className="absolute inset-0 rounded-sm overflow-hidden"
          style={{
            boxShadow: `
              -8px 0 20px rgba(0,0,0,0.4),
              8px 0 20px rgba(0,0,0,0.4),
              0 8px 30px rgba(0,0,0,0.5),
              inset 4px 0 8px rgba(0,0,0,0.2),
              inset -4px 0 8px rgba(0,0,0,0.2)
            `,
          }}
        >
          {/* Animated page */}
          <AnimatePresence mode="wait" custom={flipDir}>
            <motion.div
              key={currentPage}
              custom={flipDir}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <PageContent
                text={book.pages[currentPage]}
                pageNum={currentPage + 1}
                totalPages={totalPages}
              />
            </motion.div>
          </AnimatePresence>

          {/* Spine shadow overlay */}
          <div
            className="absolute inset-y-0 left-0 pointer-events-none"
            style={{
              width: '30px',
              background: 'linear-gradient(90deg, rgba(0,0,0,0.15), transparent)',
            }}
          />
          <div
            className="absolute inset-y-0 right-0 pointer-events-none"
            style={{
              width: '30px',
              background: 'linear-gradient(270deg, rgba(0,0,0,0.15), transparent)',
            }}
          />
        </div>

        {/* Page edge texture - right side */}
        <div
          className="absolute inset-y-0 right-0 w-2 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, #E8D9B8, #D4C4A0)',
            boxShadow: '2px 0 4px rgba(0,0,0,0.2)',
          }}
        />
      </div>

      {/* Navigation arrows */}
      <div className="absolute bottom-8 flex items-center gap-8">
        <motion.button
          onClick={() => goToPage('prev')}
          disabled={currentPage === 0}
          whileHover={{ scale: 1.1, opacity: 1 }}
          style={{
            opacity: currentPage === 0 ? 0.15 : 0.5,
            background: 'none',
            border: 'none',
            cursor: currentPage === 0 ? 'default' : 'pointer',
            color: 'rgba(200,134,10,0.8)',
            fontSize: '1.4rem',
            fontFamily: 'serif',
            transition: 'opacity 0.2s',
          }}
        >
          ◂
        </motion.button>

        {/* Progress dots */}
        <div className="flex gap-1.5 items-center">
          {book.pages.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentPage(i)}
              style={{
                width: i === currentPage ? '16px' : '5px',
                height: '5px',
                borderRadius: '3px',
                background: i === currentPage
                  ? 'rgba(200,134,10,0.7)'
                  : 'rgba(200,134,10,0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        <motion.button
          onClick={() => goToPage('next')}
          disabled={currentPage >= totalPages - 1}
          whileHover={{ scale: 1.1, opacity: 1 }}
          style={{
            opacity: currentPage >= totalPages - 1 ? 0.15 : 0.5,
            background: 'none',
            border: 'none',
            cursor: currentPage >= totalPages - 1 ? 'default' : 'pointer',
            color: 'rgba(200,134,10,0.8)',
            fontSize: '1.4rem',
            fontFamily: 'serif',
            transition: 'opacity 0.2s',
          }}
        >
          ▸
        </motion.button>
      </div>

      {/* Swipe hint on mobile — only first time */}
      <motion.p
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute font-fell"
        style={{
          bottom: '3rem',
          fontSize: '0.6rem',
          color: 'rgba(200,134,10,0.4)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        اسحب للتقليب
      </motion.p>
    </motion.div>
  );
}
