/**
 * Moteur sonore procédural — Archipel, et aiguillage vers les sons de Néo-Métro (metro-sounds.ts).
 * Tous les sons sont synthétisés avec la Web Audio API : aucun fichier audio
 * à télécharger (léger sur réseau lent) et aucun problème de droits.
 *
 * Les noms d'effets sont neutres (« enter », « whoosh »…) : un autre univers
 * (Néo-Métro) pourra fournir ses propres sons pour les mêmes noms.
 *
 * Le contexte audio ne démarre qu'après un geste de l'utilisateur (`unlock()`).
 */

import { MetroSounds } from "./metro-sounds";

export type UniverseId = "archipel" | "metro";

export type SfxName =
  | "hover"
  | "click"
  | "pick"
  | "drop"
  | "page"
  | "correct"
  | "wrong"
  | "xp"
  | "levelUp"
  | "unlock"
  | "enter"
  | "whoosh"
  | "bossHit"
  | "bossRoar"
  | "victory"
  | "defeat";

// Pentatonique majeure de do : sonorité lumineuse, « tropicale »
const PENTA = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private ambientBus: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private ambientNodes: AudioNode[] = [];
  private ambientTimers: number[] = [];
  private ambientOn = false;
  private lastHover = 0;
  private universe: UniverseId = "archipel";
  private readonly metro = new MetroSounds(() =>
    this.ctx && this.sfxBus && this.ambientBus && this.noiseBuffer
      ? { ctx: this.ctx, sfx: this.sfxBus, ambient: this.ambientBus, noise: this.noiseBuffer }
      : null,
  );

  get ready() {
    return this.ctx !== null && this.ctx.state === "running";
  }

  /** À appeler dans un gestionnaire de clic / touche. */
  async unlock() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.8;
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      this.master.connect(comp).connect(this.ctx.destination);
      this.sfxBus = this.ctx.createGain();
      this.sfxBus.gain.value = 0.9;
      this.sfxBus.connect(this.master);
      this.ambientBus = this.ctx.createGain();
      this.ambientBus.gain.value = 0;
      this.ambientBus.connect(this.master);
      this.noiseBuffer = this.makeNoise();
    }
    if (this.ctx.state === "suspended") await this.ctx.resume();
  }

  setMuted(muted: boolean) {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(muted ? 0 : 0.8, t, 0.08);
  }

  /** Change d'univers sonore : l'ambiance en cours s'éteint en fondu, la nouvelle démarre. */
  setUniverse(universe: UniverseId) {
    if (universe === this.universe) return;
    const wasOn = this.ambientOn;
    if (wasOn) this.stopAmbient();
    this.universe = universe;
    if (wasOn) window.setTimeout(() => this.startAmbient(), 1300);
  }

  // ───────────────────────── Ambiance : bord de mer ─────────────────────────

  startAmbient() {
    if (!this.ctx || !this.ambientBus || this.ambientOn) return;
    this.ambientOn = true;
    if (this.universe === "metro") {
      const t = this.ctx.currentTime;
      this.ambientBus.gain.cancelScheduledValues(t);
      this.ambientBus.gain.setValueAtTime(this.ambientBus.gain.value, t);
      this.ambientBus.gain.linearRampToValueAtTime(0.6, t + 4);
      this.metro.startAmbient();
      return;
    }
    const ctx = this.ctx;
    const t = ctx.currentTime;
    this.ambientBus.gain.cancelScheduledValues(t);
    this.ambientBus.gain.setValueAtTime(this.ambientBus.gain.value, t);
    this.ambientBus.gain.linearRampToValueAtTime(0.6, t + 4);

    // Deux couches de vagues : bruit filtré dont le volume monte et descend lentement
    for (const [rate, cutoff, vol, pan] of [
      [0.09, 520, 0.16, -0.5],
      [0.13, 900, 0.1, 0.5],
    ] as const) {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      src.loop = true;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = cutoff;
      const swell = ctx.createGain();
      swell.gain.value = vol;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = rate;
      const lfoDepth = ctx.createGain();
      lfoDepth.gain.value = vol * 0.95;
      lfo.connect(lfoDepth).connect(swell.gain);
      const panner = ctx.createStereoPanner();
      panner.pan.value = pan;
      src.connect(lp).connect(swell).connect(panner).connect(this.ambientBus);
      src.start(t, Math.random() * 1.5);
      lfo.start(t);
      this.ambientNodes.push(src, lp, swell, lfo, lfoDepth, panner);
    }

    const loop = (fn: () => void, min: number, max: number) => {
      const tick = () => {
        if (!this.ambientOn) return;
        fn();
        this.ambientTimers.push(window.setTimeout(tick, min + Math.random() * (max - min)));
      };
      this.ambientTimers.push(window.setTimeout(tick, min + Math.random() * (max - min)));
    };
    loop(() => this.seagull(), 6000, 15000);
    loop(() => this.bell(this.ambientBus!, 0.05), 14000, 30000);
    loop(() => this.melody(), 4200, 8500);
    loop(() => this.creak(), 9000, 20000);
  }

  stopAmbient() {
    if (!this.ctx || !this.ambientBus || !this.ambientOn) return;
    this.ambientOn = false;
    const t = this.ctx.currentTime;
    this.ambientBus.gain.cancelScheduledValues(t);
    this.ambientBus.gain.setValueAtTime(this.ambientBus.gain.value, t);
    this.ambientBus.gain.linearRampToValueAtTime(0, t + 1.2);
    this.metro.stopAmbient();
    this.ambientTimers.forEach((id) => window.clearTimeout(id));
    this.ambientTimers = [];
    const nodes = this.ambientNodes;
    this.ambientNodes = [];
    window.setTimeout(() => {
      for (const n of nodes) {
        if (n instanceof AudioScheduledSourceNode) n.stop();
        n.disconnect();
      }
    }, 1400);
  }

  /** Cri de mouette : glissando aigu avec léger vibrato, au loin */
  private seagull() {
    const ctx = this.ctx!;
    const cries = 1 + Math.floor(Math.random() * 3);
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.6 - 0.8;
    pan.connect(this.ambientBus!);
    for (let i = 0; i < cries; i++) {
      const t = ctx.currentTime + i * 0.32;
      const o = ctx.createOscillator();
      o.type = "triangle";
      const f = 1500 + Math.random() * 400;
      o.frequency.setValueAtTime(f * 0.8, t);
      o.frequency.linearRampToValueAtTime(f, t + 0.05);
      o.frequency.exponentialRampToValueAtTime(f * 0.62, t + 0.26);
      const vib = ctx.createOscillator();
      vib.frequency.value = 28;
      const vibDepth = ctx.createGain();
      vibDepth.gain.value = 40;
      vib.connect(vibDepth).connect(o.frequency);
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1600;
      bp.Q.value = 2;
      const g = this.env(t, 0.03, 0.26, 0.035);
      o.connect(bp).connect(g).connect(pan);
      o.start(t);
      vib.start(t);
      o.stop(t + 0.35);
      vib.stop(t + 0.35);
    }
  }

  /** Quelques notes de marimba, comme une musique de port au loin */
  private melody() {
    const t = this.ctx!.currentTime;
    const start = Math.floor(Math.random() * 4);
    const count = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const note = PENTA[(start + i * (Math.random() > 0.5 ? 1 : 2)) % PENTA.length];
      this.marimba(note, t + i * 0.24, 0.05, this.ambientBus!);
    }
  }

  /** Craquement du bois de la coque */
  private creak() {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const n = ctx.createBufferSource();
    n.buffer = this.noiseBuffer;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 18;
    bp.frequency.setValueAtTime(380, t);
    bp.frequency.linearRampToValueAtTime(240, t + 0.5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.09, t + 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    n.connect(bp).connect(g).connect(this.ambientBus!);
    n.start(t, Math.random());
    n.stop(t + 0.65);
  }

  // ───────────────────────── Effets ─────────────────────────

  play(name: SfxName) {
    if (!this.ready || !this.sfxBus) return;
    if (this.universe === "metro" && this.metro.play(name)) return;
    const t = this.ctx!.currentTime;
    switch (name) {
      case "hover": {
        if (performance.now() - this.lastHover < 60) return;
        this.lastHover = performance.now();
        this.droplet(t, 1400, 0.03);
        return;
      }
      case "click":
        this.woodKnock(t, 0.3);
        return;
      case "pick":
        this.woodKnock(t, 0.2, 620);
        return;
      case "drop":
        this.woodKnock(t, 0.25, 360);
        this.droplet(t + 0.04, 900, 0.03);
        return;
      case "page":
        this.noiseSweep(t, 0.22, 3200, 1000, 0.08);
        return;
      case "correct":
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.marimba(f, t + i * 0.06, 0.2));
        this.sparkle(t + 0.22, 5);
        return;
      case "wrong": {
        // « bonk » sourd puis petit plouf
        const o = this.ctx!.createOscillator();
        o.type = "sine";
        o.frequency.setValueAtTime(240, t);
        o.frequency.exponentialRampToValueAtTime(90, t + 0.25);
        const g = this.env(t, 0.004, 0.3, 0.35);
        o.connect(g).connect(this.sfxBus);
        o.start(t);
        o.stop(t + 0.35);
        this.splash(t + 0.08, 0.12);
        return;
      }
      case "xp":
        this.tone("square", 1975 + Math.random() * 100, t, 0.05, 0.035);
        this.tone("square", 2637, t + 0.045, 0.06, 0.03);
        return;
      case "levelUp":
        // fanfare de tambour d'acier, accord, cloche
        [392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.steelDrum(f, t + i * 0.1, 0.22));
        [523.25, 659.25, 783.99].forEach((f) => this.steelDrum(f, t + 0.6, 0.18));
        this.bell(this.sfxBus, 0.12, t + 0.6);
        this.sparkle(t + 0.6, 8);
        return;
      case "unlock": {
        // couvercle du coffre qui grince, puis pluie de pièces
        const n = this.ctx!.createBufferSource();
        n.buffer = this.noiseBuffer;
        const bp = this.ctx!.createBiquadFilter();
        bp.type = "bandpass";
        bp.Q.value = 14;
        bp.frequency.setValueAtTime(300, t);
        bp.frequency.linearRampToValueAtTime(700, t + 0.3);
        const g = this.env(t, 0.05, 0.3, 0.2);
        n.connect(bp).connect(g).connect(this.sfxBus);
        n.start(t, Math.random());
        n.stop(t + 0.4);
        for (let i = 0; i < 9; i++) this.tone("square", 1800 + Math.random() * 1400, t + 0.3 + i * 0.045, 0.06, 0.025);
        return;
      }
      case "enter":
        // cloche du bateau + voile qui se gonfle
        this.bell(this.sfxBus, 0.18, t);
        this.noiseSweep(t + 0.1, 1.0, 300, 1200, 0.18);
        return;
      case "whoosh":
        this.splash(t, 0.2);
        return;
      case "bossHit":
        this.splash(t, 0.35);
        this.thud(t, 120, 0.25, 0.6);
        return;
      case "bossRoar": {
        // grondement de créature marine + bulles
        const o = this.ctx!.createOscillator();
        o.type = "sawtooth";
        o.frequency.setValueAtTime(65, t);
        o.frequency.linearRampToValueAtTime(95, t + 0.5);
        o.frequency.exponentialRampToValueAtTime(42, t + 1.6);
        const trem = this.ctx!.createOscillator();
        trem.frequency.value = 17;
        const tremGain = this.ctx!.createGain();
        tremGain.gain.value = 14;
        trem.connect(tremGain).connect(o.frequency);
        const lp = this.ctx!.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 500;
        const g = this.env(t, 0.2, 1.5, 0.4);
        o.connect(lp).connect(g).connect(this.sfxBus);
        o.start(t);
        trem.start(t);
        o.stop(t + 1.8);
        trem.stop(t + 1.8);
        this.bubbles(t + 0.3, 10);
        return;
      }
      case "victory":
        [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => this.steelDrum(f, t + i * 0.09, 0.2));
        [523.25, 659.25, 783.99].forEach((f) => this.marimba(f, t + 0.55, 0.18));
        this.sparkle(t + 0.5, 10);
        return;
      case "defeat":
        [659.25, 587.33, 523.25, 392].forEach((f, i) => this.marimba(f, t + i * 0.2, 0.16));
        this.bubbles(t + 0.8, 8);
        return;
    }
  }

  // ───────────────────────── Briques ─────────────────────────

  private makeNoise() {
    const ctx = this.ctx!;
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  private env(t: number, attack: number, decay: number, peak: number) {
    const g = this.ctx!.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    return g;
  }

  private tone(type: OscillatorType, freq: number, t: number, dur: number, vol: number) {
    const o = this.ctx!.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    const g = this.env(t, 0.005, dur, vol);
    o.connect(g).connect(this.sfxBus!);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  /** Marimba : fondamentale + harmonique 4 très brève */
  private marimba(freq: number, t: number, vol: number, bus: AudioNode = this.sfxBus!) {
    const ctx = this.ctx!;
    for (const [mult, v, decay] of [
      [1, vol, 0.55],
      [4, vol * 0.35, 0.08],
    ] as const) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = freq * mult;
      const g = this.env(t, 0.003, decay, v);
      o.connect(g).connect(bus);
      o.start(t);
      o.stop(t + decay + 0.05);
    }
  }

  /** Tambour d'acier : partiels légèrement désaccordés */
  private steelDrum(freq: number, t: number, vol: number) {
    const ctx = this.ctx!;
    for (const [mult, v] of [
      [1, vol],
      [2.01, vol * 0.5],
      [3.02, vol * 0.2],
    ] as const) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = freq * mult;
      const g = this.env(t, 0.004, 0.7, v);
      o.connect(g).connect(this.sfxBus!);
      o.start(t);
      o.stop(t + 0.8);
    }
  }

  /** Cloche de navire : partiels inharmoniques à longue résonance */
  private bell(bus: AudioNode, vol: number, t = this.ctx!.currentTime) {
    const ctx = this.ctx!;
    const base = 660;
    for (const [mult, v, decay] of [
      [1, vol, 2.4],
      [2.76, vol * 0.5, 1.4],
      [5.4, vol * 0.25, 0.8],
      [0.5, vol * 0.3, 2.8],
    ] as const) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = base * mult;
      const g = this.env(t, 0.004, decay, v);
      o.connect(g).connect(bus);
      o.start(t);
      o.stop(t + decay + 0.1);
    }
  }

  private woodKnock(t: number, vol: number, freq = 480) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 0.7, t + 0.08);
    const g = this.env(t, 0.002, 0.09, vol);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = freq * 1.5;
    bp.Q.value = 3;
    o.connect(bp).connect(g).connect(this.sfxBus!);
    o.start(t);
    o.stop(t + 0.12);
  }

  private droplet(t: number, freq: number, vol: number) {
    const o = this.ctx!.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 2.2, t + 0.05);
    const g = this.env(t, 0.003, 0.07, vol);
    o.connect(g).connect(this.sfxBus!);
    o.start(t);
    o.stop(t + 0.1);
  }

  private bubbles(t: number, count: number) {
    for (let i = 0; i < count; i++) this.droplet(t + i * (0.05 + Math.random() * 0.08), 500 + Math.random() * 700, 0.05);
  }

  private sparkle(t: number, count: number) {
    for (let i = 0; i < count; i++) this.tone("sine", 2600 + Math.random() * 2200, t + i * 0.04, 0.12, 0.022);
  }

  private splash(t: number, vol: number) {
    this.noiseSweep(t, 0.45, 2400, 400, vol);
    this.bubbles(t + 0.15, 4);
  }

  private thud(t: number, freq: number, dur: number, vol: number) {
    const o = this.ctx!.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * 0.4), t + dur);
    const g = this.env(t, 0.003, dur, vol);
    o.connect(g).connect(this.sfxBus!);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private noiseSweep(t: number, dur: number, from: number, to: number, vol: number) {
    const ctx = this.ctx!;
    const n = ctx.createBufferSource();
    n.buffer = this.noiseBuffer;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.1;
    bp.frequency.setValueAtTime(from, t);
    bp.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + dur * 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.connect(bp).connect(g).connect(this.sfxBus!);
    n.start(t, Math.random());
    n.stop(t + dur + 0.05);
  }
}

export const soundEngine = new SoundEngine();
