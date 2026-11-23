/**
 * Moteur sonore procédural du donjon.
 * Tous les sons sont synthétisés avec la Web Audio API : aucun fichier audio
 * à télécharger (léger sur réseau lent) et aucun problème de droits.
 *
 * Le contexte audio ne démarre qu'après un geste de l'utilisateur
 * (règle des navigateurs) via `unlock()`.
 */

export type SfxName =
  | "hover"
  | "click"
  | "correct"
  | "wrong"
  | "xp"
  | "levelUp"
  | "unlock"
  | "door"
  | "torch"
  | "bossHit"
  | "bossRoar"
  | "victory"
  | "defeat"
  | "page"
  | "pick"
  | "drop";

type Ctx = AudioContext;

// Gamme de ré dorien : sonorité médiévale et mystérieuse
const D_DORIAN = [146.83, 164.81, 174.61, 196.0, 220.0, 246.94, 261.63, 293.66];

export class SoundEngine {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private ambientBus: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private ambientNodes: AudioNode[] = [];
  private ambientTimers: number[] = [];
  private ambientOn = false;
  private lastHover = 0;

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
      // Compresseur : évite la saturation quand plusieurs sons se superposent
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

  // ───────────────────────── Ambiance ─────────────────────────

  startAmbient() {
    if (!this.ctx || !this.ambientBus || this.ambientOn) return;
    this.ambientOn = true;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    this.ambientBus.gain.cancelScheduledValues(t);
    this.ambientBus.gain.setValueAtTime(this.ambientBus.gain.value, t);
    this.ambientBus.gain.linearRampToValueAtTime(0.55, t + 4);

    // 1. Bourdon grave : deux sinus légèrement désaccordés (battement lent)
    for (const [freq, vol] of [
      [55, 0.16],
      [55.4, 0.12],
      [82.4, 0.05],
    ] as const) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = vol;
      o.connect(g).connect(this.ambientBus);
      o.start();
      this.ambientNodes.push(o, g);
    }

    // 2. Vent dans les galeries : bruit filtré dont la fréquence ondule
    const wind = ctx.createBufferSource();
    wind.buffer = this.noiseBuffer;
    wind.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 420;
    bp.Q.value = 0.9;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain).connect(bp.frequency);
    const windGain = ctx.createGain();
    windGain.gain.value = 0.05;
    wind.connect(bp).connect(windGain).connect(this.ambientBus);
    wind.start();
    lfo.start();
    this.ambientNodes.push(wind, bp, lfo, lfoGain, windGain);

    // 3. Gouttes d'eau aléatoires, 4. crépitements de torche, 5. harpe lointaine
    const loop = (fn: () => void, min: number, max: number) => {
      const tick = () => {
        if (!this.ambientOn) return;
        fn();
        this.ambientTimers.push(window.setTimeout(tick, min + Math.random() * (max - min)));
      };
      this.ambientTimers.push(window.setTimeout(tick, min + Math.random() * (max - min)));
    };
    loop(() => this.drip(), 2200, 6500);
    loop(() => this.crackle(), 700, 2600);
    loop(() => this.harp(), 3800, 7600);
  }

  stopAmbient() {
    if (!this.ctx || !this.ambientBus || !this.ambientOn) return;
    this.ambientOn = false;
    const t = this.ctx.currentTime;
    this.ambientBus.gain.cancelScheduledValues(t);
    this.ambientBus.gain.setValueAtTime(this.ambientBus.gain.value, t);
    this.ambientBus.gain.linearRampToValueAtTime(0, t + 1.2);
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

  private drip() {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sine";
    const f = 900 + Math.random() * 900;
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 2.4, t + 0.06);
    const g = this.env(t, 0.003, 0.18, 0.07);
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.6 - 0.8;
    const verb = this.echo(0.21, 0.42, this.ambientBus!);
    o.connect(g).connect(pan).connect(verb);
    o.start(t);
    o.stop(t + 0.3);
  }

  private crackle() {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const n = ctx.createBufferSource();
    n.buffer = this.noiseBuffer;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 2400;
    const g = this.env(t, 0.001, 0.03, 0.02 + Math.random() * 0.03);
    n.connect(hp).connect(g).connect(this.ambientBus!);
    n.start(t, Math.random());
    n.stop(t + 0.06);
  }

  private harp() {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const base = D_DORIAN[Math.floor(Math.random() * D_DORIAN.length)] * 2;
    const notes = Math.random() > 0.6 ? [base, base * 1.5] : [base];
    notes.forEach((f, i) => this.pluck(f, t + i * 0.32, 0.035, this.ambientBus!));
  }

  // ───────────────────────── Effets ─────────────────────────

  play(name: SfxName) {
    if (!this.ready || !this.sfxBus) return;
    const t = this.ctx!.currentTime;
    switch (name) {
      case "hover": {
        if (performance.now() - this.lastHover < 60) return;
        this.lastHover = performance.now();
        this.tone("triangle", 1320, t, 0.04, 0.025);
        return;
      }
      case "click":
        this.thud(t, 180, 0.12, 0.25);
        this.tone("square", 760, t, 0.03, 0.03);
        return;
      case "pick":
        this.tone("triangle", 520, t, 0.05, 0.08, 780);
        return;
      case "drop":
        this.thud(t, 140, 0.08, 0.2);
        this.tone("triangle", 660, t, 0.05, 0.05);
        return;
      case "page":
        this.noiseSweep(t, 0.22, 3000, 900, 0.07);
        return;
      case "correct": {
        // arpège ascendant lumineux + scintillement
        [587.33, 739.99, 880, 1174.66].forEach((f, i) => this.pluck(f, t + i * 0.055, 0.16));
        this.shimmer(t + 0.18);
        return;
      }
      case "wrong": {
        const o = this.ctx!.createOscillator();
        o.type = "sawtooth";
        o.frequency.setValueAtTime(220, t);
        o.frequency.exponentialRampToValueAtTime(70, t + 0.35);
        const lp = this.ctx!.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 900;
        const g = this.env(t, 0.005, 0.38, 0.22);
        o.connect(lp).connect(g).connect(this.sfxBus);
        o.start(t);
        o.stop(t + 0.45);
        this.thud(t, 90, 0.3, 0.45);
        return;
      }
      case "xp":
        this.tone("square", 1568 + Math.random() * 120, t, 0.06, 0.04, 2093);
        return;
      case "levelUp": {
        // petite fanfare : ré – fa# – la – ré, puis accord tenu
        const seq = [293.66, 369.99, 440, 587.33];
        seq.forEach((f, i) => {
          this.tone("sawtooth", f, t + i * 0.11, 0.18, 0.07);
          this.tone("square", f * 2, t + i * 0.11, 0.12, 0.025);
        });
        [293.66, 369.99, 440, 587.33].forEach((f) => this.pad(f, t + 0.48, 1.4, 0.07));
        this.shimmer(t + 0.5);
        this.shimmer(t + 0.8);
        return;
      }
      case "unlock": {
        // serrure + coffre qui s'ouvre + carillon
        this.thud(t, 300, 0.05, 0.3);
        this.thud(t + 0.09, 220, 0.06, 0.3);
        this.noiseSweep(t + 0.14, 0.4, 600, 2600, 0.12);
        [880, 1108.73, 1318.51, 1760].forEach((f, i) => this.pluck(f, t + 0.3 + i * 0.07, 0.12));
        return;
      }
      case "door": {
        // lourde porte de pierre qui glisse
        this.noiseSweep(t, 1.6, 120, 380, 0.35);
        this.thud(t + 1.45, 60, 0.6, 0.7);
        return;
      }
      case "torch":
        this.noiseSweep(t, 0.5, 400, 3200, 0.2);
        return;
      case "bossHit":
        this.thud(t, 110, 0.25, 0.7);
        this.noiseSweep(t, 0.18, 2500, 500, 0.25);
        this.tone("square", 196, t, 0.12, 0.08, 98);
        return;
      case "bossRoar": {
        const o = this.ctx!.createOscillator();
        o.type = "sawtooth";
        o.frequency.setValueAtTime(70, t);
        o.frequency.linearRampToValueAtTime(110, t + 0.4);
        o.frequency.exponentialRampToValueAtTime(45, t + 1.6);
        const trem = this.ctx!.createOscillator();
        trem.frequency.value = 23;
        const tremGain = this.ctx!.createGain();
        tremGain.gain.value = 18;
        trem.connect(tremGain).connect(o.frequency);
        const lp = this.ctx!.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 600;
        const g = this.env(t, 0.15, 1.6, 0.4);
        o.connect(lp).connect(g).connect(this.sfxBus);
        o.start(t);
        trem.start(t);
        o.stop(t + 1.8);
        trem.stop(t + 1.8);
        this.noiseSweep(t, 1.4, 200, 700, 0.15);
        return;
      }
      case "victory": {
        const seq = [293.66, 440, 587.33, 739.99, 880];
        seq.forEach((f, i) => this.pluck(f, t + i * 0.09, 0.18));
        [293.66, 440, 587.33, 739.99].forEach((f) => this.pad(f, t + 0.45, 2.2, 0.08));
        [0.5, 0.75, 1.0].forEach((d) => this.shimmer(t + d));
        return;
      }
      case "defeat": {
        [440, 392, 349.23, 293.66].forEach((f, i) => this.tone("triangle", f, t + i * 0.22, 0.35, 0.1));
        this.pad(146.83, t + 0.9, 1.8, 0.08);
        this.pad(174.61, t + 0.9, 1.8, 0.06);
        return;
      }
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

  /** Enveloppe attaque / décroissance */
  private env(t: number, attack: number, decay: number, peak: number) {
    const g = this.ctx!.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    return g;
  }

  /** Écho simple pour donner l'impression d'une grande salle */
  private echo(delay: number, feedback: number, dest: AudioNode) {
    const ctx = this.ctx!;
    const input = ctx.createGain();
    const d = ctx.createDelay(1);
    d.delayTime.value = delay;
    const fb = ctx.createGain();
    fb.gain.value = feedback;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 2200;
    input.connect(dest);
    input.connect(d);
    d.connect(lp);
    lp.connect(fb);
    fb.connect(d);
    lp.connect(dest);
    // Libère la boucle de retour une fois l'écho éteint
    window.setTimeout(() => {
      input.disconnect();
      fb.disconnect();
      lp.disconnect();
    }, 3000);
    return input;
  }

  private tone(type: OscillatorType, freq: number, t: number, dur: number, vol: number, toFreq?: number) {
    const o = this.ctx!.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (toFreq) o.frequency.exponentialRampToValueAtTime(toFreq, t + dur);
    const g = this.env(t, 0.005, dur, vol);
    o.connect(g).connect(this.sfxBus!);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  /** Corde pincée (harpe / luth) */
  private pluck(freq: number, t: number, vol: number, bus: AudioNode = this.sfxBus!) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = freq;
    const o2 = ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.value = freq * 2.01;
    const g = this.env(t, 0.004, 0.9, vol);
    const g2 = this.env(t, 0.004, 0.35, vol * 0.4);
    o.connect(g).connect(bus);
    o2.connect(g2).connect(bus);
    o.start(t);
    o2.start(t);
    o.stop(t + 1);
    o2.stop(t + 0.5);
  }

  private pad(freq: number, t: number, dur: number, vol: number) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1800;
    for (const det of [-6, 6]) {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = freq;
      o.detune.value = det;
      o.connect(lp);
      o.start(t);
      o.stop(t + dur + 0.1);
    }
    lp.connect(g).connect(this.sfxBus!);
  }

  private shimmer(t: number) {
    for (let i = 0; i < 6; i++) {
      this.tone("sine", 2400 + Math.random() * 2200, t + i * 0.035, 0.12, 0.025);
    }
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
    bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(from, t);
    bp.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + dur * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.connect(bp).connect(g).connect(this.sfxBus!);
    n.start(t, Math.random());
    n.stop(t + dur + 0.05);
  }
}

export const soundEngine = new SoundEngine();
