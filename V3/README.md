# Torque.JS : Engine Sound Emulator

<div align="center">

![Torque.JS](https://img.shields.io/badge/Torque.JS-Engine%20Sound%20Emulator-66fcf1?style=for-the-badge)
![Pure Vanilla JavaScript](https://img.shields.io/badge/Pure-JavaScript-yellow?style=for-the-badge)
![Lightweight](https://img.shields.io/badge/Lightweight-Fast-green?style=for-the-badge)
![Easy to Use](https://img.shields.io/badge/Easy%20to%20Use-Usability%20First-blue?style=for-the-badge)

**A pure JavaScript engine sound simulator built with usability in mind. Lightweight, intuitive, and powerful.**

### 🚀 **[Try the Latest Release Live Web Demo](https://gamedev44.github.io/Torque/index.html)**

### 🌐 **[Check Out the Dedicated Website](https://gamedev44.github.io/Torque/homepage.html)**

[Features](#-features) • [Quick Start](#-quick-start) • [Controls](#-controls) • [Configuration](#-configuration) • [Preset Documentation](PRESETS.md) • [Roadmap](TODO.md) • [Customization](#-customization) • [Technical Details](#-technical-details) • [Support](#-support)

### 🎥 Showcase Video

<div align="center">

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/62KrYP5BTLM?si=4LG7CTGUFTf3RMtt&amp;controls=0&amp;start=3" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

</div>

</div>

---

## 🎯 Overview

**Torque.JS** is a pure tone-based JavaScript engine sound emulator designed to be **simple, lightweight, and easy to use**. Unlike complex engine simulation tools, Torque.JS prioritizes **usability first, functionality second** - making it perfect for indie developers, game creators, and anyone who needs realistic engine sounds without the complexity.

Built entirely in JavaScript using **Tone.js** for audio synthesis, Torque.JS generates authentic engine sounds in real-time through advanced oscillator techniques, dynamic filtering, and physics-based audio processing.

### Why Torque.JS?

- ✅ **Zero Dependencies** - Pure HTML/CSS/JavaScript (uses CDN libraries)
- ✅ **Lightweight** - Single HTML file, runs in any modern browser
- ✅ **Easy to Use** - Intuitive dashboard interface, no complex setup
- ✅ **Real-time Synthesis** - Pure tone generation, no audio samples required
- ✅ **Highly Customizable** - Extensive tuning parameters with preset support
- ✅ **Production Ready** - Built as a usable in production product, not just a prototype

---

## ✨ Features

### 🎵 Audio Engine

- **Pure Tone Synthesis** - Real-time engine sound generation using multiple oscillators
- **Multiple Engine Types** - Support for V6, V8, V10, and V12 configurations
- **Engine-Specific Harmonics** - Each engine type uses authentic harmonic interval relationships:
  - **V8**: Perfect 8th (octave) - 2.0 ratio
  - **V6**: Perfect 12th (octave + fifth) - 1.5 ratio
  - **V10**: Major 10th - 1.778 ratio
  - **V12**: Perfect 12th (octave + fifth) - 1.5 ratio
- **Dynamic Filtering** - High-pass and low-pass filters that respond to RPM and load
- **Distortion Effects** - Configurable distortion for aggressive engine character
- **Sub Oscillator** - Deep rumble layer for authentic low-end presence
- **Intake Noise** - Realistic air intake simulation with brown noise
- **Backfire System** - Configurable backfire effects with multiple pop variations
- **Rev Limiter** - Realistic rev limiter with oscillation effects
- **Governor System** - Optional RPM protection to prevent redline damage
- **Advanced Slip System** - Realistic speed and RPM slip mechanics:
  - **Speed Needle Slip** - Speedometer oscillates at redline or speed thresholds
  - **RPM Slip Oscillation** - Realistic rev limiter slip with multiple cycles
  - **Exhaust Choke-Back** - Engine cooling during slip phases (exhaust choking effect)
  - **Automatic Recovery** - Smooth recovery after slip cycles complete
- **Heat & Temperature System** - Advanced engine thermal management:
  - **Real-time Temperature Gauge** - Linear thermometer display in Fahrenheit (150-250°F)
  - **Heat Buildup** - Engine heats up when throttle is held (heavy footing causes overheating)
  - **Cooling System** - Engine cools down at low RPM or when throttle released
  - **Overheating Protection** - Automatic slip and cooling when engine overheats
  - **Engine Failure Mode** - Optional catastrophic failure system (can melt engine if unchecked)

### 📊 Visual Dashboard

- **Real-time Gauges**:
  - **Speedometer** - Configurable max speed (km/h or mph) with slip oscillation
  - **RPM Gauge** - Customizable RPM range with redline indicator and slip effects
  - **Load Gauge** - Manifold pressure/engine load percentage
  - **Temperature Gauge** - Linear thermometer showing engine temp in Fahrenheit
  - **Direction Indicator** - Visual arrow showing throttle/brake/steering input
- **Physics Visualizer** - Matter.js-powered piston animation synchronized with RPM
- **Audio Waveform** - Real-time waveform visualization
- **Engine GIF Display** - Visual engine animation (customizable per engine type)
- **Dark Theme UI** - Professional dashboard aesthetic with cyan accents

### 🎮 Controls

- **Keyboard Input**:
  - `↑` Arrow Key - Throttle (increase RPM)
  - `↓` Arrow Key - Brake (decrease RPM)
- **Mouse Controls**:
  - Quick test slider for direct RPM control
  - All tuning parameters accessible via sliders
- **Ignition Button** - Start/stop engine with one click

### ⚙️ Advanced Tuning

- **Base Pitch** - Fundamental frequency control (15-80 Hz)
- **Pitch Range** - RPM-to-pitch multiplier (1.5x - 6x)
- **Distortion Strength** - Core distortion amount (0-1)
- **Distortion Amount** - Overall distortion level
- **High Pass Filter** - Low-end cutoff (100-800 Hz)
- **Low Pass Filter** - High-end cutoff (200-2000 Hz)
- **Sub Oscillator Volume** - Low-end rumble level (-20 to 0 dB)
- **Noise Amount** - Intake noise intensity (0-1)
- **Resonance** - Filter resonance/Q factor (0.5-5)
- **Acceleration Sensitivity** - RPM response speed (0.01-0.15)
- **Backfire Chance** - Probability of backfire events (0-1)
- **Rev Limiter** - Maximum RPM threshold (4000-9000)
- **Governor Toggle** - Enable/disable RPM protection

### 💾 Preset System

- **INI-Based Presets** - Easy-to-edit configuration files
- **Multiple Engine Presets** - Pre-configured settings for V6, V8, V10, V12
- **Customizable** - Create your own presets by editing INI files
- **Auto-Loading** - Presets automatically load on engine type selection

### 🎤 Audio Export

- **Direct Recording** - Record engine sounds directly from the audio stream
- **WAV Export** - High-quality WAV file output
- **Real-time Capture** - Record at any RPM state
- **One-Click Export** - Simple record/stop workflow

### 🔧 Configuration

- **Speed Units** - Toggle between km/h and mph
- **Gauge Ranges** - Customize speed and RPM gauge limits
- **RPM Range** - Configure minimum and maximum RPM values
- **Max Speed** - Set speedometer maximum values independently

---


## 🚀 Quick Start

### Installation

## 🧩 Getting the Source

### 1. Clone & Sync the Repository
```bash
git clone --recursive https://github.com/gamedev44/Torque.git
```
```bash
cd Torque
git lfs install
git lfs fetch --all
git lfs pull
```

2. **Open in Browser**

* Simply open `Torque.html` in any modern web browser
* No build process, no dependencies to install
* Works offline once loaded

### Basic Usage

1. **Start the Engine**

* Click the **"IGNITION START"** button
* Wait for audio context initialization (browser may require user interaction)

2. **Control RPM**

* Use `↑` arrow key to increase throttle
* Use `↓` arrow key to brake/decelerate
* Or use the **Quick Test Slider** in the gauges panel

3. **Adjust Settings**

* Use sliders in the **Tuning** panel for quick adjustments
* Click **"SHOW ADVANCED"** for detailed audio parameters
* Select different engine types from the dropdown

4. **Record Audio**

* Click **"REC"** to start recording
* Adjust RPM to desired state
* Click **"STOP & SAVE"** to download WAV file

```
```


---

## 🎮 Controls

### Keyboard

| Key | Action |
|-----|--------|
| `↑` | Throttle (Increase RPM) |
| `↓` | Brake (Decrease RPM) |

### Mouse

- **Sliders** - Adjust all parameters in real-time
- **Gauge Center** - Click to toggle label display
- **Ignition Button** - Start/stop engine
- **Quick Test Slider** - Direct RPM control (0-8000 RPM)

---

## 📁 Project Structure

```
Torque/
├── Torque.html          # Main application file
├── LICENSE              # License terms and conditions
├── README.md            # This file
├── TODO.md              # Development roadmap
├── PRESETS.md           # Preset configuration documentation
├── presets/             # Engine preset configurations
│   ├── v6.ini          # V6 engine preset
│   ├── v8.ini          # V8 engine preset
│   ├── v10.ini         # V10 engine preset
│   └── v12.ini         # V12 engine preset
└── assets/             # Visual assets
    ├── V8-Firing.gif   # Engine animation (placeholder)
    └── info.txt        # Asset information
```

---

## ⚙️ Configuration

> 📖 **Complete Preset Documentation**: See [PRESETS.md](PRESETS.md) for detailed INI file documentation, parameter reference, examples, and best practices.

### Preset Files

Presets are stored as INI files in the `presets/` directory. Each preset contains:

```ini
[Engine]
TYPE=v8
GIF_PATH=assets/V8-Firing.gif

[Audio]
BASE_PITCH=16
PITCH_RANGE=1.9
DISTORTION_STRENGTH=0.82
DISTORTION_AMT=0.2
HIGHPASS_FREQ=150
LOWPASS_FREQ=1470
SUB_OSC_VOL=-11
NOISE_AMOUNT=0.80
RESONANCE=3.7

[Performance]
REV_LIMIT=7500
BACKFIRE_CHANCE=0.3
GOVERNOR_ENABLED=true
ACCELERATION_SENSITIVITY=0.05

[Gauges]
MAX_SPEED_KMH=300
MAX_SPEED_MPH=180
RPM_START=0
RPM_END=9000
```

### Creating Custom Presets

1. Copy an existing preset file (e.g., `v8.ini`)
2. Rename it to your desired name (e.g., `custom.ini`)
3. Edit the values to match your desired sound
4. The preset will automatically load when you select the engine type

> 💡 **Need help with parameters?** Check out the [complete Preset Documentation](PRESETS.md) for detailed parameter descriptions, ranges, examples, and tuning tips.

---

## 🎨 Customization

### Changing Engine Types

1. Select engine type from the **"Advanced Engine Tuning"** dropdown
2. Preset automatically loads from `presets/[engine-type].ini`
3. All parameters update to match the preset

### Adjusting Sound Character

- **Deeper Sound**: Lower `BASE_PITCH` (15-20 Hz)
- **More Aggressive**: Increase `DISTORTION_STRENGTH` (0.8-1.0)
- **Brighter Sound**: Increase `LOWPASS_FREQ` (1500-2000 Hz)
- **More Rumble**: Increase `SUB_OSC_VOL` (-5 to 0 dB)
- **More Intake Noise**: Increase `NOISE_AMOUNT` (0.8-1.0)

### Visual Customization

The dashboard uses CSS custom properties for easy theming:

```css
:root {
    --bg-dark: #0b0c10;
    --panel-bg: #1f2833;
    --accent-cyan: #66fcf1;
    --accent-dim: #45a29e;
    --text-light: #c5c6c7;
    --danger: #e74c3c;
}
```

Modify these values in the `<style>` section to change the color scheme.

---

## 🔬 Technical Details

### Audio Architecture

Torque.JS uses **Tone.js** for audio synthesis with the following signal chain:

1. **Oscillators** (Multiple layers):
   - Main oscillator (sawtooth) - Fundamental frequency
   - Harmonic oscillator (triangle) - Engine-specific interval
   - Sub oscillator (square) - Low-end rumble
   - Texture oscillator (sawtooth) - Harmonic richness

2. **Filters**:
   - High-pass filter - Removes unwanted low frequencies
   - Low-pass filter - Dynamic cutoff based on RPM and load

3. **Effects**:
   - Distortion - Configurable saturation
   - Noise generator - Intake simulation
   - Backfire synthesizer - Explosive effects

4. **Master Chain**:
   - Limiter - Prevents clipping
   - Gain control - Overall volume

### Physics Simulation

- **Matter.js** - 2D physics engine for piston visualization
- **Synchronized Animation** - Piston movement matches RPM
- **Real-time Updates** - 60 FPS physics simulation

### Browser Compatibility

- **Chrome/Edge** - Full support
- **Firefox** - Full support
- **Safari** - Full support (may require user interaction for audio)
- **Mobile Browsers** - Limited (audio context restrictions)

---

## 🎯 Use Cases

- **Game Development** - Realistic engine sounds for racing games
- **Audio Production** - Generate engine sound effects
- **Prototyping** - Quick engine sound testing
- **Education** - Learn about audio synthesis and engine physics
- **Indie Projects** - Lightweight alternative to complex simulators

---

## 🛠️ Dependencies

Torque.JS uses the following CDN-hosted libraries (no installation required):

- **Tone.js** (v14.8.49) - Audio synthesis framework
- **Matter.js** (v0.19.0) - Physics engine for visualization
- **Tailwind CSS** (CDN) - Utility-first CSS framework

All dependencies are loaded via CDN, so an internet connection is required for initial load.

---

## 📝 License

This project is **Semi-Open Source** with collaboration-friendly terms. 

**Key Points:**
- ✅ **Free to use** in your projects (commercial or non-commercial)
- ✅ **Must credit** Torque.JS in game credits screens (clearly visible)
- ✅ **Must document** usage in changelog/git history
- ✅ **Collaboration welcome** - contributors become part of the tools sub-team
- ❌ **No unauthorized forking or modification** - contact us first
- ❌ **No removal of attribution** - credits must remain visible

**Full License Terms:** See [LICENSE](LICENSE) file for complete terms and conditions.

**Want to contribute?** Feel free to reach out anytime! Join us on [Discord](https://discord.gg/NfEhsrJD7x) to get in touch and become part of the Torque.JS development team. 

---

## 🙏 Credits

- **Developer**: Asterisk
- **Organization**: Iron Will Interactive 2025
- **Engine GIF**: Placeholder from Engine Sim project (see `assets/info.txt`)

### Acknowledgments

- Inspired by Engine Sim, but designed to be simpler and more accessible
- Built for indie developers who need practical, easy-to-use tools

---

## 🐛 Known Issues

- Audio context requires user interaction in some browsers (Safari, mobile)
- GIF animations may not restart properly on preset change (refresh page)
- Some advanced audio layers are currently disabled by default (can be enabled in code)

---

## 🔮 Future Enhancements

> 📋 **Full Roadmap**: See [TODO.md](TODO.md) for the complete development roadmap, priority tasks, and upcoming features.

**Coming Soon:**
- [ ] Custom engine GIF animations for each engine type
- [ ] Enhanced audio tone layers for richer sound
- [ ] 3D spatial audio for ultimate realism
- [ ] Additional engine configurations (I4, I6, etc.)
- [ ] MIDI input support
- [ ] Web Audio API optimization
- [ ] Mobile-friendly controls
- [ ] Preset sharing/export functionality
- [ ] Real-time parameter automation
- [ ] Multi-engine support (multiple engines simultaneously)

---

## 📞 Support

For issues, questions, or contributions:

1. **Join our Discord**: [SpeedVerse Discord](https://discord.gg/NfEhsrJD7x) - Reach out to us anytime!
2. Check existing issues on GitHub
3. Create a new issue with detailed information
4. Include browser version and console errors if applicable

---

## 🎉 Getting Started Checklist

- [ ] Open `Torque.html` in your browser
- [ ] Click "IGNITION START"
- [ ] Allow audio context if prompted
- [ ] Use arrow keys to control RPM
- [ ] Experiment with tuning sliders
- [ ] Try different engine types
- [ ] Record and export audio
- [ ] Create custom presets

---

<div align="center">

**Built with ❤️ for developers who value simplicity and usability**

*Torque.JS - Where ease of use meets powerful functionality*

</div>

