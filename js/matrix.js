// Matrix Canvas Digital Rain Effect
let matrixActive = false;
let matrixInterval = null;

function initMatrix() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01GYR0BYTEλπµΣθ∇∫≈≠≤≥≡√αβγδϵζηθικλµνξοπρστυφχψω';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -100);
    }

    function draw() {
        ctx.fillStyle = 'rgba(13, 17, 23, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00FF41';
        ctx.font = `${fontSize}px var(--font-mono)`;

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    return setInterval(draw, 35);
}

function toggleMatrix() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;

    matrixActive = !matrixActive;
    if (matrixActive) {
        canvas.style.display = 'block';
        if (!matrixInterval) {
            matrixInterval = initMatrix();
        }
        showToast('Matrix Rain background activated.');
    } else {
        canvas.style.display = 'none';
        if (matrixInterval) {
            clearInterval(matrixInterval);
            matrixInterval = null;
        }
        showToast('Matrix Rain deactivated.');
    }
}
