// Skills Directory Interactive Controls
function toggleDir(headerElem) {
    const contents = headerElem.nextElementSibling;
    if (contents) {
        contents.classList.toggle('collapsed');
        playClickSound(700, 0.02);
    }
}

function expandAllSkills() {
    document.querySelectorAll('.dir-contents').forEach(el => {
        el.classList.remove('collapsed');
    });
    showToast('Expanded all skills directories.');
}

function collapseAllSkills() {
    document.querySelectorAll('.dir-contents').forEach(el => {
        el.classList.add('collapsed');
    });
    showToast('Collapsed all skills directories.');
}

window.toggleDir = toggleDir;
window.expandAllSkills = expandAllSkills;
window.collapseAllSkills = collapseAllSkills;

// Global fallback bridge for graph filter category
if (typeof window.filterGraphCategory !== 'function') {
    window.filterGraphCategory = function(cat) {
        if (typeof window._internalFilterGraphCategory === 'function') {
            window._internalFilterGraphCategory(cat);
        } else {
            window._pendingGraphCategory = cat;
        }
    };
}

