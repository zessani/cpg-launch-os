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

export default function Features() {
  return (
    <section className="px-6 py-24 border-t border-[#E5E5E5]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10"
        >
          {features.map((f) => (
            <div key={f.label} className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-[#0A0A0A]">{f.label}</p>
              <p className="text-sm text-[#6B7280] leading-relaxed">{f.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
