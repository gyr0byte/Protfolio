// Projects Interactive Logic
function copyCommitHash(hash) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(hash);
        if (typeof showToast === 'function') {
            showToast(`Copied commit hash [${hash}] to clipboard!`);
        }
        if (typeof playClickSound === 'function') {
            playClickSound(900, 0.03);
        }
    } else if (typeof showToast === 'function') {
        showToast(`Commit hash: ${hash}`);
    }
}

function initProjectsSection() {
    const projectsRoot = document.getElementById('projects');
    if (!projectsRoot) return;

    const actionLinks = projectsRoot.querySelectorAll('.project-links .btn-link');
    actionLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (typeof playClickSound === 'function') {
                playClickSound(760, 0.025);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initProjectsSection);

window.copyCommitHash = copyCommitHash;
