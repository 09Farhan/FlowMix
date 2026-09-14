'use client'

import React from 'react'
import { IconButton } from '@flowmix/ui'
import { usePlayerStore } from '../../../lib/playerStore'
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat } from 'lucide-react'

export const PlayerControls = () => {
  const { isPlaying, togglePlay, trackA, skip } = usePlayerStore()

  return (
    <div className="flex items-center justify-center gap-4">
      <IconButton 
        icon={<Shuffle size={20} />} 
        size="md" 
        className="text-ink-400 hover:text-paper-100"
      />
      <IconButton 
        icon={<SkipBack size={24} />} 
        size="md" 
        onClick={() => skip(-10)}
        disabled={!trackA.file}
      />
      <IconButton 
        icon={isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />} 
        size="xl" 
        variant="filled"
        isActive={isPlaying}
        onClick={togglePlay}
        disabled={!trackA.file}
        className={!trackA.file ? "opacity-50 cursor-not-allowed" : ""}
      />
      <IconButton 
        icon={<SkipForward size={24} />} 
        size="md" 
        onClick={() => skip(10)}
        disabled={!trackA.file}
      />
      <IconButton 
        icon={<Repeat size={20} />} 
        size="md" 
        className="text-ink-400 hover:text-paper-100"
      />
    </div>
  )
}
