class GameAudio {
  constructor() {
    this.ctx = null;
    this.bgGain = null;
    this.bgPlaying = false;
    this.bgTimeout = null;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 1;
    this.masterGain.connect(this.ctx.destination);
    this.bgGain = this.ctx.createGain();
    this.bgGain.gain.value = 0.07;
    this.bgGain.connect(this.masterGain);
  }

  setMuted(m) {
    if (this.masterGain) this.masterGain.gain.value = m ? 0 : 1;
  }

  _t(f, s, d, ty = "sine", v = 0.15, dest = null) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = ty;
    o.frequency.value = f;
    g.gain.setValueAtTime(0, s);
    g.gain.linearRampToValueAtTime(v, s + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, s + d);
    o.connect(g).connect(dest || this.masterGain);
    o.start(s);
    o.stop(s + d + 0.01);
  }

  playSuccess() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this._t(f, t + i * 0.08, 0.35, "sine", 0.18));
    this._t(2093, t + 0.25, 0.45, "triangle", 0.08);
  }

  playStreak() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98].forEach((f, i) =>
      this._t(f, t + i * 0.06, 0.4, i < 4 ? "sine" : "triangle", 0.15)
    );
  }

  playFail() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [392, 349.23, 311.13].forEach((f, i) => this._t(f, t + i * 0.12, 0.3, "sawtooth", 0.09));
  }

  playFanfare() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [[523.25, 659.25, 783.99], [587.33, 739.99, 880], [659.25, 830.61, 987.77], [783.99, 987.77, 1174.66], [1046.5, 1318.51, 1567.98]]
      .forEach((ch, ci) => ch.forEach(f =>
        this._t(f, t + ci * 0.18, ci === 4 ? 0.9 : 0.4, ci < 4 ? "sine" : "triangle", ci === 4 ? 0.14 : 0.1)
      ));
  }

  playLevelFail() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [392, 349.23, 311.13, 261.63].forEach((f, i) => this._t(f, t + i * 0.2, 0.5, "triangle", 0.12));
  }

  startBgMusic() {
    if (!this.ctx || this.bgPlaying) return;
    this.bgPlaying = true;
    this._loop();
  }

  _loop() {
    if (!this.bgPlaying || !this.ctx) return;
    const t = this.ctx.currentTime, bt = 0.5, bar = 2;
    const ch = [
      { r: 220, n: [220, 261.63, 329.63] },
      { r: 174.61, n: [174.61, 220, 261.63] },
      { r: 261.63, n: [261.63, 329.63, 392] },
      { r: 196, n: [196, 246.94, 293.66] },
    ];
    ch.forEach((c, ci) => {
      c.n.forEach(f => {
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = "sine";
        o.frequency.value = f;
        const s = t + ci * bar;
        g.gain.setValueAtTime(0, s);
        g.gain.linearRampToValueAtTime(0.06, s + 0.1);
        g.gain.setValueAtTime(0.06, s + bar - 0.15);
        g.gain.linearRampToValueAtTime(0, s + bar);
        o.connect(g).connect(this.bgGain);
        o.start(s);
        o.stop(s + bar + 0.01);
      });
      [0, 1, 2, 3].forEach(bi =>
        this._t(c.r / 2, t + ci * bar + bi * bt, bt * 0.8, "triangle", bi === 0 ? 0.12 : 0.06, this.bgGain)
      );
    });

    [
      { f: 523.25, s: 0, d: 0.5 }, { f: 587.33, s: 0.5, d: 0.25 }, { f: 523.25, s: 1, d: 0.5 },
      { f: 440, s: 1.75, d: 0.25 }, { f: 523.25, s: 2, d: 0.75 }, { f: 440, s: 2.75, d: 0.25 },
      { f: 392, s: 3, d: 0.5 }, { f: 349.23, s: 3.5, d: 0.5 }, { f: 523.25, s: 4, d: 0.5 },
      { f: 659.25, s: 4.5, d: 0.5 }, { f: 783.99, s: 5, d: 0.5 }, { f: 659.25, s: 5.5, d: 0.5 },
      { f: 587.33, s: 6, d: 1 }, { f: 523.25, s: 7, d: 0.75 },
    ].forEach(({ f, s, d }) => {
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      const st = t + s * bt;
      g.gain.setValueAtTime(0, st);
      g.gain.linearRampToValueAtTime(0.04, st + 0.03);
      g.gain.setValueAtTime(0.04, st + d * bt - 0.05);
      g.gain.linearRampToValueAtTime(0, st + d * bt);
      o.connect(g).connect(this.bgGain);
      o.start(st);
      o.stop(st + d * bt + 0.01);
    });

    for (let i = 0; i < 32; i++) {
      const s = t + i * (bt / 2), bs = this.ctx.sampleRate * 0.03;
      const buf = this.ctx.createBuffer(1, bs, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let j = 0; j < bs; j++) d[j] = (Math.random() * 2 - 1) * 0.3;
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const g = this.ctx.createGain(), hp = this.ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 8000;
      g.gain.setValueAtTime(i % 2 === 0 ? 0.08 : 0.03, s);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.05);
      src.connect(hp).connect(g).connect(this.bgGain);
      src.start(s);
    }

    for (let ci = 0; ci < 4; ci++) {
      [0, 2].forEach(bi => {
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = "sine";
        const s = t + ci * bar + bi * bt;
        o.frequency.setValueAtTime(150, s);
        o.frequency.exponentialRampToValueAtTime(40, s + 0.08);
        g.gain.setValueAtTime(0.15, s);
        g.gain.exponentialRampToValueAtTime(0.001, s + 0.15);
        o.connect(g).connect(this.bgGain);
        o.start(s);
        o.stop(s + 0.2);
      });
      [1, 3].forEach(bi => {
        const s = t + ci * bar + bi * bt, bs = this.ctx.sampleRate * 0.08;
        const buf = this.ctx.createBuffer(1, bs, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let j = 0; j < bs; j++) d[j] = Math.random() * 2 - 1;
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        const g = this.ctx.createGain(), bp = this.ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 3000;
        bp.Q.value = 1;
        g.gain.setValueAtTime(0.08, s);
        g.gain.exponentialRampToValueAtTime(0.001, s + 0.1);
        src.connect(bp).connect(g).connect(this.bgGain);
        src.start(s);
      });
    }

    this.bgTimeout = setTimeout(() => this._loop(), 4 * bar * 1000 - 50);
  }

  stopBgMusic() {
    this.bgPlaying = false;
    if (this.bgTimeout) clearTimeout(this.bgTimeout);
  }

  setBgVolume(v) {
    if (this.bgGain) this.bgGain.gain.value = v;
  }
}

const audio = new GameAudio();
export default audio;
