// Interactive Neural Skill Network Graph Visualizer v2.2
// Features: Physics simulation, Shockwaves, Mobile Touch Support, Category Filtering & Project Linkages
(function() {
    let canvas = null;
    let ctx = null;
    let animFrame = null;
    let isInitialized = false;
    let activeView = 'tree';
    let selectedCategory = 'all';

    const skillNodes = [
        // Machine Learning (ml: #2ea44f)
        { id: 'scikit', label: 'Scikit-Learn', category: 'ml', categoryName: 'Machine Learning', color: '#2ea44f', r: 16, usedIn: 'ML-Foundations, Sentimental Analysis', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'xgboost', label: 'XGBoost', category: 'ml', categoryName: 'Machine Learning', color: '#2ea44f', r: 14, usedIn: 'ML-Foundations', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'numpy', label: 'NumPy', category: 'ml', categoryName: 'Math / Arrays', color: '#2ea44f', r: 13, usedIn: 'ML-Foundations, Math Proofs', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'pandas', label: 'Pandas', category: 'ml', categoryName: 'Data Analysis', color: '#2ea44f', r: 14, usedIn: 'ML-Foundations, WhatsApp Analyzer', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'stacking', label: 'Stacking Ensembles', category: 'ml', categoryName: 'Ensemble Learning', color: '#2ea44f', r: 15, usedIn: 'Sentimental_Analysis, CodeRoast', x: 0, y: 0, vx: 0, vy: 0 },

        // Deep Learning & NLP (dl_nlp: #d29922)
        { id: 'pytorch', label: 'PyTorch', category: 'dl_nlp', categoryName: 'Deep Learning', color: '#d29922', r: 18, usedIn: 'CodeRoast (LSTM Severity Scoring)', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'tensorflow', label: 'TensorFlow / Keras', category: 'dl_nlp', categoryName: 'Deep Learning', color: '#d29922', r: 15, usedIn: 'Next_Word_Prediction-LSTM-', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'tfidf', label: 'TF-IDF', category: 'dl_nlp', categoryName: 'NLP Vectorization', color: '#d29922', r: 13, usedIn: 'Emotion Classifier, CodeRoast', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'lstm', label: 'LSTM', category: 'dl_nlp', categoryName: 'Sequential Models', color: '#d29922', r: 15, usedIn: 'CodeRoast, Next Word Prediction', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'ast', label: 'AST Parsing', category: 'dl_nlp', categoryName: 'Code Analysis', color: '#d29922', r: 16, usedIn: 'CodeRoast, OOP Purity Analyzer', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'transformers', label: 'Transformers', category: 'dl_nlp', categoryName: 'NLP & Transformers', color: '#d29922', r: 17, inProgress: true, usedIn: 'Hugging Face Course', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'huggingface', label: 'Hugging Face', category: 'dl_nlp', categoryName: 'NLP & Transformers', color: '#d29922', r: 15, inProgress: true, usedIn: 'course/Transformers', x: 0, y: 0, vx: 0, vy: 0 },

        // GenAI & Agents (genai: #f78166)
        { id: 'langchain', label: 'LangChain', category: 'genai', categoryName: 'LLM Orchestration', color: '#f78166', r: 17, usedIn: 'Generative-AI, AI Agents', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'rag', label: 'RAG Pipelines', category: 'genai', categoryName: 'Retrieval Augmented Gen', color: '#f78166', r: 17, usedIn: 'Generative-AI, Kundali-SYP', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'chromadb', label: 'Vector DBs', category: 'genai', categoryName: 'Vector Embeddings', color: '#f78166', r: 14, usedIn: 'ChromaDB, pgvector', x: 0, y: 0, vx: 0, vy: 0 },

        // Languages (lang: #58a6ff)
        { id: 'python', label: 'Python 3.12', category: 'lang', categoryName: 'Core Language', color: '#58a6ff', r: 21, usedIn: '32+ Repositories & Research', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'java', label: 'Java', category: 'lang', categoryName: 'Object-Oriented', color: '#58a6ff', r: 15, usedIn: 'OOP Fundamentals, AI Subscription', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'cpp', label: 'C / C++', category: 'lang', categoryName: 'Systems Language', color: '#58a6ff', r: 14, usedIn: 'C-Programming, DSA', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'sql', label: 'SQL / Postgres', category: 'lang', categoryName: 'Databases & Vector', color: '#58a6ff', r: 14, usedIn: 'Kundali-SYP (pgvector)', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'js', label: 'JavaScript', category: 'lang', categoryName: 'Web & Scripts', color: '#58a6ff', r: 14, usedIn: 'Portfolio, Gyr0shell CLI', x: 0, y: 0, vx: 0, vy: 0 },

        // Math & Foundations (math: #bc8cff)
        { id: 'linalg', label: 'Linear Algebra', category: 'math', categoryName: 'Mathematical Foundations', color: '#bc8cff', r: 14, usedIn: 'ML-Foundations, Tensors', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'stats', label: 'Probability & Stats', category: 'math', categoryName: 'Mathematical Foundations', color: '#bc8cff', r: 14, usedIn: 'Binomial Calc, ML Proofs', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'oop', label: 'OOP Architecture', category: 'math', categoryName: 'Software Engineering', color: '#bc8cff', r: 15, usedIn: 'OOP Purity Quantitative Paper', x: 0, y: 0, vx: 0, vy: 0 },

        // Tools & Deployment (tools: #f0883e)
        { id: 'fastapi', label: 'FastAPI', category: 'tools', categoryName: 'Backend & Inference', color: '#f0883e', r: 16, usedIn: 'Kundali-SYP Backend Engine', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'streamlit', label: 'Streamlit', category: 'tools', categoryName: 'ML Web Apps', color: '#f0883e', r: 15, usedIn: 'CodeRoast, Sentiment Classifier', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'flask', label: 'Flask', category: 'tools', categoryName: 'Web Framework', color: '#f0883e', r: 14, usedIn: 'OOP Purity Analyzer', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'git', label: 'Git / GitHub', category: 'tools', categoryName: 'Version Control', color: '#f0883e', r: 14, usedIn: '32+ Public Repos, 3500+ Commits', x: 0, y: 0, vx: 0, vy: 0 },
        { id: 'linux', label: 'Linux (Fedora/Debian)', category: 'tools', categoryName: 'Environments', color: '#f0883e', r: 14, usedIn: 'Development & CLI Tools', x: 0, y: 0, vx: 0, vy: 0 }
    ];

    const skillLinks = [
        // Python Central Hub
        ['python', 'pytorch'], ['python', 'scikit'], ['python', 'pandas'], ['python', 'numpy'],
        ['python', 'ast'], ['python', 'flask'], ['python', 'fastapi'], ['python', 'langchain'],

        // Deep Learning & NLP
        ['pytorch', 'transformers'], ['pytorch', 'lstm'], ['pytorch', 'stacking'], ['pytorch', 'tensorflow'],
        ['tensorflow', 'lstm'],
        ['transformers', 'huggingface'], ['huggingface', 'pytorch'],
        ['tfidf', 'lstm'], ['tfidf', 'transformers'], ['tfidf', 'stacking'],

        // GenAI & Agents
        ['langchain', 'rag'], ['langchain', 'chromadb'], ['rag', 'chromadb'],
        ['rag', 'transformers'], ['rag', 'fastapi'],

        // ML & Math
        ['scikit', 'xgboost'], ['scikit', 'stacking'], ['scikit', 'stats'],
        ['pandas', 'numpy'], ['numpy', 'linalg'],
        ['linalg', 'stats'], ['stats', 'scikit'],

        // Languages & OOP
        ['java', 'oop'], ['python', 'oop'], ['cpp', 'oop'],

        // Tools & Fullstack
        ['fastapi', 'sql'], ['fastapi', 'streamlit'], ['js', 'streamlit'], ['flask', 'python'], ['git', 'linux']
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

        // Position nodes evenly in central distributed field
        const w = canvas.width;
        const h = canvas.height;
        skillNodes.forEach((node, i) => {
            const angle = (i / skillNodes.length) * Math.PI * 2;
            const radius = Math.min(w, h) * 0.30 + (Math.sin(i * 1.5) * 45);
            node.x = w / 2 + Math.cos(angle) * radius;
            node.y = h / 2 + Math.sin(angle) * radius;
            node.vx = (Math.random() - 0.5) * 0.4;
            node.vy = (Math.random() - 0.5) * 0.4;
        });

        // Mouse Event Listeners
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('mouseleave', () => { hoveredNode = null; draggedNode = null; });

        // Mobile Touch Listeners (Full touch support)
        canvas.addEventListener('touchstart', onTouchStart, { passive: false });
        canvas.addEventListener('touchmove', onTouchMove, { passive: false });
        canvas.addEventListener('touchend', onTouchEnd, { passive: false });
        canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });

        setupFilterButtonListeners();

        isInitialized = true;
        animate();
    }

    function resizeCanvas() {
        if (!canvas) return;
        const container = canvas.parentElement;
        if (container) {
            canvas.width = container.clientWidth;
            canvas.height = Math.max(400, Math.min(window.innerHeight * 0.55, 540));
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
            // Ignore hovering dimmed nodes when a category filter is active
            if (selectedCategory !== 'all' && node.category !== selectedCategory) continue;

            const dx = mx - node.x;
            const dy = my - node.y;
            if (dx * dx + dy * dy <= (node.r + 6) * (node.r + 6)) {
                hoveredNode = node;
                canvas.style.cursor = 'grab';
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
            if (selectedCategory !== 'all' && node.category !== selectedCategory) continue;

            const dx = mx - node.x;
            const dy = my - node.y;
            if (dx * dx + dy * dy <= (node.r + 6) * (node.r + 6)) {
                draggedNode = node;
                canvas.style.cursor = 'grabbing';
                shockwaves.push({ x: node.x, y: node.y, r: node.r, maxR: 60, opacity: 0.8, color: node.color });
                if (typeof playClickSound === 'function') playClickSound(850, 0.02);
                break;
            }
        }
    }

    function onMouseUp() {
        draggedNode = null;
        if (canvas) canvas.style.cursor = hoveredNode ? 'grab' : 'default';
    }

    // Touch Event Handlers
    function onTouchStart(e) {
        if (!canvas || e.touches.length === 0) return;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const mx = touch.clientX - rect.left;
        const my = touch.clientY - rect.top;

        for (let node of skillNodes) {
            if (selectedCategory !== 'all' && node.category !== selectedCategory) continue;

            const dx = mx - node.x;
            const dy = my - node.y;
            if (dx * dx + dy * dy <= (node.r + 14) * (node.r + 14)) {
                draggedNode = node;
                hoveredNode = node;
                shockwaves.push({ x: node.x, y: node.y, r: node.r, maxR: 65, opacity: 0.85, color: node.color });
                if (typeof playClickSound === 'function') playClickSound(850, 0.02);
                e.preventDefault();
                break;
            }
        }
    }

    function onTouchMove(e) {
        if (!canvas || !draggedNode || e.touches.length === 0) return;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        draggedNode.x = touch.clientX - rect.left;
        draggedNode.y = touch.clientY - rect.top;
        draggedNode.vx = 0;
        draggedNode.vy = 0;
        e.preventDefault();
    }

    function onTouchEnd() {
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
                const minDist = n1.r + n2.r + 38;

                if (dist < minDist) {
                    const force = (minDist - dist) / dist * 0.06;
                    const fx = dx * force;
                    const fy = dy * force;
                    if (n1 !== draggedNode) { n1.x -= fx; n1.y -= fy; }
                    if (n2 !== draggedNode) { n2.x += fx; n2.y += fy; }
                }
            }
        }

        // Mild spring forces for synaptic links
        skillLinks.forEach(([id1, id2]) => {
            const n1 = skillNodes.find(n => n.id === id1);
            const n2 = skillNodes.find(n => n.id === id2);
            if (!n1 || !n2) return;

            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const targetDist = 92;
            const force = (dist - targetDist) * 0.002;

            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (n1 !== draggedNode) { n1.vx += fx; n1.vy += fy; }
            if (n2 !== draggedNode) { n2.vx -= fx; n2.vy -= fy; }
        });

        // Center gravity + Brownian drift
        skillNodes.forEach(node => {
            if (node === draggedNode) return;

            const gx = (centerX - node.x) * 0.0003;
            const gy = (centerY - node.y) * 0.0003;
            node.vx = (node.vx + gx) * 0.92;
            node.vy = (node.vy + gy) * 0.92;

            node.vx += (Math.random() - 0.5) * 0.08;
            node.vy += (Math.random() - 0.5) * 0.08;

            node.x += node.vx;
            node.y += node.vy;

            // Boundaries protection
            const pad = node.r + 18;
            if (node.x < pad) { node.x = pad; node.vx *= -0.5; }
            if (node.x > w - pad) { node.x = w - pad; node.vx *= -0.5; }
            if (node.y < pad) { node.y = pad; node.vy *= -0.5; }
            if (node.y > h - pad) { node.y = h - pad; node.vy *= -0.5; }
        });

        // Shockwaves
        shockwaves.forEach(sw => {
            sw.r += 2.8;
            sw.opacity -= 0.025;
        });
        shockwaves = shockwaves.filter(sw => sw.opacity > 0);
    }

    function draw() {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Synaptic Links
        skillLinks.forEach(([id1, id2]) => {
            const n1 = skillNodes.find(n => n.id === id1);
            const n2 = skillNodes.find(n => n.id === id2);
            if (!n1 || !n2) return;

            const isHoveredLink = hoveredNode && (hoveredNode.id === id1 || hoveredNode.id === id2);
            const isCategoryActive = selectedCategory === 'all' || 
                (n1.category === selectedCategory && n2.category === selectedCategory);
            const isCategoryDimmed = selectedCategory !== 'all' && 
                (n1.category !== selectedCategory && n2.category !== selectedCategory);

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);

            if (isHoveredLink) {
                ctx.strokeStyle = 'rgba(63, 185, 80, 0.9)';
                ctx.lineWidth = 2.2;
            } else if (isCategoryActive && selectedCategory !== 'all') {
                ctx.strokeStyle = n1.color;
                ctx.lineWidth = 2.0;
            } else if (isCategoryDimmed) {
                ctx.strokeStyle = 'rgba(48, 54, 61, 0.08)';
                ctx.lineWidth = 0.6;
            } else {
                ctx.strokeStyle = 'rgba(48, 54, 61, 0.45)';
                ctx.lineWidth = 1;
            }
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
            const isDimmed = selectedCategory !== 'all' && node.category !== selectedCategory;
            const isCatMatch = selectedCategory !== 'all' && node.category === selectedCategory;

            // Heavily dim non-matching nodes to make the active cluster immediately visible
            ctx.globalAlpha = isDimmed ? 0.08 : 1.0;

            // Active category pulsing ring
            if (isCatMatch && !isHover) {
                ctx.beginPath();
                const matchRingR = r + 5 + Math.sin(Date.now() * 0.005) * 3;
                ctx.arc(node.x, node.y, matchRingR, 0, Math.PI * 2);
                ctx.strokeStyle = node.color;
                ctx.lineWidth = 1.5;
                ctx.globalAlpha = 0.55;
                ctx.stroke();
                ctx.globalAlpha = 1.0;
            }

            // In-Progress Pulsing Aura Ring
            if (node.inProgress && !isDimmed) {
                const pulseR = r + 6 + Math.sin(Date.now() * 0.005) * 4;
                ctx.beginPath();
                ctx.arc(node.x, node.y, pulseR, 0, Math.PI * 2);
                ctx.strokeStyle = node.color;
                ctx.globalAlpha = 0.45 + Math.sin(Date.now() * 0.005) * 0.25;
                ctx.setLineDash([4, 3]);
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.globalAlpha = isDimmed ? 0.08 : 1.0;
            }

            // Outer Glow (Hover or Filter match)
            if (isHover || (isCatMatch && !isHover)) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, r + (isHover ? 8 : 6), 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                ctx.globalAlpha = isHover ? 0.35 : 0.22;
                ctx.fill();
                ctx.globalAlpha = isDimmed ? 0.08 : 1.0;
            }

            // Core Node Circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
            ctx.fillStyle = '#0d1117';
            ctx.strokeStyle = isHover ? '#ffffff' : (isCatMatch ? '#ffffff' : node.color);
            ctx.lineWidth = isHover ? 2.5 : (isCatMatch ? 2.2 : (node.inProgress ? 2 : 1.8));
            if (node.inProgress) ctx.setLineDash([4, 2]);
            ctx.fill();
            ctx.stroke();
            ctx.setLineDash([]);

            // Label text below node
            ctx.font = isHover ? 'bold 0.82rem JetBrains Mono, monospace' : (isCatMatch ? '600 0.78rem JetBrains Mono, monospace' : '0.74rem JetBrains Mono, monospace');
            ctx.fillStyle = isHover ? '#ffffff' : (isCatMatch ? '#ffffff' : 'rgba(230, 237, 243, 0.9)');
            ctx.textAlign = 'center';
            const labelText = node.inProgress ? `${node.label} ⚡` : node.label;
            ctx.fillText(labelText, node.x, node.y + r + 14);

            ctx.globalAlpha = 1.0;
        });

        // Draw Interactive Hover Tooltip Box
        if (hoveredNode) {
            const isCatDimmed = selectedCategory !== 'all' && hoveredNode.category !== selectedCategory;
            if (!isCatDimmed) {
                const statusTag = hoveredNode.inProgress ? ' [⚡ IN PROGRESS]' : '';
                const titleLine = `[${(hoveredNode.categoryName || hoveredNode.category).toUpperCase()}] ${hoveredNode.label}${statusTag}`;
                const projectLine = hoveredNode.usedIn ? `Used in: ${hoveredNode.usedIn}` : '';

                ctx.font = '600 0.78rem JetBrains Mono, monospace';
                const titleWidth = ctx.measureText(titleLine).width;
                ctx.font = '0.72rem JetBrains Mono, monospace';
                const projWidth = projectLine ? ctx.measureText(projectLine).width : 0;

                const boxWidth = Math.max(titleWidth, projWidth) + 24;
                const boxHeight = projectLine ? 46 : 28;

                const bx = Math.max(12, Math.min(canvas.width - boxWidth - 12, hoveredNode.x - boxWidth / 2));
                const by = Math.max(32, hoveredNode.y - hoveredNode.r - (projectLine ? 34 : 20));

                // Tooltip background frame
                ctx.fillStyle = 'rgba(13, 17, 23, 0.96)';
                ctx.strokeStyle = hoveredNode.color;
                ctx.lineWidth = 1.2;
                ctx.fillRect(bx, by - 16, boxWidth, boxHeight);
                ctx.strokeRect(bx, by - 16, boxWidth, boxHeight);

                // Category & Title
                ctx.font = '600 0.78rem JetBrains Mono, monospace';
                ctx.fillStyle = hoveredNode.color;
                ctx.textAlign = 'left';
                ctx.fillText(titleLine, bx + 10, by);

                // Project Linkage
                if (projectLine) {
                    ctx.font = '0.72rem JetBrains Mono, monospace';
                    ctx.fillStyle = 'rgba(230, 237, 243, 0.88)';
                    ctx.fillText(projectLine, bx + 10, by + 18);
                }
            }
        }
    }

    function animate() {
        if (activeView === 'graph') {
            updatePhysics();
            draw();
        }
        animFrame = requestAnimationFrame(animate);
    }

    function setupFilterButtonListeners() {
        const buttons = document.querySelectorAll('.graph-filter-btn');
        buttons.forEach(btn => {
            btn.onclick = function(e) {
                if (e) e.preventDefault();
                const cat = this.getAttribute('data-cat') || 'all';
                filterGraphCategory(cat);
            };
        });

        const resetBtn = document.getElementById('graphFilterReset');
        if (resetBtn) {
            resetBtn.onclick = function(e) {
                if (e) e.preventDefault();
                filterGraphCategory('all');
            };
        }
    }

    function filterGraphCategory(cat) {
        selectedCategory = cat;

        // 1. Update button active states
        const buttons = document.querySelectorAll('.graph-filter-btn');
        buttons.forEach(btn => {
            const btnCat = btn.getAttribute('data-cat');
            if (btnCat === cat) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 2. Update reset button
        const resetBtn = document.getElementById('graphFilterReset');
        if (resetBtn) {
            resetBtn.style.display = (cat === 'all') ? 'none' : 'inline-block';
        }

        // 3. Update status badge text & color
        const badge = document.querySelector('.graph-status-badge');
        if (badge) {
            if (cat === 'all') {
                badge.textContent = '● LIVE SIMULATION';
                badge.style.color = 'var(--terminal-green)';
            } else {
                const count = skillNodes.filter(n => n.category === cat).length;
                const catNames = {
                    ml: 'Machine Learning',
                    dl_nlp: 'Deep Learning & NLP',
                    genai: 'GenAI & Agents',
                    lang: 'Languages',
                    math: 'Math & Foundations',
                    tools: 'Tools & Deployment'
                };
                const catColors = {
                    ml: '#2ea44f',
                    dl_nlp: '#d29922',
                    genai: '#f78166',
                    lang: '#58a6ff',
                    math: '#bc8cff',
                    tools: '#f0883e'
                };
                const displayName = catNames[cat] || cat.toUpperCase();
                badge.textContent = `● FILTER: [${displayName.toUpperCase()}] (${count} NODES)`;
                badge.style.color = catColors[cat] || 'var(--terminal-green)';
            }
        }

        // 4. Trigger impulse shockwave on active category nodes
        skillNodes.forEach(node => {
            if (cat === 'all' || node.category === cat) {
                shockwaves.push({ x: node.x, y: node.y, r: node.r, maxR: 52, opacity: 0.8, color: node.color });
            }
        });

        if (typeof playClickSound === 'function') playClickSound(800, 0.02);
    }

    function switchSkillsView(mode) {
        activeView = mode;
        const treeEl = document.querySelector('.skills-tree');
        const graphEl = document.getElementById('skillsGraphContainer');
        const btnTree = document.getElementById('btnViewTree');
        const btnGraph = document.getElementById('btnViewGraph');
        const treeControls = document.querySelector('.skills-controls > div');

        if (mode === 'graph') {
            if (treeEl) treeEl.style.display = 'none';
            if (graphEl) graphEl.style.display = 'block';
            if (btnTree) btnTree.classList.remove('active');
            if (btnGraph) btnGraph.classList.add('active');
            if (treeControls) treeControls.style.visibility = 'hidden';

            if (!isInitialized) {
                initGraphCanvas();
            } else {
                resizeCanvas();
            }
            setupFilterButtonListeners();
        } else {
            if (treeEl) treeEl.style.display = 'block';
            if (graphEl) graphEl.style.display = 'none';
            if (btnTree) btnTree.classList.add('active');
            if (btnGraph) btnGraph.classList.remove('active');
            if (treeControls) treeControls.style.visibility = 'visible';
        }

        if (typeof playClickSound === 'function') playClickSound(700, 0.02);
    }

    // Expose globals immediately
    window.switchSkillsView = switchSkillsView;
    window.filterGraphCategory = filterGraphCategory;
    window._internalFilterGraphCategory = filterGraphCategory;

    // Check if a category filter was clicked before script evaluation
    if (window._pendingGraphCategory) {
        filterGraphCategory(window._pendingGraphCategory);
        delete window._pendingGraphCategory;
    }

    // Bind on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupFilterButtonListeners);
    } else {
        setupFilterButtonListeners();
    }
})();
