import { defineBuildConfig } from "unbuild";

export default defineBuildConfig([
  // ESM + CJS + d.ts
  {
    entries: ["./src/index"],
    clean: true,
    declaration: "compatible",
    outDir: "dist",
    rollup: {
      emitCJS: true,
      cjsBridge: true,
      inlineDependencies: true,
      output: {
        exports: "auto",
      },
    },
    parallel: false,
  },
  // UMD build
  {
    entries: [{ builder: "rollup", input: "./src/index.ts" }],
    clean: false,
    declaration: false,
    outDir: "dist",
    rollup: {
      emitCJS: false,
      inlineDependencies: true,
      output: {
        format: "umd",
        name: "TSLevenshtein",
        dir: "dist",
        entryFileNames: "index.umd.js",
        exports: "auto",
        sourcemap: true,
      },
    },
    parallel: false,
  },
  // IIFE build (global TSLevenshtein)
  {
    entries: [{ builder: "rollup", input: "./src/index.ts" }],
    clean: false,
    declaration: false,
    outDir: "dist",
    rollup: {
      emitCJS: false,
      inlineDependencies: true,
      output: {
        format: "iife",
        name: "TSLevenshtein",
        dir: "dist",
        entryFileNames: "index.global.js",
        exports: "auto",
        sourcemap: true,
      },
    },
    parallel: false,
  },
]);
