// Interactive Neural Skill Network Graph Visualizer v3.0
// Driven by shared window.SKILLS_DATA (7 categories, 76 skills + 7 category hubs)
(function() {
    'use strict';

    let canvas = null;
    let ctx = null;
    let animFrame = null;
    let isInitialized = false;
    let isSettled = false;
    let isInViewport = true;
    let isPageVisible = !document.hidden;
    let activeView = 'tree';
    let selectedCategory = 'all';

    let logicalWidth = 800;
    let logicalHeight = 560;
    let currentScale = 1;

    let allNodes = [];
    let hubNodes = [];
    let skillNodes = [];
    let links = [];
    const nodeById = new Map();
    const neighborsMap = new Map();

    let hoveredNode = null;
    let selectedNode = null;
    let draggedNode = null;
    let pointerDownPos = null;
    let didDragMove = false;
    let shockwaves = [];
    let intersectionObserver = null;
    let themeObserver = null;

    // Deterministic cluster anchor coordinates: [xFrac, yFrac]
    const DESKTOP_ANCHORS = {
        ml:      [0.20, 0.30],
        dl_nlp:  [0.51, 0.25],
        genai:   [0.82, 0.31],
        math:    [0.15, 0.74],
        lang:    [0.39, 0.72],
        backend: [0.63, 0.75],
        testing: [0.85, 0.71]
    };

    const MOBILE_ANCHORS = {
        ml:      [0.34, 0.16],
        dl_nlp:  [0.72, 0.27],
        genai:   [0.28, 0.43],
        lang:    [0.74, 0.51],
        backend: [0.27, 0.67],
        testing: [0.72, 0.74],
        math:    [0.45, 0.89]
    };

    function buildGraphFromSharedData() {
        const data = window.SKILLS_DATA;
        if (!data || !Array.isArray(data.categories)) return;

        allNodes = [];
        hubNodes = [];
        skillNodes = [];
        links = [];
        nodeById.clear();
        neighborsMap.clear();

        // Count conceptual link degree for subtle visual sizing of heavily connected nodes
        const degreeCount = new Map();
        (data.conceptualLinks || []).forEach(([a, b]) => {
            degreeCount.set(a, (degreeCount.get(a) || 0) + 1);
            degreeCount.set(b, (degreeCount.get(b) || 0) + 1);
        });

        data.categories.forEach((cat) => {
            const hubId = `hub_${cat.id}`;
            const hubNode = {
                id: hubId,
                isHub: true,
                label: cat.hubLabel,
                fullCategoryName: cat.name,
                category: cat.id,
                categoryName: cat.name,
                color: cat.color,
                lightColor: cat.lightColor || cat.color,
                baseR: 18,
                r: 18,
                skillCount: cat.skills.length,
                tooltip: `${cat.skills.length} skills · Use filter pills below to inspect cluster`,
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                targetX: 0,
                targetY: 0
            };

            hubNodes.push(hubNode);
            allNodes.push(hubNode);
            nodeById.set(hubId, hubNode);
            neighborsMap.set(hubId, new Set());

            cat.skills.forEach((skill, idx) => {
                const deg = degreeCount.get(skill.id) || 0;
                const skillNode = {
                    id: skill.id,
                    isHub: false,
                    label: skill.label,
                    category: cat.id,
                    categoryName: cat.name,
                    color: cat.color,
                    lightColor: cat.lightColor || cat.color,
                    baseR: deg >= 3 ? 10 : (deg >= 1 ? 9 : 8.2),
                    r: 9,
                    indexInCat: idx,
                    catSize: cat.skills.length,
                    tooltip: skill.tooltip,
                    x: 0,
                    y: 0,
                    vx: 0,
                    vy: 0,
                    targetX: 0,
                    targetY: 0
                };

                skillNodes.push(skillNode);
                allNodes.push(skillNode);
                nodeById.set(skill.id, skillNode);
                neighborsMap.set(skill.id, new Set());

                // Spoke connection to its category hub
                links.push({ source: hubNode, target: skillNode, isSpoke: true });
                neighborsMap.get(hubId).add(skillNode);
                neighborsMap.get(skill.id).add(hubNode);
            });
        });

        // Meaningful conceptual links
        (data.conceptualLinks || []).forEach(([sourceId, targetId]) => {
            const s = nodeById.get(sourceId);
            const t = nodeById.get(targetId);
            if (!s || !t) return;
            links.push({ source: s, target: t, isSpoke: false });
            neighborsMap.get(sourceId).add(t);
            neighborsMap.get(targetId).add(s);
        });
    }

    function renderFilterControls() {
        const legend = document.getElementById('skillsGraphLegend');
        const data = window.SKILLS_DATA;
        if (!legend || !data) return;

        legend.innerHTML = '';
        const totalSkills = skillNodes.length || data.getTotalSkillCount();

        const allBtn = document.createElement('button');
        allBtn.type = 'button';
        allBtn.className = 'graph-filter-btn' + (selectedCategory === 'all' ? ' active' : '');
        allBtn.setAttribute('data-cat', 'all');
        allBtn.textContent = `All Nodes (${totalSkills})`;
        allBtn.onclick = function(e) {
            if (e) e.preventDefault();
            filterGraphCategory('all');
        };
        legend.appendChild(allBtn);

        data.categories.forEach((cat) => {
            const count = skillNodes.filter(n => n.category === cat.id).length;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'graph-filter-btn' + (selectedCategory === cat.id ? ' active' : '');
            btn.setAttribute('data-cat', cat.id);

            const dot = document.createElement('span');
            dot.className = 'filter-dot';
            dot.style.color = cat.color;
            dot.style.pointerEvents = 'none';
            dot.textContent = '●';

            const label = document.createElement('span');
            label.style.pointerEvents = 'none';
            label.textContent = `${cat.name} (${count})`;

            btn.appendChild(dot);
            btn.appendChild(label);
            btn.onclick = function(e) {
                if (e) e.preventDefault();
                filterGraphCategory(cat.id);
            };
            legend.appendChild(btn);
        });

        const resetBtn = document.getElementById('graphFilterReset');
        if (resetBtn) {
            resetBtn.onclick = function(e) {
                if (e) e.preventDefault();
                filterGraphCategory('all');
            };
        }
    }

    function updateTargetHomes(snapPositions) {
        const w = logicalWidth;
        const h = logicalHeight;
        const isMobileWidth = w < 640;
        currentScale = Math.min(1, Math.max(0.56, w / 880));
        const anchors = isMobileWidth ? MOBILE_ANCHORS : DESKTOP_ANCHORS;

        const data = window.SKILLS_DATA;
        if (!data) return;

        data.categories.forEach((cat) => {
            const hub = nodeById.get(`hub_${cat.id}`);
            if (!hub) return;

            const isFocused = selectedCategory !== 'all' && selectedCategory === cat.id;
            const anchor = anchors[cat.id] || [0.5, 0.5];

            if (isFocused) {
                hub.targetX = w * 0.5;
                hub.targetY = h * 0.48;
                hub.r = Math.round(hub.baseR * Math.max(0.85, currentScale) * 1.12);
            } else {
                hub.targetX = anchor[0] * w;
                hub.targetY = anchor[1] * h;
                hub.r = Math.round(hub.baseR * currentScale);
            }

            const skills = cat.skills.map(s => nodeById.get(s.id)).filter(Boolean);
            const total = skills.length;

            if (isFocused) {
                // Wide elliptical layout centered around (w/2, h/2) for clean inspection
                const rxMax = Math.max(85, w * 0.36);
                const ryMax = Math.max(115, h * 0.35);

                if (total > 10) {
                    const innerCount = total === 18 ? 6 : 5;
                    const outerCount = total - innerCount;

                    skills.forEach((node, idx) => {
                        node.r = Math.round((node.baseR + 2) * Math.max(0.78, currentScale));
                        if (idx < innerCount) {
                            const angle = (idx / innerCount) * Math.PI * 2 - Math.PI / 2;
                            node.targetX = hub.targetX + Math.cos(angle) * (rxMax * 0.48);
                            node.targetY = hub.targetY + Math.sin(angle) * (ryMax * 0.46);
                        } else {
                            const oIdx = idx - innerCount;
                            const angle = (oIdx / outerCount) * Math.PI * 2 - Math.PI / 2 + (Math.PI / outerCount);
                            node.targetX = hub.targetX + Math.cos(angle) * rxMax;
                            node.targetY = hub.targetY + Math.sin(angle) * ryMax;
                        }
                    });
                } else {
                    skills.forEach((node, idx) => {
                        node.r = Math.round((node.baseR + 2.5) * Math.max(0.82, currentScale));
                        const angle = (idx / total) * Math.PI * 2 - Math.PI / 2;
                        node.targetX = hub.targetX + Math.cos(angle) * (rxMax * 0.85);
                        node.targetY = hub.targetY + Math.sin(angle) * (ryMax * 0.82);
                    });
                }
            } else {
                // Compact cluster constellation around category hub
                const clusterRadius = Math.min(w, h) * (isMobileWidth ? 0.135 : 0.145);

                if (total > 10) {
                    const innerCount = total === 18 ? 6 : 5;
                    const outerCount = total - innerCount;

                    skills.forEach((node, idx) => {
                        node.r = Math.max(5.5, Math.round(node.baseR * currentScale * 10) / 10);
                        if (idx < innerCount) {
                            const angle = (idx / innerCount) * Math.PI * 2 - Math.PI / 2;
                            const rDist = clusterRadius * 0.56;
                            node.targetX = hub.targetX + Math.cos(angle) * rDist;
                            node.targetY = hub.targetY + Math.sin(angle) * rDist;
                        } else {
                            const oIdx = idx - innerCount;
                            const angle = (oIdx / outerCount) * Math.PI * 2 - Math.PI / 2 + (Math.PI / outerCount);
                            const rDist = clusterRadius * 1.05;
                            node.targetX = hub.targetX + Math.cos(angle) * rDist;
                            node.targetY = hub.targetY + Math.sin(angle) * rDist;
                        }
                    });
                } else {
                    const rDist = clusterRadius * (0.72 + total * 0.014);
                    skills.forEach((node, idx) => {
                        node.r = Math.max(5.5, Math.round(node.baseR * currentScale * 10) / 10);
                        const angle = (idx / total) * Math.PI * 2 - Math.PI / 2;
                        node.targetX = hub.targetX + Math.cos(angle) * rDist;
                        node.targetY = hub.targetY + Math.sin(angle) * rDist;
                    });
                }
            }
        });

        // Clamp every target inside safe canvas bounds
        allNodes.forEach((node) => {
            const padX = node.r + (isMobileWidth ? 16 : 24);
            const padYTop = node.r + 22;
            const padYBot = node.r + 28;
            node.targetX = Math.max(padX, Math.min(w - padX, node.targetX));
            node.targetY = Math.max(padYTop, Math.min(h - padYBot, node.targetY));

            if (snapPositions) {
                node.x = node.targetX;
                node.y = node.targetY;
                node.vx = 0;
                node.vy = 0;
            }
        });
    }

    function initGraphCanvas() {
        canvas = document.getElementById('skillsGraphCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');

        if (allNodes.length === 0) {
            buildGraphFromSharedData();
        }
        renderFilterControls();
        resizeCanvas(true);

        window.addEventListener('resize', () => {
            if (activeView === 'graph') {
                resizeCanvas(false);
                wakeSimulation();
            }
        });

        // Mouse interactions
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('mouseleave', () => {
            hoveredNode = null;
            if (!draggedNode) {
                canvas.style.cursor = 'default';
                requestRender();
            }
        });

        // Touch interactions (mobile drag + tap-to-inspect without trapping vertical scroll)
        canvas.addEventListener('touchstart', onTouchStart, { passive: false });
        canvas.addEventListener('touchmove', onTouchMove, { passive: false });
        canvas.addEventListener('touchend', onTouchEnd, { passive: true });
        canvas.addEventListener('touchcancel', onTouchEnd, { passive: true });

        setupObservers();

        isInitialized = true;
        emitHubShockwaves('all');
        wakeSimulation();
    }

    function setupObservers() {
        const container = document.getElementById('skillsGraphContainer');
        if (container && 'IntersectionObserver' in window && !intersectionObserver) {
            intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    isInViewport = entry.isIntersecting;
                    if (isInViewport && activeView === 'graph') {
                        requestRender();
                    } else if (!isInViewport && animFrame) {
                        cancelAnimationFrame(animFrame);
                        animFrame = null;
                    }
                });
            }, { threshold: 0.05 });
            intersectionObserver.observe(container);
        }

        document.addEventListener('visibilitychange', () => {
            isPageVisible = !document.hidden;
            if (isPageVisible && activeView === 'graph' && isInViewport) {
                requestRender();
            } else if (!isPageVisible && animFrame) {
                cancelAnimationFrame(animFrame);
                animFrame = null;
            }
        });

        if (!themeObserver && 'MutationObserver' in window) {
            themeObserver = new MutationObserver(() => {
                if (activeView === 'graph' && isInitialized) {
                    requestRender();
                }
            });
            themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        }
    }

    function resizeCanvas(snap) {
        if (!canvas) return;
        const container = canvas.parentElement;
        if (!container) return;

        const rectWidth = container.clientWidth;
        if (rectWidth <= 0) return;

        logicalWidth = rectWidth;
        const isMobile = logicalWidth < 560;
        logicalHeight = isMobile
            ? Math.max(510, Math.min(Math.round(window.innerHeight * 0.70), 580))
            : Math.max(520, Math.min(Math.round(window.innerHeight * 0.68), 620));

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(logicalWidth * dpr);
        canvas.height = Math.round(logicalHeight * dpr);
        canvas.style.width = '100%';
        canvas.style.height = logicalHeight + 'px';

        if (ctx) {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        updateTargetHomes(Boolean(snap));
    }

    function isNodeInteractable(node) {
        if (selectedCategory === 'all') return true;
        return node.category === selectedCategory;
    }

    function findHitNode(mx, my, extraPad) {
        // Check active skill nodes & hubs (prefer topmost / smaller skill node if close)
        let best = null;
        let bestDistSq = Infinity;

        for (let i = allNodes.length - 1; i >= 0; i--) {
            const node = allNodes[i];
            if (!isNodeInteractable(node)) continue;

            const hitR = node.r + extraPad;
            const dx = mx - node.x;
            const dy = my - node.y;
            const distSq = dx * dx + dy * dy;
            if (distSq <= hitR * hitR && distSq < bestDistSq) {
                best = node;
                bestDistSq = distSq;
            }
        }
        return best;
    }

    function onMouseMove(e) {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        if (draggedNode) {
            if (pointerDownPos) {
                const d = Math.hypot(mx - pointerDownPos.x, my - pointerDownPos.y);
                if (d > 4) didDragMove = true;
            }
            const pad = draggedNode.r + 12;
            draggedNode.x = Math.max(pad, Math.min(logicalWidth - pad, mx));
            draggedNode.y = Math.max(pad, Math.min(logicalHeight - pad, my));
            draggedNode.vx = 0;
            draggedNode.vy = 0;
            wakeSimulation();
            return;
        }

        const hit = findHitNode(mx, my, 7);
        if (hit !== hoveredNode) {
            hoveredNode = hit;
            canvas.style.cursor = hit ? 'grab' : 'default';
            requestRender();
        }
    }

    function onMouseDown(e) {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        pointerDownPos = { x: mx, y: my };
        didDragMove = false;

        const hit = findHitNode(mx, my, 7);
        if (hit) {
            draggedNode = hit;
            hoveredNode = hit;
            selectedNode = hit;
            canvas.style.cursor = 'grabbing';
            shockwaves.push({ x: hit.x, y: hit.y, r: hit.r, maxR: hit.r + 36, opacity: 0.75, color: hit.color });
            if (typeof playClickSound === 'function') playClickSound(850, 0.02);
            wakeSimulation();
        } else if (selectedNode) {
            selectedNode = null;
            requestRender();
        }
    }

    function onMouseUp() {
        if (!draggedNode) return;
        draggedNode = null;
        pointerDownPos = null;
        if (canvas) {
            canvas.style.cursor = hoveredNode ? 'grab' : 'default';
        }
        wakeSimulation();
    }

    function onTouchStart(e) {
        if (!canvas || e.touches.length === 0) return;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const mx = touch.clientX - rect.left;
        const my = touch.clientY - rect.top;

        pointerDownPos = { x: mx, y: my };
        didDragMove = false;

        const hit = findHitNode(mx, my, 15);
        if (hit) {
            draggedNode = hit;
            hoveredNode = hit;
            selectedNode = hit;
            shockwaves.push({ x: hit.x, y: hit.y, r: hit.r, maxR: hit.r + 40, opacity: 0.85, color: hit.color });
            if (typeof playClickSound === 'function') playClickSound(850, 0.02);
            e.preventDefault();
            wakeSimulation();
        } else {
            // Allow vertical scroll when tapping/swiping empty background, just clear selection
            if (selectedNode || hoveredNode) {
                selectedNode = null;
                hoveredNode = null;
                requestRender();
            }
        }
    }

    function onTouchMove(e) {
        if (!canvas || !draggedNode || e.touches.length === 0) return;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const mx = touch.clientX - rect.left;
        const my = touch.clientY - rect.top;

        const pad = draggedNode.r + 12;
        draggedNode.x = Math.max(pad, Math.min(logicalWidth - pad, mx));
        draggedNode.y = Math.max(pad, Math.min(logicalHeight - pad, my));
        draggedNode.vx = 0;
        draggedNode.vy = 0;
        didDragMove = true;
        e.preventDefault();
        wakeSimulation();
    }

    function onTouchEnd() {
        if (draggedNode) {
            draggedNode = null;
            hoveredNode = null;
            wakeSimulation();
        }
        pointerDownPos = null;
    }

    function wakeSimulation() {
        isSettled = false;
        requestRender();
    }

    function requestRender() {
        if (activeView !== 'graph' || !isInViewport || !isPageVisible) return;
        if (!animFrame) {
            animFrame = requestAnimationFrame(tick);
        }
    }

    function emitHubShockwaves(catFilter) {
        hubNodes.forEach((hub) => {
            if (catFilter === 'all' || hub.category === catFilter) {
                shockwaves.push({
                    x: hub.x || hub.targetX,
                    y: hub.y || hub.targetY,
                    r: hub.r,
                    maxR: hub.r + 48,
                    opacity: 0.7,
                    color: hub.color
                });
            }
        });
    }

    function updatePhysics() {
        const w = logicalWidth;
        const h = logicalHeight;

        if (!isSettled || draggedNode) {
            // 1. Anchor spring toward deterministic cluster home
            const kHome = 0.042;
            for (let i = 0; i < allNodes.length; i++) {
                const n = allNodes[i];
                if (n === draggedNode) continue;
                n.vx += (n.targetX - n.x) * kHome;
                n.vy += (n.targetY - n.y) * kHome;
            }

            // 2. Pairwise collision repulsion so nodes never overlap
            const repulsePad = (selectedCategory === 'all' ? 11 : 18) * currentScale;
            for (let i = 0; i < allNodes.length; i++) {
                const n1 = allNodes[i];
                const active1 = isNodeInteractable(n1);
                for (let j = i + 1; j < allNodes.length; j++) {
                    const n2 = allNodes[j];
                    const active2 = isNodeInteractable(n2);
                    if (selectedCategory !== 'all' && active1 !== active2) continue;

                    const dx = n2.x - n1.x;
                    const dy = n2.y - n1.y;
                    const distSq = dx * dx + dy * dy;
                    const minDist = n1.r + n2.r + repulsePad;
                    if (distSq < minDist * minDist) {
                        const dist = Math.sqrt(distSq) || 0.1;
                        const overlap = (minDist - dist) / dist;
                        const push = overlap * 0.085;
                        const fx = dx * push;
                        const fy = dy * push;
                        if (n1 !== draggedNode) { n1.vx -= fx; n1.vy -= fy; }
                        if (n2 !== draggedNode) { n2.vx += fx; n2.vy += fy; }
                    }
                }
            }

            // 3. Tactile edge pull only when dragging so connected concepts respond naturally
            if (draggedNode) {
                const neighbors = neighborsMap.get(draggedNode.id);
                if (neighbors) {
                    neighbors.forEach((nbr) => {
                        const dx = draggedNode.x - nbr.x;
                        const dy = draggedNode.y - nbr.y;
                        nbr.vx += dx * 0.012;
                        nbr.vy += dy * 0.012;
                    });
                }
            }

            // 4. Damping, integration & boundary clamping
            let totalEnergy = 0;
            for (let i = 0; i < allNodes.length; i++) {
                const n = allNodes[i];
                if (n === draggedNode) continue;

                n.vx *= 0.80;
                n.vy *= 0.80;
                n.x += n.vx;
                n.y += n.vy;

                const padX = n.r + 12;
                const padYTop = n.r + 16;
                const padYBot = n.r + 24;
                if (n.x < padX) { n.x = padX; n.vx *= -0.4; }
                if (n.x > w - padX) { n.x = w - padX; n.vx *= -0.4; }
                if (n.y < padYTop) { n.y = padYTop; n.vy *= -0.4; }
                if (n.y > h - padYBot) { n.y = h - padYBot; n.vy *= -0.4; }

                totalEnergy += Math.abs(n.vx) + Math.abs(n.vy);
            }

            if (!draggedNode && totalEnergy < 0.12) {
                for (let i = 0; i < allNodes.length; i++) {
                    allNodes[i].vx = 0;
                    allNodes[i].vy = 0;
                }
                isSettled = true;
            }
        }

        // Update expanding shockwaves
        if (shockwaves.length > 0) {
            for (let i = 0; i < shockwaves.length; i++) {
                shockwaves[i].r += 2.6;
                shockwaves[i].opacity -= 0.03;
            }
            shockwaves = shockwaves.filter(sw => sw.opacity > 0);
        }
    }

    function getThemePalette() {
        const isLight = document.body.classList.contains('theme-light');
        const isMatrix = document.body.classList.contains('theme-matrix');
        return {
            isLight,
            isMatrix,
            nodeFill: isLight ? '#ffffff' : (isMatrix ? '#050a05' : '#0d1117'),
            hubFill: isLight ? '#f6f8fa' : (isMatrix ? '#0a120a' : '#161b22'),
            labelText: isLight ? '#1f2328' : 'rgba(230, 237, 243, 0.94)',
            labelBg: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(13, 17, 23, 0.86)',
            spokeIdle: isLight ? 'rgba(101, 109, 118, 0.25)' : 'rgba(139, 148, 158, 0.24)',
            crossIdle: isLight ? 'rgba(101, 109, 118, 0.12)' : 'rgba(139, 148, 158, 0.11)',
            linkDimmed: isLight ? 'rgba(101, 109, 118, 0.05)' : 'rgba(48, 54, 61, 0.07)',
            tooltipBg: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(13, 17, 23, 0.96)',
            tooltipBody: isLight ? '#24292f' : 'rgba(230, 237, 243, 0.92)',
            tooltipMeta: isLight ? '#57606a' : '#8b949e',
            activeRing: isLight ? '#1f2328' : '#ffffff'
        };
    }

    function boxesOverlap(a, b) {
        return !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y);
    }

    function makeClampedPillBox(centerX, centerY, boxW, boxH) {
        const clampedCx = Math.max(boxW / 2 + 4, Math.min(logicalWidth - boxW / 2 - 4, centerX));
        const bx = clampedCx - boxW / 2;
        const by = Math.max(4, Math.min(logicalHeight - boxH - 4, centerY - boxH / 2));
        return { x: bx, y: by, w: boxW, h: boxH, cx: clampedCx };
    }

    function drawPillLabel(text, cx, cy, fontSpec, textColor, bgColor, borderColor, drawnBoxes, altCy, allowSkip) {
        ctx.font = fontSpec;
        const metrics = ctx.measureText(text);
        const fontSize = parseInt(fontSpec.match(/(\d+)px/)?.[1] || '11', 10);
        const padX = 6;
        const padY = 3;
        const boxW = Math.min(logicalWidth - 8, metrics.width + padX * 2);
        const boxH = fontSize + padY * 2;

        const candidates = [[cx, cy]];
        if (altCy !== null && altCy !== undefined) {
            candidates.push([cx, altCy]);
        }
        candidates.push([cx, cy + 16], [cx, cy - 16]);
        if (altCy !== null && altCy !== undefined) {
            candidates.push([cx, altCy - 16], [cx, altCy + 16]);
        }
        candidates.push([cx - 24, cy], [cx + 24, cy]);

        let chosen = null;
        for (let i = 0; i < candidates.length; i++) {
            const candidateBox = makeClampedPillBox(candidates[i][0], candidates[i][1], boxW, boxH);
            if (!drawnBoxes.some(b => boxesOverlap(candidateBox, b))) {
                chosen = candidateBox;
                break;
            }
        }

        if (!chosen) {
            if (allowSkip) return false;
            chosen = makeClampedPillBox(cx, cy, boxW, boxH);
        }

        const bx = chosen.x;
        const by = chosen.y;
        const clampedCx = chosen.cx;

        drawnBoxes.push(chosen);

        ctx.fillStyle = bgColor;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(bx, by, boxW, boxH, 3);
        } else {
            ctx.rect(bx, by, boxW, boxH);
        }
        ctx.fill();

        if (borderColor) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 0.8;
            ctx.stroke();
        }

        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, clampedCx, by + boxH / 2 + 0.5);
        ctx.textBaseline = 'alphabetic';
        return true;
    }

    function wrapTextLines(text, maxWidth, fontSpec) {
        ctx.font = fontSpec;
        const words = text.split(/\s+/);
        const lines = [];
        let current = '';

        for (let i = 0; i < words.length; i++) {
            const test = current ? `${current} ${words[i]}` : words[i];
            if (ctx.measureText(test).width <= maxWidth) {
                current = test;
            } else {
                if (current) lines.push(current);
                current = words[i];
            }
        }
        if (current) lines.push(current);
        return lines;
    }

    function drawTooltip(node, palette) {
        const nodeColor = palette.isLight ? node.lightColor : node.color;
        const maxBoxW = Math.min(310, logicalWidth - 16);
        const innerMaxW = maxBoxW - 20;

        const catFont = '600 10px JetBrains Mono, monospace';
        const titleFont = '700 12px JetBrains Mono, monospace';
        const descFont = '400 11px JetBrains Mono, monospace';

        const catLine = node.isHub
            ? `CATEGORY HUB`
            : node.categoryName.toUpperCase();
        const titleLine = node.isHub ? node.fullCategoryName : node.label;
        const descLines = wrapTextLines(node.tooltip || '', innerMaxW, descFont);
        const catLines = wrapTextLines(catLine, innerMaxW, catFont);
        const titleLines = wrapTextLines(titleLine, innerMaxW, titleFont);

        let contentW = 0;
        ctx.font = catFont;
        catLines.forEach(l => { contentW = Math.max(contentW, ctx.measureText(l).width); });
        ctx.font = titleFont;
        titleLines.forEach(l => { contentW = Math.max(contentW, ctx.measureText(l).width); });
        ctx.font = descFont;
        descLines.forEach(l => { contentW = Math.max(contentW, ctx.measureText(l).width); });

        const boxW = Math.min(maxBoxW, Math.max(150, contentW + 22));
        const boxH = 14 + catLines.length * 13 + titleLines.length * 16 + descLines.length * 14 + 6;

        let bx = node.x - boxW / 2;
        bx = Math.max(8, Math.min(logicalWidth - boxW - 8, bx));

        let by = node.y - node.r - boxH - 12;
        if (by < 8) {
            by = Math.min(logicalHeight - boxH - 8, node.y + node.r + 14);
        }

        ctx.save();
        ctx.fillStyle = palette.tooltipBg;
        ctx.strokeStyle = nodeColor;
        ctx.lineWidth = 1.4;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(bx, by, boxW, boxH, 4);
        } else {
            ctx.rect(bx, by, boxW, boxH);
        }
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.stroke();

        ctx.textAlign = 'left';
        let ty = by + 16;

        ctx.font = catFont;
        ctx.fillStyle = nodeColor;
        catLines.forEach((l) => {
            ctx.fillText(l, bx + 11, ty);
            ty += 13;
        });

        ty += 2;
        ctx.font = titleFont;
        ctx.fillStyle = palette.labelText;
        titleLines.forEach((l) => {
            ctx.fillText(l, bx + 11, ty);
            ty += 16;
        });

        ctx.font = descFont;
        ctx.fillStyle = palette.tooltipBody;
        descLines.forEach((l) => {
            ctx.fillText(l, bx + 11, ty);
            ty += 14;
        });

        ctx.restore();
    }

    function draw() {
        if (!ctx || !canvas) return;
        const palette = getThemePalette();
        ctx.clearRect(0, 0, logicalWidth, logicalHeight);

        const activeNode = draggedNode || hoveredNode || selectedNode;
        const activeNeighbors = activeNode ? neighborsMap.get(activeNode.id) : null;

        // 1. Draw Links
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const n1 = link.source;
            const n2 = link.target;

            const touchesActive = activeNode && (n1 === activeNode || n2 === activeNode);
            const bothInFilter = selectedCategory === 'all' ||
                (n1.category === selectedCategory && n2.category === selectedCategory);
            const oneInFilter = selectedCategory !== 'all' &&
                (n1.category === selectedCategory || n2.category === selectedCategory);

            if (selectedCategory !== 'all' && !bothInFilter && !touchesActive) {
                // Keep faint backdrop for non-matching links
                if (!oneInFilter) {
                    ctx.beginPath();
                    ctx.moveTo(n1.x, n1.y);
                    ctx.lineTo(n2.x, n2.y);
                    ctx.strokeStyle = palette.linkDimmed;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
                continue;
            }

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);

            if (touchesActive) {
                const c = palette.isLight ? activeNode.lightColor : activeNode.color;
                ctx.strokeStyle = c;
                ctx.globalAlpha = 0.92;
                ctx.lineWidth = 2.1;
            } else if (selectedCategory !== 'all' && bothInFilter) {
                const c = palette.isLight ? n1.lightColor : n1.color;
                ctx.strokeStyle = c;
                ctx.globalAlpha = link.isSpoke ? 0.36 : 0.45;
                ctx.lineWidth = link.isSpoke ? 1.2 : 1.3;
            } else if (link.isSpoke) {
                ctx.strokeStyle = palette.isLight ? n1.lightColor : n1.color;
                ctx.globalAlpha = activeNode ? 0.14 : 0.28;
                ctx.lineWidth = 1.05;
            } else {
                ctx.strokeStyle = palette.crossIdle;
                ctx.globalAlpha = activeNode ? 0.35 : 1.0;
                ctx.lineWidth = 0.85;
            }

            ctx.stroke();
            ctx.globalAlpha = 1.0;
        }

        // 2. Draw Shockwaves
        for (let i = 0; i < shockwaves.length; i++) {
            const sw = shockwaves[i];
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
            ctx.strokeStyle = sw.color;
            ctx.globalAlpha = sw.opacity;
            ctx.lineWidth = 1.8;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
        }

        // 3. Draw Nodes (skills first, hubs on top)
        const drawNode = (node) => {
            const isDimmed = selectedCategory !== 'all' && node.category !== selectedCategory;
            const isActive = activeNode === node;
            const isNeighbor = Boolean(activeNeighbors && activeNeighbors.has(node));
            const nodeColor = palette.isLight ? node.lightColor : node.color;
            const r = isActive ? node.r + 3.5 : node.r;

            let alpha = 1.0;
            if (isDimmed) {
                alpha = 0.08;
            } else if (activeNode && !isActive && !isNeighbor) {
                alpha = selectedCategory === 'all' ? 0.42 : 0.55;
            }
            ctx.globalAlpha = alpha;

            // Halo for active or neighbor node
            if ((isActive || isNeighbor) && !isDimmed) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, r + (isActive ? 7 : 4.5), 0, Math.PI * 2);
                ctx.fillStyle = nodeColor;
                ctx.globalAlpha = isActive ? 0.28 : 0.16;
                ctx.fill();
                ctx.globalAlpha = alpha;
            }

            // Hub subtle outer dashed orbit ring
            if (node.isHub && !isDimmed) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, r + 4, 0, Math.PI * 2);
                ctx.strokeStyle = nodeColor;
                ctx.globalAlpha = Math.min(alpha, 0.45);
                ctx.lineWidth = 1.1;
                ctx.setLineDash([3, 3]);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.globalAlpha = alpha;
            }

            // Node circle body
            ctx.beginPath();
            ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
            ctx.fillStyle = node.isHub ? palette.hubFill : palette.nodeFill;
            ctx.strokeStyle = isActive ? palette.activeRing : nodeColor;
            ctx.lineWidth = isActive ? 2.4 : (node.isHub ? 2.2 : 1.6);
            ctx.fill();
            ctx.stroke();

            // Hub inner skill count
            if (node.isHub && !isDimmed) {
                const countFontSize = Math.max(9, Math.round(r * 0.62));
                ctx.font = `700 ${countFontSize}px JetBrains Mono, monospace`;
                ctx.fillStyle = nodeColor;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(String(node.skillCount), node.x, node.y + 0.5);
                ctx.textBaseline = 'alphabetic';
            }

            ctx.globalAlpha = 1.0;
        };

        for (let i = 0; i < skillNodes.length; i++) drawNode(skillNodes[i]);
        for (let i = 0; i < hubNodes.length; i++) drawNode(hubNodes[i]);

        // 4. Draw Non-Overlapping Labels
        const drawnBoxes = [];
        const labelFontSize = logicalWidth < 480 ? 10 : 11;
        const hubFontSize = logicalWidth < 480 ? 10 : 11.5;

        // Draw visible Category Hub labels
        for (let i = 0; i < hubNodes.length; i++) {
            const hub = hubNodes[i];
            if (selectedCategory !== 'all' && hub.category !== selectedCategory) continue;

            const hubColor = palette.isLight ? hub.lightColor : hub.color;
            const text = selectedCategory === 'all'
                ? `${hub.label} (${hub.skillCount})`
                : hub.fullCategoryName;

            const belowY = hub.y + hub.r + 12;
            const aboveY = hub.y - hub.r - 12;
            drawPillLabel(
                text,
                hub.x,
                belowY,
                `700 ${hubFontSize}px JetBrains Mono, monospace`,
                hubColor,
                palette.labelBg,
                hubColor,
                drawnBoxes,
                aboveY,
                false
            );
        }

        if (selectedCategory !== 'all') {
            // In filtered view, show ALL skill labels cleanly for the selected category
            const catSkills = skillNodes.filter(n => n.category === selectedCategory);
            // Draw active/hovered node label first so it always gets priority
            catSkills.sort((a, b) => (b === activeNode ? 1 : 0) - (a === activeNode ? 1 : 0));

            for (let i = 0; i < catSkills.length; i++) {
                const node = catSkills[i];
                if (node === activeNode) continue; // Tooltip already prominently displays activeNode
                const nodeColor = palette.isLight ? node.lightColor : node.color;
                const belowY = node.y + node.r + 11;
                const aboveY = node.y - node.r - 11;

                drawPillLabel(
                    node.label,
                    node.x,
                    belowY,
                    `500 ${labelFontSize}px JetBrains Mono, monospace`,
                    palette.labelText,
                    palette.labelBg,
                    node === activeNode ? nodeColor : null,
                    drawnBoxes,
                    aboveY,
                    false
                );
            }
        } else if (activeNode && activeNeighbors) {
            // In All view, reveal connected neighbors cleanly without overlapping hubs
            activeNeighbors.forEach((nbr) => {
                if (nbr.isHub || nbr === activeNode) return;
                const nbrColor = palette.isLight ? nbr.lightColor : nbr.color;
                const belowY = nbr.y + nbr.r + 11;
                const aboveY = nbr.y - nbr.r - 11;

                drawPillLabel(
                    nbr.label,
                    nbr.x,
                    belowY,
                    `500 ${labelFontSize}px JetBrains Mono, monospace`,
                    palette.labelText,
                    palette.labelBg,
                    nbrColor,
                    drawnBoxes,
                    aboveY,
                    true
                );
            });
        }

        // 5. Draw Rich Tooltip for Hovered / Selected Node
        if (activeNode && isNodeInteractable(activeNode)) {
            drawTooltip(activeNode, palette);
        }
    }

    function tick() {
        animFrame = null;
        if (activeView !== 'graph' || !isInViewport || !isPageVisible) return;

        updatePhysics();
        draw();

        if (!isSettled || draggedNode !== null || shockwaves.length > 0) {
            animFrame = requestAnimationFrame(tick);
        }
    }

    function filterGraphCategory(cat) {
        const data = window.SKILLS_DATA;
        if (allNodes.length === 0 && data) {
            buildGraphFromSharedData();
        }

        selectedCategory = cat || 'all';
        if (selectedNode && !isNodeInteractable(selectedNode)) {
            selectedNode = null;
        }
        if (hoveredNode && !isNodeInteractable(hoveredNode)) {
            hoveredNode = null;
        }

        // Update filter button active states
        document.querySelectorAll('.graph-filter-btn').forEach((btn) => {
            if (btn.getAttribute('data-cat') === selectedCategory) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        const resetBtn = document.getElementById('graphFilterReset');
        if (resetBtn) {
            resetBtn.style.display = selectedCategory === 'all' ? 'none' : 'inline-block';
        }

        // Update dynamic status badge
        const badge = document.querySelector('.graph-status-badge');
        if (badge) {
            if (selectedCategory === 'all') {
                badge.textContent = `● LIVE SIMULATION (${skillNodes.length} SKILLS)`;
                badge.style.color = 'var(--terminal-green)';
            } else {
                const catMeta = data ? data.getCategoryById(selectedCategory) : null;
                const count = skillNodes.filter(n => n.category === selectedCategory).length;
                const label = catMeta ? catMeta.name.toUpperCase() : selectedCategory.toUpperCase();
                badge.textContent = `● FILTER: [${label}] (${count} NODES)`;
                badge.style.color = catMeta ? catMeta.color : 'var(--terminal-green)';
            }
        }

        if (isInitialized) {
            updateTargetHomes(false);
            if (selectedCategory === 'all') {
                emitHubShockwaves('all');
            } else {
                emitHubShockwaves(selectedCategory);
            }
            wakeSimulation();
        }

        if (typeof playClickSound === 'function') playClickSound(800, 0.02);
    }

    function switchSkillsView(mode) {
        activeView = mode;
        const treeEl = document.getElementById('skillsTree') || document.querySelector('.skills-tree');
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
                resizeCanvas(false);
                renderFilterControls();
                wakeSimulation();
            }
        } else {
            if (treeEl) treeEl.style.display = 'block';
            if (graphEl) graphEl.style.display = 'none';
            if (btnTree) btnTree.classList.add('active');
            if (btnGraph) btnGraph.classList.remove('active');
            if (treeControls) treeControls.style.visibility = 'visible';

            if (animFrame) {
                cancelAnimationFrame(animFrame);
                animFrame = null;
            }
        }

        if (typeof playClickSound === 'function') playClickSound(700, 0.02);
    }

    // Expose globals & handle any queued category click
    window.switchSkillsView = switchSkillsView;
    window.filterGraphCategory = filterGraphCategory;
    window._internalFilterGraphCategory = filterGraphCategory;

    if (window._pendingGraphCategory) {
        selectedCategory = window._pendingGraphCategory;
        delete window._pendingGraphCategory;
    }

    function onReady() {
        buildGraphFromSharedData();
        renderFilterControls();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
    } else {
        onReady();
    }
})();
