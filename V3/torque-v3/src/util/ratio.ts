/**
 * Torque.JS: Utility - Ratio Function
 * 
 * @license Semi-Open Source with Attribution
 * Copyright (c) 2025 Iron Will Interactive
 * Maker's Mark: TQJS-V3-UTIL-RATIO-2025-IWI
 */

import { clamp } from "./clamp";

export function ratio(value: number, min: number, max: number) {
    return clamp((value - min) / (max - min), 0, 1);
}

/**
 * End of Torque.JS Ratio Utility
 * © 2025 Iron Will Interactive. All rights reserved.
 */
