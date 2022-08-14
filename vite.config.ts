import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from "vite";
import pkg from "./package.json";

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: "util",
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["cjs", "es"],
      fileName: "index",
    },
    sourcemap: mode === "production",
    outDir: "dist",
    rollupOptions: {
      external: [
        "@netless/fastboard",
        "@netless/window-manager",
        "white-web-sdk",
        "vue3-apexcharts"
      ],
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
        exports: "named",
      },
    },
    minify: mode === "production",
  },
  clearScreen: false,
  server: {
    open: true,
    port: 4896,
  },
}));
