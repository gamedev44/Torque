# Torque.JS V3: Engine Sound Emulator

Advanced engine physics and audio simulation system built with TypeScript.

**Build v3.0.0 alpha**

## Overview

Torque.JS V3 is the advanced version featuring modern web technologies, enhanced physics simulation, and a comprehensive engine selection system.

## Features

### Engine Support
- **Templates**: 2.5L Inline-4 (Ford Duratec), 4.5L V8 (Ferrari F136), Racing V8
- **Basic Engines**: V2, V4, V6, V8, V10, V12, V16 configurations
- Realistic redline values and gear ratios for each engine type

### Visual Features
- Video-based engine visualizer with RPM-controlled playback speed
- Real-time chroma keying (black transparency)
- Custom gauges with dynamic redline indicators
- Audio waveform visualization with pan/zoom
- Engine selection modal with video preview thumbnails

### Physics & Audio
- Advanced engine and drivetrain physics simulation
- Real-time audio synthesis based on engine state
- Configurable via INI files
- Support for custom gear ratios and engine parameters

### Controls
- **W**: Accelerate
- **S**: Decelerate  
- **↑/↓**: Gear changes
- **Spacebar**: Brake
- **I**: Toggle idle

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Starts development server at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

Outputs to `dist/` directory. Can be deployed to any static hosting service.

## Configuration

Engine configurations are stored in `presets/*.ini` files. Each engine can be customized with:
- Engine parameters (idle, limiter, torque, etc.)
- Drivetrain settings (gears, shift time, damping)
- Sound sources and volumes
- Video paths
- Gauge settings (max speed, RPM range)

## Project Structure

```
V3/torque-v3/
├── index.html          # Main HTML file
├── src/
│   ├── main.ts        # Main application logic
│   ├── Vehicle.ts     # Vehicle physics simulation
│   ├── Engine.ts      # Engine physics
│   ├── Drivetrain.ts  # Drivetrain simulation
│   ├── AudioManager.ts # Audio synthesis
│   └── configurations.ts # Default engine configs
├── presets/           # INI configuration files
├── public/
│   ├── audio/         # Audio samples
│   └── assets/        # Video assets
└── dist/              # Build output
```

## Requirements

- Modern web browser with Web Audio API support
- Node.js 16+ (for development)
- npm or yarn

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT License

## See Also

- [Main README](../README.md) - Overview of both V2 and V3
- [V2 README](../../V2/README.md) - Classic HTML/CSS/JS version

