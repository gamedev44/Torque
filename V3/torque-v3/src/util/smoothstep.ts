/**
 * Torque.JS: Utility - Smoothstep Functions
 * 
 * @license Semi-Open Source with Attribution
 * Copyright (c) 2025 Iron Will Interactive
 * Maker's Mark: TQJS-V3-UTIL-SMOOTHSTEP-2025-IWI
 */

// From GLSL shader language
export function smoothstep(min: number, max: number, value: number) {
    const x = Math.max(0, Math.min(1, (value-min)/(max-min)));
    return x*x*(3 - 2*x);
}
  
export function smoothstep2(value: number, k = 2.0) {
    return 1 - smoothstep(0, 1, Math.abs(k*value-1))
}

/**
 * End of Torque.JS Smoothstep Utility
 * © 2025 Iron Will Interactive. All rights reserved.
 */
