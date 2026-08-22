// Full Interactive CLI Command Line Terminal Emulator Engine

let commandHistory = [];
let historyIndex = -1;

function toggleTerminalModal() {
    const modal = document.getElementById('terminalModal');
    if (!modal) return;

    modal.classList.toggle('active');
    if (modal.classList.contains('active')) {
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

function processCommand(rawCmd) {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    commandHistory.push(cmd);
    historyIndex = commandHistory.length;

    appendCliOutput(`gaurav@gyr0byte:~$ ${rawCmd}`, 'prompt');

    const args = cmd.split(' ');
    const mainCmd = args[0].toLowerCase();

    switch (mainCmd) {
        case 'help':
            appendCliOutput(
`Available Commands:
  neofetch        Display system & developer architecture info
  whoami          Display profile information
  skills          List engineering skills & tools
  projects        List featured projects & commits
  research        View research paper summary
  stats           View GitHub stats & contribution metrics
  contact         Open contact channel
  cat resume.json Print structured resume as JSON
  play snake      Launch ASCII Snake mini-game
  matrix          Toggle Matrix digital rain canvas
  theme           Switch color theme [green | amber | cyan | matrix]
  audio           Toggle mechanical keyboard sound FX
  cowsay <msg>    Render ASCII cow with custom message
  sudo hire       Initiate recruitment sequence
  clear           Clear terminal output buffer
  exit / close    Close terminal modal window
  top / home      Scroll to top of page`
            );
            break;

        case 'neofetch':
        case 'fastfetch':
            const currentStreakDisplay = window.liveCurrentStreak ? `${window.liveCurrentStreak} days commit streak` : '175+ days commit streak';
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
                   Repos: 28+ Public | 1,900+ Commit Contributions`
                );
            }
            break;

        case 'whoami':
            appendCliOutput(`Gaurav Dulal (gyr0byte) | Age 20 | Belbari-2, Morang, Nepal\nBHons Computing @ IIC / London Met | Targeting Tübingen MSc ML 2028\n"Not a person, a process — always building, never stopping."`);
            document.getElementById('whoami')?.scrollIntoView({ behavior: 'smooth' });
            break;

        case 'skills':
        case 'ls':
            appendCliOutput(`drwxr-xr-x Machine_Learning/ (numpy, pandas, sklearn, xgboost, cv, feature-eng)\ndrwxr-xr-x Deep_Learning_&_NLP/ [IN PROGRESS] (pytorch, tensorflow, lstm, tf-idf, transformers)\ndrwxr-xr-x Languages/ (python, java, javascript, c, c++, sql, html5, css3, bash)\ndrwxr-xr-x Math_&_Foundations/ (linear-algebra, stats, probability, oop-design, dsa)\ndrwxr-xr-x Tools_&_Deployment/ (git, streamlit, flask, jupyter, linux, plotly, render)`);
            document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
            break;

        case 'projects':
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
            appendCliOutput(`STREAK: 158 days active\nCOMMITS: 1900+ contributions\nPROJECTS: 5+ deployed repositories`);
            document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' });
            break;

        case 'latest':
        case 'activity':
            const latest = window.latestCommitData || {
                msg: "Add interactive neural skill network graph to skills section",
                repo: "Protfolio",
                timeAgo: "3 hours ago"
            };
            appendCliOutput(`[LIVE ACTIVITY FEED]\nLATEST COMMIT : "${latest.msg}"\nREPOSITORY    : ${latest.repo}\nTIME AGO      : ${latest.timeAgo}`);
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

        case 'cat':
            if (args[1]?.toLowerCase() === 'resume.json') {
                appendCliOutput(
`{
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
  "deploy": ["Render", "Streamlit Cloud", "GitHub Pages"],
  "projects": 6,
  "repos": "28+",
  "contributions": "1900+",
  "streak": "${window.liveCurrentStreak || '175+'}+ days",
  "research": "OOP Purity Quantitative Framework (Journal Submission 2026)",
  "email": "gqurav69@gmail.com",
  "github": "github.com/gyr0byte",
  "linkedin": "linkedin.com/in/gaurav-dulal",
  "motto": "Not a person, a process — always building, never stopping."
}`
                );
            } else if (args[1] === 'research.txt') {
                appendCliOutput(`PAPER: A Quantitative Framework for Evaluating Object-Oriented Purity in Modern Programming Languages\nAUTHORS: Gaurav Dulal + 3 collaborators\nSTATUS: In Progress → Journal Submission (2026)`);
                document.getElementById('research')?.scrollIntoView({ behavior: 'smooth' });
            } else {
                appendCliOutput(`cat: ${args[1] || ''}: No such file. Try 'cat resume.json' or 'cat research.txt'.`, 'error');
            }
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
        line.innerHTML = `<span class="cmd-prompt">gaurav@gyr0byte:~$</span> <span class="cmd-text">${escapeHtml(text.replace('gaurav@gyr0byte:~$ ', ''))}</span>`;
    } else if (type === 'error') {
        line.style.color = 'var(--accent-orange)';
        line.textContent = text;
    } else {
        line.textContent = text;
    }

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

// Keydown listener for modal CLI input
document.addEventListener('DOMContentLoaded', () => {
    const modalInput = document.getElementById('modalCliInput');
    if (modalInput) {
        modalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
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
            if (e.key === 'Enter') {
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

    // Global keyboard shortcut `Ctrl + ~` to open Terminal Modal and `Escape` to close
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === '`') {
            e.preventDefault();
            toggleTerminalModal();
        } else if (e.key === 'Escape') {
            const modal = document.getElementById('terminalModal');
            if (modal && modal.classList.contains('active')) {
                toggleTerminalModal();
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

    // Create game display element
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

        // Wall collision or self collision
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
