# Gyr0byte Portfolio (Terminal / CLI Edition)

Welcome to the source code of my interactive, terminal-themed portfolio website. This project merges a classic retro CLI aesthetic with modern web capabilities, live API integrations, and robust object-oriented/functional JavaScript architecture.

## 🚀 Features

- **Gyr0shell v2.6.0 Terminal Emulator**: A fully interactive, custom-built CLI modal accessible via `Ctrl + ~` or the floating bottom-right prompt. It supports commands like `neofetch`, `cowsay`, `whoami`, `theme`, `audio`, and `sudo hire`.
- **Live GitHub Integration**: Dynamically fetches and displays real-time GitHub statistics, commit streaks, and a live contribution heatmap matrix.
- **LeetCode Sync**: Pulls real-time problem-solving statistics utilizing a community-maintained API.
- **Backend-less Contact System**: Contact form powered by Web3Forms for direct inbox delivery without needing a server-side backend or exposing email addresses.
- **Dynamic Themes**: Multiple color themes including `green` (default), `amber`, `cyan`, and `matrix` mode.
- **Audio Feedback**: Optional mechanical keyboard typing sounds to enhance the retro terminal experience.
- **Responsive Design**: fully optimized for desktop and mobile viewports with smooth scroll-triggered section reveal animations.

## 🛠️ Technologies Used

- **Core**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **APIs**: GitHub REST API, LeetCode API, Web3Forms
- **Design System**: Custom responsive flex/grid layouts with CSS variables for dynamic theme switching.
- **Animations**: Custom Canvas API logic for Matrix digital rain and background particle networks; IntersectionObserver for scroll reveals.

## 📂 Project Structure

```
├── assets/             # Media and static assets (favicon, Open Graph images)
├── css/                # Modular stylesheets
│   ├── cli.css         # Terminal emulator & mobile navigation styles
│   ├── main.css        # Global CSS variables and core resets
│   ├── sections.css    # Layout and styling for specific page sections
│   └── terminal.css    # General terminal window components
├── js/                 # Modular JavaScript logic
│   ├── animations.js   # Scroll-reveal logic (IntersectionObserver)
│   ├── audio.js        # Mechanical typing sound effects
│   ├── boot.js         # Boot sequence text generation in hero section
│   ├── cli.js          # Main Terminal Emulator engine logic
│   ├── main.js         # Core application setup & form handling
│   ├── matrix.js       # Canvas-based digital rain effect
│   ├── particles.js    # Canvas-based hero particle network
│   ├── projects.js     # Project data injection
│   ├── skills.js       # Expandable tree-view logic for skills
│   ├── stats.js        # GitHub / LeetCode API integrations & heatmap
│   └── typewriter.js   # Reusable typing animation utilities
├── resume/             # PDF version of CV
├── index.html          # Main HTML entry point
└── README.md           # Project documentation
```

## ⚙️ Local Setup

This project uses entirely static files and vanilla technologies, meaning no build step (Webpack/Vite) is required.

1. **Clone the repository**
   ```bash
   git clone https://github.com/gyr0byte/Protfolio.git
   cd Protfolio
   ```

2. **Run a local development server**
   You can use any local web server. For example, using Python:
   ```bash
   python -m http.server 8000
   ```
   Or using Node.js:
   ```bash
   npx serve
   ```

3. **Open in browser**
   Navigate to `http://localhost:8000`

## 🔑 Configuration

To enable the contact form, you need to replace the `YOUR_WEB3FORMS_ACCESS_KEY` in `index.html` with your actual access key from [Web3Forms](https://web3forms.com).

```html
<input type="hidden" name="access_key" value="YOUR_ACTUAL_ACCESS_KEY_HERE">
```

## 👨‍💻 About Me

I am Gaurav Dulal (gyr0byte), a Machine Learning Engineer and Researcher from Nepal, currently an undergraduate computing student at London Metropolitan University (IIC), targeting a Master's in ML at the University of Tübingen by 2028.

*"Not a person, a process — always building, never stopping."*
