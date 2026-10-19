// Procedural Web Audio API weather soundscape generator (zero external audio files needed)

class WeatherAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private gainNode: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private filterNode: BiquadFilterNode | null = null;

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
  }

  public start(condition: string) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.stop();

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 1.5);
      this.gainNode.connect(this.ctx.destination);

      // Pink/Brown noise buffer for realistic rain/wind/ambient atmosphere
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.12;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      this.filterNode = this.ctx.createBiquadFilter();

      if (condition === 'rain' || condition === 'heavy-rain') {
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(950, this.ctx.currentTime);
      } else if (condition === 'thunderstorm') {
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(450, this.ctx.currentTime);
      } else if (condition === 'snow') {
        this.filterNode.type = 'bandpass';
        this.filterNode.frequency.setValueAtTime(600, this.ctx.currentTime);
      } else {
        // Soft summer breeze
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(350, this.ctx.currentTime);
      }

      whiteNoise.connect(this.filterNode);
      this.filterNode.connect(this.gainNode);
      whiteNoise.start(0);

      this.noiseNode = whiteNoise;
      this.isPlaying = true;
    } catch (e) {
      console.warn('Audio ambiance initialization warning:', e);
    }
  }

  public stop() {
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          if (this.noiseNode) {
            try {
              (this.noiseNode as AudioBufferSourceNode).stop();
              this.noiseNode.disconnect();
            } catch {}
            this.noiseNode = null;
          }
        }, 500);
      } catch {}
    }
    this.isPlaying = false;
  }

  public toggle(condition: string): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(condition);
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const weatherAudio = new WeatherAudioEngine();
