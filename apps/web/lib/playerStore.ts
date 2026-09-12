import { create } from 'zustand'

export interface Track {
  id: string
  title: string
  artist: string
  albumArt: string
  duration: number
}

interface PlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  progress: number
  volume: number
  transitionMode: boolean
  
  setTrack: (track: Track) => void
  togglePlay: () => void
  setProgress: (progress: number) => void
  setVolume: (volume: number) => void
  toggleTransitionMode: () => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: {
    id: '1',
    title: 'Midnight City',
    artist: 'M83',
    albumArt: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=1000&auto=format&fit=crop',
    duration: 243,
  },
  isPlaying: false,
  progress: 0,
  volume: 80,
  transitionMode: false,

  setTrack: (track) => set({ currentTrack: track, progress: 0 }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setProgress: (progress) => set({ progress }),
  setVolume: (volume) => set({ volume }),
  toggleTransitionMode: () => set((state) => ({ transitionMode: !state.transitionMode })),
}))
