// Real-Time GitHub Stats, LeetCode Stats & Live Contribution Heatmap
// APIs:
//   - api.github.com/users/gyr0byte (profile: repos, followers)
//   - github-contributions-api.jogruber.de/v4/gyr0byte?y=last (contribution graph)
//   - alfa-leetcode-api.onrender.com/gyr0byte/solved (leetcode problems solved)

const GH_USERNAME = 'gyr0byte';
const LC_USERNAME = 'gyr0byte';
let animatedCounters = false;

// ─── Terminal Progress Bar Builder ─────────────────────────────────
function buildProgressBar(filled, total = 20) {
    const count = Math.min(total, Math.round(filled));
    const empty = total - count;
    return '[' + '█'.repeat(count) + '░'.repeat(empty) + ']';
}

// ─── Main Data Fetcher ─────────────────────────────────────────────
async function fetchAllGitHubData() {
    const statusBadge = document.getElementById('apiStatusBadge');

    try {
        // Run all API calls in parallel
        const [profileData, contribData, leetcodeData] = await Promise.allSettled([
            fetchGitHubProfile(),
            fetchContributionGraph(),
            fetchLeetCodeStats()
        ]);

        // ── GitHub Contributions ───────────────────────────────────
        if (contribData.status === 'fulfilled' && contribData.value) {
            const { totalContribs, currentStreak, longestStreak } = computeStatsFromContribs(contribData.value);

            // Update Section 6 counter card targets
            setCounterTarget(0, currentStreak);
            setCounterTarget(1, totalContribs);

            // Update Section 2 (whoami) progress bars
            const streakBar = document.getElementById('whoamiStreakBar');
            const streakVal = document.getElementById('whoamiStreakVal');
            const commitsBar = document.getElementById('whoamiCommitsBar');
            const commitsVal = document.getElementById('whoamiCommitsVal');

            if (streakBar && streakVal) {
                streakBar.textContent = buildProgressBar(20); // full bar for active streak
                streakVal.textContent = `${currentStreak} days`;
            }
            if (commitsBar && commitsVal) {
                // Scale bar: assume 3000 as "full" for visual purposes
                const commitFill = Math.round((totalContribs / 3000) * 20);
                commitsBar.textContent = buildProgressBar(commitFill);
                commitsVal.textContent = `${totalContribs}+`;
            }

            console.log(`[GitHub Live] Streak: ${currentStreak}, Commits: ${totalContribs}, Longest: ${longestStreak}`);
        }

        // ── GitHub Profile ─────────────────────────────────────────
        if (profileData.status === 'fulfilled' && profileData.value) {
            setCounterTarget(2, profileData.value.public_repos);
        }

        // ── LeetCode Stats ─────────────────────────────────────────
        if (leetcodeData.status === 'fulfilled' && leetcodeData.value) {
            const lc = leetcodeData.value;
            const lcBar = document.getElementById('whoamiLeetcodeBar');
            const lcVal = document.getElementById('whoamiLeetcodeVal');

            if (lcBar && lcVal) {
                // Scale bar: assume 200 as "full" for visual purposes
                const lcFill = Math.round((lc.solvedProblem / 200) * 20);
                lcBar.textContent = buildProgressBar(lcFill);
                lcVal.textContent = `${lc.solvedProblem} solved (E:${lc.easySolved} M:${lc.mediumSolved} H:${lc.hardSolved})`;
            }

            console.log(`[LeetCode Live] Solved: ${lc.solvedProblem} (E:${lc.easySolved} M:${lc.mediumSolved} H:${lc.hardSolved})`);
        } else {
            // Fallback for LeetCode if API is down
            const lcBar = document.getElementById('whoamiLeetcodeBar');
            const lcVal = document.getElementById('whoamiLeetcodeVal');
            if (lcBar) lcBar.textContent = buildProgressBar(7);
            if (lcVal) lcVal.textContent = '66+ solved (cached)';
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
        applyFallbackBars();
        if (statusBadge) {
            statusBadge.textContent = '⚠ OFFLINE · CACHED DATA';
            statusBadge.style.borderColor = 'var(--amber-yellow)';
            statusBadge.style.color = 'var(--amber-yellow)';
        }
    }
}

// ─── Fallback for Whoami Bars When All APIs Fail ───────────────────
function applyFallbackBars() {
    const map = {
        whoamiStreakBar: buildProgressBar(20),
        whoamiStreakVal: '158+ days (cached)',
        whoamiCommitsBar: buildProgressBar(17),
        whoamiCommitsVal: '2400+ (cached)',
        whoamiLeetcodeBar: buildProgressBar(7),
        whoamiLeetcodeVal: '66+ solved (cached)',
    };

    for (const [id, val] of Object.entries(map)) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
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

// ─── LeetCode Stats (alfa-leetcode-api — verified working) ────────
async function fetchLeetCodeStats() {
    const res = await fetch(`https://alfa-leetcode-api.onrender.com/${LC_USERNAME}/solved`);
    if (!res.ok) throw new Error(`LeetCode API ${res.status}`);
    return await res.json();
}

// ─── Compute Real Stats from Contribution Data ────────────────────
function computeStatsFromContribs(contributions) {
    let totalContribs = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    contributions.forEach(day => {
        totalContribs += day.count;
    });

    // Current streak: walk backwards from today
    const today = new Date().toISOString().split('T')[0];
    const reversed = [...contributions].reverse();

    let startedCounting = false;
    for (const day of reversed) {
        if (!startedCounting) {
            if (day.date === today && day.count === 0) continue;
            if (day.count > 0) {
                startedCounting = true;
                currentStreak = 1;
            } else {
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

    // Longest streak
    contributions.forEach(day => {
        if (day.count > 0) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    });

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
        const duration = 1200;
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
            const startDayOfWeek = firstDate.getDay();
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
            console.log(`[GitHub Heatmap] Rendered ${contributions.length} days of live data.`);
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
