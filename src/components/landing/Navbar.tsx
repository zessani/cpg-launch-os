'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${scrolled ? 'bg-[#FAFAF9]/90 backdrop-blur-sm border-b border-[#E5E5E5]' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-[#0A0A0A] tracking-tight">
          RunBase
        </Link>
        <Link
          href="/onboarding"
          className="text-xs font-medium bg-[#0A0A0A] text-[#FAFAF9] px-4 py-2 hover:bg-[#1a1a1a] transition-colors"
        >
          Build my plan →
        </Link>
      </div>
    </header>
  )
}
