'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroScreenProps {
  onEnter: () => void;
}

export default function IntroScreen({ onEnter }: IntroScreenProps) {
  const [phase, setPhase] = useState<'dark' | 'logo' | 'quote' | 'enter'>('dark');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('logo'), 800);
    const t2 = setTimeout(() => setPhase('quote'), 2400);
    const t3 = setTimeout(() => setPhase('enter'), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer z-50"
      style={{ background: '#0A0603' }}
      onClick={onEnter}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
    >
      {/* Ambient dust particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-0.5 rounded-full"
          style={{
            background: 'rgba(200,134,10,0.4)',
            left: `${10 + Math.random() * 80}%`,
            top: `${20 + Math.random() * 60}%`,
            animation: `dustFloat ${6 + Math.random() * 6}s ease-in-out ${Math.random() * 4}s infinite`,
          }}
        />
      ))}

      {/* Radial warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,134,10,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Logo */}
      <AnimatePresence>
        {(phase === 'logo' || phase === 'quote' || phase === 'enter') && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-12 relative"
          >
            {/* Horizontal rule above */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(200,134,10,0.5), transparent)',
                marginBottom: '1.5rem',
                transformOrigin: 'center',
              }}
            />

            <h1
              className="font-fell"
              style={{
                fontSize: 'clamp(4rem, 10vw, 7rem)',
                color: '#E8A020',
                letterSpacing: '0.25em',
                textShadow: '0 0 40px rgba(200,134,10,0.5), 0 0 80px rgba(200,134,10,0.2)',
                fontStyle: 'italic',
              }}
            >
              M3A
            </h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.6 }}
              style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(200,134,10,0.5), transparent)',
                marginTop: '1.5rem',
                transformOrigin: 'center',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quote */}
      <AnimatePresence>
        {(phase === 'quote' || phase === 'enter') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="max-w-lg text-center px-8"
          >
            <p
              className="font-arabic"
              style={{
                fontSize: 'clamp(0.95rem, 2.2vw, 1.15rem)',
                lineHeight: 2.2,
                color: 'rgba(245,237,216,0.55)',
                direction: 'rtl',
              }}
            >
              هنا الكتابة ليست حروف بل عالم قابل للتشكيل
              <br />
              بناءً على ما يحتويه عقلك
              <br />
              <span style={{ opacity: 0.4 }}>لا معنى ثابت، لا هوية دائمة</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enter hint */}
      <AnimatePresence>
        {phase === 'enter' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0.3, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-14"
          >
            <p
              className="font-fell"
              style={{
                fontSize: '0.7rem',
                color: 'rgba(200,134,10,0.5)',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
              }}
            >
              انقر للدخول
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
