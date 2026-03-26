'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Waitlist() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch { /* fail silently — don't block the user */ }
    setSubmitted(true)
  }

  return (
    <section className="px-6 py-24 border-t border-[#E5E5E5]">
      <div className="max-w-md mx-auto text-center flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-[#0A0A0A]">Stay in the loop</p>
          <p className="text-sm text-[#6B7280]">
            Get notified when new supplier data and roadmap templates drop.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.p
              key="thanks"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-[#0A0A0A]"
            >
              You&apos;re on the list.
            </motion.p>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent border-b border-[#E5E5E5] focus:border-[#0A0A0A] outline-none text-sm py-2 text-[#0A0A0A] placeholder:text-[#6B7280] transition-colors"
              />
              <button
                type="submit"
                className="text-sm font-medium text-[#0A0A0A] hover:text-[#6B7280] transition-colors whitespace-nowrap"
              >
                Join waitlist
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
