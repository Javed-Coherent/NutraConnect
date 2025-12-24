'use client';

import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SavedIndicator() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCount() {
      try {
        const response = await fetch('/api/saved/count');
        const data = await response.json();
        setCount(data.count || 0);
      } catch (error) {
        console.error('Failed to fetch saved count:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCount();
  }, []);

  return (
    <Link
      href="/dashboard/saved"
      className="relative flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors"
      title={`Saved Companies (${count})`}
    >
      <Bookmark className={`h-5 w-5 transition-colors ${count > 0 ? 'text-teal-500 fill-teal-500' : 'text-muted-foreground hover:text-teal-500'}`} />
      {!loading && (
        <span className={`absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white rounded-full ${count > 0 ? 'bg-teal-500' : 'bg-gray-400'}`}>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
