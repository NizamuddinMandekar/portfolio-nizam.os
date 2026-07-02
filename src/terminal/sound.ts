// Tiny WebAudio synth for terminal sounds no audio assets needed.

let ctx: AudioContext | null = null;
let muted = localStorage.getItem("nizamos-sound") === "off";

function audio(): AudioContext | null {
  if (muted) return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function blip(freq: number, duration: number, gain: number, type: OscillatorType = "square") {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
  osc.connect(g).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + duration);
}

export const sound = {
  key() {
    // soft mechanical click, slight pitch variance so it doesn't sound robotic
    blip(1800 + Math.random() * 600, 0.015, 0.025);
  },
  enter() {
    blip(340, 0.06, 0.05, "triangle");
  },
  boot() {
    blip(880, 0.09, 0.05, "sine");
    setTimeout(() => blip(1320, 0.12, 0.05, "sine"), 100);
  },
  error() {
    blip(160, 0.12, 0.06, "sawtooth");
  },
  isMuted() {
    return muted;
  },
  setMuted(value: boolean) {
    muted = value;
    localStorage.setItem("nizamos-sound", value ? "off" : "on");
  },
};
