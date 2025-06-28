
"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function GameFilters() {
    const searchParams = useSearchParams();
    const category = searchParams.get('category')?.toLowerCase() || 'all';

    const getCategoryLink = (cat: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', cat.toLowerCase());
        return `/?${params.toString()}`;
    }

    return (
        <div className="flex justify-center gap-2 md:gap-4 mt-8">
            <Button asChild variant={category === 'all' ? 'default' : 'outline'} size="sm">
                <Link href={getCategoryLink('all')}>All Games</Link>
            </Button>
            <Button asChild variant={category === 'pc' ? 'default' : 'outline'} size="sm">
                <Link href={getCategoryLink('PC')}>PC Games</Link>
            </Button>
            <Button asChild variant={category === 'mobile' ? 'default' : 'outline'} size="sm">
                <Link href={getCategoryLink('Mobile')}>Mobile Games</Link>
            </Button>
        </div>
    );
}
