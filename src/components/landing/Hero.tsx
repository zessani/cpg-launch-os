'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14 },
  },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-8 pt-14 text-center overflow-hidden">
      {/* Ambient orange glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 60%, rgba(249,115,22,0.12) 0%, transparent 70%)' }}
      />
      {/* Top vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 100% 30% at 50% 0%, rgba(0,0,0,0.6) 0%, transparent 60%)' }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative max-w-4xl mx-auto flex flex-col items-center gap-7"
      >
        {/* Pill badge */}
        <motion.div
          variants={item}
          className="inline-flex items-center gap-1.5 border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-zinc-400"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block" />
          Free to use · No signup required
        </motion.div>

        <motion.h1
          variants={item}
          className="text-6xl sm:text-7xl lg:text-8xl font-semibold leading-[1.05] tracking-tight text-white"
        >
          Your CPG brand,
          <br />
          <span className="bg-gradient-to-r from-[#F97316] to-[#FBBF24] bg-clip-text text-transparent">
            launched.
          </span>
        </motion.h1>

        <motion.p variants={item} className="text-lg text-zinc-400 leading-relaxed max-w-md">
          Answer 7 questions. Get a complete, personalized launch plan — roadmap, suppliers,
          margin model, and brand identity — in one workspace.
        </motion.p>

        <motion.div variants={item}>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-[#F97316] text-white px-8 py-4 text-sm font-medium hover:bg-[#EA6C0A] transition-colors shadow-[0_0_32px_rgba(249,115,22,0.35)]"
          >
            Build my brand plan
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
