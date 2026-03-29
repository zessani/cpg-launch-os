'use client'

import { motion } from 'framer-motion'

const stats = [
  { value: '7', label: 'questions answered' },
  { value: '4', label: 'deliverables generated' },
  { value: '< 60s', label: 'to a complete plan' },
]

export default function SocialProof() {
  return (
    <section className="border-y border-white/[0.06] py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-3 divide-x divide-white/[0.06]"
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 px-8 text-center">
              <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{s.value}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
