// Full Interactive CLI Command Line Terminal Emulator Engine & Virtual File System

let commandHistory = [];
let historyIndex = -1;

// ─── Virtual File System (VFS) ───────────────────────────────────────────
const virtualFileSystem = {
    "~": {
        type: "dir",
        children: {
            "whoami.txt": {
                type: "file",
                content: `Gaurav Dulal (gyr0byte) | Age 20 | Belbari-2, Morang, Nepal
BHons Computing @ IIC / London Met University
Target: University of Tübingen MSc Machine Learning (2028 Cohort)
Motto: "Not a person, a process — always building, never stopping."`
            },
            "resume.json": {
                type: "file",
                content: `{
  "name": "Gaurav Dulal",
  "alias": "gyr0byte",
  "age": 20,
  "location": "Belbari, Morang, Nepal",
  "education": {
    "current": "BHons Computing @ IIC / London Met University",
    "target": "MSc Machine Learning — University of Tübingen (2028)"
  },
  "languages": ["Python", "Java", "JavaScript", "C", "C++", "SQL", "Bash"],
  "ml_stack": ["PyTorch", "Scikit-Learn", "XGBoost", "TensorFlow", "Keras"],
  "nlp": ["TF-IDF", "LSTM", "AST Parsing", "Stacking Ensembles", "Transformers"],
  "tools": ["Git", "Streamlit", "Flask", "Jupyter", "Plotly", "Linux"],
  "deploy": ["Render", "Streamlit Cloud", "Cloudflare"],
  "repositories": "29+ public on GitHub",
  "contributions": "3,700+",
  "streak": "198+ days",
  "research": "OOP Purity Quantitative Framework (Journal Submission 2026)",
  "email": "gqurav69@gmail.com"
}`
            },
            ".bashrc": {
                type: "file",
                content: `# ~/.bashrc — Gaurav Dulal (gyr0byte) environment
export CUDA_VISIBLE_DEVICES=0
export TORCH_CUDA_ARCH_LIST="8.9;9.0"
export WANDB_PROJECT="tubingen-msc-ml-2028"
export PYTHONPATH="$PYTHONPATH:~/research:~/repositories"

# ML & Engineering Aliases
alias ll='ls -la'
alias python='python3.12'
alias train='python -m torch.distributed.run train_transformer.py'
alias monitor='nvtop'
alias purity='python ~/research/ast_analyzer.py'
alias gitstat='curl github.com/gyr0byte/stats'`
            },
            "research": {
                type: "dir",
                children: {
                    "paper.txt": {
                        type: "file",
                        content: `PAPER: A Quantitative Framework for Evaluating Object-Oriented Purity in Modern Programming Languages
AUTHORS: Gaurav Dulal + 3 collaborators
STATUS: In Progress → Journal Submission (2026)
CONTRIBUTIONS:
1. 7-category, 24-subcriterion objective scoring matrix for OOP paradigm compliance.
2. Automated static AST analyzer parsing codebases across Python, Java, C++, and JavaScript.
3. Benchmarked 100+ open-source repositories to derive empirical purity distribution.`
                    },
                    "abstract.txt": {
                        type: "file",
                        content: `Abstract: Object-oriented programming remains foundational to modern software systems, yet real-world implementations frequently diverge from textbook OOP purity. We present an objective 7-category, 24-subcriterion quantitative evaluation framework powered by AST visitors that compute rigorous metric scores across diverse multi-paradigm languages.`
                    },
                    "methodology.md": {
                        type: "file",
                        content: `## Research Methodology
1. AST Extraction: Static node visitor traversal across multi-language codebases.
2. Metric formulation: Encapsulation index, inheritance depth, polymorphism density.
3. Cross-language normalization: Benchmarking 100+ GitHub repositories.`
                    }
                }
            },
            "skills": {
                type: "dir",
                children: {
                    "machine_learning.txt": {
                        type: "file",
                        content: `Machine Learning Stack:
- NumPy, Pandas, Scikit-Learn, XGBoost, Random Forest
- Linear/Logistic Regression, SVM, Decision Trees, K-Means, DBSCAN, PCA
- 10-fold Stratified Cross-Validation, Feature Engineering, GridSearchCV`
                    },
                    "deep_learning.txt": {
                        type: "file",
                        content: `Deep Learning & NLP Stack [IN PROGRESS]:
- PyTorch, TensorFlow, Keras
- ANN, CNN, RNN, LSTM architectures
- TF-IDF, Word2Vec, AST Parsing, Stacking Ensembles, Transformers`
                    },
                    "languages.txt": {
                        type: "file",
                        content: `Languages & Foundations:
- Core: Python 3.12, Java, C++, C, JavaScript (ES6+), SQL, Bash
- Math: Linear Algebra, Probability & Statistics, Hypothesis Testing
- Architecture: Object-Oriented Design, Data Structures & Algorithms`
                    },
                    "tools.txt": {
                        type: "file",
                        content: `Engineering & Deployment Tools:
- Git, GitHub Actions, Linux (Ubuntu / Arch / Debian)
- Streamlit, Flask, Jupyter Lab, Plotly, Postman
- Cloud: Render, Streamlit Cloud, Cloudflare Workers`
                    }
                }
            },
            "repositories": {
                type: "dir",
                children: {
                    "coderoast.md": {
                        type: "file",
                        content: `# 1. CodeRoast [AST + PyTorch LSTM + Savage LLM Roasts]
- Multi-stage critique engine combining static AST checks with severity scoring
- Persistent zero-refusal comedy roast persona with constructive code fixes
- Interactive Streamlit dashboard with radar charts
- Repo: github.com/gyr0byte/CodeRoast`
                    },
                    "oop-purity-analyzer.md": {
                        type: "file",
                        content: `# 2. OOP Purity Analyzer [Flask + Plotly + AST Static Analysis]
- 7-category, 24-subcriterion objective scoring matrix for OOP purity
- Automated static analyzer parsing Python, Java, C++, JavaScript
- Live App: oop-purity-analyzer-1.onrender.com
- Repo: github.com/gyr0byte/OOP_Purity_Analyzer`
                    },
                    "emotion-classifier.md": {
                        type: "file",
                        content: `# 3. Text Emotion Classifier [NLP + TF-IDF + Stacking Ensemble]
- Multi-class emotional state predictor from raw text input
- Scikit-Learn Stacking Classifier combining gradient boosting & logistic estimators
- Live App: sentiment-analysis-me.streamlit.app
- Repo: github.com/gyr0byte/Sentimental_Analysis`
                    },
                    "ml-foundations.md": {
                        type: "file",
                        content: `# 4. ML-Foundations [NumPy → PyTorch Algorithms]
- Modular machine learning learning roadmap from scratch
- End-to-end notebooks covering EDA, proofs, optimization, loss functions
- Repo: github.com/gyr0byte/ML-Foundations`
                    }
                }
            }
        }
    }
};

let currentVfsPath = '~';
let prevVfsPath = '~';

function updatePromptDisplay() {
    const promptElem = document.getElementById('modalCliPrompt');
    if (promptElem) {
        promptElem.textContent = `gaurav@gyr0byte:${currentVfsPath}$`;
    }
}

function resolveVfsPath(pathStr) {
    if (!pathStr || pathStr === '~' || pathStr === '.') {
        return pathStr === '.' ? currentVfsPath : '~';
    }
    if (pathStr === '-') {
        return prevVfsPath;
    }
    if (pathStr.startsWith('~/')) {
        return pathStr;
    }
    if (pathStr === '/') {
        return '~';
    }
    if (pathStr.startsWith('/')) {
        return '~' + pathStr;
    }

    const baseParts = (currentVfsPath === '~' ? '' : currentVfsPath.replace('~/', '')).split('/').filter(Boolean);
    const targetParts = pathStr.split('/').filter(Boolean);

    for (const part of targetParts) {
        if (part === '.') continue;
        if (part === '..') {
            baseParts.pop();
        } else {
            baseParts.push(part);
        }
    }

    return baseParts.length === 0 ? '~' : '~/' + baseParts.join('/');
}

function getVfsNode(normalizedPath) {
    if (normalizedPath === '~') {
        return virtualFileSystem["~"];
    }
    const rel = normalizedPath.replace('~/', '');
    const segments = rel.split('/').filter(Boolean);
    let curr = virtualFileSystem["~"];
    for (const seg of segments) {
        if (!curr || curr.type !== 'dir' || !curr.children || !curr.children[seg]) {
            return null;
        }
        curr = curr.children[seg];
    }
    return curr;
}

function executeCd(targetPath) {
    if (!targetPath || targetPath === '~') {
        prevVfsPath = currentVfsPath;
        currentVfsPath = '~';
        updatePromptDisplay();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    if (targetPath === '-') {
        const temp = currentVfsPath;
        currentVfsPath = prevVfsPath;
        prevVfsPath = temp;
        updatePromptDisplay();
        appendCliOutput(currentVfsPath);
        return;
    }

    const resolved = resolveVfsPath(targetPath);
    const node = getVfsNode(resolved);

    if (!node) {
        appendCliOutput(`cd: no such file or directory: ${targetPath}`, 'error');
        return;
    }
    if (node.type !== 'dir') {
        appendCliOutput(`cd: not a directory: ${targetPath}`, 'error');
        return;
    }

    prevVfsPath = currentVfsPath;
    currentVfsPath = resolved;
    updatePromptDisplay();

    // Contextual scroll link
    if (resolved.includes('research')) {
        document.getElementById('research')?.scrollIntoView({ behavior: 'smooth' });
    } else if (resolved.includes('skills')) {
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
    } else if (resolved.includes('repositories')) {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    } else if (resolved === '~') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function executePwd() {
    const fullPath = currentVfsPath === '~' ? '/home/gaurav' : '/home/gaurav/' + currentVfsPath.replace('~/', '');
    appendCliOutput(fullPath);
}

function executeLs(args = []) {
    let showAll = false;
    let targetArg = '';

    args.forEach(arg => {
        if (arg.startsWith('-')) {
            if (arg.includes('a') || arg.includes('l')) showAll = true;
        } else {
            targetArg = arg;
        }
    });

    const targetPath = targetArg ? resolveVfsPath(targetArg) : currentVfsPath;
    const node = getVfsNode(targetPath);

    if (!node) {
        appendCliOutput(`ls: cannot access '${targetArg}': No such file or directory`, 'error');
        return;
    }
    if (node.type === 'file') {
        appendCliOutput(targetArg);
        return;
    }

    const entries = Object.keys(node.children || {});
    if (!showAll) {
        const visible = entries.filter(e => !e.startsWith('.'));
        const formatted = visible.map(e => {
            const isDir = node.children[e].type === 'dir';
            return isDir 
                ? `<span style="color: var(--terminal-green); font-weight: 600;">${e}/</span>` 
                : `<span style="color: var(--white-text);">${e}</span>`;
        }).join('   ');
        appendCliOutputHtml(formatted || '(empty directory)');
    } else {
        let lines = ['total ' + (entries.length * 4)];
        entries.forEach(e => {
            const child = node.children[e];
            const isDir = child.type === 'dir';
            const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
            const size = isDir ? '4096' : (child.content ? child.content.length.toString() : '1024');
            const styledName = isDir 
                ? `<span style="color: var(--terminal-green); font-weight: 600;">${e}/</span>` 
                : `<span style="color: var(--white-text);">${e}</span>`;
            lines.push(`${perms}  1 gaurav  staff  ${size.padStart(5, ' ')}  Mar 13 18:25  ${styledName}`);
        });
        appendCliOutputHtml(lines.join('\n'));
    }
}

function executeTree() {
    let lines = ['.'];
    function walk(node, prefix = '') {
        const keys = Object.keys(node.children || {}).filter(k => !k.startsWith('.'));
        keys.forEach((key, index) => {
            const isLast = index === keys.length - 1;
            const child = node.children[key];
            const marker = isLast ? '└── ' : '├── ';
            const isDir = child.type === 'dir';
            const displayName = isDir ? `${key}/` : key;
            lines.push(prefix + marker + displayName);
            if (isDir) {
                walk(child, prefix + (isLast ? '    ' : '│   '));
            }
        });
    }
    walk(virtualFileSystem["~"]);
    appendCliOutput(lines.join('\n'));
}

function executeCat(fileName) {
    if (!fileName) {
        appendCliOutput('Usage: cat <filename>', 'error');
        return;
    }

    if (fileName.toLowerCase() === 'resume.json') {
        const resumeFile = virtualFileSystem["~"].children["resume.json"];
        appendCliOutput(resumeFile.content);
        return;
    }
    if (fileName.toLowerCase() === 'research.txt' || fileName === 'paper.txt') {
        const paperFile = virtualFileSystem["~"].children["research"].children["paper.txt"];
        appendCliOutput(paperFile.content);
        document.getElementById('research')?.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    const resolved = resolveVfsPath(fileName);
    const node = getVfsNode(resolved);

    if (!node) {
        appendCliOutput(`cat: ${fileName}: No such file or directory`, 'error');
        return;
    }
    if (node.type === 'dir') {
        appendCliOutput(`cat: ${fileName}: Is a directory`, 'error');
        return;
    }
    appendCliOutput(node.content);
}

// ─── Tab Autocompletion Engine ───────────────────────────────────────────
const baseCommands = [
    'help', 'neofetch', 'fastfetch', 'whoami', 'skills', 'projects', 'repositories',
    'research', 'stats', 'curl', 'contact', 'send', 'theme', 'audio', 'sound',
    'matrix', 'cowsay', 'sudo', 'play', 'clear', 'exit', 'close', 'top', 'home',
    'pwd', 'cd', 'ls', 'tree', 'cat', 'nvtop', 'btop', 'gpu'
];

function handleTabCompletion(inputElem) {
    if (!inputElem) return;

    const val = inputElem.value;
    const tokens = val.trimStart().split(/\s+/);
    const isCommandToken = tokens.length <= 1 && !val.endsWith(' ');

    if (isCommandToken) {
        const prefix = (tokens[0] || '').toLowerCase();
        const matches = baseCommands.filter(cmd => cmd.startsWith(prefix));

        if (matches.length === 1) {
            inputElem.value = matches[0] + ' ';
            if (typeof playClickSound === 'function') playClickSound(800, 0.02);
        } else if (matches.length > 1) {
            const lcp = getLongestCommonPrefix(matches);
            if (lcp.length > prefix.length) {
                inputElem.value = lcp;
            }
            displayCompletionOptions(matches);
            if (typeof playClickSound === 'function') playClickSound(600, 0.02);
        }
    } else {
        const cmd = tokens[0].toLowerCase();
        const currentToken = val.endsWith(' ') ? '' : tokens[tokens.length - 1];

        if (cmd === 'cd' || cmd === 'ls' || cmd === 'cat') {
            const currNode = getVfsNode(currentVfsPath);
            if (currNode && currNode.type === 'dir') {
                let candidates = Object.keys(currNode.children || {});
                if (cmd === 'cd') {
                    candidates = candidates.filter(k => currNode.children[k].type === 'dir');
                }
                const matches = candidates.filter(c => c.toLowerCase().startsWith(currentToken.toLowerCase()));

                if (matches.length === 1) {
                    const matchedName = matches[0];
                    const isDir = currNode.children[matchedName].type === 'dir';
                    tokens[tokens.length - 1] = matchedName + (isDir ? '/' : ' ');
                    inputElem.value = tokens.join(' ');
                    if (typeof playClickSound === 'function') playClickSound(800, 0.02);
                } else if (matches.length > 1) {
                    const lcp = getLongestCommonPrefix(matches);
                    if (lcp.length > currentToken.length) {
                        tokens[tokens.length - 1] = lcp;
                        inputElem.value = tokens.join(' ');
                    }
                    displayCompletionOptions(matches.map(m => {
                        return currNode.children[m].type === 'dir' ? m + '/' : m;
                    }));
                    if (typeof playClickSound === 'function') playClickSound(600, 0.02);
                }
            }
        } else if (cmd === 'theme') {
            const themes = ['green', 'amber', 'cyan', 'matrix'];
            const matches = themes.filter(t => t.startsWith(currentToken.toLowerCase()));
            if (matches.length === 1) {
                tokens[tokens.length - 1] = matches[0];
                inputElem.value = tokens.join(' ');
            } else if (matches.length > 1) {
                displayCompletionOptions(matches);
            }
        } else if (cmd === 'play') {
            const games = ['snake'];
            const matches = games.filter(g => g.startsWith(currentToken.toLowerCase()));
            if (matches.length === 1) {
                tokens[tokens.length - 1] = matches[0];
                inputElem.value = tokens.join(' ');
            }
        } else if (cmd === 'sudo') {
            const sudoArgs = ['hire'];
            const matches = sudoArgs.filter(s => s.startsWith(currentToken.toLowerCase()));
            if (matches.length === 1) {
                tokens[tokens.length - 1] = matches[0];
                inputElem.value = tokens.join(' ');
            }
        }
    }
}

function getLongestCommonPrefix(arr) {
    if (!arr.length) return '';
    let prefix = arr[0];
    for (let i = 1; i < arr.length; i++) {
        while (!arr[i].toLowerCase().startsWith(prefix.toLowerCase())) {
            prefix = prefix.slice(0, -1);
            if (!prefix) return '';
        }
    }
    return prefix;
}

function displayCompletionOptions(options) {
    const body = document.getElementById('modalCliBody');
    if (!body) return;

    const grid = document.createElement('div');
    grid.className = 'cli-completion-grid';

    options.forEach(opt => {
        const item = document.createElement('span');
        item.className = 'cli-completion-item' + (opt.endsWith('/') ? ' is-dir' : (opt.includes('.') ? ' is-file' : ''));
        item.textContent = opt;
        grid.appendChild(item);
    });

    body.appendChild(grid);
    body.scrollTop = body.scrollHeight;
}

// ─── NVTOP / PyTorch GPU Monitor ─────────────────────────────────────────
let nvtopActive = false;
let nvtopInterval = null;

function launchNvtopMonitor() {
    if (nvtopActive) {
        appendCliOutput('[NVTOP] Monitor is already running. Press Q to exit.', 'error');
        return;
    }

    const body = document.getElementById('modalCliBody');
    if (!body) return;

    nvtopActive = true;
    let step = 4820;
    const totalSteps = 10000;
    let loss = 0.1428;
    let valLoss = 0.1691;
    let temp = 58;
    let power = 285;
    let vramUsed = 16.4;
    const totalVram = 24.0;
    let gpuUtil = 89;

    const container = document.createElement('div');
    container.className = 'nvtop-container';
    container.id = 'nvtopMonitorBox';
    body.appendChild(container);

    function buildAsciiBar(pct, len = 20) {
        const filled = Math.min(len, Math.max(0, Math.round((pct / 100) * len)));
        return '[' + '█'.repeat(filled) + '░'.repeat(len - filled) + ']';
    }

    function renderNvtop() {
        const epochPct = Math.min(100, Math.round((step / totalSteps) * 100));
        const vramPct = Math.round((vramUsed / totalVram) * 100);
        const vramBar = buildAsciiBar(vramPct, 18);
        const utilBar = buildAsciiBar(gpuUtil, 18);
        const epochBar = buildAsciiBar(epochPct, 22);

        container.innerHTML = `
<div class="nvtop-header-row">
    <span>⚡ NVTOP v2.8 — GPU &amp; PYTORCH TRAINING TELEMETRY</span>
    <span style="color: var(--amber-yellow);"><span class="pulse-dot"></span> LIVE POLLING [800ms]</span>
</div>

<div class="nvtop-stats-grid">
    <div class="nvtop-stat-card">
        <div class="nvtop-stat-label">Device &amp; Arch</div>
        <div class="nvtop-stat-val" style="color: var(--terminal-green);">NVIDIA RTX 4090 (Ada Lovelace)</div>
        <div style="font-size: 0.72rem; color: var(--secondary-text);">PCI-E 4.0 x16 | Driver 550.54 | CUDA 12.4</div>
    </div>

    <div class="nvtop-stat-card">
        <div class="nvtop-stat-label">Thermal &amp; Power</div>
        <div class="nvtop-stat-val">${temp}°C <span style="color: var(--secondary-text); font-weight: 400; font-size: 0.75rem;">(Fan: 62%)</span></div>
        <div style="font-size: 0.72rem; color: var(--amber-yellow);">${power}W / 450W TDP</div>
    </div>

    <div class="nvtop-stat-card">
        <div class="nvtop-stat-label">VRAM Allocation</div>
        <div class="nvtop-stat-val">${vramUsed.toFixed(1)} / ${totalVram.toFixed(1)} GB (${vramPct}%)</div>
        <div class="nvtop-bar-track">${vramBar}</div>
    </div>

    <div class="nvtop-stat-card">
        <div class="nvtop-stat-label">Compute Core Load</div>
        <div class="nvtop-stat-val">${gpuUtil}% Core Activity</div>
        <div class="nvtop-bar-track">${utilBar}</div>
    </div>
</div>

<div class="nvtop-training-box">
    <div style="color: var(--terminal-green); font-weight: 600; margin-bottom: 4px;">
        ● PID 4192: python -m torch.distributed.run train_transformer.py
    </div>
    <div style="color: var(--secondary-text); font-size: 0.76rem; margin-bottom: 6px;">
        Model: RoBERTa-Custom-NLP | Batch: 64 | FP16 Mixed Precision | Loss: CrossEntropy
    </div>
    <div style="margin-bottom: 4px;">
        Epoch [48/100]: <span style="color: var(--terminal-green);">${epochBar}</span> ${epochPct}% (Step ${step.toLocaleString()} / ${totalSteps.toLocaleString()})
    </div>
    <div class="nvtop-loss-ticker">
        Loss: ${loss.toFixed(4)} ↓ | Val Loss: ${valLoss.toFixed(4)} ↓ | PPL: 1.15 | LR: 3.2e-5
    </div>
</div>

<div class="nvtop-controls">
    <span>Press <strong style="color: var(--accent-orange);">Q</strong> or <strong style="color: var(--accent-orange);">ESC</strong> to exit monitor</span>
    <button class="nvtop-quit-btn" onclick="stopNvtopMonitor()">[✕ Close Monitor]</button>
</div>
        `;
        body.scrollTop = body.scrollHeight;
    }

    renderNvtop();

    nvtopInterval = setInterval(() => {
        if (!nvtopActive) return;
        step += 8;
        if (step > totalSteps) step = totalSteps;
        loss = Math.max(0.042, loss - (Math.random() * 0.0012 - 0.0003));
        valLoss = Math.max(0.051, valLoss - (Math.random() * 0.0009 - 0.0002));
        temp = Math.round(58 + Math.random() * 3);
        power = Math.round(280 + Math.random() * 25);
        gpuUtil = Math.round(87 + Math.random() * 7);
        vramUsed = Math.min(23.5, 16.2 + Math.random() * 0.4);
        renderNvtop();
    }, 800);

    function nvtopKeyHandler(e) {
        if (!nvtopActive) return;
        if (e.key.toLowerCase() === 'q' || e.key === 'Escape') {
            stopNvtopMonitor();
        }
    }

    document.addEventListener('keydown', nvtopKeyHandler);
    window._nvtopKeyHandler = nvtopKeyHandler;
}

function stopNvtopMonitor() {
    if (!nvtopActive) return;
    nvtopActive = false;
    if (nvtopInterval) {
        clearInterval(nvtopInterval);
        nvtopInterval = null;
    }
    if (window._nvtopKeyHandler) {
        document.removeEventListener('keydown', window._nvtopKeyHandler);
        window._nvtopKeyHandler = null;
    }
    appendCliOutput('[NVTOP] Monitor session stopped.');
    if (typeof playClickSound === 'function') playClickSound(450, 0.02);
}

window.stopNvtopMonitor = stopNvtopMonitor;

// ─── Terminal Window & Modal Management ──────────────────────────────────
function toggleTerminalModal() {
    const modal = document.getElementById('terminalModal');
    if (!modal) return;

    modal.classList.toggle('active');
    if (modal.classList.contains('active')) {
        updatePromptDisplay();
        const input = document.getElementById('modalCliInput');
        if (input) input.focus();
        showToast('CLI Terminal session opened. Type "help" for commands.');
    }
}

function showToast(msg) {
    let toast = document.getElementById('terminalToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'terminalToast';
        toast.className = 'terminal-toast';
        document.body.appendChild(toast);
    }

    toast.textContent = `> ${msg}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

// ─── Command Processor ───────────────────────────────────────────────────
function processCommand(rawCmd) {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    commandHistory.push(cmd);
    historyIndex = commandHistory.length;

    appendCliOutput(`gaurav@gyr0byte:${currentVfsPath}$ ${rawCmd}`, 'prompt');

    const normalizedCmd = cmd.toLowerCase().replace(/\s+/g, ' ').trim();
    if (typeof btoa === 'function' && btoa(normalizedCmd) === 'aSBsb3ZlIGlzaGFh') {
        const secretPayload = 'ICAgICAgIC9cXy9cICAKICAgICAgKCBvLm8gKSAgIPCfkpYgIkkgbG92ZSB5b3UgU2FudSEg4p2k77iPIgogICAgICAoID7wn4y5PCApICB+IGZyb20gR2F1cmF2IHdpdGggYSBmbG93ZXIgZm9yIHlvdSEKICAgICAgIC8gICBcICAKICAgICAgKCAiICIgKQoK4pSM4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSQCuKUgiAg4pyoIFNQRUNJQUwgU0VDUkVUIEVOQ1JZUFRFRCBUUkFOU01JU1NJT04gVU5MT0NLRUQg4pyoICDilIIK4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSYCgpEZWFyIElzaGFhLApZb3UgYXJlIG15IGZhdm9yaXRlIGFsZ29yaXRobSBpbiB0aGlzIGNoYW90aWMgd29ybGQuCk91dCBvZiA4IGJpbGxpb24gcHJvY2Vzc2VzIHJ1bm5pbmcgb24gRWFydGgsCnlvdSBhcmUgdGhlIG9ubHkgdGhyZWFkIHRoYXQgbWF0dGVycyB0byBtZS4KCk5vIG1hdHRlciBob3cgbWFueSBsaW5lcyBvZiBjb2RlIEkgd3JpdGUsIApteSBoZWFydCB3aWxsIGFsd2F5cyBjb21waWxlIGZvciB5b3UuIPCfjLkKCiJJIGxvdmUgeW91IFNhbnUhIOKdpO+4jyIgCiBGb3JldmVyICYgQWx3YXlzLCAKIH4gR2F1cmF2IChneXIwYnl0ZSkg8J+Slg==';
        const decodedMsg = new TextDecoder().decode(Uint8Array.from(atob(secretPayload), c => c.charCodeAt(0)));
        appendCliOutput(decodedMsg);
        if (typeof playClickSound === 'function') {
            playClickSound(1050, 0.05);
            setTimeout(() => playClickSound(1250, 0.05), 150);
        }
        return;
    }

    const args = cmd.split(' ');
    const mainCmd = args[0].toLowerCase();

    switch (mainCmd) {
        case 'help':
            appendCliOutput(
`Gyr0shell v2.6.0 Available Commands:
  pwd             Print working directory
  cd <dir>        Change directory (cd ~, cd .., cd research, cd -)
  ls [-la]        List directory contents & permissions
  tree            Display directory tree hierarchy
  cat <file>      Display file content (e.g. cat .bashrc, cat whoami.txt)
  nvtop / btop    Launch real-time GPU & PyTorch training monitor
  neofetch        Display system & developer architecture info
  whoami          Display profile information
  skills          List engineering skills & tools
  projects / repo List featured projects & repositories
  research        View research paper summary
  stats           View GitHub stats & contribution metrics
  contact         Open contact channel
  theme [name]    Switch color theme [green | amber | cyan | matrix]
  audio           Toggle mechanical keyboard sound FX
  matrix          Toggle Matrix digital rain canvas
  cowsay <msg>    Render ASCII cow with custom message
  sudo hire       Initiate recruitment sequence
  play snake      Launch ASCII Snake mini-game
  clear           Clear terminal output buffer
  exit / close    Close terminal modal window
  top / home      Scroll to top of page

[Tip: Press Tab to autocomplete commands, files & directories]`
            );
            break;

        case 'pwd':
            executePwd();
            break;

        case 'cd':
            executeCd(args[1]);
            break;

        case 'ls':
            executeLs(args.slice(1));
            break;

        case 'tree':
            executeTree();
            break;

        case 'cat':
            executeCat(args[1]);
            break;

        case 'nvtop':
        case 'btop':
        case 'gpu':
            launchNvtopMonitor();
            break;

        case 'neofetch':
        case 'fastfetch':
            const currentStreakDisplay = window.liveCurrentStreak ? `${window.liveCurrentStreak} days commit streak` : '198+ days commit streak';
            const publicRepoDisplay = window.livePublicRepos ? `${window.livePublicRepos} Public Repos` : '29+ Public Repos';
            if (window.innerWidth <= 600) {
                appendCliOutput(
`gaurav@gyr0byte
---------------
OS: Nepal-OS Linux x86_64 / WebKernel
Host: IIC / London Met University
Uptime: ${currentStreakDisplay}
Target: Univ of Tübingen MSc ML ('28)
Shell: Gyr0shell v2.6.0
Primary: Python 3.12, PyTorch, C++, SQL
ML Stack: Scikit-learn, XGBoost, AST, NLP`
                );
            } else {
                appendCliOutput(
`       /\\          gaurav@gyr0byte
      /  \\         ---------------
     / /\\ \\        OS: Nepal-OS Linux x86_64 (WebKernel v2.6)
    / /  \\ \\       Host: IIC / London Met University
   / /____\\ \\      Uptime: ${currentStreakDisplay}
  /_/        \\_\\   Target: University of Tübingen MSc ML (2028)
                   Shell: Gyr0shell v2.6.0
                   Primary: Python 3.12, PyTorch, Scikit-Learn
                   Focus: Applied NLP, Stacking Ensembles, AST
                   Repos: ${publicRepoDisplay} | 3,700+ Commit Contributions`
                );
            }
            break;

        case 'whoami':
            appendCliOutput(`Gaurav Dulal (gyr0byte) | Age 20 | Belbari-2, Morang, Nepal\nBHons Computing @ IIC / London Met | Targeting Tübingen MSc ML 2028\n"Not a person, a process — always building, never stopping."`);
            document.getElementById('whoami')?.scrollIntoView({ behavior: 'smooth' });
            break;

        case 'skills':
            appendCliOutput(`drwxr-xr-x Machine_Learning/ (numpy, pandas, sklearn, xgboost, cv, feature-eng)\ndrwxr-xr-x Deep_Learning_&_NLP/ [IN PROGRESS] (pytorch, tensorflow, lstm, tf-idf, transformers)\ndrwxr-xr-x Languages/ (python, java, javascript, c, c++, sql, html5, css3, bash)\ndrwxr-xr-x Math_&_Foundations/ (linear-algebra, stats, probability, oop-design, dsa)\ndrwxr-xr-x Tools_&_Deployment/ (git, streamlit, flask, jupyter, linux, plotly, render)`);
            document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
            break;

        case 'projects':
        case 'repositories':
        case 'repo':
        case 'git':
            appendCliOutput(`1. CodeRoast [PyTorch, LLM, AST Analysis]\n2. OOP Purity Analyzer [Flask, Plotly, Research]\n3. Text Emotion Classifier [NLP, Stacking Classifier, Streamlit]\n4. ML-Foundations [NumPy → Transformers]\n5. WhatsApp Chat Analyzer [Streamlit, NLP, Pandas]\n6. Titanic Kaggle [78% accuracy]`);
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            break;

        case 'research':
            appendCliOutput(`PAPER: A Quantitative Framework for Evaluating Object-Oriented Purity in Modern Programming Languages\nAUTHORS: Gaurav Dulal + 3 collaborators\nSTATUS: In Progress → Journal Submission (2026)`);
            document.getElementById('research')?.scrollIntoView({ behavior: 'smooth' });
            break;

        case 'stats':
        case 'curl':
            const repoCount = window.livePublicRepos ? `${window.livePublicRepos}+` : '29+';
            const streakDisplay = window.liveCurrentStreak ? `${window.liveCurrentStreak}` : '198+';
            appendCliOutput(`STREAK: ${streakDisplay} days active\nCOMMITS: 3784+ contributions\nREPOSITORIES: ${repoCount} public repositories`);
            document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' });
            break;

        case 'contact':
        case 'send':
            appendCliOutput(`Contact endpoint: gqurav69@gmail.com\nGitHub: github.com/gyr0byte\nLinkedIn: linkedin.com/in/gaurav-dulal`);
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            break;

        case 'matrix':
            toggleMatrix();
            appendCliOutput(`[SYSTEM] Matrix digital rain toggled.`);
            break;

        case 'theme':
            const themeName = args[1]?.toLowerCase();
            if (['green', 'amber', 'cyan', 'matrix'].includes(themeName)) {
                setTheme(themeName);
                appendCliOutput(`[SYSTEM] Theme switched to: ${themeName}`);
            } else {
                appendCliOutput(`Usage: theme [green | amber | cyan | matrix]`);
            }
            break;

        case 'audio':
        case 'sound':
            toggleAudio();
            appendCliOutput(`[SYSTEM] Audio toggled.`);
            break;

        case 'cowsay':
            const msg = args.slice(1).join(' ') || 'Always building, never stopping!';
            const border = '-'.repeat(msg.length + 2);
            appendCliOutput(
` ${border}
< ${msg} >
 ${border}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )/\\
                ||----w |
                ||     ||`
            );
            break;

        case 'sudo':
            if (args[1]?.toLowerCase() === 'hire') {
                appendCliOutput(
`[ACCESS GRANTED] Initiating recruitment sequence...
> Candidate: Gaurav Dulal (gyr0byte)
> Alignment: High performance ML / Software Engineering
> Email: gqurav69@gmail.com
> Redirecting to contact form...`
                );
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            } else {
                appendCliOutput(`sudo: ${args.slice(1).join(' ')}: command not found. Try 'sudo hire'.`);
            }
            break;

        case 'clear':
            const body = document.getElementById('modalCliBody');
            if (body) body.innerHTML = '';
            break;

        case 'exit':
        case 'close':
            toggleTerminalModal();
            break;

        case 'top':
        case 'home':
            window.scrollTo({ top: 0, behavior: 'smooth' });
            appendCliOutput(`Scrolled to top.`);
            break;

        case 'play':
            if (args[1]?.toLowerCase() === 'snake') {
                launchSnakeGame();
            } else {
                appendCliOutput(`play: unknown game '${args[1] || ''}'. Available: snake`, 'error');
            }
            break;

        default:
            appendCliOutput(`Command not found: '${rawCmd}'. Type 'help' for available commands.`, 'error');
            break;
    }
}

function appendCliOutput(text, type = 'normal') {
    const body = document.getElementById('modalCliBody');
    if (!body) return;

    const line = document.createElement('div');
    line.className = 'cli-output-line';

    if (type === 'prompt') {
        const promptPrefix = `gaurav@gyr0byte:${currentVfsPath}$`;
        const cmdPart = text.startsWith(promptPrefix) ? text.slice(promptPrefix.length).trim() : text;
        line.innerHTML = `<span class="cmd-prompt">${promptPrefix}</span> <span class="cmd-text">${escapeHtml(cmdPart)}</span>`;
    } else if (type === 'error') {
        line.style.color = 'var(--accent-orange)';
        line.textContent = text;
    } else {
        line.textContent = text;
    }

    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
}

function appendCliOutputHtml(htmlContent) {
    const body = document.getElementById('modalCliBody');
    if (!body) return;

    const line = document.createElement('div');
    line.className = 'cli-output-line';
    line.innerHTML = htmlContent;
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function setTheme(theme) {
    document.body.className = '';
    if (theme !== 'green') {
        document.body.classList.add(`theme-${theme}`);
    }
    showToast(`Theme updated to ${theme.toUpperCase()}`);
}

// ─── Input & Event Handlers ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updatePromptDisplay();

    const modalInput = document.getElementById('modalCliInput');
    if (modalInput) {
        modalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                handleTabCompletion(modalInput);
            } else if (e.key === 'Enter') {
                const value = modalInput.value;
                modalInput.value = '';
                processCommand(value);
            } else if (e.key === 'ArrowUp') {
                if (historyIndex > 0) {
                    historyIndex--;
                    modalInput.value = commandHistory[historyIndex] || '';
                }
            } else if (e.key === 'ArrowDown') {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    modalInput.value = commandHistory[historyIndex] || '';
                } else {
                    historyIndex = commandHistory.length;
                    modalInput.value = '';
                }
            }
        });
    }

    // Floating bar CLI input
    const floatingInput = document.getElementById('cliCommandInput');
    if (floatingInput) {
        floatingInput.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                handleTabCompletion(floatingInput);
            } else if (e.key === 'Enter') {
                const val = floatingInput.value;
                floatingInput.value = '';
                if (val.trim()) {
                    const modal = document.getElementById('terminalModal');
                    if (modal && !modal.classList.contains('active')) {
                        toggleTerminalModal();
                    }
                    processCommand(val);
                }
            }
        });
    }

    // Global keyboard shortcuts `Ctrl + ~` to open Terminal Modal and `Escape` to close
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === '`') {
            e.preventDefault();
            toggleTerminalModal();
        } else if (e.key === 'Escape') {
            if (nvtopActive) {
                stopNvtopMonitor();
            } else {
                const modal = document.getElementById('terminalModal');
                if (modal && modal.classList.contains('active')) {
                    toggleTerminalModal();
                }
            }
        }
    });
});

function runQuickCmd(cmd) {
    const modal = document.getElementById('terminalModal');
    if (modal && !modal.classList.contains('active')) {
        toggleTerminalModal();
    }
    processCommand(cmd);
}

window.toggleTerminalModal = toggleTerminalModal;
window.setTheme = setTheme;
window.showToast = showToast;
window.runQuickCmd = runQuickCmd;

// ─── ASCII Snake Mini-Game ──────────────────────────────────────────────
let snakeGameActive = false;
let snakeInterval = null;

function launchSnakeGame() {
    if (snakeGameActive) {
        appendCliOutput('[SNAKE] Game already running! Press Q to quit.', 'error');
        return;
    }

    const body = document.getElementById('modalCliBody');
    if (!body) return;

    snakeGameActive = true;
    const W = 20, H = 12;
    let snake = [{ x: 10, y: 6 }];
    let dir = { x: 1, y: 0 };
    let nextDir = { x: 1, y: 0 };
    let food = spawnFood();
    let score = 0;
    let gameOver = false;

    function spawnFood() {
        let fx, fy;
        do {
            fx = Math.floor(Math.random() * W);
            fy = Math.floor(Math.random() * H);
        } while (snake.some(s => s.x === fx && s.y === fy));
        return { x: fx, y: fy };
    }

    const gameDiv = document.createElement('div');
    gameDiv.id = 'snakeGameDisplay';
    gameDiv.style.cssText = 'font-family: var(--font-mono); font-size: 0.82rem; line-height: 1.15; white-space: pre; color: var(--terminal-green); margin-top: 0.5rem;';
    body.appendChild(gameDiv);

    function render() {
        let screen = '┌' + '──'.repeat(W) + '┐\n';
        for (let y = 0; y < H; y++) {
            let row = '│';
            for (let x = 0; x < W; x++) {
                if (snake[0].x === x && snake[0].y === y) {
                    row += '██';
                } else if (snake.some(s => s.x === x && s.y === y)) {
                    row += '░░';
                } else if (food.x === x && food.y === y) {
                    row += '◆◆';
                } else {
                    row += '  ';
                }
            }
            row += '│';
            screen += row + '\n';
        }
        screen += '└' + '──'.repeat(W) + '┘\n';
        screen += ` SCORE: ${score}  |  WASD/Arrows to move  |  Q to quit`;
        gameDiv.textContent = screen;
        body.scrollTop = body.scrollHeight;
    }

    function tick() {
        if (gameOver) return;
        dir = { ...nextDir };
        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

        if (head.x < 0 || head.x >= W || head.y < 0 || head.y >= H || snake.some(s => s.x === head.x && s.y === head.y)) {
            gameOver = true;
            clearInterval(snakeInterval);
            snakeInterval = null;
            snakeGameActive = false;
            document.removeEventListener('keydown', snakeKeyHandler);
            gameDiv.textContent += `\n\n  ██ GAME OVER ██  Final Score: ${score}\n  Type 'play snake' to play again.`;
            body.scrollTop = body.scrollHeight;
            if (typeof playClickSound === 'function') playClickSound(200, 0.05);
            return;
        }

        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score++;
            food = spawnFood();
            if (typeof playClickSound === 'function') playClickSound(900, 0.02);
        } else {
            snake.pop();
        }
        render();
    }

    function snakeKeyHandler(e) {
        if (!snakeGameActive) return;
        const key = e.key.toLowerCase();
        switch (key) {
            case 'w': case 'arrowup':
                if (dir.y !== 1) nextDir = { x: 0, y: -1 };
                e.preventDefault();
                break;
            case 's': case 'arrowdown':
                if (dir.y !== -1) nextDir = { x: 0, y: 1 };
                e.preventDefault();
                break;
            case 'a': case 'arrowleft':
                if (dir.x !== 1) nextDir = { x: -1, y: 0 };
                e.preventDefault();
                break;
            case 'd': case 'arrowright':
                if (dir.x !== -1) nextDir = { x: 1, y: 0 };
                e.preventDefault();
                break;
            case 'q': case 'escape':
                gameOver = true;
                clearInterval(snakeInterval);
                snakeInterval = null;
                snakeGameActive = false;
                document.removeEventListener('keydown', snakeKeyHandler);
                gameDiv.textContent += `\n\n  Game quit. Final Score: ${score}`;
                body.scrollTop = body.scrollHeight;
                break;
        }
    }

    document.addEventListener('keydown', snakeKeyHandler);
    appendCliOutput('[SNAKE] Game launched! Use WASD or Arrow keys. Press Q to quit.');
    render();
    snakeInterval = setInterval(tick, 180);
}
