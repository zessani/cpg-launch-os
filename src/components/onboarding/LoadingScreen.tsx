'use client'

import { useState, useEffect } from 'react'
import { LOADING_MESSAGES } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  error?: boolean
  onRetry?: () => void
}

export default function LoadingScreen({ error, onRetry }: LoadingScreenProps) {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    if (error) return
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length)
    }, 600)
    return () => clearInterval(id)
  }, [error])

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-[#6B7280]">Something went wrong generating your plan.</p>
        <button
          onClick={onRetry}
          className="text-sm font-medium text-[#0A0A0A] underline underline-offset-2"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-[#6B7280]"
        >
          {LOADING_MESSAGES[msgIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
