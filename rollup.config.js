import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import external from "rollup-plugin-peer-deps-external";
import cleanDist from "./clean.js";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/cjs/index.js",
      format: "cjs",
    },
    {
      file: "dist/esm/index.js",
      format: "es",
    },
  ],
  plugins: [cleanDist(), external(), resolve(), commonjs(), typescript()],
  external: ["react", "react-dom"],
};
