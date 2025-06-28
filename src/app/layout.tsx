
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider';
import { MobileNav } from '@/components/mobile-nav';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { AuthProvider } from '@/hooks/use-auth';
import { DynamicIsland } from '@/components/dynamic-island';
import { NotificationProvider } from '@/hooks/use-notification';
import { CustomCursor } from '@/components/custom-cursor';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL('https://minking-esport.com'),
  title: {
    default: 'MinKing Esport - Game Reviews & Community',
    template: '%s | MinKing Esport',
  },
  description: 'Your universe of games, reviews, and recommendations. Join the MinKing Esport community, discover new games, and connect with players.',
  keywords: ['MinKing Esport', 'gaming', 'esports', 'game reviews', 'Clash of Clans', 'Mobile Legends', 'game community', 'Myanmar gaming'],
  authors: [{ name: 'Min Thu Khant', url: 'https://minthu.vercel.app/' }],
  openGraph: {
    title: 'MinKing Esport - Game Reviews & Community',
    description: 'Your universe of games, reviews, and recommendations.',
    url: 'https://minking-esport.com',
    siteName: 'MinKing Esport',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'MinKing Esport Hero Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MinKing Esport - Game Reviews & Community',
    description: 'Your universe of games, reviews, and recommendations.',
    images: ['https://placehold.co/1200x630.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('min-h-screen bg-background font-body antialiased', inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CustomCursor />
          <NotificationProvider>
            <AuthProvider>
              <DynamicIsland />
              <div className="relative flex min-h-screen flex-col pb-16 md:pb-0">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
              <MobileNav />
              <Toaster />
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
