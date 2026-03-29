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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/[0.06]' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-white tracking-tight">
          RunBase
        </Link>
        <Link
          href="/onboarding"
          className="text-xs font-medium bg-[#F97316] text-white px-4 py-2 hover:bg-[#EA6C0A] transition-colors"
        >
          Build my plan →
        </Link>
      </div>
    </header>
  )
}
