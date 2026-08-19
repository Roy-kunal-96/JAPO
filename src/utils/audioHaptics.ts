/**
 * Audio and Haptic feedback engine for JAPO
 * Generates natural resonant singing bowl / temple bell soundscapes using Web Audio API
 * Strictly initialized and resumed ONLY on direct user gestures (taps/clicks).
 */

let audioCtx: AudioContext | null = null;

/**
 * Lazy-initializes or resumes the AudioContext exclusively inside a user gesture stack.
 */
function ensureAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }

    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  } catch (err) {
    console.warn('AudioContext initialization error:', err);
  }

  return audioCtx;
}

/**
 * Main sound trigger for bead count.
 * Must be invoked directly inside a user tap/click event handler.
 */
export function playBeadSound(count: number, soundEnabled: boolean = true) {
  if (!soundEnabled || typeof window === 'undefined') return;

  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. 108 Mala Complete: Resonant Tibetan singing bowl chord
    if (count === 108) {
      playTibetanBowl(ctx, now);
      return;
    }

    // 2. Quarter milestones (27, 54, 81): Meditative harmonic dual-bell
    if (count === 27 || count === 54 || count === 81) {
      playMilestoneChime(ctx, now);
      return;
    }

    // 3. Regular bead tap: Warm, resonant 528 Hz Solfeggio temple chime
    const baseFreq = 528 + ((count % 9) - 4) * 6;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.7, now);
    masterGain.connect(ctx.destination);

    // Primary Warm Bell Fundamental
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, now);

    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.linearRampToValueAtTime(0.5, now + 0.008);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

    osc1.connect(gain1);
    gain1.connect(masterGain);

    // Harmonic Overtone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq * 2.015, now);

    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.linearRampToValueAtTime(0.18, now + 0.006);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc2.connect(gain2);
    gain2.connect(masterGain);

    // Deep Root Harmonic
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(baseFreq * 0.5, now);

    gain3.gain.setValueAtTime(0.0001, now);
    gain3.gain.linearRampToValueAtTime(0.12, now + 0.004);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    osc3.connect(gain3);
    gain3.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + 0.4);
    osc2.stop(now + 0.25);
    osc3.stop(now + 0.18);
  } catch (err) {
    console.warn('Unable to play bead audio:', err);
  }
}

function playMilestoneChime(ctx: AudioContext, now: number) {
  try {
    const freqs = [528, 792, 1056];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.035);

      const peakVol = idx === 0 ? 0.35 : 0.22;
      gain.gain.setValueAtTime(0.0001, now + idx * 0.035);
      gain.gain.linearRampToValueAtTime(peakVol, now + idx * 0.035 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.035 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.035);
      osc.stop(now + idx * 0.035 + 1.25);
    });
  } catch {}
}

function playTibetanBowl(ctx: AudioContext, now: number) {
  try {
    // Meditative OM fundamental and rich overtone harmonics
    const freqs = [216, 432, 648, 864, 1296];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 1.5, now);

      const vol = [0.4, 0.28, 0.18, 0.1, 0.05][i] || 0.08;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 3.5);
    });
  } catch {}
}

/**
 * Trigger Tactile Haptic Vibration
 */
export function triggerHaptic(count: number, hapticEnabled: boolean = true) {
  if (!hapticEnabled) return;
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

  try {
    if (count === 108) {
      navigator.vibrate([40, 60, 40, 60, 100]);
    } else if (count === 27 || count === 54 || count === 81) {
      navigator.vibrate([25, 40, 25]);
    } else {
      navigator.vibrate(14);
    }
  } catch {
    // Graceful fallback
  }
}
