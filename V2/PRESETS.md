# Torque.JS Preset Configuration Guide

Complete documentation for creating and customizing engine presets using INI configuration files.

---

## 📋 Table of Contents

- [Overview](#overview)
- [File Structure](#file-structure)
- [Configuration Sections](#configuration-sections)
  - [Engine Section](#engine-section)
  - [Audio Section](#audio-section)
  - [Performance Section](#performance-section)
  - [Gauges Section](#gauges-section)
- [Parameter Reference](#parameter-reference)
- [Creating Custom Presets](#creating-custom-presets)
- [Examples](#examples)
- [Tips & Best Practices](#tips--best-practices)

---

## Overview

Torque.JS uses INI (Initialization) files to store engine preset configurations. These files are located in the `presets/` directory and are automatically loaded when you select an engine type in the application.

Preset files allow you to:
- Save and share engine configurations
- Quickly switch between different engine sounds
- Fine-tune audio parameters without modifying code
- Create custom engine profiles for specific use cases

---

## File Structure

Preset files follow a simple INI format with sections and key-value pairs:

```ini
[SectionName]
KEY=value
ANOTHER_KEY=value
```

**Rules:**
- Section names are case-insensitive (e.g., `[Engine]` = `[ENGINE]` = `[engine]`)
- Keys are case-insensitive
- Values can be numbers, booleans (`true`/`false`), or strings
- Comments start with `;` or `#`
- Empty lines are ignored

---

## Configuration Sections

### Engine Section

Defines the engine type and visual assets.

```ini
[Engine]
TYPE=v8
VIDEO_PATH=../V3/torque-v3/assets/Engines/V/V8.mp4
```

#### Parameters

| Parameter | Type | Values | Description |
|-----------|------|--------|-------------|
| `TYPE` | String | `v6`, `v8`, `v10`, `v12` | Engine configuration type. Determines harmonic intervals and firing order. |
| `VIDEO_PATH` | String | File path | Path to the engine MP4 visualizer (relative to project root). |

**Notes:**
- Engine type affects harmonic interval relationships:
  - **V8**: Perfect 8th (octave) - 2.0 ratio
  - **V6**: Perfect 12th (octave + fifth) - 1.5 ratio
  - **V10**: Major 10th - 1.778 ratio
  - **V12**: Perfect 12th (octave + fifth) - 1.5 ratio

---

### Audio Section

Controls all audio synthesis parameters.

```ini
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
```

#### Parameters

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `BASE_PITCH` | Float | 15-80 | 16 | Fundamental frequency in Hz. Lower values = deeper sound. |
| `PITCH_RANGE` | Float | 1.5-6.0 | 1.9 | RPM-to-pitch multiplier. Higher = more pitch variation with RPM. |
| `DISTORTION_STRENGTH` | Float | 0-1 | 0.82 | Core distortion amount. Higher = more aggressive sound. |
| `DISTORTION_AMT` | Float | 0-1 | 0.2 | Overall distortion level. Controls saturation amount. |
| `HIGHPASS_FREQ` | Integer | 100-800 | 150 | High-pass filter cutoff in Hz. Removes low-end frequencies. |
| `LOWPASS_FREQ` | Integer | 200-2000 | 1470 | Low-pass filter cutoff in Hz. Removes high-end frequencies. |
| `SUB_OSC_VOL` | Integer | -20 to 0 | -11 | Sub oscillator volume in dB. Controls low-end rumble. |
| `NOISE_AMOUNT` | Float | 0-1 | 0.80 | Intake noise intensity. Higher = more air intake sound. |
| `RESONANCE` | Float | 0.5-5.0 | 3.7 | Filter resonance/Q factor. Higher = more pronounced filter effect. |

**Audio Parameter Tips:**
- **Deeper Sound**: Lower `BASE_PITCH` (15-20 Hz)
- **More Aggressive**: Increase `DISTORTION_STRENGTH` (0.8-1.0)
- **Brighter Sound**: Increase `LOWPASS_FREQ` (1500-2000 Hz)
- **More Rumble**: Increase `SUB_OSC_VOL` (-5 to 0 dB)
- **More Intake Noise**: Increase `NOISE_AMOUNT` (0.8-1.0)

---

### Performance Section

Controls engine behavior and performance characteristics.

```ini
[Performance]
REV_LIMIT=7500
BACKFIRE_CHANCE=0.3
GOVERNOR_ENABLED=true
ACCELERATION_SENSITIVITY=0.05
```

#### Parameters

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `REV_LIMIT` | Integer | 4000-9000 | 7500 | Maximum RPM before rev limiter activates. |
| `BACKFIRE_CHANCE` | Float | 0-1 | 0.3 | Probability of backfire events (0 = never, 1 = always). |
| `GOVERNOR_ENABLED` | Boolean | `true`, `false` | `true` | Enable RPM protection. Prevents engine from entering redline zone. |
| `ACCELERATION_SENSITIVITY` | Float | 0.01-0.15 | 0.05 | RPM response speed. Lower = slower ramp up, Higher = instant response. |

**Performance Tips:**
- **Racing Engine**: Set `REV_LIMIT` to 8000-9000, `GOVERNOR_ENABLED=false`
- **Street Engine**: Set `REV_LIMIT` to 6000-7500, `GOVERNOR_ENABLED=true`
- **Aggressive Backfire**: Increase `BACKFIRE_CHANCE` to 0.5-0.7
- **Smooth Response**: Lower `ACCELERATION_SENSITIVITY` to 0.01-0.03

---

### Gauges Section

Configures the visual gauge displays.

```ini
[Gauges]
MAX_SPEED_KMH=300
MAX_SPEED_MPH=180
RPM_START=0
RPM_END=9000
```

#### Parameters

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `MAX_SPEED_KMH` | Integer | 100-400 | 300 | Maximum speedometer value in km/h. |
| `MAX_SPEED_MPH` | Integer | 60-250 | 180 | Maximum speedometer value in mph. |
| `RPM_START` | Integer | 0-2000 | 0 | Starting RPM value for gauge display. |
| `RPM_END` | Integer | 6000-12000 | 9000 | Maximum RPM value for gauge display. |

**Gauge Tips:**
- Set `RPM_END` to match or exceed `REV_LIMIT` for accurate display
- `MAX_SPEED_KMH` and `MAX_SPEED_MPH` should be proportional (1 km/h ≈ 0.621 mph)
- Redline indicator appears at ~83% of `RPM_END`

---

## Parameter Reference

### Quick Reference Table

| Section | Parameter | Type | Typical Range |
|---------|-----------|------|---------------|
| Engine | `TYPE` | String | v6, v8, v10, v12 |
| Engine | `VIDEO_PATH` | String | File path |
| Audio | `BASE_PITCH` | Float | 15-80 Hz |
| Audio | `PITCH_RANGE` | Float | 1.5-6.0 |
| Audio | `DISTORTION_STRENGTH` | Float | 0-1 |
| Audio | `DISTORTION_AMT` | Float | 0-1 |
| Audio | `HIGHPASS_FREQ` | Integer | 100-800 Hz |
| Audio | `LOWPASS_FREQ` | Integer | 200-2000 Hz |
| Audio | `SUB_OSC_VOL` | Integer | -20 to 0 dB |
| Audio | `NOISE_AMOUNT` | Float | 0-1 |
| Audio | `RESONANCE` | Float | 0.5-5.0 |
| Performance | `REV_LIMIT` | Integer | 4000-9000 RPM |
| Performance | `BACKFIRE_CHANCE` | Float | 0-1 |
| Performance | `GOVERNOR_ENABLED` | Boolean | true/false |
| Performance | `ACCELERATION_SENSITIVITY` | Float | 0.01-0.15 |
| Gauges | `MAX_SPEED_KMH` | Integer | 100-400 |
| Gauges | `MAX_SPEED_MPH` | Integer | 60-250 |
| Gauges | `RPM_START` | Integer | 0-2000 |
| Gauges | `RPM_END` | Integer | 6000-12000 |

---

## Creating Custom Presets

### Step-by-Step Guide

1. **Copy an Existing Preset**
   ```bash
   cp presets/v8.ini presets/my_custom.ini
   ```

2. **Edit the File**
   - Open the file in any text editor
   - Modify values to match your desired sound
   - Save the file

3. **Load the Preset**
   - The preset will automatically load when you select the engine type
   - Or modify the code to load your custom preset name

### Naming Convention

Preset files should follow the pattern: `[engine-type].ini`

Examples:
- `v8.ini` - V8 engine preset
- `v6_racing.ini` - Custom V6 racing preset
- `v12_tuned.ini` - Custom V12 tuned preset

---

## Examples

### Example 1: Deep, Aggressive V8

```ini
[Engine]
TYPE=v8
VIDEO_PATH=../V3/torque-v3/assets/Engines/V/V8.mp4

[Audio]
BASE_PITCH=14
PITCH_RANGE=2.2
DISTORTION_STRENGTH=0.95
DISTORTION_AMT=0.35
HIGHPASS_FREQ=120
LOWPASS_FREQ=1600
SUB_OSC_VOL=-8
NOISE_AMOUNT=0.90
RESONANCE=4.2

[Performance]
REV_LIMIT=8500
BACKFIRE_CHANCE=0.5
GOVERNOR_ENABLED=false
ACCELERATION_SENSITIVITY=0.08

[Gauges]
MAX_SPEED_KMH=350
MAX_SPEED_MPH=220
RPM_START=0
RPM_END=10000
```

### Example 2: Smooth, Street V6

```ini
[Engine]
TYPE=v6
VIDEO_PATH=../V3/torque-v3/assets/Engines/V/V6.mp4

[Audio]
BASE_PITCH=18
PITCH_RANGE=1.7
DISTORTION_STRENGTH=0.65
DISTORTION_AMT=0.15
HIGHPASS_FREQ=180
LOWPASS_FREQ=1350
SUB_OSC_VOL=-12
NOISE_AMOUNT=0.65
RESONANCE=3.2

[Performance]
REV_LIMIT=6500
BACKFIRE_CHANCE=0.1
GOVERNOR_ENABLED=true
ACCELERATION_SENSITIVITY=0.03

[Gauges]
MAX_SPEED_KMH=250
MAX_SPEED_MPH=155
RPM_START=0
RPM_END=8000
```

### Example 3: High-Revving V10

```ini
[Engine]
TYPE=v10
VIDEO_PATH=../V3/torque-v3/assets/Engines/V/V10.mp4

[Audio]
BASE_PITCH=17
PITCH_RANGE=2.5
DISTORTION_STRENGTH=0.88
DISTORTION_AMT=0.28
HIGHPASS_FREQ=140
LOWPASS_FREQ=1700
SUB_OSC_VOL=-10
NOISE_AMOUNT=0.85
RESONANCE=4.0

[Performance]
REV_LIMIT=9000
BACKFIRE_CHANCE=0.4
GOVERNOR_ENABLED=false
ACCELERATION_SENSITIVITY=0.06

[Gauges]
MAX_SPEED_KMH=380
MAX_SPEED_MPH=235
RPM_START=0
RPM_END=11000
```

---

## Tips & Best Practices

### Audio Tuning

1. **Start with Defaults**: Begin with a default preset and make small adjustments
2. **Test Incrementally**: Change one parameter at a time to understand its effect
3. **Balance Frequencies**: Ensure `HIGHPASS_FREQ` < `LOWPASS_FREQ`
4. **Match Engine Type**: Use appropriate `BASE_PITCH` for engine size:
   - Small engines (I4): 18-25 Hz
   - Medium engines (V6): 16-20 Hz
   - Large engines (V8, V10, V12): 14-18 Hz

### Performance Tuning

1. **Rev Limit Safety**: Set `RPM_END` in Gauges section higher than `REV_LIMIT`
2. **Governor Usage**: Enable governor for realistic behavior, disable for racing
3. **Backfire Balance**: Too high (0.8+) can be overwhelming, too low (0.1-) may be unnoticeable

### File Management

1. **Backup Presets**: Keep copies of working presets
2. **Version Control**: Use descriptive names for different versions
3. **Documentation**: Add comments in INI files to remember why values were chosen

### Common Issues

**Problem**: Sound is too quiet
- **Solution**: Check `SUB_OSC_VOL` isn't too low, increase `DISTORTION_AMT`

**Problem**: Sound is too harsh/digital
- **Solution**: Lower `DISTORTION_STRENGTH`, increase `LOWPASS_FREQ`, reduce `RESONANCE`

**Problem**: RPM doesn't respond quickly
- **Solution**: Increase `ACCELERATION_SENSITIVITY`

**Problem**: Gauge doesn't show correct range
- **Solution**: Ensure `RPM_END` matches your engine's maximum RPM

---

## Advanced Configuration

### Comments in INI Files

You can add comments to document your presets:

```ini
[Audio]
; Deep, rumbly base frequency
BASE_PITCH=16
; Aggressive distortion for racing sound
DISTORTION_STRENGTH=0.90
```

### Multiple Presets for Same Engine

You can create multiple presets for the same engine type:

- `v8_street.ini` - Street-tuned V8
- `v8_racing.ini` - Racing-tuned V8
- `v8_drag.ini` - Drag racing V8

To use them, you'll need to modify the code to load the specific preset file, or rename them to match the engine type selector.

---

## Need Help?

- Check the [main README](../README.md) for general information
- Join our [Discord](https://discord.gg/NfEhsrJD7x) for support
- Review existing presets in the `presets/` directory for examples

---

<div align="center">

**Happy Tuning! 🎵**

</div>

