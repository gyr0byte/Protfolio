// Hero Boot Sequence & ASCII Glitch Title
const initialStreak = (typeof localStorage !== 'undefined' && localStorage.getItem('cached_gh_streak')) || '233+';
const bootLines = [
    "> Initializing system...",
    "> Loading profile: <span class='highlight'>Gaurav Dulal</span>...",
    "> Location: Belbari-2, Morang, Nepal",
    "> Status: <span class='highlight'>BHons Computing @ IIC | London Met University</span>",
    "> Mission: <span class='highlight-accent'>MSc Machine Learning → University of Tübingen (2028)</span>",
    `> GitHub streak: <span class='highlight' id='heroStreakVal'>${initialStreak} days and counting...</span>`,
    "> [<span style='color: var(--terminal-green);'>████████████████████</span>] 100% — System ready."
];

let bootIndex = 0;

function runBootSequence() {
    const bootContainer = document.getElementById('bootSequence');
    if (!bootContainer) return;

    if (bootIndex < bootLines.length) {
        if (bootIndex === 5) {
            const currentStreak = window.liveCurrentStreak || (typeof localStorage !== 'undefined' && localStorage.getItem('cached_gh_streak')) || '233+';
            bootLines[5] = `> GitHub streak: <span class='highlight' id='heroStreakVal'>${currentStreak} days and counting...</span>`;
        }

        const line = document.createElement('div');
        line.className = 'boot-line';
        line.innerHTML = bootLines[bootIndex];
        bootContainer.appendChild(line);
        
        setTimeout(() => {
            line.classList.add('visible');
            playClickSound(500 + bootIndex * 50, 0.015);
        }, 40);

        bootIndex++;
        setTimeout(runBootSequence, 320);
    } else {
        setTimeout(() => {
            const ascii = document.getElementById('asciiContainer');
            const role = document.getElementById('roleWrapper');
            if (ascii) ascii.style.display = 'block';
            if (role) role.style.display = 'block';
            if (window.startRoleTypewriter) window.startRoleTypewriter();
        }, 400);
    }
}

function updateUptimeBadge() {
    const uptimeBadge = document.getElementById('uptimeBadge');
    if (uptimeBadge) {
        const startDate = new Date('2026-03-09T00:00:00');
        const now = new Date();
        const diffTime = Math.abs(now - startDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        uptimeBadge.textContent = `[System uptime: ${diffDays} days]`;
    }
}
