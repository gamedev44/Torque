# Torque.JS Development Roadmap

This document tracks upcoming features, improvements, and enhancements for Torque.JS.

---

## 🎯 Priority Tasks

### 🔴 High Priority

- [ ] **🔴 VITAL: Fix and Re-implement Drift Slip System (Spacebar + Arrow Keys)**
  - [ ] **Status**: DISABLED - Currently commented out due to freezing/stuck issues
  - [ ] **Priority**: CRITICAL - Must be finished and fixed before full implementation
  - [ ] Spacebar drift slip (90-120+ km/h threshold) causes freezing/stuck states
  - [ ] Arrow key drift slip (Left/Right + Up/Down combinations) also disabled
  - [ ] Direction indicator visual still works, but slip functionality is disabled
  - [ ] Need to completely redesign drift slip logic to prevent:
    - [ ] Infinite oscillation loops
    - [ ] Speed/RPM getting stuck at top values
    - [ ] Recovery logic not triggering properly
    - [ ] Feedback loops between RPM oscillation and speed slip
  - [ ] **Requirements for Re-enabling**:
    - [ ] Must have proper recovery cycles that ALWAYS trigger
    - [ ] Must prevent any stuck states (unless engine failure mode)
    - [ ] Must use stable reference points (not oscillating baseSpeed)
    - [ ] Must have maximum time limits and force recovery
    - [ ] Must be thoroughly tested before re-enabling
  - [ ] **Files**: `Torque.html` - Look for "DISABLED" comments
  - [ ] **Impact**: Core feature disabled until fixed

- [ ] **🔴 CRITICAL: Audio Quality Investigation - High-Pitched/Digital Sound Issue**
  - [ ] Investigate why audio sounds too high-pitched compared to real engines
  - [ ] Analyze digital/electric sound characteristics vs. raw, airy, real engine sounds
  - [ ] Research frequency ranges of real engines vs. current synthesis
  - [ ] Investigate oscillator types and their contribution to digital sound
  - [ ] Test lower base frequencies and pitch ranges
  - [ ] Examine filter settings and their impact on "airy" vs. "digital" character
  - [ ] Study how to achieve raw, organic sound vs. synthetic/electric timbre
  - [ ] Implement solutions to reduce digital artifacts and increase realism
  - [ ] Add airy/breathy characteristics through noise layers and filtering
  - [ ] Balance between clean synthesis and raw mechanical authenticity

- [ ] **Custom Engine GIF Animations**
  - [ ] Create custom V6 engine animation GIF
  - [ ] Create custom V8 engine animation GIF
  - [ ] Create custom V10 engine animation GIF
  - [ ] Create custom V12 engine animation GIF
  - [ ] Replace placeholder GIFs in `assets/` directory
  - [ ] Update preset files with new GIF paths
  - [ ] Ensure GIFs sync properly with RPM changes

### 🟡 Medium Priority

- [ ] **Enhanced Audio Synthesis**
  - [ ] Add more audio tone layers for richer sound
  - [ ] Implement additional oscillator types for texture variation
  - [ ] Create dynamic layer mixing based on RPM/load
  - [ ] Add harmonic series expansion for more complex timbres
  - [ ] **Emphasize mechanical noise from actual machine parts** - Unlike other engine sims that cancel out mechanical noise, Torque.JS will preserve and enhance these sounds (valve train, bearings, gears, etc.) as they add crucial realism, distortion character, and high-frequency "screaming" that makes engines sound authentic

- [ ] **3D Spatial Audio**
  - [ ] Research and implement 3D spatial audio techniques
  - [ ] Add Web Audio API spatialization (PannerNode)
  - [ ] Create realistic 3D spatial tone generation
  - [ ] Implement distance-based audio attenuation
  - [ ] Add listener position controls
  - [ ] Support for HRTF (Head-Related Transfer Function) if possible
  - [ ] Create ultimate realism through spatial audio positioning

### 🟢 Low Priority / Future Enhancements

- [ ] **Additional Engine Configurations**
  - [ ] I4 (Inline 4-cylinder) engine support
  - [ ] V4 engine support
  - [ ] Rotary/Wankel engine support
  - [ ] Electric motor simulation

- [ ] **Advanced Audio Features**
  - [ ] MIDI input support for external control
  - [ ] Audio parameter automation/sequencing
  - [ ] Real-time parameter modulation
  - [ ] Advanced effects chain (reverb, delay, chorus)
  - [ ] Exhaust system simulation (different muffler types)
  - [ ] Turbocharger/supercharger sound layers
  - [ ] Transmission sound simulation (gear shifts, clutch) - See "Transmission & Gear Shifting System" for full implementation
  - [ ] **Mechanical noise emphasis system** - Dedicated layer and controls for mechanical component sounds (valves, bearings, gears, chains) with emphasis on preserving these frequencies that other sims filter out, adding authentic distortion and high-RPM "screaming"

- [ ] **🔮 Long-Term: Sample-Based Fork (Experimental)**
  - [ ] Create a fork of Torque.JS that uses incremental sliced sound files (similar to Engine Sim approach)
  - [ ] Implement sample-based audio playback system
  - [ ] Create RPM-sliced audio sample library
  - [ ] Test and compare pure synthesis vs. sample-based approaches
  - [ ] Evaluate differences in:
    - Sound quality and realism
    - Performance characteristics
    - File size and loading requirements
    - Flexibility and customization
    - User experience
  - [ ] Document findings and determine if hybrid approach (synthesis + samples) would be beneficial
  - [ ] **Note**: This is a way-future experimental project to test alternative audio generation methods

- [ ] **Transmission & Gear Shifting System**
  - [ ] Implement gear shifting system with multiple gear positions
  - [ ] Park (P) gear - engine off/idle state
  - [ ] Reverse (R) gear - activated with arrow down key
  - [ ] Neutral (N) gear - engine running but no load
  - [ ] Forward gears 1-5 - sequential shifting
  - [ ] Use `<` and `>` keys (or `.` and `,`) to shift between gears
  - [ ] Visual gear indicator display
  - [ ] RPM behavior changes based on gear selection
  - [ ] Reverse gear audio characteristics (different engine sound)
  - [ ] Gear-dependent RPM limits and response curves
  - [ ] Smooth transitions between gear states

- [ ] **User Interface Improvements**
  - [ ] Mobile-friendly controls and responsive design
  - [ ] Touch gesture support for mobile devices
  - [ ] Preset manager UI (save/load/delete presets)
  - [ ] Preset sharing/export functionality
  - [ ] Real-time parameter visualization
  - [ ] Audio spectrum analyzer
  - [ ] 3D audio position visualizer

- [ ] **Performance & Optimization**
  - [ ] Web Audio API optimization
  - [ ] Reduce CPU usage for lower-end devices
  - [ ] Audio buffer size optimization
  - [ ] Lazy loading for optional features
  - [ ] Code splitting for better load times

- [ ] **Developer Features**
  - [ ] API documentation or equivalent exposure planned
  - [ ] Plugin system for custom audio layers
  - [ ] Scripting support for automation
  - [ ] Export presets as JSON
  - [ ] Import presets from JSON
  - [ ] Version control for presets

- [ ] **Documentation**
  - [ ] Video tutorials
  - [ ] Audio synthesis explanation guide
  - [ ] Best practices documentation
  - [ ] Troubleshooting guide expansion
  - [ ] API reference documentation

---

## 🔬 Research & Development

### Audio Realism Research

- [ ] Study real engine audio characteristics
- [ ] Analyze frequency spectra of different engine types
- [ ] **🔴 CRITICAL: Investigate high-pitched/digital sound issue** - Compare real engine frequency content vs. current synthesis. Research why synthesized engines sound "electric" or "digital" instead of raw, airy, and organic. Study:
  - Fundamental frequency ranges of real engines at idle vs. high RPM
  - Harmonic content and how it differs from pure oscillators
  - Airy/breathy characteristics in real engine recordings
  - What makes real engines sound "raw" vs. "synthetic"
  - Filter techniques to reduce digital artifacts
  - Noise integration for organic texture
- [ ] **Research mechanical noise characteristics** - Study valve train, bearing, gear, and timing component frequencies that are often filtered out in other sims but are crucial for authentic engine sound
- [ ] Research psychoacoustic principles for engine sounds
- [ ] Investigate convolution reverb for exhaust simulation
- [ ] Study spatial audio techniques for 3D positioning
- [ ] Research binaural audio for headphone users
- [ ] Analyze how mechanical noise contributes to distortion character and high-frequency content at different RPM ranges

### Technical Implementation Research

- [ ] Web Audio API spatial audio capabilities
- [ ] HRTF implementation possibilities
- [ ] Real-time audio processing optimization
- [ ] Browser compatibility for advanced features
- [ ] Performance benchmarks for different devices

---

## 🐛 Known Issues to Address

- [ ] GIF animations may not restart properly on preset change (refresh page workaround)
- [ ] Audio context requires user interaction in some browsers (Safari, mobile)
- [ ] Some advanced audio layers are currently disabled by default (can be enabled in code)
- [ ] Mobile browser audio limitations need better handling
- [ ] Improve error handling for missing preset files

---

## 📝 Notes

### Audio Layer Expansion Ideas

- **Exhaust Layer**: Convolution-based exhaust system simulation
- **Intake Layer**: Enhanced air intake with variable geometry
- **Mechanical Layer**: **EMPHASIZED** - Valve train, bearings, gears, timing chain/belt, camshaft, crankshaft, and all mechanical component noise. This layer is crucial for realism and should NOT be filtered out like other sims do. These mechanical sounds contribute to:
  - Realistic distortion character
  - High-frequency "screaming" at high RPM
  - Authentic engine texture
  - Mechanical authenticity that separates real engines from synthetic sounds
- **Resonance Layer**: Engine bay resonance simulation
- **Turbo Layer**: Turbocharger spool and wastegate sounds
- **Transmission Layer**: Gear whine and transmission noise

### 3D Spatial Audio Implementation Ideas

- Use Web Audio API `PannerNode` for 3D positioning
- Implement distance-based volume and frequency filtering
- Add Doppler effect for moving engine simulation
- Create multiple audio sources (engine, exhaust, intake) at different positions
- Support for both stereo and surround sound setups
- Consider WebXR for VR/AR applications

### GIF Animation Requirements

- Each engine type should have unique animation
- Animations should reflect engine configuration (V6, V8, V10, V12)
- Sync animation speed with RPM
- Consider piston firing order visualization
- Maintain dark theme aesthetic
- Optimize file sizes for web delivery

### Experimental Approaches (Long-Term)

- **Sample-Based Fork**: Create an experimental fork using incremental sliced sound files (similar to Engine Sim's approach) to test differences between pure synthesis and sample-based methods. This would help determine:
  - Which approach provides better realism
  - Performance trade-offs between synthesis and sample playback
  - Whether a hybrid approach (synthesis + samples) would be optimal
  - File size and loading time considerations
  - User experience differences

**Note**: This is a way-future experimental project, not a priority. The main Torque.JS project will continue focusing on pure synthesis for its lightweight, dependency-free approach.

---

## 🎯 Milestones

### Milestone 1: Visual Overhaul
- ✅ Complete custom GIF animations for all engine types
- ✅ Replace all placeholder assets
- **Target**: Next release

### Milestone 2: Audio Enhancement
- ✅ Add more audio tone layers
- ✅ Improve sound realism
- **Target**: Future release

### Milestone 3: Spatial Audio
- ✅ Implement 3D spatial audio
- ✅ Ultimate realism through spatial positioning
- **Target**: Major feature release

### Milestone 4: Additional Engines
- ✅ Add I4, I6, and other engine types
- **Target**: Future release

---

## 🤝 Contributing

Want to help with any of these tasks? Join our [Discord](https://discord.gg/NfEhsrJD7x) and let us know what you'd like to work on!

---

<div align="center">

**Last Updated**: 2025

*This roadmap is subject to change based on user feedback and development priorities.*

</div>

