import type { SfxName } from "./sound-engine";

/**
 * Sons de Néo-Métro, synthétisés avec la Web Audio API (aucun fichier audio).
 * Ambiance : bourdonnement de la ville, rames qui passent au loin, carillon de station,
 * quelques notes de piano électrique. Effets : relais, tourniquet, portes, signal d'alarme.
 * Les noms d'effets sont ceux de l'Archipel : chaque univers fournit les siens.
 */

export type AudioKit = { ctx: AudioContext; sfx: AudioNode; ambient: AudioNode; noise: AudioBuffer };

// Pentatonique mineure de ré : sonorité nocturne et urbaine
const MINOR = [293.66, 349.23, 392.0, 440.0, 523.25, 587.33, 698.46];

export class MetroSounds {
  private on = false;
  private timers: number[] = [];
  private nodes: AudioNode[] = [];

  constructor(private readonly kit: () => AudioKit | null) {}

  // ───────────────────────── Ambiance ─────────────────────────

  startAmbient() {
    const k = this.kit();
    if (!k || this.on) return;
    this.on = true;
    const { ctx } = k;
    const t = ctx.currentTime;

    // Bourdonnement de la ville : bruit grave qui respire lentement + ronflement électrique
    const src = ctx.createBufferSource();
    src.buffer = k.noise;
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 170;
    const hum = ctx.createGain();
    hum.gain.value = 0.11;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 0.04;
    lfo.connect(lfoDepth).connect(hum.gain);
    src.connect(lp).connect(hum).connect(k.ambient);
    src.start(t, Math.random() * 1.5);
    lfo.start(t);
    this.nodes.push(src, lp, hum, lfo, lfoDepth);
    for (const [f, v] of [[55, 0.03], [110.5, 0.012]] as const) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = v;
      o.connect(g).connect(k.ambient);
      o.start(t);
      this.nodes.push(o, g);
    }

    const loop = (fn: () => void, min: number, max: number) => {
      const tick = () => {
        if (!this.on) return;
        fn();
        this.timers.push(window.setTimeout(tick, min + Math.random() * (max - min)));
      };
      this.timers.push(window.setTimeout(tick, min + Math.random() * (max - min)));
    };
    loop(() => this.trainPass(), 16000, 34000);
    loop(() => this.chime(), 28000, 55000);
    loop(() => this.piano(), 3500, 7000);
  }

  stopAmbient() {
    if (!this.on) return;
    this.on = false;
    this.timers.forEach((id) => window.clearTimeout(id));
    this.timers = [];
    const nodes = this.nodes;
    this.nodes = [];
    window.setTimeout(() => {
      for (const n of nodes) {
        if (n instanceof AudioScheduledSourceNode) n.stop();
        n.disconnect();
      }
    }, 1400);
  }

  /** Une rame passe au loin : grondement qui monte, traverse de gauche à droite, s'éloigne */
  private trainPass() {
    const k = this.kit();
    if (!k) return;
    const { ctx } = k;
    const t = ctx.currentTime;
    const dur = 7;
    const n = ctx.createBufferSource();
    n.buffer = k.noise;
    n.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.9;
    bp.frequency.setValueAtTime(180, t);
    bp.frequency.linearRampToValueAtTime(560, t + dur * 0.5);
    bp.frequency.linearRampToValueAtTime(200, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.13, t + dur * 0.5);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    const pan = ctx.createStereoPanner();
    pan.pan.setValueAtTime(-0.8, t);
    pan.pan.linearRampToValueAtTime(0.8, t + dur);
    n.connect(bp).connect(g).connect(pan).connect(k.ambient);
    n.start(t, Math.random());
    n.stop(t + dur + 0.1);
    // Claquement des rails
    for (let i = 0; i < 22; i++) {
      const at = t + 0.8 + i * 0.26;
      const swell = Math.sin((i / 22) * Math.PI);
      this.click(k, at, 0.05 * swell, pan);
    }
  }

  private click(k: AudioKit, t: number, vol: number, dest: AudioNode) {
    const n = k.ctx.createBufferSource();
    n.buffer = k.noise;
    const bp = k.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 900;
    bp.Q.value = 2;
    const g = k.ctx.createGain();
    g.gain.setValueAtTime(Math.max(vol, 0.0001), t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    n.connect(bp).connect(g).connect(dest);
    n.start(t, Math.random());
    n.stop(t + 0.07);
  }

  /** Carillon de station : « ding-dong » descendant */
  private chime() {
    const k = this.kit();
    if (!k) return;
    const t = k.ctx.currentTime;
    this.bellTone(k, k.ambient, 659.25, t, 0.05, 1.6);
    this.bellTone(k, k.ambient, 523.25, t + 0.6, 0.05, 2.0);
  }

  private bellTone(k: AudioKit, bus: AudioNode, f: number, t: number, vol: number, decay: number) {
    for (const [m, v] of [[1, vol], [2, vol * 0.25]] as const) {
      const o = k.ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f * m;
      const g = this.env(k, t, 0.005, decay / m, v);
      o.connect(g).connect(bus);
      o.start(t);
      o.stop(t + decay + 0.1);
    }
  }

  /** Quelques notes de piano électrique, comme une musique de quai lointaine */
  private piano() {
    const k = this.kit();
    if (!k) return;
    const t = k.ctx.currentTime;
    const start = Math.floor(Math.random() * 4);
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const f = MINOR[(start + i * (Math.random() > 0.4 ? 1 : 2)) % MINOR.length];
      this.bellTone(k, k.ambient, f, t + i * 0.42, 0.035, 1.1);
    }
  }

  // ───────────────────────── Effets ─────────────────────────

  /** Renvoie false si l'effet n'est pas propre à Néo-Métro (le moteur joue alors le son par défaut). */
  play(name: SfxName): boolean {
    const k = this.kit();
    if (!k) return true;
    const t = k.ctx.currentTime;
    switch (name) {
      case "hover":
        this.tone(k, "sine", 2400, t, 0.025, 0.02);
        return true;
      case "click":
        this.noise(k, t, 0.035, "highpass", 2500, 0.12);
        this.tone(k, "sine", 170, t, 0.07, 0.2, 110);
        return true;
      case "pick":
        this.tone(k, "square", 520, t, 0.04, 0.05);
        return true;
      case "drop":
        this.tone(k, "sine", 150, t, 0.1, 0.25, 90);
        this.noise(k, t, 0.05, "bandpass", 700, 0.08);
        return true;
      case "page":
        this.sweep(k, t, 0.14, 1800, 5200, 0.1);
        return true;
      case "correct":
        [659.25, 830.61, 987.77, 1318.5].forEach((f, i) => this.tone(k, "triangle", f, t + i * 0.07, 0.24, 0.08));
        this.bellTone(k, k.sfx, 1975.5, t + 0.28, 0.04, 0.8);
        return true;
      case "wrong":
        this.tone(k, "square", 120, t, 0.3, 0.1, 78, 700);
        return true;
      case "unlock":
        this.tone(k, "sine", 880, t, 0.1, 0.12);
        this.tone(k, "sine", 1318.5, t + 0.13, 0.18, 0.14);
        return true;
      case "enter":
        [0, 1, 2].forEach((i) => this.tone(k, "square", 1100, t + i * 0.13, 0.07, 0.04, undefined, 3000));
        this.sweep(k, t + 0.4, 0.7, 300, 1500, 0.15);
        return true;
      case "whoosh":
        this.sweep(k, t, 0.35, 400, 2400, 0.2);
        return true;
      case "levelUp":
        [293.66, 369.99, 440, 587.33, 739.99].forEach((f, i) => this.tone(k, "triangle", f, t + i * 0.09, 0.5, 0.1));
        [440, 587.33, 739.99].forEach((f) => this.tone(k, "triangle", f, t + 0.6, 0.9, 0.08));
        this.bellTone(k, k.sfx, 1174.7, t + 0.6, 0.05, 1.2);
        return true;
      case "bossHit":
        this.tone(k, "sawtooth", 1400, t, 0.26, 0.11, 140, 3000);
        this.noise(k, t, 0.2, "bandpass", 1800, 0.14);
        this.tone(k, "sine", 90, t, 0.3, 0.25, 40);
        return true;
      case "bossRoar": {
        [440, 330, 440, 330, 440, 330].forEach((f, i) => this.tone(k, "square", f, t + i * 0.24, 0.22, 0.06, undefined, 1500));
        this.tone(k, "sawtooth", 55, t, 1.6, 0.18, 38, 400);
        return true;
      }
      case "victory":
        [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => this.tone(k, "triangle", f, t + i * 0.08, 0.4, 0.1));
        [523.25, 659.25, 783.99].forEach((f) => this.tone(k, "triangle", f, t + 0.55, 0.8, 0.08));
        this.bellTone(k, k.sfx, 1568, t + 0.55, 0.05, 1.4);
        return true;
      case "defeat":
        [440, 392, 349.23, 293.66].forEach((f, i) => this.tone(k, "sawtooth", f, t + i * 0.2, 0.32, 0.07, undefined, 900));
        return true;
      default:
        return false;
    }
  }

  // ───────────────────────── Briques ─────────────────────────

  private env(k: AudioKit, t: number, attack: number, decay: number, peak: number) {
    const g = k.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    return g;
  }

  private tone(k: AudioKit, type: OscillatorType, freq: number, t: number, dur: number, vol: number, glideTo?: number, cutoff?: number) {
    const o = k.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    const g = this.env(k, t, 0.005, dur, vol);
    if (cutoff) {
      const lp = k.ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = cutoff;
      o.connect(lp).connect(g);
    } else {
      o.connect(g);
    }
    g.connect(k.sfx);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private noise(k: AudioKit, t: number, dur: number, filter: BiquadFilterType, freq: number, vol: number) {
    const n = k.ctx.createBufferSource();
    n.buffer = k.noise;
    const f = k.ctx.createBiquadFilter();
    f.type = filter;
    f.frequency.value = freq;
    const g = this.env(k, t, 0.002, dur, vol);
    n.connect(f).connect(g).connect(k.sfx);
    n.start(t, Math.random());
    n.stop(t + dur + 0.05);
  }

  private sweep(k: AudioKit, t: number, dur: number, from: number, to: number, vol: number) {
    const n = k.ctx.createBufferSource();
    n.buffer = k.noise;
    const bp = k.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.1;
    bp.frequency.setValueAtTime(from, t);
    bp.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = k.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + dur * 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.connect(bp).connect(g).connect(k.sfx);
    n.start(t, Math.random());
    n.stop(t + dur + 0.05);
  }
}
