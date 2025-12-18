# 🏎️ Torque.JS: Engine Sound Emulator

[![License: Custom](https://img.shields.io/badge/License-Semi--Open%20Attribution-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/gamedev44/Torque?style=flat&logo=github)](https://github.com/gamedev44/Torque)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/gamedev44/Torque/pulls)

**Torque.JS** is a high-fidelity engine simulation suite that bridges the gap between raw audio synthesis and physical dynamics. By simulating the mechanical intricacies of internal combustion, Torque.JS provides a real-time environment to experience engine performance through code.

> 🔴 Live Demo: https://gamedev44.github.io/Torque/index.html

---

## 📍 Jump To
* [**📖 Overview**](#-overview) — What is Torque.JS?
* [**🛠️ Tech Stacks**](#️-tech-stacks) — Architecture and languages used.
* [**📂 Project Structure**](#-project-structure) — File and directory mapping.
* [**🏁 V2 Classic**](#-v2---classic-edition) — The lightweight, zero-dependency version.
* [**🏎️ V3 Next-Gen**](#-v3---next-gen-edition) — The advanced TypeScript simulation.
* [**🚀 Quick Start**](#-quick-start) — Installation and deployment.
* [**⚙️ Features Comparison**](#-key-features) — Breakdown of versions.
* [**⚖️ License**](#-license) — Usage terms and attribution.

---

## 📖 Overview
Torque.JS is a comprehensive engine sound emulator that simulates realistic engine physics, audio synthesis, and visual feedback. The project includes two distinct versions, each optimized for different use cases, ranging from simple static integrations to complex, configuration-driven simulations.

---

## 🛠️ Tech Stacks

### V2 - Classic Edition
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### V3 - Next-Gen Edition
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Web Audio API](https://img.shields.io/badge/Web%20Audio%20API-black?style=for-the-badge&logo=googlechrome&logoColor=white)

---

## 📂 Project Structure

```text
Torque/
├── README.md               # Main Documentation (this file)
├── LICENSE                 # Semi-Open License
├── V2/                     # Classic Version
│   ├── README.md           # V2 Specifics
│   ├── Torque.html         # Self-contained Entry Point
│   └── ...
└── V3/                     # Next-Gen Version
    └── torque-v3/
        ├── README.md       # V3 Specifics
        ├── index.html      # Vite Entry
        ├── package.json    # Dependencies
        ├── src/            # Core TypeScript Source
        │   ├── physics/    # Torque & RPM Logic
        │   ├── audio/      # Web Audio Synthesis
        │   └── ui/         # Gauges & Modals
        └── public/         # Engine Videos & INI Configs
            ├── engines/    # Engine Template Data
            └── videos/     # RPM-Synced Visuals

```

---

## 🏁 V2 - Classic Edition

The "Zero-Dependency" approach. Built as a self-contained ecosystem, V2 focuses on portability and instant deployment.

* **Engines:** V6, V8, V10, V12 configurations.
* **Technology:** Pure HTML, CSS, and JavaScript.
* **Visual Logic:** GIF-based engine synchronization.
* **Best For:** Quick deployment, static hosting, and simple integration.

[📖 View V2 Documentation →](V2/README.md) • **[🔝 Back to top](#-overview)**

---

## 🏎️ V3 - Next-Gen Edition

The flagship simulation. Rebuilt in **TypeScript**, V3 utilizes a modular architecture to simulate granular engine components.

* **Engines:** V2, V4, V6, V8, V10, V12, V16 + Templates (Ferrari F136, Ford Duratec).
* **Dynamic Visuals:** Video-based visualizer with **RPM-linked playback speed**.
* **Physics Engine:** Real-time calculation of torque curves, redline inertia, and gear ratios.
* **Configuration:** Data-driven via **INI files** for deep mechanical tuning.
* **UX:** Search functionality with real-time suggestions and customizable gauge displays.

[📖 View V3 Documentation →](V3/torque-v3/README.md) • **[🔝 Back to top](#-overview)**

---

## 🚀 Quick Start

### Running V2

No build process required - works offline! Simply open the file:

Open `V2/Torque.html` directly in your browser.
On Windows you can run:

```powershell
start "" .\V2\Torque.html
```

### Running V3 (Development)

```bash
# Navigate to version
cd V3/torque-v3

# Install dependencies
npm install

# Start development server
npm run dev

```

<!-- Initial upload of Torque project files to GitHub. -->

### Running V3 (Production Build)

For static deployment (works offline without Vite):

```bash
cd V3/torque-v3
npm run build

```

The `dist/` folder contains all files needed for static hosting.

---

## ⚙️ Key Features

| Feature | V2 Classic | V3 Next-Gen |
| --- | --- | --- |
| **Physics** | Basic RPM | Advanced Inertia/Torque |
| **Visuals** | GIF Sprites | Frame-synced Video |
| **Audio** | Loop-based | Procedural Synthesis |
| **Configuration** | Hardcoded | `.ini` / `.json` Files |
| **Search** | No | Search + Suggestions |
| **Gauges** | Static UI | Customizable SVG/Canvas |
| **Deployment** | Single File | Vite Build System |

---

## 🙏 Credits

- **Developer**: Asterisk
- **Organization**: Iron Will Interactive 2025.
- **V2 Engine GIF/PNG**: Placeholder from Engine Sim project [Only Exists Inside V2 as V3 is totally Brand New From The Ground Up.] (see `assets/info.txt`)
- **Version 3 New Engine Animations: **: all new engine animations for V3 are from the creator on youtube known as [TheRenalicious](https://www.youtube.com/@TheRenalicious).

### Acknowledgments

- Inspired by Engine Sim, but designed to be simpler and more accessible
- Built for indie developers who need practical, easy-to-use tools

---

## 🐛 Known Issues

- Audio context requires user interaction in some browsers (Safari, mobile)

---

## 📢 Feedback 
for any other Issues, Feedback and Or Suggestions Amongst Other Things Please Visit here: [Feedback & Suggestions](https://github.com/gamedev44/Torque/labels).

---

## 📞 Support

For issues, questions, or contributions:

1. **Join our Discord**: [SpeedVerse Discord](https://discord.gg/NfEhsrJD7x) - Reach out to us anytime!
2. Check existing issues on GitHub
3. Create a new issue with detailed information
4. Include browser version and console errors if applicable

---

## ⚖️ License

Torque.JS uses a **Semi-Open Source with Attribution** license.

* ✅ **Allowed:** Free use in commercial/non-commercial projects and games.
* ⚠️ **Condition:** You **must** include clear attribution in credits/documentation.
* ❌ **Prohibited:** Unauthorized forking for re-distribution or removal of credits.

Refer to the full [LICENSE](LICENSE) for legal terminology.

---

**Developed with ❤️ by [gamedev44](https://github.com/gamedev44)
