/**
 * Web Audio API synthesizer for retro-cyber audio effects
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // ボタン押下音
  public playClick(freq = 600, duration = 0.06) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // AudioContext error safeguard
    }
  }

  // エレベーター上昇音
  public playElevator() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const duration = 0.8;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(587.33, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + duration * 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {}
  }

  // 成功・通過・正解音
  public playSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = this.ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch {}
  }

  // 煽り耐性ゼロ/エラー警告ブザー
  public playBuzzer() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.setValueAtTime(120, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch {}
  }

  // 楽器サウンド
  public playInstrument(type: 'drum' | 'piano' | 'guitar', freq: number) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const t = this.ctx.currentTime;
      
      if (type === 'drum') {
        // Kick drum like sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.3);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
      } else if (type === 'piano') {
        // Simple piano-like sine with quick attack and slow decay
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
        
        // Add a bit of harmonics
        const osc2 = this.ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, t);
        const gain2 = this.ctx.createGain();
        gain2.gain.setValueAtTime(0, t);
        gain2.gain.linearRampToValueAtTime(0.05, t + 0.02);
        gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        
        osc.connect(gain);
        osc2.connect(gain2);
        gain.connect(this.ctx.destination);
        gain2.connect(this.ctx.destination);
        
        osc.start(t);
        osc2.start(t);
        osc.stop(t + 0.8);
        osc2.stop(t + 0.5);
      } else if (type === 'guitar') {
        // Plucked string like sound
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        
        // Filter to simulate plucking
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, t);
        filter.frequency.exponentialRampToValueAtTime(100, t + 0.5);
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(t);
        osc.stop(t + 1.0);
      }
    } catch {}
  }

  // 完全ILI消灯・電源遮断音
  public playPowerDown() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.8);
    } catch {}
  }

  // 🦋 羽化・メタモルフォーゼ神秘音
  public playMetamorphosis() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      chords.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = this.ctx.currentTime + idx * 0.12;
        gain.gain.setValueAtTime(0.06, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.2);
      });
    } catch {}
  }

  // ダーリンちゃんFe甘い音
  public playSweetFe() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [659.25, 783.99, 987.77, 1174.66];
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const st = this.ctx.currentTime + i * 0.07;
        gain.gain.setValueAtTime(0.08, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(st);
        osc.stop(st + 0.3);
      });
    } catch {}
  }

  // 筋肉パンプ音
  public playMuscle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {}
  }
}

export const sound = new SoundEngine();
