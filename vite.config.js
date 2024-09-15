export default {
  root: "src/",
  publicDir: "../static/",
  base: "./",
  server: {
    host: true, // Open to local network and display URL
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env), // Open if it's not a CodeSandbox
  },
  build: {
    outDir: "../dist", // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
    chunkSizeWarningLimit: 1000, // Increase the chunk size warning limit to 1000 kB
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split dependencies into separate chunks
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
};
