
import type { Metadata } from 'next';
import { AboutPageContent } from '@/components/about-page-content';

export const metadata: Metadata = {
  title: 'About MinKing Esport',
  description: 'Learn about the story of MinKing Esport, our mission, our team, and how to join our gaming communities for Clash of Clans and Mobile Legends.',
  openGraph: {
    title: 'About MinKing Esport',
    description: 'Learn the story behind MinKing Esport and meet the team.',
  },
  twitter: {
    title: 'About MinKing Esport',
    description: 'Learn the story behind MinKing Esport and meet the team.',
  }
};

export default function AboutPage() {
  return <AboutPageContent />;
}
