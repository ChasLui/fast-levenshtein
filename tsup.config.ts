import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "ts-levenshtein": "src/index.ts",
  },
  format: ["esm", "iife"],
  globalName: "TSLevenshtein",
  outDir: "dist",
  sourcemap: true,
  minify: true,
  dts: true,
  clean: true,
  target: "es2018",
  splitting: false,
  outExtension({ format }) {
    if (format === "esm") return { js: ".js" };
    if (format === "iife") return { js: ".global.js" };
    return { js: ".js" };
  },
});
