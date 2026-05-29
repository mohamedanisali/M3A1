import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'M3A — المكتبة الخشبية',
  description: 'هنا الكتابة ليست حروف بل عالم قابل للتشكيل',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=IM+Fell+English:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
