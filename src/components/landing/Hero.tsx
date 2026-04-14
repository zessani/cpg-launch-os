'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-8 text-center overflow-hidden">
      {/* Subtle radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,0,0,0.04) 0%, transparent 70%)' }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative max-w-4xl mx-auto flex flex-col items-center gap-6"
      >
        {/* Pill badge */}
        <motion.div
          variants={item}
          className="inline-flex items-center gap-1.5 border border-[#E5E5E5] px-3 py-1 text-[11px] text-[#6B7280]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block" />
          Free to use · No signup required
        </motion.div>

        <motion.h1
          variants={item}
          className="text-5xl sm:text-6xl font-semibold leading-[1.1] tracking-tight text-[#0A0A0A]"
        >
          From idea to shelf, without the guesswork.
        </motion.h1>

        <motion.p variants={item} className="text-lg text-[#6B7280] leading-relaxed max-w-md">
          RunBase gives serious CPG founders a personalized launch plan, real co-packer connections,
          and the workspace to manage everything, in minutes.
        </motion.p>

        <motion.div variants={item}>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-[#0A0A0A] text-[#FAFAF9] px-7 py-3.5 text-sm font-medium hover:bg-[#1a1a1a] transition-colors"
          >
            Build my launch plan
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
