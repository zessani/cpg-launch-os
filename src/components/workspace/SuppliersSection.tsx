'use client'

import { useState, useEffect, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OnboardingAnswers, Supplier } from '@/types'
import EditableText from '@/components/ui/EditableText'

interface SuppliersSectionProps {
  answers: Partial<OnboardingAnswers>
  suppliers: Supplier[]
  loading?: boolean
  onChange: (suppliers: Supplier[]) => void
}

type SupplierState = { contacted: boolean; note: string }
const STORAGE_KEY = 'cpg_supplier_states'

function loadStates(): Record<string, SupplierState> {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : {} } catch { return {} }
}
function saveStates(s: Record<string, SupplierState>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

export default function SuppliersSection({ suppliers, loading, onChange }: SuppliersSectionProps) {
  const [states, setStates] = useState<Record<string, SupplierState>>({})
  const [pendingFocusIdx, setPendingFocusIdx] = useState<number | null>(null)

  useEffect(() => { setStates(loadStates()) }, [])

  function updateField(i: number, field: keyof Supplier, val: string) {
    const oldName = suppliers[i].name
    const updated = suppliers.map((s, idx) => idx === i ? { ...s, [field]: val } : s)
    // Migrate CRM state when name changes
    if (field === 'name' && val !== oldName) {
      setStates(prev => {
        const next = { ...prev }
        if (next[oldName]) { next[val] = next[oldName]; delete next[oldName] }
        saveStates(next)
        return next
      })
    }
    onChange(updated)
  }

  function addSupplier() {
    const blank: Supplier = { name: '', type: '', location: '', minOrder: '' }
    onChange([...suppliers, blank])
    setPendingFocusIdx(suppliers.length)
  }

  function removeSupplier(i: number) {
    if (suppliers.length <= 1) return
    onChange(suppliers.filter((_, idx) => idx !== i))
  }

  function toggleContacted(name: string) {
    setStates(prev => {
      const cur = prev[name] ?? { contacted: false, note: '' }
      const next = { ...prev, [name]: { ...cur, contacted: !cur.contacted } }
      saveStates(next)
      return next
    })
  }

  function updateNote(name: string, note: string) {
    setStates(prev => {
      const cur = prev[name] ?? { contacted: false, note: '' }
      const next = { ...prev, [name]: { ...cur, note } }
      saveStates(next)
      return next
    })
  }

  return (
    <section className="py-12 border-b border-[#E5E5E5]">
      <div className="max-w-5xl mx-auto px-8">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-xs uppercase tracking-widest text-[#6B7280]">Suppliers</h2>
          {loading && <span className="text-xs text-[#6B7280] italic">Generating…</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                {['Name', 'Type', 'Location', 'Min Order', 'Status', '', ''].map((h, i) => (
                  <th key={i} className="text-left text-xs text-[#6B7280] pb-3 pr-6 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s, i) => {
                const state = states[s.name] ?? { contacted: false, note: '' }
                return (
                  <Fragment key={i}>
                    <tr className="group border-b border-[#E5E5E5]">
                      <td className="py-3 pr-6 font-medium text-[#0A0A0A]">
                        <EditableText value={s.name} onChange={v => updateField(i, 'name', v)} placeholder="Supplier name…" autoFocus={pendingFocusIdx === i} />
                      </td>
                      <td className="py-3 pr-6 text-[#6B7280]">
                        <EditableText value={s.type} onChange={v => updateField(i, 'type', v)} placeholder="Type…" />
                      </td>
                      <td className="py-3 pr-6 text-[#6B7280]">
                        <EditableText value={s.location} onChange={v => updateField(i, 'location', v)} placeholder="Location…" />
                      </td>
                      <td className="py-3 pr-6 text-[#6B7280]">
                        <EditableText value={s.minOrder} onChange={v => updateField(i, 'minOrder', v)} placeholder="Min order…" />
                      </td>
                      <td className="py-3 pr-6">
                        <button
                          onClick={() => toggleContacted(s.name)}
                          className={`text-xs px-2 py-0.5 border transition-colors duration-150 ${
                            state.contacted ? 'border-[#0A0A0A] text-[#0A0A0A]' : 'border-[#E5E5E5] text-[#6B7280] hover:border-[#0A0A0A] hover:text-[#0A0A0A]'
                          }`}
                        >
                          {state.contacted ? '✓ Contacted' : 'To Contact'}
                        </button>
                      </td>
                      <td className="py-3 pr-4">
                        <a
                          href={s.source || `https://www.google.com/search?q=${encodeURIComponent(`${s.name} ${s.type}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#6B7280] hover:text-[#0A0A0A] text-xs"
                          title={s.source ? 'Visit website' : 'Search on Google'}
                        >
                          ↗
                        </a>
                      </td>
                      <td className="py-3">
                        {suppliers.length > 1 && (
                          <button
                            onClick={() => removeSupplier(i)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D1D5DB] hover:text-[#6B7280] text-xs"
                          >
                            ×
                          </button>
                        )}
                      </td>
                    </tr>
                    <AnimatePresence>
                      {state.contacted && (
                        <motion.tr
                          key={`${i}-note`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td colSpan={7} className="pb-3 pt-1 border-b border-[#E5E5E5]">
                            <input
                              type="text"
                              value={state.note}
                              onChange={e => updateNote(s.name, e.target.value)}
                              placeholder="Add a note… (contact name, email, next step)"
                              className="w-full text-xs text-[#0A0A0A] placeholder:text-[#6B7280] bg-transparent border-b border-[#E5E5E5] focus:border-[#0A0A0A] outline-none py-1 transition-colors"
                            />
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
        <button
          onClick={addSupplier}
          className="mt-4 text-[10px] text-[#D1D5DB] hover:text-[#6B7280] transition-colors"
        >
          + add supplier
        </button>
      </div>
    </section>
  )
}
