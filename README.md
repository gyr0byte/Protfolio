# Gyr0byte Portfolio (Terminal / CLI Edition)

Welcome to the official repository of my interactive, terminal-themed portfolio website. This project combines a retro CLI aesthetic with modern web capabilities, real-time API integrations, lightweight canvas animations, and a responsive mobile-first design.

---

## 🚀 Features

- **Gyr0shell v2.6.0 Terminal Emulator**: Fully interactive modal CLI accessible via `Ctrl + ~`, floating input prompt, or terminal window controls. Supports commands like `neofetch`, `cowsay`, `whoami`, `theme`, `audio`, `clear`, and `sudo hire`.
- **Live GitHub Integration**: Automatically fetches live commit streaks, total contributions, active repositories, and renders a 364-cell contribution matrix feed for `@gyr0byte`.
- **LeetCode Stats Sync**: Pulls real-time problem-solving progress using a serverless API fetch.
- **Hero Canvas Particle Network**: Interactive, lightweight canvas-rendered floating particle nodes with dynamic connection lines.
- **Scroll Reveal Animations**: Smooth section reveals driven by `IntersectionObserver` with adaptive thresholds for mobile and desktop screens.
- **Terminal Section Dividers**: Styled CLI separators (`cd ~/whoami`, `cd ~/skills`, etc.) marking major section transitions.
- **Mobile-First & Touch Reactive**: Complete responsiveness across all device sizes (down to 320px screens) with `@media (hover: hover)` protection against sticky mobile touch states, auto-wrapping code lines, and touch-optimized navigation drawers.
- **Resume Integration**: Direct PDF download link (`assets/Gaurav_Dulal_Resume.pdf`) embedded in navigation controls.
- **Backend-less Contact System**: Web3Forms integration delivering direct user messages without exposing server endpoints or email addresses.
- **Custom Themes & Audio**: Supports color themes (`green`, `amber`, `cyan`, `matrix`) and mechanical keyboard audio feedback.
- **SEO & Social Meta**: Equipped with Open Graph, Twitter Cards, and a custom SVG terminal favicon.

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, Modern CSS3 (Variables, Flexbox, Grid), JavaScript (ES6+)
- **APIs**: GitHub REST API, LeetCode Public API, Web3Forms
- **Graphics**: HTML5 Canvas API (Particle system & Matrix digital rain)
- **Design System**: Monospaced terminal UI with dark mode color schemes and neon accent glows

---

## 📂 Repository Structure

```
├── assets/
│   ├── favicon.svg             # Terminal prompt SVG favicon (>_)
│   └── og-preview.png          # Social sharing preview banner
├── css/
│   ├── main.css                # Master stylesheet loader
│   ├── variables.css           # CSS custom properties & color design tokens
│   ├── reset.css               # Box-sizing resets, scrollbars, overflow guards
│   ├── terminal.css           # Terminal window frames, navigation header, and dots
│   ├── sections.css            # Section layouts, mobile media queries, section dividers
│   └── cli.css                 # Terminal emulator modal, mobile drawer, toast notices
├── js/
│   ├── animations.js          # IntersectionObserver scroll reveal engine
│   ├── audio.js               # Web Audio API / mechanical keyboard sound generator
│   ├── boot.js                # Hero boot sequence text animator
│   ├── cli.js                 # Terminal command processor & modal logic
│   ├── main.js                # Core app initialization & form submission handler
│   ├── matrix.js              # Canvas digital rain animation
│   ├── particles.js           # Hero canvas particle network system
│   ├── projects.js            # Commit card project renderer
│   ├── skills.js              # Expandable interactive directory tree
│   ├── stats.js               # GitHub / LeetCode API sync & heatmap renderer
│   └── typewriter.js          # Asynchronous typing effect utility
├── resume/
│   └── Gaurav_Dulal_Resume.pdf# Downloadable resume document
├── index.html                 # Main document markup
└── README.md                  # Project documentation
```

---

## ⚙️ Running Locally

Because this project is built entirely with vanilla technologies, no build step or package manager is required.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gyr0byte/Protfolio.git
   cd Protfolio
   ```

2. **Launch a local server:**
   - Using Python 3:
     ```bash
     python -m http.server 8000
     ```
   - Using Node.js / `npx`:
     ```bash
     npx serve .
     ```

3. **Open in your browser:**
   ```
   http://localhost:8000
   ```

---

## 🔑 Contact Form Setup

To receive messages from the contact form directly in your inbox:
1. Obtain an access key from [Web3Forms](https://web3forms.com).
2. Update the `access_key` hidden field in `index.html`:
   ```html
   <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
   ```

---

## 👨‍💻 Author

**Gaurav Dulal (gyr0byte)**  
*Undergraduate Computing Student @ London Metropolitan University (IIC)*  
*Targeting MSc in Machine Learning @ University of Tübingen (2028)*  

- **GitHub**: [@gyr0byte](https://github.com/gyr0byte)  
- **Email**: gqurav69@gmail.com  

*"Not a person, a process — always building, never stopping."*
