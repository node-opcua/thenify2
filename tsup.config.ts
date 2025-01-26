import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'], // Adjust the entry point as needed
    format: ['cjs', 'esm'], // Specify the output formats
    dts: true, // Generate type definitions
    minify: true, // Minify the output
    sourcemap: true, // Generate source maps
    outDir: 'dist', // Specify the output directory
});
