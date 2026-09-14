export class AudioEngine {
  private ctx: AudioContext | null = null;
  private deckA: HTMLAudioElement;
  private deckB: HTMLAudioElement;
  private sourceA: MediaElementAudioSourceNode | null = null;
  private sourceB: MediaElementAudioSourceNode | null = null;
  private gainA: GainNode | null = null;
  private gainB: GainNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.deckA = new Audio();
      this.deckB = new Audio();
    } else {
      this.deckA = {} as HTMLAudioElement;
      this.deckB = {} as HTMLAudioElement;
    }
  }

  init() {
    if (this.ctx || typeof window === 'undefined') return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.gainA = this.ctx.createGain();
    this.gainB = this.ctx.createGain();
    
    this.sourceA = this.ctx.createMediaElementSource(this.deckA);
    this.sourceB = this.ctx.createMediaElementSource(this.deckB);

    this.sourceA.connect(this.gainA);
    this.gainA.connect(this.ctx.destination);

    this.sourceB.connect(this.gainB);
    this.gainB.connect(this.ctx.destination);
    
    this.gainA.gain.value = 1;
    this.gainB.gain.value = 0;
  }

  async loadTrackA(file: File) {
    const url = URL.createObjectURL(file);
    this.deckA.src = url;
    this.deckA.load();
  }

  async loadTrackB(file: File) {
    const url = URL.createObjectURL(file);
    this.deckB.src = url;
    this.deckB.load();
  }

  togglePlayA(): boolean {
    this.init();
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
    
    if (this.deckA.paused) {
      this.deckA.play().catch(e => console.error("Playback failed", e));
      return true;
    } else {
      this.deckA.pause();
      return false;
    }
  }

  get isPlaying() {
    return !this.deckA.paused;
  }

  get progressA() {
    if (!this.deckA.duration) return 0;
    return (this.deckA.currentTime / this.deckA.duration) * 100;
  }

  seekA(percent: number) {
    if (!this.deckA.duration) return;
    this.deckA.currentTime = (percent / 100) * this.deckA.duration;
  }

  skipA(seconds: number) {
    if (!this.deckA.duration) return;
    this.deckA.currentTime = Math.max(0, Math.min(this.deckA.duration, this.deckA.currentTime + seconds));
  }

  crossfadeToB(durationSeconds: number) {
    if (!this.ctx || !this.gainA || !this.gainB) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.deckB.play().catch(e => console.error("Deck B Playback failed", e));

    const currTime = this.ctx.currentTime;
    
    // Ramp A down
    this.gainA.gain.setValueAtTime(this.gainA.gain.value, currTime);
    this.gainA.gain.linearRampToValueAtTime(0, currTime + durationSeconds);

    // Ramp B up
    this.gainB.gain.setValueAtTime(this.gainB.gain.value, currTime);
    this.gainB.gain.linearRampToValueAtTime(1, currTime + durationSeconds);
  }
}

export const audioEngine = typeof window !== 'undefined' ? new AudioEngine() : null;
