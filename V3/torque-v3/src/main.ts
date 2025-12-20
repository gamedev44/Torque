/**
 * Torque.JS: Engine Sound Emulator V3
 * 
 * @license Semi-Open Source with Attribution
 * Copyright (c) 2025 Iron Will Interactive
 * Developed by: Asterisk
 * 
 * This file is part of Torque.JS V3 - Advanced TypeScript Engine Sound Emulator
 * See LICENSE file for full license terms and attribution requirements.
 * 
 * Maker's Mark: TQJS-V3-MAIN-2025-IWI
 */

import * as configurations from './configurations';
import { Vehicle } from './Vehicle';
import { clamp } from './util/clamp';

let loaded = false;
let isEngineRunning = false;

const settings = {
    activeConfig: 'bac_mono'
}

// Throttle slip settings
let slipAtRedline = true; // Default: slip at redline
let slipStartRPM = 7650; // Custom slip start RPM (85% of 9000 default limiter)

// Governor setting - prevents RPM from exceeding redline
let governorEnabled = true; // Default: ON (enforces redline)

// Engine Video path - defaults to V8
let ENGINE_VIDEO_PATH = './assets/Engines/V/V8.mp4';

// Track previous playback rate for smooth transitions
let previousPlaybackRate = 0.5;

/* Vehicle */
const vehicle = new Vehicle();
const engine = vehicle.engine;
const drivetrain = vehicle.drivetrain;

/* UI Elements */
const startBtn = document.getElementById('start_btn') as HTMLButtonElement;
const stopEngineBtn = document.getElementById('stop_btn') as HTMLButtonElement;
const controls = document.getElementById('controls') as HTMLDivElement;
const statusDisplay = document.getElementById('status-display') as HTMLDivElement;
const engineStatus = document.getElementById('engine-status') as HTMLDivElement;
const throttleSlider = document.getElementById('throttle-slider') as HTMLInputElement;
const throttleValue = document.getElementById('throttle-value') as HTMLSpanElement;
const selectEngineBtn = document.getElementById('select-engine-btn') as HTMLButtonElement;
const engineModal = document.getElementById('engine-modal') as HTMLDivElement;
const closeEngineModal = document.getElementById('close-engine-modal') as HTMLButtonElement;
const currentEngineDisplay = document.getElementById('current-engine-display') as HTMLDivElement;
const engineTemplatesGrid = document.getElementById('engine-templates-grid') as HTMLDivElement;
const engineBasicGrid = document.getElementById('engine-basic-grid') as HTMLDivElement;
const engineCustomGrid = document.getElementById('engine-custom-grid') as HTMLDivElement;
const customEnginesSection = document.getElementById('custom-engines-section') as HTMLDivElement;
const engineModalSearch = document.getElementById('engine-modal-search') as HTMLInputElement;
const engineModalSearchResults = document.getElementById('engine-modal-search-results') as HTMLDivElement;
const waveformCanvas = document.getElementById('waveform-canvas') as HTMLCanvasElement;
const engineVideoCanvas = document.getElementById('engine-video-canvas') as HTMLCanvasElement;
if (engineVideoCanvas) {
    engineVideoCanvas.style.mixBlendMode = 'screen';
    engineVideoCanvas.style.background = 'transparent';
}
// Slip controls (declare before first usage)
const slipAtRedlineCheckbox = document.getElementById('slip-at-redline') as HTMLInputElement;
const slipStartSlider = document.getElementById('slider-slip-start') as HTMLInputElement;
const valSlipStart = document.getElementById('val-slip-start') as HTMLSpanElement;
const slipStartContainer = document.getElementById('slip-start-container') as HTMLDivElement;
const testRevSlider = document.getElementById('test-rev-slider') as HTMLInputElement;
const testRevValue = document.getElementById('test-rev-value') as HTMLSpanElement;
const rpmStartSlider = document.getElementById('slider-rpm-start') as HTMLInputElement;
const rpmEndSlider = document.getElementById('slider-rpm-end') as HTMLInputElement;
const valRpmStart = document.getElementById('val-rpm-start') as HTMLSpanElement;
const valRpmEnd = document.getElementById('val-rpm-end') as HTMLSpanElement;

/* Advanced Controls */
const toggleAdvanced = document.getElementById('toggle-advanced') as HTMLButtonElement;
const advancedPanel = document.getElementById('advanced-panel') as HTMLDivElement;
const toggleDrivetrain = document.getElementById('toggle-drivetrain') as HTMLButtonElement;
const drivetrainPanel = document.getElementById('drivetrain-panel') as HTMLDivElement;

/* Recording */
let recorder: MediaRecorder | null = null;
let recordingDestination: MediaStreamAudioDestinationNode | null = null;
let audioChunks: Blob[] = [];
const btnRecord = document.getElementById('btn-record') as HTMLButtonElement;
const btnStop = document.getElementById('btn-stop') as HTMLButtonElement;
const recStatus = document.getElementById('rec-status') as HTMLDivElement;

/* METER CLASS (Visual Gauges) */
let Meter = function Meter(this: any, $elm: HTMLElement, config: any) {
    let $needle: HTMLElement, $value: HTMLElement;
    
    let steps = (config.valueMax - config.valueMin) / config.valueStep,
        angleStep = (config.angleMax - config.angleMin) / steps;
    
    let margin = 10;
    let angle = 0;
    
    let value2angle = function(value: number) {
        let normalizedValue = Math.max(config.valueMin, Math.min(config.valueMax, value));
        let angle = ((normalizedValue / (config.valueMax - config.valueMin)) * (config.angleMax - config.angleMin) + config.angleMin);
        return angle;
    };
    
    this.setValue = function(v: number) {
        $needle.style.transform = "translate3d(-50%, 0, 0) rotate(" + Math.round(value2angle(v)) + "deg)";
        if ($value) {
            $value.innerHTML = config.needleFormat(v);
        }
    };
    
    this.updateConfig = function(newConfig: any) {
        Object.assign(config, newConfig);
        steps = (config.valueMax - config.valueMin) / config.valueStep;
        angleStep = (config.angleMax - config.angleMin) / steps;
    };
    
    let switchLabel = function(e: Event) {
        (e.target as HTMLElement).closest(".meter")?.classList.toggle('meter--big-label');
    };
    
    let makeElement = function(parent: HTMLElement, className: string, innerHtml: string, style?: any) {
        let e = document.createElement('div');
        e.className = className;
        if (innerHtml) e.innerHTML = innerHtml;
        if (style) {
            for (var prop in style) {
                (e.style as any)[prop] = style[prop];
            }
        }
        parent.appendChild(e);
        return e;
    };
    
    makeElement($elm, "label label-unit", config.valueUnit);
    
    for (let n=0; n < steps+1; n++) {
        let value = config.valueMin + n * config.valueStep;
        angle = config.angleMin + n * angleStep;
        
        let redzoneClass = "";
        if (config.valueRed && value > config.valueRed) {
            redzoneClass = " redzone";
        }
        
        makeElement($elm, "grad grad--" + n + redzoneClass, config.labelFormat(value), {
            left: (50 - (50 - margin) * Math.sin(angle * (Math.PI / 180))) + "%",
            top: (50 + (50 - margin) * Math.cos(angle * (Math.PI / 180))) + "%"
        });
        
        makeElement($elm, "grad-tick grad-tick--" + n + redzoneClass, "", {
            left: (50 - 50 * Math.sin(angle * (Math.PI / 180))) + "%",
            top: (50 + 50 * Math.cos(angle * (Math.PI / 180))) + "%",
            transform: "translate3d(-50%, 0, 0) rotate(" + (angle + 180) + "deg)"
        });
        
        angle += angleStep / 2;
        if (angle < config.angleMax) {
            makeElement($elm, "grad-tick grad-tick--half grad-tick--" + n + redzoneClass, "", {
                left: (50 - 50 * Math.sin(angle * (Math.PI / 180))) + "%",
                top: (50 + 50 * Math.cos(angle * (Math.PI / 180))) + "%",
                transform: "translate3d(-50%, 0, 0) rotate(" + (angle + 180) + "deg)"
            });
        }
        
        angle += angleStep / 4;
        if (angle < config.angleMax) {
            makeElement($elm, "grad-tick grad-tick--quarter grad-tick--" + n + redzoneClass, "", {
                left: (50 - 50 * Math.sin(angle * (Math.PI / 180))) + "%",
                top: (50 + 50 * Math.cos(angle * (Math.PI / 180))) + "%",
                transform: "translate3d(-50%, 0, 0) rotate(" + (angle + 180) + "deg)"
            });
        }
        
        angle -= angleStep / 2;
        if (angle < config.angleMax) {
            makeElement($elm, "grad-tick grad-tick--quarter grad-tick--" + n + redzoneClass, "", {
                left: (50 - 50 * Math.sin(angle * (Math.PI / 180))) + "%",
                top: (50 + 50 * Math.cos(angle * (Math.PI / 180))) + "%",
                transform: "translate3d(-50%, 0, 0) rotate(" + (angle + 180) + "deg)"
            });
        }
    }
    
    angle = value2angle(config.value);
    $needle = makeElement($elm, "needle", "", {
        transform: "translate3d(-50%, 0, 0) rotate(" + angle + "deg)"
    });
    
    let $axle = makeElement($elm, "needle-axle", "");
    $axle.addEventListener("click", switchLabel);
    let $labelValue = makeElement($elm, "label label-value", "<div>" + config.labelFormat(config.value) + "</div>" + "<span>" + config.labelUnit + "</span>");
    $labelValue.addEventListener("click", switchLabel);
    
    $value = $elm.querySelector(".label-value div") as HTMLElement;
} as any;

/* Initialize Gauges */
let speedMeter: any = null;
let rpmMeter: any = null;
let tempMeter: any = null;

// Thermal management system
const ROOM_TEMP = 20; // Celsius (ambient temperature)
const OPERATING_TEMP = 70; // Celsius (normal operating temperature)
let engineTemp = ROOM_TEMP; // Start at room temperature
let allowOverheat = false;
let isEngineSeized = false;
let thermalDamage = 0; // 0-100% damage accumulation
let lastEngineRunTime = 0; // Track when engine last ran

// Unit preferences
let useFahrenheit = false; // Default to Celsius
let useMPH = false; // Default to km/h


/* // Starter sound system
let starterAudio: HTMLAudioElement | null = null;
let isStarterPlaying = false;
const STARTER_SOUNDS: Record<string, string> = {
    'generic': './audio/Engine Starts/generic Engine Start.mp3',
    'auston_martin': './audio/Engine Starts/auston-martin-rapid-start-engine start idle and -engine-revs.mp4',
    'ford_ltl': './audio/Engine Starts/ford-ltl-9000_engine-start-and-idle.mp3',
    'merlin_v12': './audio/Engine Starts/Merlin v12 Spitfire.mp3',
    'v12_scream': './audio/Engine Starts/V12 ENGINE REV AND HIGH SCREAM.mp3',
    'volvo': './audio/Engine Starts/volvo-engine-start and idle.mp3'
}; */

function initGauges() {
    const speedGaugeEl = document.getElementById('gauge-speed');
    const rpmGaugeEl = document.getElementById('gauge-rpm');
    
    // Get max speed from config - check multiple sources
    let maxSpeed = 300; // Default fallback
    
    // Priority 1: Check stored config's gauges section (from INI or TypeScript)
    if ((window as any).currentEngineConfig) {
        const config = (window as any).currentEngineConfig;
        if (config.gauges) {
            // Try lowercase first (INI parser stores both)
            if (config.gauges.max_speed_kmh !== undefined) {
                maxSpeed = config.gauges.max_speed_kmh;
            } 
            // Try uppercase (original INI format)
            else if (config.gauges.MAX_SPEED_KMH !== undefined) {
                maxSpeed = config.gauges.MAX_SPEED_KMH;
            }
        }
    }
    
    console.log('initGauges - maxSpeed:', maxSpeed, 'from config:', (window as any).currentEngineConfig?.gauges);
    
    // Convert to MPH if that unit is selected
    if (useMPH) {
        maxSpeed = maxSpeed * 0.621371; // Convert km/h to mph
    }
    
    // Round max speed to nearest 10 for clean gauge display
    maxSpeed = Math.ceil(maxSpeed / 10) * 10;
    
    const speedUnit = useMPH ? 'mph' : 'km/h';
    const speedLabel = useMPH ? 'MPH' : 'KM/H';
    
    if (speedGaugeEl) {
        speedGaugeEl.innerHTML = '';
        speedMeter = new Meter(speedGaugeEl, {
            value: 0,
            valueMin: 0,
            valueMax: maxSpeed,
            valueStep: maxSpeed / 10, // 10 major ticks
            valueUnit: `<div>Speed</div><span>${speedLabel}</span>`,
            angleMin: 30,
            angleMax: 330,
            labelUnit: speedUnit,
            labelFormat: (v: number) => Math.round(v), // Show numbers on gauge
            needleFormat: (v: number) => Math.round(v), // Show value in center
            valueRed: maxSpeed * 0.8 // Redline at 80% of max
        });
        speedMeter.setValue(0);
    }
    
    if (rpmGaugeEl) {
        rpmGaugeEl.innerHTML = '';
        // Use actual engine limiter - this should be set after vehicle.init()
        const actualLimiter = engine && engine.limiter ? engine.limiter : 9000;
        // Round max RPM to nearest 500 for clean gauge display (but keep actual limiter for redline)
        const roundedMaxRPM = Math.ceil(actualLimiter / 500) * 500;
        const rpmStep = roundedMaxRPM / 10; // 10 major ticks
        // Redline at 85% of actual limiter (not rounded max)
        const redlineRPM = actualLimiter * 0.85;
        rpmMeter = new Meter(rpmGaugeEl, {
            value: (engine && engine.idle) ? engine.idle : 0,
            valueMin: 0,
            valueMax: roundedMaxRPM,
            valueStep: rpmStep,
            valueUnit: '<div>RPM</div><span>x1000</span>',
            angleMin: 30,
            angleMax: 330,
            labelUnit: 'RPM',
            labelFormat: (v: number) => Math.round(v / 1000), // Show numbers like 0, 1, 2, 3... (in thousands)
            needleFormat: (v: number) => Math.round(v / 100) * 100, // Show actual RPM in center
            valueRed: redlineRPM // Redline at 85% of actual limiter
        });
        rpmMeter.setValue((engine && engine.idle) ? engine.idle : 0);
    }
    
    // Initialize video visualizer on page load (engine off state)
    const engineVideo = document.getElementById('engine-video') as HTMLVideoElement;
    if (engineVideo) {
        // Set initial video source based on default engine
        const defaultVideoPath = getVideoPathForEngine(settings.activeConfig);
        console.log('Initializing video with path:', defaultVideoPath);
        engineVideo.src = defaultVideoPath;
        ENGINE_VIDEO_PATH = defaultVideoPath;
        
        // Initialize canvas for black transparency
        if (engineVideoCanvas) {
            const container = document.getElementById('gif-container');
            if (container) {
                const updateCanvasSize = () => {
                    const rect = container.getBoundingClientRect();
                    engineVideoCanvas.width = rect.width;
                    engineVideoCanvas.height = rect.height;
                };
                updateCanvasSize();
                window.addEventListener('resize', updateCanvasSize);
            }
        }
        
        // Add comprehensive event handlers
        engineVideo.onerror = (e) => {
            console.error('Video initialization error:', defaultVideoPath, engineVideo.error);
        };
        
        engineVideo.onloadstart = () => {
            console.log('Video load started:', defaultVideoPath);
        };
        
        engineVideo.onloadeddata = () => {
            console.log('Video data loaded:', defaultVideoPath);
        };
        
        engineVideo.oncanplay = () => {
            console.log('Video can play:', defaultVideoPath);
        };
        
        engineVideo.load();
        // Ensure video is visible even when paused
        engineVideo.style.display = 'block';
        engineVideo.style.visibility = 'visible';
        // Ensure container is visible
        const gifContainer = document.getElementById('gif-container') as HTMLDivElement;
        if (gifContainer) {
            gifContainer.style.display = 'flex';
            gifContainer.style.visibility = 'visible';
        }
    }
    
    // Initialize gear display
    const gearDisplay = document.getElementById('gear-value') as HTMLDivElement;
    if (gearDisplay) {
        gearDisplay.textContent = 'N';
    }
    
    updateVideoVisualizer(0);
}

/* INI Config Support */
async function loadINIConfig(engineType: string) {
    // Start with TypeScript default config (if exists)
    // @ts-ignore
    const tsConfig = configurations[engineType] || null;
    
    try {
        const response = await fetch(`./presets/${engineType}.ini`);
        if (!response.ok) {
            console.warn(`INI preset not found: ./presets/${engineType}.ini`);
            // Return TypeScript config directly if INI not found
            return tsConfig;
        }
        
        // Initialize config with TypeScript defaults or empty objects
        const config: any = tsConfig ? {
            engine: { ...tsConfig.engine },
            drivetrain: { ...tsConfig.drivetrain },
            sounds: JSON.parse(JSON.stringify(tsConfig.sounds)) // Deep copy sounds
        } : {
            engine: {},
            drivetrain: {},
            sounds: {}
        };
        
        // If no TypeScript config, use default sounds
        if (!tsConfig) {
            const defaultSounds = {
                on_high: {
                    source: './audio/BAC_Mono_onhigh.wav',
                    rpm: 1000,
                    volume: 0.5
                },
                on_low: {
                    source: './audio/BAC_Mono_onlow.wav',
                    rpm: 1000,
                    volume: 0.5
                },
                off_high: {
                    source: './audio/BAC_Mono_offveryhigh.wav',
                    rpm: 1000,
                    volume: 0.5
                },
                off_low: {
                    source: './audio/BAC_Mono_offlow.wav',
                    rpm: 1000,
                    volume: 0.5
                },
                limiter: {
                    source: './audio/limiter.wav',
                    volume: 0.4,
                    rpm: 8000,
                }
            };
            config.sounds = defaultSounds;
        }
        const iniText = await response.text();
        const lines = iniText.split('\n');
        let currentSection = '';
        
        for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith(';') || line.startsWith('#')) continue;
            
            if (line.startsWith('[') && line.endsWith(']')) {
                currentSection = line.slice(1, -1).toLowerCase();
                continue;
            }
            
            const [key, value] = line.split('=').map(s => s.trim());
            if (!key || !value) continue;
            
            let parsedValue: any = value;
            if (value === 'true') parsedValue = true;
            else if (value === 'false') parsedValue = false;
            else {
                const num = parseFloat(value);
                if (!Number.isNaN(num) && value !== '') parsedValue = num;
            }
            
            if (currentSection === 'engine') {
                const keyLower = key.toLowerCase();
                // Map INI keys to engine properties
                if (keyLower === 'idle') config.engine.idle = parsedValue;
                else if (keyLower === 'limiter') config.engine.limiter = parsedValue;
                else if (keyLower === 'soft_limiter') config.engine.soft_limiter = parsedValue;
                else if (keyLower === 'limiter_ms') config.engine.limiter_ms = parsedValue;
                else if (keyLower === 'inertia') config.engine.inertia = parsedValue;
                else if (keyLower === 'torque') config.engine.torque = parsedValue;
                else if (keyLower === 'engine_braking') config.engine.engine_braking = parsedValue;
                else if (keyLower === 'video_path') {
                    // Store video path for visualizer
                    (config.engine as any).video_path = parsedValue;
                    ENGINE_VIDEO_PATH = parsedValue;
                    console.log('VIDEO_PATH set from INI:', parsedValue);
                } else if (keyLower === 'type') {
                    // If VIDEO_PATH not specified, derive from TYPE
                    if (!(config.engine as any).video_path) {
                        const videoPath = getVideoPathForEngine(parsedValue);
                        (config.engine as any).video_path = videoPath;
                        ENGINE_VIDEO_PATH = videoPath;
                        console.log('VIDEO_PATH derived from TYPE:', parsedValue, '->', videoPath);
                    }
                }
            } else if (currentSection === 'drivetrain') {
                const keyLower = key.toLowerCase();
                if (keyLower === 'shift_time') config.drivetrain.shiftTime = parsedValue;
                else if (keyLower === 'damping') config.drivetrain.damping = parsedValue;
                else if (keyLower === 'compliance') config.drivetrain.compliance = parsedValue;
                else if (keyLower === 'final_drive') config.drivetrain.final_drive = parsedValue;
                else if (keyLower === 'gears' || keyLower === 'gear_ratios') {
                    // Parse gear ratios: GEARS=3.4,2.36,1.85,1.47,1.24,1.07
                    const gearArray = value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
                    if (gearArray.length > 0) {
                        config.drivetrain.gears = gearArray;
                    }
                }
            } else if (currentSection === 'gauges') {
                // Store gauge config for later use
                if (!config.gauges) config.gauges = {};
                const keyLower = key.toLowerCase();
                // Store both original and lowercase versions for compatibility
                config.gauges[key] = parsedValue; // Original case
                config.gauges[keyLower] = parsedValue; // Lowercase
            } else if (currentSection === 'sounds') {
                // Parse sounds section: ON_HIGH_SOURCE, ON_HIGH_RPM, ON_HIGH_VOLUME, etc.
                const keyLower = key.toLowerCase();
                
                // Extract sound type and property from key (e.g., "ON_HIGH_SOURCE" -> soundType="on_high", prop="source")
                let soundType: string | null = null;
                let prop: string | null = null;
                
                if (keyLower.startsWith('on_high_')) {
                    soundType = 'on_high';
                    prop = keyLower.replace('on_high_', '');
                } else if (keyLower.startsWith('on_low_')) {
                    soundType = 'on_low';
                    prop = keyLower.replace('on_low_', '');
                } else if (keyLower.startsWith('off_high_')) {
                    soundType = 'off_high';
                    prop = keyLower.replace('off_high_', '');
                } else if (keyLower.startsWith('off_low_')) {
                    soundType = 'off_low';
                    prop = keyLower.replace('off_low_', '');
                } else if (keyLower.startsWith('limiter_')) {
                    soundType = 'limiter';
                    prop = keyLower.replace('limiter_', '');
                }
                
                if (soundType && prop) {
                    // Initialize sound object if it doesn't exist
                    if (!config.sounds[soundType]) {
                        config.sounds[soundType] = {};
                    }
                    
                    // Set the appropriate property
                    if (prop === 'source') {
                        config.sounds[soundType].source = parsedValue;
                    } else if (prop === 'rpm') {
                        config.sounds[soundType].rpm = parsedValue;
                    } else if (prop === 'volume') {
                        config.sounds[soundType].volume = parsedValue;
                    }
                }
            }
        }
        
        return config;
    } catch (error) {
        console.error(`Error loading INI config ${engineType}:`, error);
        // Return TypeScript config directly if INI load fails
        return tsConfig;
    }
}

/* Events */
const keys: Record<string, boolean> = {}

document.addEventListener('keydown', e => {
    keys[e.code] = true;
});

document.addEventListener('keyup', e => {
    if (!loaded) {
        return;
    }
    
    keys[e.code] = false;

    if (e.code.startsWith('Digit')) {
        const nextGear = +e.key;
        drivetrain.changeGear(nextGear);
    }

    // Up/Down arrows for gear shifting
    if (e.code == 'ArrowUp')
        drivetrain.nextGear();
    if (e.code == 'ArrowDown')
        drivetrain.prevGear();
    
    // I key - Toggle idle (set throttle to maintain idle RPM)
    if (e.code == 'KeyI') {
        if (isEngineRunning) {
            // Toggle between idle and current throttle
            if (engine.throttle > 0.1) {
                // Save current throttle and set to idle
                (engine as any).savedThrottle = engine.throttle;
                engine.throttle = 0.1; // Idle throttle
            } else {
                // Restore saved throttle or set to 0.5
                engine.throttle = (engine as any).savedThrottle || 0.5;
            }
            if (throttleSlider) throttleSlider.value = engine.throttle.toString();
        }
    }
});

/* Throttle Slider - Works even when engine is off (for testing) */
throttleSlider?.addEventListener('input', (e) => {
    if (!loaded) return;
    const value = parseFloat((e.target as HTMLInputElement).value);
    engine.throttle = clamp(value, 0, 1);
});

/* Quick Test Rev Slider - Works even when engine is off (for testing) */
testRevSlider?.addEventListener('input', (e) => {
    if (!loaded) return;
    const revLevel = parseInt((e.target as HTMLInputElement).value);
    const revLevels = ['IDLE', 'LOW', 'MED', 'HIGH'];
    const rpmTargets = [engine.idle, engine.idle * 2, engine.limiter * 0.5, engine.limiter * 0.85];
    
    if (testRevValue) {
        testRevValue.textContent = revLevels[revLevel];
    }
    
    // Set throttle to achieve target RPM
    if (revLevel === 0) {
        engine.throttle = 0.1; // Idle
    } else if (revLevel === 1) {
        engine.throttle = 0.3; // Low
    } else if (revLevel === 2) {
        engine.throttle = 0.6; // Med
    } else {
        engine.throttle = 0.9; // High
    }
    
    // Update throttle slider to match
    if (throttleSlider) {
        throttleSlider.value = engine.throttle.toString();
    }
});

/* Quick Test Rev Sliders (RPM Start/End) - Like Torque */
rpmStartSlider?.addEventListener('input', (e) => {
    const value = parseInt((e.target as HTMLInputElement).value);
    if (valRpmStart) valRpmStart.textContent = value.toString();
    
    // Update RPM gauge min if needed
    if (rpmMeter && value >= 0) {
        const currentMax = parseInt(rpmEndSlider?.value || engine.limiter.toString() || '9000');
        rpmMeter.updateConfig({
            valueMin: value,
            valueStep: (currentMax - value) / 10
        });
    }
});

rpmEndSlider?.addEventListener('input', (e) => {
    const value = parseInt((e.target as HTMLInputElement).value);
    if (valRpmEnd) valRpmEnd.textContent = value.toString();
    
    // Update RPM gauge max and engine limiter
    if (rpmMeter) {
        const currentMin = parseInt(rpmStartSlider?.value || '0');
        engine.limiter = value;
        engine.omega_max = (2 * Math.PI * value) / 60;
        rpmMeter.updateConfig({
            valueMax: value,
            valueStep: (value - currentMin) / 10,
            valueRed: value * 0.85
        });
    }
});

// Engine list with display names, descriptions, and video paths
const engineList = [
    { 
        value: 'bac_mono', 
        name: '2.5L Inline-4 (Ford Duratec)', 
        engineName: '2.5L Inline-4 (Ford Duratec)',
        description: 'Naturally aspirated inline-four producing 311 hp at 8,000 RPM. Lightweight track-focused engine.',
        category: 'template', 
        videoPath: './assets/Engines/V/V8.mp4' 
    },
    { 
        value: 'ferr_458', 
        name: '4.5L V8 (Ferrari F136)', 
        engineName: '4.5L V8 (Ferrari F136)',
        description: 'Naturally aspirated V8 producing 570 hp at 9,000 RPM. High-revving Italian supercar engine.',
        category: 'template', 
        videoPath: './assets/Engines/V/V8.mp4' 
    },
    { 
        value: 'procar', 
        name: 'Racing V8', 
        engineName: 'Racing V8',
        description: 'High-performance racing engine tuned for pro street and track competition. Aggressive power delivery.',
        category: 'template', 
        videoPath: './assets/Engines/V/V8.mp4' 
    },
    { 
        value: 'v2', 
        name: 'V2 Engine', 
        engineName: 'V-Twin',
        description: 'Compact two-cylinder engine. Common in motorcycles and small performance vehicles.',
        category: 'basic', 
        videoPath: './assets/Engines/V/V2.mp4' 
    },
    { 
        value: 'v4', 
        name: 'V4 Engine', 
        engineName: 'V4',
        description: 'Four-cylinder V-configuration. Balanced power and efficiency for compact applications.',
        category: 'basic', 
        videoPath: './assets/Engines/V/V4.mp4' 
    },
    { 
        value: 'v6', 
        name: 'V6 Engine', 
        engineName: 'V6',
        description: 'Six-cylinder V-configuration. Popular in sports cars and performance sedans.',
        category: 'basic', 
        videoPath: './assets/Engines/V/V6.mp4' 
    },
    { 
        value: 'v8', 
        name: 'V8 Engine', 
        engineName: 'V8',
        description: 'Eight-cylinder V-configuration. Classic American muscle and European supercar power.',
        category: 'basic', 
        videoPath: './assets/Engines/V/V8.mp4' 
    },
    { 
        value: 'v10', 
        name: 'V10 Engine', 
        engineName: 'V10',
        description: 'Ten-cylinder V-configuration. Exotic supercar engine with exceptional power delivery.',
        category: 'basic', 
        videoPath: './assets/Engines/V/V10.mp4' 
    },
    { 
        value: 'v12', 
        name: 'V12 Engine', 
        engineName: 'V12',
        description: 'Twelve-cylinder V-configuration. Ultimate luxury and performance in hypercars.',
        category: 'basic', 
        videoPath: './assets/Engines/V/v12.mp4' 
    },
    { 
        value: 'v16', 
        name: 'V16 Engine', 
        engineName: 'V16',
        description: 'Sixteen-cylinder V-configuration. Extreme power for the ultimate performance machines.',
        category: 'basic', 
        videoPath: './assets/Engines/V/V16.mp4' 
    }
];

// Function to create engine preview thumbnail
function createEngineThumbnail(videoPath: string): Promise<string> {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.src = videoPath;
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.currentTime = 0.1; // Get first frame
        
        video.onloadeddata = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            } else {
                resolve('');
            }
        };
        
        video.onerror = () => resolve('');
        video.load();
    });
}

// Function to create engine tile
function createEngineTile(engineItem: typeof engineList[0], thumbnail: string) {
    const tile = document.createElement('div');
    tile.style.cssText = 'background: #111; border: 2px solid #333; border-radius: 8px; padding: 15px; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden;';
    tile.style.borderColor = engineItem.category === 'template' ? 'var(--accent-cyan)' : '#555';
    
    // Thumbnail
    const thumbContainer = document.createElement('div');
    thumbContainer.style.cssText = 'width: 100%; height: 120px; background: #000; border-radius: 4px; margin-bottom: 10px; overflow: hidden; position: relative;';
    
    if (thumbnail) {
        const img = document.createElement('img');
        img.src = thumbnail;
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
        thumbContainer.appendChild(img);
    } else {
        // Fallback: use video element for preview
        const previewVideo = document.createElement('video');
    previewVideo.src = engineItem.videoPath;
        previewVideo.muted = true;
        previewVideo.currentTime = 0.1;
        previewVideo.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
        previewVideo.onloadeddata = () => previewVideo.play().catch(() => {});
        thumbContainer.appendChild(previewVideo);
    }
    
    // Engine name (main title)
    const name = document.createElement('div');
    name.textContent = engineItem.name;
    name.style.cssText = `color: ${engineItem.category === 'template' ? 'var(--accent-cyan)' : 'var(--text-light)'}; font-weight: bold; text-align: center; font-size: 16px; margin-bottom: 6px;`;
    
    // Engine type name (smaller, below main name)
    const engineName = document.createElement('div');
    engineName.textContent = engineItem.engineName || '';
    engineName.style.cssText = 'color: #888; font-size: 11px; text-align: center; margin-bottom: 8px; font-style: italic;';
    
    // Description (small summary)
    const description = document.createElement('div');
    description.textContent = engineItem.description || '';
    description.style.cssText = 'color: #aaa; font-size: 10px; text-align: center; line-height: 1.4; padding: 0 5px;';
    
    tile.appendChild(thumbContainer);
    tile.appendChild(name);
    if (engineItem.engineName) tile.appendChild(engineName);
    if (engineItem.description) tile.appendChild(description);
    
    // Hover effects
    tile.onmouseenter = () => {
        tile.style.borderColor = 'var(--accent-cyan)';
        tile.style.boxShadow = '0 0 15px rgba(102, 252, 241, 0.5)';
        tile.style.transform = 'translateY(-2px)';
    };
    tile.onmouseleave = () => {
    tile.style.borderColor = engineItem.category === 'template' ? 'var(--accent-cyan)' : '#555';
        tile.style.boxShadow = 'none';
        tile.style.transform = 'translateY(0)';
    };
    
    tile.onclick = () => {
    selectEngine(engineItem.value);
        if (engineModal) {
            engineModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    };
    
    return tile;
}

// Populate modal with engine tiles
async function populateEngineModal() {
    if (!engineTemplatesGrid || !engineBasicGrid || !engineCustomGrid) return;
    
    engineTemplatesGrid.innerHTML = '';
    engineBasicGrid.innerHTML = '';
    engineCustomGrid.innerHTML = '';
    
    const templates = engineList.filter(e => e.category === 'template');
    const basics = engineList.filter(e => e.category === 'basic');
    
    // Load templates
    for (const engineItem of templates) {
        const thumbnail = await createEngineThumbnail(engineItem.videoPath);
        const tile = createEngineTile(engineItem, thumbnail);
        engineTemplatesGrid.appendChild(tile);
    }
    
    // Load basics
    for (const engineItem of basics) {
        const thumbnail = await createEngineThumbnail(engineItem.videoPath);
        const tile = createEngineTile(engineItem, thumbnail);
        engineBasicGrid.appendChild(tile);
    }
    
    // Load custom/imported engines from localStorage
    const customEngines = loadCustomEngines();
    if (customEngines.length > 0) {
        customEnginesSection.style.display = 'block';
    for (const engineItem of customEngines) {
        const thumbnail = await createEngineThumbnail(engineItem.videoPath || './assets/Engines/V/V8.mp4');
        const tile = createEngineTile(engineItem, thumbnail);
            engineCustomGrid.appendChild(tile);
        }
    } else {
        customEnginesSection.style.display = 'none';
    }
}

// Shared function to select an engine (handles both built-in and custom)
async function selectEngine(configName: string) {
    if (!configName) return;
    
    settings.activeConfig = configName;
    
    // Check if it's a custom engine first
    const customConfigs = JSON.parse(localStorage.getItem('torque_custom_configs') || '{}');
    if (customConfigs[configName]) {
        // Load custom config
        const config = customConfigs[configName];
        (window as any).currentEngineConfig = config;
        await vehicle.init(config as any);
        
        // Ensure audio context is resumed and playing if engine is running
        if (isEngineRunning && vehicle.audio.ctx) {
            if (vehicle.audio.ctx.state === 'suspended') {
                await vehicle.audio.ctx.resume();
            }
            console.log('Audio context state:', vehicle.audio.ctx.state);
        }
        
        await new Promise(resolve => setTimeout(resolve, 10));
        console.log('Loading custom engine:', configName);
        
        // Load custom engine info for display
        const customEngines = loadCustomEngines();
        const customEngineItem = customEngines.find(e => e.value === configName);
        
        // Ensure buttons are in correct state after engine change
        // If engine is not running, show start button; if running, show stop button
        if (!isEngineRunning) {
            if (startBtn) startBtn.style.display = 'block';
            if (stopEngineBtn) stopEngineBtn.style.display = 'none';
            if (statusDisplay) statusDisplay.textContent = 'ENGINE STOPPED // SELECTED: ' + (customEngineItem?.name || configName).toUpperCase();
        } else {
            if (startBtn) startBtn.style.display = 'none';
            if (stopEngineBtn) stopEngineBtn.style.display = 'block';
            if (statusDisplay) statusDisplay.textContent = 'ENGINE RUNNING // READY';
        }
        
        initGauges();
        
        // Update display
        if (currentEngineDisplay && customEngineItem) {
            currentEngineDisplay.textContent = customEngineItem.name;
        }
        
        // Update video IMMEDIATELY
        const engineVideo = document.getElementById('engine-video') as HTMLVideoElement;
        if (engineVideo) {
            const videoPath = (config.engine as any)?.video_path || getVideoPathForEngine(config.engine?.type || 'v8');
            ENGINE_VIDEO_PATH = videoPath;
            
            console.log('Custom engine changed to:', configName, 'Video path:', videoPath);
            
            engineVideo.pause();
            engineVideo.currentTime = 0;
            engineVideo.src = videoPath;
            
            // Show video frame IMMEDIATELY as soon as metadata loads
            engineVideo.onloadedmetadata = () => {
                updateVideoVisualizer(isEngineRunning ? engine.rpm : 0);
                if (engineVideo.videoWidth > 0) {
                    requestAnimationFrame(() => {
                        processVideoFrame();
                    });
                }
            };
            
            engineVideo.onloadeddata = () => {
                updateVideoVisualizer(isEngineRunning ? engine.rpm : 0);
                if (engineVideo.videoWidth > 0) {
                    processVideoFrame();
                }
                if (isEngineRunning && engine.rpm > 0) {
                    engineVideo.play().catch(err => console.warn('Video play failed:', err));
                }
            };
            
            engineVideo.oncanplay = () => {
                updateVideoVisualizer(isEngineRunning ? engine.rpm : 0);
                if (engineVideo.videoWidth > 0) {
                    processVideoFrame();
                }
                if (isEngineRunning && engine.rpm > 0) {
                    engineVideo.play().catch(err => console.warn('Video play failed:', err));
                }
            };
            
            engineVideo.load();
            
            // Update visualizer immediately
            updateVideoVisualizer(isEngineRunning ? engine.rpm : 0);
        }
        return;
    }
    
    // Original logic for built-in engines
    // Update current engine display
    const engineItem = engineList.find(e => e.value === configName);
    if (currentEngineDisplay && engineItem) {
        currentEngineDisplay.textContent = engineItem.name;
    }
    
    // Try to load INI config first, fallback to TypeScript config
    const iniConfig = await loadINIConfig(configName);
    let configToUse = iniConfig;
    if (!configToUse) {
        // @ts-ignore
        configToUse = configurations[configName];
    }
    
    // Store config globally so initGauges can access it
    (window as any).currentEngineConfig = configToUse;
    
    await vehicle.init(configToUse as any);
    
    // Ensure audio context is resumed and playing if engine is running
    if (isEngineRunning && vehicle.audio.ctx) {
        if (vehicle.audio.ctx.state === 'suspended') {
            await vehicle.audio.ctx.resume();
        }
        console.log('Audio context state:', vehicle.audio.ctx.state);
    }
    
    // Ensure engine is available before initializing gauges
    // Wait a tiny bit to ensure engine object is fully initialized
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Ensure buttons are in correct state after engine change
    // If engine is not running, show start button; if running, show stop button
    if (!isEngineRunning) {
        if (startBtn) startBtn.style.display = 'block';
        if (stopEngineBtn) stopEngineBtn.style.display = 'none';
        if (statusDisplay) statusDisplay.textContent = 'ENGINE STOPPED // SELECTED: ' + (engineItem?.name || configName).toUpperCase();
    } else {
        if (startBtn) startBtn.style.display = 'none';
        if (stopEngineBtn) stopEngineBtn.style.display = 'block';
        if (statusDisplay) statusDisplay.textContent = 'ENGINE RUNNING // READY';
    }
    
    // Reinitialize gauges with new engine settings (updates redline, max speed, etc.)
    console.log('Initializing gauges for engine:', configName);
    console.log('Config gauges:', configToUse.gauges);
    console.log('Engine limiter:', engine.limiter);
    initGauges();
    
    // Update video source IMMEDIATELY when engine type changes
    const engineVideo = document.getElementById('engine-video') as HTMLVideoElement;
    if (engineVideo) {
        // Get video path from config or derive from engine type
        const videoPath = ENGINE_VIDEO_PATH || getVideoPathForEngine(configName);
        ENGINE_VIDEO_PATH = videoPath;
        
        console.log('Engine changed to:', configName, 'Video path:', videoPath);
        
        // Always reload video when engine changes
        engineVideo.pause();
        engineVideo.currentTime = 0; // Reset to frame 0
        engineVideo.src = videoPath;
        
        // Add error handler
        engineVideo.onerror = (e) => {
            console.error('Video load error on engine change:', videoPath, engineVideo.error);
            if (engineVideoCanvas) {
                engineVideoCanvas.style.display = 'none';
            }
        };
        
        // Show video frame IMMEDIATELY as soon as metadata loads (faster than loadeddata)
        engineVideo.onloadedmetadata = () => {
            console.log('Video metadata loaded on engine change:', videoPath);
            // Show video frame immediately
            updateVideoVisualizer(isEngineRunning ? engine.rpm : 0);
            // Process frame to show it as soon as possible
            if (engineVideo.videoWidth > 0) {
                // Small delay to ensure frame is ready, then process
                requestAnimationFrame(() => {
                    processVideoFrame();
                });
            }
        };
        
        engineVideo.onloadeddata = () => {
            console.log('Video data loaded on engine change:', videoPath);
            // Update visualizer and process frame
            updateVideoVisualizer(isEngineRunning ? engine.rpm : 0);
            if (engineVideo.videoWidth > 0) {
                processVideoFrame();
            }
            // If engine is running, start playback immediately
            if (isEngineRunning && engine.rpm > 0) {
                engineVideo.play().catch(err => console.warn('Video play failed:', err));
            }
        };
        
        engineVideo.oncanplay = () => {
            console.log('Video can play on engine change:', videoPath);
            // Update visualizer again to ensure it's showing
            updateVideoVisualizer(isEngineRunning ? engine.rpm : 0);
            if (engineVideo.videoWidth > 0) {
                processVideoFrame();
            }
            // Ensure video is playing if engine is running
            if (isEngineRunning && engine.rpm > 0) {
                engineVideo.play().catch(err => console.warn('Video play failed:', err));
            }
        };
        
        // Load video immediately
        engineVideo.load();
        
        // Update visualizer immediately even before video loads (shows container)
        updateVideoVisualizer(isEngineRunning ? engine.rpm : 0);
    }
    
    // Update visualizer immediately (shows OFF state or current state)
    updateVideoVisualizer(isEngineRunning ? engine.rpm : 0);
}

// Modal functionality
selectEngineBtn?.addEventListener('click', () => {
    if (engineModal) {
        engineModal.style.display = 'block';
        document.body.classList.add('modal-open');
        populateEngineModal();
        // Clear search when opening
        if (engineModalSearch) engineModalSearch.value = '';
        if (engineModalSearchResults) engineModalSearchResults.style.display = 'none';
    }
});

closeEngineModal?.addEventListener('click', () => {
    if (engineModal) {
        engineModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
    if (engineModalSearch) engineModalSearch.value = '';
    if (engineModalSearchResults) engineModalSearchResults.style.display = 'none';
});

// Close modal when clicking outside
engineModal?.addEventListener('click', (e) => {
    if (e.target === engineModal) {
        engineModal.style.display = 'none';
        document.body.classList.remove('modal-open');
        if (engineModalSearch) engineModalSearch.value = '';
        if (engineModalSearchResults) engineModalSearchResults.style.display = 'none';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (engineModal && engineModal.style.display === 'block') {
            engineModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            if (engineModalSearch) engineModalSearch.value = '';
            if (engineModalSearchResults) engineModalSearchResults.style.display = 'none';
        }
        if (thermalModal && thermalModal.style.display === 'flex') {
            thermalModal.style.display = 'none';
        }
    }
    // Don't stop propagation - allow keyboard controls to work even with modal open
});

// Thermal Management Modal
const thermalModalBtn = document.getElementById('thermal-modal-btn') as HTMLButtonElement;
const thermalModal = document.getElementById('thermal-modal') as HTMLDivElement;
const closeThermalModal = document.getElementById('close-thermal-modal') as HTMLButtonElement;
const allowOverheatToggle = document.getElementById('allow-overheat-toggle') as HTMLInputElement;

thermalModalBtn?.addEventListener('click', () => {
    if (thermalModal) {
        thermalModal.style.display = 'flex';
        // Don't add modal-open class - allow interaction behind modal
        setTimeout(() => {
            (window as any).switchCarType(currentCarType);
        }, 100);
    }
});

closeThermalModal?.addEventListener('click', () => {
    if (thermalModal) {
        thermalModal.style.display = 'none';
    }
});

thermalModal?.addEventListener('click', (e) => {
    if (e.target === thermalModal) {
        thermalModal.style.display = 'none';
    }
});

allowOverheatToggle?.addEventListener('change', (e) => {
    allowOverheat = (e.target as HTMLInputElement).checked;
    console.log('Allow Overheat:', allowOverheat ? 'ON (DANGER MODE)' : 'OFF (SAFE MODE)');
    updateThermometerDisplay(); // Update external display immediately
});

// Thermal Modal Car SVG Templates
const carTemplates: Record<string, string> = {
    gt: `
        <path d="M100,100 Q100,50 175,50 Q250,50 250,100 L260,200 Q265,300 260,450 Q255,550 175,550 Q95,550 90,450 Q85,300 90,200 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" />
        <rect id="thermal-engine" x="135" y="110" width="80" height="100" rx="8" class="dmg-0" />
        <rect id="thermal-drivetrain" x="167" y="210" width="16" height="200" rx="2" class="dmg-0" />
        <rect id="thermal-wheel-fl" x="65" y="140" width="30" height="60" rx="4" class="dmg-0" />
        <rect id="thermal-wheel-fr" x="255" y="140" width="30" height="60" rx="4" class="dmg-0" />
        <rect id="thermal-wheel-rl" x="65" y="420" width="30" height="60" rx="4" class="dmg-0" />
        <rect id="thermal-wheel-rr" x="255" y="420" width="30" height="60" rx="4" class="dmg-0" />
    `,
    f1: `
        <path d="M140,50 L210,50 L200,200 L150,200 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" />
        <rect id="thermal-f-wing" x="80" y="70" width="190" height="20" rx="2" class="dmg-0" />
        <path d="M140,200 L210,200 L220,320 L130,320 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" />
        <path d="M110,320 L240,320 L260,520 L90,520 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" />
        <rect id="thermal-r-wing" x="100" y="550" width="150" height="30" rx="2" class="dmg-0" />
        <rect id="thermal-engine" x="145" y="340" width="60" height="90" rx="4" class="dmg-0" />
        <rect id="thermal-ers-unit" x="155" y="440" width="40" height="40" rx="20" class="dmg-0" />
        <rect id="thermal-drivetrain" x="170" y="480" width="10" height="70" class="dmg-0" />
        <rect id="thermal-wheel-fl" x="60" y="120" width="35" height="70" rx="2" class="dmg-0" />
        <rect id="thermal-wheel-fr" x="255" y="120" width="35" height="70" rx="2" class="dmg-0" />
        <rect id="thermal-wheel-rl" x="50" y="450" width="45" height="80" rx="2" class="dmg-0" />
        <rect id="thermal-wheel-rr" x="255" y="450" width="45" height="80" rx="2" class="dmg-0" />
    `,
    nascar: `
        <rect x="90" y="60" width="170" height="480" rx="20" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.2)" />
        <rect id="thermal-engine" x="125" y="100" width="100" height="120" rx="5" class="dmg-0" />
        <rect id="thermal-drivetrain" x="165" y="220" width="20" height="240" class="dmg-0" />
        <line x1="110" y1="100" x2="110" y2="500" stroke="rgba(255,255,255,0.1)" stroke-width="4" />
        <line x1="240" y1="100" x2="240" y2="500" stroke="rgba(255,255,255,0.1)" stroke-width="4" />
        <rect id="thermal-wheel-fl" x="70" y="130" width="35" height="70" rx="2" class="dmg-0" />
        <rect id="thermal-wheel-fr" x="245" y="130" width="35" height="70" rx="2" class="dmg-0" />
        <rect id="thermal-wheel-rl" x="70" y="430" width="35" height="70" rx="2" class="dmg-0" />
        <rect id="thermal-wheel-rr" x="245" y="430" width="35" height="70" rx="2" class="dmg-0" />
    `
};

let currentCarType = 'gt';
const thermalInputs = {
    engine: document.getElementById('thermal-input-engine') as HTMLInputElement,
    drive: document.getElementById('thermal-input-drive') as HTMLInputElement,
    brakes: document.getElementById('thermal-input-brakes') as HTMLInputElement
};
const thermalLabels = {
    engine: document.getElementById('thermal-label-engine') as HTMLSpanElement,
    drive: document.getElementById('thermal-label-drive') as HTMLSpanElement,
    brakes: document.getElementById('thermal-label-brakes') as HTMLSpanElement
};
const thermalFailures = {
    overheat: { active: false, el: document.getElementById('thermal-warn-overheat') as HTMLDivElement },
    ers: { active: false, el: document.getElementById('thermal-warn-ers') as HTMLDivElement },
    drs: { active: false, el: document.getElementById('thermal-warn-drs') as HTMLDivElement },
    aero: { active: false, el: document.getElementById('thermal-warn-aero') as HTMLDivElement }
};

(window as any).switchCarType = (type: string) => {
    currentCarType = type;
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
    const btn = document.getElementById(`btn-${type}`);
    if (btn) {
        btn.classList.add('selected');
        btn.style.background = 'rgba(0, 229, 255, 0.1)';
        btn.style.borderColor = '#00e5ff';
        btn.style.color = '#00e5ff';
    }
    
    const carGroup = document.getElementById('thermal-car-group');
    if (carGroup) {
        carGroup.innerHTML = carTemplates[type];
    }
    
    // Adjust warning positions based on car type
    if (type === 'f1') {
        thermalFailures.overheat.el.style.top = '380px';
        thermalFailures.ers.el.style.top = '440px';
    } else {
        thermalFailures.overheat.el.style.top = '150px';
        thermalFailures.ers.el.style.top = '250px';
    }
    
    updateThermalVisuals();
};

(window as any).toggleThermalFailure = (key: string) => {
    if (thermalFailures[key as keyof typeof thermalFailures]) {
        const failure = thermalFailures[key as keyof typeof thermalFailures];
        failure.active = !failure.active;
        failure.el.style.display = failure.active ? 'block' : 'none';
        updateThermalVisuals();
    }
};

function updateThermalVisuals() {
    if (!thermalInputs.engine || !thermalLabels.engine) return;
    
    const eVal = parseInt(thermalInputs.engine.value);
    const dVal = parseInt(thermalInputs.drive.value);
    const bVal = parseInt(thermalInputs.brakes.value);
    
    thermalLabels.engine.textContent = ((eVal / 6) * 100).toFixed(0) + '%';
    thermalLabels.drive.textContent = ((dVal / 6) * 100).toFixed(0) + '%';
    thermalLabels.brakes.textContent = ((bVal / 6) * 100).toFixed(0) + '%';
    
    // Update SVG elements
    const engine = document.getElementById('thermal-engine');
    const drive = document.getElementById('thermal-drivetrain');
    if (engine) engine.setAttribute('class', `dmg-${eVal}`);
    if (drive) drive.setAttribute('class', `dmg-${dVal}`);
    
    // Update wheels
    ['fl', 'fr', 'rl', 'rr'].forEach(pos => {
        const w = document.getElementById(`thermal-wheel-${pos}`);
        if (w) w.setAttribute('class', `dmg-${bVal}`);
    });
    
    // F1-specific components
    if (currentCarType === 'f1') {
        const ers = document.getElementById('thermal-ers-unit');
        const rWing = document.getElementById('thermal-r-wing');
        const fWing = document.getElementById('thermal-f-wing');
        
        if (ers) ers.setAttribute('class', thermalFailures.ers.active ? 'dmg-6' : (dVal > 3 ? 'dmg-3' : 'dmg-0'));
        if (rWing) rWing.setAttribute('class', thermalFailures.drs.active ? 'dmg-5' : 'dmg-0');
        if (fWing) fWing.setAttribute('class', thermalFailures.aero.active ? 'dmg-4' : 'dmg-0');
    }
    
    // Update readout
    const readout = document.getElementById('thermal-readout');
    if (readout) {
        let log: string[] = [];
        if (eVal > 4) log.push('> CRITICAL THERMAL BREACH');
        if (dVal > 4) log.push('> TORQUE SYNC FAILURE');
        if (thermalFailures.overheat.active) log.push('> ENGINE SHUTDOWN IMMINENT');
        if (currentCarType === 'f1' && thermalFailures.ers.active) log.push('> HYBRID HARVESTING ERROR');
        
        readout.innerHTML = log.length ? log.join('<br>') : 'MONITORING ACTIVE...<br>ALL SYSTEMS NOMINAL.';
    }
    
    // Calculate temperature based on damage and failures
    const avgDamage = (eVal + dVal + bVal) / 3;
    const baseTemp = 70 + (avgDamage * 35); // 70-280°C range
    engineTemp = baseTemp + (thermalFailures.overheat.active ? 50 : 0);
    
    // Update external thermometer display
    updateThermometerDisplay();
    
    // Spawn smoke if critical
    if (eVal >= 5 || thermalFailures.overheat.active) {
        spawnThermalSmoke();
    }
}

function updateThermometerDisplay() {
    const tempValue = document.getElementById('temp-value');
    const thermoFluid = document.getElementById('thermo-fluid');
    const thermoBulb = document.getElementById('thermo-bulb');
    const overheatStatus = document.getElementById('overheat-status');
    const tempStatus = document.getElementById('temp-status');
    
    // Convert to display unit (Fahrenheit if enabled)
    const displayTemp = useFahrenheit ? (engineTemp * 9/5 + 32) : engineTemp;
    const unit = useFahrenheit ? '°F' : '°C';
    
    if (tempValue) {
        tempValue.textContent = Math.round(displayTemp) + unit;
        
        // Color based on temperature (using Celsius for logic)
        if (engineTemp <= ROOM_TEMP + 5) {
            // Room temperature
            tempValue.style.color = '#66aaff';
            tempValue.style.textShadow = 'none';
        } else if (engineTemp >= 230) {
            tempValue.style.color = '#ff0000';
            tempValue.style.textShadow = '0 0 10px rgba(255, 0, 0, 0.8)';
        } else if (engineTemp >= 180) {
            tempValue.style.color = '#ff9100';
            tempValue.style.textShadow = '0 0 8px rgba(255, 145, 0, 0.6)';
        } else if (engineTemp >= 120) {
            tempValue.style.color = '#ffea00';
            tempValue.style.textShadow = 'none';
        } else {
            tempValue.style.color = '#00ffaa';
            tempValue.style.textShadow = 'none';
        }
    }
    
    if (thermoFluid && thermoBulb) {
        // Fluid level: 0% at room temp (20°C), 100% at 300°C
        const fluidPercent = Math.min(100, Math.max(0, ((engineTemp - ROOM_TEMP) / (300 - ROOM_TEMP)) * 100));
        thermoFluid.style.height = fluidPercent + '%';
        
        // Change fluid color based on temp
        if (engineTemp <= ROOM_TEMP + 5) {
            // Room temperature - cool blue
            thermoFluid.style.background = 'linear-gradient(to top, #4488ff, #66aaff, #88ccff)';
            thermoFluid.style.boxShadow = 'none';
            thermoBulb.style.background = 'radial-gradient(circle, #6699ff, #4488ff)';
            thermoBulb.style.boxShadow = '0 0 10px rgba(68, 136, 255, 0.6)';
        } else if (engineTemp >= 230) {
            thermoFluid.style.background = 'linear-gradient(to top, #ff0000, #ff3300, #ff6600)';
            thermoFluid.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.8)';
            thermoBulb.style.background = 'radial-gradient(circle, #ff4444, #ff0000)';
            thermoBulb.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.9)';
        } else if (engineTemp >= 180) {
            thermoFluid.style.background = 'linear-gradient(to top, #ff4400, #ff6600, #ff8800)';
            thermoFluid.style.boxShadow = '0 0 8px rgba(255, 100, 0, 0.6)';
            thermoBulb.style.background = 'radial-gradient(circle, #ff6600, #ff4400)';
            thermoBulb.style.boxShadow = '0 0 12px rgba(255, 100, 0, 0.7)';
        } else if (engineTemp >= 120) {
            thermoFluid.style.background = 'linear-gradient(to top, #ff8800, #ffaa00, #ffcc00)';
            thermoFluid.style.boxShadow = 'none';
            thermoBulb.style.background = 'radial-gradient(circle, #ffaa00, #ff8800)';
            thermoBulb.style.boxShadow = '0 0 10px rgba(255, 170, 0, 0.6)';
        } else {
            // Warming up - green
            thermoFluid.style.background = 'linear-gradient(to top, #00ffaa, #00ff88, #00ff66)';
            thermoFluid.style.boxShadow = 'none';
            thermoBulb.style.background = 'radial-gradient(circle, #00ffaa, #00ff88)';
            thermoBulb.style.boxShadow = '0 0 10px rgba(0, 255, 170, 0.6)';
        }
    }
    
    if (overheatStatus) {
        if (allowOverheat) {
            overheatStatus.textContent = '🔓 DANGER';
            overheatStatus.style.background = 'rgba(255, 0, 0, 0.3)';
            overheatStatus.style.borderColor = '#ff0000';
            overheatStatus.style.animation = 'pulse 1s infinite';
        } else {
            overheatStatus.textContent = '🔒 SAFE';
            overheatStatus.style.background = 'rgba(0, 255, 170, 0.2)';
            overheatStatus.style.borderColor = '#00ffaa';
            overheatStatus.style.animation = 'none';
        }
    }
    
    if (tempStatus) {
        if (engineTemp <= ROOM_TEMP + 5) {
            tempStatus.textContent = '❄️ ROOM TEMP';
            tempStatus.style.color = '#66aaff';
        } else if (engineTemp >= 250) {
            tempStatus.textContent = '☠️ CRITICAL';
            tempStatus.style.color = '#ff0000';
        } else if (engineTemp >= 230) {
            tempStatus.textContent = '🔥 DANGER';
            tempStatus.style.color = '#ff3300';
        } else if (engineTemp >= 180) {
            tempStatus.textContent = '⚠️ HIGH';
            tempStatus.style.color = '#ff9100';
        } else if (engineTemp >= 120) {
            tempStatus.textContent = '➜ WARM';
            tempStatus.style.color = '#ffea00';
        } else if (engineTemp >= OPERATING_TEMP) {
            tempStatus.textContent = 'NOMINAL';
            tempStatus.style.color = '#00ffaa';
        } else {
            tempStatus.textContent = '🌡️ WARMING';
            tempStatus.style.color = '#88ddff';
        }
    }
}

function spawnThermalSmoke() {
    if (Math.random() > 0.4) return;
    
    const smokeContainer = document.getElementById('thermal-smoke-container');
    const engine = document.getElementById('thermal-engine');
    if (!smokeContainer || !engine) return;
    
    const smoke = document.createElement('div');
    smoke.className = 'smoke-particle';
    
    try {
        const rect = (engine as any).getBBox();
        smoke.style.left = (rect.x + rect.width / 2 + (Math.random() * 30 - 15)) + 'px';
        smoke.style.top = (rect.y + rect.height / 2) + 'px';
        smoke.style.width = '12px';
        smoke.style.height = '12px';
        
        smokeContainer.appendChild(smoke);
        setTimeout(() => smoke.remove(), 1200);
    } catch (e) {
        // Silently fail if getBBox not available
    }
}

thermalModalBtn?.addEventListener('click', () => {
    if (thermalModal) {
        thermalModal.style.display = 'flex';
        // Don't add modal-open class - allow interaction behind modal
        setTimeout(() => {
            (window as any).switchCarType(currentCarType);
        }, 100);
    }
});

closeThermalModal?.addEventListener('click', () => {
    if (thermalModal) {
        thermalModal.style.display = 'none';
        // No need to remove modal-open since we don't add it
    }
});

thermalModal?.addEventListener('click', (e) => {
    if (e.target === thermalModal) {
        thermalModal.style.display = 'none';
        // No need to remove modal-open since we don't add it
    }
});

// Attach event listeners to thermal inputs
if (thermalInputs.engine) thermalInputs.engine.addEventListener('input', updateThermalVisuals);
if (thermalInputs.drive) thermalInputs.drive.addEventListener('input', updateThermalVisuals);
if (thermalInputs.brakes) thermalInputs.brakes.addEventListener('input', updateThermalVisuals);

// Search functionality in modal
let modalSearchTimeout: number | null = null;
engineModalSearch?.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase().trim();
    
    // Filter engine tiles based on search
    filterEngineTiles(query);
    
    // Show suggestions dropdown
    if (!query) {
        if (engineModalSearchResults) engineModalSearchResults.style.display = 'none';
        return;
    }
    
    // Debounce search suggestions
    if (modalSearchTimeout) clearTimeout(modalSearchTimeout);
    modalSearchTimeout = window.setTimeout(() => {
        // Filter engines by name
        const matches = engineList.filter(engine => 
            engine.name.toLowerCase().includes(query) || 
            engine.value.toLowerCase().includes(query)
        ).sort((a, b) => {
            // Sort by relevance (exact matches first, then starts with, then contains)
            const aStarts = a.name.toLowerCase().startsWith(query) || a.value.toLowerCase().startsWith(query);
            const bStarts = b.name.toLowerCase().startsWith(query) || b.value.toLowerCase().startsWith(query);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            return a.name.localeCompare(b.name);
        });
        
        if (engineModalSearchResults) {
            engineModalSearchResults.innerHTML = '';
            if (matches.length === 0) {
                engineModalSearchResults.innerHTML = '<div style="padding: 12px; color: #888; font-size: 12px; text-align: center;">No engines found</div>';
            } else {
                matches.forEach(engine => {
                    const item = document.createElement('div');
                    item.style.cssText = 'padding: 12px; cursor: pointer; border-bottom: 1px solid #333; font-size: 13px; transition: background 0.2s; display: flex; align-items: center; gap: 10px;';
                    item.style.color = engine.category === 'template' ? 'var(--accent-cyan)' : 'var(--text-light)';
                    
                    // Engine name
                    const name = document.createElement('span');
                    name.textContent = engine.name;
                    name.style.fontWeight = 'bold';
                    
                    // Category badge
                    const badge = document.createElement('span');
                    badge.textContent = engine.category === 'template' ? 'Template' : 'Basic';
                    badge.style.cssText = `font-size: 10px; padding: 2px 6px; border-radius: 3px; background: ${engine.category === 'template' ? 'rgba(102, 252, 241, 0.2)' : 'rgba(255, 255, 255, 0.1)'}; color: ${engine.category === 'template' ? 'var(--accent-cyan)' : '#888'};`;
                    
                    item.appendChild(name);
                    item.appendChild(badge);
                    
                    item.onmouseenter = () => {
                        item.style.background = '#222';
                        item.style.color = engine.category === 'template' ? 'var(--accent-cyan)' : '#fff';
                    };
                    item.onmouseleave = () => {
                        item.style.background = 'transparent';
                        item.style.color = engine.category === 'template' ? 'var(--accent-cyan)' : 'var(--text-light)';
                    };
                    item.onclick = () => {
                        selectEngine(engine.value);
                        if (engineModal) {
            engineModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
                        if (engineModalSearch) engineModalSearch.value = '';
                        if (engineModalSearchResults) engineModalSearchResults.style.display = 'none';
                    };
                    engineModalSearchResults.appendChild(item);
                });
            }
            engineModalSearchResults.style.display = 'block';
        }
    }, 150);
});

// Filter engine tiles based on search query
function filterEngineTiles(query: string) {
    const templates = engineTemplatesGrid?.children || [];
    const basics = engineBasicGrid?.children || [];
    
    const lowerQuery = query.toLowerCase();
    
    // Filter templates
    Array.from(templates).forEach((tile: Element) => {
        const name = tile.querySelector('div:last-child')?.textContent?.toLowerCase() || '';
        if (name.includes(lowerQuery) || lowerQuery === '') {
            (tile as HTMLElement).style.display = 'block';
        } else {
            (tile as HTMLElement).style.display = 'none';
        }
    });
    
    // Filter basics
    Array.from(basics).forEach((tile: Element) => {
        const name = tile.querySelector('div:last-child')?.textContent?.toLowerCase() || '';
        if (name.includes(lowerQuery) || lowerQuery === '') {
            (tile as HTMLElement).style.display = 'block';
        } else {
            (tile as HTMLElement).style.display = 'none';
        }
    });
}

// Hide search results when clicking outside
document.addEventListener('click', (e) => {
    if (engineModalSearchResults && engineModalSearch && 
        !engineModalSearch.contains(e.target as Node) && 
        !engineModalSearchResults.contains(e.target as Node)) {
        engineModalSearchResults.style.display = 'none';
    }
});

/* OLD Engine Select - REMOVED */
/* engineSelect?.addEventListener('change', async (e) => {
    // REMOVED: if (!loaded) return; - Allow engine selection before START
    const configName = (e.target as HTMLSelectElement).value;
    settings.activeConfig = configName;
    
    // Try to load INI config first, fallback to TypeScript config
    const iniConfig = await loadINIConfig(configName);
    let configToUse = iniConfig;
    if (!configToUse) {
        // @ts-ignore
        configToUse = configurations[configName];
    }
    
    // Store config globally so initGauges can access it
    (window as any).currentEngineConfig = configToUse;
    
    await vehicle.init(configToUse as any);
    
    // Reinitialize gauges with new engine settings (updates redline, max speed, etc.)
    initGauges();
    
    // Update video source IMMEDIATELY when engine type changes
    const engineVideo = document.getElementById('engine-video') as HTMLVideoElement;
    if (engineVideo) {
        // Get video path from config or derive from engine type
        const videoPath = ENGINE_VIDEO_PATH || getVideoPathForEngine(configName);
        ENGINE_VIDEO_PATH = videoPath;
        
        console.log('Engine changed to:', configName, 'Video path:', videoPath);
        
        // Always reload video when engine changes
        engineVideo.pause();
        engineVideo.currentTime = 0; // Reset to frame 0
        engineVideo.src = videoPath;
        
        // Hide canvas while loading to prevent thumbnail flashing
        if (engineVideoCanvas) {
            engineVideoCanvas.style.display = 'none';
        }
        
        // Add error handler
        engineVideo.onerror = (e) => {
            console.error('Video load error on engine change:', videoPath, engineVideo.error);
            if (engineVideoCanvas) {
                engineVideoCanvas.style.display = 'none';
            }
        };
        
        engineVideo.onloadeddata = () => {
            console.log('Video loaded on engine change:', videoPath);
            // Show video in OFF state immediately (even if engine not running)
            updateVideoVisualizer(isEngineRunning ? engine.rpm : 0);
            // Process frame to show it
            if (engineVideo.videoWidth > 0) {
                processVideoFrame();
            }
        };
        
        engineVideo.oncanplay = () => {
            console.log('Video can play on engine change:', videoPath);
            // Show video in OFF state immediately
            updateVideoVisualizer(isEngineRunning ? engine.rpm : 0);
            // Process frame to show it
            if (engineVideo.videoWidth > 0) {
                processVideoFrame();
            }
            // Only play if engine is actually running
            if (isEngineRunning && engine.rpm > 0) {
                engineVideo.play().catch(err => console.warn('Video play failed:', err));
            }
        };
        
        engineVideo.load();
    } else {
        console.error('engine-video element not found when changing engine!');
    }
    
    // Reinitialize gauges with new engine settings
    initGauges();
    
    // Update visualizer immediately to show new engine in OFF state
    updateVideoVisualizer(isEngineRunning ? engine.rpm : 0);
});

/* Advanced Controls */
toggleAdvanced?.addEventListener('click', () => {
    if (advancedPanel) {
        const isVisible = advancedPanel.style.display !== 'none';
        advancedPanel.style.display = isVisible ? 'none' : 'block';
        toggleAdvanced.textContent = isVisible ? 'SHOW ADVANCED' : 'HIDE ADVANCED';
    }
});

toggleDrivetrain?.addEventListener('click', () => {
    if (drivetrainPanel) {
        const isVisible = drivetrainPanel.style.display !== 'none';
        drivetrainPanel.style.display = isVisible ? 'none' : 'block';
        toggleDrivetrain.textContent = isVisible ? 'SHOW DRIVETRAIN' : 'HIDE DRIVETRAIN';
    }
});

// Advanced sliders
const setupAdvancedControls = () => {
    const sliderIdle = document.getElementById('slider-idle') as HTMLInputElement;
    const sliderLimiter = document.getElementById('slider-limiter') as HTMLInputElement;
    const sliderSoftLimiter = document.getElementById('slider-soft-limiter') as HTMLInputElement;
    const sliderInertia = document.getElementById('slider-inertia') as HTMLInputElement;
    const sliderTorque = document.getElementById('slider-torque') as HTMLInputElement;
    const sliderShiftTime = document.getElementById('slider-shift-time') as HTMLInputElement;
    const sliderDamping = document.getElementById('slider-damping') as HTMLInputElement;
    const sliderCompliance = document.getElementById('slider-compliance') as HTMLInputElement;
    
    sliderIdle?.addEventListener('input', (e) => {
        engine.idle = parseFloat((e.target as HTMLInputElement).value);
        document.getElementById('val-idle')!.textContent = engine.idle.toString();
    });
    
    sliderLimiter?.addEventListener('input', (e) => {
        engine.limiter = parseFloat((e.target as HTMLInputElement).value);
        engine.omega_max = (2 * Math.PI * engine.limiter) / 60;
        document.getElementById('val-limiter')!.textContent = engine.limiter.toString();
        if (rpmMeter) {
            rpmMeter.updateConfig({
                valueMax: engine.limiter,
                valueStep: engine.limiter / 10,
                valueRed: engine.limiter * 0.85
            });
        }
    });
    
    sliderSoftLimiter?.addEventListener('input', (e) => {
        engine.soft_limiter = parseFloat((e.target as HTMLInputElement).value);
        document.getElementById('val-soft-limiter')!.textContent = engine.soft_limiter.toString();
    });
    
    sliderInertia?.addEventListener('input', (e) => {
        engine.inertia = parseFloat((e.target as HTMLInputElement).value);
        document.getElementById('val-inertia')!.textContent = engine.inertia.toFixed(1);
    });
    
    sliderTorque?.addEventListener('input', (e) => {
        engine.torque = parseFloat((e.target as HTMLInputElement).value);
        document.getElementById('val-torque')!.textContent = engine.torque.toString();
    });
    
    sliderShiftTime?.addEventListener('input', (e) => {
        drivetrain.shiftTime = parseFloat((e.target as HTMLInputElement).value);
        document.getElementById('val-shift-time')!.textContent = drivetrain.shiftTime.toString();
    });
    
    sliderDamping?.addEventListener('input', (e) => {
        drivetrain.damping = parseFloat((e.target as HTMLInputElement).value);
        document.getElementById('val-damping')!.textContent = drivetrain.damping.toString();
    });
    
    sliderCompliance?.addEventListener('input', (e) => {
        drivetrain.compliance = parseFloat((e.target as HTMLInputElement).value);
        document.getElementById('val-compliance')!.textContent = drivetrain.compliance.toFixed(2);
    });
    
    // Governor toggle (RPM Limiter)
    const governorToggle = document.getElementById('governor-toggle') as HTMLInputElement;
    governorToggle?.addEventListener('change', (e) => {
        governorEnabled = (e.target as HTMLInputElement).checked;
        console.log('Governor', governorEnabled ? 'ENABLED' : 'DISABLED');
    });

    // Export/Import INI Configuration
    const exportConfigBtn = document.getElementById('export-config-btn') as HTMLButtonElement;
    const importConfigBtn = document.getElementById('import-config-btn') as HTMLButtonElement;
    const importConfigFile = document.getElementById('import-config-file') as HTMLInputElement;

    // Export current configuration to INI file
    exportConfigBtn?.addEventListener('click', () => {
        exportConfigToINI();
    });

    // Import INI file
    importConfigBtn?.addEventListener('click', () => {
        importConfigFile?.click();
    });

    importConfigFile?.addEventListener('change', async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            await importConfigFromINI(file);
            importConfigFile.value = ''; // Reset file input
        }
    });
    
    // Slip at redline checkbox
    slipAtRedlineCheckbox?.addEventListener('change', (e) => {
        slipAtRedline = (e.target as HTMLInputElement).checked;
        if (slipStartContainer) {
            slipStartContainer.style.display = slipAtRedline ? 'none' : 'block';
        }
        // Update slip start RPM to redline if checked
        if (slipAtRedline) {
            slipStartRPM = engine.limiter * 0.85;
            if (slipStartSlider) slipStartSlider.value = slipStartRPM.toString();
            if (valSlipStart) valSlipStart.textContent = Math.round(slipStartRPM).toString();
        }
    });
    
    // Slip start RPM slider
    slipStartSlider?.addEventListener('input', (e) => {
        slipStartRPM = parseFloat((e.target as HTMLInputElement).value);
        if (valSlipStart) valSlipStart.textContent = Math.round(slipStartRPM).toString();
    });
    
    // Initialize slip start container visibility
    if (slipStartContainer && slipAtRedlineCheckbox) {
        slipStartContainer.style.display = slipAtRedlineCheckbox.checked ? 'none' : 'block';
    }
};

/* Recording Setup */
function setupRecorder() {
    if (!vehicle.audio.ctx) {
        console.warn('Audio context not available for recording');
        return;
    }
    
    // Clean up old recorder if exists
    if (recorder && recorder.state !== 'inactive') {
        try {
            recorder.stop();
        } catch (e) {
            console.warn('Error stopping old recorder:', e);
        }
    }
    
    // Disconnect old recording destination if exists
    if (recordingDestination) {
        try {
            vehicle.audio.volume.disconnect(recordingDestination);
        } catch (e) {
            // Already disconnected, that's fine
        }
    }
    
    // Create a new destination node for recording
    // We can connect volume to multiple destinations (analyser AND recording)
    recordingDestination = vehicle.audio.ctx.createMediaStreamDestination();
    
    // Connect volume to recording destination (volume is already connected to analyser)
    // Multiple connections are allowed in Web Audio API
    vehicle.audio.volume.connect(recordingDestination);
    
    // Use high quality recording options
    const options: MediaRecorderOptions = {
        mimeType: 'audio/webm;codecs=opus', // Better quality
        audioBitsPerSecond: 128000 // 128 kbps
    };
    
    // Fallback to default if webm not supported
    if (!MediaRecorder.isTypeSupported(options.mimeType!)) {
        options.mimeType = 'audio/webm'; // Fallback
    }
    if (!MediaRecorder.isTypeSupported(options.mimeType!)) {
        delete options.mimeType; // Use browser default
    }
    
    recorder = new MediaRecorder(recordingDestination.stream, options);
    
    recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
            audioChunks.push(e.data);
        }
    };
    
    recorder.onerror = (e) => {
        console.error('MediaRecorder error:', e);
        statusDisplay.textContent = 'RECORDING ERROR // CHECK CONSOLE';
    };
    
    recorder.onstop = () => {
        if (audioChunks.length === 0) {
            console.warn('No audio data recorded');
            recStatus.classList.remove('rec-active');
            btnRecord.disabled = false;
            btnStop.disabled = true;
            statusDisplay.textContent = 'RECORDING FAILED // NO DATA';
            return;
        }
        
        const blob = new Blob(audioChunks, { type: recorder?.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `engine_export_${Date.now()}.${blob.type.includes('webm') ? 'webm' : 'wav'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        audioChunks = [];
        recStatus.classList.remove('rec-active');
        btnRecord.disabled = false;
        btnStop.disabled = true;
        statusDisplay.textContent = 'EXPORT COMPLETE // FILE DOWNLOADED';
    };
}

btnRecord?.addEventListener('click', () => {
    if (!loaded || !isEngineRunning) {
        statusDisplay.textContent = 'ENGINE MUST BE RUNNING // START ENGINE FIRST';
        return;
    }
    
    // Reinitialize recorder if needed
    if (!recorder || recorder.state === 'inactive') {
        setupRecorder();
    }
    
    if (!recorder) {
        statusDisplay.textContent = 'RECORDER INITIALIZATION FAILED // CHECK CONSOLE';
        return;
    }
    
    try {
        audioChunks = [];
        // Start recording with timeslice for better data collection
        recorder.start(100); // Collect data every 100ms
        recStatus.classList.add('rec-active');
        btnRecord.disabled = true;
        btnStop.disabled = false;
        statusDisplay.textContent = 'RECORDING // CAPTURING AUDIO';
    } catch (error) {
        console.error('Failed to start recording:', error);
        statusDisplay.textContent = 'RECORDING FAILED // CHECK CONSOLE';
    }
});

btnStop?.addEventListener('click', () => {
    if (!recorder) return;
    
    try {
        if (recorder.state === 'recording') {
            recorder.stop();
        } else if (recorder.state === 'inactive') {
            statusDisplay.textContent = 'NOT RECORDING // PRESS REC FIRST';
        }
    } catch (error) {
        console.error('Failed to stop recording:', error);
        statusDisplay.textContent = 'STOP FAILED // CHECK CONSOLE';
    }
});

/* Initialize gauges on page load (always visible, even when engine is off) */
initGauges();

/* Stop Engine Function - Immediately resets everything */
let isStopping = false;

function stopEngine() {
    if (!loaded || isStopping) return;
    
    isStopping = true;
    
    // IMMEDIATELY reset everything at once
    engine.throttle = 0;
    engine.rpm = 0;
    engine.omega = 0;
    engine.theta = 0;
    engine.alpha = 0;
    
    // Reset drivetrain to neutral
    drivetrain.gear = 0;
    drivetrain.omega = 0;
    drivetrain.theta = 0;
    
    // Stop all audio immediately
    if (vehicle.audio && vehicle.audio.samples) {
        for (const key in vehicle.audio.samples) {
            if (vehicle.audio.samples[key].gain) {
                vehicle.audio.samples[key].gain.gain.value = 0;
            }
        }
    }
    if (vehicle.audio && vehicle.audio.volume) {
        vehicle.audio.volume.gain.value = 0;
    }
    
    // Set engine as stopped
    isEngineRunning = false;
    isStopping = false;
    
    // Update UI immediately
    startBtn!.style.display = 'block';
    stopEngineBtn!.style.display = 'none';
    statusDisplay!.textContent = 'ENGINE STOPPED // SYSTEM READY';
    
    // Update video visualizer to off state (paused, dark)
    updateVideoVisualizer(0);
    
    // Update gauges to show 0 (bring needles to zero)
    if (speedMeter) {
        speedMeter.setValue(0);
    }
    if (rpmMeter) {
        rpmMeter.setValue(0);
    }
    
    // Update throttle display
    if (throttleSlider) throttleSlider.value = '0';
    if (throttleValue) throttleValue.textContent = '0.00';
    
    // Force immediate visual update
    requestAnimationFrame(() => {
        if (speedMeter) speedMeter.setValue(0);
        if (rpmMeter) rpmMeter.setValue(0);
    });
}

/* Initialization */
stopEngineBtn?.addEventListener('click', stopEngine);

// Unit Toggle Buttons
const tempUnitToggle = document.getElementById('temp-unit-toggle') as HTMLButtonElement;
const speedUnitToggle = document.getElementById('speed-unit-toggle') as HTMLButtonElement;

tempUnitToggle?.addEventListener('click', () => {
    useFahrenheit = !useFahrenheit;
    if (tempUnitToggle) {
        tempUnitToggle.textContent = useFahrenheit ? '°F' : '°C';
        tempUnitToggle.style.color = useFahrenheit ? '#ff9100' : '#00e5ff';
    }
    updateThermometerDisplay();
});

speedUnitToggle?.addEventListener('click', () => {
    useMPH = !useMPH;
    if (speedUnitToggle) {
        speedUnitToggle.textContent = useMPH ? 'MPH' : 'KM/H';
        speedUnitToggle.style.color = useMPH ? '#ff9100' : '#00e5ff';
    }
    // Reinitialize speed gauge with new units
    initGauges();
});

/* // Starter Sound System
function getStarterSoundForEngine(configName: string): string {
    // Map engines to appropriate starter sounds
    const configLower = configName.toLowerCase();
    
    if (configLower.includes('v12') || configLower.includes('ferr')) {
        return STARTER_SOUNDS.v12_scream;
    } else if (configLower.includes('merlin') || configLower.includes('spitfire')) {
        return STARTER_SOUNDS.merlin_v12;
    } else if (configLower.includes('volvo')) {
        return STARTER_SOUNDS.volvo;
    } else if (configLower.includes('ford') || configLower.includes('truck')) {
        return STARTER_SOUNDS.ford_ltl;
    } else if (configLower.includes('aston') || configLower.includes('martin')) {
        return STARTER_SOUNDS.auston_martin;
    }
    
    // Default generic starter
    return STARTER_SOUNDS.generic;
}

function playStarterSound(): Promise<void> {
    return new Promise((resolve) => {
        // Get appropriate starter sound for current engine
        const starterSoundPath = getStarterSoundForEngine(settings.activeConfig);
        
        // Create audio element
        starterAudio = new Audio(starterSoundPath);
        starterAudio.volume = 0.7;
        
        // When starter sound ends or reaches 2.5s, resolve
        const startTime = Date.now();
        const STARTER_DURATION = 2500; // 2.5 seconds
        
        const checkComplete = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= STARTER_DURATION) {
                if (starterAudio) {
                    starterAudio.pause();
                    starterAudio.currentTime = 0;
                }
                resolve();
            }
        };
        
        starterAudio.addEventListener('ended', () => {
            resolve();
        });
        
        starterAudio.addEventListener('error', (e) => {
            console.warn('Starter sound failed to load, continuing anyway:', e);
            resolve();
        });
        
        // Play starter sound
        starterAudio.play().catch((err) => {
            console.warn('Could not play starter sound:', err);
            resolve();
        });
        
        // Fallback: Force resolve after 2.5s
        setTimeout(checkComplete, STARTER_DURATION);
    });
} */

/* sync function start() {
    // Prevent starting if already running or starter is playing
    if (isEngineRunning) return;
    
    // Disable start button during startup
    if (startBtn) startBtn.disabled = true; */
    
    // Update status to show starting
    if (statusDisplay) statusDisplay.textContent = 'STARTING ENGINE...';
    
/*     // Play starter sound first (2.5 seconds)
    isStarterPlaying = true;
    await playStarterSound(); */
    
    // Try to load INI config first, fallback to TypeScript config
    const iniConfig = await loadINIConfig(settings.activeConfig);
    let configToUse = iniConfig;
    if (!configToUse) {
        // @ts-ignore
        configToUse = configurations[settings.activeConfig];
    }
    
    // Store config globally so initGauges can access it
    (window as any).currentEngineConfig = configToUse;
    
    await vehicle.init(configToUse as any);
    
    // Ensure engine is available before initializing gauges
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Initialize gauges after engine is loaded (this will read from config)
    initGauges();

    loaded = true;
    isEngineRunning = true;
    // isStarterPlaying = false;
    
    startBtn!.style.display = 'none';
    startBtn!.disabled = false;
    stopEngineBtn!.style.display = 'block';
    // Controls are always visible now - don't hide/show them
    statusDisplay!.textContent = 'ENGINE RUNNING // READY';
    
    updateVideoVisualizer(engine.rpm);
    
    // initGauges() is called above after vehicle.init()
    setupAdvancedControls();
    setupRecorder();
    
    // Update advanced control values
    const valIdle = document.getElementById('val-idle');
    const valLimiter = document.getElementById('val-limiter');
    const valSoftLimiter = document.getElementById('val-soft-limiter');
    const valInertia = document.getElementById('val-inertia');
    const valTorque = document.getElementById('val-torque');
    const valShiftTime = document.getElementById('val-shift-time');
    const valDamping = document.getElementById('val-damping');
    const valCompliance = document.getElementById('val-compliance');
    
    if (valIdle) valIdle.textContent = engine.idle.toString();
    if (valLimiter) valLimiter.textContent = engine.limiter.toString();
    if (valSoftLimiter) valSoftLimiter.textContent = engine.soft_limiter.toString();
    if (valInertia) valInertia.textContent = engine.inertia.toFixed(1);
    if (valTorque) valTorque.textContent = engine.torque.toString();
    if (valShiftTime) valShiftTime.textContent = drivetrain.shiftTime.toString();
    if (valDamping) valDamping.textContent = drivetrain.damping.toString();
    if (valCompliance) valCompliance.textContent = drivetrain.compliance.toFixed(2);
    
    // Update RPM sliders with engine values
    if (rpmStartSlider) {
        rpmStartSlider.value = '0';
        if (valRpmStart) valRpmStart.textContent = '0';
    }
    if (rpmEndSlider) {
        const maxRPM = engine.limiter || 9000;
        rpmEndSlider.value = maxRPM.toString();
        if (valRpmEnd) valRpmEnd.textContent = maxRPM.toString();
    }
    
    const sliderIdle = document.getElementById('slider-idle') as HTMLInputElement;
    const sliderLimiter = document.getElementById('slider-limiter') as HTMLInputElement;
    const sliderSoftLimiter = document.getElementById('slider-soft-limiter') as HTMLInputElement;
    const sliderInertia = document.getElementById('slider-inertia') as HTMLInputElement;
    const sliderTorque = document.getElementById('slider-torque') as HTMLInputElement;
    const sliderShiftTime = document.getElementById('slider-shift-time') as HTMLInputElement;
    const sliderDamping = document.getElementById('slider-damping') as HTMLInputElement;
    const sliderCompliance = document.getElementById('slider-compliance') as HTMLInputElement;
    
    if (sliderIdle) sliderIdle.value = engine.idle.toString();
    if (sliderLimiter) sliderLimiter.value = engine.limiter.toString();
    if (sliderSoftLimiter) sliderSoftLimiter.value = engine.soft_limiter.toString();
    if (sliderInertia) sliderInertia.value = engine.inertia.toString();
    if (sliderTorque) sliderTorque.value = engine.torque.toString();
    if (sliderShiftTime) sliderShiftTime.value = drivetrain.shiftTime.toString();
    if (sliderDamping) sliderDamping.value = drivetrain.damping.toString();
    if (sliderCompliance) sliderCompliance.value = drivetrain.compliance.toString();
    
    // Initialize slip start RPM to redline
    slipStartRPM = engine.limiter * 0.85;
    if (slipStartSlider) {
        slipStartSlider.value = Math.round(slipStartRPM).toString();
        slipStartSlider.max = engine.limiter.toString();
    }
    if (valSlipStart) valSlipStart.textContent = Math.round(slipStartRPM).toString();
    if (slipAtRedlineCheckbox) slipAtRedline = slipAtRedlineCheckbox.checked;
    
/* Waveform Canvas Setup with Drag/Pan/Zoom */
let canvasCtx: CanvasRenderingContext2D | null = null;
let waveformPanX = 0;
let waveformPanY = 0;
let waveformZoom = 1.0;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let waveformData: Uint8Array | null = null;

if (waveformCanvas) {
    canvasCtx = waveformCanvas.getContext('2d');
    if (canvasCtx) {
        canvasCtx.fillStyle = '#66fcf1';
        canvasCtx.strokeStyle = '#66fcf1';
        canvasCtx.lineWidth = 2;
    }
    
    // Mouse drag for panning
    waveformCanvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        waveformCanvas.style.cursor = 'grabbing';
    });
    
    waveformCanvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const dx = e.clientX - lastMouseX;
            const dy = e.clientY - lastMouseY;
            
            // Pan with bounds checking
            const maxPanX = waveformCanvas.width * (waveformZoom - 1);
            const maxPanY = waveformCanvas.height * (waveformZoom - 1);
            
            waveformPanX = Math.max(-maxPanX, Math.min(maxPanX, waveformPanX + dx));
            waveformPanY = Math.max(-maxPanY, Math.min(maxPanY, waveformPanY + dy));
            
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        }
    });
    
    waveformCanvas.addEventListener('mouseup', () => {
        isDragging = false;
        waveformCanvas.style.cursor = 'grab';
    });
    
    waveformCanvas.addEventListener('mouseleave', () => {
        isDragging = false;
        waveformCanvas.style.cursor = 'grab';
    });
    
    // Mouse wheel for zooming
    waveformCanvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(1.0, Math.min(5.0, waveformZoom * zoomFactor));
        
        // Adjust pan to keep center point stable
        const zoomChange = newZoom / waveformZoom;
        const rect = waveformCanvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        waveformPanX = mouseX - (mouseX - waveformPanX) * zoomChange;
        waveformPanY = mouseY - (mouseY - waveformPanY) * zoomChange;
        
        waveformZoom = newZoom;
        
        // Clamp pan after zoom
        const maxPanX = waveformCanvas.width * (waveformZoom - 1);
        const maxPanY = waveformCanvas.height * (waveformZoom - 1);
        waveformPanX = Math.max(-maxPanX, Math.min(maxPanX, waveformPanX));
        waveformPanY = Math.max(-maxPanY, Math.min(maxPanY, waveformPanY));
    });
    
    // Touch support for mobile
    waveformCanvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            lastMouseX = e.touches[0].clientX;
            lastMouseY = e.touches[0].clientY;
        }
    });
    
    waveformCanvas.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1) {
            e.preventDefault();
            const dx = e.touches[0].clientX - lastMouseX;
            const dy = e.touches[0].clientY - lastMouseY;
            
            const maxPanX = waveformCanvas.width * (waveformZoom - 1);
            const maxPanY = waveformCanvas.height * (waveformZoom - 1);
            
            waveformPanX = Math.max(-maxPanX, Math.min(maxPanX, waveformPanX + dx));
            waveformPanY = Math.max(-maxPanY, Math.min(maxPanY, waveformPanY + dy));
            
            lastMouseX = e.touches[0].clientX;
            lastMouseY = e.touches[0].clientY;
        }
    });
    
    waveformCanvas.addEventListener('touchend', () => {
        isDragging = false;
    });
}

/* Calculate Speed */
function calculateSpeed(): number {
    if (drivetrain.gear === 0) return 0;
    const wheelRadius = 0.250; // meters
    const gearRatio = drivetrain.getTotalGearRatio();
    const wheelRPM = engine.rpm / gearRatio;
    const speedMs = (wheelRPM / 60) * 2 * Math.PI * wheelRadius;
    const speedKmh = speedMs * 3.6;
    
    // Convert to MPH if that unit is selected
    return useMPH ? speedKmh * 0.621371 : speedKmh;
}

/* Get Video Path for Engine Type */
function getVideoPathForEngine(engineType: string): string {
    const videoMap: Record<string, string> = {
        'v2': './assets/Engines/V/V2.mp4',
        'v4': './assets/Engines/V/V4.mp4',
        'v6': './assets/Engines/V/V6.mp4',
        'v8': './assets/Engines/V/V8.mp4',
        'v10': './assets/Engines/V/V10.mp4',
        'v12': './assets/Engines/V/v12.mp4', // File is lowercase v12.mp4
        'v16': './assets/Engines/V/V16.mp4'
    };
    return videoMap[engineType.toLowerCase()] || './assets/Engines/V/V8.mp4';
}

/* Process video frame to canvas with black transparency */
function processVideoFrame() {
    const engineVideo = document.getElementById('engine-video') as HTMLVideoElement;
    if (!engineVideo || !engineVideoCanvas || engineVideo.videoWidth === 0) return;
    
    const ctx = engineVideoCanvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    // Clear canvas completely to ensure no residual black
    ctx.clearRect(0, 0, engineVideoCanvas.width, engineVideoCanvas.height);
    
    // Draw video frame to canvas
    ctx.drawImage(engineVideo, 0, 0, engineVideoCanvas.width, engineVideoCanvas.height);
    
    // Get image data to process pixels for black transparency
    const imageData = ctx.getImageData(0, 0, engineVideoCanvas.width, engineVideoCanvas.height);
    const data = imageData.data;
    
    // Make black pixels fully transparent with smoother gradient
    const blackThreshold = 50; // Higher threshold to catch more dark pixels
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate luminance (brightness) of the pixel
        const luminance = (r + g + b) / 3;
        
        // If pixel is close to black, make it transparent
        // Use gradient transparency for smoother edges
        if (luminance < blackThreshold) {
            // Fully transparent for very dark pixels
            data[i + 3] = 0;
        } else if (luminance < blackThreshold + 20) {
            // Gradient transparency for edge smoothing
            const alpha = ((luminance - blackThreshold) / 20) * 255;
            data[i + 3] = Math.min(data[i + 3], alpha);
        }
    }
    
    // Put processed image data back to canvas
    ctx.putImageData(imageData, 0, 0);
}

/* Update Video Visualizer (like Torque) */
function updateVideoVisualizer(rpm: number) {
    const gifContainer = document.getElementById('gif-container') as HTMLDivElement;
    const engineVideo = document.getElementById('engine-video') as HTMLVideoElement;
    const engineStatus = document.getElementById('engine-status') as HTMLDivElement;
    
    if (!gifContainer || !engineVideo) {
        console.error('Video elements not found:', { gifContainer: !!gifContainer, engineVideo: !!engineVideo });
        return;
    }
    
    // Calculate RPM normalized for effects
    const rpmNormalized = Math.max(0, Math.min(1, (rpm - engine.idle) / (engine.limiter - engine.idle)));
    const isInRedZone = rpm >= engine.limiter * 0.85;
    const isNearTopSpeed = rpm >= engine.limiter * 0.9;
    
    // Engine is actively running when RPM is significantly above idle (with hysteresis to prevent flickering)
    const isEngineActivelyRunning = isEngineRunning && rpm > (engine.idle - 100);

    if (isEngineActivelyRunning) {
        // Ensure container visible
        gifContainer.style.opacity = '1';
        gifContainer.style.display = 'flex';
        gifContainer.style.visibility = 'visible';
        
        // Color tints and effects based on engine state
        let filter = '';
        let transform = '';
        
        if (isNearTopSpeed) {
            // TOP SPEED - Strong red tint
            const redIntensity = 0.9;
            filter = `brightness(1.3) contrast(1.4) sepia(${redIntensity}) saturate(3.5) hue-rotate(-20deg)`;
            const shakeX = (Math.random() - 0.5) * 6;
            const shakeY = (Math.random() - 0.5) * 6;
            const wobble = Math.sin(Date.now() / 45) * 4;
            transform = `translate(${shakeX}px, ${shakeY}px) rotate(${wobble}deg)`;
        } else if (isInRedZone) {
            // In red zone - Strong red tint
            filter = `brightness(1.2) contrast(1.3) sepia(0.6) saturate(2.5) hue-rotate(-15deg)`;
            const shakeX = (Math.random() - 0.5) * 4;
            const shakeY = (Math.random() - 0.5) * 4;
            const wobble = Math.sin(Date.now() / 50) * 3;
            transform = `translate(${shakeX}px, ${shakeY}px) rotate(${wobble}deg)`;
        } else if (rpm > engine.idle + 500) {
            // Engine running - Green tint with RPM-based wobble
            filter = `brightness(1.1) contrast(1.2) sepia(0.3) saturate(1.5) hue-rotate(60deg)`;
            const wobbleIntensity = rpmNormalized * 2;
            const wobbleSpeed = 250 - (rpmNormalized * 150);
            const wobble = Math.sin(Date.now() / wobbleSpeed) * wobbleIntensity;
            transform = `rotate(${wobble}deg)`;
        } else {
            // Low RPM running - Normal with slight green tint
            filter = `brightness(1.05) contrast(1.1) sepia(0.2) saturate(1.3) hue-rotate(40deg)`;
            transform = 'none';
        }
        
        // Apply effects to canvas transform (not video directly to avoid flicker)
        if (engineVideoCanvas) {
            engineVideoCanvas.style.filter = filter;
            engineVideoCanvas.style.transform = transform;
        }
        
        // Hide raw video element - only show processed canvas to prevent black flicker
        engineVideo.style.display = 'none';
        engineVideo.style.visibility = 'hidden';
        
        // Show logo blurred and behind video when engine is running
        const engineLogo = document.getElementById('engine-logo') as HTMLImageElement;
        if (engineLogo) {
            engineLogo.style.display = 'block';
            engineLogo.style.opacity = '0.3';
            engineLogo.style.filter = 'blur(8px) brightness(0.5)';
            engineLogo.style.zIndex = '1'; // Behind video
        }
        
        // Display canvas for black transparency processing
        if (engineVideoCanvas) {
            engineVideoCanvas.style.display = 'block';
            engineVideoCanvas.style.zIndex = '3';
            processVideoFrame();
        }

        // Synchronize video playback speed with RPM - with smooth transitions
        const targetPlaybackRate = Math.max(0.25, Math.min(3.0, rpmNormalized * 2.5)); // 0.25 to 3x speed
        
        // Smooth the playback rate transition to avoid jerkiness
        const smoothingFactor = 0.15; // Lower = smoother but slower response
        const smoothedPlaybackRate = previousPlaybackRate + (targetPlaybackRate - previousPlaybackRate) * smoothingFactor;
        previousPlaybackRate = smoothedPlaybackRate;
        
        engineVideo.playbackRate = smoothedPlaybackRate;
        
        // Ensure video is playing
        if (engineVideo.paused) {
            engineVideo.play().catch(err => console.warn('Video play failed:', err));
        }

        if (engineStatus) {
            engineStatus.textContent = 'Engine Running';
        }
    } else {
        // Engine OFF - show logo clearly behind, and paused video frame (darkened) on top
        engineVideo.pause();
        engineVideo.currentTime = 0;
        
        // Show logo clearly when engine is off (behind video)
        const engineLogo = document.getElementById('engine-logo') as HTMLImageElement;
        if (engineLogo) {
            engineLogo.style.display = 'block';
            engineLogo.style.opacity = '0.6';
            engineLogo.style.filter = 'brightness(0.8) contrast(0.9)';
            engineLogo.style.zIndex = '1'; // Behind video
        }
        
        // Show paused video darkened - hide raw video, show canvas only
        gifContainer.style.opacity = '0.6';
        gifContainer.style.display = 'flex';
        gifContainer.style.visibility = 'visible';
        
        // Hide raw video element
        engineVideo.style.display = 'none';
        engineVideo.style.visibility = 'hidden';

        // Show canvas with first frame (darkened)
        if (engineVideoCanvas) {
            engineVideoCanvas.style.display = 'block';
            engineVideoCanvas.style.filter = 'brightness(0.2) contrast(0.5) saturate(0.3)';
            engineVideoCanvas.style.transform = 'none';
            processVideoFrame();
        }

        if (engineStatus) {
            engineStatus.textContent = 'Engine Off';
        }
    }
}

/* Update loop */
/* Update loop */
let 
    lastTime = (new Date()).getTime(),
    currentTime = 0,
    dt = 0;
    
function update(time: DOMHighResTimeStamp): void {

    requestAnimationFrame(time => {
        update(time);
    });
    
    currentTime = (new Date()).getTime();
    dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    if (dt === 0) {
        return;
    }

    if (!loaded) {
        return;
    }

    // Note: stopEngine() now immediately resets everything, so isStopping is no longer needed
    // But we keep this check for safety
    if (isStopping) {
        // This should not happen anymore since stopEngine() resets immediately
        // But if it does, ensure everything is stopped
        if (!isEngineRunning) {
            isStopping = false;
        }
    }
    
    // If engine is stopped, keep everything at 0
    if (!isEngineRunning && !isStopping) {
        if (speedMeter) speedMeter.setValue(0);
        if (rpmMeter) rpmMeter.setValue(0);
        updateVideoVisualizer(0);
        return;
    }

    // Update visual gauges (always visible, even when off)
    if (speedMeter) {
        const speed = calculateSpeed();
        speedMeter.setValue(speed);
    }
    
    if (rpmMeter) {
        // Governor logic: Clamp RPM based on governor state
        let displayRPM = engine.rpm;
        
        if (governorEnabled) {
            // Governor ON: Enforce redline limit (85% of limiter)
            const redlineRPM = engine.limiter * 0.85;
            displayRPM = Math.min(engine.rpm, redlineRPM);
        }
        // Governor OFF: Show actual RPM (can exceed redline)
        
        rpmMeter.setValue(displayRPM);
    }
    
    // Update gear display with arrow indicator
    const gearDisplay = document.getElementById('gear-value') as HTMLDivElement;
    const gearArrow = document.getElementById('gear-arrow') as HTMLDivElement;
    if (gearDisplay) {
        const currentGear = drivetrain.gear;
        if (currentGear === 0) {
            gearDisplay.textContent = 'N';
            if (gearArrow) gearArrow.textContent = '→';
        } else if (currentGear > 0) {
            gearDisplay.textContent = currentGear.toString();
            if (gearArrow) gearArrow.textContent = '→';
        } else {
            gearDisplay.textContent = 'R';
            if (gearArrow) gearArrow.textContent = '←';
        }
    }
    
    // Calculate current slip start RPM (redline if checked, custom if not)
    const currentSlipStartRPM = slipAtRedline ? (engine.limiter * 0.85) : slipStartRPM;
    
    // Throttle slip/oscillation when at or above slip start RPM
    if (isEngineRunning && engine.rpm >= currentSlipStartRPM) {
        // Apply throttle oscillation/slip
        const slipIntensity = Math.min(1.0, (engine.rpm - currentSlipStartRPM) / (engine.limiter - currentSlipStartRPM));
        const oscillation = Math.sin(Date.now() / 100) * slipIntensity * 0.15; // Oscillate throttle
        engine.throttle = clamp(engine.throttle + oscillation, 0, 1);
        
        // Also oscillate RPM slightly for visual effect
        const rpmOscillation = Math.sin(Date.now() / 80) * slipIntensity * 50;
        engine.rpm = clamp(engine.rpm + rpmOscillation * dt, engine.idle, engine.limiter);
    }
    
    // Update video visualizer
    updateVideoVisualizer(engine.rpm);
    
    // Update thermometer display based on real engine activity
    if (isEngineRunning) {
        lastEngineRunTime = Date.now();
        
        // Gradually warm up to operating temperature first
        if (engineTemp < OPERATING_TEMP) {
            engineTemp += 15 * dt; // Fast warm-up to operating temp
        } else {
            // Heat increases with RPM and throttle once at operating temp
            const rpmFactor = (engine.rpm - engine.idle) / (engine.limiter - engine.idle);
            const throttleFactor = engine.throttle;
            const heatGeneration = (rpmFactor * 0.5 + throttleFactor * 0.5) * 150 * dt; // Up to 150°C/sec above operating
            
            // Cooling factor (more cooling at lower temps)
            const coolingFactor = Math.max(0.3, (engineTemp - OPERATING_TEMP) / 200);
            const heatDissipation = coolingFactor * 25 * dt; // Base cooling rate
            
            engineTemp += heatGeneration - heatDissipation;
        }
        
        // Apply overheat consequences if allowed
        if (allowOverheat && engineTemp >= 230) {
            thermalDamage += dt * 10; // 10% damage per second when overheating
            
            // Engine seizure at critical temp
            if (engineTemp >= 280 && !isEngineSeized) {
                isEngineSeized = true;
                console.warn('⚠️ ENGINE SEIZED - CATASTROPHIC FAILURE!');
            }
        } else {
            // Slowly recover thermal damage when not overheating
            thermalDamage = Math.max(0, thermalDamage - dt * 2);
        }
        
        // Clamp temperature
        engineTemp = clamp(engineTemp, OPERATING_TEMP, allowOverheat ? 300 : 230);
    } else {
        // Engine off - cool down based on time since last run
        const timeSinceRun = (Date.now() - lastEngineRunTime) / 1000; // seconds
        
        if (timeSinceRun < 60) {
            // Recent run (< 1 min) - slow cooling, heat soaks
            engineTemp = Math.max(OPERATING_TEMP, engineTemp - 8 * dt);
        } else if (timeSinceRun < 300) {
            // Moderate time (1-5 min) - normal cooling
            engineTemp = Math.max(ROOM_TEMP + 20, engineTemp - 20 * dt);
        } else if (timeSinceRun < 1800) {
            // Long time (5-30 min) - faster cooling to ambient
            engineTemp = Math.max(ROOM_TEMP, engineTemp - 40 * dt);
        } else {
            // Very long time (30+ min) - at room temperature
            engineTemp = ROOM_TEMP;
        }
        
        thermalDamage = Math.max(0, thermalDamage - dt * 5); // Faster recovery when off
    }
    
    // Update thermometer display
    updateThermometerDisplay();
    
    // Continuously process video frames to canvas with black transparency
    processVideoFrame();

    // Update throttle display
    if (throttleValue) {
        throttleValue.textContent = engine.throttle.toFixed(2);
    }
    
    if (throttleSlider) {
        throttleSlider.value = engine.throttle.toString();
    }

    if (drivetrain.downShift) {
        engine.throttle = 0.8; // Rev matching
    } else {
        // W = Accelerate (throttle up)
        if (keys['KeyW']) {
            engine.throttle = clamp(engine.throttle += 0.2, 0, 1);
        }
        // S = Decelerate (throttle down - same as letting off gas but faster)
        else if (keys['KeyS']) {
            engine.throttle = clamp(engine.throttle -= 0.2, 0, 1);
        }
        // No input - natural deceleration
        else {
            engine.throttle = clamp(engine.throttle -= 0.1, 0, 1);
        }
    }

    // Only update vehicle/audio if engine is running (prevents sound from continuing)
    if (isEngineRunning) {
        // S key deceleration - apply original B key braking logic (slows to idle/halt)
        if (keys['KeyS']) {
            drivetrain.omega -= 0.3; // Brakes - same as original B key logic
        }
    
        vehicle.update(time, dt);
        
        // Spacebar = Brake (strong braking)
        if (keys['Space']) {
            // Apply strong braking - slow down engine RPM directly
            if (engine.rpm > engine.idle) {
                // Stronger braking force - reduce RPM more aggressively
                const brakeForce = 3.0 * dt; // Strong braking
                engine.omega = Math.max(engine.omega - brakeForce, (2 * Math.PI * engine.idle) / 60);
                engine.rpm = (60 * engine.omega) / (2 * Math.PI);
            }
            // Also apply drivetrain braking
            if (drivetrain.omega > 0) {
                const brakeForce = 3.0 * dt; // Strong braking
                drivetrain.omega = Math.max(drivetrain.omega - brakeForce, 0);
            }
            // Reduce throttle when braking
            if (engine.throttle > 0) {
                engine.throttle = Math.max(engine.throttle - 0.5 * dt, 0);
            }
        }
    } else {
        // When stopped, ensure all audio is off
        if (vehicle.audio && vehicle.audio.samples) {
            for (const key in vehicle.audio.samples) {
                if (vehicle.audio.samples[key].gain) {
                    vehicle.audio.samples[key].gain.gain.value = 0;
                }
            }
        }
    }
    
    // Real audio waveform visualization with pan/zoom (like Torque)
    if (canvasCtx && vehicle.audio.analyser && isEngineRunning) {
        const width = waveformCanvas.width = waveformCanvas.offsetWidth;
        const height = waveformCanvas.height = waveformCanvas.offsetHeight;
        
        // Get real audio data from analyser
        const bufferLength = vehicle.audio.analyser.frequencyBinCount;
        const localBuffer = new Uint8Array(bufferLength);
        vehicle.audio.analyser.getByteTimeDomainData(localBuffer);
        waveformData = localBuffer;
        
        // Clear canvas
        canvasCtx.clearRect(0, 0, width, height);
        
        // Draw center line (always visible, not affected by zoom/pan)
        canvasCtx.strokeStyle = "rgba(102, 252, 241, 0.3)";
        canvasCtx.lineWidth = 1;
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, height / 2);
        canvasCtx.lineTo(width, height / 2);
        canvasCtx.stroke();
        
        // Apply zoom and pan transform
        canvasCtx.save();
        canvasCtx.translate(-waveformPanX, -waveformPanY);
        canvasCtx.scale(waveformZoom, waveformZoom);
        
        // Draw waveform
        canvasCtx.beginPath();
        canvasCtx.lineJoin = "round";
        canvasCtx.lineWidth = Math.max(1, 2 / waveformZoom); // Scale line width with zoom, min 1px
        canvasCtx.strokeStyle = "#66fcf1";
        
        const sliceWidth = width / bufferLength;
        const centerY = height / 2;
        let x = 0;
        
        canvasCtx.moveTo(0, centerY);
        
        for (let i = 0; i < bufferLength; i++) {
            const v = waveformData[i] / 128.0;
            const y = centerY + (v - 1.0) * centerY;
            
            canvasCtx.lineTo(x, y);
            x += sliceWidth;
        }
        
        canvasCtx.stroke();
        canvasCtx.restore();
    } else if (canvasCtx && waveformCanvas) {
        // Clear canvas when engine is off
        const width = waveformCanvas.width = waveformCanvas.offsetWidth;
        const height = waveformCanvas.height = waveformCanvas.offsetHeight;
        canvasCtx.clearRect(0, 0, width, height);
        
        // Draw center line
        canvasCtx.strokeStyle = "rgba(102, 252, 241, 0.2)";
        canvasCtx.lineWidth = 1;
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, height / 2);
        canvasCtx.lineTo(width, height / 2);
        canvasCtx.stroke();
    }
}

// Export/Import INI Configuration Functions
function exportConfigToINI() {
    const configName = settings.activeConfig || 'custom';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `${configName}_${timestamp}.ini`;
    
    // Build INI content from current engine and drivetrain state
    let iniContent = `[Engine]\n`;
    iniContent += `TYPE=${configName}\n`;
    iniContent += `VIDEO_PATH=${ENGINE_VIDEO_PATH || getVideoPathForEngine(configName)}\n`;
    iniContent += `IDLE=${engine.idle}\n`;
    iniContent += `LIMITER=${engine.limiter}\n`;
    iniContent += `SOFT_LIMITER=${engine.soft_limiter}\n`;
    iniContent += `LIMITER_MS=${engine.limiter_ms || 0}\n`;
    iniContent += `INERTIA=${engine.inertia}\n`;
    iniContent += `TORQUE=${engine.torque}\n`;
    iniContent += `ENGINE_BRAKING=${engine.engine_braking || 200}\n`;
    iniContent += `\n[Drivetrain]\n`;
    iniContent += `SHIFT_TIME=${drivetrain.shiftTime}\n`;
    iniContent += `DAMPING=${drivetrain.damping}\n`;
    iniContent += `COMPLIANCE=${drivetrain.compliance || 0.01}\n`;
    iniContent += `FINAL_DRIVE=${drivetrain.final_drive || 3.44}\n`;
    if (drivetrain.gears && drivetrain.gears.length > 0) {
        iniContent += `GEARS=${drivetrain.gears.join(',')}\n`;
    }
    
    // Add gauges if available
    if ((window as any).currentEngineConfig?.gauges) {
        const gauges = (window as any).currentEngineConfig.gauges;
        iniContent += `\n[Gauges]\n`;
        if (gauges.max_speed_kmh || gauges.MAX_SPEED_KMH) {
            iniContent += `MAX_SPEED_KMH=${gauges.max_speed_kmh || gauges.MAX_SPEED_KMH}\n`;
        }
        if (gauges.max_speed_mph || gauges.MAX_SPEED_MPH) {
            iniContent += `MAX_SPEED_MPH=${gauges.max_speed_mph || gauges.MAX_SPEED_MPH}\n`;
        }
        if (gauges.rpm_start || gauges.RPM_START) {
            iniContent += `RPM_START=${gauges.rpm_start || gauges.RPM_START}\n`;
        }
        if (gauges.rpm_end || gauges.RPM_END) {
            iniContent += `RPM_END=${gauges.rpm_end || gauges.RPM_END}\n`;
        }
    }
    
    // Add sounds if available
    if ((window as any).currentEngineConfig?.sounds) {
        const sounds = (window as any).currentEngineConfig.sounds;
        iniContent += `\n[Sounds]\n`;
        if (sounds.on_high) {
            if (sounds.on_high.source) iniContent += `ON_HIGH_SOURCE=${sounds.on_high.source}\n`;
            if (sounds.on_high.rpm !== undefined) iniContent += `ON_HIGH_RPM=${sounds.on_high.rpm}\n`;
            if (sounds.on_high.volume !== undefined) iniContent += `ON_HIGH_VOLUME=${sounds.on_high.volume}\n`;
        }
        if (sounds.on_low) {
            if (sounds.on_low.source) iniContent += `ON_LOW_SOURCE=${sounds.on_low.source}\n`;
            if (sounds.on_low.rpm !== undefined) iniContent += `ON_LOW_RPM=${sounds.on_low.rpm}\n`;
            if (sounds.on_low.volume !== undefined) iniContent += `ON_LOW_VOLUME=${sounds.on_low.volume}\n`;
        }
        if (sounds.off_high) {
            if (sounds.off_high.source) iniContent += `OFF_HIGH_SOURCE=${sounds.off_high.source}\n`;
            if (sounds.off_high.rpm !== undefined) iniContent += `OFF_HIGH_RPM=${sounds.off_high.rpm}\n`;
            if (sounds.off_high.volume !== undefined) iniContent += `OFF_HIGH_VOLUME=${sounds.off_high.volume}\n`;
        }
        if (sounds.off_low) {
            if (sounds.off_low.source) iniContent += `OFF_LOW_SOURCE=${sounds.off_low.source}\n`;
            if (sounds.off_low.rpm !== undefined) iniContent += `OFF_LOW_RPM=${sounds.off_low.rpm}\n`;
            if (sounds.off_low.volume !== undefined) iniContent += `OFF_LOW_VOLUME=${sounds.off_low.volume}\n`;
        }
        if (sounds.limiter) {
            if (sounds.limiter.source) iniContent += `LIMITER_SOURCE=${sounds.limiter.source}\n`;
            if (sounds.limiter.rpm !== undefined) iniContent += `LIMITER_RPM=${sounds.limiter.rpm}\n`;
            if (sounds.limiter.volume !== undefined) iniContent += `LIMITER_VOLUME=${sounds.limiter.volume}\n`;
        }
    }
    
    // Download file
    const blob = new Blob([iniContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Exported configuration to:', filename);
}

async function importConfigFromINI(file: File) {
    try {
        const text = await file.text();
        const configName = file.name.replace('.ini', '').replace(/[^a-zA-Z0-9_]/g, '_');
        
        // Parse the INI file
        const config = await parseINIText(text, configName);
        
        // Store as custom engine in localStorage
        const customEngines = loadCustomEngines();
        const existingIndex = customEngines.findIndex(e => e.value === configName);
        
        const customEngine = {
            value: configName,
            name: config.engine?.name || configName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            engineName: config.engine?.name || configName,
            description: `Custom imported configuration: ${file.name}`,
            category: 'custom',
            videoPath: (config.engine as any)?.video_path || getVideoPathForEngine(config.engine?.type || 'v8')
        };
        
        if (existingIndex >= 0) {
            customEngines[existingIndex] = customEngine;
        } else {
            customEngines.push(customEngine);
        }
        
        // Store config data separately
        const customConfigs = JSON.parse(localStorage.getItem('torque_custom_configs') || '{}');
        customConfigs[configName] = config;
        localStorage.setItem('torque_custom_configs', JSON.stringify(customConfigs));
        
        // Store engine list
        localStorage.setItem('torque_custom_engines', JSON.stringify(customEngines));
        
        // Reload modal to show new custom engine
        await populateEngineModal();
        
        // Select the imported engine
        await selectEngine(configName);
        
        console.log('Imported configuration:', configName);
        alert(`Configuration imported successfully! "${customEngine.name}" is now available in the engine selection modal.`);
    } catch (error) {
        console.error('Error importing INI file:', error);
        alert('Error importing INI file. Please check the file format.');
    }
}

function parseINIText(iniText: string, engineType: string): Promise<any> {
    return new Promise((resolve) => {
        const config: any = {
            engine: {},
            drivetrain: {},
            sounds: {},
            gauges: {}
        };
        
        const lines = iniText.split('\n');
        let currentSection = '';
        
        for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith(';') || line.startsWith('#')) continue;
            
            if (line.startsWith('[') && line.endsWith(']')) {
                currentSection = line.slice(1, -1).toLowerCase();
                continue;
            }
            
            const [key, value] = line.split('=').map(s => s.trim());
            if (!key || !value) continue;
            
            let parsedValue: any = value;
            if (value === 'true') parsedValue = true;
            else if (value === 'false') parsedValue = false;
            else {
                const num = parseFloat(value);
                if (!Number.isNaN(num) && value !== '') parsedValue = num;
            }
            
            if (currentSection === 'engine') {
                const keyLower = key.toLowerCase();
                if (keyLower === 'idle') config.engine.idle = parsedValue;
                else if (keyLower === 'limiter') config.engine.limiter = parsedValue;
                else if (keyLower === 'soft_limiter') config.engine.soft_limiter = parsedValue;
                else if (keyLower === 'limiter_ms') config.engine.limiter_ms = parsedValue;
                else if (keyLower === 'inertia') config.engine.inertia = parsedValue;
                else if (keyLower === 'torque') config.engine.torque = parsedValue;
                else if (keyLower === 'engine_braking') config.engine.engine_braking = parsedValue;
                else if (keyLower === 'type') config.engine.type = parsedValue;
                else if (keyLower === 'video_path') (config.engine as any).video_path = parsedValue;
            } else if (currentSection === 'drivetrain') {
                const keyLower = key.toLowerCase();
                if (keyLower === 'shift_time') config.drivetrain.shiftTime = parsedValue;
                else if (keyLower === 'damping') config.drivetrain.damping = parsedValue;
                else if (keyLower === 'compliance') config.drivetrain.compliance = parsedValue;
                else if (keyLower === 'final_drive') config.drivetrain.final_drive = parsedValue;
                else if (keyLower === 'gears' || keyLower === 'gear_ratios') {
                    const gearArray = value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
                    if (gearArray.length > 0) config.drivetrain.gears = gearArray;
                }
            } else if (currentSection === 'gauges') {
                if (!config.gauges) config.gauges = {};
                const keyLower = key.toLowerCase();
                config.gauges[key] = parsedValue;
                config.gauges[keyLower] = parsedValue;
            } else if (currentSection === 'sounds') {
                const keyLower = key.toLowerCase();
                let soundType: string | null = null;
                let prop: string | null = null;
                
                if (keyLower.startsWith('on_high_')) {
                    soundType = 'on_high';
                    prop = keyLower.replace('on_high_', '');
                } else if (keyLower.startsWith('on_low_')) {
                    soundType = 'on_low';
                    prop = keyLower.replace('on_low_', '');
                } else if (keyLower.startsWith('off_high_')) {
                    soundType = 'off_high';
                    prop = keyLower.replace('off_high_', '');
                } else if (keyLower.startsWith('off_low_')) {
                    soundType = 'off_low';
                    prop = keyLower.replace('off_low_', '');
                } else if (keyLower.startsWith('limiter_')) {
                    soundType = 'limiter';
                    prop = keyLower.replace('limiter_', '');
                }
                
                if (soundType && prop) {
                    if (!config.sounds[soundType]) config.sounds[soundType] = {};
                    if (prop === 'source') config.sounds[soundType].source = parsedValue;
                    else if (prop === 'rpm') config.sounds[soundType].rpm = parsedValue;
                    else if (prop === 'volume') config.sounds[soundType].volume = parsedValue;
                }
            }
        }
        
        resolve(config);
    });
}

function loadCustomEngines(): any[] {
    try {
        return JSON.parse(localStorage.getItem('torque_custom_engines') || '[]');
    } catch (error) {
        console.error('Error loading custom engines:', error);
        return [];
    }
}

// selectEngine function already handles custom engines via localStorage check

update(10);

/**
 * End of Torque.JS V3 Main Module
 * Maker's Mark: TQJS-V3-MAIN-END-2025-IWI
 * © 2025 Iron Will Interactive. All rights reserved.
 */
