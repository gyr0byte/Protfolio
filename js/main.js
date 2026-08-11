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

    // 4. Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const subject = document.getElementById('formSubject').value;
            const message = document.getElementById('formMessage').value;
            const statusDiv = document.getElementById('formStatus');

            if (statusDiv) {
                statusDiv.style.display = 'block';
                statusDiv.textContent = '> Encrypting payload... Transmitting to gqurav69@gmail.com via SMTP...';
            }

            playClickSound(900, 0.04);

            setTimeout(() => {
                if (statusDiv) {
                    statusDiv.innerHTML = '&gt; <span style="color: var(--terminal-green);">[SUCCESS] Message transmitted successfully. Response expected shortly.</span>';
                }
                document.getElementById('formSubject').value = '';
                document.getElementById('formMessage').value = '';
                
                showToast('Opening native mail client...');
                window.location.href = `mailto:gqurav69@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
            }, 1000);
        });
    }

    // 5. Initialize Modules
    runBootSequence();
    updateUptimeBadge();
    initStatsObserver();
    generateContributionHeatmap();
});
