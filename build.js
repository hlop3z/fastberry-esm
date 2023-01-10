const MINIFY = true;
const FILE = "dist/lib.mjs";

const BANNER = `
/*! 
* Fastberry @ Copyright 2023
* MIT @ License 
*/
/* eslint-disable */

import { reactive } from "vue";
`;

const Watcher = {
  onRebuild(error, result) {
    if (error) console.error("watch build failed:", error);
    else console.log("watch build succeeded:");
  },
};

require("esbuild")
  .build({
    entryPoints: ["app.js"],
    platform: "node",
    target: ["node10.4"],
    format: "esm",
    charset: "utf8",
    watch: Watcher,
    outfile: FILE,
    minify: MINIFY,
    treeShaking: true,
    bundle: true,
    banner: {
      js: BANNER.trim(),
    },
  })
  .then((result) => {
    console.log("watching...");
  });
