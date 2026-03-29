'use client'

import { motion } from 'framer-motion'

const features = [
  {
    label: 'Roadmap',
    description: 'Phase-by-phase milestones from idea to shelf.',
  },
  {
    label: 'Suppliers',
    description: 'Vetted co-packers and ingredient sources for your category.',
  },
  {
    label: 'Margins',
    description: 'Unit economics model with COGS, pricing, and break-even.',
  },
  {
    label: 'Brand Identity',
    description: 'Name ideas, tone of voice, and positioning foundations.',
  },
]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
}

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export default function Features() {
  return (
    <section className="px-8 py-24">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs uppercase tracking-widest text-zinc-500 mb-12"
        >
          What you get
        </motion.p>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              variants={card}
              className="flex flex-col gap-3 p-8 bg-[#0A0A0A] hover:bg-white/[0.02] transition-colors group"
            >
              <p className="text-[10px] text-[#F97316] font-mono">0{i + 1}</p>
              <p className="text-base font-semibold text-white">{f.label}</p>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
