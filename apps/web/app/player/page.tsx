'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrackInfo } from './components/TrackInfo'
import { PlayerControls } from './components/PlayerControls'
import { TransitionToggle } from './components/TransitionToggle'
import { Slider } from '@flowmix/ui'
import { usePlayerStore } from '../../lib/playerStore'
import { Volume2, VolumeX } from 'lucide-react'

export default function PlayerPage() {
  const { currentTrack, progress, setProgress, volume, setVolume, isPlaying } = usePlayerStore()

  // Mock progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        usePlayerStore.setState((state) => ({
          progress: state.progress >= currentTrack.duration ? 0 : state.progress + 1
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentTrack])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!currentTrack) return null

  return (
    <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center p-6 selection:bg-violet-500/30">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg space-y-10"
      >
        <TrackInfo />

        <div className="space-y-8 bg-ink-950/80 backdrop-blur-xl border border-ink-800/50 p-8 rounded-3xl shadow-2xl">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider 
              value={progress} 
              max={currentTrack.duration} 
              onChange={setProgress} 
            />
            <div className="flex justify-between text-xs font-medium text-ink-400 tabular-nums">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          <PlayerControls />

          {/* Bottom Bar: Volume & Transition */}
          <div className="pt-4 border-t border-ink-800/50 space-y-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setVolume(volume === 0 ? 80 : 0)} className="text-ink-400 hover:text-paper-50 transition-colors">
                {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <Slider 
                value={volume} 
                max={100} 
                onChange={setVolume} 
                className="flex-1"
              />
            </div>
            
            <TransitionToggle />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
