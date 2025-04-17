import { defineConfig } from "vite"

const tauriConfig = () =>
  defineConfig({
    mode: "production",
    build: {
      outDir: "dist-tauri",
      sourcemap: false,
      minify: true,
    },
  })

export default tauriConfig
