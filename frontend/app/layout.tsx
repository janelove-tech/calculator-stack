import type { Metadata } from 'next';
import { JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: 'Multifaceted Calculator',
  description: 'Standard, scientific, and unit converter — Next.js + NestJS + PostgreSQL',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
