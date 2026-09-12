'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlayerStore } from '../../../lib/playerStore'

export const TrackInfo = () => {
  const { currentTrack } = usePlayerStore()

  if (!currentTrack) return null

  return (
    <div className="flex flex-col items-center text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTrack.id}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, y: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden shadow-2xl mb-8 group"
        >
          <img 
            src={currentTrack.albumArt} 
            alt={currentTrack.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-1"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-paper-50 tracking-tight">
          {currentTrack.title}
        </h2>
        <p className="text-lg text-ink-300">
          {currentTrack.artist}
        </p>
      </motion.div>
    </div>
  )
}
