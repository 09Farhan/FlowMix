'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { usePlayerStore } from '../../../lib/playerStore'
import { Sparkles } from 'lucide-react'

export const TransitionToggle = () => {
  const { transitionMode, toggleTransitionMode } = usePlayerStore()

  return (
    <div className="flex items-center justify-between p-4 bg-ink-900/50 backdrop-blur-md rounded-2xl border border-ink-800">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl transition-colors ${transitionMode ? 'bg-violet-500/20 text-violet-400' : 'bg-ink-800 text-ink-400'}`}>
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="text-sm font-medium text-paper-50">Intelligent Transitions</h3>
          <p className="text-xs text-ink-400">DJ-style continuous playback</p>
        </div>
      </div>

      <button 
        onClick={toggleTransitionMode}
        className={`relative w-12 h-6 rounded-full transition-colors ${transitionMode ? 'bg-violet-500' : 'bg-ink-700'}`}
      >
        <motion.div 
          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
          animate={{ x: transitionMode ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  )
}
