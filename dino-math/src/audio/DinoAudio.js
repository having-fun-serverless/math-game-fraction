class DinoAudio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.musicPlaying = false;
    this.musicTimeout = null;
    this.muted = false;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.muted ? 0 : 1;
    this.masterGain.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.09;
    this.musicGain.connect(this.masterGain);
  }

  setMuted(m) {
    this.muted = m;
    if (this.masterGain) this.masterGain.gain.value = m ? 0 : 1;
  }

  _tone(f, start, dur, type = 'sine', vol = 0.15, dest = null) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = f;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(vol, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    o.connect(g).connect(dest || this.masterGain);
    o.start(start); o.stop(start + dur + 0.02);
  }

  playJump() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(320, t);
    o.frequency.exponentialRampToValueAtTime(720, t + 0.12);
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    o.connect(g).connect(this.masterGain);
    o.start(t); o.stop(t + 0.16);
  }

  playDuck() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(480, t);
    o.frequency.exponentialRampToValueAtTime(160, t + 0.12);
    g.gain.setValueAtTime(0.1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    o.connect(g).connect(this.masterGain);
    o.start(t); o.stop(t + 0.16);
  }

  playCorrect() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      this._tone(f, t + i * 0.07, 0.25, 'square', 0.12));
  }

  playWrong() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [330, 247, 196].forEach((f, i) =>
      this._tone(f, t + i * 0.12, 0.3, 'sawtooth', 0.1));
  }

  playHit() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(220, t);
    o.frequency.exponentialRampToValueAtTime(55, t + 0.18);
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.connect(g).connect(this.masterGain);
    o.start(t); o.stop(t + 0.22);
  }

  playTopicComplete() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((f, i) =>
      this._tone(f, t + i * 0.11, 0.4, 'square', 0.13));
    this._tone(1567.98, t + 0.55, 0.6, 'triangle', 0.1);
  }

  startChiptune() {
    if (!this.ctx || this.musicPlaying) return;
    this.musicPlaying = true;
    this._chiptuneLoop();
  }

  _chiptuneLoop() {
    if (!this.musicPlaying || !this.ctx) return;
    const t = this.ctx.currentTime;
    const beat = 60 / 140;
    const N = 16;
    const bass = [65.41,65.41,98.0,98.0,110.0,110.0,87.31,87.31,
                  65.41,65.41,98.0,98.0,110.0,110.0,87.31,87.31];
    bass.forEach((f, i) => this._tone(f, t + i * beat, beat * 0.9, 'triangle', 0.09, this.musicGain));
    const melody = [523.25,659.25,783.99,659.25,587.33,739.99,880.0,739.99,
                    659.25,783.99,987.77,783.99,523.25,659.25,698.46,783.99];
    melody.forEach((f, i) => this._tone(f, t + i * beat, beat * 0.55, 'square', 0.07, this.musicGain));
    for (let i = 0; i < N; i++) {
      const s = t + i * beat;
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(140, s);
      o.frequency.exponentialRampToValueAtTime(40, s + 0.08);
      g.gain.setValueAtTime(0.14, s); g.gain.exponentialRampToValueAtTime(0.001, s + 0.12);
      o.connect(g).connect(this.musicGain); o.start(s); o.stop(s + 0.14);
    }
    this.musicTimeout = setTimeout(() => this._chiptuneLoop(), N * beat * 1000 - 60);
  }

  stopChiptune() {
    this.musicPlaying = false;
    if (this.musicTimeout) { clearTimeout(this.musicTimeout); this.musicTimeout = null; }
    if (this.musicGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(t);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, t);
      this.musicGain.gain.linearRampToValueAtTime(0, t + 0.05);
      setTimeout(() => { if (this.musicGain) this.musicGain.gain.value = 0.09; }, 120);
    }
  }
}

const audio = new DinoAudio();
export default audio;
