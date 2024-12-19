'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeProvider({
    children,
    ...props
}: {
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setMounted(true);
        }
    }, []);

    if (!mounted) {
        return null; // Don't render until mounted on the client-side
    }
    return (
        <NextThemeProvider
            enableSystem={true}
            defaultTheme="dark"
            attribute="class"
            {...props}
        >
            {children}
        </NextThemeProvider>
    );
}
