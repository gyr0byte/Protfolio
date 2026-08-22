// Global helper functions for Contact Form UI
function copyEmailToClipboard() {
    const emailVal = 'gqurav69@gmail.com';
    navigator.clipboard.writeText(emailVal).then(() => {
        const btn = document.getElementById('btnCopyEmail');
        if (btn) {
            btn.textContent = '[COPIED! ✓]';
            btn.style.color = 'var(--amber-yellow)';
            btn.style.borderColor = 'var(--amber-yellow)';
            setTimeout(() => {
                btn.textContent = '[Copy 📋]';
                btn.style.color = 'var(--terminal-green)';
                btn.style.borderColor = 'var(--border)';
            }, 2000);
        }
        if (typeof showToast === 'function') {
            showToast('[COPIED] gqurav69@gmail.com copied to clipboard!');
        }
    }).catch(() => {
        alert('Email: gqurav69@gmail.com');
    });
}

function selectSubjectChip(btn, text) {
    const subjectInput = document.getElementById('formSubject');
    if (subjectInput) {
        subjectInput.value = text;
        subjectInput.focus();
    }
    document.querySelectorAll('.chip-btn').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
    if (typeof playClickSound === 'function') playClickSound(700, 0.02);
}

// Main Application Initialization
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mouse Follower Crosshair
    const follower = document.getElementById('cursorFollower');
    if (follower) {
        document.addEventListener('mousemove', (e) => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        });
    }

    // 2. Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            playClickSound(650, 0.02);
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
                playClickSound(600, 0.015);
            });
        });
    }

    // 3. Scroll Section Active Navigation Tracker
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // 4. Contact Form — Native HTML POST to Web3Forms with Interactive Telemetry
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const msgTelemetry = document.getElementById('messageTelemetry');

    if (formMessage && msgTelemetry) {
        formMessage.addEventListener('input', () => {
            const txt = formMessage.value;
            const charCount = txt.length;
            const wordCount = txt.trim() === '' ? 0 : txt.trim().split(/\s+/).length;
            const readTimeSec = Math.ceil(wordCount / 3.3);
            msgTelemetry.textContent = `[CHARS: ${charCount} | WORDS: ${wordCount} | EST. READ: ${readTimeSec}s]`;
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            const submitBtn = document.getElementById('formSubmitBtn');
            const statusDiv = document.getElementById('formStatus');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = '[ENCRYPTING PAYLOAD... 35%]';
            }
            if (statusDiv) {
                statusDiv.style.display = 'block';
                statusDiv.style.color = 'var(--amber-yellow)';
                statusDiv.textContent = '> Encrypting payload... Transmitting via Web3Forms SMTP relay...';
            }
            if (typeof playClickSound === 'function') playClickSound(900, 0.04);
        });

        // Show success toast if redirected back after submission
        if (window.location.search.includes('sent=true')) {
            setTimeout(() => {
                if (typeof showToast === 'function') showToast('[SUCCESS] Message delivered to gqurav69@gmail.com!');
                const statusDiv = document.getElementById('formStatus');
                if (statusDiv) {
                    statusDiv.style.display = 'block';
                    statusDiv.style.color = 'var(--terminal-green)';
                    statusDiv.innerHTML = '&gt; <span style="color: var(--terminal-green);">[SUCCESS] Message delivered successfully. Response expected shortly.</span>';
                }
                window.history.replaceState({}, '', window.location.pathname);
            }, 500);
        }
    }

    // 5. Initialize Modules
    runBootSequence();
    updateUptimeBadge();

    // 6. Fetch LIVE GitHub Data, then initialize counters & heatmap
    fetchAllGitHubData().then(() => {
        initStatsObserver();
    });
    generateContributionHeatmap();
});
