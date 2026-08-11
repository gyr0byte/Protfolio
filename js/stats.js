// Real-Time GitHub Stats & Live Contribution Heatmap
// Uses: api.github.com (user profile) + github-contributions-api.jogruber.de (contribution graph)

const GH_USERNAME = 'gyr0byte';
let animatedCounters = false;

// ─── Main Data Fetcher ─────────────────────────────────────────────
async function fetchAllGitHubData() {
    const statusBadge = document.getElementById('apiStatusBadge');

    try {
        // Run both API calls in parallel
        const [profileData, contribData] = await Promise.all([
            fetchGitHubProfile(),
            fetchContributionGraph()
        ]);

        // Compute real stats from live data
        if (contribData) {
            const { totalContribs, currentStreak, longestStreak } = computeStatsFromContribs(contribData);

            // Update counter card targets with REAL data
            setCounterTarget(0, currentStreak);      // STREAK
            setCounterTarget(1, totalContribs);       // COMMITS (total contributions)
        }

        if (profileData) {
            setCounterTarget(2, profileData.public_repos); // PROJECTS (real repo count)
        }

        // Mark API as connected
        if (statusBadge) {
            statusBadge.innerHTML = '<span class="pulse-dot" style="display:inline-block;vertical-align:middle;margin-right:4px;"></span> LIVE · DATA SYNCED';
            statusBadge.style.borderColor = 'var(--terminal-green)';
            statusBadge.style.color = 'var(--terminal-green)';
        }

        console.log('[GitHub Live] All data synced successfully.');

    } catch (err) {
        console.warn('[GitHub Live] API error, using fallback values:', err.message);
        if (statusBadge) {
            statusBadge.textContent = '⚠ OFFLINE · CACHED DATA';
            statusBadge.style.borderColor = 'var(--amber-yellow)';
            statusBadge.style.color = 'var(--amber-yellow)';
        }
    }
}

// ─── GitHub User Profile ───────────────────────────────────────────
async function fetchGitHubProfile() {
    const res = await fetch(`https://api.github.com/users/${GH_USERNAME}`);
    if (!res.ok) throw new Error(`Profile API ${res.status}`);
    return await res.json();
}

// ─── Contribution Graph (jogruber API — verified working) ──────────
async function fetchContributionGraph() {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GH_USERNAME}?y=last`);
    if (!res.ok) throw new Error(`Contributions API ${res.status}`);
    const data = await res.json();
    return data.contributions || [];
}

// ─── Compute Real Stats from Contribution Data ────────────────────
function computeStatsFromContribs(contributions) {
    let totalContribs = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Sum total contributions
    contributions.forEach(day => {
        totalContribs += day.count;
    });

    // Calculate current streak (walk backwards from today)
    const today = new Date().toISOString().split('T')[0];
    const reversed = [...contributions].reverse();

    let startedCounting = false;
    for (const day of reversed) {
        if (!startedCounting) {
            // Skip today if it has 0 (day might not be over yet)
            if (day.date === today && day.count === 0) continue;
            if (day.count > 0) {
                startedCounting = true;
                currentStreak = 1;
            } else {
                // No contributions yesterday either — streak is 0
                break;
            }
        } else {
            if (day.count > 0) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    // Calculate longest streak
    contributions.forEach(day => {
        if (day.count > 0) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    });

    console.log(`[GitHub Live] Total: ${totalContribs}, Current Streak: ${currentStreak}, Longest: ${longestStreak}`);

    return { totalContribs, currentStreak, longestStreak };
}

// ─── Set Counter Card Target by Index ──────────────────────────────
function setCounterTarget(index, value) {
    const cards = document.querySelectorAll('.counter-val');
    if (cards[index]) {
        cards[index].setAttribute('data-target', value);
    }
}

// ─── Animate Counters on Scroll ────────────────────────────────────
function animateCounters() {
    const counterCards = document.querySelectorAll('.counter-val');
    counterCards.forEach(card => {
        const target = parseInt(card.getAttribute('data-target')) || 0;
        let current = 0;
        const duration = 1200; // ms
        const steps = 50;
        const increment = Math.max(1, Math.ceil(target / steps));
        const interval = duration / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                card.textContent = target + (target >= 10 ? '+' : '');
                clearInterval(timer);
            } else {
                card.textContent = current;
            }
        }, interval);
    });
}

function initStatsObserver() {
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animatedCounters) {
                animatedCounters = true;
                animateCounters();
            }
        });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
}

// ─── Live Contribution Heatmap Renderer ────────────────────────────
async function generateContributionHeatmap() {
    const heatmapGrid = document.getElementById('heatmapGrid');
    if (!heatmapGrid) return;

    let liveLoaded = false;

    try {
        const contributions = await fetchContributionGraph();

        if (contributions.length > 0) {
            heatmapGrid.innerHTML = '';

            // Pad to align grid to start on a Sunday (GitHub style)
            const firstDate = new Date(contributions[0].date);
            const startDayOfWeek = firstDate.getDay(); // 0 = Sunday
            for (let i = 0; i < startDayOfWeek; i++) {
                const empty = document.createElement('div');
                empty.className = 'cell lvl-0';
                empty.style.opacity = '0.3';
                heatmapGrid.appendChild(empty);
            }

            contributions.forEach(day => {
                const cell = document.createElement('div');
                cell.className = `cell lvl-${day.level}`;
                cell.title = `${day.date}: ${day.count} contribution${day.count === 1 ? '' : 's'}`;
                heatmapGrid.appendChild(cell);
            });

            liveLoaded = true;
            console.log(`[GitHub Heatmap] Rendered ${contributions.length} days of live contribution data.`);
        }
    } catch (e) {
        console.warn('[GitHub Heatmap] API unavailable, generating fallback:', e.message);
    }

    // Fallback: simulated heatmap
    if (!liveLoaded) {
        heatmapGrid.innerHTML = '';
        for (let i = 0; i < 371; i++) {
            const cell = document.createElement('div');
            const rand = Math.random();
            let lvl = 'lvl-0';
            if (rand > 0.85) lvl = 'lvl-4';
            else if (rand > 0.7) lvl = 'lvl-3';
            else if (rand > 0.5) lvl = 'lvl-2';
            else if (rand > 0.3) lvl = 'lvl-1';
            cell.className = `cell ${lvl}`;
            cell.title = 'Simulated data (API offline)';
            heatmapGrid.appendChild(cell);
        }
    }
}
