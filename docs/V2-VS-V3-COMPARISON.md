# Torque.JS V2 vs V3: Technical Comparison

A comprehensive comparison of the two versions of Torque.JS, highlighting their differences, use cases, and technical implementations.

## Quick Reference

| Feature | V2 | V3 |
|---------|----|----|
| **Technology Stack** | HTML/CSS/JS | TypeScript + Vite |
| **Audio Library** | Tone.js (CDN) | Web Audio API (Native) |
| **Physics Library** | Matter.js (CDN) | Custom Physics Engine |
| **Build Process** | None (Single File) | Vite Build System |
| **Visualizer** | GIF-based | Video-based with RPM control |
| **Engine Selection** | Dropdown | Modal with video previews |
| **Configuration** | INI files | INI files + TypeScript defaults |
| **Offline Support** | Full (after initial load) | Full (after build) |
| **Deployment** | Direct HTML file | Static build (dist/) |

## Architecture Comparison

### V2: Classic Single-File Architecture

**Technology Stack:**
- **Audio**: Tone.js v14.8.49 (CDN)
- **Physics**: Matter.js v0.19.0 (CDN)
- **Styling**: Tailwind CSS (CDN)
- **Structure**: Single HTML file with embedded CSS/JS

**Key Characteristics:**
- Zero build process - works immediately
- All dependencies loaded via CDN
- Self-contained single file (`Torque.html`)
- Requires internet connection for initial CDN loads
- Works offline after initial load (if CDN cached)

**Audio Implementation:**
```javascript
// V2 uses Tone.js for audio synthesis
const oscillator = new Tone.Oscillator({
    frequency: basePitch,
    type: "sawtooth"
});
const filter = new Tone.Filter({
    frequency: lowpassFreq,
    type: "lowpass"
});
```

**Physics Implementation:**
```javascript
// V2 uses Matter.js for physics visualization
const engine = Matter.Engine.create();
const world = engine.world;
Matter.Engine.update(engine);
```

### V3: Modern Modular Architecture

**Technology Stack:**
- **Audio**: Web Audio API (Native Browser API)
- **Physics**: Custom TypeScript physics engine
- **Build**: Vite + TypeScript
- **Structure**: Modular TypeScript files

**Key Characteristics:**
- TypeScript for type safety
- Modular codebase (separate files for Engine, Drivetrain, AudioManager, etc.)
- Build process required for production
- All assets bundled in `dist/` folder
- Fully offline after build (no CDN dependencies)

**Audio Implementation:**
```typescript
// V3 uses native Web Audio API
const audioContext = new AudioContext();
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();
const filterNode = audioContext.createBiquadFilter();
oscillator.connect(gainNode);
gainNode.connect(filterNode);
filterNode.connect(audioContext.destination);
```

**Physics Implementation:**
```typescript
// V3 uses custom physics engine
class Engine {
    rpm: number;
    omega: number;
    limiter: number;
    update(dt: number): void {
        // Custom physics calculations
    }
}
```

## Feature Comparison

### Engine Support

**V2:**
- V6, V8, V10, V12 engines
- Basic engine configurations
- Simple dropdown selection

**V3:**
- V2, V4, V6, V8, V10, V12, V16 engines
- Template engines (Ford Duratec, Ferrari F136, Racing V8)
- Modal selection with video previews
- Search functionality with suggestions
- Custom imported engines via INI files

### Visual Features

**V2:**
- GIF-based engine visualizer
- Static GIF animation
- Basic gauge displays
- Audio waveform visualization

**V3:**
- Video-based engine visualizer
- RPM-controlled video playback speed (0.25x to 3x)
- Real-time chroma keying (black transparency)
- Dynamic gauge displays with realistic redlines
- Advanced waveform visualization with pan/zoom
- Engine logo overlay with blur effects

### Audio Features

**V2 (Tone.js):**
- Tone.js-based synthesis
- Multiple oscillator layers
- Built-in effects (distortion, filters)
- CDN dependency
- Simpler API, less control

**V3 (Web Audio API):**
- Native browser audio API
- Full control over audio graph
- Custom audio processing
- No external dependencies
- More complex but more powerful
- Lower-level control

### Configuration

**V2:**
- INI files in `presets/` folder
- Basic configuration options
- Manual preset loading

**V3:**
- INI files in `presets/` folder
- TypeScript default configurations
- Hybrid system (TypeScript defaults + INI overrides)
- Export/Import INI functionality
- Custom engine storage in localStorage

### User Interface

**V2:**
- Classic Torque.js design
- Simple dropdowns
- Basic controls
- Single-page layout

**V3:**
- Modern dashboard design
- Modal-based engine selection
- Advanced tuning panels
- Responsive grid layout
- Search functionality
- Video preview thumbnails

## Performance Comparison

### Bundle Size

**V2:**
- Single HTML file (~3500+ lines)
- CDN dependencies (Tone.js ~200KB, Matter.js ~150KB)
- Total: ~350KB+ (after CDN loads)

**V3:**
- Built bundle: ~500KB+ (includes all assets)
- No runtime CDN dependencies
- All assets bundled locally

### Runtime Performance

**V2:**
- Tone.js overhead
- Matter.js physics overhead
- CDN dependency (network latency on first load)
- Good performance after initial load

**V3:**
- Native Web Audio API (faster)
- Custom physics (optimized for use case)
- No network dependencies after build
- Better performance overall

## Development Experience

### V2
- ✅ No setup required
- ✅ Instant editing (just edit HTML)
- ✅ Simple debugging
- ❌ Large single file
- ❌ No type checking
- ❌ Limited tooling support

### V3
- ✅ TypeScript type safety
- ✅ Modular codebase
- ✅ Modern tooling (Vite, hot reload)
- ✅ Better IDE support
- ❌ Requires build setup
- ❌ More complex structure

## Deployment Comparison

### V2 Deployment
1. Upload `Torque.html` to web server
2. Ensure `presets/` and `assets/` folders are accessible
3. Done! (CDN dependencies load automatically)

### V3 Deployment
1. Run `npm install`
2. Run `npm run build`
3. Upload `dist/` folder contents
4. Done! (fully self-contained)

## Use Case Recommendations

### Choose V2 If:
- You need instant deployment
- You want zero build process
- You prefer simple, single-file architecture
- You're okay with CDN dependencies
- You need basic engine sound simulation
- You want maximum simplicity

### Choose V3 If:
- You need advanced features
- You want modern development workflow
- You prefer type safety and modularity
- You need custom engine configurations
- You want video-based visualizers
- You need offline-first deployment
- You want better performance

## Migration Path

### From V2 to V3:
1. Export V2 engine configurations as INI files
2. Import INI files into V3
3. Adjust configurations for V3's enhanced features
4. Test audio and physics behavior
5. Update any custom code to TypeScript

### From V3 to V2:
1. Extract engine configurations from V3
2. Simplify to V2's INI format
3. Remove V3-specific features
4. Test in V2 environment

## Technical Deep Dive

### Audio Architecture: Tone.js vs Web Audio API

**Tone.js (V2) Advantages:**
- Higher-level API (easier to use)
- Built-in effects and instruments
- Good documentation
- Active community

**Tone.js (V2) Disadvantages:**
- External dependency
- Less control over audio graph
- Larger bundle size
- CDN dependency

**Web Audio API (V3) Advantages:**
- Native browser API (no dependencies)
- Full control over audio graph
- Better performance
- Smaller bundle (no library overhead)

**Web Audio API (V3) Disadvantages:**
- Lower-level API (more complex)
- More code to write
- Steeper learning curve
- Browser compatibility considerations

### Physics: Matter.js vs Custom Engine

**Matter.js (V2) Advantages:**
- Full-featured physics engine
- Good for complex simulations
- Well-documented
- Active development

**Matter.js (V2) Disadvantages:**
- Overkill for engine simulation
- External dependency
- Larger bundle size
- More overhead than needed

**Custom Physics (V3) Advantages:**
- Optimized for engine simulation
- No external dependencies
- Smaller bundle size
- Better performance
- Full control over behavior

**Custom Physics (V3) Disadvantages:**
- More code to maintain
- Less features than Matter.js
- Custom implementation required

## Conclusion

Both versions serve different purposes:

- **V2** is perfect for quick deployment, simplicity, and zero-configuration needs
- **V3** is ideal for advanced features, modern development, and production applications

The choice depends on your specific requirements, technical expertise, and deployment constraints.

## See Also

- [V2 Documentation](../V2/README.md)
- [V3 Documentation](../V3/engine-audio/README.md)
- [Main README](../README.md)

