
import type { Metadata } from 'next';
import { TeamPageContent } from '@/components/team-page-content';

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the dedicated members of the MinKing Esport team and join the real-time team chat.',
};

export default function TeamPage() {
  return <TeamPageContent />;
}
