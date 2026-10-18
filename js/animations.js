// Intersection Observer for scroll-triggered section reveal animations

document.addEventListener('DOMContentLoaded', () => {
    // Select all sections that should animate in
    const revealElements = document.querySelectorAll('section');
    
    // Add the base class for animations
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const isMobile = window.innerWidth <= 768;
    const revealOptions = {
        threshold: isMobile ? 0.05 : 0.15,
        rootMargin: isMobile ? "0px 0px -20px 0px" : "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: Stop observing once revealed if you only want it to animate once
                // observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Section Divider Typing Animation — triggers once on scroll into view
    const dividers = document.querySelectorAll('.section-divider');
    const dividerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('typed');
                dividerObserver.unobserve(entry.target);
                if (typeof playClickSound === 'function') playClickSound(500, 0.012);
            }
        });
    }, { threshold: 0.5 });

    dividers.forEach(d => dividerObserver.observe(d));
// Staggered reveal for project commit cards
    const commitCards = document.querySelectorAll('.commit-card');
    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    commitCards.forEach((card, index) => {
        card.classList.add('reveal');
        card.style.transitionDelay = `${(index % 2) * 90}ms`;
        cardObserver.observe(card);
    });
});
