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
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl mx-auto flex flex-col items-center gap-6"
      >
        <motion.p variants={item} className="text-xs tracking-widest uppercase text-[#6B7280]">
          RunBase
        </motion.p>

        <motion.h1
          variants={item}
          className="text-5xl sm:text-6xl font-semibold leading-[1.1] tracking-tight text-[#0A0A0A]"
        >
          Your CPG brand,
          <br />
          launched.
        </motion.h1>

        <motion.p variants={item} className="text-lg text-[#6B7280] leading-relaxed max-w-md">
          Answer 7 questions. Get a complete, personalized launch plan — roadmap, suppliers,
          margin model, and brand identity — in one workspace.
        </motion.p>

        <motion.div variants={item}>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-[#0A0A0A] text-[#FAFAF9] px-7 py-3.5 text-sm font-medium hover:bg-[#1a1a1a] transition-colors"
          >
            Build my brand plan
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
