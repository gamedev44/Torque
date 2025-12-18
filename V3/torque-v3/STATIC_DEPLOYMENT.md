# Static Deployment Guide for Torque.JS V3

## Overview

Torque.JS V3 can be deployed as a fully static site that works offline without any server. This makes it perfect for GitHub Pages, Netlify, Vercel, or any static hosting service.

## Building for Static Deployment

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **The `dist/` folder** now contains all files needed for static hosting.

## Deployment Options

### Option 1: Direct dist/ folder (Recommended)

Simply deploy the contents of the `dist/` folder to your hosting service:

- **GitHub Pages**: Set the source to the `dist/` folder
- **Netlify**: Point to the `dist/` folder
- **Vercel**: Point to the `dist/` folder

### Option 2: Using loader.html

If you want a simple entry point, you can use `loader.html` which redirects to the built app:

1. Copy `loader.html` to your root deployment directory
2. Copy the entire `dist/` folder to your deployment directory
3. Update `loader.html` to point to the correct path (e.g., `./dist/index.html`)

## Path Configuration

All paths in V3 have been updated to use relative paths (`./audio/`, `./assets/`, `./presets/`) instead of absolute paths. This ensures the app works correctly regardless of the deployment path.

## GitHub Pages Setup

1. Build the project: `npm run build`
2. In your GitHub repository settings:
   - Go to Pages
   - Set source to "Deploy from a branch"
   - Select branch (usually `main` or `gh-pages`)
   - Set folder to `/dist`
   - Save

3. Your app will be available at: `https://yourusername.github.io/repository-name/`

## Testing Locally

After building, you can test the static build locally:

```bash
# Using Python
cd dist
python -m http.server 8000

# Using Node.js http-server
npx http-server dist -p 8000

# Using PHP
cd dist
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Important Notes

- All assets (audio, videos, images) are included in the `dist/` folder
- Presets (INI files) are copied to `dist/presets/`
- The app works completely offline once built
- No server-side processing is required
- All paths are relative, so it works in subdirectories

## Troubleshooting

**Issue**: Assets not loading
- **Solution**: Make sure all paths use `./` prefix (relative paths)

**Issue**: Presets not found
- **Solution**: Ensure `presets/` folder is in `public/` directory (it gets copied to `dist/` automatically)

**Issue**: Video not playing
- **Solution**: Check that video files are in `public/assets/Engines/V/` directory

