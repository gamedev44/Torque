/**
 * Torque.JS: Engine Configuration Definitions
 * 
 * @license Semi-Open Source with Attribution
 * Copyright (c) 2025 Iron Will Interactive
 * Developed by: Asterisk
 * 
 * This module contains default engine configurations for all supported engines.
 * See LICENSE file for full license terms and attribution requirements.
 * 
 * Maker's Mark: TQJS-V3-CONFIG-2025-IWI
 */

import { Drivetrain } from "./Drivetrain"
import { Engine } from "./Engine"

type SoundKey = 'on_low' 
    | 'off_low'
    | 'on_high'
    | 'off_high'
    | 'limiter'
    // | 'tranny_on'    // optional
    // | 'tranny_off'   // optional

export type EngineConfiguration = {
    engine: Partial<Engine>
    drivetrain: Partial<Drivetrain>,
    sounds: Record<SoundKey, {
        source: string,
        rpm: number,
        volume?: number
    }>
}

const _transmission = {
    tranny_on: {
        source: './audio/trany_power_high.wav',
        rpm: 0,
        volume: 0.4
    },
    tranny_off: {
        source: './audio/tw_offlow_4 {0da7d8b9-9064-4108-998b-801699d71790}.wav',
        // source: 'audio/tw_offhigh_4 {92e2f69f-c149-4fb0-a2b1-c6ee6cbb56a4}.wav',
        rpm: 0,
        volume: 0.2
    },
}

// https://www.motormatchup.com/catalog/BAC/Mono/2020/Base
// Real-world: 2.5L Inline-4 (Ford Duratec) redlines at 8,000 RPM
export const bac_mono: EngineConfiguration = {
    engine: {
        limiter: 8000,
        soft_limiter: 7900,
        limiter_ms: 0,
        inertia: 1.0,
    },
    drivetrain: {
        shiftTime: 50,
        damping: 16,
        gears: [3.4, 2.36, 1.85, 1.47, 1.24, 1.07], // 6-speed with wider spacing
        // compliance: 0.01
    },
    sounds: {
        ..._transmission,
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
        },
    }
}

export const ferr_458: EngineConfiguration = {
    engine: {
        limiter: 8900,
        soft_limiter: 8800,
        limiter_ms: 0,
        inertia: 0.8
    },
    drivetrain: {
        shiftTime: 10,
        damping: 6,
        gears: [3.6, 2.5, 1.9, 1.5, 1.2, 1.0], // 6-speed Ferrari-style
        // compliance: 0.02
    },
    sounds: {
        ..._transmission,
        // TEMPORARY: Using BAC Mono sounds as placeholder until Ferrari 458 audio files are added
        // TODO: Add proper Ferrari 458 audio files to ./audio/458/ folder
        on_high: {
            source: './audio/BAC_Mono_onhigh.wav',
            rpm: 7700,
            volume: 0.7
        },
        on_low: {
            source: './audio/BAC_Mono_onlow.wav',
            rpm: 5300,
            volume: 0.6
        },
        off_high: {
            source: './audio/BAC_Mono_offveryhigh.wav',
            rpm: 7900,
            volume: 0.7
        },
        off_low: {
            source: './audio/BAC_Mono_offlow.wav',
            rpm: 6900,
            volume: 0.6
        },
        limiter: {
            source: './audio/limiter.wav',
            volume: 0.6,
            rpm: 0,
        },
    }
}

export const procar: EngineConfiguration = {
    engine: {
        limiter: 9000,
        soft_limiter: 9000,
        limiter_ms: 150,
        // inertia: 1.5
    },
    drivetrain: {
        shiftTime: 100,
        damping: 12,
        gears: [3.5, 2.4, 1.8, 1.4, 1.15, 0.95], // 6-speed Procar-style
        // compliance: 0.05
    },
    sounds: {
        ..._transmission,
        // TEMPORARY: Using BAC Mono sounds as placeholder until Procar audio files are added
        // TODO: Add proper Procar racing audio files to ./audio/procar/ folder
        on_high: {
            source: './audio/BAC_Mono_onhigh.wav',
            rpm: 8000,
            volume: 0.75
        },
        on_low: {
            source: './audio/BAC_Mono_onlow.wav',
            rpm: 3200,
            volume: 0.65
        },
        off_high: {
            source: './audio/BAC_Mono_offveryhigh.wav',
            rpm: 8430,
            volume: 0.75
        },
        off_low: {
            source: './audio/BAC_Mono_offlow.wav',
            rpm: 3400,
            volume: 0.65
        },
        limiter: {
            source: './audio/limiter.wav',
            volume: 0.5,
            rpm: 8000,
        },
    }
}

// V Engine Configurations (defaults - can be overridden by INI files)
// V2: Small motorcycle/small car engines typically 6,500-7,000 RPM
export const v2: EngineConfiguration = {
    engine: {
        idle: 800,
        limiter: 6500,
        soft_limiter: 6400,
        limiter_ms: 0,
        inertia: 0.7,
        torque: 250,
        engine_braking: 150
    },
    drivetrain: {
        shiftTime: 70,
        damping: 18,
        compliance: 0.01,
        final_drive: 3.44,
        gears: [3.8, 2.6, 2.0, 1.6, 1.3, 1.1] // 6-speed V2 - wider spacing
    },
    sounds: {
        ..._transmission,
        on_high: {
            source: './audio/BAC_Mono_onhigh.wav',
            rpm: 3500,
            volume: 0.55
        },
        on_low: {
            source: './audio/BAC_Mono_onlow.wav',
            rpm: 1300,
            volume: 0.45
        },
        off_high: {
            source: './audio/BAC_Mono_offveryhigh.wav',
            rpm: 5500,
            volume: 0.55
        },
        off_low: {
            source: './audio/BAC_Mono_offlow.wav',
            rpm: 1000,
            volume: 0.45
        },
        limiter: {
            source: './audio/limiter.wav',
            volume: 0.35,
            rpm: 6500,
        },
    }
}

// V4: Small car engines typically 6,500-7,500 RPM
export const v4: EngineConfiguration = {
    engine: {
        idle: 900,
        limiter: 7000,
        soft_limiter: 6900,
        limiter_ms: 0,
        inertia: 0.8,
        torque: 300,
        engine_braking: 170
    },
    drivetrain: {
        shiftTime: 65,
        damping: 17,
        compliance: 0.01,
        final_drive: 3.44,
        gears: [3.7, 2.5, 1.95, 1.55, 1.25, 1.05] // 6-speed V4 - wider spacing
    },
    sounds: {
        ..._transmission,
        on_high: {
            source: './audio/BAC_Mono_onhigh.wav',
            rpm: 4000,
            volume: 0.6
        },
        on_low: {
            source: './audio/BAC_Mono_onlow.wav',
            rpm: 1500,
            volume: 0.5
        },
        off_high: {
            source: './audio/BAC_Mono_offveryhigh.wav',
            rpm: 6000,
            volume: 0.6
        },
        off_low: {
            source: './audio/BAC_Mono_offlow.wav',
            rpm: 1200,
            volume: 0.5
        },
        limiter: {
            source: './audio/limiter.wav',
            volume: 0.4,
            rpm: 6800,
        },
    }
}

// V6: Mid-size engines typically 7,000-7,500 RPM
export const v6: EngineConfiguration = {
    engine: {
        idle: 1000,
        limiter: 7200,
        soft_limiter: 7100,
        limiter_ms: 0,
        inertia: 0.9,
        torque: 350,
        engine_braking: 180
    },
    drivetrain: {
        shiftTime: 60,
        damping: 14,
        compliance: 0.01,
        final_drive: 3.44,
        gears: [3.6, 2.45, 1.9, 1.5, 1.22, 1.0] // 6-speed V6 - wider spacing
    },
    sounds: {
        ..._transmission,
        on_high: {
            source: './audio/BAC_Mono_onhigh.wav',
            rpm: 4500,
            volume: 0.65
        },
        on_low: {
            source: './audio/BAC_Mono_onlow.wav',
            rpm: 1800,
            volume: 0.55
        },
        off_high: {
            source: './audio/BAC_Mono_offveryhigh.wav',
            rpm: 6500,
            volume: 0.65
        },
        off_low: {
            source: './audio/BAC_Mono_offlow.wav',
            rpm: 1400,
            volume: 0.55
        },
        limiter: {
            source: './audio/limiter.wav',
            volume: 0.45,
            rpm: 7200,
        },
    }
}

// V8: High-performance V8s typically 8,000-9,000 RPM (Ferrari 458: 9,000 RPM)
export const v8: EngineConfiguration = {
    engine: {
        idle: 1000,
        limiter: 8500,
        soft_limiter: 8400,
        limiter_ms: 0,
        inertia: 1.0,
        torque: 400,
        engine_braking: 200
    },
    drivetrain: {
        shiftTime: 50,
        damping: 16,
        compliance: 0.01,
        final_drive: 3.44,
        gears: [3.5, 2.4, 1.85, 1.45, 1.18, 0.95] // 6-speed V8 - wider spacing
    },
    sounds: {
        ..._transmission,
        on_high: {
            source: './audio/BAC_Mono_onhigh.wav',
            rpm: 5000,
            volume: 0.7
        },
        on_low: {
            source: './audio/BAC_Mono_onlow.wav',
            rpm: 2000,
            volume: 0.6
        },
        off_high: {
            source: './audio/BAC_Mono_offveryhigh.wav',
            rpm: 7000,
            volume: 0.7
        },
        off_low: {
            source: './audio/BAC_Mono_offlow.wav',
            rpm: 1500,
            volume: 0.6
        },
        limiter: {
            source: './audio/limiter.wav',
            volume: 0.5,
            rpm: 8500,
        },
    }
}

// V10: High-performance V10s typically 8,000-8,500 RPM
export const v10: EngineConfiguration = {
    engine: {
        idle: 1000,
        limiter: 8200,
        soft_limiter: 8100,
        limiter_ms: 0,
        inertia: 1.1,
        torque: 450,
        engine_braking: 220
    },
    drivetrain: {
        shiftTime: 45,
        damping: 15,
        compliance: 0.01,
        final_drive: 3.44,
        gears: [3.4, 2.35, 1.8, 1.4, 1.15, 0.92] // 6-speed V10 - wider spacing
    },
    sounds: {
        ..._transmission,
        on_high: {
            source: './audio/BAC_Mono_onhigh.wav',
            rpm: 5500,
            volume: 0.75
        },
        on_low: {
            source: './audio/BAC_Mono_onlow.wav',
            rpm: 2200,
            volume: 0.65
        },
        off_high: {
            source: './audio/BAC_Mono_offveryhigh.wav',
            rpm: 7500,
            volume: 0.75
        },
        off_low: {
            source: './audio/BAC_Mono_offlow.wav',
            rpm: 1600,
            volume: 0.65
        },
        limiter: {
            source: './audio/limiter.wav',
            volume: 0.55,
            rpm: 8000,
        },
    }
}

// V12: High-performance V12s typically 8,000-9,500 RPM (Ferrari V12s: 8,200-9,500 RPM)
export const v12: EngineConfiguration = {
    engine: {
        idle: 1000,
        limiter: 8800,
        soft_limiter: 8700,
        limiter_ms: 0,
        inertia: 1.2,
        torque: 500,
        engine_braking: 250
    },
    drivetrain: {
        shiftTime: 40,
        damping: 14,
        compliance: 0.01,
        final_drive: 3.44,
        gears: [3.3, 2.3, 1.75, 1.35, 1.12, 0.9] // 6-speed V12 - wider spacing
    },
    sounds: {
        ..._transmission,
        on_high: {
            source: './audio/BAC_Mono_onhigh.wav',
            rpm: 6000,
            volume: 0.8
        },
        on_low: {
            source: './audio/BAC_Mono_onlow.wav',
            rpm: 2400,
            volume: 0.7
        },
        off_high: {
            source: './audio/BAC_Mono_offveryhigh.wav',
            rpm: 7800,
            volume: 0.8
        },
        off_low: {
            source: './audio/BAC_Mono_offlow.wav',
            rpm: 1700,
            volume: 0.7
        },
        limiter: {
            source: './audio/limiter.wav',
            volume: 0.6,
            rpm: 7500,
        },
    }
}

// V16: Very large engines typically 6,500-7,500 RPM (Bugatti W16: ~6,700 RPM)
export const v16: EngineConfiguration = {
    engine: {
        idle: 1100,
        limiter: 6800,
        soft_limiter: 6700,
        limiter_ms: 0,
        inertia: 1.3,
        torque: 550,
        engine_braking: 280
    },
    drivetrain: {
        shiftTime: 35,
        damping: 13,
        compliance: 0.01,
        final_drive: 3.44,
        gears: [3.2, 2.25, 1.7, 1.3, 1.1, 0.88] // 6-speed V16 - wider spacing
    },
    sounds: {
        ..._transmission,
        on_high: {
            source: './audio/BAC_Mono_onhigh.wav',
            rpm: 6500,
            volume: 0.85
        },
        on_low: {
            source: './audio/BAC_Mono_onlow.wav',
            rpm: 2600,
            volume: 0.75
        },
        off_high: {
            source: './audio/BAC_Mono_offveryhigh.wav',
            rpm: 7200,
            volume: 0.85
        },
        off_low: {
            source: './audio/BAC_Mono_offlow.wav',
            rpm: 1800,
            volume: 0.75
        },
        limiter: {
            source: './audio/limiter.wav',
            volume: 0.65,
            rpm: 7000,
        },
    }
}

// export default {
//     bacSounds: bacSounds,
//     procarSounds: procarSounds,
//     sounds458: sounds458
// }

/**
 * End of Torque.JS Configuration Module
 * Maker's Mark: TQJS-V3-CONFIG-END-2025-IWI
 * © 2025 Iron Will Interactive. All rights reserved.
 */
