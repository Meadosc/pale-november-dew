'use client'
import { useState } from 'react';

import BookIdInput from '@/components/BookIdInput';
import BookList from '@/components/BookList';
import Header from '@/components/Header';


export default function Home() {
    const [refreshTable, setRefreshTable] = useState(false);
    const triggerRefresh = () => setRefreshTable(!refreshTable);
  
    return (
        <div className="flex flex-col justify-items-left min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <Header />
                <BookList refreshTable={refreshTable} />
                <BookIdInput triggerRefresh={triggerRefresh} />
            </main>
        </div>
    );
}
