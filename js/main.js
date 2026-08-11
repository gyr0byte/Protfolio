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

    // 4. Contact Form — Native HTML POST to Web3Forms
    // The form submits directly via action="https://api.web3forms.com/submit"
    // We just add a brief terminal animation before it goes through
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            const submitBtn = document.getElementById('formSubmitBtn');
            const statusDiv = document.getElementById('formStatus');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = '[Transmitting...]';
            }
            if (statusDiv) {
                statusDiv.style.display = 'block';
                statusDiv.style.color = 'var(--amber-yellow)';
                statusDiv.textContent = '> Encrypting payload... Transmitting via Web3Forms SMTP relay...';
            }
            playClickSound(900, 0.04);
            // Form submits natively — browser navigates to Web3Forms then redirects back
        });

        // Show success toast if redirected back after submission
        if (window.location.search.includes('sent=true')) {
            setTimeout(() => {
                showToast('[SUCCESS] Message delivered to gqurav69@gmail.com!');
                const statusDiv = document.getElementById('formStatus');
                if (statusDiv) {
                    statusDiv.style.display = 'block';
                    statusDiv.style.color = 'var(--terminal-green)';
                    statusDiv.innerHTML = '&gt; <span style="color: var(--terminal-green);">[SUCCESS] Message delivered successfully. Response expected shortly.</span>';
                }
                // Clean URL
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
