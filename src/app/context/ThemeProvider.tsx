'use client'

import { ThemeProvider } from 'next-themes'
import { useEffect, useState } from 'react'

import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false)

    // Set mounted to true on client-side
    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <ThemeProvider 
            attribute="class" 
            defaultTheme="system"
            enableSystem
            storageKey="theme"
            disableTransitionOnChange={false}
            forcedTheme={!mounted ? undefined : undefined}
        >
            {children}
        </ThemeProvider>
    )
}