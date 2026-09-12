'use client'

import React from 'react'
import { IconButton } from '@flowmix/ui/components/IconButton'
import { usePlayerStore } from '../../../lib/playerStore'
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat } from 'lucide-react'

export const PlayerControls = () => {
  const { isPlaying, togglePlay } = usePlayerStore()

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
      />
      <IconButton 
        icon={isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />} 
        size="xl" 
        variant="filled"
        isActive={isPlaying}
        onClick={togglePlay}
      />
      <IconButton 
        icon={<SkipForward size={24} />} 
        size="md" 
      />
      <IconButton 
        icon={<Repeat size={20} />} 
        size="md" 
        className="text-ink-400 hover:text-paper-100"
      />
    </div>
  )
}
