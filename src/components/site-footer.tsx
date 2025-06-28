
import Link from 'next/link';
import { Facebook } from 'lucide-react';
import { TiktokIcon, XIcon } from '@/components/icons';
import { Logo } from './icons';

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Logo className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} MinKing Esport. Built by{' '}
            <Link
              href="https://minthu.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Min Thu
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-sm underline-offset-4 hover:underline text-muted-foreground hover:text-primary">
                Privacy Policy
            </Link>
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="text-muted-foreground hover:text-primary transition-colors">
              <XIcon className="h-5 w-5" />
            </Link>
            <Link href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-muted-foreground hover:text-primary transition-colors">
              <TiktokIcon className="h-5 w-5" />
            </Link>
        </div>
      </div>
    </footer>
  );
}
