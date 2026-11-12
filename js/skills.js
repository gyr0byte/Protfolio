// Skills Directory Interactive Controls & Shared-Data Tree Renderer
function renderSkillsTree() {
    const treeEl = document.getElementById('skillsTree') || document.querySelector('.skills-tree');
    const data = window.SKILLS_DATA;
    if (!treeEl || !data || !Array.isArray(data.categories)) return;

    treeEl.innerHTML = '';
    const CHUNK_SIZE = 4;

    data.categories.forEach((cat) => {
        const li = document.createElement('li');
        li.className = 'dir-item';
        li.setAttribute('data-cat', cat.id);

        const header = document.createElement('div');
        header.className = 'dir-header';
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        header.setAttribute('aria-expanded', 'true');
        header.onclick = function() {
            toggleDir(this);
        };
        header.onkeydown = function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDir(this);
            }
        };

        const iconSpan = document.createElement('span');
        iconSpan.className = 'dir-icon';
        iconSpan.setAttribute('aria-hidden', 'true');
        iconSpan.textContent = '📁';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'dir-name';
        nameSpan.textContent = `drwxr-xr-x ${cat.dirName}`;

        const countSpan = document.createElement('span');
        countSpan.className = 'dir-count';
        countSpan.textContent = `(${cat.skills.length})`;

        header.appendChild(iconSpan);
        header.appendChild(nameSpan);
        header.appendChild(countSpan);

        const contents = document.createElement('div');
        contents.className = 'dir-contents';

        const totalChunks = Math.ceil(cat.skills.length / CHUNK_SIZE);
        for (let i = 0; i < totalChunks; i++) {
            const chunk = cat.skills.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
            const isLast = i === totalChunks - 1;

            const line = document.createElement('div');
            line.className = 'file-line';

            const branch = document.createElement('span');
            branch.className = 'tree-branch';
            branch.setAttribute('aria-hidden', 'true');
            branch.textContent = isLast ? '└──' : '├──';

            const group = document.createElement('div');
            group.className = 'tech-items-group';

            chunk.forEach((skill) => {
                const item = document.createElement('span');
                item.className = 'tech-item';
                item.setAttribute('data-skill-id', skill.id);
                item.setAttribute('title', skill.tooltip);
                item.textContent = skill.label;
                group.appendChild(item);
            });

            line.appendChild(branch);
            line.appendChild(group);
            contents.appendChild(line);
        }

        li.appendChild(header);
        li.appendChild(contents);
        treeEl.appendChild(li);
    });
}

function toggleDir(headerElem) {
    if (!headerElem) return;
    const contents = headerElem.nextElementSibling;
    if (contents) {
        const isCollapsed = contents.classList.toggle('collapsed');
        headerElem.setAttribute('aria-expanded', String(!isCollapsed));
        if (typeof playClickSound === 'function') playClickSound(700, 0.02);
    }
}

function expandAllSkills() {
    document.querySelectorAll('.dir-contents').forEach(el => {
        el.classList.remove('collapsed');
        if (el.previousElementSibling) {
            el.previousElementSibling.setAttribute('aria-expanded', 'true');
        }
    });
    if (typeof playClickSound === 'function') playClickSound(750, 0.02);
    if (typeof showToast === 'function') showToast('Expanded all skills directories.');
}

function collapseAllSkills() {
    document.querySelectorAll('.dir-contents').forEach(el => {
        el.classList.add('collapsed');
        if (el.previousElementSibling) {
            el.previousElementSibling.setAttribute('aria-expanded', 'false');
        }
    });
    if (typeof playClickSound === 'function') playClickSound(650, 0.02);
    if (typeof showToast === 'function') showToast('Collapsed all skills directories.');
}

window.renderSkillsTree = renderSkillsTree;
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSkillsTree);
} else {
    renderSkillsTree();
}
