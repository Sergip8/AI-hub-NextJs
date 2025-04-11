"use client"
import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

function StyleMode() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme, resolvedTheme } = useTheme()
    
    // Only render after component mounts to avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
        // Add a console log to check theme values on mount
        console.log('Theme system:', { theme, resolvedTheme, docClass: document.documentElement.classList })
    }, [theme, resolvedTheme])

    // Log theme changes
    useEffect(() => {
        if (mounted) {
            console.log('Theme changed:', { theme, resolvedTheme, docClass: document.documentElement.classList })
        }
    }, [theme, resolvedTheme, mounted])
    
    function handleTheme() {
        const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
        console.log('Setting theme to:', newTheme)
        setTheme(newTheme)
    }

    // Don't render anything until client-side
    if (!mounted) return null
    
    return (
        <div className="absolute top-4 right-4">
            <button 
                onClick={handleTheme}
                className="p-2 rounded-full bg-orange-100 dark:bg-gray-700 hover:bg-orange-200 dark:hover:bg-gray-600 transition-all"
                aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {resolvedTheme === 'dark' ? (
                    <Sun className="w-6 h-6" />
                ) : (
                    <Moon className="w-6 h-6" />
                )}
            </button>
            <span className="ml-2 text-xs opacity-50">{resolvedTheme}</span>
        </div>
    )
}

export default StyleMode