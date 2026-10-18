# Portfolio Context & Memory Handover
**Repository:** D:\\Python\\Protfolio  
**Live Site:** https://www.sirjan-dulal.com.np/  
**User:** Gaurav Dulal (gyr0byte)  
**Target:** University of Tübingen, Germany — MSc Machine Learning (2028 Cohort)  
**Stack:** Vanilla HTML/CSS/JS (Terminal/Cyberpunk aesthetic), Cloudflare Workers (Wrangler)  

---

## 1. Selected Repositories (Ranked Order)
1. **CodeRoast** (★ FLAGSHIP): AST + PyTorch LSTM + Savage LLM Roasts
2. **OOP Purity Analyzer** (★ RESEARCH): 24-criterion quantitative evaluation framework powered by AST visitors
3. **Text Emotion Classifier**: Stacking Ensemble NLP pipeline (TF-IDF + Classifiers + Streamlit)
4. **ML-Foundations**: First-principles machine learning (45+ stars)
5. **Generative-AI**: LangChain, RAG pipelines, and Tool-using AI Agents
6. **Kundali-SYP**: Full-stack Vedic astrology platform (FastAPI, Swiss Ephemeris, Next.js)

---

## 2. Completed Improvements (Oct 18, 2026)
- **Issue 1 (Dynamic Age):** Replaced hardcoded age with dynamic calculateAge() (born ~2006, age 20 in 2026, auto-increments). Wired to #dynamicAge, whoami.txt, 
esume.json, and CLI whoami.
- **Issue 2 (GitHub Streak):** Replaced static streak with dynamic live sync and localStorage caching (233+ active streak baseline).
- **Issue 4 (Dynamic Copyright):** Replaced hardcoded year with dynamic © 2025– in both index.html and bout.html.
- **Issue 5 (Project Hierarchy):** Added .commit-card.featured styling (neon glow, gradient accent) and ★ FLAGSHIP / ★ RESEARCH badges.
- **Issue 11 (Performance & Lazy Loading):** Preconnected to GitHub & contributions APIs; lazy-loaded 370-day contribution heatmap with IntersectionObserver; staggered reveal animations for project cards.
- **Issue 14 (Light/Dark Theme):** Added 	oggleThemeMode() to nav buttons and CLI (	heme light/	heme green/	heme dark). Supported zero-flash init script and comprehensive light theme variables.

---

## 3. Pending Improvement Backlog (from Site Audit)
- **Issue 3:** Research Paper status badge update.
- **Issue 6:** Project preview thumbnails/screenshots for top cards.
- **Issue 7:** Skills neural network graph view polish/cues.
- **Issue 8:** Contact form subject chip hover & selection animations.
- **Issue 9:** Floating scroll-to-top button for long page (~8000px).
- **Issue 15:** Blog / technical notes section for SEO & AI indexing.

---

## 4. Key Files Reference
- index.html: Main landing page (Terminal UI, boot sequence, git log cards, contact form)
- bout.html: Clean text-based about page for crawlers & recruiters
- css/variables.css: Color tokens, dark/matrix/light mode definitions
- css/sections.css: Section layout, cards, badges, and responsive rules
- css/terminal.css: Navigation bar, terminal window styling, and dots
- js/main.js: Core app controller, theme toggling, age & copyright init
- js/boot.js: Terminal boot sequence with live streak
- js/stats.js: GitHub/LeetCode APIs, streak calculation, lazy heatmap
- js/cli.js: Full in-browser Gyr0shell v2.6.0 CLI terminal emulator
- js/animations.js: IntersectionObservers for scroll reveals
