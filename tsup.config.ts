import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "ts-levenshtein": "src/index.ts",
  },
  format: ["esm", "cjs", "iife"],
  globalName: "FastLevenshtein",
  outDir: "dist",
  sourcemap: true,
  minify: true,
  dts: true,
  clean: true,
  target: "es2018",
  splitting: false,
  outExtension({ format }) {
    if (format === "esm") return { js: ".mjs" };
    if (format === "cjs") return { js: ".cjs" };
    if (format === "iife") return { js: ".global.js" };
    return { js: ".js" };
  },
});
