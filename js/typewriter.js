// Role Switcher Typewriter Effect
const roles = [
    "Machine Learning Engineer_",
    "AI Researcher_",
    "Full Stack Developer_",
    "Problem Solver_"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function startRoleTypewriter() {
    const roleText = document.getElementById('roleText');
    if (!roleText) return;

    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        roleText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        roleText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2500; // Hold for 2.5s
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 400;
    }

    setTimeout(startRoleTypewriter, typeSpeed);
}

window.startRoleTypewriter = startRoleTypewriter;
