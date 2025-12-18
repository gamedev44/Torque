# Morning To‑Do (ERR_ABORTED fixes)

- [ ] Remove hardcoded `http://localhost:5175` from fetch/asset URLs; use root‑relative paths (e.g., `/presets/...`, `/assets/...`) or `import.meta.env.BASE_URL`.
- [ ] Serve presets correctly: move/copy INI files to `public/presets/` or reference via `new URL('presets/bac_mono.ini', import.meta.url).href`.
- [ ] Update `loadINIConfig` to fetch with `/presets/bac_mono.ini` or `${import.meta.env.BASE_URL}presets/bac_mono.ini` and handle 404s gracefully.
- [ ] Ensure engine video files exist under `assets/Engines/V/` and filenames exactly match (case‑sensitive): `V2.mp4`, `V4.mp4`, `V6.mp4`, `V8.mp4`, `V10.mp4`, `V12.mp4`, `V16.mp4`.
- [ ] Make videos publicly reachable: copy to `public/assets/Engines/V/` and reference `/assets/Engines/V/*.mp4`, or use `new URL('../assets/Engines/V/V8.mp4', import.meta.url).href`.
- [ ] Fix `ENGINE_VIDEO_PATH` and `getVideoPathForEngine` to return correct URLs (root‑relative or `new URL(...).href`), add a fallback when a file is missing to avoid abort logs.
- [ ] Audit for case mismatches (e.g., `v12.mp4` vs `V12.mp4`) in code and files; align consistently.
- [ ] Run dev and verify: INI loads with 200, all engine `.mp4` return 200; check console/network tabs for remaining `ERR_ABORTED` and fix any residual path issues.

