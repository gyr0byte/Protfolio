// Web Audio API Terminal Click Sound Synthesizer
let audioEnabled = false;
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    }
}

function playClickSound(frequency = 600, duration = 0.015) {
    if (!audioEnabled) return;
    try {
        initAudio();
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + duration);

        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        // Fallback silently if audio context fails
    }
}

function toggleAudio() {
    audioEnabled = !audioEnabled;
    if (audioEnabled) initAudio();

    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
        soundBtn.textContent = audioEnabled ? '🔊 AUDIO: ON' : '🔇 AUDIO: OFF';
    }

    showToast(audioEnabled ? 'Terminal mechanical keyboard audio enabled.' : 'Terminal audio muted.');
    if (audioEnabled) playClickSound(800, 0.03);
}

// Global click event listener for mechanical click sound
document.addEventListener('keydown', (e) => {
    if (e.key && e.key.length === 1) {
        playClickSound(600 + Math.random() * 200, 0.012);
    }
});

// ─── Ambient Server Room Hum ────────────────────────────────────────────
let ambientHumNodes = null;

function startAmbientHum() {
    if (ambientHumNodes || !audioCtx) return;
    try {
        if (audioCtx.state === 'suspended') audioCtx.resume();

        // Low-frequency base hum (60Hz electrical hum)
        const osc1 = audioCtx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(60, audioCtx.currentTime);

        // Sub-harmonic rumble (120Hz)
        const osc2 = audioCtx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(120, audioCtx.currentTime);

        // Filtered noise for "air conditioning" texture
        const bufferSize = audioCtx.sampleRate * 2;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.3;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        // Low-pass filter on noise for a muffled hum
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, audioCtx.currentTime);
        filter.Q.setValueAtTime(1, audioCtx.currentTime);

        // Master gain — very quiet
        const masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.012, audioCtx.currentTime + 2);

        const gain1 = audioCtx.createGain();
        gain1.gain.setValueAtTime(0.008, audioCtx.currentTime);
        const gain2 = audioCtx.createGain();
        gain2.gain.setValueAtTime(0.004, audioCtx.currentTime);
        const gainNoise = audioCtx.createGain();
        gainNoise.gain.setValueAtTime(0.006, audioCtx.currentTime);

        osc1.connect(gain1).connect(masterGain);
        osc2.connect(gain2).connect(masterGain);
        noise.connect(filter).connect(gainNoise).connect(masterGain);
        masterGain.connect(audioCtx.destination);

        osc1.start();
        osc2.start();
        noise.start();

        ambientHumNodes = { osc1, osc2, noise, masterGain, gain1, gain2, gainNoise, filter };
    } catch (e) {
        // Silently fail if audio context issue
    }
}

function stopAmbientHum() {
    if (!ambientHumNodes) return;
    try {
        const { osc1, osc2, noise, masterGain } = ambientHumNodes;
        masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
        setTimeout(() => {
            try {
                osc1.stop();
                osc2.stop();
                noise.stop();
            } catch (e) {}
            ambientHumNodes = null;
        }, 600);
    } catch (e) {
        ambientHumNodes = null;
    }
}
