import { Audio } from 'expo-av';

export class AudioEngine {
  private deckA: Audio.Sound | null = null;
  private deckB: Audio.Sound | null = null;
  private playingDeckA: boolean = false;

  constructor() {
    this.init();
  }

  async init() {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldRouteThroughEarpiece: false,
    });
  }

  async loadTrackA(uri: string) {
    if (this.deckA) await this.deckA.unloadAsync();
    const { sound } = await Audio.Sound.createAsync({ uri });
    this.deckA = sound;
  }

  async loadTrackB(uri: string) {
    if (this.deckB) await this.deckB.unloadAsync();
    const { sound } = await Audio.Sound.createAsync({ uri });
    this.deckB = sound;
  }

  async togglePlayA(): Promise<boolean> {
    if (!this.deckA) return false;
    const status = await this.deckA.getStatusAsync();
    if (!status.isLoaded) return false;
    
    if (status.isPlaying) {
      await this.deckA.pauseAsync();
      this.playingDeckA = false;
    } else {
      await this.deckA.playAsync();
      this.playingDeckA = true;
    }
    return this.playingDeckA;
  }

  get isPlaying() {
    return this.playingDeckA;
  }

  async getProgressA(): Promise<number> {
    if (!this.deckA) return 0;
    const status = await this.deckA.getStatusAsync();
    if (status.isLoaded && status.positionMillis && status.durationMillis) {
      return (status.positionMillis / status.durationMillis) * 100;
    }
    return 0;
  }

  async crossfadeToB(durationSeconds: number) {
    if (!this.deckA || !this.deckB) return;
    
    await this.deckB.setVolumeAsync(0);
    await this.deckB.playAsync();

    const steps = 20;
    const intervalMs = (durationSeconds * 1000) / steps;
    let step = 0;

    const interval = setInterval(async () => {
      step++;
      const volumeB = step / steps;
      const volumeA = 1 - volumeB;
      
      try {
        if (this.deckA) await this.deckA.setVolumeAsync(volumeA);
        if (this.deckB) await this.deckB.setVolumeAsync(volumeB);
      } catch (e) {
        console.error("Volume adjustment error:", e);
      }

      if (step >= steps) {
        clearInterval(interval);
        if (this.deckA) {
          try {
            await this.deckA.stopAsync();
          } catch (e) {}
          this.playingDeckA = false;
        }
      }
    }, intervalMs);
  }
}

export const audioEngine = new AudioEngine();
