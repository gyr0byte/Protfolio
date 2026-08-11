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

    // 4. Contact Form Handler — Web3Forms API
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const statusDiv = document.getElementById('formStatus');
            const submitBtn = document.getElementById('formSubmitBtn');

            // Show sending state
            if (statusDiv) {
                statusDiv.style.display = 'block';
                statusDiv.style.color = 'var(--amber-yellow)';
                statusDiv.textContent = '> Encrypting payload... Transmitting via Web3Forms SMTP relay...';
            }
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = '[Transmitting...]';
            }

            playClickSound(900, 0.04);

            try {
                const formData = new FormData(contactForm);
                // Sync the subject hidden field with user input
                const subjectInput = document.getElementById('formSubject');
                if (subjectInput) {
                    formData.set('subject', `Portfolio Contact: ${subjectInput.value}`);
                }

                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await res.json();

                if (data.success) {
                    if (statusDiv) {
                        statusDiv.style.color = 'var(--terminal-green)';
                        statusDiv.innerHTML = '&gt; <span style="color: var(--terminal-green);">[SUCCESS] Message delivered to gqurav69@gmail.com. Response expected shortly.</span>';
                    }
                    showToast('Message sent successfully!');
                    contactForm.reset();
                } else {
                    throw new Error(data.message || 'Submission failed');
                }
            } catch (err) {
                if (statusDiv) {
                    statusDiv.style.color = 'var(--accent-orange)';
                    statusDiv.innerHTML = `&gt; <span style="color: var(--accent-orange);">[ERROR] ${err.message}. Falling back to mailto...</span>`;
                }
                // Fallback to mailto
                const subject = document.getElementById('formSubject')?.value || '';
                const message = document.getElementById('formMessage')?.value || '';
                window.location.href = `mailto:gqurav69@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = '[Send Message ↵]';
                }
            }
        });
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
