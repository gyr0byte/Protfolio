// Interactive Neural Skill Network Graph Visualizer
(function() {
    let canvas = null;
    let ctx = null;
    let animFrame = null;
    let isInitialized = false;
    let activeView = 'tree';

    const skillNodes = [
        // ML
        { id: 'pytorch', label: 'PyTorch', category: 'Deep Learning', color: '#2ea44f', r: 18, x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'scikit', label: 'Scikit-Learn', category: 'Machine Learning', color: '#2ea44f', r: 16, x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'xgboost', label: 'XGBoost', category: 'Machine Learning', color: '#2ea44f', r: 14, x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'numpy', label: 'NumPy', category: 'Machine Learning', color: '#2ea44f', r: 13, x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'pandas', label: 'Pandas', category: 'Data Analysis', color: '#2ea44f', r: 14, x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'stacking', label: 'Stacking Ensembles', category: 'Machine Learning', color: '#2ea44f', r: 15, x: 0, y: 0, vx: 0, vy: 0 },

        // NLP
        { id: 'tfidf', label: 'TF-IDF', category: 'NLP', color: '#d29922', r: 13, x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'lstm', label: 'LSTM', category: 'NLP', color: '#d29922', r: 15, x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'ast', label: 'AST Parsing', category: 'NLP & Code', color: '#d29922', r: 15, x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'transformers', label: 'Transformers', category: 'NLP', color: '#d29922', r: 17, x: 0, y: 0, vx: 0, vy: 0 },

        // Languages
        { id: 'python', label: 'Python', category: 'Languages', color: '#58a6ff', r: 20, x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'java', label: 'Java', category: 'Languages', color: '#58a6ff', r: 16, x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'cpp', label: 'C / C++', category: 'Languages', color: '#58a6ff', r: 14, x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'sql', label: 'SQL', category: 'Languages', color: '#58a6ff', r: 13, x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'js', label: 'JavaScript', category: 'Languages', color: '#58a6ff', r: 15, x: 0, y: 0, vx: 0, vy: 0 },

        // Foundations
        { id: 'linalg', label: 'Linear Algebra', category: 'Math', color: '#bc8cff', r: 14, x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'stats', label: 'Probability & Stats', category: 'Math', color: '#bc8cff', r: 14, x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'oop', label: 'OOP Purity', category: 'Architecture', color: '#bc8cff', r: 15, x: 0, y: 0, vx: 0, vy: 0 },

        // Tools
        { id: 'git', label: 'Git', category: 'Tools', color: '#f0883e', r: 14, x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'streamlit', label: 'Streamlit', category: 'Tools', color: '#f0883e', r: 15, x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'flask', label: 'Flask', category: 'Tools', color: '#f0883e', r: 14, x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'linux', label: 'Linux', category: 'Tools', color: '#f0883e', r: 15, x: 0, y: 0, vx: 0, vy: 0 }
    ];

    const skillLinks = [
        ['python', 'pytorch'], ['python', 'scikit'], ['python', 'pandas'], ['python', 'numpy'], ['python', 'ast'], ['python', 'flask'],
        ['pytorch', 'transformers'], ['pytorch', 'lstm'], ['pytorch', 'stacking'],
        ['scikit', 'xgboost'], ['scikit', 'stacking'], ['scikit', 'stats'],
        ['pandas', 'numpy'], ['numpy', 'linalg'],
        ['tfidf', 'lstm'], ['tfidf', 'transformers'],
        ['linalg', 'stats'], ['stats', 'scikit'],
        ['java', 'oop'], ['python', 'oop'], ['cpp', 'oop'],
        ['js', 'streamlit'], ['flask', 'python'], ['git', 'linux']
    ];

    let hoveredNode = null;
    let draggedNode = null;
    let shockwaves = [];

    function initGraphCanvas() {
        canvas = document.getElementById('skillsGraphCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        resizeCanvas();

        window.addEventListener('resize', resizeCanvas);

        // Position nodes randomly in center circle
        const w = canvas.width;
        const h = canvas.height;
        skillNodes.forEach((node, i) => {
            const angle = (i / skillNodes.length) * Math.PI * 2;
            const radius = Math.min(w, h) * 0.28 + (Math.random() * 40 - 20);
            node.x = w / 2 + Math.cos(angle) * radius;
            node.y = h / 2 + Math.sin(angle) * radius;
            node.vx = (Math.random() - 0.5) * 0.5;
            node.vy = (Math.random() - 0.5) * 0.5;
        });

        // Event listeners
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('mouseleave', () => { hoveredNode = null; draggedNode = null; });

        isInitialized = true;
        animate();
    }

    function resizeCanvas() {
        if (!canvas) return;
        const container = canvas.parentElement;
        if (container) {
            canvas.width = container.clientWidth;
            canvas.height = Math.max(380, Math.min(window.innerHeight * 0.5, 520));
        }
    }

    function onMouseMove(e) {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        if (draggedNode) {
            draggedNode.x = mx;
            draggedNode.y = my;
            draggedNode.vx = 0;
            draggedNode.vy = 0;
            return;
        }

        hoveredNode = null;
        for (let node of skillNodes) {
            const dx = mx - node.x;
            const dy = my - node.y;
            if (dx * dx + dy * dy <= node.r * node.r * 1.5) {
                hoveredNode = node;
                canvas.style.cursor = 'pointer';
                break;
            }
        }
        if (!hoveredNode) canvas.style.cursor = 'default';
    }

    function onMouseDown(e) {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        for (let node of skillNodes) {
            const dx = mx - node.x;
            const dy = my - node.y;
            if (dx * dx + dy * dy <= node.r * node.r * 1.5) {
                draggedNode = node;
                shockwaves.push({ x: node.x, y: node.y, r: node.r, maxR: 60, opacity: 0.8, color: node.color });
                if (typeof playClickSound === 'function') playClickSound(850, 0.02);
                break;
            }
        }
    }

    function onMouseUp() {
        draggedNode = null;
    }

    function updatePhysics() {
        const w = canvas.width;
        const h = canvas.height;
        const centerX = w / 2;
        const centerY = h / 2;

        // Repulsion between nodes
        for (let i = 0; i < skillNodes.length; i++) {
            for (let j = i + 1; j < skillNodes.length; j++) {
                const n1 = skillNodes[i];
                const n2 = skillNodes[j];
                const dx = n2.x - n1.x;
                const dy = n2.y - n1.y;
                const distSq = dx * dx + dy * dy || 1;
                const dist = Math.sqrt(distSq);
                const minDist = n1.r + n2.r + 35;

                if (dist < minDist) {
                    const force = (minDist - dist) / dist * 0.05;
                    const fx = dx * force;
                    const fy = dy * force;
                    if (n1 !== draggedNode) { n1.x -= fx; n1.y -= fy; }
                    if (n2 !== draggedNode) { n2.x += fx; n2.y += fy; }
                }
            }
        }

        // Mild spring forces for links
        skillLinks.forEach(([id1, id2]) => {
            const n1 = skillNodes.find(n => n.id === id1);
            const n2 = skillNodes.find(n => n.id === id2);
            if (!n1 || !n2) return;

            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const targetDist = 95;
            const force = (dist - targetDist) * 0.002;

            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (n1 !== draggedNode) { n1.vx += fx; n1.vy += fy; }
            if (n2 !== draggedNode) { n2.vx -= fx; n2.vy -= fy; }
        });

        // Center gravity + Movement update
        skillNodes.forEach(node => {
            if (node === draggedNode) return;

            const gx = (centerX - node.x) * 0.0003;
            const gy = (centerY - node.y) * 0.0003;
            node.vx = (node.vx + gx) * 0.92;
            node.vy = (node.vy + gy) * 0.92;

            // Brownian drift
            node.vx += (Math.random() - 0.5) * 0.1;
            node.vy += (Math.random() - 0.5) * 0.1;

            node.x += node.vx;
            node.y += node.vy;

            // Boundaries
            const pad = node.r + 15;
            if (node.x < pad) { node.x = pad; node.vx *= -0.5; }
            if (node.x > w - pad) { node.x = w - pad; node.vx *= -0.5; }
            if (node.y < pad) { node.y = pad; node.vy *= -0.5; }
            if (node.y > h - pad) { node.y = h - pad; node.vy *= -0.5; }
        });

        // Update shockwaves
        shockwaves.forEach(sw => {
            sw.r += 2.5;
            sw.opacity -= 0.025;
        });
        shockwaves = shockwaves.filter(sw => sw.opacity > 0);
    }

    function draw() {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Links
        skillLinks.forEach(([id1, id2]) => {
            const n1 = skillNodes.find(n => n.id === id1);
            const n2 = skillNodes.find(n => n.id === id2);
            if (!n1 || !n2) return;

            const isHighlighted = hoveredNode && (hoveredNode.id === id1 || hoveredNode.id === id2);
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = isHighlighted ? 'rgba(46, 160, 67, 0.8)' : 'rgba(48, 54, 61, 0.45)';
            ctx.lineWidth = isHighlighted ? 2 : 1;
            ctx.stroke();
        });

        // Draw Shockwaves
        shockwaves.forEach(sw => {
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
            ctx.strokeStyle = sw.color;
            ctx.globalAlpha = sw.opacity;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
        });

        // Draw Nodes
        skillNodes.forEach(node => {
            const isHover = hoveredNode === node;
            const r = isHover ? node.r + 4 : node.r;

            // Outer Glow
            if (isHover) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, r + 8, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                ctx.globalAlpha = 0.25;
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }

            // Node Circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
            ctx.fillStyle = '#0d1117';
            ctx.strokeStyle = isHover ? '#ffffff' : node.color;
            ctx.lineWidth = isHover ? 2.5 : 1.8;
            ctx.fill();
            ctx.stroke();

            // Label
            ctx.font = isHover ? 'bold 0.82rem JetBrains Mono, monospace' : '0.74rem JetBrains Mono, monospace';
            ctx.fillStyle = isHover ? '#ffffff' : 'rgba(230, 237, 243, 0.9)';
            ctx.textAlign = 'center';
            ctx.fillText(node.label, node.x, node.y + r + 14);
        });

        // Draw Hover Tooltip Badge
        if (hoveredNode) {
            const badgeText = `[${hoveredNode.category.toUpperCase()}] ${hoveredNode.label}`;
            ctx.font = '600 0.78rem JetBrains Mono, monospace';
            const textWidth = ctx.measureText(badgeText).width;
            const bx = Math.max(10, Math.min(canvas.width - textWidth - 30, hoveredNode.x - textWidth / 2 - 10));
            const by = Math.max(25, hoveredNode.y - hoveredNode.r - 20);

            ctx.fillStyle = 'rgba(22, 27, 34, 0.95)';
            ctx.strokeStyle = hoveredNode.color;
            ctx.lineWidth = 1;
            ctx.fillRect(bx, by - 18, textWidth + 20, 24);
            ctx.strokeRect(bx, by - 18, textWidth + 20, 24);

            ctx.fillStyle = hoveredNode.color;
            ctx.textAlign = 'left';
            ctx.fillText(badgeText, bx + 10, by - 2);
        }
    }

    function animate() {
        if (activeView === 'graph') {
            updatePhysics();
            draw();
        }
        animFrame = requestAnimationFrame(animate);
    }

    function switchSkillsView(mode) {
        activeView = mode;
        const treeEl = document.querySelector('.skills-tree');
        const graphEl = document.getElementById('skillsGraphContainer');
        const btnTree = document.getElementById('btnViewTree');
        const btnGraph = document.getElementById('btnViewGraph');

        if (mode === 'graph') {
            if (treeEl) treeEl.style.display = 'none';
            if (graphEl) graphEl.style.display = 'block';
            if (btnTree) btnTree.classList.remove('active');
            if (btnGraph) btnGraph.classList.add('active');

            if (!isInitialized) {
                initGraphCanvas();
            } else {
                resizeCanvas();
            }
        } else {
            if (treeEl) treeEl.style.display = 'block';
            if (graphEl) graphEl.style.display = 'none';
            if (btnTree) btnTree.classList.add('active');
            if (btnGraph) btnGraph.classList.remove('active');
        }

        if (typeof playClickSound === 'function') playClickSound(700, 0.02);
    }

    window.switchSkillsView = switchSkillsView;
})();
