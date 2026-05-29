'use client';

import { motion } from 'framer-motion';
import { BookMeta, SeriesGroup } from '@/types';

interface LibraryProps {
  khawatir: BookMeta[];
  series: SeriesGroup[];
  journals: BookMeta[];
  quotes: BookMeta[];
  onSelectBook: (slug: string) => void;
}

const SECTION_LABELS: Record<string, string> = {
  khawatir: 'خواطر',
  series: 'سلسلة',
  journals: 'يوميات',
  quotes: 'اقتباسات',
};

function ShelfDivider() {
  return (
    <div
      className="relative w-full"
      style={{
        height: '18px',
        background: 'linear-gradient(180deg, #4A2C1A 0%, #2C1810 40%, #1E1008 100%)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
        borderRadius: '1px',
      }}
    >
      {/* Wood grain lines */}
      <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: '1px' }}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-full"
            style={{
              left: `${8 + i * 12}%`,
              width: '1px',
              background: 'rgba(255,255,255,0.025)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function BookEntry({ book, onSelect, index }: { book: BookMeta; onSelect: () => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
      onClick={onSelect}
      className="group flex items-baseline gap-3 cursor-pointer py-1.5 px-3 rounded-sm"
      style={{ direction: 'rtl' }}
      whileHover={{ x: -4 }}
    >
      {/* Ornament */}
      <span
        className="font-fell flex-shrink-0 transition-all duration-300 group-hover:opacity-100"
        style={{
          color: 'rgba(200,134,10,0.3)',
          fontSize: '0.6rem',
          marginTop: '2px',
          transition: 'color 0.3s',
        }}
      >
        ❧
      </span>

      {/* Title */}
      <span
        className="font-arabic transition-all duration-300"
        style={{
          fontSize: 'clamp(0.9rem, 1.7vw, 1.1rem)',
          color: 'rgba(245,237,216,0.72)',
          lineHeight: 1.6,
        }}
      >
        <span
          className="group-hover:text-amber-200 transition-colors duration-300"
          style={{ color: 'inherit' }}
        >
          {book.title}
        </span>
      </span>

      {/* Date */}
      <span
        className="font-fell flex-shrink-0 ml-auto"
        style={{
          fontSize: '0.58rem',
          color: 'rgba(200,134,10,0.25)',
          letterSpacing: '0.05em',
          direction: 'ltr',
        }}
      >
        {book.date?.slice(0, 7)}
      </span>
    </motion.div>
  );
}

function Shelf({
  label,
  children,
  delay = 0,
}: {
  label: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className="relative"
    >
      {/* Section label */}
      <div className="flex items-center gap-3 mb-3 px-3" style={{ direction: 'rtl' }}>
        <span
          className="font-fell"
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(200,134,10,0.45)',
          }}
        >
          {label}
        </span>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(90deg, rgba(200,134,10,0.2), transparent)',
          }}
        />
      </div>

      {/* Content */}
      <div className="mb-3 space-y-0.5">{children}</div>

      {/* Shelf board */}
      <ShelfDivider />
    </motion.section>
  );
}

export default function Library({ khawatir, series, journals, quotes, onSelectBook }: LibraryProps) {
  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0A0603 0%, #150C06 20%, #1E1008 60%, #150C06 100%)',
      }}
    >
      {/* Ambient warm glow from above */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '40%',
          background: 'radial-gradient(ellipse, rgba(200,134,10,0.08) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Left & right wall shadow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.5) 100%)',
      }} />

      {/* M3A Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative flex flex-col items-center pt-8 pb-6"
      >
        <div
          style={{
            height: '1px',
            width: '60%',
            background: 'linear-gradient(90deg, transparent, rgba(200,134,10,0.3), transparent)',
            marginBottom: '1rem',
          }}
        />
        <h1
          className="font-fell candle-flicker"
          style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            color: '#E8A020',
            letterSpacing: '0.3em',
            textShadow: '0 0 20px rgba(200,134,10,0.4)',
            fontStyle: 'italic',
          }}
        >
          M3A
        </h1>
        <p
          className="font-arabic mt-1"
          style={{
            fontSize: '0.7rem',
            color: 'rgba(245,237,216,0.25)',
            letterSpacing: '0.15em',
            direction: 'rtl',
          }}
        >
          المكتبة الخشبية
        </p>
        <div
          style={{
            height: '1px',
            width: '60%',
            background: 'linear-gradient(90deg, transparent, rgba(200,134,10,0.3), transparent)',
            marginTop: '1rem',
          }}
        />
      </motion.header>

      {/* Scrollable content */}
      <div
        className="h-full overflow-y-auto"
        style={{
          paddingBottom: '8rem',
          scrollbarWidth: 'thin',
          scrollbarColor: '#6B3F2A #1E1008',
        }}
      >
        <div
          className="max-w-2xl mx-auto px-6 space-y-2"
          style={{ paddingTop: '0.5rem' }}
        >
          {/* Khawatir shelf */}
          {khawatir.length > 0 && (
            <Shelf label={SECTION_LABELS.khawatir} delay={0.15}>
              {khawatir.map((book, i) => (
                <BookEntry key={book.slug} book={book} onSelect={() => onSelectBook(book.slug)} index={i} />
              ))}
            </Shelf>
          )}

          {/* Series shelves */}
          {series.map((group, gi) => (
            <Shelf key={group.name} label={`${SECTION_LABELS.series} — ${group.name}`} delay={0.25 + gi * 0.1}>
              {group.books.map((book, i) => (
                <BookEntry key={book.slug} book={book} onSelect={() => onSelectBook(book.slug)} index={i} />
              ))}
            </Shelf>
          ))}

          {/* Journals shelf */}
          {journals.length > 0 && (
            <Shelf label={SECTION_LABELS.journals} delay={0.35}>
              {journals.map((book, i) => (
                <BookEntry key={book.slug} book={book} onSelect={() => onSelectBook(book.slug)} index={i} />
              ))}
            </Shelf>
          )}

          {/* Quotes shelf */}
          {quotes.length > 0 && (
            <Shelf label={SECTION_LABELS.quotes} delay={0.45}>
              {quotes.map((book, i) => (
                <BookEntry key={book.slug} book={book} onSelect={() => onSelectBook(book.slug)} index={i} />
              ))}
            </Shelf>
          )}
        </div>
      </div>

      {/* Floor shadow */}
      <div
        className="absolute bottom-0 inset-x-0 pointer-events-none"
        style={{
          height: '80px',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
