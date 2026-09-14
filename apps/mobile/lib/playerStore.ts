import { create } from 'zustand'
import { audioEngine } from './audioEngine'

export interface TrackData {
  uri: string | null
  title: string
  bpm: number | null
  key: string | null
  isLoading: boolean
}

interface PlayerState {
  trackA: TrackData
  trackB: TrackData
  isPlaying: boolean
  progress: number
  isTransitioning: boolean
  
  setTrackAFile: (uri: string, name: string) => Promise<void>
  setTrackBFile: (uri: string, name: string) => Promise<void>
  togglePlay: () => Promise<void>
  triggerTransition: () => Promise<void>
}

// React Native requires mapping localhost to 10.0.2.2 for Android emulators.
// For iOS simulators or web, localhost works fine. We will use localhost here and assume iOS or Web testing,
// but fallback logic could be added for Android.
const API_URL = 'http://localhost:8000'

const analyzeTrack = async (uri: string, name: string) => {
  const formData = new FormData()
  formData.append('file', {
    uri,
    name,
    type: 'audio/wav',
  } as any)
  
  const res = await fetch(`${API_URL}/v1/mix/analyze`, {
    method: 'POST',
    body: formData
  })
  
  if (!res.ok) throw new Error('Analysis failed')
  return await res.json()
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  trackA: { uri: null, title: 'No Track', bpm: null, key: null, isLoading: false },
  trackB: { uri: null, title: 'No Track', bpm: null, key: null, isLoading: false },
  isPlaying: false,
  progress: 0,
  isTransitioning: false,

  setTrackAFile: async (uri: string, name: string) => {
    set(state => ({ trackA: { ...state.trackA, uri, title: name, isLoading: true } }))
    await audioEngine.loadTrackA(uri)
    
    try {
      const response = await analyzeTrack(uri, name)
      set(state => ({ trackA: { ...state.trackA, bpm: response.data.bpm, key: response.data.key, isLoading: false } }))
    } catch (e) {
      set(state => ({ trackA: { ...state.trackA, isLoading: false } }))
      console.error(e)
    }
  },

  setTrackBFile: async (uri: string, name: string) => {
    set(state => ({ trackB: { ...state.trackB, uri, title: name, isLoading: true } }))
    await audioEngine.loadTrackB(uri)
    
    try {
      const response = await analyzeTrack(uri, name)
      set(state => ({ trackB: { ...state.trackB, bpm: response.data.bpm, key: response.data.key, isLoading: false } }))
    } catch (e) {
      set(state => ({ trackB: { ...state.trackB, isLoading: false } }))
      console.error(e)
    }
  },

  togglePlay: async () => {
    const isPlaying = await audioEngine.togglePlayA()
    set({ isPlaying })
    
    if (isPlaying) {
      const updateProgress = async () => {
        const progress = await audioEngine.getProgressA();
        set({ progress })
        if (audioEngine.isPlaying) {
          setTimeout(updateProgress, 1000)
        }
      }
      setTimeout(updateProgress, 1000)
    }
  },

  triggerTransition: async () => {
    const { trackA, trackB } = get()
    if (!trackA.bpm || !trackB.bpm) return
    
    set({ isTransitioning: true })
    
    try {
      const res = await fetch(`${API_URL}/v1/mix/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track1_bpm: trackA.bpm,
          track2_bpm: trackB.bpm
        })
      })
      
      if (!res.ok) throw new Error('Transition failed')
      const response = await res.json()
      
      await audioEngine.crossfadeToB(response.data.duration || 5)
    } catch (e) {
      console.error(e)
    } finally {
      set({ isTransitioning: false })
    }
  }
}))
