'use client'

import React, { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlayerStore } from '../../../lib/playerStore'
import { Music, Upload } from 'lucide-react'

export const TrackInfo = () => {
  const { trackA, trackB, setTrackAFile, setTrackBFile } = usePlayerStore()

  const handleFileA = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setTrackAFile(e.target.files[0])
  }
  
  const handleFileB = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setTrackBFile(e.target.files[0])
  }

  const TrackCard = ({ label, track, onUpload }: { label: string, track: any, onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    
    return (
      <div className="flex flex-col items-center text-center p-6 bg-ink-800/40 rounded-3xl border border-white/5 backdrop-blur-xl flex-1 max-w-sm">
        <h3 className="text-sm uppercase tracking-widest text-paper-100/60 mb-4 font-semibold">{label}</h3>
        
        <div 
          className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl mb-6 group cursor-pointer bg-ink-900 border border-white/10 flex items-center justify-center transition-all hover:border-violet-500/50 hover:bg-ink-800"
          onClick={() => inputRef.current?.click()}
        >
          {track.file ? (
             <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-700/40 to-ink-900">
               <Music className="w-16 h-16 text-violet-500 opacity-50" />
             </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-paper-100/50 group-hover:text-violet-500 transition-colors">
              <Upload className="w-8 h-8" />
              <span className="text-sm font-medium">Upload Audio</span>
            </div>
          )}
          <input 
            type="file" 
            accept="audio/*" 
            className="hidden" 
            ref={inputRef} 
            onChange={onUpload} 
          />
        </div>

        <motion.div className="space-y-2 w-full">
          <h2 className="text-xl sm:text-2xl font-semibold text-paper-50 tracking-tight truncate px-2" title={track.title}>
            {track.title}
          </h2>
          
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="bg-ink-900/60 rounded-lg px-4 py-2 border border-white/5 min-w-[80px]">
              <div className="text-[10px] text-paper-100/50 uppercase tracking-wider mb-0.5">BPM</div>
              <div className="text-violet-500 font-medium">
                {track.isLoading ? '...' : (track.bpm !== null ? Math.round(track.bpm) : '--')}
              </div>
            </div>
            <div className="bg-ink-900/60 rounded-lg px-4 py-2 border border-white/5 min-w-[80px]">
              <div className="text-[10px] text-paper-100/50 uppercase tracking-wider mb-0.5">Key</div>
              <div className="text-violet-500 font-medium">
                {track.isLoading ? '...' : (track.key || '--')}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-4xl mx-auto">
      <TrackCard label="Deck A" track={trackA} onUpload={handleFileA} />
      <TrackCard label="Deck B" track={trackB} onUpload={handleFileB} />
    </div>
  )
}
