import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/index"],
  outDir: "dist",
  declaration: false,
  sourcemap: false,
  rollup: {
    emitCJS: true,
  },
});
