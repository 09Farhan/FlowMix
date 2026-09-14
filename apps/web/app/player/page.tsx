'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrackInfo } from './components/TrackInfo'
import { PlayerControls } from './components/PlayerControls'
import { TransitionToggle } from './components/TransitionToggle'
import { Slider } from '@flowmix/ui'
import { usePlayerStore } from '../../lib/playerStore'

export default function PlayerPage() {
  const { progress, setProgress } = usePlayerStore()

  return (
    <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center p-6 selection:bg-brand-500/30">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl space-y-10"
      >
        <TrackInfo />

        <div className="space-y-8 bg-ink-950/80 backdrop-blur-xl border border-ink-800/50 p-8 rounded-3xl shadow-2xl max-w-lg mx-auto w-full">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider 
              value={progress} 
              max={100} 
              onChange={setProgress} 
            />
            <div className="flex justify-between text-xs font-medium text-ink-400 tabular-nums">
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          <PlayerControls />
        </div>

        <TransitionToggle />
      </motion.div>
    </div>
  )
}
