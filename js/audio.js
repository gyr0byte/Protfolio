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
