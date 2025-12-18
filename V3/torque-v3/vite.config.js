import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        minify: true,
        target: 'esnext'
    },
    publicDir: 'public',
    server: {
        fs: {
            // Allow serving files from V3 root and repo root (for website preview)
            allow: ['..', '../../', '../../website']
        }
    }
});
