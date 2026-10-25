/* Procedural Web Audio API Synthesizer (taqy.tech exact inspired) */
/* Zero external audio files required — 100% real-time synthesis */

const WorkAudio = (function () {
  let audioCtx = null;
  let isEnabled = false;
  let lastRatchetTime = 0;

  function getAudioContext() {
    if (typeof window === "undefined") return null;
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function setEnabled(enabled) {
    isEnabled = Boolean(enabled);
    if (isEnabled) {
      getAudioContext();
    }
    return isEnabled;
  }

  function toggleAudio() {
    return setEnabled(!isEnabled);
  }

  function playHover() {
    if (!isEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.06);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {}
  }

  function playClick() {
    if (!isEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Subtle noise burst
      const bufferLength = Math.floor(ctx.sampleRate * 0.012);
      const buffer = ctx.createBuffer(1, bufferLength, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferLength; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.002));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(4200, now);
      filter.Q.setValueAtTime(4, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.014);

      // Low tactile body
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

      oscGain.gain.setValueAtTime(0.08, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch (e) {}
  }

  function playRatchet(intensity) {
    if (!isEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Rate limit ratchet clicks so they don't overpower the mix
    const minInterval = Math.max(0.035, 0.09 - Math.min(0.06, (intensity || 1) * 0.003));
    if (now - lastRatchetTime < minInterval) return;
    lastRatchetTime = now;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const baseFreq = 800 + Math.random() * 250;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.018);

      const amp = Math.min(0.045, Math.max(0.008, (intensity || 1) * 0.002));
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.022);
    } catch (e) {}
  }

  function playToggle(isList) {
    if (!isEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      if (isList) {
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);
      } else {
        osc.frequency.setValueAtTime(680, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.12);
      }

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {}
  }

  function playCardOpen() {
    if (!isEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Resonant sub swoop
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(140, now);
      sub.frequency.exponentialRampToValueAtTime(58, now + 0.18);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      sub.connect(subGain);
      subGain.connect(ctx.destination);

      sub.start(now);
      sub.stop(now + 0.23);

      // Shimmering chord overtone
      [880, 1318.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        const noteTime = now + idx * 0.035;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, noteTime);

        oscGain.gain.setValueAtTime(0.025, noteTime);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.16);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.17);
      });
    } catch (e) {}
  }

  return {
    get isEnabled() {
      return isEnabled;
    },
    setEnabled,
    toggleAudio,
    playHover,
    playClick,
    playRatchet,
    playToggle,
    playCardOpen
  };
})();

if (typeof window !== "undefined") {
  window.WorkAudio = WorkAudio;
}
