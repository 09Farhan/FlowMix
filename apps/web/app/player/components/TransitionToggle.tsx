'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { usePlayerStore } from '../../../lib/playerStore'
import { Sparkles, Loader2 } from 'lucide-react'

export const TransitionToggle = () => {
  const { isTransitioning, triggerTransition, trackA, trackB } = usePlayerStore()

  const canTransition = trackA.bpm !== null && trackB.bpm !== null && !isTransitioning

  return (
    <div className="flex items-center justify-between p-4 bg-ink-900/50 backdrop-blur-md rounded-2xl border border-ink-800 mt-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-violet-500/20 text-violet-500">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="text-sm font-medium text-paper-50">FlowMix Engine</h3>
          <p className="text-xs text-paper-100/50">Crossfade from Deck A to Deck B</p>
        </div>
      </div>

      <button 
        onClick={triggerTransition}
        disabled={!canTransition}
        className={`relative px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-all ${canTransition ? 'bg-violet-500 text-white hover:opacity-90 shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 'bg-ink-800 text-paper-100/50 cursor-not-allowed'}`}
      >
        {isTransitioning ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <span>Trigger Transition</span>
        )}
      </button>
    </div>
  )
}
